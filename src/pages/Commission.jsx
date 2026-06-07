import { useState, useRef } from 'react'
import {
  Mail, Palette, Image, Zap, Shirt, ArrowLeft, Send,
  CreditCard, Heart, RefreshCw, Gift, Plus, Trash2, Link2,
  Star, Sparkles
} from 'lucide-react'

const ARTIST_EMAIL   = import.meta.env.VITE_ARTIST_EMAIL   || 'your@email.com'
const PAYPAL_ME_USER = import.meta.env.VITE_PAYPAL_ME_USER || 'yourpaypalme'

const PACKAGES = [
  {
    key: 'chibi_pokemon',
    name: 'Chibi + Pokémon',
    price: 30,
    Icon: Zap,
    description: 'Character + 1 Pokémon, simple background',
    gradient: 'from-sakura-100 to-white',
    border: 'border-sakura-200',
  },
  {
    key: 'full_illustration',
    name: 'Full Illustration',
    price: 50,
    Icon: Sparkles,
    description: 'Character + pose + Pokémon + full background',
    gradient: 'from-gold-300/30 to-white',
    border: 'border-gold-400',
    featured: true,
  },
  {
    key: 'business_card',
    name: 'Business Card',
    price: 15,
    Icon: CreditCard,
    description: 'Custom card design, no Pokémon',
    gradient: 'from-sakura-200/40 to-white',
    border: 'border-sakura-200',
  },
]

const initialForm = {
  firstName: '', lastName: '', email: '', instagram: '',
  commissionType: 'chibi_pokemon',
  referenceFile: null,
  referenceLink: '',
  pokemons: [''],
  outfit: '',
  notes: '',
  agreedTerms: false,
}

function calcTotal(f) {
  const base = PACKAGES.find(p => p.key === f.commissionType)?.price ?? 30
  const extraPokemons = f.commissionType !== 'business_card'
    ? Math.max(0, f.pokemons.filter(p => p.trim()).length - 1)
    : 0
  return base + extraPokemons * 10
}

