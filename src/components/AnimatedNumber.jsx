import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedNumber
 * 
 * Smoothly interpolates numeric values over 450–700ms when data changes.
 * Preserves precise calculations and ends on the exact final result.
 * 
 * @param {number} value - The numeric value to display
 * @param {Function} formatter - Optional formatting function (e.g., formatCurrency)
 * @param {number} duration - Transition duration in ms (default 520ms)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 */
export default function AnimatedNumber({
  value,
  formatter,
  duration = 520,
  className = '',
  style = {},
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    // If not a valid finite number or reduced-motion is active, update directly
    const isReduced = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinite(value) || value === null || value === undefined || isReduced) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startVal = isFinite(prevValueRef.current) ? prevValueRef.current : value;
    const endVal = value;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    const startTime = performance.now();
    // Cubic bezier approx: 1 - (1 - t)^3 (smooth cubic ease out)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const currentVal = startVal + (endVal - startVal) * eased;

      if (progress < 1) {
        setDisplayValue(currentVal);
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
        prevValueRef.current = endVal;
        rafRef.current = null;
      }
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value, duration]);

  const formattedOutput = formatter
    ? formatter(Math.round(displayValue))
    : (isFinite(displayValue) ? Math.round(displayValue).toLocaleString() : displayValue);

  const exactFinalLabel = formatter && isFinite(value)
    ? formatter(value)
    : String(value ?? '');

  return (
    <span
      className={`tabular-nums ${className}`.trim()}
      style={style}
      aria-label={exactFinalLabel}
    >
      {formattedOutput}
    </span>
  );
}
