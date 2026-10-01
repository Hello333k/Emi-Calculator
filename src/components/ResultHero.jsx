import { formatCurrency } from '../utils/formatters';

export default function ResultHero({ emi, currency, isValid, financedPrincipal, downPaymentAmount }) {
  const hasDownPayment = downPaymentAmount > 0;
  return (
    <div className="result-hero" aria-live="polite">
      <div className="result-label">Estimated monthly EMI</div>
      <div className="result-value tabular-nums">
        {isValid ? formatCurrency(emi, currency) : '—'}
      </div>
      {isValid && hasDownPayment && (
        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Loan amount: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(financedPrincipal, currency)}</strong>
          <span style={{ margin: '0 6px', color: 'var(--text-tertiary)' }}>•</span>
          Down payment: <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(downPaymentAmount, currency)}</strong>
        </div>
      )}
    </div>
  );
}
