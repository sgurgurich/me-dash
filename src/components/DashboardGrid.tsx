import { useState, useEffect, useRef } from 'react'
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
  const { currentDashboard, addPanelToDashboard, updatePanel, removePanel, saveDashboards, setCurrentDashboardDirect, updateDashboard } = useDashboard()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null)
  const [panelBackup, setPanelBackup] = useState<DashboardPanelType | null>(null)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [cols, setCols] = useState(12)
  const containerRef = useRef<HTMLDivElement>(null)
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

  // Track container width for responsive grid
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        
        // Adjust columns based on screen width
        if (width < 640) {
          setCols(1) // Mobile: 1 column
        } else if (width < 1024) {
          setCols(2) // Tablet: 2 columns
        } else {
          setCols(12) // Desktop: 12 columns
        }
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

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

  const handleStartEditPanel = (panel: DashboardPanelType) => {
    setPanelBackup({ ...panel })
    setEditingPanelId(panel.id)
  }

  const handleSavePanel = () => {
    setPanelBackup(null)
    setEditingPanelId(null)
  }

  const handleCancelPanel = () => {
    if (panelBackup) {
      updatePanel(panelBackup.id, panelBackup)
      setPanelBackup(null)
    }
    setEditingPanelId(null)
  }

  const handleLayoutChange = (layout: readonly LayoutItem[]) => {
    if (!isEditing || !currentDashboard) return
    
    // Batch update all panels at once to prevent multiple re-renders
    const updatedPanels = currentDashboard.panels.map(panel => {
      const layoutItem = layout.find(item => item.i === panel.id)
      if (layoutItem) {
        return {
          ...panel,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        }
      }
      return panel
    })
    
    const updated = { ...currentDashboard, panels: updatedPanels }
    setCurrentDashboardDirect(updated)
    updateDashboard(updated)
  }

  if (!currentDashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-300 text-lg">No dashboard selected</p>
      </div>
    )
  }

  return (
    <div className="h-full p-4 sm:p-6 md:p-8" ref={containerRef}>
      {showSettings && <DashboardSettings onClose={() => setShowSettings(false)} />}
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{currentDashboard.name}</h1>
          <p className="text-slate-400 text-sm sm:text-base">{currentDashboard.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={toggleEditMode}
            className={`px-6 py-3 font-bold transition-all min-h-[44px] ${
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
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all min-h-[44px]"
              >
                <span className="hidden sm:inline">Dashboard Settings</span>
                <span className="sm:hidden">Settings</span>
              </button>
              <button
                onClick={() => setShowAddPanel(!showAddPanel)}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold transition-all min-h-[44px]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
            className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold transition-all min-h-[44px]"
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
            minW: cols === 1 ? 1 : 2,
            minH: 2,
          }))}
          width={containerWidth}
          rowHeight={100}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          compactType="vertical"
          {...({ cols } as any)}
        >
        {currentDashboard.panels.map((panel) => (
          <div
            key={panel.id}
            className="bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 transition-all flex flex-col"
          >
            {isEditing && (
              <div className="bg-slate-800 border-b-2 border-slate-700 p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="drag-handle cursor-move text-white text-xs font-bold">☰ Drag to move</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  {editingPanelId === panel.id ? (
                    <>
                      <button
                        onClick={handleSavePanel}
                        className="flex-1 sm:flex-none px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all min-h-[44px]"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelPanel}
                        className="flex-1 sm:flex-none px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold transition-all min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartEditPanel(panel)}
                      className="flex-1 sm:flex-none px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all min-h-[44px]"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleRemovePanel(panel.id)}
                    className="flex-1 sm:flex-none px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all min-h-[44px]"
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
