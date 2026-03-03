import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending, getTopRated, getDiscover, IMG_BASE } from '../api/tmdb';
import { getReviews } from '../api/mockapi';
import MovieCard from '../components/MovieCard';
import StarRating from '../components/StarRating';
import Footer from '../components/Footer';

/* ─── Genre map (TMDB IDs → labels) ─── */
const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western',
};

/* ─── Category definitions ─── */
const CATEGORIES = [
    { id: 'trending', title: 'Trending This Week', fetcher: () => getTrending() },
    { id: 'top_rated', title: 'Top Rated', fetcher: () => getTopRated() },
    { id: 'action', title: 'Action', fetcher: () => getDiscover({ with_genres: 28 }) },
    { id: 'horror', title: 'Horror', fetcher: () => getDiscover({ with_genres: 27 }) },
    { id: 'scifi', title: 'Sci-Fi', fetcher: () => getDiscover({ with_genres: 878 }) },
    { id: 'comedy', title: 'Comedy', fetcher: () => getDiscover({ with_genres: 35 }) },
];

/* ════════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════════ */

function HeroSection({ movies }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();
    const timerRef = useRef(null);

    const heroMovies = movies.slice(0, 5);

    function resetTimer() {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % heroMovies.length);
        }, 5000);
    }

    // Auto-rotate every 5s
    useEffect(() => {
        if (heroMovies.length === 0) return;
        resetTimer();
        return () => clearInterval(timerRef.current);
    }, [heroMovies.length]);

    function goToSlide(idx) {
        setActiveIdx(idx);
        resetTimer();
    }

    function goLeft() {
        setActiveIdx((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
        resetTimer();
    }

    function goRight() {
        setActiveIdx((prev) => (prev + 1) % heroMovies.length);
        resetTimer();
    }

    if (heroMovies.length === 0) {
        return <div className="hero" />;
    }

    return (
        <section
            className="hero"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {heroMovies.map((movie, idx) => {
                const genres = (movie.genre_ids || [])
                    .slice(0, 3)
                    .map((id) => GENRE_MAP[id])
                    .filter(Boolean);

                return (
                    <div
                        key={movie.id}
                        className={`hero-slide ${idx === activeIdx ? 'active' : ''}`}
                    >
                        <div
                            className="hero-backdrop"
                            style={{
                                backgroundImage: movie.backdrop_path
                                    ? `url(${IMG_BASE}/original${movie.backdrop_path})`
                                    : 'none',
                            }}
                        />
                        <div className="hero-overlay" />
                        <div className="hero-grain" />

                        {idx === activeIdx && (
                            <div className="hero-content">
                                <h1 className="hero-title">{movie.title}</h1>

                                {genres.length > 0 && (
                                    <div className="hero-genres">
                                        {genres.map((g) => (
                                            <span key={g} className="hero-genre-tag">
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {movie.vote_average > 0 && (
                                    <div className="hero-rating">
                                        ★ {movie.vote_average.toFixed(1)}
                                    </div>
                                )}

                                {movie.overview && (
                                    <p className="hero-overview">{movie.overview}</p>
                                )}

                                <button
                                    className="hero-cta"
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                >
                                    ▶ VIEW FILM
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Arrow navigation */}
            <button
                className="hero-arrow hero-arrow-left"
                style={{ opacity: hovered ? 1 : 0 }}
                onClick={goLeft}
                aria-label="Previous slide"
            >
                ‹
            </button>
            <button
                className="hero-arrow hero-arrow-right"
                style={{ opacity: hovered ? 1 : 0 }}
                onClick={goRight}
                aria-label="Next slide"
            >
                ›
            </button>

            {/* Pagination dots */}
            <div className="hero-dots">
                {heroMovies.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === activeIdx ? 'active' : ''}`}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════
   CATEGORY ROW
   ════════════════════════════════════════════ */

function CategoryRow({ title, fetcher }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetcher()
            .then((data) => setMovies(data.results || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    function scroll(direction) {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.offsetWidth * 0.7;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    }

    return (
        <div className="category-row">
            <div className="category-header">
                <h2 className="category-title">{title}</h2>
                <div className="category-arrows">
                    <button
                        className="category-arrow"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>
                    <button
                        className="category-arrow"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="category-scroll" ref={scrollRef}>
                {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="category-skeleton" />
                    ))
                    : movies.map((movie) => (
                        <div key={movie.id} className="category-scroll-item">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   COMMUNITY ACTIVITY
   ════════════════════════════════════════════ */

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ];
    for (const { label, seconds: s } of intervals) {
        const count = Math.floor(seconds / s);
        if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
}

function CommunityActivity() {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getReviews()
            .then((data) => {
                const sorted = (data || [])
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6);
                setActivity(sorted);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading || activity.length === 0) return null;

    return (
        <div
            className="community-section"
            style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '48px 32px 56px',
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 28,
            }}>
                <h2 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28,
                    fontWeight: 400,
                    letterSpacing: 3,
                    color: '#fff',
                    margin: 0,
                }}>
                    💬 Community Activity
                </h2>
                <span className="community-label" style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                }}>
                    Recent reviews
                </span>
            </div>

            <div className="community-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
            }}>
                {activity.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            background: '#0e0e0e',
                            border: '1px solid #1a1a1a',
                            borderRadius: 14,
                            padding: 20,
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, transform 0.2s',
                        }}
                        onClick={() => navigate(`/movie/${r.movieId}`)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#FFB80044';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#1a1a1a';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', gap: 14 }}>
                            {r.posterPath && (
                                <img
                                    src={`${IMG_BASE}/w92${r.posterPath}`}
                                    alt={r.movieTitle}
                                    style={{
                                        width: 48,
                                        height: 72,
                                        borderRadius: 8,
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #FFB800, #e09500)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: '#050505',
                                            fontFamily: "'Inter', sans-serif",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {(r.username || '?')[0].toUpperCase()}
                                    </div>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#fff',
                                    }}>
                                        {r.username}
                                    </span>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 11,
                                        color: '#444',
                                    }}>
                                        {timeAgo(r.createdAt)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: '#888',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        reviewed <span style={{ color: '#FFB800' }}>{r.movieTitle}</span>
                                    </span>
                                    <StarRating value={r.rating} readOnly size={13} />
                                </div>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 13,
                                    fontWeight: 400,
                                    color: '#777',
                                    lineHeight: 1.5,
                                    margin: 0,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}>
                                    {r.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════ */

export default function HomePage() {
    const [heroMovies, setHeroMovies] = useState([]);

    useEffect(() => {
        getTrending(1)
            .then((data) => setHeroMovies(data.results || []))
            .catch(console.error);
    }, []);

    return (
        <div style={{ background: '#050505', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Hero */}
            <HeroSection movies={heroMovies} />

            {/* Category rows */}
            <div className="categories-section">
                {CATEGORIES.map((cat) => (
                    <CategoryRow
                        key={cat.id}
                        title={cat.title}
                        fetcher={cat.fetcher}
                    />
                ))}
            </div>

            {/* Community Activity */}
            <CommunityActivity />

            {/* Footer */}
            <Footer />
        </div>
    );
}
