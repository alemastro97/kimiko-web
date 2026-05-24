import { useState } from 'react'

const galleryItems = [
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

const categories = ['all', 'outfit', 'pokemon', 'fantasy', 'couple', 'pets']

const catIcons = { all: '🌟', outfit: '👗', pokemon: '⚡', fantasy: '✨', couple: '💕', pets: '🐾' }

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? galleryItems : galleryItems.filter((i) => i.category === filter)

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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold capitalize transition-all duration-300 ${
                filter === cat
                  ? 'bg-sakura-500 text-white shadow-lg scale-105'
                  : 'bg-white text-sakura-500 border border-sakura-200 hover:bg-sakura-50 hover:scale-105'
              }`}
            >
              <span>{catIcons[cat]}</span> {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="card-glow group relative bg-white rounded-3xl border border-sakura-100 p-5 aspect-square flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            >
              {/* Gold shimmer strip on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,133,161,0.08))' }}
              />

              <span
                className="text-6xl mb-3 inline-block relative z-10"
                style={{
                  animation: `float ${3 + i * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                {item.emoji}
              </span>
              <span className="text-sakura-600 font-bold text-center relative z-10">{item.title}</span>
              <span className="text-xs font-semibold mt-1 capitalize relative z-10"
                style={{ color: '#f4c430' }}
              >
                #{item.category}
              </span>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-sakura-300 text-xl animate-float inline-block w-full">
            Nothing here yet... 🌸
          </div>
        )}
      </div>
    </section>
  )
}
