# MacroPulse Terminal — User Guide & Macro Playbook

This guide covers the core principles, indicators, and operating procedures for the **MacroPulse Trading Cockpit**.

---

## Table of Contents
1. [Core Design Philosophy](#core-design-philosophy)
2. [Operating Modes: Cockpit vs. Signals-Only](#operating-modes)
3. [Macro Economic Drivers Playbook](#macro-economic-drivers-playbook)
4. [Intermarket Correlation Logic](#intermarket-correlation-logic)
5. [Alerts & Notifications](#alerts--notifications)
6. [Offline Architecture & Data Persistence](#offline-architecture)

---

## 1. Core Design Philosophy

MacroPulse is built on a single premise: **Economic data determines the macro trend; order flow determines the trade timing.**
Rather than treating economic news as unpredictable noise, the terminal categorizes news into structured cause-and-reaction formulas:

$$\text{Data Surprise} \longrightarrow \text{Yield / DXY Reaction} \longrightarrow \text{Cross-Asset Movement}$$

---

## 2. Operating Modes

### ⚡ 1-Click Signals Only Board
- Activated via the **"⚡ 1-Click Signals Only"** button in the header.
- Designed for moments of high volatility when information overload slows execution speed.
- Displays only the core trading verdict for each asset:
  - **🔥 HOT BUY:** Technical structure aligns with bullish institutional flow and supportive macro tailwinds.
  - **🟢 BUY:** Bullish order block test or supportive momentum.
  - **⚪ NEUTRAL:** Conflicted signals; stay on hands or scalp small ranges.
  - **🔴 SELL:** Bearish market structure shift or yield headwind.
  - **🚨 HOT SELL:** Heavy distribution, bearish order flow, and adverse macro prints.

### 🖥️ Desktop 1-Screen Cockpit
- Designed for standard 1080p, 1440p, or 4K single-monitor setups with zero vertical scrolling.
- **Left Stage (Asset Radar):** Shows live prices, 24-hour percent change, pip movement, institutional bias, RSI, and technical stance.
- **Right Stage (Deep-Dive Intel):** Five tabbed views:
  1. **Focus:** Institutional order blocks, FVG, whale flow, and why it's moving.
  2. **Calendar:** High-impact economic calendar with deviation badges and countdowns.
  3. **AI Macro Desk:** Natural language macro scenario tester.
  4. **Dictionary:** Plain-English definitions of major global indicators (NFP, CPI, GDP, EIA).
  5. **Correlations:** Dynamic cross-asset correlation matrix.

---

## 3. Macro Economic Drivers Playbook

| Indicator | Bullish Outcome For Currency | Bearish Outcome For Currency | Impact On Gold | Impact On Oil |
| :--- | :--- | :--- | :--- | :--- |
| **Non-Farm Payrolls (NFP)** | Print > Consensus (+20k beat) | Print < Consensus (-20k miss) | Misses cause gold rallies; beats trigger selloffs | High prints signal strong industrial demand |
| **Core CPI (Consumer Prices)** | Hot print (Fed remains hawkish) | Soft print (Fed eases rates) | High prints cause rate hikes (bearish gold) | High inflation supports nominal commodity prices |
| **Gross Domestic Product (GDP)**| Growth > 2.0% | Negative / decelerating growth | Safe-haven bid on severe misses | High growth expands oil consumption |
| **EIA Crude Oil Inventories** | Large draw (> -3M barrels) | Large build (> +3M barrels) | Indirect through inflation expectations | Large draw is directly bullish for WTI and CAD |
| **FOMC Rate Decision** | Hawkish pause or rate hike | Dovish cut or rate pause | Cuts boost gold; hikes depress gold | Cuts boost liquidity and fuel commodities |

---

## 4. Intermarket Correlation Logic

1. **XAU/USD vs. 10-Year Real Yields & DXY (-0.82 Correlation):**
   - Gold produces no yield. When US bond yields rise, the opportunity cost of holding non-yielding gold increases, driving bullion prices lower.
   - When the Dollar strengthens, gold becomes more expensive for foreign buyers.

2. **WTI Crude vs. USD/CAD (-0.78 Correlation):**
   - Canada is one of the world's largest net exporters of crude oil.
   - As crude oil surges, foreign currency flows into Canadian Dollars, causing USD/CAD to drop.

3. **MNQ (Nasdaq-100) vs. US 10-Year Yields (-0.68 Correlation):**
   - High-growth technology firms have long-duration future cash flows.
   - Higher discount rates reduce the net present value of tech earnings.

---

## 5. Alerts & Notifications

- **Price Target Alerts:** Set upper and lower price threshold triggers for any asset in the cockpit.
- **Audio Chimes:** Uses the Web Audio API to synthesize smooth sine wave chimes without loading external audio files.
- **Push Notifications:** Native browser Service Worker notifications alert you even when the tab is running in the background.

---

## 6. Offline Architecture

MacroPulse stores all states directly in the browser's `localStorage`:
- Active price alerts
- Custom watchlists & order preferences
- Dark / Light theme settings
- Audio alert toggle preferences
- Last sync timestamp

The application requires **zero external servers** to function and runs seamlessly from a local folder or file path.
