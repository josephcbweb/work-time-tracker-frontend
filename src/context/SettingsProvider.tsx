import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getSettings, updateSettings, APIError } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { SettingsContext } from './SettingsContext';
import type { SettingsContextType } from './SettingsContext';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [weeklyLimit, setWeeklyLimit] = useState<number>(40.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setWeeklyLimit(40.0);
      setError(null);
      return;
    }

    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSettings();
        setWeeklyLimit(data.weeklyLimit);
      } catch (err) {
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError('Failed to load settings.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated]);

  const saveWeeklyLimit = async (limit: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await updateSettings(limit);
      setWeeklyLimit(data.weeklyLimit);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to update weekly limit.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: SettingsContextType = {
    weeklyLimit,
    isLoading,
    error,
    saveWeeklyLimit,
    setError,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
