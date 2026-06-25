import { useState } from 'react'
import type { FormEvent } from 'react'
import { login, APIError } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { User, Lock, AlertCircle } from 'lucide-react'
import '../styles/login.css'

interface LoginFormProps {
  navigate: (path: string, state?: any) => void
  successMessage?: string | null
}

interface FormErrors {
  username?: string
  password?: string
}

export default function LoginForm({ navigate, successMessage }: LoginFormProps) {
  const { login: setAuthToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!username.trim()) {
      errors.username = 'Username is required.'
    }
    
    if (!password) {
      errors.password = 'Password is required.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await login(username.trim(), password)
      // Save token in auth context/state
      setAuthToken(response.token)
      // Redirect to dashboard
      navigate('/')
    } catch (err) {
      if (err instanceof APIError) {
        setSubmitError(err.message)
      } else {
        setSubmitError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-card">
      <div className="login-header">
        <div className="login-logo">⏱</div>
        <h2 className="login-title">Log In</h2>
        <p className="login-subtitle">Sign in to access your workspace</p>
      </div>

      {successMessage && !submitError && (
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: 'var(--success-bg)',
          color: 'var(--accent-secondary)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <span>{successMessage}</span>
        </div>
      )}

      {submitError && (
        <div className="form-error-alert" role="alert">
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <div className="input-wrapper">
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
            <User className="input-icon" size={18} />
          </div>
          {formErrors.username && (
            <span className="input-error-msg">{formErrors.username}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-wrapper">
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <Lock className="input-icon" size={18} />
          </div>
          {formErrors.password && (
            <span className="input-error-msg">{formErrors.password}</span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      <div className="login-footer">
        Don't have an account?{' '}
        <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} className="signup-link">
          Sign Up
        </a>
      </div>
    </div>
  )
}
