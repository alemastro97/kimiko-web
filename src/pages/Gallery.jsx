import { useState } from 'react'
import { LayoutGrid, Shirt, Zap, Wand2, Heart, PawPrint, Palette, Star, Backpack, Users, Flame, Sparkles, X } from 'lucide-react'

const workFiles = import.meta.glob('../works/*.{png,jpg,jpeg,webp}', { eager: true })

const worksFromFiles = Object.entries(workFiles).map(([path, mod], i) => {
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '')
  const parts    = filename.split('_')
  const title    = (parts[0] || filename).replace(/-/g, ' ')
  const category = (parts[1] || 'other').toLowerCase()
  return { id: `file-${i}`, title, category, src: mod.default }
})

const placeholders = [
  { id: 1,  category: 'outfit',  title: 'Lolita Dress',    Icon: Shirt    },
  { id: 2,  category: 'pokemon', title: 'Pikachu Trainer', Icon: Zap      },
  { id: 3,  category: 'fantasy', title: 'Magical Girl',    Icon: Wand2    },
  { id: 4,  category: 'outfit',  title: 'School Uniform',  Icon: Backpack },
  { id: 5,  category: 'pokemon', title: 'Eevee Lover',     Icon: Star     },
  { id: 6,  category: 'couple',  title: 'Cute Couple',     Icon: Users    },
  { id: 7,  category: 'fantasy', title: 'Witch Chibi',     Icon: Sparkles },
  { id: 8,  category: 'outfit',  title: 'Kimono Style',    Icon: Shirt    },
  { id: 9,  category: 'pokemon', title: 'Charmander',      Icon: Flame    },
  { id: 10, category: 'pets',    title: 'With Cat',        Icon: PawPrint },
  { id: 11, category: 'fantasy', title: 'Fairy Princess',  Icon: Sparkles },
  { id: 12, category: 'outfit',  title: 'Streetwear',      Icon: Shirt    },
]

const galleryItems = worksFromFiles.length > 0 ? worksFromFiles : placeholders

const catIconMap = {
  all: LayoutGrid, outfit: Shirt, pokemon: Zap,
  fantasy: Wand2, couple: Heart, pets: PawPrint, other: Palette,
}

const allCategories = ['all', ...new Set(galleryItems.map(i => i.category))]

export default function Gallery() {
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter)

  return (
    <section className="snap-start min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-outlined text-center mb-2">Full Gallery</h2>
        <p className="text-center mb-10 text-sakura-400 font-medium text-lg">Browse my chibi collection</p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map(cat => {
            const CatIcon = catIconMap[cat] || Palette
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
            <div
              key={item.id}
              onClick={() => item.src && setSelected(item)}
              className={`card-glow group relative bg-white rounded-3xl border border-sakura-100 overflow-hidden aspect-square flex flex-col items-center justify-center ${item.src ? 'cursor-zoom-in' : 'p-5'}`}
            >
              {item.src ? (
                <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <>
                  <item.Icon
                    className="w-14 h-14 mb-3 text-sakura-300"
                    strokeWidth={1}
                    style={{ animation: `float ${3 + i * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}
                  />
                  <span className="text-sakura-600 font-bold text-center text-sm">{item.title}</span>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-bold capitalize">{item.title}</p>
                <p className="text-gold-300 text-xs capitalize">#{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-sakura-300 text-xl">Nothing here yet...</div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} className="w-full rounded-2xl shadow-2xl" />
            <div className="text-center mt-3">
              <p className="text-white font-bold capitalize">{selected.title}</p>
              <p className="text-gold-300 text-sm capitalize">#{selected.category}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-3 -right-3 bg-sakura-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-sakura-600"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
