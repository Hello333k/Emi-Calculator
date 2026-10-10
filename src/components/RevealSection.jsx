import React from 'react';
import { useReveal } from '../hooks/useReveal';

/**
 * RevealSection
 *
 * Wrapper component that applies scroll-reveal animation to its children.
 * When the section scrolls into the viewport, it fades in with a subtle
 * upward translation (defined by the .reveal / .reveal.visible CSS classes).
 *
 * @param {string} as - The HTML element tag to render (default 'div')
 * @param {number} delay - Additional CSS transition-delay in ms (default 0)
 * @param {object} style - Additional inline styles
 * @param {string} className - Additional CSS classes
 */
export default function RevealSection({
  as: Tag = 'div',
  direction = 'up',
  delay = 0,
  duration,
  immediate = false,
  threshold = 0.08,
  rootMargin = '0px 0px -30px 0px',
  once = true,
  style,
  className = '',
  children,
  ...rest
}) {
  const ref = useReveal({ threshold, rootMargin, once, immediate });

  const directionClass = direction && direction !== 'none' ? `reveal--${direction}` : '';

  const mergedStyle = {
    ...style,
    ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
    ...(duration ? { transitionDuration: `${duration}ms` } : {}),
  };

  return (
    <Tag
      ref={ref}
      className={`reveal ${directionClass} ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
}
