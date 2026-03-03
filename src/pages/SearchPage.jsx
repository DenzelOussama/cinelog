import { useEffect, useState } from 'react';
import { searchMovies, getDiscover, getTrending, IMG_BASE } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

/* ── Genre filter definitions ── */
const GENRES = [
    { id: null, label: 'All' },
    { id: 28, label: 'Action' },
    { id: 35, label: 'Comedy' },
    { id: 27, label: 'Horror' },
    { id: 878, label: 'Sci-Fi' },
    { id: 18, label: 'Drama' },
    { id: 53, label: 'Thriller' },
    { id: 16, label: 'Animation' },
];

/* ── Styles ── */
const pageStyle = {
    padding: '96px 32px 48px',
    maxWidth: 1200,
    margin: '0 auto',
    minHeight: '100vh',
};

const headerStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 56,
    fontWeight: 400,
    letterSpacing: 3,
    color: '#fff',
    marginBottom: 24,
};

const inputWrap = {
    position: 'relative',
    marginBottom: 20,
};

const searchIcon = {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 18,
    color: '#555',
    pointerEvents: 'none',
};

const inputStyle = {
    width: '100%',
    height: 52,
    padding: '0 20px 0 50px',
    background: '#0e0e0e',
    border: '1px solid #1e1e1e',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const genreBarStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 36,
};

const genreBtnBase = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    padding: '8px 18px',
    borderRadius: 24,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #FFB800',
    background: 'transparent',
    color: '#FFB800',
};

const genreBtnActive = {
    ...genreBtnBase,
    background: '#FFB800',
    color: '#050505',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 24,
};

const emptyWrapStyle = {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const emptyGridStyle = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    padding: 10,
    filter: 'blur(3px)',
    opacity: 0.25,
};

const emptyOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.88) 100%)',
    zIndex: 1,
};

const emptyTextWrap = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
};

const emptyTitleStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 42,
    fontWeight: 400,
    letterSpacing: 4,
    color: '#FFB800',
    marginBottom: 8,
};

const emptySubStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 300,
    color: '#777',
};

const noResultStyle = {
    textAlign: 'center',
    color: '#555',
    marginTop: 80,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 300,
};

/* ── Empty State Background ── */
function EmptyBackground() {
    const [posters, setPosters] = useState([]);

    useEffect(() => {
        getTrending(1)
            .then((data) => {
                const movies = (data.results || [])
                    .filter((m) => m.poster_path)
                    .slice(0, 16);
                setPosters(movies.map((m) => `${IMG_BASE}/w342${m.poster_path}`));
            })
            .catch(() => { });
    }, []);

    return (
        <div style={emptyWrapStyle}>
            {posters.length > 0 && (
                <div style={emptyGridStyle}>
                    {posters.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt=""
                            style={{
                                width: '100%',
                                borderRadius: 8,
                                display: 'block',
                                objectFit: 'cover',
                                aspectRatio: '2/3',
                            }}
                        />
                    ))}
                </div>
            )}
            <div style={emptyOverlayStyle} />
            <div style={emptyTextWrap}>
                <h2 style={emptyTitleStyle}>What Will You Discover?</h2>
                <p style={emptySubStyle}>Search for a movie or pick a genre below</p>
            </div>
        </div>
    );
}

/* ── Main SearchPage ── */
export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [activeGenre, setActiveGenre] = useState(null);
    const [genreResults, setGenreResults] = useState([]);
    const [genreLoading, setGenreLoading] = useState(false);

    // Existing text search logic — untouched
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        const timer = setTimeout(() => {
            searchMovies(query)
                .then((data) => {
                    setResults(data.results || []);
                    setSearched(true);
                })
                .catch(console.error);
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    // Genre discover fetch
    useEffect(() => {
        if (activeGenre === null) {
            setGenreResults([]);
            return;
        }
        setGenreLoading(true);
        getDiscover({ with_genres: activeGenre, sort_by: 'popularity.desc' })
            .then((data) => setGenreResults(data.results || []))
            .catch(console.error)
            .finally(() => setGenreLoading(false));
    }, [activeGenre]);

    function handleGenreClick(genreId) {
        if (genreId === null) {
            setActiveGenre(null);
        } else {
            setActiveGenre(genreId === activeGenre ? null : genreId);
        }
        // Clear text search when switching to genre filter
        setQuery('');
        setResults([]);
        setSearched(false);
    }

    // Determine what movies to show
    const showEmpty = !searched && !query && activeGenre === null;
    const moviesToShow = query && searched ? results : genreResults;

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Search the Vault</h1>

            <div style={inputWrap}>
                <span style={searchIcon}>🔍</span>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Search for a movie..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.trim()) {
                            setActiveGenre(null);
                        }
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                    onBlur={(e) => (e.target.style.borderColor = '#1e1e1e')}
                />
            </div>

            {/* Genre filter buttons */}
            <div style={genreBarStyle}>
                {GENRES.map((genre) => {
                    const isActive =
                        genre.id === null
                            ? activeGenre === null && !query
                            : activeGenre === genre.id;
                    return (
                        <button
                            key={genre.label}
                            style={isActive ? genreBtnActive : genreBtnBase}
                            onClick={() => handleGenreClick(genre.id)}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.target.style.background = 'rgba(255,184,0,0.12)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.target.style.background = 'transparent';
                                }
                            }}
                        >
                            {genre.label}
                        </button>
                    );
                })}
            </div>

            {/* Empty state */}
            {showEmpty && <EmptyBackground />}

            {/* No results for text search */}
            {searched && results.length === 0 && (
                <div style={noResultStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>😕</p>
                    <p>No results found for "{query}"</p>
                </div>
            )}

            {/* Genre loading skeleton */}
            {genreLoading && (
                <div style={gridStyle}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                aspectRatio: '2/3',
                                borderRadius: 12,
                                background: '#141414',
                                animation: 'pulse 1.5s ease-in-out infinite',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Results grid */}
            {!genreLoading && moviesToShow.length > 0 && (
                <div style={gridStyle}>
                    {moviesToShow.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
