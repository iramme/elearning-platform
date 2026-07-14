import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, BookOpen, Award, Grid3x3, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = isInstructor ? '/instructor/dashboard' : '/dashboard';
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/courses', label: 'Catalogue', icon: Grid3x3, color: 'text-primary-500', show: true },
    { to: dashboardPath, label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', show: isAuthenticated },
    { to: '/my-courses', label: 'Mes cours', icon: BookOpen, color: 'text-secondary-500', show: isStudent },
    { to: '/my-certificates', label: 'Certificats', icon: Award, color: 'text-pink-500', show: isStudent },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.35)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-dark tracking-tight">EduSpark</span>
          </Link>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter((l) => l.show).map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-full transition-all ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.color}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary-50 to-secondary-50 pl-1.5 pr-4 py-1.5 rounded-full border border-primary-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-primary-700">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {/* Mobile menu toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-full transition"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-4 py-2 transition">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && isAuthenticated && (
          <div className="md:hidden flex flex-col gap-1 pb-4 border-t border-gray-100 pt-3">
            {navLinks.filter((l) => l.show).map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium px-3.5 py-2.5 rounded-xl transition ${
                    active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.color}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}