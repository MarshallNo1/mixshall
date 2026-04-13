import type {
  Strategy,
  StrategyType,
  RiskLevel,
  StrategyTypeMeta,
  RiskLevelMeta,
} from '@/types/strategy'

export const STRATEGY_TYPE_META: Record<StrategyType, StrategyTypeMeta> = {
  spot_grid: {
    label: '现货网格',
    icon: 'Grid3X3',
    description: '在设定价格区间内自动低买高卖，适合震荡行情',
  },
  futures_grid: {
    label: '合约网格',
    icon: 'Layers',
    description: '带杠杆的网格策略，放大收益同时需注意风险管理',
  },
  spot_martingale: {
    label: '现货马丁格尔',
    icon: 'TrendingDown',
    description: '价格下跌时递增加仓，回升时统一止盈，适合长期看涨标的',
  },
  futures_martingale: {
    label: '合约马丁格尔',
    icon: 'Zap',
    description: '杠杆马丁格尔，高收益高风险，需严格控制仓位',
  },
  signal: {
    label: '信号策略',
    icon: 'Radio',
    description: '基于技术指标信号自动开平仓，支持多种信号源接入',
  },
}

export const RISK_LEVEL_META: Record<RiskLevel, RiskLevelMeta> = {
  conservative: {
    label: '保守',
    color: '#2f80ed',
    bgColor: 'rgba(47,128,237,0.15)',
    borderColor: 'rgba(47,128,237,0.35)',
    dotColor: '#2f80ed',
  },
  moderate: {
    label: '稳健',
    color: '#f0b90b',
    bgColor: 'rgba(240,185,11,0.15)',
    borderColor: 'rgba(240,185,11,0.35)',
    dotColor: '#f0b90b',
  },
  aggressive: {
    label: '积极',
    color: '#f6465d',
    bgColor: 'rgba(246,70,93,0.15)',
    borderColor: 'rgba(246,70,93,0.35)',
    dotColor: '#f6465d',
  },
}

export function generateEquityCurve(
  monthlyReturn: number,
  maxDrawdown: number,
  days = 90,
): { day: number; value: number }[] {
  const dailyReturn = monthlyReturn / 30 / 100
  const data: { day: number; value: number }[] = []
  let value = 100
  const drawdownDay = Math.floor(days * 0.4)
  const drawdownDuration = 12

  for (let i = 0; i <= days; i++) {
    const noise = (Math.random() - 0.48) * dailyReturn * 2
    if (i >= drawdownDay && i < drawdownDay + drawdownDuration) {
      const drawdownPerDay = (maxDrawdown / 100 / drawdownDuration) * -1
      value = value * (1 + drawdownPerDay + noise * 0.3)
    } else {
      value = value * (1 + dailyReturn + noise)
    }
    value = Math.max(value, 80)
    data.push({ day: i, value: parseFloat(value.toFixed(2)) })
  }
  return data
}

