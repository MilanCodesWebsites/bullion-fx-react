# Dashboard Redesign — Layout Structure

## Original Layout (Deprecated)
```
┌─────────────────────────────────────────────┐
│ Welcome Header (with Brand logo)            │
├─────────────────────────────────────────────┤
│                                             │
│ Large Balance Card (with all stats)         │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Two Column:                                 │
│ ┌──────────────┐  ┌──────────────────────┐│
│ │ Account      │  │ Market Widget        ││
│ │ Overview +   │  │ (CoinGecko)          ││
│ │ Quote        │  │                      ││
│ └──────────────┘  └──────────────────────┘│
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Recent Activity (ALL transactions)          │
│                                             │
└─────────────────────────────────────────────┘
```

## NEW Layout (Redesigned) ✨

### Desktop View (1440px+)
```
┌─────────────────────────────────────────────────────────────┐
│ Welcome back, [Name]!           [Deposit] [Withdraw] Buttons│
│ Manage your BullionFX portfolio                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│           LARGE BALANCE CARD WITH EYE TOGGLE                │
│           $X,XXX.XX USD │ Hide/Show Button                  │
│                                                               │
│  Initial Balance    │    Profit & Loss    │    P&L %        │
│     $X,XXX.XX      │  +$XXX.XX (green)   │   XX.XX%        │
│                                                               │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                        │
│  Account Summary     │                                        │
│  ┌────────────────┐  │    Market Overview                   │
│  │Total Credits   │  │                                        │
│  │    $X,XXX.XX   │  │    CoinGecko Widget                  │
│  ├────────────────┤  │    (Bitcoin, Ethereum, etc.)         │
│  │ Total Debits   │  │                                        │
│  │    $X,XXX.XX   │  │    [~32rem height]                   │
│  ├────────────────┤  │                                        │
│  │ Pending Txns   │  │                                        │
│  │       N        │  │                                        │
│  └────────────────┘  │                                        │
│                      │                                        │
│  Daily Insight       │                                        │
│  ┌────────────────┐  │                                        │
│  │ Quote          │  │                                        │
│  │ "The biggest   │  │                                        │
│  │  risk is not   │  │                                        │
│  │  taking any    │  │                                        │
│  │  risk..."      │  │                                        │
│  │ — Mark Z.      │  │                                        │
│  │ Risk Mgmt.     │  │                                        │
│  └────────────────┘  │                                        │
│                      │                                        │
├──────────────────────┴──────────────────────────────────────┤
│                                                               │
│ Recent Activity (8 transactions shown)                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✓ Deposit        | Sep 15 at 10:30 AM | +$1,000.00      │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ✓ Withdrawal     | Sep 14 at 2:15 PM  | -$500.00        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ⏱ Pending Trade  | Sep 14 at 11:45 AM | +$250.00        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ... (5 more)                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ [View all transactions →]                                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Tablet View (768px - 1023px)
```
┌──────────────────────────────────────┐
│ Welcome back, [Name]!                │
│ Manage your BullionFX portfolio       │
│                  [Deposit] [Withdraw] │
├──────────────────────────────────────┤
│                                      │
│    LARGE BALANCE CARD                │
│    $X,XXX.XX USD | Hide/Show         │
│                                      │
│  Initial   │  Profit  │  P&L %       │
│  $X,XXX    │ +$XXX    │  XX.XX%      │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ Account Summary                      │
│ ┌────────────────────────────────┐  │
│ │ Total Credits: $X,XXX.XX       │  │
│ ├────────────────────────────────┤  │
│ │ Total Debits: $X,XXX.XX        │  │
│ ├────────────────────────────────┤  │
│ │ Pending Txns: N                │  │
│ └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ Daily Insight (Quote)                │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ Market Overview                      │
│ (CoinGecko Widget)                   │
│ [~20rem height on tablet]            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ Recent Activity (8 transactions)     │
│ [Stack of cards]                     │
│                                      │
│ [View all transactions →]            │
│                                      │
└──────────────────────────────────────┘
```

### Mobile View (320px - 767px)
```
┌──────────────────────┐
│ Welcome back, [Name]!│
│ Manage BullionFX     │
│ portfolio            │
├──────────────────────┤
│ [Deposit]            │
│ [Withdraw]           │
├──────────────────────┤
│                      │
│ BALANCE CARD         │
│ $X,XXX.XX USD        │
│ [Hide]               │
│ Initial: $X,XXX.XX   │
│ P&L: +$XXX.XX        │
│ %: XX.XX%            │
│                      │
├──────────────────────┤
│                      │
│ Account Summary      │
│ Credits: $X,XXX      │
│ Debits: $X,XXX       │
│ Pending: N           │
│                      │
├──────────────────────┤
│                      │
│ Daily Insight        │
│ [Quote card]         │
│                      │
├──────────────────────┤
│                      │
│ Market Overview      │
│ [CoinGecko widget    │
│  full width]         │
│                      │
├──────────────────────┤
│                      │
│ Recent Activity      │
│ [Transaction cards   │
│  stacked full width] │
│                      │
│ [View all →]         │
│                      │
└──────────────────────┘
```

---

## Key Layout Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Header** | With logo/brand | Clean title + Action CTAs |
| **Balance Display** | Medium sized | Large, prominent with privacy toggle |
| **Stats** | Scattered | Organized grid in card |
| **Sidebar Content** | Left column only | Desktop: dedicated left; Mobile: above |
| **Market Data** | Full width | Right column on desktop, full width on mobile |
| **Activity** | All transactions | First 8 with "view all" link |
| **Spacing** | Tight | Generous white space |
| **Cards** | Basic | Modern with borders, shadows, hover states |
| **Responsiveness** | Limited | Full mobile, tablet, desktop optimization |
| **Information Hierarchy** | Flat | Clear primary → secondary → tertiary |

---

## CSS Classes Used (Tailwind)

### Layout
- `grid grid-cols-1 lg:grid-cols-3` — Three-column layout on desktop
- `flex flex-col sm:flex-row` — Responsive flex direction
- `space-y-6` — Consistent vertical spacing
- `gap-6` — Grid gaps for section spacing

### Cards
- `rounded-2xl` — Modern rounded corners
- `border border-slate-800` — Subtle borders
- `bg-slate-900` — Card backgrounds
- `hover:border-slate-600` — Hover interactions

### Typography
- `text-2xl sm:text-3xl font-bold` — Heading hierarchy
- `text-slate-400` — Muted secondary text
- `text-vertex-blue-600` — Brand accent color

### Interactive
- `hover:bg-slate-700/60` — Button hover states
- `transition-colors duration-200` — Smooth transitions
- `cursor-pointer` — Transaction row hover
- `group hover:text-blue-300` — Hover effects

---

## Component Tree

```
Dashboard
├── Welcome Header
│   ├── Title & Subtitle
│   └── Action Buttons (Deposit, Withdraw)
│
├── Balance Card
│   ├── Header (with Eye Toggle)
│   ├── Balance Display
│   ├── Updated Timestamp
│   └── Stats Grid
│       ├── Initial Balance
│       ├── Profit & Loss
│       └── P&L %
│
├── Two-Column Layout (Desktop) / Stack (Mobile)
│   ├── Left Column / Top (Mobile)
│   │   ├── Account Summary Card
│   │   │   ├── Total Credits
│   │   │   ├── Total Debits
│   │   │   └── Pending Transactions
│   │   └── Daily Insight Card
│   │       ├── Quote Text
│   │       ├── Author
│   │       └── Category
│   │
│   └── Right Column / Bottom (Mobile)
│       └── Market Overview Card
│           └── CoinGecko Widget
│
├── Recent Activity Section
│   ├── Section Header (with count)
│   ├── Transaction Row (8 max)
│   │   ├── Status Icon
│   │   ├── Description & Timestamp
│   │   ├── Amount
│   │   └── Status Badge
│   ├── Empty State (if no transactions)
│   └── View All Link
│
└── TransactionReceiptModal
    └── (Opens on transaction click)
```

