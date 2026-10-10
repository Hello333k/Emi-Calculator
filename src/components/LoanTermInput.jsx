import React from 'react';
import NumericInput from './NumericInput';

const tenurePresets = [
  { label: '1 Yr', years: 1, months: 0 },
  { label: '3 Yrs', years: 3, months: 0 },
  { label: '5 Yrs', years: 5, months: 0 },
  { label: '10 Yrs', years: 10, months: 0 },
  { label: '15 Yrs', years: 15, months: 0 },
  { label: '20 Yrs', years: 20, months: 0 }
];

export default function LoanTermInput({
  years,
  months,
  onYearsChange,
  onMonthsChange,
  error
}) {
  const totalMonths = (parseInt(years, 10) || 0) * 12 + (parseInt(months, 10) || 0);

  const handleSliderChange = (e) => {
    const total = parseInt(e.target.value, 10);
    const newYears = Math.floor(total / 12);
    const newMonths = total % 12;
    onYearsChange(newYears);
    onMonthsChange(newMonths);
  };

  const handlePreset = (preset) => {
    onYearsChange(preset.years);
    onMonthsChange(preset.months);
  };

  const sliderVal = Math.min(Math.max(totalMonths, 1), 360);

  return (
    <div className="input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label className="input-label" htmlFor="tenure-years-input">Loan tenure</label>
        <span className="text-xs text-secondary">{totalMonths} months total ({totalMonths > 0 ? (totalMonths / 12).toFixed(1) : 0} years)</span>
      </div>

      <div className="term-inputs">
        <div className="input-wrapper">
          <NumericInput
            id="tenure-years-input"
            className={`input-field has-suffix ${error ? 'input-error' : ''}`}
            value={years}
            onChange={onYearsChange}
            isDecimal={false}
            min={0}
            max={40}
            placeholder="Years"
            aria-label="Tenure in years"
          />
          <span className="input-suffix">yr</span>
        </div>
        <div className="input-wrapper">
          <NumericInput
            id="tenure-months-input"
            className={`input-field has-suffix ${error ? 'input-error' : ''}`}
            value={months}
            onChange={onMonthsChange}
            isDecimal={false}
            min={0}
            max={11}
            placeholder="Months"
            aria-label="Tenure in additional months"
          />
          <span className="input-suffix">mo</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="slider-container">
        <input
          type="range"
          min={1}
          max={360}
          step={1}
          value={sliderVal}
          onChange={handleSliderChange}
          aria-label="Tenure total months slider"
        />
      </div>

      <div className="quick-amounts">
        {tenurePresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="quick-amount-btn"
            onClick={() => handlePreset(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
