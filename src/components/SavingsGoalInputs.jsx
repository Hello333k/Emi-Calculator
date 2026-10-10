import React from 'react';
import NumericInput from './NumericInput';
import AnimatedSegmentedControl from './AnimatedSegmentedControl';

const quickTargetsSouthAsian = [
  { label: '10 Lakhs', value: 1000000 },
  { label: '25 Lakhs', value: 2500000 },
  { label: '50 Lakhs', value: 5000000 },
  { label: '1 Crore', value: 10000000 },
];

const quickTargetsStandard = [
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '500K', value: 500000 },
  { label: '1M', value: 1000000 },
];

export default function SavingsGoalInputs({
  goalSubMode,
  onGoalSubModeChange,
  targetAmount,
  onTargetAmountChange,
  currentSavings,
  onCurrentSavingsChange,
  goalContribution,
  onGoalContributionChange,
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
  const targetPills = isSouthAsian ? quickTargetsSouthAsian : quickTargetsStandard;

  return (
    <div>
      {/* ─── Goal Sub-Mode Toggle ─── */}
      <div style={{ marginBottom: '20px' }}>
        <label className="input-label" style={{ marginBottom: '8px' }}>What do you want to calculate?</label>
        <AnimatedSegmentedControl
          options={[
            { value: 'contribution', label: 'Required Contribution' },
            { value: 'time', label: 'Time to Goal' },
          ]}
          value={goalSubMode}
          onChange={onGoalSubModeChange}
          ariaLabel="Goal calculation mode"
          fullWidth
        />
      </div>

      {/* ─── Target Amount ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="input-label" htmlFor="goal-target-amount-input">Target goal amount</label>
          <span className="text-xs text-secondary">The amount you wish to accumulate</span>
        </div>

        <div className="input-wrapper">
          <span className="input-prefix">{currency}</span>
          <NumericInput
            id="goal-target-amount-input"
            className={`input-field has-prefix ${errors.targetAmount ? 'input-error' : ''}`}
            value={targetAmount}
            onChange={onTargetAmountChange}
            isDecimal={false}
            min={0}
            placeholder="e.g. 5000000"
            aria-invalid={!!errors.targetAmount}
            aria-describedby={errors.targetAmount ? 'goal-target-error' : undefined}
          />
        </div>
        {errors.targetAmount && (
          <div id="goal-target-error" className="error-message">{errors.targetAmount}</div>
        )}

        <div className="quick-amounts" style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {targetPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              className={`btn btn-secondary btn-sm ${Number(targetAmount) === pill.value ? 'btn-primary' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              onClick={() => onTargetAmountChange(pill.value)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Current Savings ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="input-label" htmlFor="goal-current-savings-input">Current savings</label>
          <span className="text-xs text-secondary">How much you have saved right now</span>
        </div>

        <div className="input-wrapper">
          <span className="input-prefix">{currency}</span>
          <NumericInput
            id="goal-current-savings-input"
            className={`input-field has-prefix ${errors.currentSavings ? 'input-error' : ''}`}
            value={currentSavings}
            onChange={onCurrentSavingsChange}
            isDecimal={false}
            min={0}
            placeholder="0"
          />
        </div>
      </div>

      {/* ─── If Sub-mode is "time": Regular Contribution Input ─── */}
      {/* ─── Dynamic Sub-mode Input Block with Smooth Cross-Fade ─── */}
      <div key={goalSubMode} className="page-route-enter">
        {goalSubMode === 'time' ? (
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="input-label" htmlFor="goal-contribution-input" style={{ marginBottom: 0 }}>
                Regular contribution
              </label>
              <AnimatedSegmentedControl
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' },
                ]}
                value={contributionFrequency}
                onChange={onContributionFrequencyChange}
                ariaLabel="Goal contribution frequency"
                size="sm"
              />
            </div>

            <div className="input-wrapper">
              <span className="input-prefix">{currency}</span>
              <NumericInput
                id="goal-contribution-input"
                className="input-field has-prefix"
                value={goalContribution}
                onChange={onGoalContributionChange}
                isDecimal={false}
                min={0}
                placeholder="e.g. 10000"
              />
              <span className="input-suffix">/{contributionFrequency === 'yearly' ? 'yr' : 'mo'}</span>
            </div>
          </div>
        ) : (
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Target timeline</label>
              <AnimatedSegmentedControl
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' },
                ]}
                value={contributionFrequency}
                onChange={onContributionFrequencyChange}
                ariaLabel="Target timeline frequency"
                size="sm"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-wrapper">
                <NumericInput
                  id="goal-time-years-input"
                  className={`input-field has-suffix ${errors.timeHorizon ? 'input-error' : ''}`}
                  value={timeYears}
                  onChange={onTimeYearsChange}
                  isDecimal={false}
                  min={0}
                  max={50}
                  placeholder="5"
                  aria-label="Target years"
                />
                <span className="input-suffix">Years</span>
              </div>

              <div className="input-wrapper">
                <NumericInput
                  id="goal-time-months-input"
                  className={`input-field has-suffix ${errors.timeHorizon ? 'input-error' : ''}`}
                  value={timeMonths}
                  onChange={onTimeMonthsChange}
                  isDecimal={false}
                  min={0}
                  max={11}
                  placeholder="0"
                  aria-label="Target months"
                />
                <span className="input-suffix">Months</span>
              </div>
            </div>
            {errors.timeHorizon && (
              <div className="error-message">{errors.timeHorizon}</div>
            )}
          </div>
        )}
      </div>

      {/* ─── Annual Rate & Compounding ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="input-label" htmlFor="goal-annual-rate-input" style={{ marginBottom: 0 }}>
            Expected annual rate
          </label>
          <AnimatedSegmentedControl
            options={[
              { value: 'nominal', label: 'Interest Rate' },
              { value: 'apy', label: 'APY' },
            ]}
            value={rateType}
            onChange={onRateTypeChange}
            ariaLabel="Goal rate type"
            size="sm"
          />
        </div>

        <div className="input-wrapper">
          <NumericInput
            id="goal-annual-rate-input"
            className={`input-field has-suffix ${errors.annualRate ? 'input-error' : ''}`}
            value={annualRate}
            onChange={onAnnualRateChange}
            isDecimal={true}
            min={0}
            max={100}
            placeholder="8"
          />
          <span className="input-suffix">%</span>
        </div>
      </div>

      {/* ─── Compounding Frequency ─── */}
      <div className="input-group">
        <label className="input-label" htmlFor="goal-compounding-frequency-select">Compounding frequency</label>
        <select
          id="goal-compounding-frequency-select"
          className="input-field"
          value={compoundingFrequency}
          onChange={(e) => onCompoundingFrequencyChange(e.target.value)}
          disabled={rateType === 'apy'}
          aria-label="Goal compounding frequency"
        >
          <option value="daily">Daily (365 times / year)</option>
          <option value="monthly">Monthly (12 times / year)</option>
          <option value="quarterly">Quarterly (4 times / year)</option>
          <option value="semi-annually">Semi-annually (2 times / year)</option>
          <option value="annually">Annually (1 time / year)</option>
        </select>
      </div>
    </div>
  );
}
