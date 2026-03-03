import { useState, useEffect, useRef } from 'react';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

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
    marginBottom: 28,
};

const inputWrap = {
    position: 'relative',
    marginBottom: 36,
};

const inputStyle = {
    width: '100%',
    padding: '14px 20px 14px 48px',
    background: '#111114',
    border: '1px solid #26262f',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const iconStyle = {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#555',
    fontSize: 18,
    pointerEvents: 'none',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 24,
};

const emptyStyle = {
    textAlign: 'center',
    color: '#555',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 80,
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setLoading(true);
            setSearched(true);
            searchMovies(query.trim())
                .then((data) => setResults(data.results || []))
                .catch(console.error)
                .finally(() => setLoading(false));
        }, 400);
        return () => clearTimeout(timer.current);
    }, [query]);

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Search</h1>

            <div style={inputWrap}>
                <span style={iconStyle}>🔍</span>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Search for a movie…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = '#e9a840')}
                    onBlur={(e) => (e.target.style.borderColor = '#26262f')}
                />
            </div>

            {loading ? (
                <div style={gridStyle}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                borderRadius: 12,
                                background: '#17171c',
                                aspectRatio: '2/3',
                                animation: 'pulse 1.5s ease-in-out infinite',
                            }}
                        />
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div style={gridStyle}>
                    {results.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : searched ? (
                <div style={emptyStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>🎬</p>
                    <p>No movies found for "{query}"</p>
                </div>
            ) : (
                <div style={emptyStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>🍿</p>
                    <p>Start typing to search for movies</p>
                </div>
            )}
        </div>
    );
}
