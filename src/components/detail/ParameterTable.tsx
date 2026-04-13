import type { Strategy, RiskLevel, GridParams, MartingaleParams, SignalParams } from '@/types/strategy'

const SIGNAL_SENSITIVITY_LABELS: Record<string, string> = {
  low: '低灵敏度',
  medium: '中灵敏度',
  high: '高灵敏度',
}

function getParamRows(strategy: Strategy, risk: RiskLevel): { label: string; value: string }[] {
  const params = strategy.riskProfiles[risk].params

  switch (strategy.type) {
    case 'spot_grid':
    case 'futures_grid': {
      const p = params as GridParams
      const rows = [
        { label: '网格数量', value: `${p.gridCount} 格` },
        { label: '价格下限', value: `${p.priceRangeLow}%` },
        { label: '价格上限', value: `+${p.priceRangeHigh}%` },
        { label: '投资金额', value: `${p.investmentAmount} USDT` },
        { label: '网格间距', value: p.gridSpacing === 'arithmetic' ? '等差' : '等比' },
      ]
      if (p.leverage) rows.push({ label: '杠杆倍数', value: `${p.leverage}x` })
      return rows
    }
    case 'spot_martingale':
    case 'futures_martingale': {
      const p = params as MartingaleParams
      const rows = [
        { label: '初始仓位', value: `${p.initialPositionSize} USDT` },
        { label: '加仓倍数', value: `${p.multiplier}x` },
        { label: '最大加仓次数', value: `${p.maxOrderCount} 次` },
        { label: '加仓触发跌幅', value: `${p.priceDropTrigger}%` },
        { label: '止盈比例', value: `${p.takeProfitRatio}%` },
      ]
      if (p.leverage) rows.push({ label: '杠杆倍数', value: `${p.leverage}x` })
      return rows
    }
    case 'signal': {
      const p = params as SignalParams
      return [
        { label: '信号灵敏度', value: SIGNAL_SENSITIVITY_LABELS[p.signalSensitivity] },
        { label: '单笔仓位', value: `${p.positionSize} USDT` },
        { label: '止盈比例', value: `${p.takeProfitRatio}%` },
        { label: '止损比例', value: `${p.stopLossRatio}%` },
        { label: '最大持仓数', value: `${p.maxOpenOrders} 单` },
        { label: '确认K线数', value: `${p.confirmationBars} 根` },
      ]
    }
  }
}

interface ParameterTableProps {
  strategy: Strategy
  risk: RiskLevel
}

export function ParameterTable({ strategy, risk }: ParameterTableProps) {
  const rows = getParamRows(strategy, risk)

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2b3139' }}>
      <div
        className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
        style={{ backgroundColor: '#252930', color: '#848e9c' }}
      >
        策略参数
      </div>
      <div className="divide-y divide-[#2b3139]">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderColor: '#2b3139', borderBottomWidth: '1px' }}
          >
            <span className="text-sm" style={{ color: '#848e9c' }}>
              {label}
            </span>
            <span className="text-sm font-medium font-mono" style={{ color: '#eaecef' }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
