import SignupForm from '../components/SignupForm'

interface SignupPageProps {
  navigate: (path: string, state?: any) => void
}

export default function SignupPage({ navigate }: SignupPageProps) {
  return (
    <div 
      className="flex-center" 
      style={{ 
        width: '100%', 
        minHeight: '80vh', 
        padding: 'var(--spacing-lg)' 
      }}
    >
      <SignupForm navigate={navigate} />
    </div>
  )
}
