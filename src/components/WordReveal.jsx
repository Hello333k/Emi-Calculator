import React from 'react';

/**
 * WordReveal
 * 
 * Progressively reveals text word-by-word with a polished upward glide
 * and progressive fade-in.
 * 
 * Accessibility & Safety:
 * - Uses aria-label with the full un-split string so assistive tech reads it cleanly.
 * - Words are aria-hidden so screen readers do not announce fragmented words.
 * - If reduced motion is requested, words are immediately visible.
 * - Normal word spacing and wrapping are strictly preserved.
 */
export default function WordReveal({
  text,
  as: Component = 'span',
  className = '',
  style,
  staggerDelay = 95,
  initialDelay = 0,
}) {
  if (!text || typeof text !== 'string') {
    return <Component className={className} style={style}>{text}</Component>;
  }

  const words = text.split(' ');

  return (
    <Component
      className={`word-reveal-container ${className}`}
      style={style}
      aria-label={text}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span
            className="word-reveal-token"
            aria-hidden="true"
            style={{
              '--word-index': index,
              '--word-delay': `${initialDelay + index * staggerDelay}ms`,
            }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Component>
  );
}
