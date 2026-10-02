/**
 * Savings Calculator Engine
 * 
 * Single source of truth for all savings calculations.
 * Pure functions — given identical inputs, returns identical outputs.
 * No DOM, React, localStorage, or network dependencies.
 */

// ─── Periodic Rate Calculations ───────────────────────────────────────────────

/**
 * Calculate the periodic interest rate from a nominal annual rate.
 * @param {number} annualRate - Annual interest rate as a percentage (e.g. 8 for 8%)
 * @param {number} compoundingPeriodsPerYear - Number of compounding periods per year
 * @returns {number} Periodic rate as a decimal
 */
export function calculatePeriodicRate(annualRate, compoundingPeriodsPerYear) {
  if (!Number.isFinite(annualRate) || !Number.isFinite(compoundingPeriodsPerYear) || compoundingPeriodsPerYear <= 0) {
    return 0;
  }
  return (annualRate / 100) / compoundingPeriodsPerYear;
}

/**
 * Convert APY to a periodic rate.
 * APY already incorporates compounding, so we extract the per-period rate.
 * periodicRate = (1 + APY)^(1/periodsPerYear) - 1
 * @param {number} apy - Annual Percentage Yield as a percentage (e.g. 8 for 8%)
 * @param {number} periodsPerYear - Number of periods per year
 * @returns {number} Periodic rate as a decimal
 */
export function apyToPeriodicRate(apy, periodsPerYear) {
  if (!Number.isFinite(apy) || !Number.isFinite(periodsPerYear) || periodsPerYear <= 0 || apy <= 0) {
    return 0;
  }
  return Math.pow(1 + apy / 100, 1 / periodsPerYear) - 1;
}

/**
 * Calculate the Effective Annual Rate from a nominal annual rate.
 * EAR = (1 + r/m)^m - 1
 * @param {number} annualRate - Nominal annual rate as percentage
 * @param {number} compoundingPeriodsPerYear - Compounding frequency
 * @returns {number} Effective annual rate as decimal
 */
export function calculateEffectiveAnnualRate(annualRate, compoundingPeriodsPerYear) {
  if (!Number.isFinite(annualRate) || annualRate <= 0 || !Number.isFinite(compoundingPeriodsPerYear) || compoundingPeriodsPerYear <= 0) {
    return 0;
  }
  const r = annualRate / 100;
  return Math.pow(1 + r / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1;
}

// ─── Compounding Frequency Mapping ───────────────────────────────────────────

const COMPOUNDING_PERIODS = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  'semi-annually': 2,
  annually: 1,
};

const CONTRIBUTION_PERIODS = {
  monthly: 12,
  yearly: 1,
};

export function getCompoundingPeriodsPerYear(frequency) {
  return COMPOUNDING_PERIODS[frequency] || 12;
}

export function getContributionPeriodsPerYear(frequency) {
  return CONTRIBUTION_PERIODS[frequency] || 12;
}

// ─── Effective Rate Per Contribution Period ─────────────────────────────────

/**
 * Get the effective growth rate per contribution period.
 * This correctly handles cases where compounding frequency differs from contribution frequency.
 * 
 * For nominal rate: Convert to effective rate per contribution period
 * For APY: Convert directly to per-contribution-period rate
 * 
 * @param {Object} params
 * @param {number} params.annualRate - Annual rate as percentage
 * @param {string} params.rateType - 'nominal' or 'apy'
 * @param {string} params.compoundingFrequency - 'daily'|'monthly'|'quarterly'|'semi-annually'|'annually'
 * @param {string} params.contributionFrequency - 'monthly'|'yearly'
 * @returns {number} Effective rate per contribution period as decimal
 */
