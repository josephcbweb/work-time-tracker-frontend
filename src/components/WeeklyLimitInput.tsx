import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Clock, AlertCircle, Check } from 'lucide-react';
import '../styles/settings.css';

export default function WeeklyLimitInput() {
  const { weeklyLimit, saveWeeklyLimit, isLoading, error: contextError, setError } = useSettings();
  const [inputValue, setInputValue] = useState<string>(weeklyLimit.toFixed(1));
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(weeklyLimit.toFixed(1));
  }, [weeklyLimit]);

  const validateInput = (val: string): number | null => {
    const num = parseFloat(val);
    
    if (isNaN(num)) {
      setLocalError('Please enter a valid number.');
      return null;
    }

    if (num < 0.5 || num > 168.0) {
      setLocalError('Weekly limit must be between 0.5 and 168.0 hours.');
      return null;
    }

    // Check decimal places: up to 1 decimal place
    const decimalMatch = val.match(/^\d+(\.\d+)?$/);
    if (!decimalMatch) {
      setLocalError('Please enter a valid positive decimal number.');
      return null;
    }
    const parts = val.split('.');
    if (parts.length > 1 && parts[1].length > 1) {
      setLocalError('Weekly limit supports up to 1 decimal place.');
      return null;
    }

    setLocalError(null);
    return num;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);
    setShowSuccess(false);

    const validNum = validateInput(inputValue);
    if (validNum === null) {
      return;
    }

    try {
      await saveWeeklyLimit(validNum);
      setShowSuccess(true);
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch {
      // Error handled by context
    }
  };

  const handleCancel = () => {
    setInputValue(weeklyLimit.toFixed(1));
    setLocalError(null);
    setError(null);
    setShowSuccess(false);
  };

  const displayError = localError || contextError;

  return (
    <div className="settings-card">
      <div className="settings-header">
        <h3 className="settings-title">
          <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
          Configure Weekly Limit
        </h3>
      </div>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className="settings-input-group">
          <label htmlFor="weeklyLimitInput" className="settings-input-label">
            Weekly Hours Target
          </label>
          <div className="settings-input-wrapper">
            <input
              id="weeklyLimitInput"
              type="text"
              className="settings-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. 40.0"
            />
            <Clock className="settings-input-icon" size={16} />
          </div>
          {displayError && (
            <span className="settings-error-text" role="alert">
              <AlertCircle size={14} />
              {displayError}
            </span>
          )}
        </div>

        <div className="settings-actions">
          <button type="submit" className="settings-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="settings-spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Limit</span>
            )}
          </button>
          
          <button
            type="button"
            className="settings-cancel-btn"
            onClick={handleCancel}
            disabled={isLoading || inputValue === weeklyLimit.toFixed(1)}
          >
            Cancel
          </button>
        </div>
      </form>

      {showSuccess && !displayError && (
        <div className="settings-success-alert" role="status">
          <Check size={16} />
          <span>Weekly limit updated successfully.</span>
        </div>
      )}
    </div>
  );
}
