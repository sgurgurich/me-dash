import { useState, useEffect, useRef } from 'react'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanelType
  isEditing?: boolean
}

export default function TwitterPanel({ panel, isEditing = false }: Props) {
  const { updatePanel } = useDashboard()
  const [username, setUsername] = useState(panel.config?.username || '')
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panel.config?.username !== undefined) {
      setUsername(panel.config.username)
    }
  }, [panel.config?.username])

  const saveUsername = () => {
    updatePanel(panel.id, {
      config: { username }
    })
  }

  useEffect(() => {
    // Load Twitter widget script
    if (!username || isEditing) return

    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.charset = 'utf-8'
    
    // Clear previous content
    if (timelineRef.current) {
      timelineRef.current.innerHTML = `
        <a class="twitter-timeline" 
           data-theme="dark" 
           data-chrome="noheader nofooter noborders transparent"
           href="https://twitter.com/${username}">
          Loading tweets by @${username}...
        </a>
      `
      
      // Append script to load timeline
      document.body.appendChild(script)
    }

    return () => {
      // Cleanup: remove script when component unmounts or username changes
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [username, isEditing])

  return (
    <div className="h-full flex flex-col">
      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.replace('@', ''))}
            onBlur={saveUsername}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            autoFocus
            className="p-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
            placeholder="Enter Twitter/X username (without @)"
          />
          <p className="text-xs text-slate-400 mt-2 px-3">
            Enter a Twitter/X username to display their timeline
          </p>
        </div>
      ) : (
        <>
          {username ? (
            <div ref={timelineRef} className="flex-1 overflow-auto pb-6" />
          ) : (
            <div className="flex-1 p-3 pb-6 text-slate-300 text-center flex items-center justify-center">
              Click Edit to add a Twitter/X username
            </div>
          )}
        </>
      )}
    </div>
  )
}
