import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import NumericInput from './NumericInput';

export default function ExtraPaymentSimulator({
  extraMonthly,
  onExtraMonthlyChange,
  extraAnnual,
  onExtraAnnualChange,
  extraOneTime,
  onExtraOneTimeChange,
  scenario,
  currency,
  isValid
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isValid) return null;

  const hasExtra = (extraMonthly > 0 || extraAnnual > 0 || extraOneTime > 0) && scenario;

  return (
    <div className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '32px' }}>
      <div className="accordion">
        <button 
          type="button"
          className="accordion-trigger" 
          aria-expanded={isOpen} 
          aria-controls="extra-payment-content"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>What happens if you pay extra?</span>
            {hasExtra && (
              <span style={{ fontSize: '0.75rem', fontWeight: 500, backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                Active simulation
              </span>
            )}
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
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        
        <div 
          id="extra-payment-content" 
          className={`accordion-collapse ${isOpen ? 'open' : ''}`}
          aria-hidden={!isOpen}
        >
          <div className="accordion-collapse-inner">
            <div className="accordion-body">
              <p className="text-secondary text-small" style={{ marginBottom: '20px' }}>
                Simulate paying more towards the loan principal. Extra payments go directly towards reducing principal balance, shortening tenure and saving total interest.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="extra-monthly">Extra monthly payment</label>
                  <div className="input-wrapper">
                    <span className="input-prefix">{currency}</span>
                    <NumericInput 
                      id="extra-monthly"
                      className="input-field has-prefix"
                      placeholder="0"
                      value={extraMonthly > 0 ? extraMonthly : ''}
                      onChange={(val) => onExtraMonthlyChange(val === '' ? 0 : val)}
                      fallbackOnBlur={true}
                      fallbackValue={0}
                      isDecimal={false}
                      min={0}
                    />
                  </div>
                  <span className="input-helper">Added to each monthly EMI</span>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="extra-annual">Extra annual payment</label>
                  <div className="input-wrapper">
                    <span className="input-prefix">{currency}</span>
                    <NumericInput 
                      id="extra-annual"
                      className="input-field has-prefix"
                      placeholder="0"
                      value={extraAnnual > 0 ? extraAnnual : ''}
                      onChange={(val) => onExtraAnnualChange(val === '' ? 0 : val)}
                      fallbackOnBlur={true}
                      fallbackValue={0}
                      isDecimal={false}
                      min={0}
                    />
                  </div>
                  <span className="input-helper">Paid once every 12 months</span>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="extra-onetime">One-time extra payment</label>
                  <div className="input-wrapper">
                    <span className="input-prefix">{currency}</span>
                    <NumericInput 
                      id="extra-onetime"
                      className="input-field has-prefix"
                      placeholder="0"
                      value={extraOneTime > 0 ? extraOneTime : ''}
                      onChange={(val) => onExtraOneTimeChange(val === '' ? 0 : val)}
                      fallbackOnBlur={true}
                      fallbackValue={0}
                      isDecimal={false}
                      min={0}
                    />
                  </div>
                  <span className="input-helper">Lump sum in month 1</span>
                </div>
              </div>

              {hasExtra ? (
                <div className="extra-payment-result" style={{ border: '1px solid var(--border-color)', marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Estimated Impact</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time saved</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>
                        {scenario.monthsSaved} {scenario.monthsSaved === 1 ? 'month' : 'months'}
                      </div>
                      <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                        New tenure: {scenario.newYears}y {scenario.newMonths}m
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interest saved</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>
                        {formatCurrency(scenario.interestSaved, currency)}
                      </div>
                      <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                        {scenario.totalInterestBefore > 0 
                          ? `${((scenario.interestSaved / scenario.totalInterestBefore) * 100).toFixed(1)}% of total interest` 
                          : '0%'}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-secondary" style={{ lineHeight: 1.5 }}>
                    Paying extra principal accelerates amortization. Total interest reduced from{' '}
                    <strong>{formatCurrency(scenario.totalInterestBefore, currency)}</strong> to{' '}
                    <strong>{formatCurrency(scenario.newTotalInterest, currency)}</strong>.
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Enter any extra payment amount above to see how much faster you could be debt-free and how much interest you could save.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
