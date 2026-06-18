import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const handleLogin = () => {
    navigate(token ? '/dashboard' : '/login')
  }

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <img src="/rpc-logo.png" alt="RPC" className="landing-nav-logo" />
          <span className="landing-logo">CU Finance</span>
        </div>
        <button onClick={handleLogin} className="landing-login-btn">
          {token ? 'Dashboard' : 'Login'}
        </button>
      </nav>

      <section className="landing-hero">
        <img src="/rpc-logo.png" alt="RPC Logo" className="hero-logo" />
        <h1>CU Finance</h1>
        <p>Financial management for KSU Christian Union.</p>
        <button onClick={handleLogin} className="landing-cta">
          {token ? 'Go to Dashboard' : 'Login'}
        </button>
      </section>

      <footer className="landing-footer">
        <p>KSU Christian Union &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
