import React, { useState, useEffect } from 'react';

export default function Toast({ message, visible, onClose }) {
  const [prevVisible, setPrevVisible] = useState(visible);
  const [isExiting, setIsExiting] = useState(false);
  const [activeMessage, setActiveMessage] = useState(message);

  // Synchronize state during render when props change (official React 19 pattern)
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setIsExiting(false);
      setActiveMessage(message);
    } else {
      setIsExiting(true);
    }
  }

  // Auto-dismiss timer while visible
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  // Cleanup after exit animation completes
  useEffect(() => {
    if (isExiting) {
      const exitTimer = setTimeout(() => {
        setIsExiting(false);
      }, 220);
      return () => clearTimeout(exitTimer);
    }
  }, [isExiting]);

  if (!visible && !isExiting) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${isExiting ? 'toast-exit' : ''}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span style={{ fontWeight: 500 }}>{activeMessage}</span>
      </div>
    </div>
  );
}
