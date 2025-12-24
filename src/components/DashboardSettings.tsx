import { useState } from 'react'
import { useDashboard } from '../context/DashboardContext'

export default function DashboardSettings({ onClose }: { onClose: () => void }) {
  const { currentDashboard, updateDashboard, saveDashboards, deleteDashboard } = useDashboard()
  
  const [settings, setSettings] = useState({
    theme: currentDashboard?.theme || 'dark',
    primaryColor: currentDashboard?.primaryColor || '#6366f1',
    backgroundColor: currentDashboard?.backgroundColor || '#020617',
  })

  const handleSave = () => {
    if (currentDashboard) {
      updateDashboard({
        ...currentDashboard,
        theme: settings.theme,
        primaryColor: settings.primaryColor,
        backgroundColor: settings.backgroundColor,
      })
      saveDashboards()
      onClose()
    }
  }

  const handleDelete = () => {
    if (currentDashboard && confirm(`Are you sure you want to delete "${currentDashboard.name}"? This action cannot be undone.`)) {
      deleteDashboard(currentDashboard.id)
      saveDashboards()
      window.location.hash = '#dashboards'
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-slate-700 p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-black text-white mb-6">Dashboard Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-white font-bold mb-2 text-sm sm:text-base">Dashboard Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white min-h-[44px]"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-bold mb-2 text-sm sm:text-base">Primary Color</label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="h-12 w-full sm:w-24 cursor-pointer bg-slate-800 border-2 border-slate-700"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-2 text-sm sm:text-base">Background Color</label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="h-12 w-full sm:w-24 cursor-pointer bg-slate-800 border-2 border-slate-700"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white min-h-[44px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold transition-all min-h-[44px]"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all min-h-[44px]"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-slate-700">
          <button
            onClick={handleDelete}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold transition-all min-h-[44px]"
          >
            Delete Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
