import { useEffect, useState, useRef, useCallback } from 'react';
import { getTrending } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const MAX_PAGE = 20;

const pageStyle = {
    padding: '96px 32px 48px',
    maxWidth: 1200,
    margin: '0 auto',
};

const headerStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
};

const subStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#666',
    marginBottom: 36,
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 24,
};

const skeletonCard = {
    borderRadius: 12,
    background: '#17171c',
    aspectRatio: '2/3',
    animation: 'pulse 1.5s ease-in-out infinite',
};

const loaderWrap = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: '32px 0 16px',
};

const dotStyle = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#e9a840',
    animation: 'pulse 1s ease-in-out infinite',
};

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef(null);

    // Fetch page 1 on mount
    useEffect(() => {
        getTrending(1)
            .then((data) => {
                setMovies(data.results || []);
                if (!data.results || data.results.length === 0) setHasMore(false);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Fetch subsequent pages when `page` changes (skip page 1, already loaded)
    useEffect(() => {
        if (page === 1) return;
        setLoadingMore(true);
        getTrending(page)
            .then((data) => {
                const results = data.results || [];
                setMovies((prev) => [...prev, ...results]);
                if (results.length === 0 || page >= MAX_PAGE) setHasMore(false);
            })
            .catch(console.error)
            .finally(() => setLoadingMore(false));
    }, [page]);

    // Sentinel ref callback — sets up IntersectionObserver
    const sentinelRef = useCallback(
        (node) => {
            if (loadingMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !loadingMore) {
                        setPage((prev) => prev + 1);
                    }
                },
                { rootMargin: '200px' }
            );

            if (node) observer.current.observe(node);
        },
        [loadingMore, hasMore]
    );

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Trending This Week</h1>
            <p style={subStyle}>What everyone is watching right now</p>

            <div style={gridStyle}>
                {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} style={skeletonCard} />
                    ))
                    : movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
            </div>

            {/* Sentinel div observed for infinite scroll */}
            {!loading && hasMore && (
                <div ref={sentinelRef}>
                    {loadingMore && (
                        <div style={loaderWrap}>
                            <span style={{ ...dotStyle, animationDelay: '0s' }} />
                            <span style={{ ...dotStyle, animationDelay: '0.15s' }} />
                            <span style={{ ...dotStyle, animationDelay: '0.3s' }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