export function getEffectiveRatePerPeriod({ annualRate, rateType, compoundingFrequency, contributionFrequency }) {
  if (!Number.isFinite(annualRate) || annualRate <= 0) return 0;

  const contributionPeriodsPerYear = getContributionPeriodsPerYear(contributionFrequency);

  if (rateType === 'apy') {
    // APY already includes compounding. Convert to per-contribution-period rate.
    return Math.pow(1 + annualRate / 100, 1 / contributionPeriodsPerYear) - 1;
  }

  // Nominal rate: first compute effective annual rate, then convert to per-contribution-period
  const compoundingPeriodsPerYear = getCompoundingPeriodsPerYear(compoundingFrequency);
  const ear = Math.pow(1 + (annualRate / 100) / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1;
  return Math.pow(1 + ear, 1 / contributionPeriodsPerYear) - 1;
}

// ─── Schedule-Based Projection Engine ───────────────────────────────────────

/**
 * Generate a complete savings projection schedule.
 * This is the ONE authoritative calculation engine that produces all derived data.
 * 
 * @param {Object} inputs - All calculator inputs
 * @returns {Object} Complete projection result
 */
export function generateSavingsProjection(inputs) {
  const {
    startingBalance = 0,
    contributionAmount = 0,
    contributionFrequency = 'monthly',
    annualRate = 0,
    rateType = 'nominal',
    compoundingFrequency = 'monthly',
    timeYears = 0,
    timeMonths = 0,
    contributionTiming = 'end',
    annualContributionIncrease = 0,
    oneTimeDepositEnabled = false,
    oneTimeDepositAmount = 0,
    oneTimeDepositPeriod = 0, // 0-indexed period when deposit occurs
    inflationEnabled = false,
    inflationRate = 0,
    annualFee = 0,
  } = inputs;

  // Total periods in contribution frequency terms
  const contributionPeriodsPerYear = getContributionPeriodsPerYear(contributionFrequency);
  const totalPeriods = Math.round(timeYears * contributionPeriodsPerYear + (contributionFrequency === 'monthly' ? timeMonths : timeMonths / 12 * contributionPeriodsPerYear));

  if (totalPeriods <= 0) {
    return createEmptyResult(startingBalance);
  }

  // Get effective rate per contribution period
  const effectivePeriodicRate = getEffectiveRatePerPeriod({
    annualRate, rateType, compoundingFrequency, contributionFrequency
  });

  const schedule = [];
  let balance = Math.max(0, Number(startingBalance) || 0);
  let cumulativeContributions = balance; // starting balance counts as initial contribution
  let cumulativeInterest = 0;
  let cumulativeFees = 0;
  let currentContribution = Math.max(0, Number(contributionAmount) || 0);
  const increaseRate = (Number(annualContributionIncrease) || 0) / 100;
  const fee = Math.max(0, Number(annualFee) || 0);

  for (let period = 1; period <= totalPeriods; period++) {
    const startBalance = balance;
    let periodContribution = currentContribution;
    let periodInterest = 0;
    let periodFee = 0;

    // One-time deposit check
    let oneTimeDeposit = 0;
    if (oneTimeDepositEnabled && period === oneTimeDepositPeriod + 1 && Number.isFinite(oneTimeDepositAmount) && oneTimeDepositAmount > 0) {
      oneTimeDeposit = oneTimeDepositAmount;
    }

    if (contributionTiming === 'beginning') {
      // Add contribution and one-time deposit before calculating interest
      balance += periodContribution + oneTimeDeposit;
      periodInterest = balance * effectivePeriodicRate;
      balance += periodInterest;
    } else {
      // End of period: calculate interest on existing balance, then add contribution
      periodInterest = balance * effectivePeriodicRate;
      balance += periodInterest;
      balance += periodContribution + oneTimeDeposit;
    }

    // Apply annual fee (deduct once per year at the end of the year)
    if (fee > 0 && period % contributionPeriodsPerYear === 0) {
      periodFee = fee;
      balance = Math.max(0, balance - periodFee);
    }

    cumulativeContributions += periodContribution + oneTimeDeposit;
    cumulativeInterest += periodInterest;
    cumulativeFees += periodFee;

    // Determine the year this period belongs to (1-indexed)
    const yearNumber = Math.ceil(period / contributionPeriodsPerYear);
    // Period label
    const periodLabel = contributionFrequency === 'monthly' 
      ? `Month ${period}`
      : `Year ${period}`;

    schedule.push({
      period,
      periodLabel,
      yearNumber,
      startBalance,
      contribution: periodContribution,
      oneTimeDeposit,
      interest: periodInterest,
      fee: periodFee,
      endBalance: balance,
      cumulativeContributions,
      cumulativeInterest,
      cumulativeFees,
    });

    // Annual contribution increase — apply at the start of each new year
    if (increaseRate > 0 && period % contributionPeriodsPerYear === 0) {
      currentContribution = currentContribution * (1 + increaseRate);
    }
  }

  const endingBalance = balance;
  const totalContributions = cumulativeContributions;
  const totalInterest = cumulativeInterest;
  const totalFees = cumulativeFees;
  const totalTimeYears = totalPeriods / contributionPeriodsPerYear;

  // Inflation adjustment
  let inflationAdjustedValue = endingBalance;
  if (inflationEnabled && Number.isFinite(inflationRate) && inflationRate > 0) {
    inflationAdjustedValue = endingBalance / Math.pow(1 + inflationRate / 100, totalTimeYears);
  }

  // Generate yearly summary
  const yearlySummary = generateYearlySummary(schedule);

  // Generate milestones
  const milestones = generateMilestones(schedule, contributionPeriodsPerYear);

  return {
    summary: {
      startingBalance: Number(startingBalance) || 0,
      endingBalance,
      totalContributions,
      totalInterest,
      totalFees,
      totalTimeYears,
      totalPeriods,
      contributionFrequency,
      effectivePeriodicRate,
      inflationAdjustedValue,
      inflationEnabled,
      inflationRate: inflationEnabled ? inflationRate : 0,
    },
    schedule,
    yearlySummary,
    milestones,
  };
}

// ─── Empty Result ────────────────────────────────────────────────────────────

function createEmptyResult(startingBalance) {
  const sb = Math.max(0, Number(startingBalance) || 0);
  return {
    summary: {
      startingBalance: sb,
      endingBalance: sb,
      totalContributions: sb,
      totalInterest: 0,
      totalFees: 0,
      totalTimeYears: 0,
      totalPeriods: 0,
      contributionFrequency: 'monthly',
      effectivePeriodicRate: 0,
      inflationAdjustedValue: sb,
      inflationEnabled: false,
      inflationRate: 0,
    },
    schedule: [],
    yearlySummary: [],
    milestones: [],
  };
}

// ─── Yearly Summary ──────────────────────────────────────────────────────────

function generateYearlySummary(schedule) {
  if (schedule.length === 0) return [];

  const years = [];
  let currentYear = null;
  let yearData = null;

  for (const row of schedule) {
    if (row.yearNumber !== currentYear) {
      if (yearData) years.push(yearData);
      currentYear = row.yearNumber;
      yearData = {
        year: row.yearNumber,
        startBalance: row.startBalance,
        contributions: 0,
        interest: 0,
        fees: 0,
        endBalance: 0,
      };
    }
    yearData.contributions += row.contribution + row.oneTimeDeposit;
    yearData.interest += row.interest;
    yearData.fees += row.fee;
    yearData.endBalance = row.endBalance;
  }
  if (yearData) years.push(yearData);
  return years;
}

// ─── Milestones ──────────────────────────────────────────────────────────────

function generateMilestones(schedule, periodsPerYear) {
  if (schedule.length === 0) return [];

  const milestonePeriodsMap = {
    '1 month': periodsPerYear === 12 ? 1 : null,
    '6 months': periodsPerYear === 12 ? 6 : null,
    '1 year': periodsPerYear,
    '3 years': periodsPerYear * 3,
    '5 years': periodsPerYear * 5,
    '10 years': periodsPerYear * 10,
    '15 years': periodsPerYear * 15,
    '20 years': periodsPerYear * 20,
    '30 years': periodsPerYear * 30,
  };

  const milestones = [];
  for (const [label, period] of Object.entries(milestonePeriodsMap)) {
    if (period === null || period > schedule.length) continue;
    const row = schedule[period - 1];
    if (row) {
      milestones.push({
        label,
        period,
        balance: row.endBalance,
        totalContributions: row.cumulativeContributions,
        totalInterest: row.cumulativeInterest,
      });
    }
  }

  return milestones;
}

// ─── Savings Goal: Required Contribution ─────────────────────────────────────

/**
 * Calculate the required periodic contribution to reach a target amount.
 * 
 * For end-of-period:
 *   FV = P(1+i)^n + PMT × [((1+i)^n - 1) / i]
 *   PMT = [FV - P(1+i)^n] × i / [(1+i)^n - 1]
 * 
 * For beginning-of-period:
 *   FV = P(1+i)^n + PMT × [((1+i)^n - 1) / i] × (1+i)
 *   PMT = [FV - P(1+i)^n] × i / [((1+i)^n - 1) × (1+i)]
 * 
 * @param {Object} params
 * @returns {number} Required periodic contribution
 */
export function calculateRequiredContribution({
  targetAmount,
  currentSavings = 0,
  annualRate = 0,
  rateType = 'nominal',
  compoundingFrequency = 'monthly',
  contributionFrequency = 'monthly',
  timeYears = 0,
  timeMonths = 0,
  contributionTiming = 'end',
}) {
  const target = Number(targetAmount) || 0;
  const principal = Math.max(0, Number(currentSavings) || 0);
  
  if (target <= 0) return 0;

  const periodsPerYear = getContributionPeriodsPerYear(contributionFrequency);
  const totalPeriods = Math.round(timeYears * periodsPerYear + (contributionFrequency === 'monthly' ? timeMonths : timeMonths / 12 * periodsPerYear));

  if (totalPeriods <= 0) return 0;

  const i = getEffectiveRatePerPeriod({ annualRate, rateType, compoundingFrequency, contributionFrequency });

  // Future value of starting balance
  const fvPrincipal = i > 0 ? principal * Math.pow(1 + i, totalPeriods) : principal;

  // If starting balance already reaches or exceeds target
  if (fvPrincipal >= target) return 0;

  const remaining = target - fvPrincipal;

  if (i === 0) {
    // Zero interest case
    return remaining / totalPeriods;
  }

  const fvFactor = Math.pow(1 + i, totalPeriods) - 1;
  
  if (contributionTiming === 'beginning') {
    return remaining * i / (fvFactor * (1 + i));
  } else {
    return remaining * i / fvFactor;
  }
}

// ─── Savings Goal: Time to Goal ──────────────────────────────────────────────

/**
 * Calculate how many periods it takes to reach a target amount.
 * Uses schedule simulation for accuracy with varying contributions.
 * 
 * @param {Object} params
 * @returns {Object} { periods, years, months, reachable }
 */
export function calculateTimeToGoal({
  targetAmount,
  currentSavings = 0,
  contributionAmount = 0,
  annualRate = 0,
  rateType = 'nominal',
  compoundingFrequency = 'monthly',
  contributionFrequency = 'monthly',
  contributionTiming = 'end',
  maxPeriods = 1200, // 100 years monthly cap
}) {
  const target = Number(targetAmount) || 0;
  const contribution = Math.max(0, Number(contributionAmount) || 0);
  let balance = Math.max(0, Number(currentSavings) || 0);

  if (target <= 0) return { periods: 0, years: 0, months: 0, reachable: true };
  if (balance >= target) return { periods: 0, years: 0, months: 0, reachable: true };

  const periodsPerYear = getContributionPeriodsPerYear(contributionFrequency);
  const i = getEffectiveRatePerPeriod({ annualRate, rateType, compoundingFrequency, contributionFrequency });

  // If no growth and no contribution, target is unreachable
  if (i <= 0 && contribution <= 0) {
    return { periods: Infinity, years: Infinity, months: Infinity, reachable: false };
  }

  let totalContributions = balance;
  let totalInterest = 0;

  for (let period = 1; period <= maxPeriods; period++) {
    if (contributionTiming === 'beginning') {
      balance += contribution;
      const interest = balance * i;
      balance += interest;
      totalInterest += interest;
    } else {
      const interest = balance * i;
      balance += interest;
      totalInterest += interest;
      balance += contribution;
    }
    totalContributions += contribution;

    if (balance >= target) {
      const totalMonths = contributionFrequency === 'monthly' ? period : period * 12;
      return {
        periods: period,
        years: Math.floor(totalMonths / 12),
        months: totalMonths % 12,
        totalMonths,
        reachable: true,
        projectedBalance: balance,
        totalContributions,
        totalInterest,
      };
    }
  }

  return { periods: maxPeriods, years: Math.floor(maxPeriods / periodsPerYear), months: 0, reachable: false };
}

// ─── Scenario Comparison ─────────────────────────────────────────────────────

/**
 * Calculate projections for multiple rate scenarios.
 * @param {Object} baseInputs - Base calculator inputs
 * @param {number[]} rates - Array of rates to compare [lower, base, higher]
 * @returns {Object[]} Array of scenario results
 */
export function calculateScenarioComparison(baseInputs, rates) {
  return rates.map(rate => {
    const result = generateSavingsProjection({ ...baseInputs, annualRate: rate });
    return {
      rate,
      endingBalance: result.summary.endingBalance,
      totalContributions: result.summary.totalContributions,
      totalInterest: result.summary.totalInterest,
    };
  });
}

// ─── Inflation Adjustment ────────────────────────────────────────────────────

/**
 * Calculate the present-day purchasing power of a future amount.
 * @param {number} futureAmount - Future nominal amount
 * @param {number} inflationRate - Annual inflation rate as percentage
 * @param {number} years - Number of years
 * @returns {number} Value in today's money
 */
export function calculateInflationAdjustedValue(futureAmount, inflationRate, years) {
  if (!Number.isFinite(futureAmount) || !Number.isFinite(inflationRate) || !Number.isFinite(years) || inflationRate <= 0 || years <= 0) {
    return futureAmount;
  }
  return futureAmount / Math.pow(1 + inflationRate / 100, years);
}

// ─── Input Validation ────────────────────────────────────────────────────────

export function validateSavingsInputs(inputs) {
  const errors = {};
  let valid = true;

  const startingBalance = Number(inputs.startingBalance);
  if (inputs.startingBalance !== '' && inputs.startingBalance !== undefined && (isNaN(startingBalance) || startingBalance < 0)) {
    errors.startingBalance = 'Starting balance must be 0 or greater';
    valid = false;
  }

  const contribution = Number(inputs.contributionAmount);
  if (inputs.contributionAmount !== '' && inputs.contributionAmount !== undefined && (isNaN(contribution) || contribution < 0)) {
    errors.contributionAmount = 'Contribution must be 0 or greater';
    valid = false;
  }

  const rate = Number(inputs.annualRate);
  if (inputs.annualRate !== '' && inputs.annualRate !== undefined && (isNaN(rate) || rate < 0)) {
    errors.annualRate = 'Annual rate must be 0% or greater';
    valid = false;
  }
  if (Number.isFinite(rate) && rate > 100) {
    errors.annualRate = 'Rate seems unusually high. Please verify.';
    // Not invalid, just a warning — we allow it
  }

  const years = Number(inputs.timeYears) || 0;
  const months = Number(inputs.timeMonths) || 0;
  const totalMonths = years * 12 + months;
  if (totalMonths <= 0) {
    errors.timeHorizon = 'Time horizon must be at least 1 month';
    valid = false;
  }
  if (totalMonths > 600) {
    errors.timeHorizon = 'Maximum 50 years (600 months)';
    valid = false;
  }

  return { valid, errors };
}

export function validateGoalInputs(inputs) {
  const errors = {};
  let valid = true;

  const target = Number(inputs.targetAmount);
  if (isNaN(target) || target <= 0) {
    errors.targetAmount = 'Target amount must be greater than 0';
    valid = false;
  }

  const currentSavings = Number(inputs.currentSavings);
  if (inputs.currentSavings !== '' && inputs.currentSavings !== undefined && (isNaN(currentSavings) || currentSavings < 0)) {
    errors.currentSavings = 'Current savings must be 0 or greater';
    valid = false;
  }

  const rate = Number(inputs.annualRate);
  if (inputs.annualRate !== '' && inputs.annualRate !== undefined && (isNaN(rate) || rate < 0)) {
    errors.annualRate = 'Annual rate must be 0% or greater';
    valid = false;
  }

  const years = Number(inputs.timeYears) || 0;
  const months = Number(inputs.timeMonths) || 0;
  const totalMonths = years * 12 + months;
  if (totalMonths <= 0) {
    errors.timeHorizon = 'Time horizon must be at least 1 month';
    valid = false;
  }

  return { valid, errors };
}

// ─── CSV Generation ──────────────────────────────────────────────────────────

export function generateSavingsCSV(schedule) {
  if (!schedule || schedule.length === 0) return '';

  const header = [
    'Period', 'Label', 'Starting Balance', 'Contribution', 'One-Time Deposit',
    'Interest/Growth', 'Fee', 'Ending Balance', 'Cumulative Contributions', 'Cumulative Growth'
  ];
  const rows = [header];

  for (const row of schedule) {
    rows.push([
      row.period,
      row.periodLabel,
      row.startBalance.toFixed(2),
      row.contribution.toFixed(2),
      row.oneTimeDeposit.toFixed(2),
      row.interest.toFixed(2),
      row.fee.toFixed(2),
      row.endBalance.toFixed(2),
      row.cumulativeContributions.toFixed(2),
      row.cumulativeInterest.toFixed(2),
    ]);
  }

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
