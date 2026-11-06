// Tiny i18n helper: t('key') returns the string in the chosen language, falling back to English.
import { createContext, useContext } from 'react';
import { en, type TKey } from './en';

export type Lang = 'en' | 'mr';

export interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey) => string;
}

export const I18nContext = createContext<I18nValue>({ lang: 'en', setLang: () => undefined, t: (k) => en[k] });

export const useI18n = () => useContext(I18nContext);
