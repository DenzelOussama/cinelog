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
    background: 'rgba(8,8,9,0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 100,
    borderBottom: '1px solid #1a1a22',
};

const logoStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    fontStyle: 'italic',
    color: '#e9a840',
    textDecoration: 'none',
};

const linksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
};

const linkBase = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
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
    borderBottom: '2px solid #e9a840',
};

const signOutBtn = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: '#666',
    background: 'none',
    border: '1px solid #26262f',
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
                cinelog
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
                        e.target.style.borderColor = '#26262f';
                    }}
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}
