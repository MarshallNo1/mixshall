import { Users, ChevronRight, Grid3X3, Layers, TrendingDown, Zap, Radio, TriangleAlert } from 'lucide-react'
import { formatPercent, formatNumber } from '@/lib/utils'
import { STRATEGY_TYPE_META } from '@/data/strategies'
import { RiskBadge } from './RiskBadge'
import { RiskSelector } from './RiskSelector'
import type { Strategy, RiskLevel, GridParams, MartingaleParams, SignalParams } from '@/types/strategy'

const TYPE_ICONS = {
  spot_grid: Grid3X3,
  futures_grid: Layers,
  spot_martingale: TrendingDown,
  futures_martingale: Zap,
  signal: Radio,
}

const SIGNAL_SENSITIVITY_LABELS = { low: '低', medium: '中', high: '高' }

function getParamSnippet(strategy: Strategy, risk: RiskLevel): string {
  const params = strategy.riskProfiles[risk].params
  switch (strategy.type) {
    case 'spot_grid':
    case 'futures_grid': {
      const p = params as GridParams
      const parts = [`网格数: ${p.gridCount}`, `区间: ±${p.priceRangeHigh}%`]
      if (p.leverage) parts.push(`${p.leverage}x`)
      return parts.join(' · ')
    }
    case 'spot_martingale':
    case 'futures_martingale': {
      const p = params as MartingaleParams
      const parts = [`加仓倍数: ${p.multiplier}x`, `最多${p.maxOrderCount}单`]
      if (p.leverage) parts.push(`${p.leverage}x`)
      return parts.join(' · ')
    }
    case 'signal': {
      const p = params as SignalParams
      return `灵敏度: ${SIGNAL_SENSITIVITY_LABELS[p.signalSensitivity]} · TP ${p.takeProfitRatio}% · SL ${p.stopLossRatio}%`
    }
  }
}

interface StrategyCardProps {
  strategy: Strategy
  riskLevel: RiskLevel
  onRiskChange: (level: RiskLevel) => void
  onViewDetail: () => void
}

export function StrategyCard({ strategy, riskLevel, onRiskChange, onViewDetail }: StrategyCardProps) {
  const profile = strategy.riskProfiles[riskLevel]
  const perf = profile.performance
  const TypeIcon = TYPE_ICONS[strategy.type]
  const typeMeta = STRATEGY_TYPE_META[strategy.type]
  const isFutures = strategy.type === 'futures_grid' || strategy.type === 'futures_martingale'

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-4 transition-all cursor-pointer group"
      style={{
        backgroundColor: '#1e2329',
        borderColor: '#2b3139',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = '#252930'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,185,11,0.35)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = '#1e2329'
        ;(e.currentTarget as HTMLElement).style.borderColor = '#2b3139'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(240,185,11,0.12)' }}
          >
            <TypeIcon size={15} style={{ color: '#f0b90b' }} />
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: '#848e9c' }}>
              {typeMeta.label}
            </div>
            <div className="text-sm font-semibold leading-tight" style={{ color: '#eaecef' }}>
              {strategy.tradingPair}
            </div>
          </div>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      {/* Strategy name */}
      <div>
        <div className="text-base font-semibold mb-0.5" style={{ color: '#eaecef' }}>
          {strategy.name}
        </div>
        <div className="text-xs" style={{ color: '#848e9c' }}>
          {strategy.exchange} · {strategy.authorName}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 rounded-lg p-3" style={{ backgroundColor: '#0b0e11' }}>
        <div className="text-center">
          <div
            className="text-sm font-bold font-mono"
            style={{ color: perf.monthlyReturn >= 0 ? '#0ecb81' : '#f6465d' }}
          >
            {formatPercent(perf.monthlyReturn)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#848e9c' }}>
            月均收益
          </div>
        </div>
        <div className="text-center border-x" style={{ borderColor: '#2b3139' }}>
          <div className="text-sm font-bold font-mono" style={{ color: '#f6465d' }}>
            {formatPercent(perf.maxDrawdown)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#848e9c' }}>
            最大回撤
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#eaecef' }}>
            {perf.winRate}%
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#848e9c' }}>
            胜率
          </div>
        </div>
      </div>

      {/* Risk selector */}
      <RiskSelector value={riskLevel} onChange={onRiskChange} />

      {/* Params snippet */}
      <div
        className="text-xs px-3 py-2 rounded-lg font-mono"
        style={{ backgroundColor: '#0b0e11', color: '#848e9c' }}
      >
        {getParamSnippet(strategy, riskLevel)}
      </div>

      {/* Futures warning */}
      {isFutures && (
        <div
          className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg"
          style={{
            backgroundColor: 'rgba(246,70,93,0.08)',
            border: '1px solid rgba(246,70,93,0.2)',
            color: '#f6465d',
          }}
        >
          <TriangleAlert size={11} />
          合约交易有爆仓风险，请谨慎参与
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#848e9c' }}>
          <Users size={13} />
          <span>{formatNumber(strategy.copyCount)} 人跟单</span>
        </div>
        <button
          onClick={onViewDetail}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: '#f0b90b' }}
        >
          查看详情
          <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
