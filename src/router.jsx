import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Diary from './pages/Diary'
import DiaryNew from './pages/DiaryNew'
import DiaryDetail from './pages/DiaryDetail'
import Letters from './pages/Letters'
import LetterNew from './pages/LetterNew'
import LetterDetail from './pages/LetterDetail'
import Vault from './pages/Vault'
import Checkin from './pages/Checkin'
import Timeline from './pages/Timeline'
import Settings from './pages/Settings'
import Hidden from './pages/Hidden'

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>

const router = createBrowserRouter([
  { path: '/login',        element: <Login /> },
  { path: '/',             element: protect(<Home />) },
  { path: '/diary',        element: protect(<Diary />) },
  { path: '/diary/new',    element: protect(<DiaryNew />) },
  { path: '/diary/:id',    element: protect(<DiaryDetail />) },
  { path: '/letters',      element: protect(<Letters />) },
  { path: '/letters/new',  element: protect(<LetterNew />) },
  { path: '/letters/:id',  element: protect(<LetterDetail />) },
  { path: '/vault',        element: protect(<Vault />) },
  { path: '/checkin',      element: protect(<Checkin />) },
  { path: '/timeline',     element: protect(<Timeline />) },
  { path: '/settings',     element: protect(<Settings />) },
  { path: '/s/:slug',      element: protect(<Hidden />) },
])

export default router