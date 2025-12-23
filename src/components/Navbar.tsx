import { useDashboard } from '../context/DashboardContext'

interface NavbarProps {
  currentView: string
  onNavigate: (view: string) => void
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { currentUser, logout } = useDashboard()

  const handleLogout = () => {
    logout()
    window.location.hash = '#'
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900 border-b-2 border-indigo-500">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-xl font-black text-white">Me.Dash</h1>
          </div>

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
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">{currentUser?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
