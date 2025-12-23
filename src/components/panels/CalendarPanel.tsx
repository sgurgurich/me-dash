import { DashboardPanel } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanel
}

export default function CalendarPanel(_props: Props) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 gap-1 mb-3">
        {days.map((day, i) => (
          <div key={i} className="text-center text-xs py-2 text-slate-400 font-bold">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`aspect-square text-xs flex items-center justify-center font-bold transition-all ${
              day % 7 === 0
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {day < 32 ? day : ''}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">
        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}
