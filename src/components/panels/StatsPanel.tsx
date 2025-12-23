import { DashboardPanel } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanel
}

export default function StatsPanel(_props: Props) {
  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-3 h-full">
        <div className="bg-blue-600 p-4 text-white">
          <p className="text-xs mb-1">Revenue</p>
          <p className="text-2xl font-black mb-1">$12.3K</p>
          <p className="text-xs">↑ 12%</p>
        </div>
        <div className="bg-green-600 p-4 text-white">
          <p className="text-xs mb-1">Users</p>
          <p className="text-2xl font-black mb-1">1,234</p>
          <p className="text-xs">↑ 8%</p>
        </div>
        <div className="bg-purple-600 p-4 text-white">
          <p className="text-xs mb-1">Active</p>
          <p className="text-2xl font-black mb-1">567</p>
          <p className="text-xs">↑ 5%</p>
        </div>
        <div className="bg-red-600 p-4 text-white">
          <p className="text-xs mb-1">Conversion</p>
          <p className="text-2xl font-black mb-1">3.2%</p>
          <p className="text-xs">↓ 0.5%</p>
        </div>
      </div>
    </div>
  )
}
