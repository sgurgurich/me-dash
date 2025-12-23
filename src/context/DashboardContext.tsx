import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface DashboardPanel {
  id: string
  title: string
  type: 'chart' | 'stats' | 'notes' | 'calendar' | 'weather' | 'embed' | 'iframe' | 'twitter'
  x: number
  y: number
  w: number
  h: number
  config?: Record<string, any>
}

export interface Dashboard {
  id: string
  name: string
  description: string
  panels: DashboardPanel[]
  isPublic: boolean
  shareToken?: string
  createdAt: string
  updatedAt: string
  theme?: 'light' | 'dark'
  primaryColor?: string
  backgroundColor?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface DashboardContextType {
  currentUser: User | null
  currentDashboard: Dashboard | null
  dashboards: Dashboard[]
  theme: 'light' | 'dark'
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  login: (email: string) => void
  logout: () => void
  createDashboard: (name: string, description: string) => Dashboard
  updateDashboard: (dashboard: Dashboard) => void
  deleteDashboard: (id: string) => void
  setCurrentDashboard: (id: string) => void
  setCurrentDashboardDirect: (dashboard: Dashboard) => void
  addPanelToDashboard: (panel: DashboardPanel) => void
  updatePanel: (panelId: string, updates: Partial<DashboardPanel>) => void
  removePanel: (panelId: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  updateColorPalette: (colors: Partial<DashboardContextType['colorPalette']>) => void
  shareDashboard: (id: string) => string | undefined
  unshareDashboard: (id: string) => void
  loadDashboards: () => void
  saveDashboards: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentDashboard, setCurrentDashboardState] = useState<Dashboard | null>(null)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')
  const [colorPalette, setColorPalette] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
  })

  const login = (email: string) => {
    console.log('Login called with email:', email)
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      avatar: 'https://via.placeholder.com/40'
    }
    setCurrentUser(user)
    console.log('User set:', user)
    
    // Check if dashboards exist, if not create samples
    const savedDashboards = localStorage.getItem('dashboards')
    console.log('Saved dashboards from localStorage:', savedDashboards)
    let hasDashboards = false
    
    try {
      if (savedDashboards) {
        const parsed = JSON.parse(savedDashboards)
        hasDashboards = Array.isArray(parsed) && parsed.length > 0
        console.log('Parsed dashboards, hasDashboards:', hasDashboards, 'length:', parsed.length)
      }
    } catch (e) {
      console.log('Error parsing dashboards:', e)
      hasDashboards = false
    }
    
    if (!hasDashboards) {
      console.log('No dashboards found, creating samples...')
      const sampleDashboards: Dashboard[] = [
        {
          id: 'sample-1',
          name: 'My First Dashboard',
          description: 'A sample dashboard to get you started',
          panels: [
            {
              id: 'panel-1',
              title: 'Welcome Notes',
              type: 'notes',
              x: 0,
              y: 0,
              w: 6,
              h: 3,
            },
            {
              id: 'panel-2',
              title: 'Quick Stats',
              type: 'stats',
              x: 6,
              y: 0,
              w: 6,
              h: 3,
            },
            {
              id: 'panel-3',
              title: 'Monthly Chart',
              type: 'chart',
              x: 0,
              y: 3,
              w: 8,
              h: 4,
            },
            {
              id: 'panel-4',
              title: 'Calendar',
              type: 'calendar',
              x: 8,
              y: 3,
              w: 4,
              h: 4,
            },
          ],
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-2',
          name: 'Weather Dashboard',
          description: 'Track weather and stay organized',
          panels: [
            {
              id: 'panel-5',
              title: 'Current Weather',
              type: 'weather',
              x: 0,
              y: 0,
              w: 12,
              h: 4,
            },
          ],
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
      localStorage.setItem('dashboards', JSON.stringify(sampleDashboards))
      setDashboards(sampleDashboards)
      console.log('Sample dashboards created and set:', sampleDashboards)
    } else {
      console.log('Loading existing dashboards...')
      loadDashboards()
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setCurrentDashboardState(null)
  }

  const createDashboard = (name: string, description: string) => {
    const dashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name,
      description,
      panels: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setDashboards(prev => [...prev, dashboard])
    return dashboard
  }

  const updateDashboard = (dashboard: Dashboard) => {
    setDashboards(prev => {
      const index = prev.findIndex(d => d.id === dashboard.id)
      if (index !== -1) {
        const updated = [...prev]
        updated[index] = { ...dashboard, updatedAt: new Date().toISOString() }
        return updated
      }
      return prev
    })
  }

  const deleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id))
    if (currentDashboard?.id === id) {
      setCurrentDashboardState(null)
    }
  }

  const setCurrentDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id) || null
    setCurrentDashboardState(dashboard)
  }

  const setCurrentDashboardDirect = (dashboard: Dashboard) => {
    setCurrentDashboardState(dashboard)
  }

  const addPanelToDashboard = (panel: DashboardPanel) => {
    if (currentDashboard) {
      const updated = {
        ...currentDashboard,
        panels: [...currentDashboard.panels, panel]
      }
      setCurrentDashboardState(updated)
      updateDashboard(updated)
    }
  }

  const updatePanel = (panelId: string, updates: Partial<DashboardPanel>) => {
    if (currentDashboard) {
      const updatedPanels = currentDashboard.panels.map(p =>
        p.id === panelId ? { ...p, ...updates } : p
      )
      const updated = { ...currentDashboard, panels: updatedPanels }
      setCurrentDashboardState(updated)
      updateDashboard(updated)
    }
  }

  const removePanel = (panelId: string) => {
    if (currentDashboard) {
      const updated = {
        ...currentDashboard,
        panels: currentDashboard.panels.filter(p => p.id !== panelId)
      }
      setCurrentDashboardState(updated)
      updateDashboard(updated)
    }
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const updateColorPalette = (colors: Partial<typeof colorPalette>) => {
    const updated = { ...colorPalette, ...colors }
    setColorPalette(updated)
    Object.entries(updated).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value)
    })
  }

  const shareDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id)
    if (dashboard) {
      const updated = {
        ...dashboard,
        isPublic: true,
        shareToken: `share_${Math.random().toString(36).substr(2, 9)}`
      }
      updateDashboard(updated)
      return updated.shareToken
    }
  }

  const unshareDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id)
    if (dashboard) {
      const updated = {
        ...dashboard,
        isPublic: false,
        shareToken: undefined
      }
      updateDashboard(updated)
    }
  }

  const loadDashboards = () => {
    console.log('loadDashboards called')
    const stored = localStorage.getItem('dashboards')
    console.log('loadDashboards - stored:', stored)
    if (stored) {
      const parsed = JSON.parse(stored)
      console.log('loadDashboards - parsed:', parsed)
      setDashboards(parsed)
    } else {
      const sample: Dashboard = {
        id: 'dash-sample',
        name: 'My First Dashboard',
        description: 'A sample dashboard to get started',
        panels: [
          {
            id: 'panel-1',
            title: 'Welcome',
            type: 'notes',
            x: 0,
            y: 0,
            w: 6,
            h: 3,
            config: { content: 'Welcome to Me.Dash! Start by adding panels to your dashboard.' }
          }
        ],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDashboards([sample])
    }
  }

  const saveDashboards = () => {
    console.log('saveDashboards called, saving:', dashboards)
    localStorage.setItem('dashboards', JSON.stringify(dashboards))
  }

  // Remove auto-save effect that was causing issues
  // useEffect(() => {
  //   saveDashboards()
  // }, [dashboards])

  return (
    <DashboardContext.Provider
      value={{
        currentUser,
        currentDashboard,
        dashboards,
        theme,
        colorPalette,
        login,
        logout,
        createDashboard,
        updateDashboard,
        deleteDashboard,
        setCurrentDashboard,
        setCurrentDashboardDirect,
        addPanelToDashboard,
        updatePanel,
        removePanel,
        setTheme,
        updateColorPalette,
        shareDashboard,
        unshareDashboard,
        loadDashboards,
        saveDashboards,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
