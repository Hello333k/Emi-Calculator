import React from 'react';
import { formatCurrencyCompact } from '../utils/formatters';

export default function BalanceChart({ schedule, currency, isValid }) {
  if (!isValid || !schedule || schedule.length === 0) {
    return (
      <div className="chart-container balance-chart-container">
        <h3>Balance over time</h3>
        <div style={{ color: 'var(--text-tertiary)', padding: '32px 0', textAlign: 'center' }}>
          Enter loan details to view balance curve
        </div>
      </div>
    );
  }

  const initialPrincipal = schedule[0] ? schedule[0].balance + schedule[0].principal : 0;
  const maxBalance = Math.max(initialPrincipal, ...schedule.map(s => s.balance));

  const width = 800;
  const height = 300;
  const padLeft = 70;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 40;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const totalPoints = schedule.length;
  const getX = (monthIdx) => padLeft + (monthIdx / Math.max(totalPoints, 1)) * chartW;
  const getY = (val) => padTop + chartH - (maxBalance > 0 ? (val / maxBalance) * chartH : 0);

  // Month 0 starting point
  const dataPoints = [{ month: 0, balance: initialPrincipal }];
  
  // Sample data points if schedule is long (up to 120 points for smooth curve)
  const step = Math.max(1, Math.floor(totalPoints / 120));
  for (let i = 0; i < totalPoints; i++) {
    if (i % step === 0 || i === totalPoints - 1) {
      dataPoints.push(schedule[i]);
    }
  }

  let linePath = `M ${getX(dataPoints[0].month)} ${getY(dataPoints[0].balance)}`;
  for (let i = 1; i < dataPoints.length; i++) {
    linePath += ` L ${getX(dataPoints[i].month)} ${getY(dataPoints[i].balance)}`;
  }

  const areaPath = `${linePath} L ${getX(totalPoints)} ${padTop + chartH} L ${padLeft} ${padTop + chartH} Z`;

  // Y-axis ticks (4 divisions: 0, 25%, 50%, 75%, 100%)
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // X-axis ticks (intervals based on years)
  const totalYears = Math.ceil(totalPoints / 12);
  let yearStep = 1;
  if (totalYears > 20) yearStep = 5;
  else if (totalYears > 10) yearStep = 2;

  const xTicks = [];
  for (let yr = 0; yr <= totalYears; yr += yearStep) {
    const month = yr * 12;
    if (month <= totalPoints) {
      xTicks.push({ year: yr, month });
    }
  }
  if (totalPoints % 12 !== 0 && totalPoints > (xTicks[xTicks.length - 1]?.month || 0)) {
    xTicks.push({ year: (totalPoints / 12).toFixed(1), month: totalPoints });
  }

  return (
    <div className="chart-container balance-chart-container" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Balance over time</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Remaining balance vs. tenure</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        role="img"
        aria-label="Loan balance over time chart"
      >
        {/* Horizontal gridlines and Y-axis labels */}
        {yTicks.map((pct) => {
          const y = padTop + chartH - pct * chartH;
          const val = maxBalance * pct;
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
                fontFamily="var(--font-sans)"
              >
                {formatCurrencyCompact(val, currency)}
              </text>
            </g>
          );
        })}

        {/* X-axis ticks and labels */}
        {xTicks.map((tick) => {
          const x = getX(tick.month);
          return (
            <g key={tick.month}>
              <line
                x1={x}
                y1={padTop + chartH}
                x2={x}
                y2={padTop + chartH + 4}
                stroke="var(--border-color-strong)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={padTop + chartH + 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-tertiary)"
                fontFamily="var(--font-sans)"
              >
                {tick.year === 0 ? 'Start' : `Yr ${tick.year}`}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="var(--accent-primary)" opacity="0.12" />

        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Start and end points */}
        <circle
          cx={getX(0)}
          cy={getY(initialPrincipal)}
          r="4"
          fill="var(--accent-primary)"
        />
        <circle
          cx={getX(totalPoints)}
          cy={getY(0)}
          r="4"
          fill="var(--accent-primary)"
        />
      </svg>
    </div>
  );
}
