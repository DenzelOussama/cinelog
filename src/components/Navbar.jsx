import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    background: 'rgba(5,5,5,0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 100,
    borderBottom: '1px solid #1a1a1a',
};

const logoStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 32,
    fontWeight: 400,
    letterSpacing: 4,
    color: '#FFB800',
    textDecoration: 'none',
};

const linksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
};

const linkBase = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#888',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'color 0.2s, background 0.2s, border-color 0.2s',
    borderBottom: '2px solid transparent',
};

const linkActive = {
    ...linkBase,
    color: '#fff',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderBottom: '2px solid #FFB800',
};

const signOutBtn = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#666',
    background: 'none',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'color 0.2s, border-color 0.2s',
    marginLeft: 8,
};

export default function Navbar() {
    const { logout } = useAuth();
    const { pathname } = useLocation();

    const links = [
        { to: '/', label: 'Home' },
        { to: '/search', label: 'Search' },
        { to: '/profile', label: 'Profile' },
    ];

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>
                CINELOG
            </Link>
            <div style={linksStyle}>
                {links.map(({ to, label }) => {
                    const isActive =
                        to === '/'
                            ? pathname === '/' || (!pathname.startsWith('/search') && !pathname.startsWith('/profile') && !pathname.startsWith('/login'))
                            : pathname.startsWith(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            style={isActive ? linkActive : linkBase}
                        >
                            {label}
                        </Link>
                    );
                })}
                <button
                    style={signOutBtn}
                    onClick={logout}
                    onMouseEnter={(e) => {
                        e.target.style.color = '#e85454';
                        e.target.style.borderColor = '#e85454';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = '#666';
                        e.target.style.borderColor = '#2a2a2a';
                    }}
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}
