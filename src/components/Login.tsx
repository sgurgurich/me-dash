import React, { useState } from 'react'
import { useDashboard } from '../context/DashboardContext'

export default function Login() {
  const { login } = useDashboard()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email)
  }

  const handleDevLogin = () => {
    console.log('Developer Mode clicked - logging in...')
    login('developer@localhost')
    setTimeout(() => {
      window.location.hash = '#dashboards'
    }, 100)
  }

  return (
    <div className="h-screen w-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 mb-4">
            <h1 className="text-4xl font-black text-indigo-600">M</h1>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Me.Dash</h1>
          <p className="text-white">Your Personal Dashboard Space</p>
        </div>

        <div className="bg-slate-900 p-8 border-2 border-indigo-400">
          <h2 className="text-2xl font-bold mb-6 text-white">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Email"
                className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="Password"
                className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
            >
              Sign In
            </button>
            
            <button
              type="button"
              onClick={handleDevLogin}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
            >
              Developer Mode
            </button>
          </form>

          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>Demo Mode - Try any email & password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
