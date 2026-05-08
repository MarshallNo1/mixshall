# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # type-check then bundle for production (tsc -b && vite build)
npm run lint      # ESLint over all .ts/.tsx files
npm run preview   # serve the production build locally
```

There is no test suite configured. Type errors are caught by `tsc -b` inside the build command.

## Architecture

**Mixshall** is a single-page React 19 + TypeScript + Vite app: a crypto strategy marketplace UI ("策略交易广场"). It is purely frontend with no backend — all data is static.

### Data flow

```
src/data/strategies.ts       ← static strategy array + metadata constants
        ↓
src/hooks/useStrategyFilter  ← filter/sort state (type, search query, sort key)
src/hooks/useStrategyDetail  ← modal open/close state + selected risk level
        ↓
src/components/marketplace/MarketplacePage.tsx   ← root page component, wires both hooks
        ↓
  StrategyGrid → StrategyCard (per-card risk level managed by MarketplacePage)
  StrategyDetailModal (Radix Dialog)
```

### Key types (`src/types/strategy.ts`)

- `Strategy` — top-level entity; contains `riskProfiles: Record<RiskLevel, RiskProfile>` so every strategy ships three pre-set configs (conservative / moderate / aggressive).
- `StrategyParams` is a discriminated union: `GridParams | MartingaleParams | SignalParams`. Switch on `strategy.type` to narrow it — this pattern is used in `StrategyCard`, `ParameterTable`, and `StrategyDetailModal`.
- `StrategyType` union: `'spot_grid' | 'futures_grid' | 'spot_martingale' | 'futures_martingale' | 'signal'`.

### Component layout

```
src/components/
  layout/         Header, Footer
  marketplace/    MarketplacePage, StrategyGrid, StrategyCard,
                  CategoryTabs, StatsBar, RiskBadge, RiskSelector
  detail/         StrategyDetailModal, ParameterTable, PerformanceChart, CopyButton
```

Detail components (`detail/`) are only ever rendered inside `StrategyDetailModal`.

### Styling conventions

- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config` file needed).
- Inline `style` props are used for the Binance-inspired dark color palette:
  - Background levels: `#0b0e11` (darkest) → `#1a1d23` → `#1e2329` → `#252930`
  - Border: `#2b3139`
  - Text primary: `#eaecef`, muted: `#848e9c`
  - Accent/yellow: `#f0b90b`
  - Green (positive): `#0ecb81`, Red (negative/loss): `#f6465d`, Blue (conservative): `#2f80ed`
- `cn()` from `src/lib/utils.ts` merges Tailwind classes (`clsx` + `tailwind-merge`).
- Interactive hover states are applied via `onMouseEnter`/`onMouseLeave` inline style mutations (not Tailwind hover variants) in several card components.

### Path alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### UI dependencies

- **Radix UI**: `@radix-ui/react-dialog` (detail modal), `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`
- **Recharts**: performance chart in `PerformanceChart.tsx`
- **lucide-react**: all icons; strategy-type icons are mapped in a `TYPE_ICONS` object in both `StrategyCard` and `StrategyDetailModal`
