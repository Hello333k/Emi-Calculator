import React, { useState } from 'react';

export default function SavingsEducation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '36px' }} aria-labelledby="savings-education-heading">
      <div className="accordion">
        <button
          type="button"
          className="accordion-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="savings-education-content"
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            <h2 id="savings-education-heading" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', display: 'inline' }}>
              How compound savings growth works
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
          <div id="savings-education-content" className="accordion-content">
            <div className="accordion-body">
              <p className="text-secondary" style={{ marginBottom: '16px' }}>
                Compound savings growth occurs when earnings generate their own earnings over successive periods.
                Your projected balance combines the growth of your initial principal with the accumulated future value of your recurring contributions.
              </p>

              {/* Mathematical Formula Box */}
              <div className="formula-box" style={{ textAlign: 'center', margin: '20px 0' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--accent-primary)', marginBottom: '8px' }}>
                  FV = P × (1 + i)<sup>n</sup> + PMT × [ ((1 + i)<sup>n</sup> − 1) / i ]
                </div>
                <div className="text-xs text-secondary">
                  Future value of initial principal + Future value of regular periodic contributions (ordinary annuity)
                </div>
              </div>

              {/* Variable Explanations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>P = Starting Balance</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                    The initial principal deposited at period zero.
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>PMT = Contribution</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                    The fixed amount deposited every period (monthly or yearly).
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>i = Periodic Growth Rate</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                    Effective rate earned per contribution period derived from the annual rate and compounding interval.
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>n = Total Periods</div>
                  <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                    Total number of deposits over the planned timeline (e.g. 60 months for 5 years).
                  </div>
                </div>
              </div>

              {/* APY vs Nominal Rate Note */}
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--accent-primary-light)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '4px solid var(--accent-primary)',
                marginTop: '16px',
              }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Nominal Interest Rate vs. Annual Percentage Yield (APY)
                </strong>
                <p className="text-secondary text-small" style={{ margin: 0 }}>
                  A nominal interest rate is the stated annual percentage before factoring in compounding.
                  In contrast, APY (Annual Percentage Yield) already accounts for the compounding frequency over a full year.
                  When APY is selected, the periodic rate is calculated as <code>(1 + APY)^(1/periods) − 1</code> so that compounding is not counted twice.
                </p>
              </div>

              {/* Disclaimer */}
              <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                These calculation models use standard financial formulas. Actual rates, compounding conventions, and tax treatments vary across institutions.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
