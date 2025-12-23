import { useState, useEffect } from 'react'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanelType
  isEditing?: boolean
}

export default function NotesPanel({ panel, isEditing = false }: Props) {
  const { updatePanel } = useDashboard()
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
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={saveContent}
          autoFocus
          className="flex-1 p-3 pb-6 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400 resize-none"
          placeholder="Type your notes..."
        />
      ) : (
        <div className="flex-1 p-3 pb-6 text-slate-300 whitespace-pre-wrap">
          {content || 'Click Edit to add notes'}
        </div>
      )}
    </div>
  )
}
