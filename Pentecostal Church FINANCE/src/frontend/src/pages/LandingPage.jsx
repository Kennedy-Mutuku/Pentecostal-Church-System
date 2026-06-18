import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleLoginStatus = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing">
      <nav className="landing-nav-official">
        <div className="landing-nav-official-brand">
          <img src="/rpc-logo.png" alt="RPC Logo" className="landing-nav-official-logo" />
          <div className="landing-nav-official-text">
            <h1 className="landing-nav-official-title">Rikuruma Pentecostal Church</h1>
            <p className="landing-nav-official-motto">
              <span className="line">&mdash;&mdash;</span>
              Transforming Campus, Impacting nations
              <span className="line">&mdash;&mdash;</span>
            </p>
          </div>
        </div>
        <button onClick={handleLoginStatus} className="landing-login-btn-outline">
          {token ? 'Go to Dashboard' : 'Login'}
        </button>
      </nav>

      <section className="landing-hero">
        <img src="/rpc-logo.png" alt="RPC Logo" className="hero-logo" />
        <h1>CU Finance System</h1>
        <p>A secure portal for managing KSU Christian Union financial records, requisitions, and reports.</p>
        <button onClick={handleLoginStatus} className="landing-cta">
          {token ? 'Access Portal' : 'Administrator Login'}
        </button>
      </section>

      <footer className="landing-footer">
        <p>KSU Christian Union &copy; {new Date().getFullYear()} | Professional Financial Management</p>
      </footer>
    </div>
  );
}