export const STRATEGIES: Strategy[] = [
  // ─── 现货网格 ────────────────────────────────────────────────
  {
    id: 'sg-btc-conservative',
    type: 'spot_grid',
    typeLabel: '现货网格',
    name: 'BTC 稳健网格',
    tradingPair: 'BTC/USDT',
    exchange: 'Binance',
    description:
      '以比特币为标的，在±5%价格区间内设置10个等差网格，自动低买高卖，适合震荡行情，资金利用率高，风险较低。',
    tags: ['低风险', '稳定收益', '比特币'],
    copyCount: 3241,
    createdAt: '2024-06-15',
    updatedAt: '2024-12-01',
    authorName: 'GridMaster',
    riskProfiles: {
      conservative: {
        level: 'conservative',
        label: '保守',
        annualizedReturn: 28.5,
        performance: {
          totalReturn: 18.2,
          monthlyReturn: 2.1,
          maxDrawdown: -4.3,
          winRate: 78,
          sharpeRatio: 1.82,
          tradingDays: 90,
        },
        params: {
          gridCount: 10,
          priceRangeLow: -5,
          priceRangeHigh: 5,
          investmentAmount: 500,
          gridSpacing: 'arithmetic',
        },
      },
      moderate: {
        level: 'moderate',
        label: '稳健',
        annualizedReturn: 62.4,
        performance: {
          totalReturn: 38.6,
          monthlyReturn: 4.8,
          maxDrawdown: -8.2,
          winRate: 67,
          sharpeRatio: 2.14,
          tradingDays: 90,
        },
        params: {
          gridCount: 20,
          priceRangeLow: -12,
          priceRangeHigh: 12,
          investmentAmount: 1000,
          gridSpacing: 'geometric',
        },
      },
      aggressive: {
        level: 'aggressive',
        label: '积极',
        annualizedReturn: 130.2,
        performance: {
          totalReturn: 72.4,
          monthlyReturn: 9.2,
          maxDrawdown: -18.6,
          winRate: 58,
          sharpeRatio: 1.53,
          tradingDays: 90,
        },
        params: {
          gridCount: 50,
          priceRangeLow: -25,
          priceRangeHigh: 25,
          investmentAmount: 2000,
          gridSpacing: 'geometric',
        },
      },
    },
  },

  // ─── 合约网格 ────────────────────────────────────────────────
  {
    id: 'fg-eth-moderate',
    type: 'futures_grid',
    typeLabel: '合约网格',
    name: 'ETH 合约网格',
    tradingPair: 'ETH/USDT',
    exchange: 'Binance',
    description:
      '以以太坊合约为标的，通过杠杆放大网格收益。内置止损机制，建议用户理性评估风险后参与，合约交易有强平风险。',
    tags: ['合约', '杠杆', '以太坊'],
    copyCount: 1876,
    createdAt: '2024-07-20',
    updatedAt: '2024-12-05',
    authorName: 'FuturesQuant',
    riskProfiles: {
      conservative: {
        level: 'conservative',
        label: '保守',
        annualizedReturn: 47.2,
        performance: {
          totalReturn: 24.8,
          monthlyReturn: 3.5,
          maxDrawdown: -7.1,
          winRate: 72,
          sharpeRatio: 1.65,
          tradingDays: 90,
        },
        params: {
          gridCount: 8,
          priceRangeLow: -4,
          priceRangeHigh: 4,
          investmentAmount: 300,
          leverage: 3,
          gridSpacing: 'arithmetic',
        },
      },
      moderate: {
        level: 'moderate',
        label: '稳健',
        annualizedReturn: 98.4,
        performance: {
          totalReturn: 52.1,
          monthlyReturn: 7.2,
          maxDrawdown: -14.5,
          winRate: 63,
          sharpeRatio: 1.89,
          tradingDays: 90,
        },
        params: {
          gridCount: 15,
          priceRangeLow: -10,
          priceRangeHigh: 10,
          investmentAmount: 500,
          leverage: 5,
          gridSpacing: 'geometric',
        },
      },
      aggressive: {
        level: 'aggressive',
        label: '积极',
        annualizedReturn: 218.6,
        performance: {
          totalReturn: 106.3,
          monthlyReturn: 15.8,
          maxDrawdown: -32.4,
          winRate: 54,
          sharpeRatio: 1.21,
          tradingDays: 90,
        },
        params: {
          gridCount: 30,
          priceRangeLow: -20,
          priceRangeHigh: 20,
          investmentAmount: 800,
          leverage: 10,
          gridSpacing: 'geometric',
        },
      },
    },
  },

  // ─── 现货马丁格尔 ─────────────────────────────────────────────
  {
    id: 'sm-bnb-moderate',
    type: 'spot_martingale',
    typeLabel: '现货马丁格尔',
    name: 'BNB 马丁策略',
    tradingPair: 'BNB/USDT',
    exchange: 'Binance',
    description:
      '以币安平台币为标的，价格下跌时递增加仓，价格回升触及止盈后全部平仓。适合对标的长期看涨的用户，需预留足够资金应对多次加仓。',
    tags: ['马丁格尔', '加仓策略', 'BNB'],
    copyCount: 2134,
    createdAt: '2024-05-10',
    updatedAt: '2024-11-28',
    authorName: 'MartinQuant',
    riskProfiles: {
      conservative: {
        level: 'conservative',
        label: '保守',
        annualizedReturn: 22.4,
        performance: {
          totalReturn: 11.8,
          monthlyReturn: 1.6,
          maxDrawdown: -5.8,
          winRate: 82,
          sharpeRatio: 1.94,
          tradingDays: 90,
        },
        params: {
          multiplier: 1.5,
          maxOrderCount: 3,
          initialPositionSize: 100,
          takeProfitRatio: 1.5,
          priceDropTrigger: 2,
        },
      },
      moderate: {
        level: 'moderate',
        label: '稳健',
        annualizedReturn: 48.6,
        performance: {
          totalReturn: 28.4,
          monthlyReturn: 3.2,
          maxDrawdown: -12.4,
          winRate: 71,
          sharpeRatio: 1.72,
          tradingDays: 90,
        },
        params: {
          multiplier: 2,
          maxOrderCount: 5,
          initialPositionSize: 200,
          takeProfitRatio: 2.5,
          priceDropTrigger: 3,
        },
      },
      aggressive: {
        level: 'aggressive',
        label: '积极',
        annualizedReturn: 86.4,
        performance: {
          totalReturn: 54.2,
          monthlyReturn: 5.8,
          maxDrawdown: -24.6,
          winRate: 62,
          sharpeRatio: 1.38,
          tradingDays: 90,
        },
        params: {
          multiplier: 3,
          maxOrderCount: 8,
          initialPositionSize: 300,
          takeProfitRatio: 4,
          priceDropTrigger: 5,
        },
      },
    },
  },

  // ─── 合约马丁格尔 ─────────────────────────────────────────────
  {
    id: 'fm-sol-moderate',
    type: 'futures_martingale',
    typeLabel: '合约马丁格尔',
    name: 'SOL 合约马丁',
    tradingPair: 'SOL/USDT',
    exchange: 'OKX',
    description:
      '以Solana合约为标的的高收益马丁格尔策略。杠杆放大收益的同时显著增加爆仓风险，请务必充分了解合约交易机制再参与，建议仅使用可承受损失的资金。',
    tags: ['合约', '高风险', 'SOL', '马丁格尔'],
    copyCount: 892,
    createdAt: '2024-08-03',
    updatedAt: '2024-12-08',
    authorName: 'AlphaTrader',
    riskProfiles: {
      conservative: {
        level: 'conservative',
        label: '保守',
        annualizedReturn: 52.8,
        performance: {
          totalReturn: 27.6,
          monthlyReturn: 3.8,
          maxDrawdown: -9.2,
          winRate: 74,
          sharpeRatio: 1.71,
          tradingDays: 90,
        },
        params: {
          multiplier: 1.5,
          maxOrderCount: 3,
          initialPositionSize: 100,
          takeProfitRatio: 1.5,
          leverage: 3,
          priceDropTrigger: 2,
        },
      },
      moderate: {
        level: 'moderate',
        label: '稳健',
        annualizedReturn: 112.4,
        performance: {
          totalReturn: 62.8,
          monthlyReturn: 7.6,
          maxDrawdown: -19.8,
          winRate: 65,
          sharpeRatio: 1.58,
          tradingDays: 90,
        },
        params: {
          multiplier: 2,
          maxOrderCount: 5,
          initialPositionSize: 150,
          takeProfitRatio: 3,
          leverage: 5,
          priceDropTrigger: 3.5,
        },
      },
      aggressive: {
        level: 'aggressive',
        label: '积极',
        annualizedReturn: 198.6,
        performance: {
          totalReturn: 98.4,
          monthlyReturn: 14.2,
          maxDrawdown: -38.6,
          winRate: 55,
          sharpeRatio: 1.14,
          tradingDays: 90,
        },
        params: {
          multiplier: 2.5,
          maxOrderCount: 8,
          initialPositionSize: 200,
          takeProfitRatio: 5,
          leverage: 10,
          priceDropTrigger: 5,
        },
      },
    },
  },

  // ─── 信号策略 ─────────────────────────────────────────────────
  {
    id: 'sig-btc-moderate',
    type: 'signal',
    typeLabel: '信号策略',
    name: 'BTC 趋势跟踪',
    tradingPair: 'BTC/USDT',
    exchange: 'Binance',
    description:
      '基于EMA均线交叉与RSI超买超卖信号自动开平仓，结合ATR动态止损。适合趋势行情，震荡市场中信号噪音较多，建议结合市场环境判断是否启用。',
    tags: ['信号策略', '趋势跟踪', 'EMA', 'RSI'],
    copyCount: 4512,
    createdAt: '2024-04-18',
    updatedAt: '2024-12-10',
    authorName: 'SignalPro',
    riskProfiles: {
      conservative: {
        level: 'conservative',
        label: '保守',
        annualizedReturn: 38.4,
        performance: {
          totalReturn: 19.8,
          monthlyReturn: 2.6,
          maxDrawdown: -6.4,
          winRate: 68,
          sharpeRatio: 2.08,
          tradingDays: 90,
        },
        params: {
          signalSensitivity: 'low',
          takeProfitRatio: 3,
          stopLossRatio: 1.5,
          positionSize: 200,
          maxOpenOrders: 1,
          confirmationBars: 3,
        },
      },
      moderate: {
        level: 'moderate',
        label: '稳健',
        annualizedReturn: 72.8,
        performance: {
          totalReturn: 42.4,
          monthlyReturn: 5.4,
          maxDrawdown: -11.2,
          winRate: 61,
          sharpeRatio: 1.96,
          tradingDays: 90,
        },
        params: {
          signalSensitivity: 'medium',
          takeProfitRatio: 5,
          stopLossRatio: 2.5,
          positionSize: 400,
          maxOpenOrders: 2,
          confirmationBars: 2,
        },
      },
      aggressive: {
        level: 'aggressive',
        label: '积极',
        annualizedReturn: 148.2,
        performance: {
          totalReturn: 84.6,
          monthlyReturn: 10.8,
          maxDrawdown: -22.4,
          winRate: 52,
          sharpeRatio: 1.44,
          tradingDays: 90,
        },
        params: {
          signalSensitivity: 'high',
          takeProfitRatio: 10,
          stopLossRatio: 4,
          positionSize: 600,
          maxOpenOrders: 3,
          confirmationBars: 1,
        },
      },
    },
  },
]
