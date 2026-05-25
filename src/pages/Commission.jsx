import { useState } from 'react'
import { Mail, Palette, User, Shirt, Zap, Layers, Link2, Calendar, ArrowLeft, Send, CreditCard, Heart, RefreshCw, Gift } from 'lucide-react'

const ARTIST_EMAIL   = import.meta.env.VITE_ARTIST_EMAIL   || 'your@email.com'
const PAYPAL_ME_USER = import.meta.env.VITE_PAYPAL_ME_USER || 'yourpaypalme'

const initialForm = {
  name: '', email: '', instagram: '', twitter: '', discord: '',
  chibiType: 'fullbody', style: '', characterName: '', gender: '',
  hairColor: '', hairStyle: '', eyeColor: '', skinTone: '',
  outfit: '', outfitStyle: 'casual', accessories: '', pose: '',
  expression: 'happy', background: 'transparent', pet: '',
  pokemonStyle: false, pokemonDetails: '', extraCharacters: '0',
  referenceLinks: '', deadline: '', budget: '', additionalNotes: '',
  usage: 'personal', agreedTerms: false,
}

const BASE_PRICES = { fullbody: 30 }

function calcTotal(f) {
  let t = BASE_PRICES[f.chibiType] || 30
  if (f.pokemonStyle) t += 8
  if (f.extraCharacters === '1') t += 10
  if (f.extraCharacters === '2') t += 20
  if (f.background === 'scenic') t += 15
  return t
}

function buildMailtoBody(f, total, deposit) {
  const lines = [
    `=== COMMISSION REQUEST ===`,
    ``,
    `👤 CONTACT`,
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    f.instagram ? `Instagram: ${f.instagram}` : null,
    f.twitter   ? `Twitter: ${f.twitter}`     : null,
    f.discord   ? `Discord: ${f.discord}`     : null,
    ``,
    `🎨 COMMISSION`,
    `Type: ${f.chibiType} ($${BASE_PRICES[f.chibiType]})`,
    f.style ? `Style: ${f.style}` : null,
    ``,
    `👤 CHARACTER`,
    f.characterName ? `Name: ${f.characterName}` : null,
    f.gender        ? `Gender: ${f.gender}`       : null,
    `Hair: ${f.hairColor} / ${f.hairStyle}`,
    `Eyes: ${f.eyeColor}`,
    `Skin: ${f.skinTone}`,
    `Expression: ${f.expression}`,
    f.pose ? `Pose: ${f.pose}` : null,
    ``,
    `👗 OUTFIT`,
    `Style: ${f.outfitStyle}`,
    f.outfit      ? `Details: ${f.outfit}`         : null,
    f.accessories ? `Accessories: ${f.accessories}` : null,
    ``,
    `⚡ EXTRAS`,
    `Pokémon/creature: ${f.pokemonStyle ? f.pokemonDetails : 'No'}`,
    f.pet ? `Pet: ${f.pet}` : null,
    `Background: ${f.background}`,
    `Extra characters: ${f.extraCharacters}`,
    ``,
    `🔗 REFERENCES`,
    f.referenceLinks    ? f.referenceLinks          : '—',
    f.additionalNotes   ? `Notes: ${f.additionalNotes}` : null,
    ``,
    `📅 PROJECT`,
    f.deadline ? `Deadline: ${f.deadline}` : null,
    f.budget   ? `Budget: ${f.budget}`     : null,
    `Usage: ${f.usage}`,
    ``,
    `💰 PRICING`,
    `Total: $${total}`,
    `Deposit (50%): $${deposit}`,
  ].filter(Boolean).join('\n')

  return encodeURIComponent(lines)
}

function Section({ Icon, title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-sakura-100">
        <Icon className="w-5 h-5 text-sakura-400" strokeWidth={1.5} />
        <h3 className="text-lg font-extrabold text-sakura-500">{title}</h3>
      </div>
      {children}
    </div>
  )
}

const inputCls  = 'w-full p-3 border border-sakura-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-300 text-sakura-700 placeholder:text-sakura-300 transition'
const selectCls = `${inputCls} cursor-pointer`

