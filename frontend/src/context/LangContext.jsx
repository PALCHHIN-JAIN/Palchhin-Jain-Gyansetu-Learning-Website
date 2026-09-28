import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getTranslation } from '../utils/translations';
import { useAuth } from './AuthContext';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [isTranslating, setIsTranslating] = useState(false);
  const { user, updateLanguage } = useAuth();
  const translateTimer = useRef(null);

  // On first mount, restore previously saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    if (savedLang !== 'en') {
      // Wait for Google Translate widget to fully load (it loads async)
      const waitAndTranslate = (attempts = 0) => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          triggerTranslate(savedLang);
        } else if (attempts < 20) {
          setTimeout(() => waitAndTranslate(attempts + 1), 400);
        }
      };
      setTimeout(() => waitAndTranslate(), 800);
    }
  }, []);

  // Sync with user preference from DB
  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== lang) {
      setLang(user.preferredLanguage);
      triggerTranslate(user.preferredLanguage);
    }
  }, [user]);

  const triggerTranslate = (langCode) => {
    if (translateTimer.current) clearTimeout(translateTimer.current);

    if (langCode === 'en') {
      // Restore original English — need page reload or close banner
      localStorage.removeItem('gtLang');
      // Clear the googtrans cookie
      const cookieStr = 'googtrans=/en/en; path=/;';
      document.cookie = cookieStr;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // Try to find and click the restore button in the iframe
      try {
        const frame = document.querySelector('.goog-te-banner-frame');
        if (frame && frame.contentDocument) {
          const btn = frame.contentDocument.querySelector('.goog-te-banner-close');
          if (btn) { btn.click(); return; }
        }
      } catch {}
      // Fallback: reload page (needed to remove translation)
      window.location.reload();
      return;
    }

    // Save lang code for restoration on page load
    localStorage.setItem('gtLang', langCode);

    // Set googtrans cookie (Google Translate reads this)
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;

    // Try to find the hidden select element from Google Translate widget
    const doTranslate = (attempts = 0) => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('change'));
      } else if (attempts < 15) {
        translateTimer.current = setTimeout(() => doTranslate(attempts + 1), 300);
      }
    };
    doTranslate();
  };

  const t = (key) => getTranslation(lang, key);

  const changeLang = async (newLang) => {
    if (newLang === lang) return;
    setIsTranslating(true);
    setLang(newLang);
    localStorage.setItem('lang', newLang);

    triggerTranslate(newLang);

    if (user) {
      try { await updateLanguage(newLang); } catch {}
    }

    // Stop translating indicator after a moment
    setTimeout(() => setIsTranslating(false), 2000);
  };

  return (
    <LangContext.Provider value={{ lang, t, changeLang, isTranslating }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
