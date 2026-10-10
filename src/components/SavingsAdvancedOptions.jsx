import React, { useState } from 'react';
import NumericInput from './NumericInput';
import AnimatedSegmentedControl from './AnimatedSegmentedControl';

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

      <div
        id="savings-advanced-options-content"
        className={`accordion-collapse ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="accordion-collapse-inner">
          <div className="accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* 1. Contribution Timing */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Contribution timing</label>
                <AnimatedSegmentedControl
                  options={[
                    { value: 'end', label: 'End of period' },
                    { value: 'beginning', label: 'Beginning of period' },
                  ]}
                  value={contributionTiming}
                  onChange={onContributionTimingChange}
                  ariaLabel="Contribution timing"
                  size="sm"
                />
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
                <NumericInput
                  id="annual-increase-input"
                  className="input-field has-suffix"
                  value={annualContributionIncrease || ''}
                  onChange={(val) => onAnnualContributionIncreaseChange(val === '' ? 0 : val)}
                  isDecimal={true}
                  min={0}
                  max={50}
                  fallbackOnBlur={true}
                  fallbackValue={0}
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

              <div
                className={`accordion-collapse ${oneTimeDepositEnabled ? 'open' : ''}`}
                aria-hidden={!oneTimeDepositEnabled}
              >
                <div className="accordion-collapse-inner">
                  <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label" htmlFor="one-time-amount-input">Deposit amount</label>
                      <div className="input-wrapper">
                        <span className="input-prefix">{currency}</span>
                        <NumericInput
                          id="one-time-amount-input"
                          className="input-field has-prefix"
                          value={oneTimeDepositAmount || ''}
                          onChange={(val) => onOneTimeDepositAmountChange(val === '' ? 0 : val)}
                          isDecimal={false}
                          min={0}
                          fallbackOnBlur={true}
                          fallbackValue={0}
                          placeholder="e.g. 50000"
                        />
                      </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label" htmlFor="one-time-period-input">Deposit at month</label>
                      <div className="input-wrapper">
                        <NumericInput
                          id="one-time-period-input"
                          className="input-field has-suffix"
                          value={oneTimeDepositPeriod || ''}
                          onChange={(val) => onOneTimeDepositPeriodChange(val === '' ? 1 : Math.max(1, val))}
                          isDecimal={false}
                          min={1}
                          max={600}
                          fallbackOnBlur={true}
                          fallbackValue={24}
                          placeholder="24"
                        />
                        <span className="input-suffix">Mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

              <div
                className={`accordion-collapse ${inflationEnabled ? 'open' : ''}`}
                aria-hidden={!inflationEnabled}
              >
                <div className="accordion-collapse-inner">
                  <div style={{ marginTop: '12px' }}>
                    <div className="input-wrapper">
                      <NumericInput
                        id="inflation-rate-input"
                        className="input-field has-suffix"
                        value={inflationRate}
                        onChange={(val) => onInflationRateChange(val === '' ? 0 : val)}
                        isDecimal={true}
                        min={0}
                        max={30}
                        fallbackOnBlur={true}
                        fallbackValue={3}
                        placeholder="3"
                      />
                      <span className="input-suffix">% / yr</span>
                    </div>
                    <p className="input-helper">
                      Estimates the real purchasing power of your final projected balance in today&apos;s money.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Annual Account Fee */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="input-label" htmlFor="annual-fee-input">Annual account fee</label>
                <span className="text-xs text-secondary">Maintenance or administration fee</span>
              </div>
              <div className="input-wrapper">
                <span className="input-prefix">{currency}</span>
                <NumericInput
                  id="annual-fee-input"
                  className="input-field has-prefix has-suffix"
                  value={annualFee || ''}
                  onChange={(val) => onAnnualFeeChange(val === '' ? 0 : val)}
                  isDecimal={false}
                  min={0}
                  fallbackOnBlur={true}
                  fallbackValue={0}
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

              <div
                className={`accordion-collapse ${scenarioEnabled ? 'open' : ''}`}
                aria-hidden={!scenarioEnabled}
              >
                <div className="accordion-collapse-inner">
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="text-xs text-secondary" htmlFor="scenario-low-input">Lower rate</label>
                        <div className="input-wrapper" style={{ marginTop: '4px' }}>
                          <NumericInput
                            id="scenario-low-input"
                            className="input-field has-suffix"
                            value={scenarioLowerRate}
                            onChange={(val) => onScenarioLowerRateChange(val === '' ? 0 : val)}
                            isDecimal={true}
                            min={0}
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
                          <NumericInput
                            id="scenario-high-input"
                            className="input-field has-suffix"
                            value={scenarioHigherRate}
                            onChange={(val) => onScenarioHigherRateChange(val === '' ? 0 : val)}
                            isDecimal={true}
                            min={0}
                            style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                          />
                          <span className="input-suffix">%</span>
                        </div>
                      </div>
                    </div>
                    <p className="input-helper">Compares hypothetical outcome variations without implying guaranteed performance.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
