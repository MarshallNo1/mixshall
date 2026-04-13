import { BarChart2, Users, DollarSign, TrendingUp } from 'lucide-react'

const STATS = [
  { icon: BarChart2, label: '策略总数', value: '127', unit: '个', color: '#f0b90b' },
  { icon: Users, label: '跟单用户', value: '45,832', unit: '人', color: '#0ecb81' },
  { icon: DollarSign, label: '7日总收益', value: '$2.3M', unit: '', color: '#2f80ed' },
  { icon: TrendingUp, label: '最高月化', value: '23.4%', unit: '', color: '#f6465d' },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS.map(({ icon: Icon, label, value, unit, color }) => (
        <div
          key={label}
          className="rounded-xl p-4 flex items-center gap-4 border"
          style={{
            backgroundColor: '#1e2329',
            borderColor: '#2b3139',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <div className="text-xs mb-0.5" style={{ color: '#848e9c' }}>
              {label}
            </div>
            <div className="text-lg font-bold font-mono" style={{ color: '#eaecef' }}>
              {value}
              {unit && (
                <span className="text-sm font-normal ml-0.5" style={{ color: '#848e9c' }}>
                  {unit}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
