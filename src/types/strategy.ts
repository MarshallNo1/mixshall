export type StrategyType =
  | 'spot_grid'
  | 'futures_grid'
  | 'spot_martingale'
  | 'futures_martingale'
  | 'signal'

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive'

export interface GridParams {
  gridCount: number
  priceRangeLow: number
  priceRangeHigh: number
  investmentAmount: number
  leverage?: number
  gridSpacing: 'arithmetic' | 'geometric'
}

export interface MartingaleParams {
  multiplier: number
  maxOrderCount: number
  initialPositionSize: number
  takeProfitRatio: number
  leverage?: number
  priceDropTrigger: number
}

export interface SignalParams {
  signalSensitivity: 'low' | 'medium' | 'high'
  takeProfitRatio: number
  stopLossRatio: number
  positionSize: number
  maxOpenOrders: number
  confirmationBars: number
}

export type StrategyParams = GridParams | MartingaleParams | SignalParams

export interface PerformanceMetrics {
  totalReturn: number
  monthlyReturn: number
  maxDrawdown: number
  winRate: number
  sharpeRatio: number
  tradingDays: number
}

export interface RiskProfile {
  level: RiskLevel
  label: string
  params: StrategyParams
  performance: PerformanceMetrics
  annualizedReturn: number
}

export interface Strategy {
  id: string
  type: StrategyType
  typeLabel: string
  name: string
  tradingPair: string
  exchange: string
  description: string
  riskProfiles: Record<RiskLevel, RiskProfile>
  tags: string[]
  copyCount: number
  createdAt: string
  updatedAt: string
  authorName: string
}

export interface StrategyTypeMeta {
  label: string
  icon: string
  description: string
}

export interface RiskLevelMeta {
  label: string
  color: string
  bgColor: string
  borderColor: string
  dotColor: string
}
