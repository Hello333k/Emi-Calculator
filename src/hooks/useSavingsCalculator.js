import { useState, useMemo, useCallback } from 'react';
import {
  generateSavingsProjection,
  calculateRequiredContribution,
  calculateTimeToGoal,
  calculateScenarioComparison,
  validateSavingsInputs,
  validateGoalInputs,
} from '../utils/savingsCalculator';
import { useLocalStorage } from './useLocalStorage';

const DEFAULTS = {
  mode: 'growth', // 'growth' or 'goal'
  startingBalance: 100000,
  contributionAmount: 10000,
  contributionFrequency: 'monthly',
  annualRate: 8,
  rateType: 'nominal',
  compoundingFrequency: 'monthly',
  timeYears: 5,
  timeMonths: 0,
  contributionTiming: 'end',
  annualContributionIncrease: 0,
  oneTimeDepositEnabled: false,
  oneTimeDepositAmount: 0,
  oneTimeDepositPeriod: 24, // after 2 years (month 24)
  inflationEnabled: false,
  inflationRate: 3,
  annualFee: 0,
  // Goal mode
  targetAmount: 5000000,
  goalSubMode: 'contribution', // 'contribution' or 'time'
  goalContribution: 10000,
  // Scenario
  scenarioEnabled: false,
  scenarioLowerRate: 6,
  scenarioHigherRate: 10,
  // View
  scheduleView: 'yearly',
};