function buildMailtoBody(f, total, deposit) {
  const pkg = PACKAGES.find(p => p.key === f.commissionType)
  const lines = [
    `=== COMMISSION REQUEST ===`,
    ``,
    `👤 CONTACT`,
    `Name: ${f.firstName} ${f.lastName}`,
    `Email: ${f.email}`,
    f.instagram ? `Instagram: ${f.instagram}` : null,
    ``,
    `🎨 COMMISSION`,
    `Type: ${pkg?.name} ($${pkg?.price})`,
    ``,
    f.commissionType !== 'business_card' && f.pokemons.filter(p => p.trim()).length > 0
      ? `⚡ POKÉMON\n${f.pokemons.filter(p => p.trim()).map((p, i) => `${i + 1}. ${p}${i > 0 ? ' (+$10)' : ' (included)'}`).join('\n')}`
      : null,
    ``,
    f.outfit ? `👗 OUTFIT\n${f.outfit}` : null,
    f.notes  ? `📝 NOTES\n${f.notes}`   : null,
    ``,
    `🖼️ REFERENCE`,
    f.referenceFile ? `⚠️ REMEMBER TO ATTACH YOUR REFERENCE PHOTO TO THIS EMAIL` : null,
    f.referenceLink ? `Link: ${f.referenceLink}` : null,
    !f.referenceFile && !f.referenceLink ? `No reference provided` : null,
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

const inputCls = 'w-full p-3 border border-sakura-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-300 text-sakura-700 placeholder:text-sakura-300 transition'

export default function Commission() {
  const [formData, setFormData]     = useState(initialForm)
  const [step, setStep]             = useState('form')
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef                = useRef(null)

  const total   = calcTotal(formData)
  const deposit = +(total * 0.5).toFixed(2)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData(prev => ({ ...prev, referenceFile: file }))
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setFormData(prev => ({ ...prev, referenceFile: file }))
    setPreviewUrl(URL.createObjectURL(file))
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, referenceFile: null }))
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePokemonChange = (idx, val) => {
    setFormData(prev => {
      const arr = [...prev.pokemons]
      arr[idx] = val
      return { ...prev, pokemons: arr }
    })
  }

  const addPokemon = () => {
    setFormData(prev => ({ ...prev, pokemons: [...prev.pokemons, ''] }))
  }

  const removePokemon = (idx) => {
    setFormData(prev => ({
      ...prev,
      pokemons: prev.pokemons.filter((_, i) => i !== idx),
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`🌸 Commission Request — ${formData.firstName} ${formData.lastName}`)
    const body    = buildMailtoBody(formData, total, deposit)
    window.open(`mailto:${ARTIST_EMAIL}?subject=${subject}&body=${body}`)
    setStep('done')
  }

  const handlePayPal = () => {
    window.open(`https://paypal.me/${PAYPAL_ME_USER}/${deposit}`, '_blank')
  }

  const pkg = PACKAGES.find(p => p.key === formData.commissionType)

  return (
    <section className="snap-start min-h-screen pt-16 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-6xl font-extrabold text-center mb-2 text-outlined">
          Commission Me
        </h2>
        <p className="text-center mb-10 text-sakura-400 font-medium text-lg">
          Fill in the details so I can create the perfect chibi for you!
        </p>

        {/* ── DONE ── */}
        {step === 'done' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gold-300 p-10 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-sakura-400 animate-bounce-slow" strokeWidth={1} />
            <h3 className="text-3xl font-extrabold text-sakura-500 mb-3 text-outlined">Thank you!</h3>
            <p className="text-sakura-600 text-lg mb-2">Request sent! I'll get back to you within 48 hours.</p>
            {formData.referenceFile && (
              <p className="text-gold-600 font-bold text-sm mb-4">
                Remember to attach your reference photo to the email!
              </p>
            )}
            <p className="text-sakura-400 text-sm mb-8">
              Pay the deposit of <span className="text-gold-600 font-bold">${deposit}</span> via PayPal to confirm your slot.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handlePayPal} className="btn-kawaii inline-flex items-center gap-2">
                <CreditCard className="w-4 h-4" strokeWidth={2} /> Pay ${deposit} via PayPal
              </button>
              <button
                onClick={() => { setFormData(initialForm); setPreviewUrl(null); setStep('form') }}
                className="btn-kawaii-outline inline-flex items-center gap-2"
              >
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
                  <span>{pkg?.name}</span>
                  <span>${pkg?.price}</span>
                </div>
                {formData.commissionType !== 'business_card' && formData.pokemons.filter(p => p.trim()).length > 1 && (
                  <div className="flex justify-between">
                    <span>Extra Pokémon ×{formData.pokemons.filter(p => p.trim()).length - 1}</span>
                    <span>+${(formData.pokemons.filter(p => p.trim()).length - 1) * 10}</span>
                  </div>
                )}
                <div className="border-t border-sakura-200 mt-2 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span>${total}</span>
                </div>
                <div className="flex justify-between text-gold-600 font-extrabold text-base">
                  <span>Deposit due (50%)</span><span>${deposit}</span>
                </div>
              </div>
            </div>

            {formData.referenceFile && (
              <div className="bg-gold-300/20 border border-gold-400/40 rounded-2xl p-4 text-sm text-gold-700 font-medium">
                Remember to attach <strong>{formData.referenceFile.name}</strong> to the email when it opens!
              </div>
            )}

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

            {/* CONTACT */}
            <Section Icon={Mail} title="Contact">
              <div className="grid md:grid-cols-2 gap-3">
                <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} placeholder="First Name *" required />
                <input name="lastName"  value={formData.lastName}  onChange={handleChange} className={inputCls} placeholder="Last Name *" required />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="Email *" required />
                <input name="instagram" value={formData.instagram} onChange={handleChange} className={inputCls} placeholder="Instagram (@username)" />
              </div>
            </Section>

            {/* COMMISSION TYPE */}
            <Section Icon={Palette} title="Commission Type">
              <div className="grid gap-3">
                {PACKAGES.map(p => (
                  <label
                    key={p.key}
                    className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 bg-gradient-to-r ${p.gradient} ${
                      formData.commissionType === p.key
                        ? 'border-sakura-500 shadow-md scale-[1.01]'
                        : `${p.border} hover:border-sakura-300`
                    }`}
                  >
                    <input
                      type="radio"
                      name="commissionType"
                      value={p.key}
                      checked={formData.commissionType === p.key}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <p.Icon className={`w-8 h-8 shrink-0 ${formData.commissionType === p.key ? 'text-sakura-500' : 'text-sakura-300'}`} strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="font-extrabold text-sakura-600">{p.name}</p>
                      <p className="text-xs text-sakura-400">{p.description}</p>
                    </div>
                    <span className={`text-2xl font-extrabold ${formData.commissionType === p.key ? 'text-sakura-500' : 'text-sakura-300'}`}>
                      ${p.price}
                    </span>
                    {p.featured && (
                      <span className="absolute -top-2.5 right-4 bg-gold-400 text-white text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" fill="white" /> Most Popular
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </Section>

            {/* REFERENCE PHOTO */}
            <Section Icon={Image} title="Reference Photo">
              {!previewUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-sakura-200 rounded-2xl p-8 text-center cursor-pointer hover:border-sakura-400 hover:bg-sakura-50 transition-all"
                >
                  <Image className="w-10 h-10 mx-auto mb-2 text-sakura-300" strokeWidth={1} />
                  <p className="text-sakura-400 font-medium">Drop your photo here or click to upload</p>
                  <p className="text-sakura-300 text-xs mt-1">PNG, JPG, WEBP — max 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-sakura-200">
                  <img src={previewUrl} alt="Reference" className="w-full max-h-64 object-contain bg-sakura-50" />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-white/90 text-sakura-500 rounded-full p-1.5 shadow hover:bg-sakura-500 hover:text-white transition"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <p className="text-xs text-sakura-400 p-2 text-center bg-white">{formData.referenceFile?.name}</p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Link2 className="w-4 h-4 text-sakura-300 shrink-0" strokeWidth={1.5} />
                <input
                  name="referenceLink"
                  value={formData.referenceLink}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Or paste a link (Google Drive, WeTransfer, Dropbox...)"
                />
              </div>
            </Section>

            {/* POKÉMON */}
            {formData.commissionType !== 'business_card' && (
              <Section Icon={Zap} title="Pokémon">
                <p className="text-xs text-sakura-400">First Pokémon included in the price. Each additional one costs +$10.</p>
                <div className="space-y-2">
                  {formData.pokemons.map((pokemon, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={pokemon}
                        onChange={e => handlePokemonChange(idx, e.target.value)}
                        className={inputCls}
                        placeholder={idx === 0 ? 'e.g. Pikachu (included)' : `Pokémon #${idx + 1} (+$10)`}
                      />
                      {idx === 0 ? (
                        <span className="shrink-0 text-xs text-gold-600 font-bold whitespace-nowrap">included</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removePokemon(idx)}
                          className="shrink-0 text-sakura-300 hover:text-sakura-500 transition"
                        >
                          <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addPokemon}
                  className="flex items-center gap-2 text-sm text-sakura-400 hover:text-sakura-600 font-semibold transition"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} /> Add Pokémon (+$10)
                </button>
              </Section>
            )}

            {/* OUTFIT & NOTES */}
            <Section Icon={Shirt} title="Outfit & Notes">
              <textarea
                name="outfit"
                value={formData.outfit}
                onChange={handleChange}
                className={`${inputCls} resize-none`}
                placeholder="Describe the outfit: style, colors, accessories, clothing type..."
                rows="3"
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={`${inputCls} resize-none`}
                placeholder="Additional notes: special poses, mood, ideas..."
                rows="3"
              />
            </Section>

            {/* PRICE PREVIEW */}
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

            {/* TERMS */}
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
