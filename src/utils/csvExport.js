export function generateCSV(schedule, _currencyCode) {
  if (!schedule || schedule.length === 0) return '';
  
  const header = ['Payment Number', 'Date', 'Payment', 'Principal', 'Interest', 'Cumulative Interest', 'Remaining Balance'];
  const rows = [header];

  schedule.forEach(row => {
    const dateStr = row.date instanceof Date ? 
      `${row.date.getFullYear()}-${String(row.date.getMonth() + 1).padStart(2, '0')}-${String(row.date.getDate()).padStart(2, '0')}` : 
      row.date;
      
    rows.push([
      row.month,
      dateStr,
      row.payment.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.cumulativeInterest.toFixed(2),
      row.balance.toFixed(2)
    ]);
  });

  return rows.map(r => 
    r.map(field => {
      const fieldStr = String(field);
      if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
        return `"${fieldStr.replace(/"/g, '""')}"`;
      }
      return fieldStr;
    }).join(',')
  ).join('\n');
}

export function downloadCSV(csvString, filename = 'emi-amortization-schedule.csv') {
  if (typeof window === 'undefined') return;
  
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
