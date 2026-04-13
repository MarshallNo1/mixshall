import { StrategyCard } from './StrategyCard'
import type { Strategy, RiskLevel } from '@/types/strategy'

interface StrategyGridProps {
  strategies: Strategy[]
  riskLevels: Record<string, RiskLevel>
  onRiskChange: (id: string, level: RiskLevel) => void
  onViewDetail: (strategy: Strategy, risk: RiskLevel) => void
}

export function StrategyGrid({ strategies, riskLevels, onRiskChange, onViewDetail }: StrategyGridProps) {
  if (strategies.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: '#848e9c' }}>
        <div className="text-4xl mb-4">🔍</div>
        <div className="text-lg font-medium mb-2" style={{ color: '#eaecef' }}>
          未找到匹配策略
        </div>
        <div className="text-sm">尝试调整搜索条件或切换策略类型</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {strategies.map(strategy => {
        const risk = riskLevels[strategy.id] ?? 'moderate'
        return (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            riskLevel={risk}
            onRiskChange={level => onRiskChange(strategy.id, level)}
            onViewDetail={() => onViewDetail(strategy, risk)}
          />
        )
      })}
    </div>
  )
}
