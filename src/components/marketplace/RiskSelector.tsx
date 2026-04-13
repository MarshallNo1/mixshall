import { RISK_LEVEL_META } from '@/data/strategies'
import type { RiskLevel } from '@/types/strategy'

const RISK_LEVELS: RiskLevel[] = ['conservative', 'moderate', 'aggressive']

interface RiskSelectorProps {
  value: RiskLevel
  onChange: (level: RiskLevel) => void
}

export function RiskSelector({ value, onChange }: RiskSelectorProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: '#0b0e11' }}>
      {RISK_LEVELS.map(level => {
        const meta = RISK_LEVEL_META[level]
        const isActive = value === level
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className="flex-1 text-xs font-medium px-2 py-1.5 rounded-md transition-all"
            style={{
              color: isActive ? meta.color : '#848e9c',
              backgroundColor: isActive ? meta.bgColor : 'transparent',
              border: isActive ? `1px solid ${meta.borderColor}` : '1px solid transparent',
            }}
          >
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
