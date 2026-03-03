import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Keyframes injected once ── */
const KEYFRAMES_ID = 'navbar-mobile-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
    const style = document.createElement('style');
    style.id = KEYFRAMES_ID;
    style.textContent = `
        @keyframes navDrawerIn {
            from { opacity: 0; transform: translateY(-12px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navDrawerOut {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(-12px); }
        }
    `;
    document.head.appendChild(style);
}

/* ── Styles ── */
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
    zIndex: 102,
};

/* Desktop links */
const desktopLinks = {
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

/* Hamburger button */
const hamburgerBtn = {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: 40,
    height: 40,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 102,
    padding: 6,
};

const barStyle = (isOpen, index) => ({
    width: 24,
    height: 2,
    background: isOpen ? '#FFB800' : '#fff',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    transformOrigin: 'center',
    ...(isOpen && index === 0 ? { transform: 'translateY(7px) rotate(45deg)' } : {}),
    ...(isOpen && index === 1 ? { opacity: 0, transform: 'scaleX(0)' } : {}),
    ...(isOpen && index === 2 ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}),
});

/* Mobile drawer */
const drawerOverlay = (isOpen) => ({
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 99,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
});

const drawerStyle = (isOpen) => ({
    position: 'fixed',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 101,
    background: 'rgba(10,10,10,0.97)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #1e1e1e',
    padding: '24px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    animation: isOpen ? 'navDrawerIn 0.25s ease forwards' : 'navDrawerOut 0.2s ease forwards',
    pointerEvents: isOpen ? 'auto' : 'none',
});

const mobileLinkStyle = (isActive) => ({
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: isActive ? '#FFB800' : '#fff',
    textDecoration: 'none',
    padding: '16px 0',
    borderBottom: '1px solid #1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'color 0.2s',
});

const mobileSignOut = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#fff',
    background: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: '14px 0',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: 20,
    width: '100%',
    textAlign: 'center',
};

const MOBILE_BP = 768;

export default function Navbar() {
    const { logout } = useAuth();
    const { pathname } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BP : false
    );

    const isHome = pathname === '/' || (!pathname.startsWith('/search') && !pathname.startsWith('/profile') && !pathname.startsWith('/login') && !pathname.startsWith('/movie'));

    const links = [
        { to: '/', label: 'Home' },
        { to: '/search', label: 'Search' },
        { to: '/profile', label: 'Profile' },
    ];

    // Listen for resize
    useEffect(() => {
        function handleResize() {
            const mobile = window.innerWidth <= MOBILE_BP;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(false);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close drawer on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    function isActive(to) {
        return to === '/'
            ? pathname === '/' || (!pathname.startsWith('/search') && !pathname.startsWith('/profile') && !pathname.startsWith('/login'))
            : pathname.startsWith(to);
    }

    return (
        <>
            <nav
                className="cinelog-nav"
                style={isHome && !isOpen ? navTransparent : navDefault}
            >
                <Link to="/" className="cinelog-nav-logo" style={logoStyle}>
                    CINELOG
                </Link>

                {/* Desktop links */}
                <div className="cinelog-nav-desktop" style={desktopLinks}>
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            style={isActive(to) ? linkActive : linkBase}
                            onMouseEnter={(e) => { if (!isActive(to)) e.target.style.color = '#FFB800'; }}
                            onMouseLeave={(e) => { if (!isActive(to)) e.target.style.color = '#fff'; }}
                        >
                            {label}
                        </Link>
                    ))}
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

                {/* Hamburger (mobile only) */}
                <button
                    className="cinelog-nav-hamburger"
                    style={hamburgerBtn}
                    onClick={() => setIsOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    <span style={barStyle(isOpen, 0)} />
                    <span style={barStyle(isOpen, 1)} />
                    <span style={barStyle(isOpen, 2)} />
                </button>
            </nav>

            {/* Mobile drawer */}
            {isMobile && (
                <>
                    <div
                        style={drawerOverlay(isOpen)}
                        onClick={() => setIsOpen(false)}
                    />
                    {isOpen && (
                        <div style={drawerStyle(isOpen)}>
                            {links.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    style={mobileLinkStyle(isActive(to))}
                                    onMouseEnter={(e) => { if (!isActive(to)) e.target.style.color = '#FFB800'; }}
                                    onMouseLeave={(e) => { if (!isActive(to)) e.target.style.color = isActive(to) ? '#FFB800' : '#fff'; }}
                                >
                                    {label}
                                    <span style={{ fontSize: 18, color: '#333' }}>›</span>
                                </Link>
                            ))}
                            <button
                                style={mobileSignOut}
                                onClick={logout}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#FFB800';
                                    e.target.style.borderColor = '#FFB800';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#fff';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
