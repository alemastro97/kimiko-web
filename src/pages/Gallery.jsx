import { useState } from 'react'

// Legge automaticamente tutti i PNG/JPG/WEBP da src/works/
// Formato nome file: titolo_categoria.png  es: "magical-girl_fantasy.png"
const workFiles = import.meta.glob('../works/*.{png,jpg,jpeg,webp}', { eager: true })

const worksFromFiles = Object.entries(workFiles).map(([path, mod], i) => {
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '') // rimuovi estensione
  const parts    = filename.split('_')
  const title    = (parts[0] || filename).replace(/-/g, ' ')
  const category = (parts[1] || 'other').toLowerCase()
  return { id: `file-${i}`, title, category, src: mod.default }
})

// Placeholder emoji se la cartella è vuota
const placeholders = [
  { id: 1,  category: 'outfit',  title: 'Lolita Dress',    emoji: '👗' },
  { id: 2,  category: 'pokemon', title: 'Pikachu Trainer', emoji: '⚡' },
  { id: 3,  category: 'fantasy', title: 'Magical Girl',    emoji: '✨' },
  { id: 4,  category: 'outfit',  title: 'School Uniform',  emoji: '🎒' },
  { id: 5,  category: 'pokemon', title: 'Eevee Lover',     emoji: '🦊' },
  { id: 6,  category: 'couple',  title: 'Cute Couple',     emoji: '💕' },
  { id: 7,  category: 'fantasy', title: 'Witch Chibi',     emoji: '🧙‍♀️' },
  { id: 8,  category: 'outfit',  title: 'Kimono Style',    emoji: '🌸' },
  { id: 9,  category: 'pokemon', title: 'Charmander',      emoji: '🔥' },
  { id: 10, category: 'pets',    title: 'With Cat',        emoji: '🐱' },
  { id: 11, category: 'fantasy', title: 'Fairy Princess',  emoji: '🧚' },
  { id: 12, category: 'outfit',  title: 'Streetwear',      emoji: '👕' },
]

const galleryItems = worksFromFiles.length > 0 ? worksFromFiles : placeholders

const allCategories = ['all', ...new Set(galleryItems.map(i => i.category))]
const catIcons = { all: '🌟', outfit: '👗', pokemon: '⚡', fantasy: '✨', couple: '💕', pets: '🐾', other: '🎨' }

export default function Gallery() {
  const [filter, setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter)

  return (
    <section className="snap-start min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-2 text-outlined">
          Full Gallery
        </h2>
        <p className="text-center mb-10 text-sakura-400 font-medium text-lg">
          Browse my chibi collection 🎨
        </p>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold capitalize transition-all duration-300 ${
                filter === cat
                  ? 'bg-sakura-500 text-white shadow-lg scale-105'
                  : 'bg-white text-sakura-500 border border-sakura-200 hover:bg-sakura-50 hover:scale-105'
              }`}
            >
              <span>{catIcons[cat] || '🎨'}</span> {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => item.src && setSelected(item)}
              className={`card-glow group relative bg-white rounded-3xl border border-sakura-100 overflow-hidden aspect-square flex flex-col items-center justify-center ${item.src ? 'cursor-zoom-in' : 'p-5'}`}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <>
                  <span
                    className="text-6xl mb-3 inline-block"
                    style={{ animation: `float ${3 + i * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}
                  >
                    {item.emoji}
                  </span>
                  <span className="text-sakura-600 font-bold text-center">{item.title}</span>
                </>
              )}
              {/* Overlay label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-bold capitalize">{item.title}</p>
                <p className="text-gold-300 text-xs capitalize">#{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-sakura-300 text-xl">
            Nothing here yet... 🌸
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} className="w-full rounded-2xl shadow-2xl" />
            <div className="text-center mt-3">
              <p className="text-white font-bold capitalize">{selected.title}</p>
              <p className="text-gold-300 text-sm capitalize">#{selected.category}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-3 -right-3 bg-sakura-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg hover:bg-sakura-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
