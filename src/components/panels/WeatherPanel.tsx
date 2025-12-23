import { DashboardPanel } from '../../context/DashboardContext'

interface Props {
  panel: DashboardPanel
}

export default function WeatherPanel(_props: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-cyan-600 p-5 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm mb-1">Current Weather</p>
            <p className="text-4xl font-black">72°F</p>
          </div>
          <div className="text-5xl">☀️</div>
        </div>
        <p className="text-xl font-bold mb-4">Sunny & Clear</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-cyan-700 border-2 border-cyan-500 p-2">
            <p className="text-xs">Humidity</p>
            <p className="font-black text-lg">65%</p>
          </div>
          <div className="bg-cyan-700 border-2 border-cyan-500 p-2">
            <p className="text-xs">Wind</p>
            <p className="font-black text-lg">8 mph</p>
          </div>
          <div className="bg-cyan-700 border-2 border-cyan-500 p-2">
            <p className="text-xs">Pressure</p>
            <p className="font-black text-lg">30.1</p>
          </div>
        </div>
      </div>
    </div>
  )
}
