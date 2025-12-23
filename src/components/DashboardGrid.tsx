import { useState, useEffect } from 'react'
//@ts-ignore
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../context/DashboardContext'
import DashboardPanel from './DashboardPanel'
import DashboardSettings from './DashboardSettings'

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
}

export default function DashboardGrid() {
  const { currentDashboard, addPanelToDashboard, updatePanel, removePanel, saveDashboards } = useDashboard()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null)
  const [newPanel, setNewPanel] = useState({
    title: '',
    type: 'notes' as const,
    w: 6,
    h: 3,
  })

  // Check if we should start in edit mode
  useEffect(() => {
    if (currentDashboard) {
      const shouldEdit = localStorage.getItem('openInEditMode')
      if (shouldEdit === 'true') {
        setIsEditing(true)
        localStorage.removeItem('openInEditMode')
      }
    }
  }, [currentDashboard])

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
    setShowAddPanel(false)
    if (isEditing) {
      saveDashboards()
    }
  }

  const handleAddPanel = () => {
    // Find the next available position
    const maxY = currentDashboard?.panels.reduce((max, p) => Math.max(max, p.y + p.h), 0) || 0
    
    const panel: DashboardPanelType = {
      id: `panel-${Date.now()}`,
      title: newPanel.title || 'Untitled',
      type: newPanel.type,
      x: 0,
      y: maxY,
      w: newPanel.w,
      h: newPanel.h,
    }
    addPanelToDashboard(panel)
    setNewPanel({ title: '', type: 'notes', w: 6, h: 3 })
    setShowAddPanel(false)
  }

  const handleRemovePanel = (panelId: string) => {
    removePanel(panelId)
  }

  const handleUpdatePanelTitle = (panelId: string, newTitle: string) => {
    updatePanel(panelId, { title: newTitle })
  }

  const handleLayoutChange = (layout: readonly LayoutItem[]) => {
    if (!isEditing || !currentDashboard) return
    
    layout.forEach((item) => {
      const panel = currentDashboard.panels.find(p => p.id === item.i)
      if (panel) {
        updatePanel(panel.id, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        })
      }
    })
  }

  if (!currentDashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-300 text-lg">No dashboard selected</p>
      </div>
    )
  }

  return (
    <div className="h-full p-8">
      {showSettings && <DashboardSettings onClose={() => setShowSettings(false)} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">{currentDashboard.name}</h1>
          <p className="text-slate-400">{currentDashboard.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={toggleEditMode}
            className={`px-6 py-3 font-bold transition-all ${
              isEditing
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          {isEditing && (
            <>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
              >
                Dashboard Settings
              </button>
              <button
                onClick={() => setShowAddPanel(!showAddPanel)}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold transition-all"
              >
                Add Panel
              </button>
            </>
          )}
        </div>
      </div>

      {showAddPanel && isEditing && (
        <div className="mb-6 bg-slate-900 border-2 border-slate-700 p-6">
          <h3 className="font-bold mb-4 text-white text-lg">Add New Panel</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              value={newPanel.title}
              onChange={(e) => setNewPanel({ ...newPanel, title: e.target.value })}
              type="text"
              placeholder="Panel title"
              className="px-4 py-2 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
            />
            <select
              value={newPanel.type}
              onChange={(e) => setNewPanel({ ...newPanel, type: e.target.value as any })}
              className="px-4 py-2 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white"
            >
              <option value="notes">Notes</option>
              <option value="chart">Chart</option>
              <option value="stats">Stats</option>
              <option value="calendar">Calendar</option>
              <option value="weather">Weather</option>
              <option value="embed">Embed Link</option>
              <option value="iframe">iFrame</option>
              <option value="twitter">Twitter/X Timeline</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Width (1-12)</label>
              <input
                value={newPanel.w}
                onChange={(e) => setNewPanel({ ...newPanel, w: parseInt(e.target.value) })}
                type="number"
                min="1"
                max="12"
                className="w-full px-2 py-1 bg-slate-800 border-2 border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Height (1-10)</label>
              <input
                value={newPanel.h}
                onChange={(e) => setNewPanel({ ...newPanel, h: parseInt(e.target.value) })}
                type="number"
                min="1"
                max="10"
                className="w-full px-2 py-1 bg-slate-800 border-2 border-slate-700 text-white text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleAddPanel}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
          >
            Add
          </button>
        </div>
      )}

      <GridLayout
          className="layout"
          layout={currentDashboard.panels.map(panel => ({
            i: panel.id,
            x: panel.x,
            y: panel.y,
            w: panel.w,
            h: panel.h,
            minW: 2,
            minH: 2,
          }))}
          rowHeight={100}
          width={1200}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          compactType="vertical"
          {...({ cols: 12 } as any)}
        >
        {currentDashboard.panels.map((panel) => (
          <div
            key={panel.id}
            className="bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 transition-all flex flex-col"
          >
            {isEditing && (
              <div className="bg-slate-800 border-b-2 border-slate-700 p-2 flex justify-between items-center">
                <span className="drag-handle cursor-move text-white text-xs font-bold">☰ Drag to move</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPanelId(editingPanelId === panel.id ? null : panel.id)}
                    className={`px-3 py-1 text-white text-xs font-bold transition-all ${
                      editingPanelId === panel.id
                        ? 'bg-green-600 hover:bg-green-500'
                        : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    {editingPanelId === panel.id ? 'Done' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleRemovePanel(panel.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex-1 p-6 overflow-auto" onMouseDown={(e) => {
              // Prevent dragging when clicking on panel content
              if (!(e.target as HTMLElement).closest('.drag-handle')) {
                e.stopPropagation();
              }
            }}>
              {editingPanelId === panel.id ? (
                <input
                  value={panel.title}
                  onChange={(e) => handleUpdatePanelTitle(panel.id, e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseMove={(e) => e.stopPropagation()}
                  className="font-bold mb-4 w-full bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white px-3 py-2"
                  placeholder="Panel title"
                />
              ) : (
                <h3 className="font-bold mb-4 text-white">{panel.title}</h3>
              )}
              <DashboardPanel panel={panel} isEditing={editingPanelId === panel.id} />
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  )
}
