import { useState } from 'react'
import type { FormEvent } from 'react'
import { signup, APIError } from '../services/api'
import { User, Lock, AlertCircle } from 'lucide-react'
import './SignupForm.css'

interface SignupFormProps {
  navigate: (path: string, state?: any) => void
}

interface FormErrors {
  username?: string
  password?: string
}

export default function SignupForm({ navigate }: SignupFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    // Username validations
    if (!username.trim()) {
      errors.username = 'Username is required.'
    } else if (username.length < 3 || username.length > 20) {
      errors.username = 'Username must be between 3 and 20 characters.'
    } else if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, hyphens, and underscores.'
    }

    // Password validations
    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setSubmitError(null)
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await signup(username.trim(), password)
      // Redirect on success
      navigate('/login', { successMessage: 'Sign up successful! Please log in.' })
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
    <div className="signup-card">
      <div className="signup-header">
        <div className="signup-logo">⏱</div>
        <h2 className="signup-title">Create an Account</h2>
        <p className="signup-subtitle">Register to start tracking your time</p>
      </div>

      {submitError && (
        <div className="form-error-alert" role="alert">
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      <form className="signup-form" onSubmit={handleSubmit} noValidate>
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
          {formErrors.username ? (
            <span className="input-error-msg">{formErrors.username}</span>
          ) : (
            <span className="form-help-text">3-20 characters, alphanumeric, hyphens, or underscores.</span>
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
              autoComplete="new-password"
            />
            <Lock className="input-icon" size={18} />
          </div>
          {formErrors.password ? (
            <span className="input-error-msg">{formErrors.password}</span>
          ) : (
            <span className="form-help-text">Minimum 8 characters.</span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Registering...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      <div className="signup-footer">
        Already have an account?{' '}
        <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="signup-link">
          Log In
        </a>
      </div>
    </div>
  )
}
