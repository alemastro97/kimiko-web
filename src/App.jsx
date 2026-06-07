import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Mail, ExternalLink } from 'lucide-react'
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
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-kawaii text-sakura-500">Kimiko's Corner</span>
      </Link>
      <nav className="flex items-center gap-2">
        {link('/', 'Home')}
        {link('/gallery', 'Gallery')}
        {link('/commission', 'Commission')}
      </nav>
      </div>
      <div className="w-full overflow-hidden leading-none -mt-px">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-6 block" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#cc3d6e" stopOpacity="0" />
              <stop offset="20%"  stopColor="#cc3d6e" stopOpacity="1" />
              <stop offset="80%"  stopColor="#cc3d6e" stopOpacity="1" />
              <stop offset="100%" stopColor="#cc3d6e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* white fill */}
          <path d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10 C350,0 400,20 450,10 C500,0 550,20 600,10 C650,0 700,20 750,10 C800,0 850,20 900,10 C950,0 1000,20 1050,10 C1100,0 1150,20 1200,10 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.92)" />
          {/* pink gradient stroke */}
          <path d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10 C350,0 400,20 450,10 C500,0 550,20 600,10 C650,0 700,20 750,10 C800,0 850,20 900,10 C950,0 1000,20 1050,10 C1100,0 1150,20 1200,10" fill="none" stroke="url(#waveStroke)" strokeWidth="2" />
        </svg>
      </div>
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
        {/* ── FOOTER MOBILE: compact bar ── */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-sakura-500 px-4 py-2 flex items-center justify-between shadow-lg">
          <span className="text-xs text-white/70 font-kawaii">Kimiko's Corner</span>
          <Link to="/commission" className="bg-white text-sakura-500 font-extrabold text-xs px-4 py-1.5 rounded-full border-2 border-sakura-700 shadow font-kawaii">
            Order now!
          </Link>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/kimiko_mg/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
            </a>
            <a href="mailto:mg.kimikomg@gmail.com" className="text-white/80 hover:text-white">
              <Mail className="w-4 h-4" strokeWidth={2} />
            </a>
          </div>
        </footer>

        {/* ── FOOTER DESKTOP: full band ── */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 hidden md:block">
          <div className="w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-6 block" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,12 C50,0 100,24 150,12 C200,0 250,24 300,12 C350,0 400,24 450,12 C500,0 550,24 600,12 C650,0 700,24 750,12 C800,0 850,24 900,12 C950,0 1000,24 1050,12 C1100,0 1150,24 1200,12 L1200,24 L0,24 Z" fill="#cc3d6e" />
            </svg>
          </div>
          <div className="bg-sakura-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#a82e58 1px, transparent 1px), linear-gradient(90deg, #a82e58 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative flex items-center justify-between px-8 py-4 max-w-5xl mx-auto">
              <div className="bg-gold-400 text-sakura-700 text-xs font-extrabold px-4 py-2 rounded-xl border-2 border-sakura-600 shadow rotate-[-3deg]">
                Commissions<br />OPEN ✦
              </div>
              <Link to="/commission" className="bg-white text-sakura-500 font-extrabold text-base px-10 py-3 rounded-full border-4 border-sakura-700 shadow-lg hover:scale-105 transition-transform font-kawaii tracking-wide">
                Order your Chibi!
              </Link>
              <div className="bg-sakura-100 text-sakura-600 text-xs font-extrabold px-4 py-2 rounded-xl border-2 border-sakura-600 shadow rotate-[3deg]">
                Starting<br />at $15 ✦
              </div>
            </div>
          </div>
          <div className="bg-sakura-50 border-t border-sakura-100 flex items-center justify-between px-8 py-1.5">
            <span className="text-xs text-sakura-400 font-kawaii">© {new Date().getFullYear()} Kimiko's Corner</span>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/kimiko_mg/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-sakura-400 hover:text-sakura-600 transition font-semibold">
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} /> Instagram
              </a>
              <a href="mailto:mg.kimikomg@gmail.com" className="flex items-center gap-1 text-xs text-sakura-400 hover:text-sakura-600 transition font-semibold">
                <Mail className="w-3.5 h-3.5" strokeWidth={2} /> Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}
