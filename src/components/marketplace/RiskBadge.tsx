import { RISK_LEVEL_META } from '@/data/strategies'
import type { RiskLevel } from '@/types/strategy'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md'
}

export function RiskBadge({ level, size = 'sm' }: RiskBadgeProps) {
  const meta = RISK_LEVEL_META[level]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
      style={{
        color: meta.color,
        backgroundColor: meta.bgColor,
        border: `1px solid ${meta.borderColor}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: meta.dotColor }}
      />
      {meta.label}
    </span>
  )
}
