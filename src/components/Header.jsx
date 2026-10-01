import React from 'react';

export default function Header({
  currency,
  onCurrencyChange,
  theme,
  onThemeToggle,
  onReset,
  onShare
}) {
  return (
    <header className="header">
      <div className="header-logo">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="16" x2="16" y2="16" />
          </svg>
          <span className="header-wordmark">
            <span>E</span>MI
          </span>
        </a>
        <span className="header-descriptor">Loan calculator</span>
      </div>

      <div className="header-actions">
        <select 
          className="currency-select" 
          value={currency} 
          onChange={(e) => onCurrencyChange(e.target.value)}
          aria-label="Select currency"
        >
          <option value="NPR">NPR (रू)</option>
          <option value="USD">USD ($)</option>
          <option value="INR">INR (₹)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
        
        <button 
          className="theme-toggle" 
          onClick={onThemeToggle} 
          title={theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
          aria-label={theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button 
          className="theme-toggle" 
          onClick={onReset} 
          title="Reset to default values"
          aria-label="Reset calculator to defaults"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>

        <button 
          className="theme-toggle" 
          onClick={onShare} 
          title="Share calculation"
          aria-label="Share calculation link"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>
    </header>
  );
}
