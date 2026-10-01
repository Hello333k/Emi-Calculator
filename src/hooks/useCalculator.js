import { useState, useMemo, useCallback } from 'react';
import {
  calculateEMI,
  calculateTotalInterest,
  calculateTotalRepayment,
  generateAmortizationSchedule,
  calculateExtraPaymentScenario,
  calculateProcessingFee
} from '../utils/calculator';
import { validateLoanInputs, validateDownPayment } from '../utils/validation';
import { decodeCalculatorState } from '../utils/shareState';
import { getDefaultStartDate } from '../utils/dateUtils';
import { useLocalStorage } from './useLocalStorage';

const DEFAULTS = {
  purchasePrice: 1000000,
  downPaymentMode: 'amount',
  downPaymentValue: 0,
  interestRate: 10,
  termYears: 5,
  termMonths: 0,
  currency: 'NPR',
  processingFeeEnabled: false,
  processingFeeType: 'percentage',
  processingFeeValue: 1,
  extraMonthlyPayment: 0,
  extraAnnualPayment: 0,
  extraOneTimePayment: 0,
  startDate: getDefaultStartDate(),
};

export function useCalculator() {
  const urlState = useMemo(() => decodeCalculatorState(window.location.search), []);
  
  // Primary state
  const [purchasePrice, setPurchasePrice] = useState(urlState.amount ?? DEFAULTS.purchasePrice);
  const [downPaymentMode, setDownPaymentMode] = useState(urlState.dpMode ?? DEFAULTS.downPaymentMode);
  const [downPaymentValue, setDownPaymentValue] = useState(urlState.dp ?? DEFAULTS.downPaymentValue);
  const [interestRate, setInterestRate] = useState(urlState.rate ?? DEFAULTS.interestRate);
  const [termYears, setTermYears] = useState(urlState.years ?? DEFAULTS.termYears);
  const [termMonths, setTermMonths] = useState(urlState.months ?? DEFAULTS.termMonths);
  const [currency, setCurrency] = useLocalStorage('emi-currency', urlState.currency ?? DEFAULTS.currency);
  const [processingFeeEnabled, setProcessingFeeEnabled] = useState(urlState.feeValue !== undefined ? true : DEFAULTS.processingFeeEnabled);
  const [processingFeeType, setProcessingFeeType] = useState(urlState.feeType ?? DEFAULTS.processingFeeType);
  const [processingFeeValue, setProcessingFeeValue] = useState(urlState.feeValue ?? DEFAULTS.processingFeeValue);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(urlState.extraMonthly ?? DEFAULTS.extraMonthlyPayment);
  const [extraAnnualPayment, setExtraAnnualPayment] = useState(urlState.extraAnnual ?? DEFAULTS.extraAnnualPayment);
  const [extraOneTimePayment, setExtraOneTimePayment] = useState(urlState.extraOneTime ?? DEFAULTS.extraOneTimePayment);
  const [startDate] = useState(DEFAULTS.startDate);

  // Derived: down payment
  const numPrice = Number(purchasePrice);
  const numDpValue = Number(downPaymentValue);

  const downPaymentAmount = useMemo(() => {
    const price = isFinite(numPrice) && numPrice > 0 ? numPrice : 0;
    const dpVal = isFinite(numDpValue) && numDpValue >= 0 ? numDpValue : 0;
    if (downPaymentMode === 'percentage') {
      const pct = Math.min(dpVal, 100);
      return Math.round(price * pct / 100);
    }
    return Math.min(dpVal, price);
  }, [numPrice, numDpValue, downPaymentMode]);

  const downPaymentPercentage = useMemo(() => {
    const price = isFinite(numPrice) && numPrice > 0 ? numPrice : 0;
    if (price === 0) return 0;
    return (downPaymentAmount / price) * 100;
  }, [numPrice, downPaymentAmount]);

  const financedPrincipal = useMemo(() => {
    const price = isFinite(numPrice) && numPrice > 0 ? numPrice : 0;
    const result = price - downPaymentAmount;
    return result > 0 ? result : 0;
  }, [numPrice, downPaymentAmount]);

  const loanToValueRatio = useMemo(() => {
    const price = isFinite(numPrice) && numPrice > 0 ? numPrice : 0;
    if (price === 0) return 0;
    return (financedPrincipal / price) * 100;
  }, [numPrice, financedPrincipal]);

  // Validation
  const safeYears = Number(termYears) || 0;
  const safeMonths = Number(termMonths) || 0;
  const totalMonths = safeYears * 12 + safeMonths;

  const validation = useMemo(
    () => validateLoanInputs({ loanAmount: purchasePrice, interestRate, termYears, termMonths }),
    [purchasePrice, interestRate, termYears, termMonths]
  );

  const downPaymentValidation = useMemo(
    () => validateDownPayment(downPaymentValue, downPaymentMode, purchasePrice),
    [downPaymentValue, downPaymentMode, purchasePrice]
  );

  // Combined validity: base validation + down payment + financed principal > 0 (unless dp == price)
  const isFullyValid = validation.valid && downPaymentValidation.valid;
  const hasLoan = financedPrincipal > 0;

  const numRate = Number(interestRate);

  // Derived calculations use financedPrincipal
  const emi = useMemo(() => {
    if (!isFullyValid || !hasLoan) return 0;
    return calculateEMI(financedPrincipal, numRate, totalMonths);
  }, [financedPrincipal, numRate, totalMonths, isFullyValid, hasLoan]);

  const totalInterest = useMemo(() => {
    if (!isFullyValid || !hasLoan) return 0;
    return calculateTotalInterest(emi, totalMonths, financedPrincipal);
  }, [emi, totalMonths, financedPrincipal, isFullyValid, hasLoan]);

  const totalRepayment = useMemo(() => {
    if (!isFullyValid || !hasLoan) return 0;
    return calculateTotalRepayment(emi, totalMonths);
  }, [emi, totalMonths, isFullyValid, hasLoan]);

  const processingFeeAmount = useMemo(() => {
    if (!processingFeeEnabled || !isFullyValid) return 0;
    return calculateProcessingFee(financedPrincipal, processingFeeType, Number(processingFeeValue) || 0);
  }, [financedPrincipal, processingFeeEnabled, processingFeeType, processingFeeValue, isFullyValid]);

  const totalCost = useMemo(() => totalRepayment + processingFeeAmount, [totalRepayment, processingFeeAmount]);

  const amortizationSchedule = useMemo(() => {
    if (!isFullyValid || !hasLoan) return [];
    return generateAmortizationSchedule(financedPrincipal, numRate, totalMonths, startDate);
  }, [financedPrincipal, numRate, totalMonths, startDate, isFullyValid, hasLoan]);

  const yearlySummary = useMemo(() => {
    if (amortizationSchedule.length === 0) return [];
    const years = [];
    let currentYear = null;
    let yearData = null;
    for (const row of amortizationSchedule) {
      const year = row.date.getFullYear();
      if (year !== currentYear) {
        if (yearData) years.push(yearData);
        currentYear = year;
        yearData = { year, totalPaid: 0, principalPaid: 0, interestPaid: 0, endingBalance: 0 };
      }
      yearData.totalPaid += row.payment;
      yearData.principalPaid += row.principal;
      yearData.interestPaid += row.interest;
      yearData.endingBalance = row.balance;
    }
    if (yearData) years.push(yearData);
    return years;
  }, [amortizationSchedule]);

  const hasExtraPayments = extraMonthlyPayment > 0 || extraAnnualPayment > 0 || extraOneTimePayment > 0;
  const extraPaymentScenario = useMemo(() => {
    if (!isFullyValid || !hasLoan || !hasExtraPayments) return null;
    return calculateExtraPaymentScenario(
      financedPrincipal,
      numRate,
      totalMonths,
      Number(extraMonthlyPayment) || 0,
      Number(extraAnnualPayment) || 0,
      Number(extraOneTimePayment) || 0,
      startDate
    );
  }, [financedPrincipal, numRate, totalMonths, extraMonthlyPayment, extraAnnualPayment, extraOneTimePayment, startDate, isFullyValid, hasLoan, hasExtraPayments]);

  const reset = useCallback(() => {
    setPurchasePrice(DEFAULTS.purchasePrice);
    setDownPaymentMode(DEFAULTS.downPaymentMode);
    setDownPaymentValue(DEFAULTS.downPaymentValue);
    setInterestRate(DEFAULTS.interestRate);
    setTermYears(DEFAULTS.termYears);
    setTermMonths(DEFAULTS.termMonths);
    setProcessingFeeEnabled(DEFAULTS.processingFeeEnabled);
    setProcessingFeeType(DEFAULTS.processingFeeType);
    setProcessingFeeValue(DEFAULTS.processingFeeValue);
    setExtraMonthlyPayment(DEFAULTS.extraMonthlyPayment);
    setExtraAnnualPayment(DEFAULTS.extraAnnualPayment);
    setExtraOneTimePayment(DEFAULTS.extraOneTimePayment);
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const getShareState = useCallback(() => ({
    amount: purchasePrice,
    rate: interestRate,
    years: termYears,
    months: termMonths,
    currency,
    dp: downPaymentValue || undefined,
    dpMode: downPaymentMode !== 'amount' ? downPaymentMode : undefined,
    feeType: processingFeeEnabled ? processingFeeType : undefined,
    feeValue: processingFeeEnabled ? processingFeeValue : undefined,
    extraMonthly: extraMonthlyPayment || undefined,
    extraAnnual: extraAnnualPayment || undefined,
    extraOneTime: extraOneTimePayment || undefined,
  }), [purchasePrice, interestRate, termYears, termMonths, currency, downPaymentValue, downPaymentMode, processingFeeEnabled, processingFeeType, processingFeeValue, extraMonthlyPayment, extraAnnualPayment, extraOneTimePayment]);

  return {
    // State (renamed: purchasePrice replaces loanAmount)
    purchasePrice, setPurchasePrice,
    downPaymentMode, setDownPaymentMode,
    downPaymentValue, setDownPaymentValue,
    interestRate, setInterestRate,
    termYears, setTermYears,
    termMonths, setTermMonths,
    currency, setCurrency,
    processingFeeEnabled, setProcessingFeeEnabled,
    processingFeeType, setProcessingFeeType,
    processingFeeValue, setProcessingFeeValue,
    extraMonthlyPayment, setExtraMonthlyPayment,
    extraAnnualPayment, setExtraAnnualPayment,
    extraOneTimePayment, setExtraOneTimePayment,
    // Derived: down payment
    downPaymentAmount,
    downPaymentPercentage,
    financedPrincipal,
    loanToValueRatio,
    // Validation
    totalMonths,
    validation,
    downPaymentValidation,
    isFullyValid,
    hasLoan,
    // Derived calculations
    emi,
    totalInterest,
    totalRepayment,
    processingFeeAmount,
    totalCost,
    amortizationSchedule,
    yearlySummary,
    extraPaymentScenario,
    hasExtraPayments,
    // Actions
    reset,
    getShareState,
    DEFAULTS,
  };
}
