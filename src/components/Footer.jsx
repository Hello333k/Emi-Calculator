import React from 'react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="disclaimer" style={{ marginBottom: '24px' }}>
          <strong>Estimates only.</strong> Actual payments may vary due to lender-specific rounding, fees, payment timing, rate changes, taxes, insurance, or other loan terms. This tool is provided for educational and estimation purposes only and does not constitute financial advice.
        </div>
        <div className="footer-content">
          <div className="footer-text">
            <span>&copy; {currentYear} EMI Calculator. All calculations performed client-side in your browser.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            <span>Fixed rate • reducing balance</span>
            <span>•</span>
            <span>Zero cookies • Zero tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
