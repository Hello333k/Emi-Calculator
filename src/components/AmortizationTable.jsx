import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { formatPaymentDate } from '../utils/dateUtils';
import { generateCSV, downloadCSV } from '../utils/csvExport';

export default function AmortizationTable({ schedule, currency, isValid }) {
  const [expandedYears, setExpandedYears] = useState({ 1: true });

  if (!isValid || !schedule || schedule.length === 0) {
    return null;
  }

  // Group payments by loan year
  const groupedSchedule = schedule.reduce((acc, item) => {
    const year = Math.ceil(item.month / 12);
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const yearKeys = Object.keys(groupedSchedule).map(Number).sort((a, b) => a - b);

  const toggleYear = (year) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleAll = (expand) => {
    const nextState = {};
    yearKeys.forEach(yr => {
      nextState[yr] = expand;
    });
    setExpandedYears(nextState);
  };

  const handleDownload = () => {
    const csvContent = generateCSV(schedule, currency);
    downloadCSV(csvContent);
  };

  const areAllExpanded = yearKeys.every(yr => expandedYears[yr]);

  return (
    <div className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Payment schedule</h2>
          <p className="text-secondary text-small">Detailed monthly breakdown of principal and interest over time</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => toggleAll(!areAllExpanded)}
          >
            {areAllExpanded ? 'Collapse all' : 'Show all'}
          </button>
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
      
      <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        <table className="amortization-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Payment</th>
              <th style={{ textAlign: 'right' }}>Principal</th>
              <th style={{ textAlign: 'right' }}>Interest</th>
              <th style={{ textAlign: 'right' }}>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {yearKeys.map(year => {
              const payments = groupedSchedule[year];
              const isExpanded = !!expandedYears[year];
              const yearPrincipal = payments.reduce((sum, p) => sum + p.principal, 0);
              const yearInterest = payments.reduce((sum, p) => sum + p.interest, 0);
              const endBalance = payments[payments.length - 1].balance;

              return (
                <React.Fragment key={`year-${year}`}>
                  <tr
                    className="year-group-header"
                    onClick={() => toggleYear(year)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    <td colSpan="6" style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform var(--transition-fast)'
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          Year {year} ({payments.length} payments)
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                          Principal: <span className="tabular-nums" style={{ fontWeight: 500 }}>{formatCurrency(yearPrincipal, currency)}</span> • Interest: <span className="tabular-nums" style={{ fontWeight: 500 }}>{formatCurrency(yearInterest, currency)}</span> • Ending: <span className="tabular-nums" style={{ fontWeight: 500 }}>{formatCurrency(endBalance, currency)}</span>
                        </span>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && payments.map(payment => (
                    <tr key={`payment-${payment.month}`}>
                      <td style={{ color: 'var(--text-tertiary)' }}>{payment.month}</td>
                      <td>{formatPaymentDate(payment.date) || `Month ${payment.month}`}</td>
                      <td style={{ textAlign: 'right' }} className="tabular-nums">{formatCurrency(payment.payment, currency)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--accent-primary)' }} className="tabular-nums">{formatCurrency(payment.principal, currency)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--accent-secondary)' }} className="tabular-nums">{formatCurrency(payment.interest, currency)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }} className="tabular-nums">{formatCurrency(payment.balance, currency)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
