import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending, getTopRated, getDiscover, IMG_BASE } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

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
        <div style={{ background: '#050505', minHeight: '100vh' }}>
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
        </div>
    );
}
