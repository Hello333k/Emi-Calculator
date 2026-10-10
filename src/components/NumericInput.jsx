import React from 'react';
import { useNumericDraft } from '../hooks/useNumericDraft';

/**
 * NumericInput
 * 
 * Drop-in replacement for numeric text inputs that provides:
 * - Natural digit editing (inserting, deleting, selecting, replacing digits anywhere)
 * - Safe cursor / caret preservation
 * - Intermediate state tolerance (empty strings, trailing decimal points, leading zeros)
 * - Immediate calculation synchronization without re-formatting keystrokes
 * - Seamless external prop updates (sliders, preset buttons, resets)
 */
export default function NumericInput({
  id,
  value,
  onChange,
  onBlur: customOnBlur,
  isDecimal = false,
  min,
  max,
  fallbackOnBlur = false,
  fallbackValue = 0,
  className = '',
  placeholder,
  inputMode,
  disabled = false,
  readOnly = false,
  style,
  autoComplete = 'off',
  ...rest
}) {
  const { value: draft, onChange: handleChange, onBlur: handleDraftBlur } = useNumericDraft({
    value,
    onChange,
    isDecimal,
    min,
    max,
    fallbackOnBlur,
    fallbackValue,
  });

  const handleBlur = (e) => {
    handleDraftBlur();
    if (customOnBlur) {
      customOnBlur(e);
    }
  };

  return (
    <input
      id={id}
      type="text"
      className={className}
      value={draft}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode={inputMode || (isDecimal ? 'decimal' : 'numeric')}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      style={style}
      autoComplete={autoComplete}
      {...rest}
    />
  );
}
