import { Grid3X3, Layers, TrendingDown, Zap, Radio, LayoutGrid } from 'lucide-react'
import { STRATEGIES } from '@/data/strategies'
import type { StrategyType } from '@/types/strategy'

const ICON_MAP = {
  spot_grid: Grid3X3,
  futures_grid: Layers,
  spot_martingale: TrendingDown,
  futures_martingale: Zap,
  signal: Radio,
}

interface Tab {
  key: StrategyType | 'all'
  label: string
  icon: React.ComponentType<{ size?: number }>
  count: number
}

interface CategoryTabsProps {
  active: StrategyType | 'all'
  onChange: (type: StrategyType | 'all') => void
}

const LABELS: Record<StrategyType, string> = {
  spot_grid: '现货网格',
  futures_grid: '合约网格',
  spot_martingale: '现货马丁',
  futures_martingale: '合约马丁',
  signal: '信号策略',
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const tabs: Tab[] = [
    {
      key: 'all',
      label: '全部',
      icon: LayoutGrid,
      count: STRATEGIES.length,
    },
    ...Object.entries(LABELS).map(([type, label]) => ({
      key: type as StrategyType,
      label,
      icon: ICON_MAP[type as StrategyType],
      count: STRATEGIES.filter(s => s.type === type).length,
    })),
  ]

  return (
    <div
      className="flex gap-1 p-1 rounded-xl overflow-x-auto scrollbar-none mb-6"
      style={{ backgroundColor: '#1a1d23', border: '1px solid #2b3139' }}
    >
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
            style={{
              color: isActive ? '#f0b90b' : '#848e9c',
              backgroundColor: isActive ? 'rgba(240,185,11,0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(240,185,11,0.25)' : '1px solid transparent',
            }}
          >
            <Icon size={15} />
            <span>{tab.label}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-mono"
              style={{
                backgroundColor: isActive ? 'rgba(240,185,11,0.2)' : '#2b3139',
                color: isActive ? '#f0b90b' : '#848e9c',
              }}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
