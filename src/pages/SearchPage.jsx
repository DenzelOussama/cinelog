import { useEffect, useState } from 'react';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const pageStyle = {
    padding: '96px 32px 48px',
    maxWidth: 1200,
    margin: '0 auto',
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
    marginBottom: 40,
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
    padding: '14px 20px 14px 50px',
    background: '#0e0e0e',
    border: '1px solid #1e1e1e',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 24,
};

const emptyStyle = {
    textAlign: 'center',
    color: '#555',
    marginTop: 80,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 300,
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

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
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                    onBlur={(e) => (e.target.style.borderColor = '#1e1e1e')}
                />
            </div>

            {!searched && !query && (
                <div style={emptyStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>🍿</p>
                    <p>Start typing to search for movies</p>
                </div>
            )}

            {searched && results.length === 0 && (
                <div style={emptyStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>😕</p>
                    <p>No results found for "{query}"</p>
                </div>
            )}

            <div style={gridStyle}>
                {results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
