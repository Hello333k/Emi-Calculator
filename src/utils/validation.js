export function validateLoanInputs({ loanAmount, interestRate, termYears, termMonths }) {
  const errors = {};
  let valid = true;

  const amount = Number(loanAmount);
  if (loanAmount === undefined || loanAmount === null || loanAmount === '' || isNaN(amount) || amount <= 0) {
    errors.loanAmount = 'Purchase price must be greater than 0';
    valid = false;
  }

  const rate = Number(interestRate);
  if (interestRate === undefined || interestRate === null || interestRate === '' || isNaN(rate) || rate < 0) {
    errors.interestRate = 'Interest rate must be 0% or greater';
    valid = false;
  }

  const years = Number(termYears) || 0;
  const months = Number(termMonths) || 0;
  const totalMonths = years * 12 + months;

  if (totalMonths <= 0 || isNaN(totalMonths)) {
    errors.term = 'Loan tenure must be at least 1 month';
    valid = false;
  }

  return { valid, errors };
}

export function validateDownPayment(downPaymentValue, downPaymentMode, purchasePrice) {
  const price = Number(purchasePrice);
  const dpVal = Number(downPaymentValue);

  if (isNaN(dpVal) || dpVal < 0) {
    return { valid: false, error: 'Down payment must be 0 or greater' };
  }

  if (downPaymentMode === 'percentage') {
    if (dpVal > 100) {
      return { valid: false, error: 'Percentage cannot exceed 100%' };
    }
    if (isFinite(price) && price > 0) {
      const amount = price * dpVal / 100;
      if (amount > price) {
        return { valid: false, error: 'Down payment cannot exceed purchase price' };
      }
    }
    return { valid: true, error: null };
  }

  // mode === 'amount'
  if (isFinite(price) && price > 0 && dpVal > price) {
    return { valid: false, error: 'Down payment cannot exceed purchase price' };
  }

  return { valid: true, error: null };
}

export function parseNumericInput(value) {
  if (value === null || value === undefined || value === '') return NaN;
  if (typeof value === 'number') return value;
  
  const stripped = String(value).replace(/[^0-9.-]+/g, '');
  return Number(stripped);
}

export function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}
