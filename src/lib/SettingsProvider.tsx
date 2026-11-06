import React, { useEffect, useState } from 'react';
import { api } from './api';
import { SettingsContext } from './content';
import { defaultSettings } from '../data/site';
import type { SiteSettings } from '../data/types';

/** Loads Society-wide settings (contact details, toggles...) once for the whole site. */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  useEffect(() => {
    api
      .get<Partial<SiteSettings>>('/settings')
      .then((s) => setSettings({ ...defaultSettings, ...s }))
      .catch(() => undefined);
  }, []);
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};
