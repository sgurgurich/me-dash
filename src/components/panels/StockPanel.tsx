import { useState, useEffect } from 'react'

interface StockPanelProps {
  data?: {
    symbol?: string
  }
  onDataChange?: (data: any) => void
  isEditMode?: boolean
}

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
}

export default function StockPanel({ data, onDataChange, isEditMode }: StockPanelProps) {
  const [symbol, setSymbol] = useState(data?.symbol || 'AAPL')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tempSymbol, setTempSymbol] = useState(symbol)

  useEffect(() => {
    if (symbol) {
      fetchStockData(symbol)
    }
  }, [symbol])

  const fetchStockData = async (stockSymbol: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Using Twelve Data API (free tier, no API key needed for basic quotes)
      // Alternative: You can also use Alpha Vantage, Finnhub, or Yahoo Finance
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${stockSymbol.toUpperCase()}&apikey=demo`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data')
      }
      
      const data = await response.json()
      
      if (data.status === 'error' || !data.symbol) {
        throw new Error(data.message || 'Stock symbol not found')
      }
      
      const price = parseFloat(data.close || data.price || 0)
      const change = parseFloat(data.change || 0)
      const changePercent = parseFloat(data.percent_change || 0)
      
      setStockData({
        symbol: data.symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        high: parseFloat(data.high || price),
        low: parseFloat(data.low || price),
        open: parseFloat(data.open || price),
        previousClose: parseFloat(data.previous_close || price),
      })
    } catch (err) {
      console.error('Stock fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data')
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSymbolChange = () => {
    const upperSymbol = tempSymbol.toUpperCase()
    setSymbol(upperSymbol)
    onDataChange?.({ symbol: upperSymbol })
  }

  const isPositive = stockData ? stockData.change >= 0 : false

  return (
    <div className="h-full flex flex-col p-6">
      {isEditMode && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={tempSymbol}
            onChange={(e) => setTempSymbol(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSymbolChange()
              }
            }}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:border-indigo-500"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleSymbolChange()
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Update
          </button>
        </div>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      )}

      {!loading && !error && stockData && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <div className="text-2xl font-bold text-white mb-1">{stockData.symbol}</div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-black text-white">
                ${stockData.price.toFixed(2)}
              </div>
              <div className={`text-xl font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 text-sm">Open</div>
              <div className="text-white font-semibold">${stockData.open.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Previous Close</div>
              <div className="text-white font-semibold">${stockData.previousClose.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Day High</div>
              <div className="text-white font-semibold">${stockData.high.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Day Low</div>
              <div className="text-white font-semibold">${stockData.low.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Note: Using demo API key with limited requests. For production, get your own API key from twelvedata.com (free tier available)
          </div>
        </div>
      )}
    </div>
  )
}
