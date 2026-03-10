import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layout/AppLayout'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import BorrowPage from './pages/borrow/BorrowPage'
import BooksPage from './pages/books/BooksPage'
import Dashboard from './pages/dashboard/Dashboard'
import MembersPage from './pages/members/MembersPage'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/profile/ProfilePage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/borrow" element={<BorrowPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
