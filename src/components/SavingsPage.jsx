import React, { useState } from 'react';
import { useSavingsCalculator } from '../hooks/useSavingsCalculator';
import { useToast } from '../hooks/useToast';
import { generateSavingsShareUrl, copyToClipboard } from '../utils/shareState';
import { formatCurrency } from '../utils/formatters';

import SavingsInputs from './SavingsInputs';
import SavingsGoalInputs from './SavingsGoalInputs';
import SavingsAdvancedOptions from './SavingsAdvancedOptions';
import SavingsResultHero from './SavingsResultHero';
import SavingsMetricGrid from './SavingsMetricGrid';
import SavingsGrowthChart from './SavingsGrowthChart';
import SavingsMilestones from './SavingsMilestones';
import SavingsScenarioTable from './SavingsScenarioTable';
import SavingsSchedule from './SavingsSchedule';
import SavingsEducation from './SavingsEducation';
import SavingsFAQ from './SavingsFAQ';
import ShareDialog from './ShareDialog';
import Toast from './Toast';

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
    // View
    scheduleView, setScheduleView,
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
  const schedule = activeProjection?.schedule || [];
  const yearlySummary = activeProjection?.yearlySummary || [];
  const milestones = activeProjection?.milestones || [];

  return (
    <main className="container" id="main-content">
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
          <h1 style={{ margin: '0 0 12px 0' }}>Savings Calculator</h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
            See how your savings could grow over time with regular contributions, compound growth, and strategic goal planning.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ marginTop: '24px' }}>
          <div className="segmented-control" style={{ padding: '4px' }} role="tablist" aria-label="Calculator mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'growth'}
              className={`segment-btn ${mode === 'growth' ? 'active' : ''}`}
              style={{ padding: '8px 24px', fontSize: '0.9rem' }}
              onClick={() => setMode('growth')}
            >
              Growth Projection
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'goal'}
              className={`segment-btn ${mode === 'goal' ? 'active' : ''}`}
              style={{ padding: '8px 24px', fontSize: '0.9rem' }}
              onClick={() => setMode('goal')}
            >
              Reach a Goal
            </button>
          </div>
        </div>
      </section>

      {/* Primary Calculator Workspace */}
      <div className="calculator-shell">
        {/* Left Column: Inputs */}
        <section className="calculator-inputs" aria-labelledby="savings-parameters-heading">
          <h2 id="savings-parameters-heading" style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
            {mode === 'growth' ? 'Savings parameters' : 'Goal parameters'}
          </h2>

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
        </section>

        {/* Right Column: Live Result Hero & Breakdown */}
        <section className="calculator-results" aria-labelledby="savings-results-heading">
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

          <SavingsMetricGrid
            summary={summary}
            currency={currency}
            isValid={isValid}
            timeYears={timeYears}
            timeMonths={timeMonths}
            annualRate={annualRate}
            rateType={rateType}
          />
        </section>
      </div>

      {/* SVG Growth Chart */}
      <SavingsGrowthChart
        schedule={schedule}
        summary={summary}
        currency={currency}
        isValid={isValid}
        scenarios={scenarios}
      />

      {/* Milestones */}
      <SavingsMilestones
        milestones={milestones}
        currency={currency}
        isValid={isValid}
      />

      {/* Rate Scenario Comparison (if enabled) */}
      {scenarioEnabled && (
        <SavingsScenarioTable
          scenarios={scenarios}
          baseRate={annualRate}
          currency={currency}
          isValid={isValid}
        />
      )}

      {/* Itemized Schedule (Yearly Summary & Monthly Detail) with CSV Download */}
      <SavingsSchedule
        schedule={schedule}
        yearlySummary={yearlySummary}
        summary={summary}
        currency={currency}
        isValid={isValid}
        view={scheduleView}
        onViewChange={setScheduleView}
      />

      {/* Educational Content */}
      <SavingsEducation />

      {/* FAQ Section */}
      <SavingsFAQ />

      {/* Financial Disclaimer */}
      <div style={{ marginTop: '40px', padding: '16px 20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
        <strong>Financial Estimate Disclaimer:</strong> These results are mathematical projections based on the assumptions entered. Actual savings performance may vary because interest rates, compounding policies, account fees, taxes, contribution timing, and deposit terms can fluctuate over time. This tool does not constitute personalized financial or investment advice.
      </div>

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
