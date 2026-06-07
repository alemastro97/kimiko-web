import { useState } from 'react'
import { LayoutGrid, Zap, Sparkles, CreditCard, ExternalLink } from 'lucide-react'

const IG_PROFILE = 'https://www.instagram.com/kimiko_mg/'

const workFiles = import.meta.glob('../works/*.{png,jpg,jpeg,webp}', { eager: true })

const worksFromFiles = Object.entries(workFiles).map(([path, mod], i) => {
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '')
  const parts    = filename.split('_')
  const title    = (parts[0] || filename).replace(/-/g, ' ')
  const category = (parts[1] || 'other').toLowerCase()
  return { id: `file-${i}`, title, category, src: mod.default }
})

const placeholders = [
  { id: 1, category: 'pokemon',      title: 'Chibi + Pokémon',    Icon: Zap        },
  { id: 2, category: 'full',         title: 'Full Illustration',  Icon: Sparkles   },
  { id: 3, category: 'business',     title: 'Business Card',      Icon: CreditCard },
]

const galleryItems = worksFromFiles.length > 0 ? worksFromFiles : placeholders

const catIconMap = {
  all: LayoutGrid, pokemon: Zap, full: Sparkles, business: CreditCard,
}

const allCategories = ['all', 'pokemon', 'full', 'business']

export default function Gallery() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter)

  return (
    <section className="snap-start min-h-screen pt-16 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-6xl text-outlined text-center mb-2">Full Gallery</h2>
        <p className="text-center mb-10 text-sakura-400 font-medium text-lg">Browse my chibi collection</p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map(cat => {
            const CatIcon = catIconMap[cat] || LayoutGrid
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold capitalize transition-all duration-300 ${
                  filter === cat
                    ? 'bg-sakura-500 text-white shadow-lg scale-105'
                    : 'bg-white text-sakura-500 border border-sakura-200 hover:bg-sakura-50 hover:scale-105'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" strokeWidth={1.5} /> {cat}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            item.src ? (
              /* ── ExternalLink-style card ── */
              <a
                key={item.id}
                href={IG_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="card-glow group relative bg-white rounded-2xl border border-sakura-100 overflow-hidden flex flex-col shadow-sm"
              >
                {/* header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-sakura-50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sakura-400 to-gold-400 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-sakura-500 truncate">kimiko_mg</span>
                </div>
                {/* image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* footer */}
                <div className="px-3 py-2">
                  <p className="text-xs font-bold text-sakura-600 capitalize truncate">{item.title}</p>
                  <p className="text-xs text-gold-500 capitalize">#{item.category}</p>
                </div>
                {/* hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow" strokeWidth={1.5} />
                </div>
              </a>
            ) : (
              /* ── placeholder card ── */
              <div
                key={item.id}
                className="card-glow group relative bg-white rounded-3xl border border-sakura-100 overflow-hidden aspect-square flex flex-col items-center justify-center p-5"
              >
                <item.Icon
                  className="w-14 h-14 mb-3 text-sakura-300"
                  strokeWidth={1}
                  style={{ animation: `float ${3 + i * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}
                />
                <span className="text-sakura-600 font-bold text-center text-sm">{item.title}</span>
              </div>
            )
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-sakura-300 text-xl">Nothing here yet...</div>
        )}
      </div>

    </section>
  )
}
