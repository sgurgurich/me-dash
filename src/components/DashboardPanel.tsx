import { DashboardPanel as DashboardPanelType } from '../context/DashboardContext'
import NotesPanel from './panels/NotesPanel'
import ChartPanel from './panels/ChartPanel'
import StatsPanel from './panels/StatsPanel'
import CalendarPanel from './panels/CalendarPanel'
import WeatherPanel from './panels/WeatherPanel'
import EmbedPanel from './panels/EmbedPanel'

interface Props {
  panel: DashboardPanelType
}

export default function DashboardPanel({ panel }: Props) {
  const renderPanel = () => {
    switch (panel.type) {
      case 'notes':
        return <NotesPanel panel={panel} />
      case 'chart':
        return <ChartPanel panel={panel} />
      case 'stats':
        return <StatsPanel panel={panel} />
      case 'calendar':
        return <CalendarPanel panel={panel} />
      case 'weather':
        return <WeatherPanel panel={panel} />
      case 'embed':
        return <EmbedPanel panel={panel} />
      default:
        return <NotesPanel panel={panel} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {renderPanel()}
    </div>
  )
}
