
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminRegister from './pages/AdminRegister'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import TreasurerPortal from './pages/TreasurerPortal'
import NotFound from './pages/NotFound'
import Transactions from './pages/Transactions'
import TransactionForm from './pages/TransactionForm'
import Requisitions from './pages/Requisitions'
import RequisitionForm from './pages/RequisitionForm'
import Assets from './pages/Assets'
import AssetForm from './pages/AssetForm'
import Reports from './pages/Reports'
import AuditLogs from './pages/AuditLogs'
import UserManagement from './pages/UserManagement'
import MpesaPayment from './pages/MpesaPayment'
import AuditorDashboard from './pages/AuditorDashboard'
import SharedLayout from './components/layout/SharedLayout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes inside SharedLayout */}
        <Route
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin routes */}
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />

          {/* Phase 2: Cash Management */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/new" element={<TransactionForm />} />

          {/* Phase 3: Requisitions & Assets */}
          <Route path="/requisitions" element={<Requisitions />} />
          <Route path="/requisitions/new" element={<RequisitionForm />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/new" element={<AssetForm />} />

          {/* Phase 4: Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Phase 5: M-Pesa */}
          <Route path="/mpesa" element={<MpesaPayment />} />

          {/* Phase 5: Audit & Transparency */}
          <Route path="/auditor" element={<AuditorDashboard />} />
        </Route>

        {/* Dedicated portals */}
        <Route path="/treasurer-portal" element={<TreasurerPortal />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
