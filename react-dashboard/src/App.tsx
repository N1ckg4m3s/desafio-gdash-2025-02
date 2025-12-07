import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import LoginPage from './pages/login/page'
import DashboardPage from './pages/dashboard/page'
import { Toaster } from 'sonner'
import { UserPage } from './pages/users/page'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </>
  )
}

export default App
