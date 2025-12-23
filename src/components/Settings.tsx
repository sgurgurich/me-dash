import { useDashboard } from '../context/DashboardContext'

export default function Settings() {
  const { currentUser } = useDashboard()

  return (
    <div className="h-full p-8">
      <h1 className="text-3xl font-black text-white mb-6">App Settings</h1>
      
      <div className="space-y-4 max-w-6xl">
        <div className="bg-slate-900 border-2 border-slate-700 p-6">
          <h3 className="font-bold mb-4 text-white text-lg">User Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Name</label>
              <p className="text-white font-medium">{currentUser?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Email</label>
              <p className="text-white font-medium">{currentUser?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border-2 border-slate-700 p-6">
          <h3 className="font-bold mb-4 text-white text-lg">About</h3>
          <p className="text-slate-300 mb-3">
            Me.Dash is a customizable dashboard application for organizing your information.
          </p>
          <p className="text-slate-400 text-sm">
            Theme and color settings are now configured per-dashboard. Enter Edit mode on any dashboard to customize its appearance.
          </p>
        </div>

        <div className="bg-indigo-600 border-2 border-indigo-500 p-6">
          <p className="text-sm text-white">
            All data is stored locally in your browser. No data is sent to any server.
          </p>
        </div>
      </div>
    </div>
  )
}
