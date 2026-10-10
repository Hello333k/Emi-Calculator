import React, { useState } from 'react';
import NumericInput from './NumericInput';
import AnimatedSegmentedControl from './AnimatedSegmentedControl';

export default function AdvancedOptions({
  processingFeeEnabled,
  onProcessingFeeEnabledChange,
  processingFeeType,
  onProcessingFeeTypeChange,
  processingFeeValue,
  onProcessingFeeValueChange,
  currency
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion" style={{ marginTop: '20px' }}>
      <button 
        type="button"
        className="accordion-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="advanced-options-content"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Additional options & fees</span>
          {processingFeeEnabled && (
            <span style={{ fontSize: '0.75rem', fontWeight: 500, backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
              Fee enabled
            </span>
          )}
        </span>
        <svg 
          width="20"
          height="20"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-normal)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      
      <div 
        id="advanced-options-content" 
        className={`accordion-collapse ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="accordion-collapse-inner">
          <div className="accordion-body">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                <input 
                  type="checkbox" 
                  checked={processingFeeEnabled} 
                  onChange={(e) => onProcessingFeeEnabledChange(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                Include upfront loan processing fee
              </label>
              <div className="text-xs text-secondary" style={{ marginTop: '4px', marginLeft: '28px' }}>
                Upfront lender administrative or processing charge (does not alter monthly EMI)
              </div>
            </div>

            <div 
              className={`accordion-collapse ${processingFeeEnabled ? 'open' : ''}`}
              aria-hidden={!processingFeeEnabled}
            >
              <div className="accordion-collapse-inner">
                <div style={{ marginTop: '8px', padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <label className="input-label" style={{ marginBottom: '8px' }}>Fee structure</label>
                  <AnimatedSegmentedControl
                    options={[
                      { value: 'percentage', label: 'Percentage (%)' },
                      { value: 'fixed', label: `Fixed amount (${currency})` },
                    ]}
                    value={processingFeeType}
                    onChange={onProcessingFeeTypeChange}
                    ariaLabel="Fee structure"
                    fullWidth
                    style={{ marginBottom: '16px' }}
                  />

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="fee-value-input">
                      {processingFeeType === 'percentage' ? 'Fee percentage' : 'Fee amount'}
                    </label>
                    <div className="input-wrapper">
                      {processingFeeType === 'fixed' && <span className="input-prefix">{currency}</span>}
                      <NumericInput 
                        key={processingFeeType}
                        id="fee-value-input"
                        value={processingFeeValue} 
                        onChange={(val) => onProcessingFeeValueChange(val === '' ? 0 : val)}
                        isDecimal={processingFeeType === 'percentage'}
                        fallbackOnBlur={true}
                        fallbackValue={0}
                        className={`input-field ${processingFeeType === 'fixed' ? 'has-prefix' : 'has-suffix'}`}
                        placeholder={processingFeeType === 'percentage' ? '1.0' : '10000'}
                      />
                      {processingFeeType === 'percentage' && <span className="input-suffix">%</span>}
                    </div>
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
