import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthProvider'
import { SettingsProvider } from './context/SettingsProvider'
import { useAuth } from './hooks/useAuth'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string, state: any = null) => {
    window.history.pushState(state, '', path)
    setCurrentPath(path)
  }

  // Session checking and route protection logic
  useEffect(() => {
    if (loading) return

    if (isAuthenticated && (currentPath === '/signup' || currentPath === '/login')) {
      navigate('/')
    } else if (!isAuthenticated && currentPath === '/') {
      navigate('/login')
    }
  }, [currentPath, isAuthenticated, loading])

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(15, 23, 42, 0.3)', borderTopColor: 'var(--accent-primary)' }} />
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/signup':
        return <SignupPage navigate={navigate} />
      case '/login': {
        const successMessage = window.history.state?.successMessage
        return <LoginPage navigate={navigate} successMessage={successMessage} />
      }
      default:
        // Main Dashboard/Root
        if (!isAuthenticated) return null
        return <DashboardPage navigate={navigate} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ color: 'var(--accent-primary)' }}>⏱</span> TimeTracker
        </a>
        <nav style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: currentPath === '/' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.875rem' }}>Dashboard</a>
          {!isAuthenticated && (
            <>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: currentPath === '/login' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.875rem' }}>Login</a>
              <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} style={{ color: currentPath === '/signup' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.875rem' }}>Signup</a>
            </>
          )}
        </nav>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderPage()}
      </main>
      <footer style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        © 2026 Work Time Tracker. All rights reserved.
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  )
}

