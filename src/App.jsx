import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Commission from './pages/Commission'

function Nav() {
  const { pathname } = useLocation()
  const link = (to, label) => (
    <Link
      to={to}
      className={`relative px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
        pathname === to
          ? 'bg-sakura-500 text-white shadow-md'
          : 'text-sakura-500 hover:bg-sakura-100'
      }`}
    >
      {label}
    </Link>
  )
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-sakura-100">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl animate-wiggle inline-block">🌸</span>
        <span className="text-xl font-extrabold text-shimmer">Chibi Atelier</span>
      </Link>
      <nav className="flex items-center gap-2">
        {link('/', 'Home')}
        {link('/gallery', 'Gallery')}
        {link('/commission', 'Commission')}
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-sakura-50 font-sans flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/commission" element={<Commission />} />
          </Routes>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 z-50 py-2 text-center text-xs text-sakura-400 bg-white/80 backdrop-blur-sm border-t border-sakura-100">
          <span className="animate-sparkle inline-block mr-1">✨</span>
          © {new Date().getFullYear()} Chibi Atelier — made with love
          <span className="animate-sparkle inline-block ml-1">✨</span>
        </footer>
      </div>
    </Router>
  )
}
