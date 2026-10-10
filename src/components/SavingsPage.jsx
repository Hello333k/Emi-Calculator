import React, { useState, useRef, useCallback } from 'react';
import { useSavingsCalculator } from '../hooks/useSavingsCalculator';
import { useToast } from '../hooks/useToast';
import { generateSavingsShareUrl, copyToClipboard } from '../utils/shareState';
import { formatCurrency } from '../utils/formatters';

import SavingsInputs from './SavingsInputs';
import SavingsGoalInputs from './SavingsGoalInputs';
import SavingsAdvancedOptions from './SavingsAdvancedOptions';
import SavingsResultHero from './SavingsResultHero';
import SavingsMetricGrid from './SavingsMetricGrid';
import SavingsScenarioTable from './SavingsScenarioTable';
import ShareDialog from './ShareDialog';
import Toast from './Toast';
import RevealSection from './RevealSection';
import WordReveal from './WordReveal';
import AnimatedSegmentedControl from './AnimatedSegmentedControl';

export default function SavingsPage() {
  const {
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
    // Currency
    currency,
    // Derived
    activeProjection,
    requiredContribution,
    timeToGoal,
    scenarios,
    // Validation
    isValid,
    validationErrors,
    // Actions
    getShareState,
    reset,
  } = useSavingsCalculator();

  const { toast, showToast, hideToast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Track previous mode to determine directional slide animation
  const prevModeRef = useRef(mode);
  const [slideDirection, setSlideDirection] = useState(null);
  const slideKeyRef = useRef(0);

  const handleModeChange = useCallback((newMode) => {
    if (newMode === mode) return;
    // growth -> goal = slide left; goal -> growth = slide right
    setSlideDirection(newMode === 'goal' ? 'left' : 'right');
    slideKeyRef.current += 1;
    prevModeRef.current = mode;
    setMode(newMode);
  }, [mode, setMode]);

  const handleOpenShare = React.useCallback(() => {
    const url = generateSavingsShareUrl(getShareState());
    setShareUrl(url);
    setIsShareOpen(true);
  }, [getShareState]);

  React.useEffect(() => {
    const handleHeaderReset = () => {
      reset();
      showToast('Savings calculator reset to defaults');
    };
    const handleHeaderShare = () => {
      handleOpenShare();
    };

    window.addEventListener('app-reset-savings', handleHeaderReset);
    window.addEventListener('app-share-savings', handleHeaderShare);
    return () => {
      window.removeEventListener('app-reset-savings', handleHeaderReset);
      window.removeEventListener('app-share-savings', handleHeaderShare);
    };
  }, [reset, showToast, handleOpenShare]);

  const handleCopyLink = async (urlToCopy) => {
    const success = await copyToClipboard(urlToCopy);
    if (success) {
      showToast('Share link copied to clipboard');
      setIsShareOpen(false);
    } else {
      showToast('Could not copy link');
    }
  };

  const handleCopySummary = async () => {
    if (!isValid || !activeProjection) return;
    const { summary } = activeProjection;
    const parts = [
      `Savings Calculator (${mode === 'goal' ? 'Reach a Goal' : 'Growth Projection'})`,
      `Starting Balance: ${formatCurrency(summary.startingBalance, currency)}`,
    ];
    if (mode === 'growth') {
      parts.push(`Contribution: ${formatCurrency(contributionAmount, currency)}/${contributionFrequency === 'yearly' ? 'yr' : 'mo'}`);
    }
    parts.push(`Annual Rate: ${annualRate}% (${rateType === 'apy' ? 'APY' : 'APR'})`);
    parts.push(`Duration: ${timeYears}y ${timeMonths}m`);
    parts.push(`Projected Balance: ${formatCurrency(summary.endingBalance, currency)}`);
    parts.push(`Total Contributed: ${formatCurrency(summary.totalContributions, currency)}`);
    parts.push(`Estimated Growth: ${formatCurrency(summary.totalInterest, currency)}`);

    const success = await copyToClipboard(parts.join(' | '));
    if (success) {
      showToast('Calculation summary copied');
    }
  };

  const summary = activeProjection?.summary;

  return (
    <main className="container page-route-enter" id="main-content">
      {/* Page Title & Intro */}
      <section className="section" style={{ paddingBottom: '20px' }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--accent-primary)',
            marginBottom: '8px',
          }}>
            Financial planning tool
          </div>
          <h1 style={{ margin: 0 }}>
            <WordReveal text="Savings Calculator" />
          </h1>
        </div>

        {/* Mode Selector Tabs — Animated Sliding Pill */}
        <div style={{ marginTop: '24px' }}>
          <AnimatedSegmentedControl
            options={[
              { value: 'growth', label: 'Growth Projection' },
              { value: 'goal', label: 'Reach a Goal' },
            ]}
            value={mode}
            onChange={handleModeChange}
            ariaLabel="Calculator mode"
            style={{ padding: '4px' }}
            buttonStyle={{ padding: '8px 24px', fontSize: '0.9rem' }}
          />
        </div>
      </section>

      {/* Primary Calculator Workspace with Directional Entrances */}
      <div className="calculator-shell">
        {/* Left Column: Inputs gliding in from upper-left */}
        <RevealSection
          as="section"
          direction="left"
          delay={40}
          className="calculator-inputs"
          aria-labelledby="savings-parameters-heading"
        >
          <h2 id="savings-parameters-heading" style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
            {mode === 'growth' ? 'Savings parameters' : 'Goal parameters'}
          </h2>

          <div
            key={`${mode}-${slideKeyRef.current}`}
            className={slideDirection ? `mode-slide-${slideDirection}-enter` : 'page-route-enter'}
          >
            {mode === 'growth' ? (
              <SavingsInputs
                startingBalance={startingBalance}
                onStartingBalanceChange={setStartingBalance}
                contributionAmount={contributionAmount}
                onContributionAmountChange={setContributionAmount}
                contributionFrequency={contributionFrequency}
                onContributionFrequencyChange={setContributionFrequency}
                annualRate={annualRate}
                onAnnualRateChange={setAnnualRate}
                rateType={rateType}
                onRateTypeChange={setRateType}
                compoundingFrequency={compoundingFrequency}
                onCompoundingFrequencyChange={setCompoundingFrequency}
                timeYears={timeYears}
                onTimeYearsChange={setTimeYears}
                timeMonths={timeMonths}
                onTimeMonthsChange={setTimeMonths}
                currency={currency}
                errors={validationErrors}
              />
            ) : (
              <SavingsGoalInputs
                goalSubMode={goalSubMode}
                onGoalSubModeChange={setGoalSubMode}
                targetAmount={targetAmount}
                onTargetAmountChange={setTargetAmount}
                currentSavings={startingBalance}
                onCurrentSavingsChange={setStartingBalance}
                goalContribution={goalContribution}
                onGoalContributionChange={setGoalContribution}
                contributionFrequency={contributionFrequency}
                onContributionFrequencyChange={setContributionFrequency}
                annualRate={annualRate}
                onAnnualRateChange={setAnnualRate}
                rateType={rateType}
                onRateTypeChange={setRateType}
                compoundingFrequency={compoundingFrequency}
                onCompoundingFrequencyChange={setCompoundingFrequency}
                timeYears={timeYears}
                onTimeYearsChange={setTimeYears}
                timeMonths={timeMonths}
                onTimeMonthsChange={setTimeMonths}
                currency={currency}
                errors={validationErrors}
              />
            )}
          </div>

          {/* Advanced Assumptions Accordion */}
          <SavingsAdvancedOptions
            contributionTiming={contributionTiming}
            onContributionTimingChange={setContributionTiming}
            annualContributionIncrease={annualContributionIncrease}
            onAnnualContributionIncreaseChange={setAnnualContributionIncrease}
            oneTimeDepositEnabled={oneTimeDepositEnabled}
            onOneTimeDepositEnabledChange={setOneTimeDepositEnabled}
            oneTimeDepositAmount={oneTimeDepositAmount}
            onOneTimeDepositAmountChange={setOneTimeDepositAmount}
            oneTimeDepositPeriod={oneTimeDepositPeriod}
            onOneTimeDepositPeriodChange={setOneTimeDepositPeriod}
            inflationEnabled={inflationEnabled}
            onInflationEnabledChange={setInflationEnabled}
            inflationRate={inflationRate}
            onInflationRateChange={setInflationRate}
            annualFee={annualFee}
            onAnnualFeeChange={setAnnualFee}
            scenarioEnabled={scenarioEnabled}
            onScenarioEnabledChange={setScenarioEnabled}
            scenarioLowerRate={scenarioLowerRate}
            onScenarioLowerRateChange={setScenarioLowerRate}
            scenarioHigherRate={scenarioHigherRate}
            onScenarioHigherRateChange={setScenarioHigherRate}
            baseRate={annualRate}
            currency={currency}
          />
        </RevealSection>

        {/* Right Column: Live Result Hero & Breakdown gliding in from upper-right */}
        <RevealSection
          as="section"
          direction="right"
          delay={90}
          className="calculator-results"
          aria-labelledby="savings-results-heading"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 id="savings-results-heading" style={{ fontSize: '1.25rem', margin: 0 }}>
              Your projection
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {isValid && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleCopySummary}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy summary
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleOpenShare}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Share this calculation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>
          </div>

          <div key={`${mode}-${slideKeyRef.current}-${goalSubMode}`} className="page-route-enter">
            <SavingsResultHero
              mode={mode}
              summary={summary}
              currency={currency}
              isValid={isValid}
              requiredContribution={requiredContribution}
              timeToGoal={timeToGoal}
              goalSubMode={goalSubMode}
              targetAmount={targetAmount}
              startingBalance={startingBalance}
              contributionFrequency={contributionFrequency}
              timeYears={timeYears}
              timeMonths={timeMonths}
            />
          </div>

          <SavingsMetricGrid
            summary={summary}
            currency={currency}
            isValid={isValid}
            timeYears={timeYears}
            timeMonths={timeMonths}
            annualRate={annualRate}
            rateType={rateType}
          />
        </RevealSection>
      </div>

      {/* Rate Scenario Comparison (if enabled) */}
      {scenarioEnabled && (
        <RevealSection delay={80}>
          <SavingsScenarioTable
            scenarios={scenarios}
            baseRate={annualRate}
            currency={currency}
            isValid={isValid}
          />
        </RevealSection>
      )}


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
    </main>
  );
}
