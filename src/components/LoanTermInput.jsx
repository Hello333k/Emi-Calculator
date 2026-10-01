import React, { useState } from 'react';

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
  const [yearsInput, setYearsInput] = useState(years !== '' && years !== null && years !== undefined ? years.toString() : '');
  const [prevYears, setPrevYears] = useState(years);

  const [monthsInput, setMonthsInput] = useState(months !== '' && months !== null && months !== undefined ? months.toString() : '');
  const [prevMonths, setPrevMonths] = useState(months);

  // Sync state during render when props change externally
  if (years !== prevYears) {
    setPrevYears(years);
    setYearsInput(years !== '' && years !== null && years !== undefined ? years.toString() : '');
  }

  if (months !== prevMonths) {
    setPrevMonths(months);
    setMonthsInput(months !== '' && months !== null && months !== undefined ? months.toString() : '');
  }

  const totalMonths = (parseInt(years, 10) || 0) * 12 + (parseInt(months, 10) || 0);

  const handleYearsChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setYearsInput(val);
      if (val === '') {
        onYearsChange(0);
      } else {
        const parsed = parseInt(val, 10);
        onYearsChange(isNaN(parsed) ? 0 : parsed);
      }
    }
  };

  const handleMonthsChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setMonthsInput(val);
      if (val === '') {
        onMonthsChange(0);
      } else {
        const parsed = parseInt(val, 10);
        onMonthsChange(isNaN(parsed) ? 0 : parsed);
      }
    }
  };

  const handleYearsBlur = () => {
    const parsed = parseInt(yearsInput, 10);
    const safeYears = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), 40);
    setYearsInput(safeYears.toString());
    onYearsChange(safeYears);
  };

  const handleMonthsBlur = () => {
    const parsed = parseInt(monthsInput, 10);
    const safeMonths = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), 11);
    setMonthsInput(safeMonths.toString());
    onMonthsChange(safeMonths);
  };

  const handleSliderChange = (e) => {
    const total = parseInt(e.target.value, 10);
    const newYears = Math.floor(total / 12);
    const newMonths = total % 12;
    setYearsInput(newYears.toString());
    setMonthsInput(newMonths.toString());
    onYearsChange(newYears);
    onMonthsChange(newMonths);
  };

  const handlePreset = (preset) => {
    setYearsInput(preset.years.toString());
    setMonthsInput(preset.months.toString());
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
          <input
            id="tenure-years-input"
            type="text"
            className={`input-field has-suffix ${error ? 'input-error' : ''}`}
            value={yearsInput}
            onChange={handleYearsChange}
            onBlur={handleYearsBlur}
            inputMode="numeric"
            placeholder="Years"
            aria-label="Tenure in years"
          />
          <span className="input-suffix">yr</span>
        </div>
        <div className="input-wrapper">
          <input
            id="tenure-months-input"
            type="text"
            className={`input-field has-suffix ${error ? 'input-error' : ''}`}
            value={monthsInput}
            onChange={handleMonthsChange}
            onBlur={handleMonthsBlur}
            inputMode="numeric"
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
