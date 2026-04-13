import { useState, useMemo } from 'react'
import { STRATEGIES } from '@/data/strategies'
import type { Strategy, StrategyType } from '@/types/strategy'

type SortKey = 'monthly_return' | 'copy_count' | 'win_rate'

interface FilterState {
  activeType: StrategyType | 'all'
  searchQuery: string
  sortBy: SortKey
}

export function useStrategyFilter() {
  const [filters, setFilters] = useState<FilterState>({
    activeType: 'all',
    searchQuery: '',
    sortBy: 'copy_count',
  })

  const filteredStrategies = useMemo<Strategy[]>(() => {
    let result = [...STRATEGIES]

    if (filters.activeType !== 'all') {
      result = result.filter(s => s.type === filters.activeType)
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.tradingPair.toLowerCase().includes(q) ||
          s.typeLabel.includes(q) ||
          s.tags.some(t => t.includes(q)),
      )
    }

    result.sort((a, b) => {
      const aProfile = a.riskProfiles.moderate
      const bProfile = b.riskProfiles.moderate
      switch (filters.sortBy) {
        case 'monthly_return':
          return bProfile.performance.monthlyReturn - aProfile.performance.monthlyReturn
        case 'copy_count':
          return b.copyCount - a.copyCount
        case 'win_rate':
          return bProfile.performance.winRate - aProfile.performance.winRate
        default:
          return 0
      }
    })

    return result
  }, [filters])

  const setActiveType = (type: StrategyType | 'all') =>
    setFilters(f => ({ ...f, activeType: type }))
  const setSearchQuery = (q: string) => setFilters(f => ({ ...f, searchQuery: q }))
  const setSortBy = (s: SortKey) => setFilters(f => ({ ...f, sortBy: s }))

  return {
    filters,
    filteredStrategies,
    setActiveType,
    setSearchQuery,
    setSortBy,
  }
}
