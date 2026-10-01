export function calculateEMI(principal, annualRate, totalMonths) {
  if (
    !Number.isFinite(principal) || principal <= 0 ||
    !Number.isFinite(annualRate) || annualRate < 0 ||
    !Number.isFinite(totalMonths) || totalMonths <= 0
  ) {
    return 0;
  }

  if (annualRate === 0) {
    return principal / totalMonths;
  }

  const r = annualRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
  return emi;
}

export function calculateTotalInterest(emi, totalMonths, principal) {
  if (!Number.isFinite(emi) || !Number.isFinite(totalMonths) || !Number.isFinite(principal)) {
    return 0;
  }
  const total = (emi * totalMonths) - principal;
  if (Math.abs(total) < 1e-6) {
    return 0;
  }
  return total > 0 ? total : 0;
}

export function calculateTotalRepayment(emi, totalMonths) {
  return emi * totalMonths;
}

export function generateAmortizationSchedule(principal, annualRate, totalMonths, startDate) {
  if (!principal || !totalMonths) return [];

  const emi = calculateEMI(principal, annualRate, totalMonths);
  const r = annualRate / 12 / 100;
  let balance = principal;
  let cumulativeInterest = 0;
  const schedule = [];
  
  const baseDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  for (let month = 1; month <= totalMonths; month++) {
    let interest = balance * r;
    let payment = emi;
    let principalComponent = payment - interest;

    if (month === totalMonths) {
      principalComponent = balance;
      payment = principalComponent + interest;
      balance = 0;
    } else {
      balance -= principalComponent;
    }

    cumulativeInterest += interest;

    const paymentDate = new Date(baseDate);
    paymentDate.setMonth(paymentDate.getMonth() + (month - 1));

    schedule.push({
      month,
      date: paymentDate,
      payment,
      principal: principalComponent,
      interest,
      balance,
      cumulativeInterest
    });
  }

  return schedule;
}

export function calculateExtraPaymentScenario(principal, annualRate, totalMonths, extraMonthly = 0, extraAnnual = 0, extraOneTime = 0, startDate) {
  if (!principal || !totalMonths) {
    return { schedule: [], totalInterest: 0, totalPaid: 0, monthsSaved: 0, interestSaved: 0, originalTotalInterest: 0, originalMonths: 0 };
  }

  const originalEMI = calculateEMI(principal, annualRate, totalMonths);
  const originalSchedule = generateAmortizationSchedule(principal, annualRate, totalMonths, startDate);
  const originalTotalInterest = originalSchedule.length > 0 ? originalSchedule[originalSchedule.length - 1].cumulativeInterest : 0;
  const originalMonths = totalMonths;

  const r = annualRate / 12 / 100;
  let balance = principal;
  let cumulativeInterest = 0;
  const schedule = [];
  
  const baseDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let month = 1;

  while (balance > 0 && month <= originalMonths * 2) {
    let interest = balance * r;
    let basePayment = originalEMI;
    
    let extraPayment = extraMonthly;
    if (month % 12 === 0) extraPayment += extraAnnual;
    if (month === 1) extraPayment += extraOneTime;

    let totalPayment = basePayment + extraPayment;
    let principalComponent = totalPayment - interest;

    if (principalComponent >= balance) {
      principalComponent = balance;
      totalPayment = principalComponent + interest;
      balance = 0;
    } else {
      balance -= principalComponent;
    }

    cumulativeInterest += interest;

    const paymentDate = new Date(baseDate);
    paymentDate.setMonth(paymentDate.getMonth() + (month - 1));

    schedule.push({
      month,
      date: paymentDate,
      payment: totalPayment,
      principal: principalComponent,
      interest,
      balance,
      cumulativeInterest
    });

    if (balance <= 0) break;
    month++;
  }

  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);

  return {
    schedule,
    totalInterest: cumulativeInterest,
    newTotalInterest: cumulativeInterest,
    totalPaid,
    monthsSaved: Math.max(0, originalMonths - schedule.length),
    interestSaved: Math.max(0, originalTotalInterest - cumulativeInterest),
    originalTotalInterest,
    originalMonths,
    newPayoffMonths: schedule.length,
    originalPayoffMonths: originalMonths
  };
}

export function calculateProcessingFee(principal, feeType, feeValue) {
  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(feeValue) || feeValue < 0) {
    return 0;
  }
  if (feeType === 'percentage') {
    return (principal * feeValue) / 100;
  }
  return feeValue;
}
