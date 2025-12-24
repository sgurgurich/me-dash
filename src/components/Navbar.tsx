import { useState } from 'react'
import { useDashboard } from '../context/DashboardContext'

interface NavbarProps {
  currentView: string
  onNavigate: (view: string) => void
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { currentUser, logout } = useDashboard()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.hash = '#'
  }

  const handleNavigation = (view: string) => {
    onNavigate(view)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900 border-b-2 border-indigo-500">
      <div className="w-full px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-black text-white">Me.Dash</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('dashboards')}
              className={`px-4 py-2 font-medium transition-all ${
                currentView === 'dashboards'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Dashboards
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-4 py-2 font-medium transition-all ${
                currentView === 'community'
                  ? 'bg-green-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`px-4 py-2 font-medium transition-all ${
                currentView === 'settings'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300 hidden lg:block">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-slate-800 transition-all"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t-2 border-slate-700">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => handleNavigation('dashboards')}
              className={`w-full px-4 py-3 font-medium transition-all text-left ${
                currentView === 'dashboards'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Dashboards
            </button>
            <button
              onClick={() => handleNavigation('community')}
              className={`w-full px-4 py-3 font-medium transition-all text-left ${
                currentView === 'community'
                  ? 'bg-green-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => handleNavigation('settings')}
              className={`w-full px-4 py-3 font-medium transition-all text-left ${
                currentView === 'settings'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Settings
            </button>
            <div className="pt-2 border-t-2 border-slate-700">
              <div className="px-4 py-2 text-sm text-slate-300">{currentUser?.email}</div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white transition-all text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
