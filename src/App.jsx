import React, { useState, useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { generateShareUrl, copyToClipboard } from './utils/shareState';
import { formatCurrency } from './utils/formatters';

import Header from './components/Header';
import LoanAmountInput from './components/LoanAmountInput';
import DownPaymentInput from './components/DownPaymentInput';
import InterestRateInput from './components/InterestRateInput';
import LoanTermInput from './components/LoanTermInput';
import AdvancedOptions from './components/AdvancedOptions';
import ResultHero from './components/ResultHero';
import MetricGrid from './components/MetricGrid';
import BreakdownChart from './components/BreakdownChart';
import BalanceChart from './components/BalanceChart';
import YearlySummary from './components/YearlySummary';
import AmortizationTable from './components/AmortizationTable';
import ExtraPaymentSimulator from './components/ExtraPaymentSimulator';
import EducationSection from './components/EducationSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ShareDialog from './components/ShareDialog';
import Toast from './components/Toast';
import NotFound from './components/NotFound';
import SavingsPage from './components/SavingsPage';

function CalculatorApp({ onNavigate, theme, toggleTheme }) {

  // Central calculator state and derived values
  const {
    purchasePrice, setPurchasePrice,
    downPaymentMode, setDownPaymentMode,
    downPaymentValue, setDownPaymentValue,
    downPaymentAmount,
    downPaymentPercentage,
    financedPrincipal,
    loanToValueRatio,
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
    validation,
    downPaymentValidation,
    isFullyValid,
    hasLoan,
    emi,
    totalInterest,
    totalRepayment,
    processingFeeAmount,
    totalCost,
    amortizationSchedule,
    yearlySummary,
    extraPaymentScenario,
    reset: resetCalculator,
    getShareState
  } = useCalculator();

  // Toast notifications
  const { toast, showToast, hideToast } = useToast();

  // Share Dialog state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleOpenShare = () => {
    const url = generateShareUrl(getShareState());
    setShareUrl(url);
    setIsShareOpen(true);
  };

  const handleCopyLink = async (urlToCopy) => {
    const success = await copyToClipboard(urlToCopy);
    if (success) {
      showToast('Share link copied to clipboard');
      setIsShareOpen(false);
    } else {
      showToast('Could not copy link');
    }
  };

  const handleCopyResult = async () => {
    if (!isFullyValid) return;
    const parts = [`Purchase Price: ${formatCurrency(purchasePrice, currency)}`];
    if (downPaymentAmount > 0) {
      parts.push(`Down Payment: ${formatCurrency(downPaymentAmount, currency)}`);
      parts.push(`Loan Amount: ${formatCurrency(financedPrincipal, currency)}`);
    }
    parts.push(`Annual Interest: ${interestRate}%`);
    parts.push(`Tenure: ${termYears}y ${termMonths}m`);
    parts.push(`Monthly EMI: ${formatCurrency(emi, currency)}`);
    parts.push(`Total Repayment: ${formatCurrency(totalRepayment, currency)}`);
    const summaryText = parts.join(' | ');
    const success = await copyToClipboard(summaryText);
    if (success) {
      showToast('Calculation summary copied');
    }
  };

  const handleReset = () => {
    resetCalculator();
    showToast('Calculator reset to defaults');
  };

  return (
    <div className="app-shell">
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onThemeToggle={toggleTheme}
        onReset={handleReset}
        onShare={handleOpenShare}
        currentRoute="emi"
        onNavigate={onNavigate}
      />

      <main className="container" id="main-content">
        {/* Hero Section */}
        <section className="section" style={{ paddingBottom: '24px' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1>EMI Calculator</h1>
            <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
              Estimate your monthly loan payment, total interest, and complete repayment schedule in seconds. Zero ads, zero tracking, calculated instantly in your browser.
            </p>
          </div>
        </section>

        {/* Primary Calculator Workspace */}
        <div className="calculator-shell">
          {/* Left Column: Input Controls */}
          <section className="calculator-inputs" aria-labelledby="loan-details-heading">
            <h2 id="loan-details-heading" style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
              Loan details
            </h2>

            <LoanAmountInput
              value={purchasePrice}
              onChange={setPurchasePrice}
              currency={currency}
              error={validation.errors?.loanAmount}
            />

            <DownPaymentInput
              purchasePrice={purchasePrice}
              downPaymentMode={downPaymentMode}
              onDownPaymentModeChange={setDownPaymentMode}
              downPaymentValue={downPaymentValue}
              onDownPaymentValueChange={setDownPaymentValue}
              downPaymentAmount={downPaymentAmount}
              downPaymentPercentage={downPaymentPercentage}
              financedPrincipal={financedPrincipal}
              loanToValueRatio={loanToValueRatio}
              currency={currency}
              error={downPaymentValidation.error}
            />

            <InterestRateInput
              value={interestRate}
              onChange={setInterestRate}
              error={validation.errors?.interestRate}
            />

            <LoanTermInput
              years={termYears}
              months={termMonths}
              onYearsChange={setTermYears}
              onMonthsChange={setTermMonths}
              error={validation.errors?.term}
            />

            <AdvancedOptions
              processingFeeEnabled={processingFeeEnabled}
              onProcessingFeeEnabledChange={setProcessingFeeEnabled}
              processingFeeType={processingFeeType}
              onProcessingFeeTypeChange={setProcessingFeeType}
              processingFeeValue={processingFeeValue}
              onProcessingFeeValueChange={setProcessingFeeValue}
              currency={currency}
            />
          </section>

          {/* Right Column: Live Results */}
          <section className="calculator-results" aria-labelledby="calculation-result-heading">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 id="calculation-result-heading" style={{ fontSize: '1.25rem', margin: 0 }}>
                Your result
              </h2>
              {isFullyValid && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleCopyResult}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy summary
                </button>
              )}
            </div>

            <ResultHero
              emi={emi}
              currency={currency}
              isValid={isFullyValid}
              financedPrincipal={financedPrincipal}
              purchasePrice={purchasePrice}
              downPaymentAmount={downPaymentAmount}
            />

            <MetricGrid
              purchasePrice={purchasePrice}
              downPaymentAmount={downPaymentAmount}
              financedPrincipal={financedPrincipal}
              loanToValueRatio={loanToValueRatio}
              totalInterest={totalInterest}
              totalRepayment={totalRepayment}
              processingFee={processingFeeAmount}
              totalCost={totalCost}
              currency={currency}
              isValid={isFullyValid}
            />

            <div style={{ marginTop: '20px' }}>
              <BreakdownChart
                principal={financedPrincipal}
                totalInterest={totalInterest}
                currency={currency}
                isValid={isFullyValid && hasLoan}
              />
            </div>
          </section>
        </div>

        {/* Balance Over Time Chart */}
        <BalanceChart
          schedule={amortizationSchedule}
          currency={currency}
          isValid={isFullyValid && hasLoan}
        />

        {/* Extra Payment Simulation */}
        <ExtraPaymentSimulator
          extraMonthly={extraMonthlyPayment}
          onExtraMonthlyChange={setExtraMonthlyPayment}
          extraAnnual={extraAnnualPayment}
          onExtraAnnualChange={setExtraAnnualPayment}
          extraOneTime={extraOneTimePayment}
          onExtraOneTimeChange={setExtraOneTimePayment}
          scenario={extraPaymentScenario}
          currency={currency}
          isValid={isFullyValid && hasLoan}
        />

        {/* Yearly Overview */}
        <YearlySummary
          yearlySummary={yearlySummary}
          currency={currency}
          isValid={isFullyValid && hasLoan}
        />

        {/* Full Amortization Schedule */}
        <AmortizationTable
          schedule={amortizationSchedule}
          currency={currency}
          isValid={isFullyValid && hasLoan}
        />

        {/* Educational Content */}
        <EducationSection />

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer onNavigate={onNavigate} currentRoute="emi" />

      {/* Share Calculation Modal */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareUrl={shareUrl}
        onCopy={handleCopyLink}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
}

function getRouteFromLocation() {
  if (typeof window === 'undefined') return 'emi';
  const pathname = (window.location.pathname || '').toLowerCase().replace(/\/$/, '') || '/';
  const hash = (window.location.hash || '').toLowerCase();

  // Savings route check (supports /savings, /#/savings, #savings, and query params)
  if (
    pathname === '/savings' ||
    pathname.endsWith('/savings') ||
    hash.startsWith('#/savings') ||
    hash.startsWith('#savings')
  ) {
    return 'savings';
  }

  // EMI / Home route check
  if (
    pathname === '/' ||
    pathname === '/index.html' ||
    pathname === '' ||
    hash === '' ||
    hash === '#/' ||
    hash === '#'
  ) {
    return 'emi';
  }

  return '404';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromLocation);

  // Theme management shared at top level
  const [theme, setTheme] = useLocalStorage('emi-theme', () => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [currency, setCurrency] = useLocalStorage('emi-currency', 'NPR');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // If redirected via hash (e.g. GitHub Pages /#/savings), update history state
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#/savings') || hash.startsWith('#savings')) {
        const queryIdx = hash.indexOf('?');
        const query = queryIdx !== -1 ? hash.slice(queryIdx) : '';
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, '', '/savings' + query);
        }
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Synchronize document title and meta description
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (currentRoute === 'savings') {
      document.title = 'Savings Calculator — Compound Growth & Savings Goal Calculator';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Calculate how your savings could grow with regular contributions, compound growth, different time horizons, and savings goals.');
      }
    } else if (currentRoute === 'emi') {
      document.title = 'EMI Calculator — Monthly Payment, Interest & Amortization';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Calculate monthly EMI, total interest, total repayment and amortization schedule with a fast, privacy-friendly loan calculator.');
      }
    }
  }, [currentRoute]);

  const handleNavigate = (path) => {
    if (typeof window !== 'undefined') {
      const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
      window.history.pushState({}, '', path);
      if (cleanPath === '/savings') {
        setCurrentRoute('savings');
      } else if (cleanPath === '/' || cleanPath === '/index.html') {
        setCurrentRoute('emi');
      } else {
        setCurrentRoute('404');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentRoute === 'savings') {
    return (
      <div className="app-shell">
        <Header
          currency={currency}
          onCurrencyChange={setCurrency}
          theme={theme}
          onThemeToggle={toggleTheme}
          onReset={() => window.dispatchEvent(new CustomEvent('app-reset-savings'))}
          onShare={() => window.dispatchEvent(new CustomEvent('app-share-savings'))}
          currentRoute="savings"
          onNavigate={handleNavigate}
        />
        <SavingsPage />
        <Footer onNavigate={handleNavigate} currentRoute="savings" />
      </div>
    );
  }

  if (currentRoute === 'emi') {
    return (
      <CalculatorApp
        onNavigate={handleNavigate}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return <NotFound onNavigate={handleNavigate} />;
}
