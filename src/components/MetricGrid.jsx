import { formatCurrency } from '../utils/formatters';

export default function MetricGrid({
  purchasePrice,
  downPaymentAmount,
  financedPrincipal,
  loanToValueRatio,
  totalInterest,
  totalRepayment,
  processingFee,
  totalCost,
  currency,
  isValid
}) {
  const hasDownPayment = downPaymentAmount > 0;
  return (
    <div className="metric-grid">
      {hasDownPayment && (
        <>
          <div className="metric-card">
            <div className="metric-card-label">Purchase price</div>
            <div className="metric-card-value">
              {isValid ? formatCurrency(purchasePrice, currency) : '—'}
            </div>
          </div>
          <div className="metric-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
            <div className="metric-card-label">Down payment</div>
            <div className="metric-card-value" style={{ color: 'var(--color-success)' }}>
              {isValid ? formatCurrency(downPaymentAmount, currency) : '—'}
            </div>
          </div>
        </>
      )}
      <div className="metric-card metric-card--principal">
        <div className="metric-card-label">{hasDownPayment ? 'Loan amount' : 'Total principal'}</div>
        <div className="metric-card-value">
          {isValid ? formatCurrency(financedPrincipal, currency) : '—'}
        </div>
      </div>
      <div className="metric-card metric-card--interest">
        <div className="metric-card-label">Total interest</div>
        <div className="metric-card-value">
          {isValid ? formatCurrency(totalInterest, currency) : '—'}
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-card-label">Total repayment</div>
        <div className="metric-card-value">
          {isValid ? formatCurrency(totalRepayment, currency) : '—'}
        </div>
      </div>
      {hasDownPayment && (
        <div className="metric-card">
          <div className="metric-card-label">Loan-to-value</div>
          <div className="metric-card-value">
            {isValid ? `${loanToValueRatio.toFixed(1)}%` : '—'}
          </div>
        </div>
      )}
      {processingFee > 0 && (
        <>
          <div className="metric-card">
            <div className="metric-card-label">Processing fee</div>
            <div className="metric-card-value">
              {isValid ? formatCurrency(processingFee, currency) : '—'}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-label">Total cost</div>
            <div className="metric-card-value">
              {isValid ? formatCurrency(totalCost, currency) : '—'}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
