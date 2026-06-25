import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import WeeklyLimitInput from '../components/WeeklyLimitInput';
import { LogOut, Calendar, Clock, Award } from 'lucide-react';

interface DashboardPageProps {
  navigate: (path: string, state?: any) => void;
}

export default function DashboardPage({ navigate }: DashboardPageProps) {
  const { logout } = useAuth();
  const { weeklyLimit, isLoading } = useSettings();

  const dailyTarget = weeklyLimit / 5;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', width: '100%' }}>
      {/* Welcome Card */}
      <div 
        className="glass-card" 
        style={{ 
          padding: 'var(--spacing-lg)', 
          borderRadius: 'var(--border-radius-md)', 
          background: 'var(--glass-bg)', 
          backdropFilter: 'var(--glass-backdrop-filter)', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Welcome to the Work Time Tracker application.
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--error-color)', 
            color: 'var(--error-color)', 
            padding: 'var(--spacing-sm) var(--spacing-md)', 
            borderRadius: 'var(--border-radius-sm)', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '0.875rem'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Metrics Row */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-md)',
          width: '100%'
        }}
      >
        {/* Weekly Limit Metric */}
        <div 
          className="glass-card" 
          style={{ 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--border-radius-md)', 
            background: 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-backdrop-filter)', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}
        >
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}>
            <Calendar size={24} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Goal</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {isLoading ? '...' : `${weeklyLimit.toFixed(1)} hrs`}
            </span>
          </div>
        </div>

        {/* Daily Target Metric */}
        <div 
          className="glass-card" 
          style={{ 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--border-radius-md)', 
            background: 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-backdrop-filter)', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}>
            <Clock size={24} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Target</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {isLoading ? '...' : `${dailyTarget.toFixed(1)} hrs`}
            </span>
          </div>
        </div>

        {/* Status/Consistency Metric */}
        <div 
          className="glass-card" 
          style={{ 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--border-radius-md)', 
            background: 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-backdrop-filter)', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}
        >
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}>
            <Award size={24} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
              Active Target
            </span>
          </div>
        </div>
      </div>

      {/* Settings section */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
        <WeeklyLimitInput />
      </div>
    </div>
  );
}
