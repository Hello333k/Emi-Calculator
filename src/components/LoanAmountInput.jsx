import React, { useState } from 'react';

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
  const [inputValue, setInputValue] = useState(value !== '' && value !== null && value !== undefined ? value.toString() : '');
  const [prevValue, setPrevValue] = useState(value);

  // Sync state during render when prop changes externally (e.g. reset or slider)
  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value !== '' && value !== null && value !== undefined ? value.toString() : '');
  }

  const isSouthAsian = currency === 'NPR' || currency === 'INR';
  const quickAmounts = isSouthAsian ? quickAmountsSouthAsian : quickAmountsStandard;
  const sliderStep = isSouthAsian ? 10000 : 5000;

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputValue(val);
      if (val === '') {
        onChange('');
      } else {
        const parsed = parseInt(val, 10);
        onChange(isNaN(parsed) ? '' : parsed);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === '') {
      return;
    }
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      setInputValue(parsed.toString());
      onChange(parsed);
    }
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setInputValue(val.toString());
    onChange(val);
  };

  const handleQuickAmount = (val) => {
    setInputValue(val.toString());
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
        <input
          id="loan-amount-input"
          type="text"
          className={`input-field has-prefix ${error ? 'input-error' : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputMode="numeric"
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
