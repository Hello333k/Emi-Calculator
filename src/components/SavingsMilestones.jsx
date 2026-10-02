import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function SavingsMilestones({ milestones, currency, isValid }) {
  if (!isValid || !milestones || milestones.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Savings milestones</h3>
        <p className="text-secondary text-xs" style={{ margin: '4px 0 0' }}>
          Key checkpoints along your projected savings journey
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
      }}>
        {milestones.map((m) => {
          const growth = m.totalInterest;
          return (
            <div
              key={m.label}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--accent-primary)',
                }}>
                  {m.label}
                </span>
                <span className="text-xs text-secondary">Period {m.period}</span>
              </div>

              <div>
                <div className="text-xs text-secondary">Projected balance</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }} className="tabular-nums">
                  {formatCurrency(m.balance, currency)}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                paddingTop: '4px',
                borderTop: '1px dashed var(--border-color)',
              }}>
                <div>
                  Deposits: <strong style={{ color: 'var(--text-primary)' }} className="tabular-nums">{formatCurrency(m.totalContributions, currency)}</strong>
                </div>
                <div>
                  Growth: <strong style={{ color: 'var(--color-success)' }} className="tabular-nums">{formatCurrency(growth, currency)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
