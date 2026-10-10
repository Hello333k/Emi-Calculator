import React, { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';

/**
 * AnimatedSegmentedControl
 * 
 * High-performance, accessible segmented toggle with a smoothly gliding
 * indicator pill, subtle click feedback, and zero layout jumping.
 *
 * @param {Array<{ value: string, label: React.ReactNode, style?: object }>} options
 * @param {string} value - Currently active value
 * @param {Function} onChange - (newValue: string) => void
 * @param {string} ariaLabel - Accessible description
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles for outer container
 * @param {object} buttonStyle - Inline styles for buttons
 * @param {boolean} fullWidth - Whether buttons flex to fill container
 */
export default function AnimatedSegmentedControl({
  options = [],
  value,
  onChange,
  ariaLabel = 'Segmented options',
  className = '',
  style = {},
  buttonStyle = {},
  fullWidth = false,
  size = 'md',
}) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  const updateIndicator = useCallback(() => {
    const activeBtn = buttonRefs.current[value];
    const container = containerRef.current;
    if (activeBtn && container) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        top: activeBtn.offsetTop,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
        ready: true,
      });
    }
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();
    // Enable transition animation after the initial positioning has resolved
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 40);
    return () => clearTimeout(timer);
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);

    let ro;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        updateIndicator();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      className={`segmented-control animated-segmented ${fullWidth ? 'segmented-full-width' : ''} ${size === 'sm' ? 'segmented-sm' : ''} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Smoothly Gliding Pill Indicator */}
      <div
        className="segment-indicator"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
          width: `${indicatorStyle.width}px`,
          height: `${indicatorStyle.height}px`,
          opacity: indicatorStyle.ready ? 1 : 0,
          pointerEvents: 'none',
          transition: hasAnimated
            ? 'transform var(--dur-mode-switch) var(--ease-out-smooth), width var(--dur-mode-switch) var(--ease-out-smooth), height var(--dur-mode-switch) var(--ease-out-smooth), opacity var(--dur-fast) var(--ease-out-smooth)'
            : 'none',
        }}
      />

      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              if (el) buttonRefs.current[opt.value] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            title={opt.title}
            className={`segment-btn ${isSelected ? 'active' : ''}`}
            style={{
              position: 'relative',
              zIndex: 1,
              ...buttonStyle,
              ...(opt.style || {}),
            }}
            onClick={() => {
              if (opt.value !== value) {
                onChange(opt.value);
              }
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
