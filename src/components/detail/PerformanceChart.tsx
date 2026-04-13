import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { generateEquityCurve } from '@/data/strategies'
import { formatPercent } from '@/lib/utils'
import type { PerformanceMetrics } from '@/types/strategy'

interface PerformanceChartProps {
  performance: PerformanceMetrics
}

interface TooltipPayload {
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  const pnl = value - 100
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}
    >
      <div style={{ color: '#848e9c' }}>第 {label} 天</div>
      <div className="font-bold font-mono mt-0.5" style={{ color: '#eaecef' }}>
        {value.toFixed(2)}
      </div>
      <div style={{ color: pnl >= 0 ? '#0ecb81' : '#f6465d' }}>
        {formatPercent(pnl)}
      </div>
    </div>
  )
}

export function PerformanceChart({ performance }: PerformanceChartProps) {
  const data = useMemo(
    () => generateEquityCurve(performance.monthlyReturn, performance.maxDrawdown, 90),
    [performance.monthlyReturn, performance.maxDrawdown],
  )

  const finalValue = data[data.length - 1]?.value ?? 100
  const totalReturn = finalValue - 100
  const isPositive = totalReturn >= 0

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#0b0e11', border: '1px solid #2b3139' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#848e9c' }}>
          近90天模拟收益曲线
        </span>
        <span
          className="text-sm font-bold font-mono"
          style={{ color: isPositive ? '#0ecb81' : '#f6465d' }}
        >
          {formatPercent(totalReturn)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? '#0ecb81' : '#f6465d'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={isPositive ? '#0ecb81' : '#f6465d'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#848e9c', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={29}
            tickFormatter={v => `${v}d`}
          />
          <YAxis
            tick={{ fill: '#848e9c', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#0ecb81' : '#f6465d'}
            strokeWidth={2}
            fill="url(#chartGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
