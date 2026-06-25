import LoginForm from '../components/LoginForm'

interface LoginPageProps {
  navigate: (path: string, state?: any) => void
  successMessage?: string | null
}

export default function LoginPage({ navigate, successMessage }: LoginPageProps) {
  return (
    <div 
      className="flex-center" 
      style={{ 
        width: '100%', 
        minHeight: '80vh', 
        padding: 'var(--spacing-lg)' 
      }}
    >
      <LoginForm navigate={navigate} successMessage={successMessage} />
    </div>
  )
}
