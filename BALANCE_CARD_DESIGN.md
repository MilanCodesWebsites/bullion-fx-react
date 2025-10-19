# 🎨 Balance Card Redesign — Visual Guide

## New Balance Card Component

### Layout Structure

```
╔════════════════════════════════════════════════════════════╗
║                     WALLET BALANCE CARD                     ║
╠════════════════════════════════════════════════════════════╣
║                                                              ║
║  💰 Wallet Balance              [Hide/Show Eye Button]      ║
║     Live portfolio value                                    ║
║                                                              ║
║  ───────────────────────────────────────────────────────   ║
║                                                              ║
║  $12,345.67 USD                                             ║
║  Updated just now                                           ║
║                                                              ║
║  ┌──────────────────┬──────────────────┬──────────────────┐ ║
║  │ Initial Balance  │ Profit & Loss    │ P&L %            │ ║
║  │ $10,000.00      │ +$2,345.67  ↑    │ +23.46%          │ ║
║  └──────────────────┴──────────────────┴──────────────────┘ ║
║                                                              ║
║  ═══════════════════════════════════════════════════════   ║
║                                                              ║
║  ┌────────────────────────┬────────────────────────┐       ║
║  │ 💰 Deposit Funds       │ 💰 Withdraw Funds      │       ║
║  └────────────────────────┴────────────────────────┘       ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
```

---

## Component Sections

### 1. Header Section
```
💰 Wallet Balance              [👁 Hide]
   Live portfolio value
```
- **Icon**: Dollar sign in blue circle
- **Title**: "Wallet Balance"
- **Subtitle**: "Live portfolio value"
- **Action**: Privacy toggle (eye icon to hide/show balance)

### 2. Balance Display
```
$12,345.67 USD
Updated just now
```
- **Large prominent number** (responsive text sizing)
- **Currency badge** (USD)
- **Update timestamp** (for verification)
- **Privacy support** (can be blurred when toggled)

### 3. Stats Grid
```
┌──────────────────┬──────────────────┬──────────────────┐
│ Initial Balance  │ Profit & Loss    │ P&L %            │
│ $10,000.00      │ +$2,345.67  ↑    │ +23.46%          │
└──────────────────┴──────────────────┴──────────────────┘
```
- **3-column grid** on desktop, stacks on mobile
- **Initial Balance**: Starting capital
- **Profit & Loss**: Dollar amount with trend icon
- **P&L %**: Percentage change
- **Color coding**: Green for positive, red for negative

### 4. Divider
```
═══════════════════════════════════════════════════════
```
Visual separator between information and actions

### 5. Action Buttons
```
┌────────────────────────┬────────────────────────┐
│ 💰 Deposit Funds       │ 💰 Withdraw Funds      │
└────────────────────────┴────────────────────────┘
```

#### Deposit Button
- **Color**: Blue (`bg-vertex-blue-600`)
- **Hover**: Darker blue with glow shadow
- **Text**: "💰 Deposit Funds"
- **Link**: `/deposit`
- **Style**: Primary action (more prominent)

#### Withdraw Button
- **Color**: Dark gray (`bg-slate-800`)
- **Border**: Subtle slate border
- **Hover**: Lighter gray background
- **Text**: "💰 Withdraw Funds"
- **Link**: `/withdraw`
- **Style**: Secondary action

---

## Responsive Behavior

### Mobile (< 640px)
```
┌──────────────────────────┐
│      Balance Card        │
├──────────────────────────┤
│                          │
│  💰 Wallet Balance  [👁] │
│                          │
│  $12,345.67 USD          │
│  Updated just now        │
│                          │
│  ┌────────────────────┐  │
│  │ Stat 1 │ Stat 2   │  │
│  │ Stat 3             │  │
│  └────────────────────┘  │
│                          │
│  ════════════════════    │
│                          │
│  ┌────────────────────┐  │
│  │  Deposit Funds     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Withdraw Funds    │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘
```
- Buttons **full-width** and **stacked**
- Single column layout
- Touch-friendly sizing

### Tablet (640px - 1024px)
```
┌────────────────────────────────────────┐
│       Balance Card                     │
├────────────────────────────────────────┤
│                                        │
│  💰 Wallet Balance        [👁 Hide]   │
│                                        │
│  $12,345.67 USD                        │
│  Updated just now                      │
│                                        │
│  ┌────────────┬────────────┬────────┐ │
│  │  Initial   │   P & L    │  P&L % │ │
│  │ $10,000.00 │ +$2,345.67 │ +23.46%│ │
│  └────────────┴────────────┴────────┘ │
│                                        │
│  ═════════════════════════════════     │
│                                        │
│  ┌──────────────┬──────────────┐      │
│  │ Deposit      │ Withdraw     │      │
│  │ Funds        │ Funds        │      │
│  └──────────────┴──────────────┘      │
│                                        │
└────────────────────────────────────────┘
```
- Buttons **side-by-side** in 2 columns
- Stats in 3-column grid
- Optimized spacing

