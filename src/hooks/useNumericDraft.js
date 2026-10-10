import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useNumericDraft
 * 
 * Separates live editable text from the normalized numeric value used in calculations.
 * - Allows natural cursor positioning, inserting, deleting, selecting, and replacing digits.
 * - Preserves intermediate states (e.g. empty string, trailing decimal point "10.", leading zeros "00000").
 * - Does not overwrite the DOM input text when changes originate from the user's keystrokes.
 * - Safely synchronizes when the numeric prop changes from external controls (sliders, preset buttons, resets).
 * - Normalizes on blur without disturbing typing flow.
 */
export function useNumericDraft({
  value,
  onChange,
  isDecimal = false,
  min,
  max,
  fallbackOnBlur = false,
  fallbackValue = 0,
}) {
  const [draft, setDraft] = useState(() => {
    if (value === '' || value === null || value === undefined) return '';
    return String(value);
  });

  // Track the last value sent to onChange so we can distinguish user keystrokes from external updates
  const lastReportedRef = useRef(value);

  // Synchronize when value changes externally (slider, preset pill, reset, URL, etc.)
  useEffect(() => {
    if (value !== lastReportedRef.current) {
      lastReportedRef.current = value;
      setDraft(value === '' || value === null || value === undefined ? '' : String(value));
    }
  }, [value]);

  const handleChange = useCallback((e) => {
    const raw = e.target.value;

    // Filter characters: integers allow digits only; decimals allow digits and at most one decimal point
    const pattern = isDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
    if (!pattern.test(raw)) {
      return;
    }

    setDraft(raw);

    // If empty or just a decimal point, pass empty string to parent calculations
    if (raw === '' || (isDecimal && raw === '.')) {
      lastReportedRef.current = '';
      onChange('');
      return;
    }

    const parsed = isDecimal ? parseFloat(raw) : parseInt(raw, 10);
    if (!isNaN(parsed)) {
      lastReportedRef.current = parsed;
      onChange(parsed);
    }
  }, [isDecimal, onChange]);

  const handleBlur = useCallback(() => {
    if (draft === '' || (isDecimal && draft === '.')) {
      if (fallbackOnBlur) {
        const fbStr = String(fallbackValue);
        setDraft(fbStr);
        lastReportedRef.current = fallbackValue;
        onChange(fallbackValue);
      }
      return;
    }

    let parsed = isDecimal ? parseFloat(draft) : parseInt(draft, 10);
    if (!isNaN(parsed)) {
      if (min !== undefined && parsed < min) parsed = min;
      if (max !== undefined && parsed > max) parsed = max;

      const normalized = String(parsed);
      setDraft(normalized);
      lastReportedRef.current = parsed;
      onChange(parsed);
    }
  }, [draft, isDecimal, fallbackOnBlur, fallbackValue, min, max, onChange]);

  return {
    value: draft,
    onChange: handleChange,
    onBlur: handleBlur,
    setDraft,
  };
}
