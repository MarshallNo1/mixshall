import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useStrategyFilter } from '@/hooks/useStrategyFilter'
import { useStrategyDetail } from '@/hooks/useStrategyDetail'
import { StrategyDetailModal } from '@/components/detail/StrategyDetailModal'
import { StatsBar } from './StatsBar'
import { CategoryTabs } from './CategoryTabs'
import { StrategyGrid } from './StrategyGrid'
import type { Strategy, RiskLevel } from '@/types/strategy'

const SORT_OPTIONS = [
  { value: 'copy_count' as const, label: '跟单人数' },
  { value: 'monthly_return' as const, label: '月均收益' },
  { value: 'win_rate' as const, label: '胜率' },
]

export function MarketplacePage() {
  const { filters, filteredStrategies, setActiveType, setSearchQuery, setSortBy } =
    useStrategyFilter()
  const { selectedStrategy, selectedRisk, isModalOpen, openDetail, closeDetail, setRisk } =
    useStrategyDetail()

  const [cardRiskLevels, setCardRiskLevels] = useState<Record<string, RiskLevel>>({})

  const handleRiskChange = (id: string, level: RiskLevel) => {
    setCardRiskLevels(prev => ({ ...prev, [id]: level }))
  }

  const handleViewDetail = (strategy: Strategy, risk: RiskLevel) => {
    openDetail(strategy, risk)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#eaecef' }}>
          策略交易广场
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: '#848e9c' }}>
          精选量化交易策略，一键复制，智能跟单。选择适合你的风险偏好，开启自动化交易之旅。
        </p>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Category tabs */}
      <CategoryTabs active={filters.activeType} onChange={setActiveType} />

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#848e9c' }}
          />
          <input
            type="text"
            placeholder="搜索策略名称、交易对..."
            value={filters.searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: '#1e2329',
              border: '1px solid #2b3139',
              color: '#eaecef',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(240,185,11,0.5)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#2b3139'
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} style={{ color: '#848e9c' }} className="flex-shrink-0" />
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                style={{
                  color: filters.sortBy === opt.value ? '#f0b90b' : '#848e9c',
                  backgroundColor:
                    filters.sortBy === opt.value ? 'rgba(240,185,11,0.1)' : 'transparent',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs mb-4" style={{ color: '#848e9c' }}>
        共找到{' '}
        <span style={{ color: '#f0b90b' }}>{filteredStrategies.length}</span> 个策略
      </div>

      {/* Strategy grid */}
      <StrategyGrid
        strategies={filteredStrategies}
        riskLevels={cardRiskLevels}
        onRiskChange={handleRiskChange}
        onViewDetail={handleViewDetail}
      />

      {/* Detail modal */}
      <StrategyDetailModal
        strategy={selectedStrategy}
        risk={selectedRisk}
        isOpen={isModalOpen}
        onClose={closeDetail}
        onRiskChange={setRisk}
      />
    </main>
  )
}
