import React, { useState } from 'react';

export default function EducationSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '32px' }} aria-labelledby="how-emi-calculated-heading">
      <div className="accordion">
        <button 
          type="button"
          className="accordion-trigger" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="education-content"
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            <h2 id="how-emi-calculated-heading" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', display: 'inline' }}>
              How EMI is calculated
            </h2>
          </span>
          <svg 
            width="20"
            height="20"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-normal)' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && (
          <div id="education-content" className="accordion-content">
            <div className="accordion-body">
              <p className="text-secondary" style={{ marginBottom: '16px' }}>
                An Equated Monthly Instalment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. This calculator uses the standard reducing-balance amortization methodology.
              </p>
              
              <div className="formula-box" style={{ textAlign: 'center', margin: '20px 0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--accent-primary)' }}>
                  E = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> − 1)
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>E = Monthly EMI</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>The fixed monthly repayment amount</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>P = Principal</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>The original loan amount borrowed</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>r = Periodic Rate</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>Annual interest rate ÷ 12 ÷ 100</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>n = Number of Months</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>Total repayment instalments (Years × 12 + Months)</div>
                </div>
              </div>
              
              <div className="disclaimer" style={{ marginTop: '16px' }}>
                <strong>Zero-Interest Handling:</strong> When the annual interest rate is 0%, the compounding formula evaluates to zero in the denominator. In this scenario, the calculator automatically applies the linear formula <code>EMI = P / n</code>, with zero total interest.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
