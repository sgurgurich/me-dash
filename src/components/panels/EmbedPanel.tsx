import { useState, useEffect } from 'react'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanelType
  isEditing?: boolean
}

export default function EmbedPanel({ panel, isEditing = false }: Props) {
  const { updatePanel } = useDashboard()
  const [url, setUrl] = useState(panel.config?.url || '')

  useEffect(() => {
    if (panel.config?.url !== undefined) {
      setUrl(panel.config.url)
    }
  }, [panel.config?.url])

  const saveUrl = () => {
    updatePanel(panel.id, {
      config: { url }
    })
  }

  return (
    <div className="h-full flex flex-col">
      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={saveUrl}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            autoFocus
            className="p-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
            placeholder="Enter URL to embed (e.g., https://example.com)"
          />
        </div>
      ) : (
        <>
          {url ? (
            <iframe
              src={url}
              className="flex-1 w-full border-2 border-slate-700 mb-6"
              title={panel.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex-1 p-3 pb-6 text-slate-300 text-center flex items-center justify-center">
              Click Edit to add an embeddable URL
            </div>
          )}
        </>
      )}
    </div>
  )
}
