import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{ backgroundColor: '#1a1d23', borderColor: '#2b3139' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(240,185,11,0.15)' }}
            >
              <Zap size={14} style={{ color: '#f0b90b' }} />
            </div>
            <span className="text-lg font-bold" style={{ color: '#eaecef' }}>
              Mix<span style={{ color: '#f0b90b' }}>Shall</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {['使用条款', '隐私政策', '风险提示', '帮助中心', '联系我们'].map(link => (
              <button
                key={link}
                className="text-sm transition-colors"
                style={{ color: '#848e9c' }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t text-center text-xs"
          style={{ borderColor: '#2b3139', color: '#848e9c' }}
        >
          <p className="mb-1">
            ⚠️ 风险提示：加密货币交易存在重大风险，策略历史收益不代表未来表现。投资需谨慎，请勿投入超过自身承受能力的资金。
          </p>
          <p>© 2024 MixShall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
