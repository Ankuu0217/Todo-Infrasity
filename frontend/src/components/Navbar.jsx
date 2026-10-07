import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="global-nav">
      <div className="global-nav__brand">
        <div className="global-nav__brand-icon">N</div>
        Notes
      </div>

      {user && (
        <div className="global-nav__actions">
          <span className="global-nav__user">{user.name}</span>
          <button className="btn btn--secondary" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
