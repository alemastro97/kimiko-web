import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

const PAYPAL_API = process.env.PAYPAL_SANDBOX !== 'false'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com'

// dev only — in prod same origin, no CORS needed
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
}
app.use(express.json())

// ─── PayPal helpers ───────────────────────────────────────────────────────────

async function getPayPalToken() {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('PayPal auth failed')
  return data.access_token
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Create PayPal order
app.post('/api/orders', async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount || isNaN(amount)) return res.status(400).json({ error: 'Invalid amount' })

    const token = await getPayPalToken()
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: Number(amount).toFixed(2) },
          description: 'Chibi Atelier — Commission Deposit (50%)',
        }],
      }),
    })
    const order = await response.json()
    res.json(order)
  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Capture payment + send email
app.post('/api/orders/:id/capture', async (req, res) => {
  try {
    const { id } = req.params
    const { formData } = req.body

    const token = await getPayPalToken()
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${id}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const capture = await response.json()

    if (capture.status === 'COMPLETED') {
      const amount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
      await sendEmail(formData, id, amount)
    }

    res.json(capture)
  } catch (err) {
    console.error('Capture error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── Nodemailer ──────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

function buildEmailHTML(f, orderId, amount) {
  const rows = [
    ['Name', f.name],
    ['Email', f.email],
    ['Instagram', f.instagram || '—'],
    ['Twitter', f.twitter || '—'],
    ['Discord', f.discord || '—'],
    ['Commission Type', f.chibiType],
    ['Style', f.style || '—'],
    ['Character Name', f.characterName || '—'],
    ['Gender', f.gender || '—'],
    ['Hair', `${f.hairColor} / ${f.hairStyle}`],
    ['Eyes', f.eyeColor || '—'],
    ['Skin', f.skinTone || '—'],
    ['Expression', f.expression],
    ['Pose', f.pose || '—'],
    ['Outfit Style', f.outfitStyle],
    ['Outfit Details', f.outfit || '—'],
    ['Accessories', f.accessories || '—'],
    ['Pokémon', f.pokemonStyle ? f.pokemonDetails : 'No'],
    ['Pet', f.pet || '—'],
    ['Background', f.background],
    ['Extra Characters', f.extraCharacters],
    ['References', f.referenceLinks || '—'],
    ['Notes', f.additionalNotes || '—'],
    ['Deadline', f.deadline || '—'],
    ['Budget', f.budget || '—'],
    ['Usage', f.usage],
  ]

  const tableRows = rows.map(([k, v]) =>
    `<tr><td style="padding:6px 12px;font-weight:600;color:#e91e8c;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#333">${v}</td></tr>`
  ).join('')

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#ff85a1,#ffd700);padding:24px;border-radius:16px 16px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px;text-shadow:-1px -1px 0 #e91e8c,1px 1px 0 #e91e8c">
          🌸 New Commission Request!
        </h1>
        <p style="color:white;margin:8px 0 0;font-size:14px">PayPal Order: ${orderId}</p>
      </div>

      <div style="background:#fff5f8;padding:16px 24px;border-left:4px solid #ffd700;margin:0">
        <p style="margin:0;font-size:18px;font-weight:700;color:#333">
          💰 Deposit paid: <span style="color:#e91e8c">$${amount} USD</span>
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;background:white">
        ${tableRows}
      </table>

      <div style="background:#ff85a1;padding:16px;text-align:center;border-radius:0 0 16px 16px">
        <p style="color:white;margin:0;font-size:12px">Chibi Atelier — made with love ✨</p>
      </div>
    </div>
  `
}

async function sendEmail(formData, orderId, amount) {
  await transporter.sendMail({
    from: `"Chibi Atelier" <${process.env.GMAIL_USER}>`,
    to: process.env.ARTIST_EMAIL || process.env.GMAIL_USER,
    subject: `🌸 New Commission — ${formData.name} ($${amount} deposit paid)`,
    html: buildEmailHTML(formData, orderId, amount),
  })
}

// ─── Serve frontend in production ────────────────────────────────────────────

const distPath = join(__dirname, '../dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'))
  })
}

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`PayPal: ${PAYPAL_API}`)
})
