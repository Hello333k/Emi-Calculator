import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function SavingsMetricGrid({
  summary,
  currency,
  isValid,
  timeYears,
  timeMonths,
  annualRate,
  rateType,
}) {
  if (!isValid || !summary) {
    return (
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card-label">Starting balance</div>
          <div className="metric-card-value">—</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-label">Total contributions</div>
          <div className="metric-card-value">—</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-label">Estimated growth</div>
          <div className="metric-card-value">—</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-label">Time horizon</div>
          <div className="metric-card-value">—</div>
        </div>
      </div>
    );
  }

  const {
    startingBalance,
    totalContributions,
    totalInterest,
    totalFees,
    endingBalance,
    inflationEnabled,
    inflationAdjustedValue,
    inflationRate,
  } = summary;

  // Breakdown proportions
  const addedContributions = Math.max(0, totalContributions - startingBalance);
  const total = endingBalance > 0 ? endingBalance : 1;

  const startPct = Math.max(0, Math.min(100, (startingBalance / total) * 100));
  const addedPct = Math.max(0, Math.min(100, (addedContributions / total) * 100));
  const growthPct = Math.max(0, Math.min(100, 100 - startPct - addedPct));

  // Horizon label
  const horizonLabel = timeYears > 0
    ? (timeMonths > 0 ? `${timeYears}y ${timeMonths}m` : `${timeYears} Year${timeYears > 1 ? 's' : ''}`)
    : `${timeMonths} Month${timeMonths > 1 ? 's' : ''}`;

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Visual Composition Progress Bar */}
      {endingBalance > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontWeight: 600,
          }}>
            <span>Balance composition</span>
            <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
              100%
            </span>
          </div>

          <div style={{
            display: 'flex',
            height: '10px',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-elevated)',
            gap: '2px',
          }} role="progressbar" aria-label="Savings composition progress" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
            {startPct > 0 && (
              <div
                style={{
                  width: `${startPct}%`,
                  backgroundColor: 'var(--accent-secondary)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width var(--transition-normal)',
                }}
                title={`Starting Balance: ${startPct.toFixed(1)}%`}
              />
            )}
            {addedPct > 0 && (
              <div
                style={{
                  width: `${addedPct}%`,
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width var(--transition-normal)',
                }}
                title={`Added Contributions: ${addedPct.toFixed(1)}%`}
              />
            )}
            {growthPct > 0 && (
              <div
                style={{
                  width: `${growthPct}%`,
                  backgroundColor: 'var(--color-success)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width var(--transition-normal)',
                }}
                title={`Estimated Growth: ${growthPct.toFixed(1)}%`}
              />
            )}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}>
            {startPct > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }} />
                <span>Starting: <strong style={{ color: 'var(--text-primary)' }}>{startPct.toFixed(0)}%</strong></span>
              </div>
            )}
            {addedPct > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                <span>Deposits: <strong style={{ color: 'var(--text-primary)' }}>{addedPct.toFixed(0)}%</strong></span>
              </div>
            )}
            {growthPct > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                <span>Growth: <strong style={{ color: 'var(--color-success)' }}>{growthPct.toFixed(0)}%</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card-label">Starting balance</div>
          <div className="metric-card-value">
            {formatCurrency(startingBalance, currency)}
          </div>
        </div>

        <div className="metric-card metric-card--principal">
          <div className="metric-card-label">Total contributed</div>
          <div className="metric-card-value">
            {formatCurrency(totalContributions, currency)}
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
          <div className="metric-card-label">Estimated growth</div>
          <div className="metric-card-value" style={{ color: 'var(--color-success)' }}>
            {formatCurrency(totalInterest, currency)}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Time horizon</div>
          <div className="metric-card-value">
            {horizonLabel}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Annual rate</div>
          <div className="metric-card-value">
            {annualRate}% <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{rateType === 'apy' ? 'APY' : 'APR'}</span>
          </div>
        </div>

        {totalFees > 0 && (
          <div className="metric-card" style={{ borderLeft: '3px solid var(--color-error)' }}>
            <div className="metric-card-label">Total fees</div>
            <div className="metric-card-value" style={{ color: 'var(--color-error)' }}>
              {formatCurrency(totalFees, currency)}
            </div>
          </div>
        )}

        {inflationEnabled && (
          <div className="metric-card" style={{ borderLeft: '3px solid var(--accent-secondary)' }}>
            <div className="metric-card-label">Today&apos;s money estimate ({inflationRate}% infl.)</div>
            <div className="metric-card-value" style={{ color: 'var(--accent-secondary)' }}>
              {formatCurrency(inflationAdjustedValue, currency)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
