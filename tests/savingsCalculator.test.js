import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSavingsProjection,
  calculateRequiredContribution,
  calculateTimeToGoal,
  calculateScenarioComparison,
  calculateInflationAdjustedValue,
  validateSavingsInputs,
  validateGoalInputs,
  getEffectiveRatePerPeriod,
  generateSavingsCSV,
} from '../src/utils/savingsCalculator.js';

describe('Savings Calculator Engine Tests', () => {
  test('Test Case 1: Standard projection (100k start, 10k/mo, 8%, 5y, end of period)', () => {
    const result = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      timeYears: 5,
      timeMonths: 0,
      contributionTiming: 'end',
    });

    const { summary, schedule } = result;
    // Expected approximate ending balance ~883,753
    assert.ok(Math.abs(summary.endingBalance - 883753) < 20, `Ending balance was ${summary.endingBalance}`);
    assert.strictEqual(summary.totalContributions, 700000);
    assert.ok(Math.abs(summary.totalInterest - 183753) < 20, `Total interest was ${summary.totalInterest}`);
    assert.strictEqual(schedule.length, 60);

    // Schedule reconciliation
    const finalRow = schedule[schedule.length - 1];
    assert.ok(Math.abs(finalRow.endBalance - summary.endingBalance) < 0.01);
  });

  test('Test Case 2: Zero interest (100k start, 10k/mo, 0%, 5y)', () => {
    const result = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      annualRate: 0,
      timeYears: 5,
      timeMonths: 0,
      contributionTiming: 'end',
    });

    const { summary, schedule } = result;
    assert.strictEqual(summary.totalContributions, 700000);
    assert.strictEqual(summary.endingBalance, 700000);
    assert.strictEqual(summary.totalInterest, 0);
    assert.strictEqual(schedule.length, 60);
  });

  test('Test Case 3: No regular savings (100k start, 0 contrib, 8%, 5y)', () => {
    const result = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 0,
      contributionFrequency: 'monthly',
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      timeYears: 5,
      timeMonths: 0,
    });

    const { summary } = result;
    // FV = 100000 * (1 + 0.08/12)^60 = 148984.57
    const expected = 100000 * Math.pow(1 + 0.08 / 12, 60);
    assert.ok(Math.abs(summary.endingBalance - expected) < 1);
    assert.strictEqual(summary.totalContributions, 100000);
    assert.ok(summary.totalInterest > 48000);
  });

  test('Test Case 4: No starting balance (0 start, 10k/mo, 8%, 5y)', () => {
    const result = generateSavingsProjection({
      startingBalance: 0,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      timeYears: 5,
      timeMonths: 0,
      contributionTiming: 'end',
    });

    const { summary } = result;
    assert.strictEqual(summary.totalContributions, 600000);
    assert.ok(summary.endingBalance > 600000);
    assert.ok(summary.totalInterest > 0);
  });

  test('Test Case 5: Yearly contribution (100k start, 120k/yr, 8%, 5y)', () => {
    const result = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 120000,
      contributionFrequency: 'yearly',
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'annually',
      timeYears: 5,
      timeMonths: 0,
      contributionTiming: 'end',
    });

    const { summary, schedule } = result;
    assert.strictEqual(schedule.length, 5); // 5 periods, 1 per year
    assert.strictEqual(summary.totalContributions, 100000 + 5 * 120000);
  });

  test('Test Case 6: Beginning vs End contribution timing', () => {
    const common = {
      startingBalance: 100000,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      timeYears: 5,
      timeMonths: 0,
    };

    const endResult = generateSavingsProjection({ ...common, contributionTiming: 'end' });
    const begResult = generateSavingsProjection({ ...common, contributionTiming: 'beginning' });

    assert.ok(begResult.summary.endingBalance > endResult.summary.endingBalance);
    assert.ok(begResult.summary.totalInterest > endResult.summary.totalInterest);
    assert.strictEqual(begResult.summary.totalContributions, endResult.summary.totalContributions);
  });

  test('Test Case 7: Rate Type (Nominal vs APY)', () => {
    const nominalRate = getEffectiveRatePerPeriod({
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      contributionFrequency: 'monthly',
    });

    const apyRate = getEffectiveRatePerPeriod({
      annualRate: 8,
      rateType: 'apy',
      compoundingFrequency: 'monthly',
      contributionFrequency: 'monthly',
    });

    // 8% APY should have lower monthly rate than 8% nominal compounded monthly
    // Nominal monthly: 0.08 / 12 = 0.0066667
    // APY monthly: (1.08)^(1/12) - 1 = 0.006434
    assert.notStrictEqual(nominalRate, apyRate);
    assert.ok(nominalRate > apyRate);
  });

  test('Test Case 8 & 14: Large horizon (30 & 50 years, numerical safety)', () => {
    const result50 = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 50000,
      contributionFrequency: 'monthly',
      annualRate: 10,
      timeYears: 50,
      timeMonths: 0,
    });

    assert.ok(Number.isFinite(result50.summary.endingBalance));
    assert.ok(!isNaN(result50.summary.endingBalance));
    assert.strictEqual(result50.schedule.length, 600);
  });

  test('Test Case 9: Goal calculation round-trip', () => {
    const goalParams = {
      targetAmount: 1000000,
      currentSavings: 100000,
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      contributionFrequency: 'monthly',
      timeYears: 5,
      timeMonths: 0,
      contributionTiming: 'end',
    };

    const pmt = calculateRequiredContribution(goalParams);
    assert.ok(pmt > 0);

    // Round-trip into projection engine
    const projection = generateSavingsProjection({
      startingBalance: goalParams.currentSavings,
      contributionAmount: pmt,
      contributionFrequency: goalParams.contributionFrequency,
      annualRate: goalParams.annualRate,
      rateType: goalParams.rateType,
      compoundingFrequency: goalParams.compoundingFrequency,
      timeYears: goalParams.timeYears,
      timeMonths: goalParams.timeMonths,
      contributionTiming: goalParams.contributionTiming,
    });

    assert.ok(
      Math.abs(projection.summary.endingBalance - goalParams.targetAmount) < 1,
      `Expected ~1000000, got ${projection.summary.endingBalance}`
    );
  });

  test('Test Case 9b: Goal calculation beginning-of-period round-trip', () => {
    const goalParams = {
      targetAmount: 2500000,
      currentSavings: 200000,
      annualRate: 9,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      contributionFrequency: 'monthly',
      timeYears: 7,
      timeMonths: 0,
      contributionTiming: 'beginning',
    };

    const pmt = calculateRequiredContribution(goalParams);
    assert.ok(pmt > 0);

    const projection = generateSavingsProjection({
      startingBalance: goalParams.currentSavings,
      contributionAmount: pmt,
      contributionFrequency: goalParams.contributionFrequency,
      annualRate: goalParams.annualRate,
      rateType: goalParams.rateType,
      compoundingFrequency: goalParams.compoundingFrequency,
      timeYears: goalParams.timeYears,
      timeMonths: goalParams.timeMonths,
      contributionTiming: goalParams.contributionTiming,
    });

    assert.ok(
      Math.abs(projection.summary.endingBalance - goalParams.targetAmount) < 1,
      `Expected ~2500000, got ${projection.summary.endingBalance}`
    );
  });

  test('Test Case 10: Time to goal calculation', () => {
    const timeRes = calculateTimeToGoal({
      targetAmount: 1000000,
      currentSavings: 100000,
      contributionAmount: 12000,
      annualRate: 8,
      rateType: 'nominal',
      compoundingFrequency: 'monthly',
      contributionFrequency: 'monthly',
      contributionTiming: 'end',
    });

    assert.ok(timeRes.reachable);
    assert.ok(timeRes.periods > 0);
    assert.ok(timeRes.projectedBalance >= 1000000);
  });

  test('Test Case 11: Inflation adjustment', () => {
    const futureAmount = 1000000;
    const inflationRate = 3;
    const years = 10;

    const realValue = calculateInflationAdjustedValue(futureAmount, inflationRate, years);
    assert.ok(realValue < futureAmount);
    // 1000000 / (1.03)^10 = 744093.91
    assert.ok(Math.abs(realValue - 744094) < 10);
  });

  test('Test Case 12: Annual contribution step-up', () => {
    const result = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      annualRate: 8,
      timeYears: 3,
      timeMonths: 0,
      annualContributionIncrease: 5,
    });

    // Month 1 should have contribution 10000
    assert.strictEqual(result.schedule[0].contribution, 10000);
    // Month 13 should have contribution 10500
    assert.ok(Math.abs(result.schedule[12].contribution - 10500) < 0.01);
    // Month 25 should have contribution 11025
    assert.ok(Math.abs(result.schedule[24].contribution - 11025) < 0.01);
  });

  test('Test Case 13: One-time deposit triggers exactly once', () => {
    const result = generateSavingsProjection({
      startingBalance: 100000,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      annualRate: 8,
      timeYears: 3,
      timeMonths: 0,
      oneTimeDepositEnabled: true,
      oneTimeDepositAmount: 50000,
      oneTimeDepositPeriod: 12, // month 13
    });

    const deposits = result.schedule.filter(r => r.oneTimeDeposit > 0);
    assert.strictEqual(deposits.length, 1);
    assert.strictEqual(deposits[0].oneTimeDeposit, 50000);
    assert.strictEqual(deposits[0].period, 13);
  });

  test('Scenario comparison calculation', () => {
    const scenarios = calculateScenarioComparison({
      startingBalance: 100000,
      contributionAmount: 10000,
      contributionFrequency: 'monthly',
      timeYears: 5,
      timeMonths: 0,
    }, [6, 8, 10]);

    assert.strictEqual(scenarios.length, 3);
    assert.strictEqual(scenarios[0].rate, 6);
    assert.strictEqual(scenarios[1].rate, 8);
    assert.strictEqual(scenarios[2].rate, 10);
    assert.ok(scenarios[0].endingBalance < scenarios[1].endingBalance);
    assert.ok(scenarios[1].endingBalance < scenarios[2].endingBalance);
  });

  test('Test Case 15: Input validation & numerical safety', () => {
    const invalidInputs = validateSavingsInputs({
      startingBalance: -100,
      contributionAmount: -50,
      annualRate: -5,
      timeYears: 0,
      timeMonths: 0,
    });

    assert.strictEqual(invalidInputs.valid, false);
    assert.ok(invalidInputs.errors.startingBalance);
    assert.ok(invalidInputs.errors.contributionAmount);
    assert.ok(invalidInputs.errors.annualRate);
    assert.ok(invalidInputs.errors.timeHorizon);

    const invalidGoal = validateGoalInputs({
      targetAmount: 0,
      currentSavings: -10,
      annualRate: -2,
      timeYears: 0,
      timeMonths: 0,
    });

    assert.strictEqual(invalidGoal.valid, false);
    assert.ok(invalidGoal.errors.targetAmount);
    assert.ok(invalidGoal.errors.currentSavings);
    assert.ok(invalidGoal.errors.annualRate);
    assert.ok(invalidGoal.errors.timeHorizon);
  });

  test('Reconciliation rule: balance = start + contributions + interest - fees', () => {
    const result = generateSavingsProjection({
      startingBalance: 150000,
      contributionAmount: 15000,
      contributionFrequency: 'monthly',
      annualRate: 7.5,
      timeYears: 4,
      timeMonths: 6,
      annualFee: 1200,
    });

    const { summary, schedule } = result;
    const calcEnding = summary.startingBalance + (summary.totalContributions - summary.startingBalance) + summary.totalInterest - summary.totalFees;
    assert.ok(Math.abs(summary.endingBalance - calcEnding) < 0.01, `Ending: ${summary.endingBalance}, Calc: ${calcEnding}`);

    // Schedule sum reconciliation
    const totalScheduleContrib = schedule.reduce((sum, r) => sum + r.contribution + r.oneTimeDeposit, 0);
    const totalScheduleInterest = schedule.reduce((sum, r) => sum + r.interest, 0);
    const totalScheduleFees = schedule.reduce((sum, r) => sum + r.fee, 0);

    assert.ok(Math.abs(totalScheduleContrib - (summary.totalContributions - summary.startingBalance)) < 0.01);
    assert.ok(Math.abs(totalScheduleInterest - summary.totalInterest) < 0.01);
    assert.ok(Math.abs(totalScheduleFees - summary.totalFees) < 0.01);
  });

  test('CSV export generation works and contains correct columns', () => {
    const result = generateSavingsProjection({
      startingBalance: 50000,
      contributionAmount: 5000,
      contributionFrequency: 'monthly',
      annualRate: 6,
      timeYears: 1,
      timeMonths: 0,
    });

    const csv = generateSavingsCSV(result.schedule);
    assert.ok(csv.includes('Period,Label,Starting Balance'));
    assert.ok(csv.includes('Month 1'));
    assert.ok(csv.includes('Month 12'));
  });
});
