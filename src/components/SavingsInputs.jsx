import React from 'react';
import NumericInput from './NumericInput';

const quickStartSouthAsian = [
  { label: '0', value: 0 },
  { label: '50K', value: 50000 },
  { label: '1 Lakh', value: 100000 },
  { label: '5 Lakhs', value: 500000 },
  { label: '10 Lakhs', value: 1000000 },
];

const quickStartStandard = [
  { label: '0', value: 0 },
  { label: '10K', value: 10000 },
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '250K', value: 250000 },
];

const quickContribSouthAsian = [
  { label: '0', value: 0 },
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: '25K', value: 25000 },
  { label: '50K', value: 50000 },
];

const quickContribStandard = [
  { label: '0', value: 0 },
  { label: '250', value: 250 },
  { label: '500', value: 500 },
  { label: '1K', value: 1000 },
  { label: '2.5K', value: 2500 },
];

const quickHorizons = [
  { label: '1Y', years: 1 },
  { label: '3Y', years: 3 },
  { label: '5Y', years: 5 },
  { label: '10Y', years: 10 },
  { label: '20Y', years: 20 },
  { label: '30Y', years: 30 },
];

export default function SavingsInputs({
  startingBalance,
  onStartingBalanceChange,
  contributionAmount,
  onContributionAmountChange,
  contributionFrequency,
  onContributionFrequencyChange,
  annualRate,
  onAnnualRateChange,
  rateType,
  onRateTypeChange,
  compoundingFrequency,
  onCompoundingFrequencyChange,
  timeYears,
  onTimeYearsChange,
  timeMonths,
  onTimeMonthsChange,
  currency,
  errors = {},
}) {
  const isSouthAsian = currency === 'NPR' || currency === 'INR';
  const startPills = isSouthAsian ? quickStartSouthAsian : quickStartStandard;
  const contribPills = isSouthAsian ? quickContribSouthAsian : quickContribStandard;

  return (
    <div>
      {/* ─── Starting Balance ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="input-label" htmlFor="starting-balance-input">Starting balance</label>
          <span className="text-xs text-secondary">Initial savings already held</span>
        </div>

        <div className="input-wrapper">
          <span className="input-prefix">{currency}</span>
          <NumericInput
            id="starting-balance-input"
            className={`input-field has-prefix ${errors.startingBalance ? 'input-error' : ''}`}
            value={startingBalance}
            onChange={onStartingBalanceChange}
            isDecimal={false}
            min={0}
            placeholder="0"
            aria-invalid={!!errors.startingBalance}
            aria-describedby={errors.startingBalance ? 'starting-balance-error' : undefined}
          />
        </div>
        {errors.startingBalance && (
          <div id="starting-balance-error" className="error-message">{errors.startingBalance}</div>
        )}

        <div className="quick-amounts" style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {startPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              className={`btn btn-secondary btn-sm ${Number(startingBalance) === pill.value ? 'btn-primary' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              onClick={() => onStartingBalanceChange(pill.value)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Regular Contribution & Frequency ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="input-label" htmlFor="contribution-amount-input" style={{ marginBottom: 0 }}>
            Regular contribution
          </label>
          {/* Frequency Toggle */}
          <div className="segmented-control" role="group" aria-label="Contribution frequency">
            <button
              type="button"
              className={`segment-btn ${contributionFrequency === 'monthly' ? 'active' : ''}`}
              onClick={() => onContributionFrequencyChange('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`segment-btn ${contributionFrequency === 'yearly' ? 'active' : ''}`}
              onClick={() => onContributionFrequencyChange('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="input-wrapper">
          <span className="input-prefix">{currency}</span>
          <NumericInput
            id="contribution-amount-input"
            className={`input-field has-prefix ${errors.contributionAmount ? 'input-error' : ''}`}
            value={contributionAmount}
            onChange={onContributionAmountChange}
            isDecimal={false}
            min={0}
            placeholder="0"
            aria-invalid={!!errors.contributionAmount}
            aria-describedby={errors.contributionAmount ? 'contribution-amount-error' : undefined}
          />
          <span className="input-suffix" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            /{contributionFrequency === 'yearly' ? 'yr' : 'mo'}
          </span>
        </div>
        {errors.contributionAmount && (
          <div id="contribution-amount-error" className="error-message">{errors.contributionAmount}</div>
        )}

        <div className="quick-amounts" style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {contribPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              className={`btn btn-secondary btn-sm ${Number(contributionAmount) === pill.value ? 'btn-primary' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              onClick={() => onContributionAmountChange(pill.value)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Annual Rate & Rate Type ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="input-label" htmlFor="annual-rate-input" style={{ marginBottom: 0 }}>
            Annual rate
          </label>
          {/* Rate Type Selector */}
          <div className="segmented-control" role="group" aria-label="Rate type">
            <button
              type="button"
              className={`segment-btn ${rateType === 'nominal' ? 'active' : ''}`}
              onClick={() => onRateTypeChange('nominal')}
              title="Nominal annual interest rate (e.g. quoted APR)"
            >
              Interest Rate
            </button>
            <button
              type="button"
              className={`segment-btn ${rateType === 'apy' ? 'active' : ''}`}
              onClick={() => onRateTypeChange('apy')}
              title="Annual Percentage Yield (APY reflects compounding)"
            >
              APY
            </button>
          </div>
        </div>

        <div className="input-wrapper">
          <NumericInput
            id="annual-rate-input"
            className={`input-field has-suffix ${errors.annualRate ? 'input-error' : ''}`}
            value={annualRate}
            onChange={onAnnualRateChange}
            isDecimal={true}
            min={0}
            max={100}
            placeholder="8"
            aria-invalid={!!errors.annualRate}
            aria-describedby={errors.annualRate ? 'annual-rate-error' : undefined}
          />
          <span className="input-suffix">%</span>
        </div>
        {errors.annualRate && (
          <div id="annual-rate-error" className="error-message">{errors.annualRate}</div>
        )}

        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="25"
            step="0.25"
            value={Math.min(Math.max(Number(annualRate) || 0, 0), 25)}
            onChange={(e) => onAnnualRateChange(parseFloat(e.target.value))}
            aria-label="Annual rate slider"
          />
        </div>
      </div>

      {/* ─── Compounding Frequency ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="input-label" htmlFor="compounding-frequency-select">Compounding frequency</label>
          <span className="text-xs text-secondary">
            {rateType === 'apy' ? 'Yield already reflects compounding' : 'Growth calculation interval'}
          </span>
        </div>

        <select
          id="compounding-frequency-select"
          className="input-field"
          value={compoundingFrequency}
          onChange={(e) => onCompoundingFrequencyChange(e.target.value)}
          disabled={rateType === 'apy'}
          style={{ cursor: rateType === 'apy' ? 'not-allowed' : 'pointer' }}
          aria-label="Compounding frequency"
        >
          <option value="daily">Daily (365 times / year)</option>
          <option value="monthly">Monthly (12 times / year)</option>
          <option value="quarterly">Quarterly (4 times / year)</option>
          <option value="semi-annually">Semi-annually (2 times / year)</option>
          <option value="annually">Annually (1 time / year)</option>
        </select>
      </div>

      {/* ─── Time Horizon (Years & Months) ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="input-label" htmlFor="time-years-input">Time horizon</label>
          <span className="text-xs text-secondary">Duration of savings plan</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="input-wrapper">
            <NumericInput
              id="time-years-input"
              className={`input-field has-suffix ${errors.timeHorizon ? 'input-error' : ''}`}
              value={timeYears}
              onChange={onTimeYearsChange}
              isDecimal={false}
              min={0}
              max={50}
              placeholder="5"
              aria-label="Years"
            />
            <span className="input-suffix">Years</span>
          </div>

          <div className="input-wrapper">
            <NumericInput
              id="time-months-input"
              className={`input-field has-suffix ${errors.timeHorizon ? 'input-error' : ''}`}
              value={timeMonths}
              onChange={onTimeMonthsChange}
              isDecimal={false}
              min={0}
              max={11}
              placeholder="0"
              aria-label="Months"
            />
            <span className="input-suffix">Months</span>
          </div>
        </div>

        {errors.timeHorizon && (
          <div className="error-message">{errors.timeHorizon}</div>
        )}

        <div className="slider-container">
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={Math.min(Math.max(Number(timeYears) || 1, 1), 50)}
            onChange={(e) => onTimeYearsChange(parseInt(e.target.value, 10))}
            aria-label="Time horizon years slider"
          />
        </div>

        {/* Quick Horizon Buttons */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {quickHorizons.map((h) => (
            <button
              key={h.label}
              type="button"
              className={`btn btn-secondary btn-sm ${Number(timeYears) === h.years && Number(timeMonths) === 0 ? 'btn-primary' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              onClick={() => {
                onTimeYearsChange(h.years);
                onTimeMonthsChange(0);
              }}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
