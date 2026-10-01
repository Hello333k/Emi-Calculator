import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function YearlySummary({ yearlySummary, currency, isValid }) {
  if (!isValid || !yearlySummary || yearlySummary.length === 0) {
    return null;
  }

  return (
    <div className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '32px' }}>
      <div className="section-header">
        <h2>Yearly overview</h2>
        <p className="text-secondary text-small">Summary of annual payments, principal reduction, and remaining loan balance</p>
      </div>
      <div className="yearly-summary-grid">
        <div className="yearly-summary-header yearly-summary-row">
          <div>Year</div>
          <div style={{ textAlign: 'right' }}>Total Paid</div>
          <div style={{ textAlign: 'right' }}>Principal Paid</div>
          <div style={{ textAlign: 'right' }}>Interest Paid</div>
          <div style={{ textAlign: 'right' }}>Ending Balance</div>
        </div>
        {yearlySummary.map((yearObj, i) => (
          <div key={i} className="yearly-summary-row">
            <div style={{ fontWeight: 600 }}>Year {yearObj.year}</div>
            <div style={{ textAlign: 'right' }} className="tabular-nums">{formatCurrency(yearObj.totalPaid, currency)}</div>
            <div style={{ textAlign: 'right', color: 'var(--accent-primary)' }} className="tabular-nums">{formatCurrency(yearObj.principalPaid, currency)}</div>
            <div style={{ textAlign: 'right', color: 'var(--accent-secondary)' }} className="tabular-nums">{formatCurrency(yearObj.interestPaid, currency)}</div>
            <div style={{ textAlign: 'right', fontWeight: 500 }} className="tabular-nums">{formatCurrency(yearObj.endingBalance, currency)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
