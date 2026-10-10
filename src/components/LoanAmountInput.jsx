import React from 'react';
import NumericInput from './NumericInput';

const quickAmountsSouthAsian = [
  { label: '1 Lakh', value: 100000 },
  { label: '5 Lakhs', value: 500000 },
  { label: '10 Lakhs', value: 1000000 },
  { label: '25 Lakhs', value: 2500000 },
  { label: '50 Lakhs', value: 5000000 },
  { label: '1 Crore', value: 10000000 }
];

const quickAmountsStandard = [
  { label: '10K', value: 10000 },
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '250K', value: 250000 },
  { label: '500K', value: 500000 },
  { label: '1M', value: 1000000 }
];

export default function LoanAmountInput({
  value,
  onChange,
  currency = 'NPR',
  error,
  min = 10000,
  max = 50000000
}) {
  const isSouthAsian = currency === 'NPR' || currency === 'INR';
  const quickAmounts = isSouthAsian ? quickAmountsSouthAsian : quickAmountsStandard;
  const sliderStep = isSouthAsian ? 10000 : 5000;

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    onChange(val);
  };

  const handleQuickAmount = (val) => {
    onChange(val);
  };

  const sliderVal = typeof value === 'number' && !isNaN(value) ? Math.min(Math.max(value, min), max) : min;

  return (
    <div className="input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label className="input-label" htmlFor="loan-amount-input">Purchase price</label>
        <span className="text-xs text-secondary">Min {currency} 10K • Max {currency} 50M</span>
      </div>
      
      <div className="input-wrapper">
        <span className="input-prefix">{currency}</span>
        <NumericInput
          id="loan-amount-input"
          className={`input-field has-prefix ${error ? 'input-error' : ''}`}
          value={value}
          onChange={onChange}
          isDecimal={false}
          placeholder="e.g. 1000000"
          aria-invalid={!!error}
          aria-describedby={error ? 'loan-amount-error' : undefined}
        />
      </div>

      {error && <div id="loan-amount-error" className="error-message">{error}</div>}

      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={sliderStep}
          value={sliderVal}
          onChange={handleSliderChange}
          aria-label="Purchase price slider"
        />
      </div>

      <div className="quick-amounts">
        {quickAmounts.map((btn) => (
          <button
            key={btn.label}
            className="quick-amount-btn"
            type="button"
            onClick={() => handleQuickAmount(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
