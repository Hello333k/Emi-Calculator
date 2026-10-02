import React, { useState, useRef } from 'react';
import { formatCurrency, formatCurrencyCompact } from '../utils/formatters';

export default function SavingsGrowthChart({
  schedule,
  summary,
  currency,
  isValid,
  scenarios,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);

  if (!isValid || !schedule || schedule.length === 0 || !summary) {
    return (
      <div className="chart-container balance-chart-container" style={{ marginTop: '24px' }}>
        <h3>Savings growth projection</h3>
        <div style={{ color: 'var(--text-tertiary)', padding: '32px 0', textAlign: 'center' }}>
          Enter savings parameters to view growth projection curve
        </div>
      </div>
    );
  }

  const startingBalance = summary.startingBalance || 0;
  const endingBalance = summary.endingBalance || 0;
  const totalContributions = summary.totalContributions || 0;
  const totalInterest = summary.totalInterest || 0;
  const timeYears = summary.totalTimeYears || 0;

  // Chart coordinate space
  const width = 800;
  const height = 320;
  const padLeft = 70;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 44;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const totalPoints = schedule.length;

  // Determine max value for Y-axis (including scenarios if any)
  let maxVal = endingBalance;
  if (scenarios && scenarios.length > 0) {
    for (const sc of scenarios) {
      if (sc.endingBalance > maxVal) maxVal = sc.endingBalance;
    }
  }
  // Add 5% headroom
  const yMax = maxVal > 0 ? maxVal * 1.05 : 1000;

  const getX = (period) => padLeft + (period / Math.max(totalPoints, 1)) * chartW;
  const getY = (val) => padTop + chartH - (yMax > 0 ? (val / yMax) * chartH : 0);

  // Construct data points starting at period 0
  const points = [{
    period: 0,
    periodLabel: 'Start',
    balance: startingBalance,
    contributions: startingBalance,
    interest: 0,
  }];

  // Sample data points if schedule is large (>120 rows) for smooth SVG rendering
  const step = Math.max(1, Math.floor(totalPoints / 120));
  for (let i = 0; i < totalPoints; i++) {
    if (i % step === 0 || i === totalPoints - 1) {
      const row = schedule[i];
      points.push({
        period: row.period,
        periodLabel: row.periodLabel,
        balance: row.endBalance,
        contributions: row.cumulativeContributions,
        interest: row.cumulativeInterest,
      });
    }
  }

  // Path for Projected Balance line & fill area
  let balanceLine = `M ${getX(points[0].period)} ${getY(points[0].balance)}`;
  let contribLine = `M ${getX(points[0].period)} ${getY(points[0].contributions)}`;

  for (let i = 1; i < points.length; i++) {
    balanceLine += ` L ${getX(points[i].period)} ${getY(points[i].balance)}`;
    contribLine += ` L ${getX(points[i].period)} ${getY(points[i].contributions)}`;
  }

  const balanceArea = `${balanceLine} L ${getX(points[points.length - 1].period)} ${padTop + chartH} L ${padLeft} ${padTop + chartH} Z`;

  // Y-axis ticks (4 divisions)
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // X-axis ticks (years or months)
  const isMonthly = summary.contributionFrequency === 'monthly';
  const totalMonths = isMonthly ? totalPoints : totalPoints * 12;
  const yearsCount = totalMonths / 12;

  let yearStep = 1;
  if (yearsCount > 20) yearStep = 5;
  else if (yearsCount > 10) yearStep = 2;

  const xTicks = [];
  if (yearsCount >= 1) {
    for (let yr = 0; yr <= Math.ceil(yearsCount); yr += yearStep) {
      const p = isMonthly ? yr * 12 : yr;
      if (p <= totalPoints) {
        xTicks.push({ label: `${yr}y`, period: p });
      }
    }
  } else {
    // Under 1 year, show months
    const monthStep = totalPoints > 6 ? 2 : 1;
    for (let m = 0; m <= totalPoints; m += monthStep) {
      xTicks.push({ label: `${m}m`, period: m });
    }
  }

  // Active hover point
  const activePt = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < points.length
    ? points[hoverIndex]
    : null;

  // Mouse move handler for interactive tooltip
  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    if (mouseX < padLeft || mouseX > width - padRight) {
      setHoverIndex(null);
      return;
    }
    const ratio = (mouseX - padLeft) / chartW;
    const periodTarget = ratio * totalPoints;

    // Find nearest point
    let nearestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < points.length; i++) {
      const diff = Math.abs(points[i].period - periodTarget);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = i;
      }
    }
    setHoverIndex(nearestIdx);
  };

  const handleMouseLeave = () => setHoverIndex(null);

  // Accessible summary text
  const horizonText = timeYears >= 1 ? `${timeYears} year${timeYears > 1 ? 's' : ''}` : `${totalPoints} months`;
  const accessibleText = `After ${horizonText}, the projected balance is ${formatCurrency(endingBalance, currency)}, including ${formatCurrency(totalContributions, currency)} of total deposits and ${formatCurrency(totalInterest, currency)} of estimated compound growth.`;

  return (
    <div className="chart-container" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Growth over time</h3>
          <p className="text-secondary text-xs" style={{ margin: '4px 0 0' }}>
            Balance trajectory comparing deposits against compound growth
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--color-success)', borderRadius: '2px' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Projected balance</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px', borderTop: '1px dashed' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Total contributed</span>
          </div>
        </div>
      </div>

      {/* Accessible Text for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {accessibleText}
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', cursor: 'crosshair' }}
          role="img"
          aria-label={accessibleText}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={(e) => {
            if (e.touches && e.touches[0]) {
              handleMouseMove(e.touches[0]);
            }
          }}
          onTouchEnd={handleMouseLeave}
        >
          <defs>
            <linearGradient id="savingsGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {yTicks.map((pct) => {
            const y = padTop + chartH - pct * chartH;
            const val = yMax * pct;
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="var(--border-color)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--text-tertiary)"
                  fontFamily="inherit"
                >
                  {formatCurrencyCompact(val, currency)}
                </text>
              </g>
            );
          })}

          {/* X axis gridlines and labels */}
          {xTicks.map((tick, i) => {
            const x = getX(tick.period);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke="var(--border-color)"
                  strokeDasharray="2 4"
                  strokeWidth="0.75"
                />
                <text
                  x={x}
                  y={padTop + chartH + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-tertiary)"
                  fontFamily="inherit"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Area fill for projected balance */}
          <path d={balanceArea} fill="url(#savingsGrowthGradient)" />

          {/* Total Contributions Line (Muted accent) */}
          <path
            d={contribLine}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Projected Balance Line (Success green) */}
          <path
            d={balanceLine}
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Point & Guideline */}
          {activePt && (
            <g>
              {/* Vertical crosshair */}
              <line
                x1={getX(activePt.period)}
                y1={padTop}
                x2={getX(activePt.period)}
                y2={padTop + chartH}
                stroke="var(--text-tertiary)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />

              {/* Point on Balance line */}
              <circle
                cx={getX(activePt.period)}
                cy={getY(activePt.balance)}
                r="5"
                fill="var(--color-success)"
                stroke="var(--bg-surface)"
                strokeWidth="2"
              />

              {/* Point on Contributions line */}
              <circle
                cx={getX(activePt.period)}
                cy={getY(activePt.contributions)}
                r="4"
                fill="var(--accent-primary)"
                stroke="var(--bg-surface)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Card */}
        {activePt && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: Math.min(Math.max(16, (getX(activePt.period) / width) * 100), 75) + '%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'none',
              fontSize: '0.8rem',
              zIndex: 10,
              minWidth: '170px',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {activePt.periodLabel}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: 'var(--color-success)' }}>
              <span>Balance:</span>
              <strong className="tabular-nums">{formatCurrency(activePt.balance, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: 'var(--accent-primary)', marginTop: '2px' }}>
              <span>Contributed:</span>
              <strong className="tabular-nums">{formatCurrency(activePt.contributions, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: 'var(--text-secondary)', marginTop: '2px', borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>
              <span>Growth:</span>
              <strong className="tabular-nums">{formatCurrency(activePt.interest, currency)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
