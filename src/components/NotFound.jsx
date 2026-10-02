import React from 'react';

const NotFound = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '24px' }}>
      <div style={{ fontSize: '6rem', fontWeight: 700, color: 'var(--text-tertiary)', lineHeight: 1 }}>404</div>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', margin: '16px 0 32px' }}>That page doesn't exist.</p>
      <a
        href='/'
        onClick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate('/');
          }
        }}
        className='btn btn-primary'
        style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', color: 'white', fontWeight: 600, display: 'inline-block' }}
      >
        Back to calculator
      </a>
    </div>
  );
};

export default NotFound;
