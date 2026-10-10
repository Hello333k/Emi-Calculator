import { formatCurrency } from '../utils/formatters';
import AnimatedNumber from './AnimatedNumber';

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
  const formatVal = (val) => formatCurrency(val, currency);

  return (
    <div className="metric-grid">
      {hasDownPayment && (
        <>
          <div className="metric-card">
            <div className="metric-card-label">Purchase price</div>
            <div className="metric-card-value">
              {isValid ? <AnimatedNumber value={purchasePrice} formatter={formatVal} duration={480} /> : '—'}
            </div>
          </div>
          <div className="metric-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
            <div className="metric-card-label">Down payment</div>
            <div className="metric-card-value" style={{ color: 'var(--color-success)' }}>
              {isValid ? <AnimatedNumber value={downPaymentAmount} formatter={formatVal} duration={480} /> : '—'}
            </div>
          </div>
        </>
      )}
      <div className="metric-card metric-card--principal">
        <div className="metric-card-label">{hasDownPayment ? 'Loan amount' : 'Total principal'}</div>
        <div className="metric-card-value">
          {isValid ? <AnimatedNumber value={financedPrincipal} formatter={formatVal} duration={480} /> : '—'}
        </div>
      </div>
      <div className="metric-card metric-card--interest">
        <div className="metric-card-label">Total interest</div>
        <div className="metric-card-value">
          {isValid ? <AnimatedNumber value={totalInterest} formatter={formatVal} duration={480} /> : '—'}
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-card-label">Total repayment</div>
        <div className="metric-card-value">
          {isValid ? <AnimatedNumber value={totalRepayment} formatter={formatVal} duration={480} /> : '—'}
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
              {isValid ? <AnimatedNumber value={processingFee} formatter={formatVal} duration={480} /> : '—'}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-label">Total cost</div>
            <div className="metric-card-value">
              {isValid ? <AnimatedNumber value={totalCost} formatter={formatVal} duration={480} /> : '—'}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
