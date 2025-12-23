import { useState, useEffect } from 'react'
import { DashboardProvider, useDashboard } from './context/DashboardContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import DashboardList from './components/DashboardList'
import DashboardGrid from './components/DashboardGrid'
import Settings from './components/Settings'
import Community from './components/Community'

function AppContent() {
  const { currentUser, theme, setTheme, loadDashboards } = useDashboard()
  const [currentView, setCurrentView] = useState('login')

  console.log('AppContent - currentUser:', currentUser)
  console.log('AppContent - currentView:', currentView)

  useEffect(() => {
    loadDashboards()
    const isDark = localStorage.getItem('theme') === 'dark'
    if (isDark) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    if (!currentUser) {
      setCurrentView('login')
      return
    }

    const handleHashChange = () => {
      const path = window.location.hash
      if (path === '#settings') {
        setCurrentView('settings')
      } else if (path === '#dashboard') {
        setCurrentView('dashboard')
      } else if (path === '#community') {
        setCurrentView('community')
      } else if (path === '#dashboards' || path === '#') {
        setCurrentView('dashboards')
      } else {
        setCurrentView('dashboards')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    
    // Redirect to dashboards on login if no hash
    if (!window.location.hash) {
      window.location.hash = '#dashboards'
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentUser])

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      window.location.hash = '#dashboard'
    } else if (view === 'settings') {
      window.location.hash = '#settings'
    } else if (view === 'community') {
      window.location.hash = '#community'
    } else {
      window.location.hash = '#dashboards'
    }
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
        {currentUser && <Navbar onNavigate={handleNavigate} currentView={currentView} />}
        
        <main className={currentUser ? 'flex-1 overflow-auto p-8 pt-24' : 'flex-1 overflow-auto'}>
          {currentView === 'login' && <Login />}
          {currentView === 'dashboards' && <DashboardList />}
          {currentView === 'dashboard' && <DashboardGrid />}
          {currentView === 'community' && <Community />}
          {currentView === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  )
}

export default App
