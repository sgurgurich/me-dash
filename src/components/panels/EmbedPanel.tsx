import { useState, useEffect } from 'react'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanelType
}

export default function EmbedPanel({ panel }: Props) {
  const { updatePanel } = useDashboard()
  const [editing, setEditing] = useState(false)
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
    setEditing(false)
  }

  return (
    <div className="h-full flex flex-col">
      {editing ? (
        <div className="flex-1 flex flex-col">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
            className="p-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
            placeholder="Enter URL to embed (e.g., https://example.com)"
          />
          <button
            onClick={saveUrl}
            className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
          >
            Save URL
          </button>
        </div>
      ) : (
        <>
          {url ? (
            <iframe
              src={url}
              className="flex-1 w-full border-2 border-slate-700"
              title={panel.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex-1 p-3 text-slate-300 text-center flex items-center justify-center">
              Click Edit to add an embeddable URL
            </div>
          )}
          <button
            onClick={() => setEditing(true)}
            className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
          >
            Edit URL
          </button>
        </>
      )}
    </div>
  )
}
