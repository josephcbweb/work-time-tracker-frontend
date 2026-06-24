import { useState, useEffect } from 'react'
import { isAuthenticated } from './services/api'
import SignupPage from './pages/SignupPage'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

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

  // Session checking logic
  useEffect(() => {
    // If authenticated and trying to access /signup or /login, redirect to / (dashboard)
    if (isAuthenticated() && (currentPath === '/signup' || currentPath === '/login')) {
      navigate('/')
    }
  }, [currentPath])

  const renderPage = () => {
    switch (currentPath) {
      case '/signup':
        return <SignupPage navigate={navigate} />
      case '/login': {
        const successMessage = window.history.state?.successMessage;
        return (
          <div className="container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', borderRadius: 'var(--border-radius-lg)', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-backdrop-filter)', border: '1px solid var(--border-color)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
              <h1 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.75rem' }}>Log In</h1>
              {successMessage && (
                <div style={{ padding: 'var(--spacing-sm)', background: 'var(--success-bg)', color: 'var(--accent-secondary)', border: '1px solid var(--accent-secondary)', borderRadius: 'var(--border-radius-sm)', marginBottom: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                  {successMessage}
                </div>
              )}
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                Login page is under construction. Please use the signup flow to create an account.
              </p>
              <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                Don't have an account? Sign Up
              </a>
            </div>
          </div>
        )
      }
      default:
        // Main Dashboard/Root
        return (
          <div className="container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', borderRadius: 'var(--border-radius-lg)', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-backdrop-filter)', border: '1px solid var(--border-color)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
              <h1 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.75rem' }}>Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                Welcome to the Work Time Tracker application.
              </p>
              {isAuthenticated() ? (
                <div>
                  <p style={{ color: 'var(--accent-secondary)', marginBottom: 'var(--spacing-lg)' }}>You are successfully authenticated!</p>
                  <button 
                    onClick={() => { localStorage.removeItem('authToken'); navigate('/login'); }}
                    style={{ background: 'transparent', border: '1px solid var(--error-color)', color: 'var(--error-color)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                  <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ display: 'inline-block', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)' }}>
                    Log In
                  </a>
                  <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} style={{ display: 'inline-block', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--accent-primary)', borderRadius: 'var(--border-radius-sm)', color: 'var(--bg-primary)', fontWeight: 'bold' }}>
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        )
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
          {!isAuthenticated() && (
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

export default App
