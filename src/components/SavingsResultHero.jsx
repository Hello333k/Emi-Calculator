import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function SavingsResultHero({
  mode,
  summary,
  currency,
  isValid,
  requiredContribution,
  timeToGoal,
  goalSubMode,
  targetAmount,
  startingBalance,
  contributionFrequency,
  timeYears,
  timeMonths,
}) {
  if (!isValid || !summary) {
    return (
      <div className="result-hero" aria-live="polite">
        <div className="result-label">
          {mode === 'goal'
            ? (goalSubMode === 'time' ? 'Estimated time to goal' : 'Required contribution')
            : 'Estimated balance'}
        </div>
        <div className="result-value tabular-nums">—</div>
        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Please enter valid positive values for all required fields.
        </div>
      </div>
    );
  }

  // ─── Growth Mode ─────────────────────────────────────────────────────────────
  if (mode === 'growth') {
    const { endingBalance, totalContributions, totalInterest, startingBalance: startBal } = summary;
    const netContributions = totalContributions - startBal;
    const contribPct = endingBalance > 0 ? Math.round((totalContributions / endingBalance) * 100) : 0;
    const growthPct = Math.max(0, 100 - contribPct);

    // Natural insight sentence
    const horizonStr = timeYears > 0 
      ? (timeMonths > 0 ? `${timeYears}y ${timeMonths}m` : `${timeYears} year${timeYears > 1 ? 's' : ''}`)
      : `${timeMonths} month${timeMonths > 1 ? 's' : ''}`;

    let insightText = '';
    if (totalInterest === 0) {
      insightText = `Over ${horizonStr}, your balance reflects your deposits without interest growth.`;
    } else if (contribPct > 60) {
      insightText = `Over ${horizonStr}, your personal contributions represent ${contribPct}% of the projected balance, with compounding growth adding ${growthPct}%.`;
    } else {
      insightText = `Over ${horizonStr}, compound growth contributes ${growthPct}% of your final balance, multiplying your deposits through the power of time.`;
    }

    return (
      <div className="result-hero" aria-live="polite">
        <div className="result-label">Estimated balance</div>
        <div className="result-value tabular-nums">
          {formatCurrency(endingBalance, currency)}
        </div>

        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          You contribute: <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(totalContributions, currency)}</strong>
          <span style={{ margin: '0 6px', color: 'var(--text-tertiary)' }}>•</span>
          Estimated growth: <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(totalInterest, currency)}</strong>
        </div>

        {startBal > 0 && netContributions > 0 && (
          <div style={{ marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Starting: {formatCurrency(startBal, currency)} + Added: {formatCurrency(netContributions, currency)}
          </div>
        )}

        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {insightText}
        </div>
      </div>
    );
  }

  // ─── Goal Mode: Required Contribution ─────────────────────────────────────────
  if (goalSubMode === 'contribution') {
    const isTargetAlreadyMet = requiredContribution === 0 && summary.endingBalance >= targetAmount;
    const freqLabel = contributionFrequency === 'yearly' ? 'year' : 'month';

    return (
      <div className="result-hero" aria-live="polite">
        <div className="result-label">
          {isTargetAlreadyMet ? 'Goal status' : `Required ${freqLabel}ly contribution`}
        </div>
        <div className="result-value tabular-nums">
          {isTargetAlreadyMet 
            ? 'Goal Met!' 
            : `${formatCurrency(requiredContribution || 0, currency)}`}
        </div>

        {isTargetAlreadyMet ? (
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-success)' }}>
            Your current savings alone are projected to reach this target under these assumptions.
          </div>
        ) : (
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            To reach <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(targetAmount, currency)}</strong> in{' '}
            {timeYears > 0 ? `${timeYears}y ` : ''}{timeMonths > 0 ? `${timeMonths}m` : ''}
          </div>
        )}

        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          Starting with {formatCurrency(startingBalance, currency)}, saving {formatCurrency(requiredContribution || 0, currency)} per {freqLabel} will achieve your target amount.
        </div>
      </div>
    );
  }

  // ─── Goal Mode: Time to Goal ─────────────────────────────────────────────────
  const reachable = timeToGoal?.reachable;
  const years = timeToGoal?.years || 0;
  const months = timeToGoal?.months || 0;

  return (
    <div className="result-hero" aria-live="polite">
      <div className="result-label">Estimated time to goal</div>
      <div className="result-value tabular-nums" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)' }}>
        {!reachable ? (
          'Not reached'
        ) : years === 0 && months === 0 ? (
          'Goal Reached!'
        ) : (
          `${years > 0 ? `${years}y ` : ''}${months > 0 || years === 0 ? `${months}m` : ''}`
        )}
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {!reachable ? (
          <span style={{ color: 'var(--color-error)' }}>Target not reached within the 100-year calculation horizon.</span>
        ) : (
          <>
            Target: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(targetAmount, currency)}</strong>
            <span style={{ margin: '0 6px', color: 'var(--text-tertiary)' }}>•</span>
            Projected: <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(timeToGoal?.projectedBalance || targetAmount, currency)}</strong>
          </>
        )}
      </div>

      {reachable && (timeToGoal?.totalContributions > 0) && (
        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          Total contributions will be {formatCurrency(timeToGoal.totalContributions, currency)} with {formatCurrency(timeToGoal.totalInterest, currency)} in compound growth.
        </div>
      )}
    </div>
  );
}
