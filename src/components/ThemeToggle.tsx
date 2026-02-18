"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle(){
  const [theme, setTheme] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    const saved = localStorage.getItem('mc-theme');
    if (saved) return saved;
    const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return sysDark ? 'dark' : 'light';
  });
  useEffect(()=>{
    if (!theme) return;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mc-theme', theme); } catch {}
  },[theme]);
  const toggle = ()=>{
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };
  return (
    <button type="button" onClick={toggle} className="btn" aria-label="Toggle theme">
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
