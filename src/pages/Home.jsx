import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, Heart, Zap, Star, Image, ArrowRight, Check, CreditCard
} from 'lucide-react'

const pricing = [
  {
    title: 'Chibi + Pokémon', price: '$30', Icon: Zap,
    features: ['Character + 1 Pokémon', 'Simple background', 'Extra Pokémon +$10'],
    gradient: 'from-sakura-100 to-white',
    border: 'border-sakura-200',
  },
  {
    title: 'Full Illustration', price: '$50', Icon: Sparkles,
    features: ['Character + pose', 'Pokémon included', 'Full background'],
    gradient: 'from-gold-300/30 to-white',
    border: 'border-gold-400',
    featured: true,
  },
  {
    title: 'Business Card', price: '$15', Icon: CreditCard,
    features: ['Custom card design', 'No Pokémon', 'Print-ready'],
    gradient: 'from-sakura-200/40 to-white',
    border: 'border-sakura-200',
  },
]

const galleryItems = [
  { id: 1, category: 'pokemon',  title: 'Chibi + Pokémon',   Icon: Zap        },
  { id: 2, category: 'full',     title: 'Full Illustration', Icon: Sparkles   },
  { id: 3, category: 'business', title: 'Business Card',     Icon: CreditCard },
]

export default function Home() {
  const charRef    = useRef(null)
  const titleRef   = useRef(null)
  const enteredRef = useRef(false)

  useEffect(() => {
    const charEl  = charRef.current
    const titleEl = titleRef.current
    if (!charEl || !titleEl) return

    const enterTimer = setTimeout(() => {
      charEl.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
      charEl.style.transform  = 'translateX(-20%) translateY(-50%)'
      enteredRef.current = true
    }, 100)

    const onScroll = () => {
      if (!enteredRef.current) return
      const progress = Math.min(window.scrollY / 500, 1)
      charEl.style.transition = 'transform 0.1s ease-out'
      charEl.style.transform  = `translateX(${-20 + progress * 140}%) translateY(-50%)`
      titleEl.style.transition = 'transform 0.1s ease-out'
      titleEl.style.transform  = `translateX(${progress * 17}vw)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(enterTimer); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <div>
      {/* ── HERO ── */}
      <section className="snap-start relative min-h-screen flex items-center pb-24 bg-gradient-to-b from-sakura-100 via-white to-sakura-50">
        <div
          ref={titleRef}
          className="relative z-10 w-full md:w-2/3 px-10 md:pl-16 md:pr-6 flex flex-col items-center"
          style={{ willChange: 'transform' }}
        >
          <div className="mb-4 px-4 py-1 bg-gold-400/20 border border-gold-400/40 rounded-full text-gold-600 text-sm font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
            Commissions OPEN
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
          </div>

          <h1 className="text-5xl uppercase md:text-6xl lg:text-7xl leading-tight mb-6 text-outlined text-center">
            Kawaii<br />Chibi<br />Illustrations
          </h1>

          <p className="text-lg mb-10 text-sakura-500 font-medium text-center max-w-sm">
            Hand-drawn, sweet and personalized artworks just for you.
            Commission your character in adorable chibi style!
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/commission" className="btn-kawaii inline-flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5" strokeWidth={2} /> Order Now
            </Link>
            <Link to="/gallery" className="btn-kawaii-outline inline-flex items-center gap-2 text-lg">
              <Image className="w-5 h-5" strokeWidth={1.5} /> View Gallery
            </Link>
          </div>
        </div>

        <div
          ref={charRef}
          className="fixed top-1/2 right-0 z-20 pointer-events-none select-none"
          style={{ width: '33vw', maxWidth: '600px', transform: 'translateX(120%) translateY(-50%)', willChange: 'transform' }}
        >
          <img src="/chibi-hero.png" alt="Chibi character" className="w-full object-contain drop-shadow-2xl" draggable={false} />
        </div>
      </section>

      {/* ── FEATURED WORKS ── */}
      <section className="snap-start min-h-screen flex flex-col justify-center pt-6 pb-20 px-6">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl text-outlined text-center mb-2">Featured Works</h2>
          <p className="text-center text-sakura-400 mb-10 font-medium">A taste of the magic</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryItems.map((item, i) => (
              <div key={item.id} className="card-glow bg-white rounded-2xl border border-sakura-100 p-5 aspect-square flex flex-col items-center justify-center cursor-pointer">
                <item.Icon
                  className="w-12 h-12 mb-3 text-sakura-400"
                  strokeWidth={1.5}
                  style={{ animation: `float ${3 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                />
                <span className="text-sakura-500 text-sm font-semibold text-center">{item.title}</span>
                <span className="text-xs text-gold-500 mt-1 font-medium capitalize">#{item.category}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/gallery" className="btn-kawaii-outline inline-flex items-center gap-2">
              <Image className="w-4 h-4" strokeWidth={1.5} /> See Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="snap-start min-h-screen flex flex-col justify-center pt-6 pb-20 px-6 bg-gradient-to-b from-white to-sakura-100">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl text-outlined text-center mb-2">Pricing</h2>
          <p className="text-center text-sakura-400 mb-12 font-medium">Affordable kawaii art for everyone</p>

          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((p) => (
              <div key={p.title} className={`card-glow relative bg-gradient-to-b ${p.gradient} rounded-3xl p-8 text-center border ${p.featured ? 'border-gold-400 shadow-xl' : 'border-sakura-200 shadow-md'}`}>
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow flex items-center gap-1">
                    <Star className="w-3 h-3" fill="white" /> Most Popular
                  </div>
                )}
                <p.Icon className="w-10 h-10 mx-auto mb-3 text-sakura-400 animate-float" strokeWidth={1.5} />
                <h3 className="text-2xl font-extrabold mb-1 text-sakura-600">{p.title}</h3>
                <p className={`text-4xl font-extrabold mb-6 ${p.featured ? 'text-outlined-gold' : 'text-sakura-500'}`}>
                  {p.price}
                </p>
                <ul className="text-sm space-y-2 text-sakura-600">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <Check className="w-3.5 h-3.5 text-gold-500" strokeWidth={2.5} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/commission" className="btn-kawaii inline-flex items-center gap-2 mt-6 text-sm px-6 py-2">
                  <ArrowRight className="w-4 h-4" /> Order Now
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-block bg-white/60 rounded-2xl px-6 py-4 border border-gold-300/40 shadow-sm">
              <p className="text-sakura-500 font-medium text-sm">
                Add-ons: Extra character <span className="text-gold-600 font-bold">+$10</span>&nbsp;|&nbsp;
                Complex BG <span className="text-gold-600 font-bold">+$15</span>&nbsp;|&nbsp;
                Pokemon <span className="text-gold-600 font-bold">+$8</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
