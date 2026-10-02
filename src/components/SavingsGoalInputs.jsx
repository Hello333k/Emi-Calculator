import React from 'react';

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

  const handleTargetNum = (val) => {
    if (val === '') {
      onTargetAmountChange('');
    } else {
      const p = parseInt(val, 10);
      onTargetAmountChange(isNaN(p) ? 0 : Math.max(0, p));
    }
  };

  const handleCurrentSavingsNum = (val) => {
    if (val === '') {
      onCurrentSavingsChange('');
    } else {
      const p = parseInt(val, 10);
      onCurrentSavingsChange(isNaN(p) ? 0 : Math.max(0, p));
    }
  };

  const handleGoalContribNum = (val) => {
    if (val === '') {
      onGoalContributionChange('');
    } else {
      const p = parseInt(val, 10);
      onGoalContributionChange(isNaN(p) ? 0 : Math.max(0, p));
    }
  };

  return (
    <div>
      {/* ─── Goal Sub-Mode Toggle ─── */}
      <div style={{ marginBottom: '20px' }}>
        <label className="input-label" style={{ marginBottom: '8px' }}>What do you want to calculate?</label>
        <div className="segmented-control" style={{ width: '100%', display: 'flex' }} role="group" aria-label="Goal calculation goal mode">
          <button
            type="button"
            className={`segment-btn ${goalSubMode === 'contribution' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center' }}
            onClick={() => onGoalSubModeChange('contribution')}
          >
            Required Contribution
          </button>
          <button
            type="button"
            className={`segment-btn ${goalSubMode === 'time' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center' }}
            onClick={() => onGoalSubModeChange('time')}
          >
            Time to Goal
          </button>
        </div>
      </div>

      {/* ─── Target Amount ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="input-label" htmlFor="goal-target-amount-input">Target goal amount</label>
          <span className="text-xs text-secondary">The amount you wish to accumulate</span>
        </div>

        <div className="input-wrapper">
          <span className="input-prefix">{currency}</span>
          <input
            id="goal-target-amount-input"
            type="text"
            className={`input-field has-prefix ${errors.targetAmount ? 'input-error' : ''}`}
            value={targetAmount}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) handleTargetNum(e.target.value);
            }}
            inputMode="numeric"
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
          <input
            id="goal-current-savings-input"
            type="text"
            className={`input-field has-prefix ${errors.currentSavings ? 'input-error' : ''}`}
            value={currentSavings}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) handleCurrentSavingsNum(e.target.value);
            }}
            inputMode="numeric"
            placeholder="0"
          />
        </div>
      </div>

      {/* ─── If Sub-mode is "time": Regular Contribution Input ─── */}
      {goalSubMode === 'time' && (
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="input-label" htmlFor="goal-contribution-input" style={{ marginBottom: 0 }}>
              Regular contribution
            </label>
            <div className="segmented-control" role="group" aria-label="Goal contribution frequency">
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
            <input
              id="goal-contribution-input"
              type="text"
              className="input-field has-prefix"
              value={goalContribution}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) handleGoalContribNum(e.target.value);
              }}
              inputMode="numeric"
              placeholder="e.g. 10000"
            />
            <span className="input-suffix">/{contributionFrequency === 'yearly' ? 'yr' : 'mo'}</span>
          </div>
        </div>
      )}

      {/* ─── If Sub-mode is "contribution": Time Horizon Input ─── */}
      {goalSubMode === 'contribution' && (
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="input-label" style={{ marginBottom: 0 }}>Target timeline</label>
            <div className="segmented-control" role="group" aria-label="Target timeline frequency">
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-wrapper">
              <input
                id="goal-time-years-input"
                type="number"
                min="0"
                max="50"
                className={`input-field has-suffix ${errors.timeHorizon ? 'input-error' : ''}`}
                value={timeYears}
                onChange={(e) => onTimeYearsChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="5"
                aria-label="Target years"
              />
              <span className="input-suffix">Years</span>
            </div>

            <div className="input-wrapper">
              <input
                id="goal-time-months-input"
                type="number"
                min="0"
                max="11"
                className={`input-field has-suffix ${errors.timeHorizon ? 'input-error' : ''}`}
                value={timeMonths}
                onChange={(e) => onTimeMonthsChange(Math.min(11, Math.max(0, parseInt(e.target.value, 10) || 0)))}
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

      {/* ─── Annual Rate & Compounding ─── */}
      <div className="input-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="input-label" htmlFor="goal-annual-rate-input" style={{ marginBottom: 0 }}>
            Expected annual rate
          </label>
          <div className="segmented-control" role="group" aria-label="Goal rate type">
            <button
              type="button"
              className={`segment-btn ${rateType === 'nominal' ? 'active' : ''}`}
              onClick={() => onRateTypeChange('nominal')}
            >
              Interest Rate
            </button>
            <button
              type="button"
              className={`segment-btn ${rateType === 'apy' ? 'active' : ''}`}
              onClick={() => onRateTypeChange('apy')}
            >
              APY
            </button>
          </div>
        </div>

        <div className="input-wrapper">
          <input
            id="goal-annual-rate-input"
            type="number"
            step="0.1"
            min="0"
            max="100"
            className={`input-field has-suffix ${errors.annualRate ? 'input-error' : ''}`}
            value={annualRate}
            onChange={(e) => {
              const val = e.target.value;
              onAnnualRateChange(val === '' ? '' : parseFloat(val) || 0);
            }}
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
