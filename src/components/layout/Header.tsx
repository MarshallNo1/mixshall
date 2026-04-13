import { Zap, Menu } from 'lucide-react'

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(26, 29, 35, 0.95)',
        borderColor: '#2b3139',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(240,185,11,0.15)' }}
            >
              <Zap size={16} style={{ color: '#f0b90b' }} />
            </div>
            <span className="text-xl font-bold" style={{ color: '#eaecef' }}>
              Mix<span style={{ color: '#f0b90b' }}>Shall</span>
            </span>
          </div>

          {/* Nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {['策略广场', '我的策略', '跟单记录', '排行榜'].map((item, i) => (
              <button
                key={item}
                className="text-sm font-medium transition-colors"
                style={{ color: i === 0 ? '#f0b90b' : '#848e9c' }}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-all"
              style={{
                border: '1px solid #f0b90b',
                color: '#f0b90b',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                ;(e.target as HTMLElement).style.backgroundColor = '#f0b90b'
                ;(e.target as HTMLElement).style.color = '#0b0e11'
              }}
              onMouseLeave={e => {
                ;(e.target as HTMLElement).style.backgroundColor = 'transparent'
                ;(e.target as HTMLElement).style.color = '#f0b90b'
              }}
            >
              连接钱包
            </button>
            <button className="md:hidden p-2 rounded-lg" style={{ color: '#848e9c' }}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