export default function Commission() {
  const [formData, setFormData] = useState(initialForm)
  const [step, setStep]         = useState('form') // 'form' | 'payment' | 'done'

  const total   = calcTotal(formData)
  const deposit = +(total * 0.5).toFixed(2)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`🌸 Commission Request — ${formData.name}`)
    const body    = buildMailtoBody(formData, total, deposit)
    window.open(`mailto:${ARTIST_EMAIL}?subject=${subject}&body=${body}`)
    setStep('done')
  }

  const handlePayPal = () => {
    window.open(`https://paypal.me/${PAYPAL_ME_USER}/${deposit}`, '_blank')
  }

  return (
    <section className="snap-start min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-2 text-outlined">
          Commission Me
        </h2>
        <p className="text-center mb-10 text-sakura-400 font-medium text-lg">
          Fill in the details so I can create the perfect chibi for you!
        </p>

        {/* ── DONE ── */}
        {step === 'done' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gold-300 p-10 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-sakura-400 animate-bounce-slow" strokeWidth={1} />
            <h3 className="text-3xl font-extrabold text-sakura-500 mb-3 text-outlined">
              Thank you!
            </h3>
            <p className="text-sakura-600 text-lg mb-2">
              Request sent! I'll get back to you within 48 hours
            </p>
            <p className="text-sakura-400 text-sm mb-8">
              Remember to pay the deposit of <span className="text-gold-600 font-bold">${deposit}</span> via PayPal to confirm the slot.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handlePayPal} className="btn-kawaii inline-flex items-center gap-2">
                <CreditCard className="w-4 h-4" strokeWidth={2} /> Pay ${deposit} via PayPal
              </button>
              <button onClick={() => { setFormData(initialForm); setStep('form') }} className="btn-kawaii-outline inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" strokeWidth={2} /> Submit another
              </button>
            </div>
          </div>
        )}

        {/* ── PAYMENT SUMMARY ── */}
        {step === 'payment' && (
          <div className="bg-white rounded-3xl shadow-xl border border-sakura-100 p-8 space-y-6">
            <button onClick={() => setStep('form')} className="text-sakura-400 text-sm hover:text-sakura-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Back to form
            </button>

            <div className="bg-sakura-50 rounded-2xl p-5 border border-sakura-200">
              <h3 className="font-extrabold text-sakura-500 text-lg mb-3">Order Summary</h3>
              <div className="space-y-1 text-sm text-sakura-600">
                <div className="flex justify-between">
                  <span className="capitalize">{formData.chibiType}</span>
                  <span>${BASE_PRICES[formData.chibiType]}</span>
                </div>
                {formData.pokemonStyle && (
                  <div className="flex justify-between"><span>Pokémon/creature</span><span>+$8</span></div>
                )}
                {formData.extraCharacters !== '0' && (
                  <div className="flex justify-between">
                    <span>Extra character(s) ×{formData.extraCharacters}</span>
                    <span>+${Number(formData.extraCharacters) * 10}</span>
                  </div>
                )}
                {formData.background === 'scenic' && (
                  <div className="flex justify-between"><span>Scenic background</span><span>+$15</span></div>
                )}
                <div className="border-t border-sakura-200 mt-2 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span>${total}</span>
                </div>
                <div className="flex justify-between text-gold-600 font-extrabold text-base">
                  <span>Deposit due (50%)</span><span>${deposit}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sakura-500 text-sm font-medium">
              Step 1 — send the request via email, then pay the deposit via PayPal
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={handleSendEmail} className="btn-kawaii py-4 text-base flex flex-col items-center gap-1">
                <span className="flex items-center gap-2"><Send className="w-4 h-4" strokeWidth={2} /> Send Request</span>
                <span className="text-xs opacity-80">Opens your email app</span>
              </button>
              <button onClick={handlePayPal} className="btn-kawaii-outline py-4 text-base flex flex-col items-center gap-1">
                <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" strokeWidth={2} /> Pay ${deposit} Deposit</span>
                <span className="text-xs opacity-70">Via PayPal.me</span>
              </button>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl shadow-xl border border-sakura-100 p-8 space-y-8">

            <Section Icon={Mail} title="Contact Information">
              <div className="grid md:grid-cols-2 gap-3">
                <input name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="Full Name *" required />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="Email *" required />
                <input name="instagram" value={formData.instagram} onChange={handleChange} className={inputCls} placeholder="Instagram (@username)" />
                <input name="twitter" value={formData.twitter} onChange={handleChange} className={inputCls} placeholder="Twitter/X (optional)" />
                <input name="discord" value={formData.discord} onChange={handleChange} className={`${inputCls} md:col-span-2`} placeholder="Discord (optional)" />
              </div>
            </Section>

            <Section Icon={Palette} title="Commission Type">
              <div className="grid md:grid-cols-2 gap-3">
                <div className={`${inputCls} font-semibold text-sakura-600`}>Full Body — $30</div>
                <select name="style" value={formData.style} onChange={handleChange} className={selectCls}>
                  <option value="">Choose a style...</option>
                  <option value="soft">Soft & Pastel</option>
                  <option value="bold">Bold & Colorful</option>
                  <option value="lineless">Lineless</option>
                  <option value="anime">Anime-inspired</option>
                </select>
              </div>
            </Section>

            <Section Icon={User} title="Character Details">
              <div className="grid md:grid-cols-2 gap-3">
                <input name="characterName" value={formData.characterName} onChange={handleChange} className={inputCls} placeholder="Character Name" />
                <input name="gender" value={formData.gender} onChange={handleChange} className={inputCls} placeholder="Gender / Pronouns" />
                <input name="hairColor" value={formData.hairColor} onChange={handleChange} className={inputCls} placeholder="Hair Color" />
                <input name="hairStyle" value={formData.hairStyle} onChange={handleChange} className={inputCls} placeholder="Hair Style" />
                <input name="eyeColor" value={formData.eyeColor} onChange={handleChange} className={inputCls} placeholder="Eye Color" />
                <input name="skinTone" value={formData.skinTone} onChange={handleChange} className={inputCls} placeholder="Skin Tone" />
                <select name="expression" value={formData.expression} onChange={handleChange} className={selectCls}>
                  <option value="happy">Happy 😊</option>
                  <option value="shy">Shy 😳</option>
                  <option value="excited">Excited ✨</option>
                  <option value="cool">Cool 😎</option>
                  <option value="sleepy">Sleepy 😴</option>
                </select>
                <input name="pose" value={formData.pose} onChange={handleChange} className={inputCls} placeholder="Pose idea" />
              </div>
            </Section>

            <Section Icon={Shirt} title="Outfit & Accessories">
              <div className="grid md:grid-cols-2 gap-3">
                <select name="outfitStyle" value={formData.outfitStyle} onChange={handleChange} className={selectCls}>
                  <option value="casual">Casual</option>
                  <option value="lolita">Lolita</option>
                  <option value="kimono">Kimono</option>
                  <option value="school">School Uniform</option>
                  <option value="streetwear">Streetwear</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="gothic">Gothic</option>
                  <option value="cosplay">Cosplay</option>
                </select>
                <input name="outfit" value={formData.outfit} onChange={handleChange} className={inputCls} placeholder="Outfit details / colors" />
                <textarea name="accessories" value={formData.accessories} onChange={handleChange} className={`${inputCls} md:col-span-2 resize-none`} placeholder="Accessories (jewelry, hat, glasses...)" rows="2" />
              </div>
            </Section>

            <Section Icon={Zap} title="Pokémon / Pet">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="pokemonStyle" checked={formData.pokemonStyle} onChange={handleChange} className="w-5 h-5 accent-pink-500 rounded" />
                <span className="text-sakura-600 font-medium">
                  Include a Pokémon or fantasy creature
                  <span className="ml-2 text-gold-600 font-bold">(+$8)</span>
                </span>
              </label>
              {formData.pokemonStyle && (
                <textarea name="pokemonDetails" value={formData.pokemonDetails} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Which Pokémon/creature?" rows="2" />
              )}
              <input name="pet" value={formData.pet} onChange={handleChange} className={inputCls} placeholder="Other pet/companion" />
            </Section>

            <Section Icon={Layers} title="Background & Extras">
              <div className="grid md:grid-cols-2 gap-3">
                <select name="background" value={formData.background} onChange={handleChange} className={selectCls}>
                  <option value="transparent">Transparent</option>
                  <option value="solid">Solid Color</option>
                  <option value="pattern">Simple Pattern</option>
                  <option value="scenic">Scenic (+$15)</option>
                </select>
                <select name="extraCharacters" value={formData.extraCharacters} onChange={handleChange} className={selectCls}>
                  <option value="0">No extra characters</option>
                  <option value="1">+1 character (+$10)</option>
                  <option value="2">+2 characters (+$20)</option>
                </select>
              </div>
            </Section>

            <Section Icon={Link2} title="References & Notes">
              <textarea name="referenceLinks" value={formData.referenceLinks} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Reference links (Pinterest, image URLs...)" rows="3" />
              <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Anything else I should know?" rows="3" />
            </Section>

            <Section Icon={Calendar} title="Project Info">
              <div className="grid md:grid-cols-2 gap-3">
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className={inputCls} />
                <select name="budget" value={formData.budget} onChange={handleChange} className={selectCls}>
                  <option value="">Budget...</option>
                  <option value="under20">Under $20</option>
                  <option value="20-40">$20 - $40</option>
                  <option value="40-70">$40 - $70</option>
                  <option value="70-100">$70 - $100</option>
                  <option value="100+">$100+</option>
                </select>
                <select name="usage" value={formData.usage} onChange={handleChange} className={`${selectCls} md:col-span-2`}>
                  <option value="personal">Personal use</option>
                  <option value="social">Social media</option>
                  <option value="print">Personal print</option>
                  <option value="commercial">Commercial use</option>
                </select>
              </div>
            </Section>

            {/* Price preview */}
            <div className="bg-gold-300/20 border border-gold-400/40 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sakura-600 font-medium text-sm">Total estimate</p>
                <p className="text-2xl font-extrabold text-sakura-500">${total}</p>
              </div>
              <div className="text-right">
                <p className="text-sakura-600 font-medium text-sm">Deposit due (50%)</p>
                <p className="text-2xl font-extrabold text-gold-600">${deposit}</p>
              </div>
            </div>

            <div className="bg-sakura-50 border border-sakura-200 p-5 rounded-2xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="agreedTerms" checked={formData.agreedTerms} onChange={handleChange} className="w-5 h-5 mt-0.5 accent-pink-500" required />
                <span className="text-sm text-sakura-600">
                  I agree to the Terms: 50% upfront payment via PayPal, no full refunds once sketch is approved, artist retains portfolio rights. *
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!formData.agreedTerms}
              className="w-full btn-kawaii py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" strokeWidth={2} /> Review & Pay
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
