import { Link } from 'react-router-dom';

const footerStyle = {
    background: '#0a0a0a',
    borderTop: '1px solid #FFB800',
    padding: '28px 64px 0',
    fontFamily: "'Inter', sans-serif",
};

const topRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 32,
    paddingBottom: 24,
};

const brandLogo = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    fontWeight: 400,
    letterSpacing: 3,
    color: '#FFB800',
    lineHeight: 1,
    marginBottom: 4,
};

const brandTagline = {
    fontSize: 12,
    fontWeight: 400,
    color: '#FFB800',
    letterSpacing: 0.5,
    opacity: 0.6,
};

const linksCol = {
    display: 'flex',
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
};

const linkStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: '#888',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: 2,
    transition: 'color 0.2s',
};

const tmdbCol = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
};

const tmdbText = {
    fontSize: 11,
    fontWeight: 400,
    color: '#555',
    letterSpacing: 0.5,
};

const tmdbLogo = {
    height: 14,
    opacity: 0.7,
    transition: 'opacity 0.2s',
};

const bottomBar = {
    borderTop: '1px solid #1a1a1a',
    padding: '14px 0',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 300,
    color: '#333',
    letterSpacing: 0.5,
};

export default function Footer() {
    return (
        <footer className="cinelog-footer" style={footerStyle}>
            <div className="cinelog-footer-top" style={topRow}>
                {/* Left — Brand */}
                <div>
                    <div style={brandLogo}>CINELOG</div>
                    <div style={brandTagline}>Your personal movie journal</div>
                </div>

                {/* Center — Navigation */}
                <div className="cinelog-footer-links" style={linksCol}>
                    {[
                        { to: '/', label: 'Home' },
                        { to: '/search', label: 'Search' },
                        { to: '/profile', label: 'Profile' },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            style={linkStyle}
                            onMouseEnter={(e) => (e.target.style.color = '#FFB800')}
                            onMouseLeave={(e) => (e.target.style.color = '#888')}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Right — TMDB */}
                <div className="cinelog-footer-tmdb" style={tmdbCol}>
                    <span style={tmdbText}>Powered by</span>
                    <a
                        href="https://www.themoviedb.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                            alt="TMDB"
                            style={tmdbLogo}
                            onMouseEnter={(e) => (e.target.style.opacity = '1')}
                            onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
                        />
                    </a>
                </div>
            </div>

            <div style={bottomBar}>
                © 2025 Cinelog. All rights reserved.
            </div>
        </footer>
    );
}
