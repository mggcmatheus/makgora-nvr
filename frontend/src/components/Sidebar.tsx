/**
 * Componente de menu lateral
 */
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Makgora NVR</h2>
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📺</span>
          <span className="nav-text">Painel</span>
        </Link>
        
        <Link 
          to="/cameras" 
          className={`nav-item ${isActive('/cameras') || isActive('/') ? 'active' : ''}`}
        >
          <span className="nav-icon">🎥</span>
          <span className="nav-text">Câmeras</span>
        </Link>
      </nav>
    </div>
  );
}

