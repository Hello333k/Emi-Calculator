import React from 'react';

const currentYear = new Date().getFullYear();

export default function Footer({ onNavigate, currentRoute = 'emi' }) {
  const handleNav = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="disclaimer" style={{ marginBottom: '24px' }}>
          <strong>Estimates only.</strong> Actual payments and savings growth may vary due to institution-specific rounding, fees, compounding rules, payment timing, rate changes, taxes, insurance, or other account terms. This website is provided for educational and estimation purposes only and does not constitute financial advice.
        </div>
        <div className="footer-content">
          <div className="footer-text">
            <span>&copy; {currentYear} Financial Calculator Suite. All calculations performed client-side in your browser.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              style={{
                color: currentRoute === 'emi' ? 'var(--accent-primary)' : 'inherit',
                textDecoration: 'none',
                fontWeight: currentRoute === 'emi' ? 600 : 400,
              }}
            >
              EMI Calculator
            </a>
            <span>•</span>
            <a
              href="/savings"
              onClick={(e) => handleNav(e, '/savings')}
              style={{
                color: currentRoute === 'savings' ? 'var(--accent-primary)' : 'inherit',
                textDecoration: 'none',
                fontWeight: currentRoute === 'savings' ? 600 : 400,
              }}
            >
              Savings Calculator
            </a>
            <span>•</span>
            <span>Zero cookies • Zero tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
