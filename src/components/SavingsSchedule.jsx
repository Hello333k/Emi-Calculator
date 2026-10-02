import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { generateSavingsCSV } from '../utils/savingsCalculator';
import { downloadCSV } from '../utils/csvExport';

export default function SavingsSchedule({
  schedule,
  yearlySummary,
  summary,
  currency,
  isValid,
  view,
  onViewChange,
}) {
  const [expandedYears, setExpandedYears] = useState({ 1: true });

  if (!isValid || !schedule || schedule.length === 0) {
    return null;
  }

  const isMonthly = view === 'monthly';
  const hasOneTimeDeposit = schedule.some(r => r.oneTimeDeposit > 0);
  const hasFees = schedule.some(r => r.fee > 0);

  // Group monthly rows by year
  const groupedByYear = schedule.reduce((acc, row) => {
    const yr = row.yearNumber;
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(row);
    return acc;
  }, {});

  const yearKeys = Object.keys(groupedByYear).map(Number).sort((a, b) => a - b);

  const toggleYear = (yr) => {
    setExpandedYears(prev => ({ ...prev, [yr]: !prev[yr] }));
  };

  const toggleAll = (expand) => {
    const next = {};
    yearKeys.forEach(yr => { next[yr] = expand; });
    setExpandedYears(next);
  };

  const areAllExpanded = yearKeys.every(yr => expandedYears[yr]);

  const handleDownload = () => {
    const csvContent = generateSavingsCSV(schedule);
    downloadCSV(csvContent, 'savings-projection-schedule.csv');
  };

  return (
    <div className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '36px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Projection schedule</h2>
          <p className="text-secondary text-small" style={{ margin: '4px 0 0' }}>
            Complete itemized breakdown of deposits, interest accrual, and ending balance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Toggle */}
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${!isMonthly ? 'active' : ''}`}
              onClick={() => onViewChange('yearly')}
            >
              Yearly
            </button>
            <button
              type="button"
              className={`segment-btn ${isMonthly ? 'active' : ''}`}
              onClick={() => onViewChange('monthly')}
            >
              Monthly
            </button>
          </div>

          {isMonthly && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => toggleAll(!areAllExpanded)}
            >
              {areAllExpanded ? 'Collapse all' : 'Show all'}
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDownload}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container" style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        overflowX: 'auto',
        backgroundColor: 'var(--bg-surface)',
      }}>
        {!isMonthly ? (
          /* ─── Yearly Summary Table ─── */
          <table className="amortization-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Year</th>
                <th style={{ textAlign: 'right' }}>Starting Balance</th>
                <th style={{ textAlign: 'right' }}>Annual Deposits</th>
                <th style={{ textAlign: 'right' }}>Annual Growth</th>
                {hasFees && <th style={{ textAlign: 'right' }}>Fees</th>}
                <th style={{ textAlign: 'right' }}>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {yearlySummary.map((row) => (
                <tr key={`year-${row.year}`}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Year {row.year}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(row.startBalance, currency)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 500 }}>
                    {formatCurrency(row.contributions, currency)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-success)', fontWeight: 500 }}>
                    {formatCurrency(row.interest, currency)}
                  </td>
                  {hasFees && (
                    <td style={{ textAlign: 'right', color: 'var(--color-error)' }}>
                      {formatCurrency(row.fees, currency)}
                    </td>
                  )}
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(row.endBalance, currency)}</td>
                </tr>
              ))}
            </tbody>
            {summary && (
              <tfoot>
                <tr style={{
                  backgroundColor: 'var(--bg-elevated)',
                  fontWeight: 600,
                  borderTop: '2px solid var(--border-color-strong)',
                }}>
                  <td>Total</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(summary.startingBalance, currency)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--accent-primary)' }}>
                    {formatCurrency(summary.totalContributions - summary.startingBalance, currency)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-success)' }}>
                    {formatCurrency(summary.totalInterest, currency)}
                  </td>
                  {hasFees && (
                    <td style={{ textAlign: 'right', color: 'var(--color-error)' }}>
                      {formatCurrency(summary.totalFees, currency)}
                    </td>
                  )}
                  <td style={{ textAlign: 'right', color: 'var(--text-primary)' }}>
                    {formatCurrency(summary.endingBalance, currency)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        ) : (
          /* ─── Monthly Detailed Schedule Table ─── */
          <table className="amortization-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Period</th>
                <th style={{ textAlign: 'right' }}>Start Balance</th>
                <th style={{ textAlign: 'right' }}>Deposit</th>
                {hasOneTimeDeposit && <th style={{ textAlign: 'right' }}>One-Time</th>}
                <th style={{ textAlign: 'right' }}>Growth</th>
                {hasFees && <th style={{ textAlign: 'right' }}>Fee</th>}
                <th style={{ textAlign: 'right' }}>End Balance</th>
                <th style={{ textAlign: 'right' }}>Total Deposits</th>
              </tr>
            </thead>
            <tbody>
              {yearKeys.map((yr) => {
                const rows = groupedByYear[yr];
                const isExpanded = !!expandedYears[yr];
                const yrContrib = rows.reduce((s, r) => s + r.contribution + r.oneTimeDeposit, 0);
                const yrInterest = rows.reduce((s, r) => s + r.interest, 0);
                const yrEnd = rows[rows.length - 1].endBalance;

                return (
                  <React.Fragment key={`group-year-${yr}`}>
                    <tr
                      className="year-group-header"
                      onClick={() => toggleYear(yr)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleYear(yr);
                        }
                      }}
                      aria-expanded={isExpanded}
                    >
                      <td colSpan={hasOneTimeDeposit && hasFees ? 9 : (hasOneTimeDeposit || hasFees ? 8 : 7)} style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                transform: isExpanded ? 'rotate(90deg)' : 'none',
                                transition: 'transform var(--transition-fast)',
                              }}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <strong>Year {yr} Summary</strong>
                            <span className="text-xs text-secondary">({rows.length} periods)</span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Deposits: <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(yrContrib, currency)}</strong></span>
                            <span>Growth: <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(yrInterest, currency)}</strong></span>
                            <span>End: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(yrEnd, currency)}</strong></span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && rows.map((r) => (
                      <tr key={`p-${r.period}`}>
                        <td style={{ color: 'var(--text-tertiary)' }}>{r.period}</td>
                        <td style={{ fontWeight: 500 }}>{r.periodLabel}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(r.startBalance, currency)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--accent-primary)' }}>
                          {formatCurrency(r.contribution, currency)}
                        </td>
                        {hasOneTimeDeposit && (
                          <td style={{ textAlign: 'right', color: r.oneTimeDeposit > 0 ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                            {r.oneTimeDeposit > 0 ? formatCurrency(r.oneTimeDeposit, currency) : '—'}
                          </td>
                        )}
                        <td style={{ textAlign: 'right', color: 'var(--color-success)' }}>
                          {formatCurrency(r.interest, currency)}
                        </td>
                        {hasFees && (
                          <td style={{ textAlign: 'right', color: r.fee > 0 ? 'var(--color-error)' : 'var(--text-tertiary)' }}>
                            {r.fee > 0 ? formatCurrency(r.fee, currency) : '—'}
                          </td>
                        )}
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(r.endBalance, currency)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {formatCurrency(r.cumulativeContributions, currency)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
