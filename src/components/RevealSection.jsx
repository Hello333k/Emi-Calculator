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
  delay = 0,
  style,
  className = '',
  children,
  ...rest
}) {
  const ref = useReveal();

  const mergedStyle = delay > 0
    ? { ...style, transitionDelay: `${delay}ms` }
    : style;

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
}
