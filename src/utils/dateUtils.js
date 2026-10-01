export function getDefaultStartDate() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date, months) {
  const newDate = new Date(date.getTime());
  const expectedMonth = (newDate.getMonth() + months) % 12;
  newDate.setMonth(newDate.getMonth() + months);
  
  if (newDate.getMonth() !== (expectedMonth + 12) % 12) {
    newDate.setDate(0); 
  }
  return newDate;
}

export function formatPaymentDate(date) {
  if (!date || !(date instanceof Date)) return '';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  } catch {
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  }
}
