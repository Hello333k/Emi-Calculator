import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function BreakdownChart({ principal, totalInterest, currency, isValid }) {
  if (!isValid || principal === undefined || totalInterest === undefined) {
    return (
      <div className="chart-container">
        <h3>Payment breakdown</h3>
        <div style={{ color: 'var(--text-tertiary)', padding: '32px 0', textAlign: 'center' }}>
          Enter loan details to view breakdown
        </div>
      </div>
    );
  }

  const safePrincipal = Math.max(0, principal || 0);
  const safeInterest = Math.max(0, totalInterest || 0);
  const total = safePrincipal + safeInterest;

  const principalPct = total > 0 ? (safePrincipal / total) * 100 : 100;
  const interestPct = total > 0 ? (safeInterest / total) * 100 : 0;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  const principalDash = (principalPct / 100) * circumference;
  const interestDash = (interestPct / 100) * circumference;

  return (
    <div className="chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Payment breakdown</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Principal vs. Total interest</span>
      </div>

      <div className="donut-chart">
        <svg className="donut-svg" viewBox="0 0 200 200" aria-label="Principal vs Interest breakdown pie chart">
          {/* Background track circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth="24"
          />

          {/* Principal circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="24"
            strokeDasharray={`${principalDash} ${circumference}`}
            strokeDashoffset="0"
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dasharray var(--transition-normal)' }}
          />

          {/* Interest circle */}
          {safeInterest > 0 && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--accent-secondary)"
              strokeWidth="24"
              strokeDasharray={`${interestDash} ${circumference}`}
              strokeDashoffset={-principalDash}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dasharray var(--transition-normal)' }}
            />
          )}

          {/* Donut Center text */}
          <text
            x="100"
            y="94"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="var(--text-primary)"
            fontFamily="var(--font-sans)"
            className="tabular-nums"
          >
            {principalPct.toFixed(1)}%
          </text>
          <text
            x="100"
            y="114"
            textAnchor="middle"
            fontSize="11"
            fontWeight="500"
            fill="var(--text-secondary)"
            fontFamily="var(--font-sans)"
            letterSpacing="0.03em"
          >
            PRINCIPAL
          </text>
        </svg>

        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <div>
              <div className="legend-label">Principal</div>
              <div className="legend-value tabular-nums" style={{ color: 'var(--accent-primary)' }}>
                {formatCurrency(safePrincipal, currency)} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>({principalPct.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'var(--accent-secondary)' }} />
            <div>
              <div className="legend-label">Total interest</div>
              <div className="legend-value tabular-nums" style={{ color: 'var(--accent-secondary)' }}>
                {formatCurrency(safeInterest, currency)} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>({interestPct.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Principal comprises <strong>{principalPct.toFixed(1)}%</strong> and interest comprises <strong>{interestPct.toFixed(1)}%</strong> of total loan repayments.
      </div>
    </div>
  );
}