function parseSavingsUrlState() {
  if (typeof window === 'undefined') return {};
  const searchStr = window.location.search && window.location.search.length > 1
    ? window.location.search.slice(1)
    : (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
  const params = new URLSearchParams(searchStr);
  const state = {};

  const numFields = [
    'start', 'contribution', 'rate', 'years', 'months', 'increase',
    'oneTimeAmount', 'oneTimePeriod', 'inflation', 'fee',
    'target', 'goalContribution', 'scenarioLow', 'scenarioHigh'
  ];
  const stringFields = [
    'savingMode', 'frequency', 'rateType', 'compound', 'timing',
    'goalSub', 'view'
  ];

  for (const [key, value] of params.entries()) {
    if (numFields.includes(key)) {
      const parsed = Number(value);
      if (!isNaN(parsed) && isFinite(parsed)) state[key] = parsed;
    } else if (stringFields.includes(key)) {
      state[key] = value;
    } else if (key === 'oneTime' || key === 'inflationOn' || key === 'scenarioOn') {
      state[key] = value === '1' || value === 'true';
    }
  }
  return state;
}

export function useSavingsCalculator() {
  const urlState = useMemo(() => parseSavingsUrlState(), []);

  // Primary state
  const [mode, setMode] = useState(urlState.savingMode || DEFAULTS.mode);
  const [startingBalance, setStartingBalance] = useState(urlState.start ?? DEFAULTS.startingBalance);
  const [contributionAmount, setContributionAmount] = useState(urlState.contribution ?? DEFAULTS.contributionAmount);
  const [contributionFrequency, setContributionFrequency] = useState(urlState.frequency || DEFAULTS.contributionFrequency);
  const [annualRate, setAnnualRate] = useState(urlState.rate ?? DEFAULTS.annualRate);
  const [rateType, setRateType] = useState(urlState.rateType || DEFAULTS.rateType);
  const [compoundingFrequency, setCompoundingFrequency] = useState(urlState.compound || DEFAULTS.compoundingFrequency);
  const [timeYears, setTimeYears] = useState(urlState.years ?? DEFAULTS.timeYears);
  const [timeMonths, setTimeMonths] = useState(urlState.months ?? DEFAULTS.timeMonths);
  const [contributionTiming, setContributionTiming] = useState(urlState.timing || DEFAULTS.contributionTiming);

  // Advanced options
  const [annualContributionIncrease, setAnnualContributionIncrease] = useState(urlState.increase ?? DEFAULTS.annualContributionIncrease);
  const [oneTimeDepositEnabled, setOneTimeDepositEnabled] = useState(urlState.oneTime ?? DEFAULTS.oneTimeDepositEnabled);
  const [oneTimeDepositAmount, setOneTimeDepositAmount] = useState(urlState.oneTimeAmount ?? DEFAULTS.oneTimeDepositAmount);
  const [oneTimeDepositPeriod, setOneTimeDepositPeriod] = useState(urlState.oneTimePeriod ?? DEFAULTS.oneTimeDepositPeriod);
  const [inflationEnabled, setInflationEnabled] = useState(urlState.inflationOn ?? DEFAULTS.inflationEnabled);
  const [inflationRate, setInflationRate] = useState(urlState.inflation ?? DEFAULTS.inflationRate);
  const [annualFee, setAnnualFee] = useState(urlState.fee ?? DEFAULTS.annualFee);

  // Goal mode state
  const [targetAmount, setTargetAmount] = useState(urlState.target ?? DEFAULTS.targetAmount);
  const [goalSubMode, setGoalSubMode] = useState(urlState.goalSub || DEFAULTS.goalSubMode);
  const [goalContribution, setGoalContribution] = useState(urlState.goalContribution ?? DEFAULTS.goalContribution);

  // Scenario state
  const [scenarioEnabled, setScenarioEnabled] = useState(urlState.scenarioOn ?? DEFAULTS.scenarioEnabled);
  const [scenarioLowerRate, setScenarioLowerRate] = useState(urlState.scenarioLow ?? DEFAULTS.scenarioLowerRate);
  const [scenarioHigherRate, setScenarioHigherRate] = useState(urlState.scenarioHigh ?? DEFAULTS.scenarioHigherRate);

  // View state
  const [scheduleView, setScheduleView] = useState(urlState.view || DEFAULTS.scheduleView);

  // Currency (shared with EMI via localStorage)
  const [currency, setCurrency] = useLocalStorage('emi-currency', 'NPR');

  // ─── Validation ───────────────────────────────────────────────────────────
  const growthValidation = useMemo(() => validateSavingsInputs({
    startingBalance, contributionAmount, annualRate, timeYears, timeMonths,
  }), [startingBalance, contributionAmount, annualRate, timeYears, timeMonths]);

  const goalValidation = useMemo(() => validateGoalInputs({
    targetAmount, currentSavings: startingBalance, annualRate, timeYears, timeMonths,
  }), [targetAmount, startingBalance, annualRate, timeYears, timeMonths]);

  const isValid = mode === 'growth' ? growthValidation.valid : goalValidation.valid;
  const validationErrors = mode === 'growth' ? growthValidation.errors : goalValidation.errors;

  // ─── Growth Projection ───────────────────────────────────────────────────
  const projectionInputs = useMemo(() => ({
    startingBalance: Number(startingBalance) || 0,
    contributionAmount: Number(contributionAmount) || 0,
    contributionFrequency,
    annualRate: Number(annualRate) || 0,
    rateType,
    compoundingFrequency,
    timeYears: Number(timeYears) || 0,
    timeMonths: Number(timeMonths) || 0,
    contributionTiming,
    annualContributionIncrease: Number(annualContributionIncrease) || 0,
    oneTimeDepositEnabled,
    oneTimeDepositAmount: Number(oneTimeDepositAmount) || 0,
    oneTimeDepositPeriod: Number(oneTimeDepositPeriod) || 0,
    inflationEnabled,
    inflationRate: Number(inflationRate) || 0,
    annualFee: Number(annualFee) || 0,
  }), [
    startingBalance, contributionAmount, contributionFrequency,
    annualRate, rateType, compoundingFrequency,
    timeYears, timeMonths, contributionTiming,
    annualContributionIncrease,
    oneTimeDepositEnabled, oneTimeDepositAmount, oneTimeDepositPeriod,
    inflationEnabled, inflationRate, annualFee,
  ]);

  const projection = useMemo(() => {
    if (!growthValidation.valid && mode === 'growth') return null;
    return generateSavingsProjection(projectionInputs);
  }, [projectionInputs, growthValidation.valid, mode]);

  // ─── Goal Calculation ─────────────────────────────────────────────────────
  const requiredContribution = useMemo(() => {
    if (mode !== 'goal' || goalSubMode !== 'contribution' || !goalValidation.valid) return null;
    return calculateRequiredContribution({
      targetAmount: Number(targetAmount) || 0,
      currentSavings: Number(startingBalance) || 0,
      annualRate: Number(annualRate) || 0,
      rateType,
      compoundingFrequency,
      contributionFrequency,
      timeYears: Number(timeYears) || 0,
      timeMonths: Number(timeMonths) || 0,
      contributionTiming,
    });
  }, [mode, goalSubMode, targetAmount, startingBalance, annualRate, rateType, compoundingFrequency, contributionFrequency, timeYears, timeMonths, contributionTiming, goalValidation.valid]);

  // Goal projection — project using the required contribution to show schedule/chart
  const goalProjection = useMemo(() => {
    if (mode !== 'goal') return null;
    
    let contrib;
    if (goalSubMode === 'contribution' && requiredContribution !== null) {
      contrib = requiredContribution;
    } else if (goalSubMode === 'time') {
      contrib = Number(goalContribution) || 0;
    } else {
      return null;
    }

    return generateSavingsProjection({
      ...projectionInputs,
      contributionAmount: contrib,
    });
  }, [mode, goalSubMode, requiredContribution, goalContribution, projectionInputs]);

  const timeToGoal = useMemo(() => {
    if (mode !== 'goal' || goalSubMode !== 'time') return null;
    return calculateTimeToGoal({
      targetAmount: Number(targetAmount) || 0,
      currentSavings: Number(startingBalance) || 0,
      contributionAmount: Number(goalContribution) || 0,
      annualRate: Number(annualRate) || 0,
      rateType,
      compoundingFrequency,
      contributionFrequency,
      contributionTiming,
    });
  }, [mode, goalSubMode, targetAmount, startingBalance, goalContribution, annualRate, rateType, compoundingFrequency, contributionFrequency, contributionTiming]);

  // ─── Scenarios ────────────────────────────────────────────────────────────
  const scenarios = useMemo(() => {
    if (!scenarioEnabled || !isValid) return null;
    const rates = [
      Number(scenarioLowerRate) || 0,
      Number(annualRate) || 0,
      Number(scenarioHigherRate) || 0,
    ].sort((a, b) => a - b);
    return calculateScenarioComparison(projectionInputs, rates);
  }, [scenarioEnabled, isValid, scenarioLowerRate, annualRate, scenarioHigherRate, projectionInputs]);

  // ─── Active Result ────────────────────────────────────────────────────────
  const activeProjection = mode === 'goal' ? goalProjection : projection;

  // ─── Share State ──────────────────────────────────────────────────────────
  const getShareState = useCallback(() => {
    const state = {
      savingMode: mode,
      start: startingBalance,
      contribution: contributionAmount,
      frequency: contributionFrequency,
      rate: annualRate,
      rateType: rateType !== 'nominal' ? rateType : undefined,
      compound: compoundingFrequency !== 'monthly' ? compoundingFrequency : undefined,
      years: timeYears,
      months: timeMonths || undefined,
      timing: contributionTiming !== 'end' ? contributionTiming : undefined,
    };

    if (annualContributionIncrease > 0) state.increase = annualContributionIncrease;
    if (oneTimeDepositEnabled) {
      state.oneTime = 1;
      state.oneTimeAmount = oneTimeDepositAmount;
      state.oneTimePeriod = oneTimeDepositPeriod;
    }
    if (inflationEnabled) {
      state.inflationOn = 1;
      state.inflation = inflationRate;
    }
    if (annualFee > 0) state.fee = annualFee;
    if (mode === 'goal') {
      state.target = targetAmount;
      state.goalSub = goalSubMode;
      if (goalSubMode === 'time') state.goalContribution = goalContribution;
    }
    if (scenarioEnabled) {
      state.scenarioOn = 1;
      state.scenarioLow = scenarioLowerRate;
      state.scenarioHigh = scenarioHigherRate;
    }

    return state;
  }, [
    mode, startingBalance, contributionAmount, contributionFrequency,
    annualRate, rateType, compoundingFrequency, timeYears, timeMonths,
    contributionTiming, annualContributionIncrease,
    oneTimeDepositEnabled, oneTimeDepositAmount, oneTimeDepositPeriod,
    inflationEnabled, inflationRate, annualFee,
    targetAmount, goalSubMode, goalContribution,
    scenarioEnabled, scenarioLowerRate, scenarioHigherRate,
  ]);

  // ─── Reset ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setMode(DEFAULTS.mode);
    setStartingBalance(DEFAULTS.startingBalance);
    setContributionAmount(DEFAULTS.contributionAmount);
    setContributionFrequency(DEFAULTS.contributionFrequency);
    setAnnualRate(DEFAULTS.annualRate);
    setRateType(DEFAULTS.rateType);
    setCompoundingFrequency(DEFAULTS.compoundingFrequency);
    setTimeYears(DEFAULTS.timeYears);
    setTimeMonths(DEFAULTS.timeMonths);
    setContributionTiming(DEFAULTS.contributionTiming);
    setAnnualContributionIncrease(DEFAULTS.annualContributionIncrease);
    setOneTimeDepositEnabled(DEFAULTS.oneTimeDepositEnabled);
    setOneTimeDepositAmount(DEFAULTS.oneTimeDepositAmount);
    setOneTimeDepositPeriod(DEFAULTS.oneTimeDepositPeriod);
    setInflationEnabled(DEFAULTS.inflationEnabled);
    setInflationRate(DEFAULTS.inflationRate);
    setAnnualFee(DEFAULTS.annualFee);
    setTargetAmount(DEFAULTS.targetAmount);
    setGoalSubMode(DEFAULTS.goalSubMode);
    setGoalContribution(DEFAULTS.goalContribution);
    setScenarioEnabled(DEFAULTS.scenarioEnabled);
    setScenarioLowerRate(DEFAULTS.scenarioLowerRate);
    setScenarioHigherRate(DEFAULTS.scenarioHigherRate);
  }, []);

  return {
    // Mode
    mode, setMode,
    // Primary inputs
    startingBalance, setStartingBalance,
    contributionAmount, setContributionAmount,
    contributionFrequency, setContributionFrequency,
    annualRate, setAnnualRate,
    rateType, setRateType,
    compoundingFrequency, setCompoundingFrequency,
    timeYears, setTimeYears,
    timeMonths, setTimeMonths,
    contributionTiming, setContributionTiming,
    // Advanced
    annualContributionIncrease, setAnnualContributionIncrease,
    oneTimeDepositEnabled, setOneTimeDepositEnabled,
    oneTimeDepositAmount, setOneTimeDepositAmount,
    oneTimeDepositPeriod, setOneTimeDepositPeriod,
    inflationEnabled, setInflationEnabled,
    inflationRate, setInflationRate,
    annualFee, setAnnualFee,
    // Goal
    targetAmount, setTargetAmount,
    goalSubMode, setGoalSubMode,
    goalContribution, setGoalContribution,
    // Scenarios
    scenarioEnabled, setScenarioEnabled,
    scenarioLowerRate, setScenarioLowerRate,
    scenarioHigherRate, setScenarioHigherRate,
    // View
    scheduleView, setScheduleView,
    // Currency
    currency, setCurrency,
    // Derived
    projection,
    goalProjection,
    activeProjection,
    requiredContribution,
    timeToGoal,
    scenarios,
    // Validation
    isValid,
    validationErrors,
    growthValidation,
    goalValidation,
    // Actions
    getShareState,
    reset,
    DEFAULTS,
  };
}
