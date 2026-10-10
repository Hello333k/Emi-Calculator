import React from 'react';
import NumericInput from './NumericInput';

const commonRates = [6.5, 8.0, 9.5, 10.0, 12.0, 14.0];

export default function InterestRateInput({
  value,
  onChange,
  error,
  min = 0,
  max = 30
}) {
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    onChange(val);
  };

  const sliderVal = typeof value === 'number' && !isNaN(value) ? Math.min(Math.max(value, min), max) : min;

  return (
    <div className="input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label className="input-label" htmlFor="interest-rate-input">Annual interest rate</label>
        <span className="text-xs text-secondary">0% to 30% • Fixed reducing balance</span>
      </div>

      <div className="input-wrapper">
        <NumericInput
          id="interest-rate-input"
          className={`input-field has-suffix ${error ? 'input-error' : ''}`}
          value={value}
          onChange={onChange}
          isDecimal={true}
          placeholder="e.g. 10.5"
          aria-invalid={!!error}
          aria-describedby={error ? 'interest-rate-error' : undefined}
        />
        <span className="input-suffix">%</span>
      </div>

      {error && <div id="interest-rate-error" className="error-message">{error}</div>}

      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={0.25}
          value={sliderVal}
          onChange={handleSliderChange}
          aria-label="Annual interest rate slider"
        />
      </div>

      <div className="quick-amounts">
        {commonRates.map((rate) => (
          <button
            key={rate}
            type="button"
            className="quick-amount-btn"
            onClick={() => onChange(rate)}
          >
            {rate}%
          </button>
        ))}
      </div>
    </div>
  );
}
