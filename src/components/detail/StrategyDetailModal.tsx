import * as Dialog from '@radix-ui/react-dialog'
import { X, Grid3X3, Layers, TrendingDown, Zap, Radio, TriangleAlert } from 'lucide-react'
import { formatPercent, formatNumber } from '@/lib/utils'
import { STRATEGY_TYPE_META } from '@/data/strategies'
import { RiskBadge } from '@/components/marketplace/RiskBadge'
import { RiskSelector } from '@/components/marketplace/RiskSelector'
import { ParameterTable } from './ParameterTable'
import { PerformanceChart } from './PerformanceChart'
import { CopyButton } from './CopyButton'
import type { Strategy, RiskLevel } from '@/types/strategy'

const TYPE_ICONS = {
  spot_grid: Grid3X3,
  futures_grid: Layers,
  spot_martingale: TrendingDown,
  futures_martingale: Zap,
  signal: Radio,
}

interface MetricItemProps {
  label: string
  value: string
  positive?: boolean | null
}

function MetricItem({ label, value, positive }: MetricItemProps) {
  const color =
    positive === true ? '#0ecb81' : positive === false ? '#f6465d' : '#eaecef'
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#2b3139' }}>
      <span className="text-sm" style={{ color: '#848e9c' }}>
        {label}
      </span>
      <span className="text-sm font-semibold font-mono" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

interface StrategyDetailModalProps {
  strategy: Strategy | null
  risk: RiskLevel
  isOpen: boolean
  onClose: () => void
  onRiskChange: (level: RiskLevel) => void
}

export function StrategyDetailModal({
  strategy,
  risk,
  isOpen,
  onClose,
  onRiskChange,
}: StrategyDetailModalProps) {
  if (!strategy) return null

  const profile = strategy.riskProfiles[risk]
  const perf = profile.performance
  const TypeIcon = TYPE_ICONS[strategy.type]
  const typeMeta = STRATEGY_TYPE_META[strategy.type]
  const isFutures = strategy.type === 'futures_grid' || strategy.type === 'futures_martingale'

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Content
          className="fixed z-50 inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-4xl sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-2xl focus:outline-none"
          style={{ backgroundColor: '#1a1d23', border: '1px solid #2b3139' }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
            style={{ backgroundColor: '#1a1d23', borderColor: '#2b3139' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(240,185,11,0.12)' }}
              >
                <TypeIcon size={18} style={{ color: '#f0b90b' }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: '#848e9c' }}>
                  {typeMeta.label} · {strategy.exchange}
                </div>
                <div className="text-base font-semibold" style={{ color: '#eaecef' }}>
                  {strategy.name}
                </div>
              </div>
              <RiskBadge level={risk} size="md" />
            </div>
            <Dialog.Close asChild>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: '#848e9c', backgroundColor: '#252930' }}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {/* Modal body */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left — 3 cols */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              {/* Trading pair & author */}
              <div className="flex items-center gap-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: '#eaecef' }}
                >
                  {strategy.tradingPair}
                </div>
                <div className="text-sm" style={{ color: '#848e9c' }}>
                  by {strategy.authorName} · {formatNumber(strategy.copyCount)} 人跟单
                </div>
              </div>

              {/* Risk selector */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#848e9c' }}>
                  风险等级
                </div>
                <RiskSelector value={risk} onChange={onRiskChange} />
              </div>

              {/* Parameter table */}
              <ParameterTable strategy={strategy} risk={risk} />

              {/* Description */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#848e9c' }}>
                  策略说明
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#848e9c' }}>
                  {strategy.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {strategy.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: '#252930',
                      color: '#848e9c',
                      border: '1px solid #2b3139',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Performance chart */}
              <PerformanceChart performance={perf} />

              {/* Key metrics */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: '#0b0e11', border: '1px solid #2b3139' }}
              >
                <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#848e9c' }}>
                  绩效指标
                </div>
                <MetricItem
                  label="年化收益率"
                  value={formatPercent(profile.annualizedReturn)}
                  positive={true}
                />
                <MetricItem
                  label="月均收益率"
                  value={formatPercent(perf.monthlyReturn)}
                  positive={perf.monthlyReturn >= 0}
                />
                <MetricItem
                  label="最大回撤"
                  value={formatPercent(perf.maxDrawdown)}
                  positive={false}
                />
                <MetricItem label="胜率" value={`${perf.winRate}%`} positive={null} />
                <MetricItem
                  label="夏普比率"
                  value={perf.sharpeRatio.toFixed(2)}
                  positive={null}
                />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm" style={{ color: '#848e9c' }}>
                    运行天数
                  </span>
                  <span className="text-sm font-semibold font-mono" style={{ color: '#eaecef' }}>
                    {perf.tradingDays} 天
                  </span>
                </div>
              </div>

              {/* CTA */}
              <CopyButton strategyName={strategy.name} />

              {/* Futures warning */}
              {isFutures && (
                <div
                  className="flex items-start gap-2 text-xs p-3 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(246,70,93,0.08)',
                    border: '1px solid rgba(246,70,93,0.2)',
                    color: '#f6465d',
                  }}
                >
                  <TriangleAlert size={13} className="mt-0.5 flex-shrink-0" />
                  <span>
                    合约交易具有高杠杆风险，杠杆放大收益的同时也放大亏损，存在强制平仓可能。请充分了解合约交易规则，仅使用可承受损失的资金参与。
                  </span>
                </div>
              )}

              {/* General disclaimer */}
              <div className="text-xs" style={{ color: '#4a5568' }}>
                * 以上数据基于历史回测，不代表未来收益。策略投资存在市场风险，请审慎决策。
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
