import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navBase = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    zIndex: 100,
    transition: 'background 0.3s, border-color 0.3s',
};

const navDefault = {
    ...navBase,
    background: 'rgba(5,5,5,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1a1a1a',
};

const navTransparent = {
    ...navBase,
    background: 'transparent',
    backdropFilter: 'none',
    borderBottom: '1px solid transparent',
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
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: 0,
    background: 'none',
    border: 'none',
    transition: 'color 0.2s',
};

const linkActive = {
    ...linkBase,
    color: '#FFB800',
};

const signOutBtn = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#fff',
    background: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'color 0.2s, border-color 0.2s',
    marginLeft: 8,
};

export default function Navbar() {
    const { logout } = useAuth();
    const { pathname } = useLocation();

    const isHome = pathname === '/' || (!pathname.startsWith('/search') && !pathname.startsWith('/profile') && !pathname.startsWith('/login') && !pathname.startsWith('/movie'));

    const links = [
        { to: '/', label: 'Home' },
        { to: '/search', label: 'Search' },
        { to: '/profile', label: 'Profile' },
    ];

    return (
        <nav style={isHome ? navTransparent : navDefault}>
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
                            onMouseEnter={(e) => { if (!isActive) e.target.style.color = '#FFB800'; }}
                            onMouseLeave={(e) => { if (!isActive) e.target.style.color = '#fff'; }}
                        >
                            {label}
                        </Link>
                    );
                })}
                <button
                    style={signOutBtn}
                    onClick={logout}
                    onMouseEnter={(e) => {
                        e.target.style.color = '#FFB800';
                        e.target.style.borderColor = '#FFB800';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = '#fff';
                        e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                    }}
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}