### Desktop (> 1024px)
```
Same as tablet with larger padding and font sizes
- Maximum comfortable reading width
- Optimal button spacing
- Full visual impact
```

---

## Color Scheme

### Balance Card Background
- **Gradient**: from-[#0b1220] via-[#0b1322] to-[#0b1220]
- **Effect**: Dark blue-black with subtle depth
- **Border**: slate-800 (1px)
- **Shadow**: Glow effect with blue tint

### Stats Grid Cards
- **Background**: slate-900/70 (semi-transparent)
- **Border**: slate-800
- **Text**: white with slate-400 labels

### Buttons
- **Deposit**: 
  - Background: `#2563eb` (blue)
  - Hover Shadow: `box-shadow: 0 0 20px rgba(37, 99, 235, 0.5)`
  - Text: White
  
- **Withdraw**:
  - Background: `#1e293b` (dark slate)
  - Border: `#475569` (slate-600)
  - Text: White

### Text Colors
- **Header**: `#ffffff` (white)
- **Subtitle**: `#94a3b8` (slate-400)
- **Labels**: `#64748b` (slate-500)
- **Amount**: `#ffffff` (white)
- **Positive**: `#4ade80` (green-400)
- **Negative**: `#f87171` (red-400)

---

## Typography

### Header Title
- **Font**: Manrope, sans-serif
- **Size**: 18px / 1.125rem
- **Weight**: 600 (semibold)
- **Color**: White

### Large Balance Number
- **Font**: Manrope, sans-serif
- **Size**: 48px (sm), 64px (lg), 96px (lg)
- **Weight**: 800 (extrabold)
- **Tracking**: tight
- **Color**: White

### Stats Labels
- **Font**: Manrope, sans-serif
- **Size**: 12px / 0.75rem
- **Weight**: 400 (regular)
- **Color**: Slate 400

### Stats Values
- **Font**: Manrope, sans-serif
- **Size**: 18px / 1.125rem
- **Weight**: 600 (semibold)
- **Color**: White / Green / Red (conditional)

### Button Text
- **Font**: Manrope, sans-serif
- **Size**: 16px / 1rem
- **Weight**: 600 (semibold)
- **Color**: White

---

## Spacing & Sizing

### Card Padding
- **Mobile**: `p-4` (16px)
- **Tablet**: `p-6` (24px)
- **Desktop**: `p-8` (32px)

### Internal Spacing
- **Header to Balance**: `mb-6` (24px)
- **Balance to Stats**: `mb-6` (24px)
- **Stats to Divider**: `mb-6` (24px) before, `pt-6` (24px) after
- **Between Buttons**: `gap-3` (12px) on mobile, scales up on larger screens

### Grid Gaps
- **Stats Grid**: `gap-3` (12px)
- **Button Grid**: `gap-3` (12px)

### Button Sizing
- **Height**: `py-3` (12px vertical padding)
- **Width**: 100% on mobile, 50% on desktop
- **Border Radius**: `rounded-lg` (8px)
- **Min Height**: Maintains 44px+ for touch targets

---

## Interactive States

### Buttons

#### Deposit Button Hover
```
bg-vertex-blue-700 (darker blue)
shadow-lg shadow-vertex-blue-600/50 (glow effect)
transform: slightly raised effect
transition: smooth 200ms
```

#### Withdraw Button Hover
```
bg-slate-700 (lighter gray)
border-slate-600 (highlighted border)
transition: smooth 200ms
```

#### Buttons Active/Click
```
transform: slightly pressed appearance
opacity: 0.95
```

### Privacy Toggle

#### Show State
```
Icon: Eye icon (visible)
Text: "Show"
Background: slate-800/60
Border: slate-700
```

#### Hide State
```
Icon: Eye-off icon (hidden)
Text: "Hide"
Background: slate-800/60
Border: slate-700
```

#### Hover
```
Background: slate-700/60 (lighter)
transition: smooth
```

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Optimizations

- **CSS**: Tailwind atomic classes (no bloat)
- **Rendering**: GPU-accelerated shadows and gradients
- **Responsive**: Mobile-first design
- **Accessibility**: ARIA labels, semantic HTML
- **Load Time**: No external dependencies for card itself

---

## Accessibility Features

- ✅ Privacy toggle has `aria-label`
- ✅ Semantic structure (header, content, footer)
- ✅ Sufficient color contrast (WCAG AA compliant)
- ✅ Touch targets: 44x44px minimum
- ✅ Keyboard navigable (Tab through elements)
- ✅ Focus visible states on buttons
- ✅ No flashing content

---

This redesigned balance card provides a modern, professional appearance while maintaining excellent usability and accessibility across all devices.

