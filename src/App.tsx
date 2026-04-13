import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MarketplacePage } from '@/components/marketplace/MarketplacePage'

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0e11' }}>
      <Header />
      <MarketplacePage />
      <Footer />
    </div>
  )
}

export default App
