const CURRENCIES = {
  NPR: { code: 'NPR', locale: 'en-IN', symbol: 'NPR', name: 'Nepalese Rupee', minFraction: 2, maxFraction: 2 },
  USD: { code: 'USD', locale: 'en-US', symbol: '$', name: 'US Dollar', minFraction: 2, maxFraction: 2 },
  INR: { code: 'INR', locale: 'en-IN', symbol: '₹', name: 'Indian Rupee', minFraction: 2, maxFraction: 2 },
  EUR: { code: 'EUR', locale: 'en-IE', symbol: '€', name: 'Euro', minFraction: 2, maxFraction: 2 },
  GBP: { code: 'GBP', locale: 'en-GB', symbol: '£', name: 'British Pound', minFraction: 2, maxFraction: 2 },
};

export function getCurrencies() { 
  return CURRENCIES; 
}

export function getCurrency(code) { 
  return CURRENCIES[code] || CURRENCIES.NPR; 
}

export function formatCurrency(amount, currencyCode = 'NPR') {
  const value = Number(amount) || 0;
  const currency = getCurrency(currencyCode);
  
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'code',
      minimumFractionDigits: currency.minFraction,
      maximumFractionDigits: currency.maxFraction
    }).format(value);
  } catch {
    return `${currency.code} ${value.toFixed(2)}`;
  }
}

export function formatCurrencyCompact(amount, currencyCode = 'NPR') {
  const value = Number(amount) || 0;
  const currency = getCurrency(currencyCode);
  
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${currency.code} ${Math.round(value)}`;
  }
}

export function formatPercentage(value) {
  const num = Number(value) || 0;
  return `${num.toString()}%`;
}

export function formatDuration(years, months) {
  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  return parts.length > 0 ? parts.join(' ') : '0 months';
}

export function formatNumber(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-IN').format(num);
}
