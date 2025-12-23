import { useState, useEffect } from 'react'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanelType
}

export default function NotesPanel({ panel }: Props) {
  const { updatePanel } = useDashboard()
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(panel.config?.content || '')

  useEffect(() => {
    if (panel.config?.content !== undefined) {
      setContent(panel.config.content)
    }
  }, [panel.config?.content])

  const saveContent = () => {
    updatePanel(panel.id, {
      config: { content }
    })
  }

  return (
    <div className="h-full flex flex-col">
      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={saveContent}
          autoFocus
          className="flex-1 p-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400 resize-none"
          placeholder="Type your notes..."
        />
      ) : (
        <div className="flex-1 p-3 text-slate-300 whitespace-pre-wrap">
          {content || 'Click Edit to add notes'}
        </div>
      )}
      <button
        onClick={() => setEditing(!editing)}
        className={`mt-3 px-4 py-2 font-bold transition-all ${
          editing
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}
      >
        {editing ? 'Done' : 'Edit'}
      </button>
    </div>
  )
}
