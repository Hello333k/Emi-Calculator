import React, { useState } from 'react';

export default function SavingsAdvancedOptions({
  contributionTiming,
  onContributionTimingChange,
  annualContributionIncrease,
  onAnnualContributionIncreaseChange,
  oneTimeDepositEnabled,
  onOneTimeDepositEnabledChange,
  oneTimeDepositAmount,
  onOneTimeDepositAmountChange,
  oneTimeDepositPeriod,
  onOneTimeDepositPeriodChange,
  inflationEnabled,
  onInflationEnabledChange,
  inflationRate,
  onInflationRateChange,
  annualFee,
  onAnnualFeeChange,
  scenarioEnabled,
  onScenarioEnabledChange,
  scenarioLowerRate,
  onScenarioLowerRateChange,
  scenarioHigherRate,
  onScenarioHigherRateChange,
  baseRate,
  currency,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = [
    contributionTiming === 'beginning',
    Number(annualContributionIncrease) > 0,
    oneTimeDepositEnabled && Number(oneTimeDepositAmount) > 0,
    inflationEnabled,
    Number(annualFee) > 0,
    scenarioEnabled,
  ].filter(Boolean).length;

  return (
    <div className="accordion" style={{ marginTop: '20px' }}>
      <button
        type="button"
        className="accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="savings-advanced-options-content"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Advanced assumptions</span>
          {activeCount > 0 && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
            }}>
              {activeCount} active
            </span>
          )}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-fast)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div id="savings-advanced-options-content" className="accordion-content">
          <div className="accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* 1. Contribution Timing */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Contribution timing</label>
                <div className="segmented-control" role="group" aria-label="Contribution timing">
                  <button
                    type="button"
                    className={`segment-btn ${contributionTiming === 'end' ? 'active' : ''}`}
                    onClick={() => onContributionTimingChange('end')}
                  >
                    End of period
                  </button>
                  <button
                    type="button"
                    className={`segment-btn ${contributionTiming === 'beginning' ? 'active' : ''}`}
                    onClick={() => onContributionTimingChange('beginning')}
                  >
                    Beginning of period
                  </button>
                </div>
              </div>
              <p className="input-helper">
                {contributionTiming === 'end'
                  ? 'End of period: deposit is added after interest for that period has been calculated (standard).'
                  : 'Beginning of period: deposit is added before interest is calculated, earning growth in its first period.'}
              </p>
            </div>

            {/* 2. Annual Contribution Increase (Step-up) */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="input-label" htmlFor="annual-increase-input">Annual contribution increase</label>
                <span className="text-xs text-secondary">Step-up percentage each year</span>
              </div>
              <div className="input-wrapper">
                <input
                  id="annual-increase-input"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  className="input-field has-suffix"
                  value={annualContributionIncrease || ''}
                  onChange={(e) => onAnnualContributionIncreaseChange(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
                <span className="input-suffix">% / yr</span>
              </div>
              <p className="input-helper">Increases your contribution by this percentage at the start of each new year.</p>
            </div>

            {/* 3. One-Time Additional Deposit */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={oneTimeDepositEnabled}
                  onChange={(e) => onOneTimeDepositEnabledChange(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                />
                <span>One-time additional deposit</span>
              </label>

              {oneTimeDepositEnabled && (
                <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="one-time-amount-input">Deposit amount</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">{currency}</span>
                      <input
                        id="one-time-amount-input"
                        type="number"
                        min="0"
                        className="input-field has-prefix"
                        value={oneTimeDepositAmount || ''}
                        onChange={(e) => onOneTimeDepositAmountChange(Math.max(0, parseFloat(e.target.value) || 0))}
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="one-time-period-input">Deposit at month</label>
                    <div className="input-wrapper">
                      <input
                        id="one-time-period-input"
                        type="number"
                        min="1"
                        max="600"
                        className="input-field has-suffix"
                        value={oneTimeDepositPeriod || ''}
                        onChange={(e) => onOneTimeDepositPeriodChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        placeholder="24"
                      />
                      <span className="input-suffix">Mo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Inflation Adjustment */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={inflationEnabled}
                  onChange={(e) => onInflationEnabledChange(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                />
                <span>Adjust for inflation (today&apos;s money value)</span>
              </label>

              {inflationEnabled && (
                <div style={{ marginTop: '12px' }}>
                  <div className="input-wrapper">
                    <input
                      id="inflation-rate-input"
                      type="number"
                      min="0"
                      max="30"
                      step="0.5"
                      className="input-field has-suffix"
                      value={inflationRate}
                      onChange={(e) => onInflationRateChange(parseFloat(e.target.value) || 0)}
                      placeholder="3"
                    />
                    <span className="input-suffix">% / yr</span>
                  </div>
                  <p className="input-helper">
                    Estimates the real purchasing power of your final projected balance in today&apos;s money.
                  </p>
                </div>
              )}
            </div>

            {/* 5. Annual Account Fee */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="input-label" htmlFor="annual-fee-input">Annual account fee</label>
                <span className="text-xs text-secondary">Maintenance or administration fee</span>
              </div>
              <div className="input-wrapper">
                <span className="input-prefix">{currency}</span>
                <input
                  id="annual-fee-input"
                  type="number"
                  min="0"
                  className="input-field has-prefix has-suffix"
                  value={annualFee || ''}
                  onChange={(e) => onAnnualFeeChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                />
                <span className="input-suffix">/ yr</span>
              </div>
              <p className="input-helper">Deducted once per year from the accumulated balance.</p>
            </div>

            {/* 6. Compare Scenarios */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={scenarioEnabled}
                  onChange={(e) => onScenarioEnabledChange(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                />
                <span>Compare rate scenarios (sensitivity analysis)</span>
              </label>

              {scenarioEnabled && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="text-xs text-secondary" htmlFor="scenario-low-input">Lower rate</label>
                      <div className="input-wrapper" style={{ marginTop: '4px' }}>
                        <input
                          id="scenario-low-input"
                          type="number"
                          step="0.5"
                          min="0"
                          className="input-field has-suffix"
                          value={scenarioLowerRate}
                          onChange={(e) => onScenarioLowerRateChange(parseFloat(e.target.value) || 0)}
                          style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        />
                        <span className="input-suffix">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-secondary">Base rate</label>
                      <div className="input-wrapper" style={{ marginTop: '4px' }}>
                        <input
                          type="text"
                          readOnly
                          className="input-field has-suffix"
                          value={baseRate}
                          style={{ padding: '8px 10px', fontSize: '0.85rem', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}
                        />
                        <span className="input-suffix">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-secondary" htmlFor="scenario-high-input">Higher rate</label>
                      <div className="input-wrapper" style={{ marginTop: '4px' }}>
                        <input
                          id="scenario-high-input"
                          type="number"
                          step="0.5"
                          min="0"
                          className="input-field has-suffix"
                          value={scenarioHigherRate}
                          onChange={(e) => onScenarioHigherRateChange(parseFloat(e.target.value) || 0)}
                          style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        />
                        <span className="input-suffix">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="input-helper">Compares hypothetical outcome variations without implying guaranteed performance.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
