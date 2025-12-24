import { useState, useEffect } from 'react'
import { useDashboard, DashboardPanel as DashboardPanelType } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanelType
  isEditing?: boolean
}

export default function GoogleCalendarPanel({ panel, isEditing = false }: Props) {
  const { updatePanel } = useDashboard()
  const [calendarId, setCalendarId] = useState(panel.config?.calendarId || '')

  useEffect(() => {
    if (panel.config?.calendarId !== undefined) {
      setCalendarId(panel.config.calendarId)
    }
  }, [panel.config?.calendarId])

  const saveCalendarId = () => {
    updatePanel(panel.id, {
      config: { calendarId }
    })
  }

  // Extract calendar ID from URL if a full URL is provided
  const getCalendarEmbedUrl = (input: string): string => {
    if (!input) return ''
    
    // If input is already just an ID or email, use it directly
    if (!input.includes('http')) {
      return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(input)}&mode=AGENDA`
    }
    
    // Try to extract calendar ID from various Google Calendar URL formats
    const srcMatch = input.match(/src=([^&]+)/)
    if (srcMatch) {
      return `https://calendar.google.com/calendar/embed?src=${srcMatch[1]}&mode=AGENDA`
    }
    
    // If it's a full embed URL, use as-is
    if (input.includes('calendar.google.com/calendar/embed')) {
      return input
    }
    
    return ''
  }

  const embedUrl = getCalendarEmbedUrl(calendarId)

  return (
    <div className="h-full flex flex-col">
      {isEditing ? (
        <div className="flex-1 flex flex-col space-y-3">
          <input
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            onBlur={saveCalendarId}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            autoFocus
            className="p-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
            placeholder="Enter Google Calendar ID or public calendar URL"
          />
          <div className="p-3 bg-slate-800 border-2 border-slate-700 text-slate-300 text-sm">
            <p className="font-bold mb-2">How to find your Google Calendar ID:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Calendar</a></li>
              <li>Click on the three dots next to your calendar</li>
              <li>Select "Settings and sharing"</li>
              <li>Make sure "Make available to public" is checked</li>
              <li>Scroll to "Integrate calendar" and copy your Calendar ID</li>
              <li>Paste it here (e.g., example@gmail.com or abcd1234@group.calendar.google.com)</li>
            </ol>
          </div>
        </div>
      ) : (
        <>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="flex-1 w-full border-2 border-slate-700 bg-white"
              title={panel.title}
              style={{ minHeight: '400px' }}
            />
          ) : (
            <div className="flex-1 p-3 pb-6 text-slate-300 text-center flex items-center justify-center">
              <div>
                <p className="mb-2">Click Edit to add a Google Calendar</p>
                <p className="text-xs text-slate-400">Enter your public calendar ID to display events</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
