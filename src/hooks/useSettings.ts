import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import type { SettingsContextType } from '../context/SettingsContext';

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
