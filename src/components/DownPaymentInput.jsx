import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

export default function DownPaymentInput({
  purchasePrice,
  downPaymentMode,
  onDownPaymentModeChange,
  downPaymentValue,
  onDownPaymentValueChange,
  downPaymentAmount,
  downPaymentPercentage,
  financedPrincipal,
  loanToValueRatio,
  currency = 'NPR',
  error
}) {
  const [inputValue, setInputValue] = useState(
    downPaymentValue !== '' && downPaymentValue !== null && downPaymentValue !== undefined
      ? downPaymentValue.toString()
      : '0'
  );
  const [prevValue, setPrevValue] = useState(downPaymentValue);
  const [prevMode, setPrevMode] = useState(downPaymentMode);

  if (downPaymentValue !== prevValue) {
    setPrevValue(downPaymentValue);
    setInputValue(
      downPaymentValue !== '' && downPaymentValue !== null && downPaymentValue !== undefined
        ? downPaymentValue.toString()
        : '0'
    );
  }

  if (downPaymentMode !== prevMode) {
    setPrevMode(downPaymentMode);
    setInputValue(
      downPaymentValue !== '' && downPaymentValue !== null && downPaymentValue !== undefined
        ? downPaymentValue.toString()
        : '0'
    );
  }

  const numPrice = Number(purchasePrice);
  const validPrice = isFinite(numPrice) && numPrice > 0 ? numPrice : 0;
  const isPercentage = downPaymentMode === 'percentage';

  const sliderMax = isPercentage ? 100 : validPrice;
  const sliderStep = isPercentage ? 1 : (currency === 'NPR' || currency === 'INR' ? 10000 : 5000);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (isPercentage) {
      if (/^\d*\.?\d*$/.test(val)) {
        setInputValue(val);
        const parsed = parseFloat(val);
        onDownPaymentValueChange(isNaN(parsed) ? 0 : parsed);
      }
    } else {
      if (/^\d*$/.test(val)) {
        setInputValue(val);
        const parsed = parseInt(val, 10);
        onDownPaymentValueChange(isNaN(parsed) ? 0 : parsed);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === '' || inputValue === '.') {
      setInputValue('0');
      onDownPaymentValueChange(0);
      return;
    }
    const parsed = isPercentage ? parseFloat(inputValue) : parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      setInputValue(parsed.toString());
      onDownPaymentValueChange(parsed);
    }
  };

  const handleSliderChange = (e) => {
    const val = isPercentage ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
    setInputValue(val.toString());
    onDownPaymentValueChange(val);
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === downPaymentMode) return;
    onDownPaymentModeChange(newMode);
    onDownPaymentValueChange(0);
    setInputValue('0');
  };

  const sliderVal = (() => {
    const v = isPercentage ? parseFloat(inputValue) : parseInt(inputValue, 10);
    if (isNaN(v)) return 0;
    return Math.min(Math.max(v, 0), sliderMax || 1);
  })();

  const dpPct = validPrice > 0 ? (downPaymentAmount / validPrice) * 100 : 0;
  const financedPct = 100 - dpPct;

  return (
    <div className="input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label className="input-label" htmlFor="down-payment-input" style={{ marginBottom: 0 }}>Down payment</label>
        <div className="segmented-control">
          <button
            type="button"
            className={`segment-btn ${!isPercentage ? 'active' : ''}`}
            onClick={() => handleModeSwitch('amount')}
          >
            Amount
          </button>
          <button
            type="button"
            className={`segment-btn ${isPercentage ? 'active' : ''}`}
            onClick={() => handleModeSwitch('percentage')}
          >
            Percentage
          </button>
        </div>
      </div>

      <div className="input-wrapper">
        {!isPercentage && <span className="input-prefix">{currency}</span>}
        <input
          id="down-payment-input"
          type="text"
          className={`input-field ${!isPercentage ? 'has-prefix' : ''} ${isPercentage ? 'has-suffix' : ''} ${error ? 'input-error' : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputMode={isPercentage ? 'decimal' : 'numeric'}
          placeholder={isPercentage ? 'e.g. 20' : 'e.g. 200000'}
          aria-invalid={!!error}
          aria-describedby={error ? 'down-payment-error' : 'down-payment-info'}
        />
        {isPercentage && <span className="input-suffix">%</span>}
      </div>

      {error && <div id="down-payment-error" className="error-message">{error}</div>}

      {sliderMax > 0 && (
        <div className="slider-container">
          <input
            type="range"
            min={0}
            max={sliderMax}
            step={sliderStep}
            value={sliderVal}
            onChange={handleSliderChange}
            aria-label="Down payment slider"
          />
        </div>
      )}

      {validPrice > 0 && downPaymentAmount > 0 && (
        <div id="down-payment-info" style={{ marginTop: '12px' }}>
          {/* Proportion Bar */}
          <div style={{
            display: 'flex',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-elevated)',
            marginBottom: '10px'
          }}>
            <div
              style={{
                width: `${dpPct}%`,
                backgroundColor: 'var(--color-success)',
                transition: 'width 250ms ease',
                minWidth: dpPct > 0 ? '2px' : '0'
              }}
              role="img"
              aria-label={`Down payment: ${dpPct.toFixed(1)}%`}
            />
            <div
              style={{
                width: `${financedPct}%`,
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 250ms ease',
                minWidth: financedPct > 0 ? '2px' : '0'
              }}
              role="img"
              aria-label={`Financed: ${financedPct.toFixed(1)}%`}
            />
          </div>

          {/* Summary Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            fontSize: '0.8rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: '2px' }}>Down payment</div>
              <div style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                {formatCurrency(downPaymentAmount, currency)}
                <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: '4px' }}>
                  ({downPaymentPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: '2px' }}>Loan amount</div>
              <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                {formatCurrency(financedPrincipal, currency)}
                <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: '4px' }}>
                  ({loanToValueRatio.toFixed(1)}% LTV)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
