import { useState } from 'react'
import { useDashboard } from '../context/DashboardContext'

export default function DashboardList() {
  const { dashboards, createDashboard, setCurrentDashboard, shareDashboard, unshareDashboard, saveDashboards, setCurrentDashboardDirect } = useDashboard()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' })

  console.log('DashboardList - Number of dashboards:', dashboards.length)
  console.log('DashboardList - Dashboards:', dashboards)

  const handleCreateDashboard = async () => {
    if (newDashboard.name.trim()) {
      setIsCreating(true)
      
      // Create dashboard
      const dashboard = createDashboard(newDashboard.name, newDashboard.description)
      saveDashboards()
      
      setNewDashboard({ name: '', description: '' })
      setShowCreateForm(false)
      localStorage.setItem('openInEditMode', 'true')
      
      // Set dashboard directly without searching
      if (setCurrentDashboardDirect) {
        setCurrentDashboardDirect(dashboard)
      } else {
        setCurrentDashboard(dashboard.id)
      }
      
      // Wait a bit before navigating
      await new Promise(resolve => setTimeout(resolve, 200))
      window.location.hash = '#dashboard'
      
      setIsCreating(false)
    }
  }

  const selectDashboard = (id: string) => {
    setCurrentDashboard(id)
    window.location.hash = '#dashboard'
  }

  const toggleShare = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id)
    if (dashboard) {
      if (dashboard.isPublic) {
        unshareDashboard(id)
      } else {
        const token = shareDashboard(id)
        const shareUrl = `${window.location.origin}?share=${token}`
        alert(`Dashboard shared!\n\nShare URL: ${shareUrl}`)
      }
      saveDashboards()
    }
  }

  return (
    <div>
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-900 border-2 border-indigo-500 p-8 text-center">
            <div className="mb-4">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
            <p className="text-white font-bold text-xl">Creating Dashboard...</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">My Dashboards</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
        >
          New Dashboard
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-slate-900 border-2 border-slate-700 p-6">
          <h3 className="font-bold mb-4 text-white text-lg">Create New Dashboard</h3>
          <div className="space-y-3 mb-4">
            <input
              value={newDashboard.name}
              onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
              type="text"
              placeholder="Dashboard name"
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
            />
            <textarea
              value={newDashboard.description}
              onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400 resize-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCreateDashboard}
              className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="w-full sm:w-auto px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {dashboards.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border-2 border-slate-700">
          <p className="text-slate-300 text-lg mb-4">No dashboards yet</p>
          <p className="text-slate-400 text-sm">Click "New Dashboard" to create your first dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-6">
        {dashboards.map((dashboard) => (
          <div
            key={dashboard.id}
            className="bg-slate-900 border-2 border-slate-700 p-6 hover:border-indigo-500 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-xl text-white">{dashboard.name}</h3>
              {dashboard.isPublic && (
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold border-2 border-green-500">
                  Shared
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-2">{dashboard.panels.length} panels</p>
            <p className="text-sm text-slate-300 mb-4">{dashboard.description || 'No description'}</p>

            <div className="flex gap-2 flex-col sm:flex-row">
              <button
                onClick={() => selectDashboard(dashboard.id)}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all min-h-[44px]"
              >
                Open
              </button>
              <button
                onClick={() => toggleShare(dashboard.id)}
                className={`px-4 py-2 font-bold transition-all min-h-[44px] ${
                  dashboard.isPublic
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {dashboard.isPublic ? '✓' : 'Share'}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
