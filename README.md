# EMI Calculator

A fast, responsive, zero-tracking loan & EMI calculator with down payment support, interactive amortization schedules, and principal vs. interest breakdown.

## Features

- **Accurate Financial Calculations**: Industry-standard reducing-balance EMI formula.
- **Down Payment Support**: Mode toggle between fixed amount and percentage, live LTV ratio, and proportional visual breakdown.
- **Visual Analytics**: Interactive SVG donut chart and balance-over-time area visualization.
- **Full Amortization Schedule**: Monthly and yearly breakdown with instant CSV export.
- **Extra Payment Simulator**: Prepayment impact modeling (monthly, annual, one-time lump-sum).
- **Privacy First**: 100% client-side calculations with zero server tracking and zero database requirements.
- **Shareable State**: Copy calculation links with parameters preserved in the URL.
- **Responsive & Accessible**: Works seamlessly on mobile, tablet, and desktop with both light and dark themes.

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
