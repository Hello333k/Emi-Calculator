# Financial Calculator Suite (EMI & Savings)

A fast, responsive, zero-tracking financial utility featuring a loan & EMI calculator and a comprehensive compound interest & savings goal calculator.

## Calculators & Features

### 1. EMI Calculator
- **Accurate Financial Calculations**: Industry-standard reducing-balance EMI formula.
- **Down Payment Support**: Mode toggle between fixed amount and percentage, live LTV ratio, and proportional visual breakdown.
- **Visual Analytics**: Interactive SVG donut chart and balance-over-time area visualization.
- **Full Amortization Schedule**: Monthly and yearly breakdown with instant CSV export.
- **Extra Payment Simulator**: Prepayment impact modeling (monthly, annual, one-time lump-sum).
- **Shareable State**: Copy calculation links with parameters preserved in the URL.

### 2. Savings Calculator
- **Dual Planning Modes**:
  - **Growth Projection**: Project accumulated balance with recurring contributions and compound growth.
  - **Reach a Goal**: Calculate required periodic contributions or time-to-goal to achieve target wealth.
- **Flexible Compounding**: Support for Daily, Monthly, Quarterly, Semi-Annual, and Annual compounding, with both Nominal APR and APY.
- **Dual Visual Growth Chart**: Interactive SVG trajectory comparing total deposits against compound interest.
- **Savings Milestones**: Quick checkpoint projections (1 month, 6 months, 1 year, 3 years, 5 years, 10 years, 20 years, 30 years).
- **Itemized Schedule & Export**: Year-by-year summary and month-by-month detail schedule with instant CSV export.
- **Advanced Assumptions**: Annual step-up contribution increases, one-time deposits, inflation adjustment in today's money, annual fees, and rate sensitivity scenario comparisons.
- **Privacy First**: 100% client-side calculations with zero cookies, zero analytics tracking, and zero database requirements.
- **Responsive & Accessible**: Dark and light modes, keyboard navigation, and WCAG-compliant design tokens.

## Getting Started

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Build the static production bundle into the `dist` folder:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x or 22.x
