import FinancialDataViewer from '@/components/financial-data-viewer'
import FinancialMetricsCalculator from '@/components/financial-metrics-calculator'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <FinancialMetricsCalculator />
      <FinancialDataViewer/>
    </main>
  )
}

