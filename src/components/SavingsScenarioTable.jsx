import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function SavingsScenarioTable({ scenarios, baseRate, currency, isValid }) {
  if (!isValid || !scenarios || scenarios.length === 0) return null;

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Scenario comparison</h3>
        <p className="text-secondary text-xs" style={{ margin: '4px 0 0' }}>
          Sensitivity analysis showing hypothetical ending balances at different assumed rates
        </p>
      </div>

      <div className="table-container" style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        overflowX: 'auto',
        backgroundColor: 'var(--bg-surface)',
      }}>
        <table className="amortization-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th style={{ textAlign: 'right' }}>Assumed Rate</th>
              <th style={{ textAlign: 'right' }}>Total Deposits</th>
              <th style={{ textAlign: 'right' }}>Estimated Growth</th>
              <th style={{ textAlign: 'right' }}>Projected Balance</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((sc, idx) => {
              const isBase = sc.rate === baseRate;
              let label = 'Alternative scenario';
              if (sc.rate < baseRate) label = 'Lower-rate scenario';
              else if (sc.rate === baseRate) label = 'Base scenario';
              else if (sc.rate > baseRate) label = 'Higher-rate scenario';

              return (
                <tr
                  key={idx}
                  style={isBase ? { backgroundColor: 'var(--accent-primary-light)', fontWeight: 600 } : {}}
                >
                  <td style={{ fontWeight: isBase ? 700 : 500, color: isBase ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {label} {isBase && '(Active)'}
                  </td>
                  <td style={{ textAlign: 'right' }}>{sc.rate}%</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(sc.totalContributions, currency)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--color-success)' }}>
                    {formatCurrency(sc.totalInterest, currency)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(sc.endingBalance, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
