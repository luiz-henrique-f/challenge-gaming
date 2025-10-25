import { Header } from '@/components/global/header'
import LandingPage from '@/landing-page/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Header />
      <LandingPage />
    </div>
  )
}
