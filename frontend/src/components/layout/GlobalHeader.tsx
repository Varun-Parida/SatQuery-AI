import { Link, useLocation } from 'react-router-dom'
import { Satellite } from 'lucide-react'
import { cn, isMockMode } from '@/lib/utils'

interface GlobalHeaderProps {
  showGetStarted?: boolean
  className?: string
}

export default function GlobalHeader({
  showGetStarted = false,
  className,
}: GlobalHeaderProps) {
  const location = useLocation()
  const isMock = isMockMode()

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'How it Works', to: '/about#how-it-works' },
    { name: 'History', to: '/history' },
  ]

  return (
    <header
      className={cn(
        'h-16 w-full bg-white border-b border-slate-200 px-6 md:px-10 flex items-center justify-between z-30 shrink-0 select-none',
        className
      )}
    >
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
          <Satellite className="w-5 h-5 transition-transform group-hover:rotate-12" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          SatQuery <span className="text-blue-600 font-extrabold">AI</span>
        </span>
      </Link>

      {/* Navigation links & user area */}
      <div className="flex items-center gap-6 md:gap-8">
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to.split('#')[0])

            return (
              <Link
                key={link.name}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-600',
                  isActive ? 'text-blue-600 font-semibold' : 'text-slate-600'
                )}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {isMock && (
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Mock API Active
          </span>
        )}

        {showGetStarted ? (
          <Link
            to="/analyze"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
          >
            Get Started
          </Link>
        ) : (
          /* User Avatar matching reference screenshot */
          <div
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
            title="User Profile (SIH Delegate)"
          >
            U
          </div>
        )}
      </div>
    </header>
  )
}
