import React, { useEffect, useRef } from 'react';

export default function ShareDialog({ isOpen, onClose, shareUrl, onCopy }) {
  const copyBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (copyBtnRef.current) {
        copyBtnRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="dialog-overlay" 
      onClick={onClose}
    >
      <div 
        className="dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share calculation"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="dialog-title" style={{ margin: 0 }}>Share calculation</h3>
          <button 
            type="button"
            className="theme-toggle" 
            onClick={onClose}
            aria-label="Close dialog"
            style={{ width: '32px', height: '32px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <p className="text-secondary text-small" style={{ margin: '0 0 16px' }}>
          This link encodes your loan amount, interest rate, tenure, and assumptions directly in the URL without saving any data to a remote server.
        </p>
        
        <div className="share-url-box">
          <input 
            type="text" 
            className="share-url-input" 
            value={shareUrl} 
            readOnly 
            onClick={(e) => e.target.select()}
            aria-label="Shareable link URL"
          />
          <button 
            ref={copyBtnRef}
            type="button"
            onClick={() => onCopy(shareUrl)}
            className="btn btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
}
