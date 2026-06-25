import { createContext } from 'react';

export interface SettingsContextType {
  weeklyLimit: number;
  isLoading: boolean;
  error: string | null;
  saveWeeklyLimit: (limit: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
