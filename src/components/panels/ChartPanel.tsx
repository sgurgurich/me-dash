import { DashboardPanel } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanel
}

export default function ChartPanel(_props: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-indigo-900 flex items-end justify-around p-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-32 bg-indigo-500 mb-2"></div>
          <span className="text-xs text-slate-400">Jan</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-24 bg-indigo-500 mb-2"></div>
          <span className="text-xs text-slate-400">Feb</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-40 bg-indigo-500 mb-2"></div>
          <span className="text-xs text-slate-400">Mar</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-28 bg-indigo-500 mb-2"></div>
          <span className="text-xs text-slate-400">Apr</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">Monthly Data</p>
    </div>
  )
}
