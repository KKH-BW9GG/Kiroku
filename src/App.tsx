import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewEntryPage from './pages/NewEntryPage'
import FriendsPage from './pages/FriendsPage'
import FriendDetailPage from './pages/FriendDetailPage'
import StatsPage from './pages/StatsPage'
import CalendarPage from './pages/CalendarPage'
import OnboardingPage from './pages/OnboardingPage'
import BottomNav from './components/BottomNav'
import { ONBOARDED_KEY } from './store/useStore'

const HIDE_NAV = ['/new', '/edit', '/onboarding']

function Layout() {
  const { pathname } = useLocation()
  const hideNav = HIDE_NAV.some((p) => pathname.startsWith(p))
  const onboarded = localStorage.getItem(ONBOARDED_KEY)

  if (!onboarded && pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewEntryPage />} />
        <Route path="/edit/:id" element={<NewEntryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friends/:id" element={<FriendDetailPage />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
