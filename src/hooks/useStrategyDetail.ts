import { useState } from 'react'
import type { Strategy, RiskLevel } from '@/types/strategy'

export function useStrategyDetail() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('moderate')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openDetail = (strategy: Strategy, risk: RiskLevel = 'moderate') => {
    setSelectedStrategy(strategy)
    setSelectedRisk(risk)
    setIsModalOpen(true)
  }

  const closeDetail = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedStrategy(null), 300)
  }

  const setRisk = (level: RiskLevel) => setSelectedRisk(level)

  return {
    selectedStrategy,
    selectedRisk,
    isModalOpen,
    openDetail,
    closeDetail,
    setRisk,
  }
}
