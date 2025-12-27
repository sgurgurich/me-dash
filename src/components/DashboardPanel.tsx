import { DashboardPanel as DashboardPanelType } from '../context/DashboardContext'
import NotesPanel from './panels/NotesPanel'
import ChartPanel from './panels/ChartPanel'
import StatsPanel from './panels/StatsPanel'
import CalendarPanel from './panels/CalendarPanel'
import WeatherPanel from './panels/WeatherPanel'
import EmbedPanel from './panels/EmbedPanel'
import IframePanel from './panels/IframePanel'
import TwitterPanel from './panels/TwitterPanel'
import GoogleCalendarPanel from './panels/GoogleCalendarPanel'
import StockPanel from './panels/StockPanel'

interface Props {
  panel: DashboardPanelType
  isEditing?: boolean
}

export default function DashboardPanel({ panel, isEditing = false }: Props) {
  const renderPanel = () => {
    switch (panel.type) {
      case 'notes':
        return <NotesPanel panel={panel} isEditing={isEditing} />
      case 'chart':
        return <ChartPanel panel={panel} />
      case 'stats':
        return <StatsPanel panel={panel} />
      case 'calendar':
        return <CalendarPanel panel={panel} />
      case 'weather':
        return <WeatherPanel panel={panel} />
      case 'embed':
        return <EmbedPanel panel={panel} isEditing={isEditing} />
      case 'iframe':
        return <IframePanel panel={panel} isEditing={isEditing} />
      case 'twitter':
        return <TwitterPanel panel={panel} isEditing={isEditing} />
      case 'google-calendar':
        return <GoogleCalendarPanel panel={panel} isEditing={isEditing} />
      case 'stock':
        return <StockPanel data={panel.config} isEditMode={isEditing} />
      default:
        return <NotesPanel panel={panel} isEditing={isEditing} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {renderPanel()}
    </div>
  )
}
