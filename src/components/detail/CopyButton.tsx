import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  strategyName: string
}

export function CopyButton({ strategyName }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
      style={{
        backgroundColor: copied ? '#0ecb81' : '#f0b90b',
        color: '#0b0e11',
      }}
      title={`复制策略: ${strategyName}`}
    >
      {copied ? (
        <>
          <Check size={16} />
          已加入跟单
        </>
      ) : (
        <>
          <Copy size={16} />
          复制策略
        </>
      )}
    </button>
  )
}
