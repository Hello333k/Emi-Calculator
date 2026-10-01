import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

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

  const [localMonthly, setLocalMonthly] = useState(extraMonthly > 0 ? extraMonthly.toString() : '');
  const [prevMonthly, setPrevMonthly] = useState(extraMonthly);

  const [localAnnual, setLocalAnnual] = useState(extraAnnual > 0 ? extraAnnual.toString() : '');
  const [prevAnnual, setPrevAnnual] = useState(extraAnnual);

  const [localOneTime, setLocalOneTime] = useState(extraOneTime > 0 ? extraOneTime.toString() : '');
  const [prevOneTime, setPrevOneTime] = useState(extraOneTime);

  // Sync state during render when props change externally (e.g. reset)
  if (extraMonthly !== prevMonthly) {
    setPrevMonthly(extraMonthly);
    setLocalMonthly(extraMonthly > 0 ? extraMonthly.toString() : '');
  }

  if (extraAnnual !== prevAnnual) {
    setPrevAnnual(extraAnnual);
    setLocalAnnual(extraAnnual > 0 ? extraAnnual.toString() : '');
  }

  if (extraOneTime !== prevOneTime) {
    setPrevOneTime(extraOneTime);
    setLocalOneTime(extraOneTime > 0 ? extraOneTime.toString() : '');
  }

  const handleMonthlyChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setLocalMonthly(val);
      onExtraMonthlyChange(val === '' ? 0 : parseInt(val, 10) || 0);
    }
  };

  const handleAnnualChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setLocalAnnual(val);
      onExtraAnnualChange(val === '' ? 0 : parseInt(val, 10) || 0);
    }
  };

  const handleOneTimeChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setLocalOneTime(val);
      onExtraOneTimeChange(val === '' ? 0 : parseInt(val, 10) || 0);
    }
  };

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
        
        {isOpen && (
          <div id="extra-payment-content" className="accordion-content">
            <div className="accordion-body">
              <p className="text-secondary text-small" style={{ marginBottom: '20px' }}>
                Simulate paying more towards the loan principal. Extra payments go directly towards reducing principal balance, shortening tenure and saving total interest.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="extra-monthly">Extra monthly payment</label>
                  <div className="input-wrapper">
                    <span className="input-prefix">{currency}</span>
                    <input 
                      id="extra-monthly"
                      type="text" 
                      inputMode="numeric"
                      className="input-field has-prefix"
                      placeholder="0"
                      value={localMonthly}
                      onChange={handleMonthlyChange}
                    />
                  </div>
                  <span className="input-helper">Added to each monthly EMI</span>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="extra-annual">Extra annual payment</label>
                  <div className="input-wrapper">
                    <span className="input-prefix">{currency}</span>
                    <input 
                      id="extra-annual"
                      type="text" 
                      inputMode="numeric"
                      className="input-field has-prefix"
                      placeholder="0"
                      value={localAnnual}
                      onChange={handleAnnualChange}
                    />
                  </div>
                  <span className="input-helper">Paid once every 12 months</span>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" htmlFor="extra-onetime">One-time extra payment</label>
                  <div className="input-wrapper">
                    <span className="input-prefix">{currency}</span>
                    <input 
                      id="extra-onetime"
                      type="text" 
                      inputMode="numeric"
                      className="input-field has-prefix"
                      placeholder="0"
                      value={localOneTime}
                      onChange={handleOneTimeChange}
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
                        {Math.floor(scenario.monthsSaved / 12)}y {scenario.monthsSaved % 12}m earlier
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interest saved</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }} className="tabular-nums">
                        {formatCurrency(scenario.interestSaved, currency)}
                      </div>
                      <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                        Reduced interest cost
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>New total interest</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }} className="tabular-nums">
                        {formatCurrency(scenario.totalInterest, currency)}
                      </div>
                      <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                        vs. {formatCurrency(scenario.originalTotalInterest, currency)} original
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>New loan payoff</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>
                        {scenario.newPayoffMonths} months
                      </div>
                      <div className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                        vs. {scenario.originalPayoffMonths} months original
                      </div>
                    </div>
                  </div>

                  <div className="disclaimer" style={{ margin: 0, backgroundColor: 'transparent', padding: 0 }}>
                    Based on the assumptions entered above. Extra payments are assumed to immediately reduce loan principal without prepayment penalty.
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Enter any extra payment amount above to see how much interest and time you could save.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
