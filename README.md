# MacroPulse Terminal — Global Macro & Market Drivers Cockpit

[![Deploy to GitHub Pages](https://github.com/sandipy/Terminal/actions/workflows/deploy.yml/badge.svg)](https://github.com/sandipy/Terminal/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-sandipy.github.io%2FTerminal-cyan?style=flat&logo=github)](https://sandipy.github.io/Terminal/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

> **MacroPulse** is an institutional-grade financial intelligence terminal designed for macro traders, forex specialists, commodity desks, and index scalp/swing traders. It bridges the gap between macroeconomic data releases and price action across global asset clusters.

---

## 🌐 Live URLs

- **GitHub Pages (Primary Web Terminal):**  
  👉 **[https://sandipy.github.io/Terminal/](https://sandipy.github.io/Terminal/)**
- **Cloud Run Deployment:**  
  👉 **[https://ais-pre-p5ss4ysygv4hrffbda53jx-701366459182.us-east1.run.app](https://ais-pre-p5ss4ysygv4hrffbda53jx-701366459182.us-east1.run.app)**
- **GitHub Repository:**  
  👉 **[https://github.com/sandipy/Terminal](https://github.com/sandipy/Terminal)**

---

## ⚡ Key Features & Capabilities

### 1. ⚡ 1-Click Signals Only Board
- Instantly strips all noise, charts, and secondary data to show **ONLY** decisive trading verdicts:
  - **🔥 HOT BUY** (High conviction institutional accumulation)
  - **🟢 BUY** (Constructive trend alignment)
  - **⚪ NEUTRAL** (Choppy consolidation / awaiting catalyst)
  - **🔴 SELL** (Bearish structure breakdown)
  - **🚨 HOT SELL** (Aggressive institutional distribution)
- Includes one-click copyable setups with target entry, stop loss, and invalidation criteria.

### 2. 🖥️ Desktop 1-Screen Cockpit
- **Zero Scrolling:** Engineered for single-screen multi-monitor command desks.
- **Asset Clusters:**
  - **Commodities:** XAU/USD (Gold), WTI/USD (Crude Oil)
  - **Dollar Axis:** EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, DXY (Dollar Index)
  - **Equity Futures:** MNQ (Micro E-mini Nasdaq-100), MES (Micro E-mini S&P 500)
- **Deep-Dive Intel Panel:**
  - Order Block & Fair Value Gap (FVG) levels
  - Whale Order Flow & Institutional Volume Status
  - Multi-Timeframe RSI with dynamic momentum flags
  - Direct cause-and-reaction catalysts for every tick

### 3. 🎯 Cause & Reaction Economic Calendar
- Live economic calendar tracking FOMC rate decisions, US Core CPI, Non-Farm Payrolls (NFP), GDP prints, and EIA Crude Oil inventories.
- **Impact-Filtered Countdown:** Real-time countdown timer to the next high-volatility event.
- **Surprise Deviation Engine:** Visual indicators showing whether actual prints beat or missed consensus expectations and the historical reaction playbook.

### 4. 🔗 Intermarket Correlation Matrix
- Cross-asset mathematical correlation tracking:
  - Gold vs. Real Yields & US Dollar Index
  - WTI Crude Oil vs. Canadian Dollar & Inflation Expectations
  - Nasdaq/S&P vs. Federal Reserve Liquidity & 10-Year Treasury Yields

### 5. 🤖 AI Macro Scenario Simulator
- Test hypothetical macro scenarios (e.g. *"US CPI beats consensus by +0.3%"* or *"EIA crude builds +6M barrels"*) to calculate instant multi-asset price reaction probabilities.

### 6. 🔔 Audio Alerts & System Push Notifications
- Web Audio API synthesizer for clean institutional chimes on target price triggers.
- Native HTML5 browser notifications for background news releases.
- Fully local storage synchronization: user alerts, theme preferences, and watchlists persist across sessions.

---

## 📦 Running 100% Offline (Standalone Package)

MacroPulse is designed to work **completely offline** without an internet connection:

### Download the Offline Package:
1. Click the **"Offline ZIP"** button directly inside the terminal header, OR
2. Download `macro-pulse-terminal-offline.zip` from this repository.

### How to Launch Offline:
- **Windows:** Double-click `start-terminal.bat` or open `index.html` directly in any web browser.
- **Mac / Linux:** Run `python3 start-offline-server.py` and navigate to `http://localhost:8080`.
- **Direct file access:** You can also simply open `index.html` in Chrome, Firefox, Safari, or Edge without running any web server!

---

## 🛠️ Local Development & Build

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm or bun

### Setup
```bash
# Clone the repository
git clone https://github.com/sandipy/Terminal.git
cd Terminal

# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

### Production Build
```bash
# Build the production bundle into dist/
npm run build
```

---

## 🚀 Continuous Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to **GitHub Pages** whenever changes are pushed to the `main` branch.

To enable GitHub Pages manually:
1. Go to repository **Settings** ➔ **Pages**.
2. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
3. Every commit pushed to `main` will automatically build and publish to `https://sandipy.github.io/Terminal/`.

---

## 📄 License

MIT License. Free for personal and commercial trading intelligence.
