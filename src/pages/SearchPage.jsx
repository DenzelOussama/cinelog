import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, getDiscover, getPopular, getTrending, searchPerson, IMG_BASE } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const TMDB_BASE = 'https://api.themoviedb.org/3';

/* ── Genre definitions ── */
const GENRES = [
    { id: 28, label: 'Action' },
    { id: 35, label: 'Comedy' },
    { id: 27, label: 'Horror' },
    { id: 878, label: 'Sci-Fi' },
    { id: 18, label: 'Drama' },
    { id: 53, label: 'Thriller' },
    { id: 16, label: 'Animation' },
    { id: 10749, label: 'Romance' },
    { id: 80, label: 'Crime' },
];

const SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Rating' },
    { value: 'primary_release_date.desc', label: 'Release Date' },
];

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
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

/* Search bar row */
const searchRow = {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    alignItems: 'stretch',
};

const inputWrap = {
    position: 'relative',
    flex: 1,
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

const filterToggleBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 20px',
    background: '#0e0e0e',
    border: '1px solid #1e1e1e',
    borderRadius: 12,
    color: '#FFB800',
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
    whiteSpace: 'nowrap',
};

/* Active filter count badge */
const filterBadge = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#FFB800',
    color: '#050505',
    fontSize: 10,
    fontWeight: 800,
    lineHeight: 1,
};

/* ── Filter Panel ── */
const panelStyle = {
    overflow: 'hidden',
    transition: 'max-height 0.35s ease, opacity 0.3s ease',
    marginBottom: 24,
};

const panelInner = {
    background: '#0a0a0a',
    border: '1px solid #1a1a1a',
    borderRadius: 16,
    padding: '28px 28px 24px',
};

const sectionLabel = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    color: '#FFB800',
    marginBottom: 12,
};

const genreGrid = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
};

const genreTag = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    padding: '7px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #2a2a2a',
    background: 'transparent',
    color: '#888',
    letterSpacing: 0.5,
};

const genreTagActive = {
    ...genreTag,
    border: '1px solid #FFB800',
    background: 'rgba(255,184,0,0.12)',
    color: '#FFB800',
};

const yearRow = {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
};

const yearInput = {
    width: 100,
    height: 38,
    padding: '0 12px',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const yearDash = {
    color: '#555',
    fontSize: 14,
    fontWeight: 300,
};

const sortRow = {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 24,
};

const sortBtn = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    padding: '7px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #2a2a2a',
    background: 'transparent',
    color: '#888',
    letterSpacing: 0.5,
};

const sortBtnActive = {
    ...sortBtn,
    border: '1px solid #FFB800',
    background: 'rgba(255,184,0,0.12)',
    color: '#FFB800',
};

const actorInputStyle = {
    width: '100%',
    maxWidth: 320,
    height: 38,
    padding: '0 12px',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    marginBottom: 24,
};

const panelFooter = {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    borderTop: '1px solid #1a1a1a',
    paddingTop: 20,
};

const applyBtn = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    padding: '10px 32px',
    borderRadius: 8,
    cursor: 'pointer',
    border: 'none',
    background: '#FFB800',
    color: '#050505',
    transition: 'all 0.2s',
};

const resetBtn = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 2,
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: '#666',
    transition: 'color 0.2s',
};

const actorMatch = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    color: '#555',
    marginTop: -20,
    marginBottom: 24,
};

const actorMatchName = {
    color: '#FFB800',
    fontWeight: 600,
};

/* Results grid */
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 24,
};

/* Empty state */
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
                <h2 className="search-empty-title" style={emptyTitleStyle}>What Will You Discover?</h2>
                <p style={emptySubStyle}>Search for a movie or use the filter</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const mountedRef = useRef(false);

    /* ── Read initial values from URL ── */
    const urlQuery = searchParams.get('query') || '';
    const urlGenres = searchParams.get('genres');
    const urlYearFrom = searchParams.get('year_from') || '';
    const urlYearTo = searchParams.get('year_to') || '';
    const urlSort = searchParams.get('sort') || 'popularity.desc';
    const urlActorId = searchParams.get('actor_id');

    /* ── Existing search state ── */
    const [query, setQuery] = useState(urlQuery);
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    /* ── Filter state ── */
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState(
        urlGenres ? urlGenres.split(',').map(Number).filter(Boolean) : []
    );
    const [yearFrom, setYearFrom] = useState(urlYearFrom);
    const [yearTo, setYearTo] = useState(urlYearTo);
    const [sortBy, setSortBy] = useState(urlSort);
    const [actorQuery, setActorQuery] = useState('');
    const [actorId, setActorId] = useState(urlActorId ? Number(urlActorId) : null);
    const [actorName, setActorName] = useState('');

    /* ── Filter results ── */
    const [filterResults, setFilterResults] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const actorTimerRef = useRef(null);

    /* ── Helper: build URL params from current state ── */
    const buildParams = useCallback((overrides = {}) => {
        const p = {};
        const q = overrides.query !== undefined ? overrides.query : query;
        const g = overrides.genres !== undefined ? overrides.genres : selectedGenres;
        const yf = overrides.yearFrom !== undefined ? overrides.yearFrom : yearFrom;
        const yt = overrides.yearTo !== undefined ? overrides.yearTo : yearTo;
        const s = overrides.sortBy !== undefined ? overrides.sortBy : sortBy;
        const aid = overrides.actorId !== undefined ? overrides.actorId : actorId;

        if (q) p.query = q;
        if (g && g.length > 0) p.genres = g.join(',');
        if (yf) p.year_from = yf;
        if (yt) p.year_to = yt;
        if (s && s !== 'popularity.desc') p.sort = s;
        if (aid) p.actor_id = String(aid);
        return p;
    }, [query, selectedGenres, yearFrom, yearTo, sortBy, actorId]);

    /* ── Auto-trigger filters from URL on mount ── */
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        // If URL has filter params (genres, year, sort, actor), auto-apply
        const hasFilters = urlGenres || urlYearFrom || urlYearTo ||
            (urlSort && urlSort !== 'popularity.desc') || urlActorId;

        if (hasFilters && !urlQuery) {
            const params = { sort_by: urlSort || 'popularity.desc' };
            if (urlGenres) params.with_genres = urlGenres;
            if (urlYearFrom) params['primary_release_date.gte'] = `${urlYearFrom}-01-01`;
            if (urlYearTo) params['primary_release_date.lte'] = `${urlYearTo}-12-31`;
            if (urlActorId) params.with_cast = urlActorId;
            if ((urlSort || 'popularity.desc') === 'vote_average.desc') {
                params['vote_count.gte'] = 100;
            }

            // Log the final URL for verification
            const logUrl = new URL(`${TMDB_BASE}/discover/movie`);
            logUrl.searchParams.set('api_key', '***');
            Object.entries(params).forEach(([k, v]) => logUrl.searchParams.set(k, v));
            console.log('[CineLog Search] GET (auto-restore)', logUrl.toString());

            setFilterLoading(true);
            setFiltersApplied(true);
            getDiscover(params)
                .then((data) => setFilterResults(data.results || []))
                .catch(console.error)
                .finally(() => setFilterLoading(false));
        }
        // Text search auto-triggers via the existing query useEffect
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── Text search logic — filters results client-side when genres are active ── */
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        const timer = setTimeout(() => {
            const url = `${TMDB_BASE}/search/movie?api_key=***&query=${encodeURIComponent(query)}&page=1`;
            console.log('[CineLog Search] GET', url);
            searchMovies(query)
                .then((data) => {
                    let movies = data.results || [];
                    // Client-side genre filtering when genres are selected
                    if (selectedGenres.length > 0) {
                        movies = movies.filter((m) =>
                            m.genre_ids && selectedGenres.some((gid) => m.genre_ids.includes(gid))
                        );
                    }
                    setResults(movies);
                    setSearched(true);
                })
                .catch(console.error);
        }, 400);
        return () => clearTimeout(timer);
    }, [query, selectedGenres]);

    /* ── Actor search (debounced) ── */
    useEffect(() => {
        if (!actorQuery.trim()) {
            setActorId(null);
            setActorName('');
            return;
        }
        if (actorTimerRef.current) clearTimeout(actorTimerRef.current);
        actorTimerRef.current = setTimeout(() => {
            searchPerson(actorQuery)
                .then((data) => {
                    const top = (data.results || [])[0];
                    if (top) {
                        setActorId(top.id);
                        setActorName(top.name);
                    } else {
                        setActorId(null);
                        setActorName('');
                    }
                })
                .catch(console.error);
        }, 500);
        return () => clearTimeout(actorTimerRef.current);
    }, [actorQuery]);

    /* ── Toggle genre ── */
    function toggleGenre(genreId) {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId]
        );
    }

    /* ── Count active filters ── */
    function getActiveFilterCount() {
        let count = 0;
        if (selectedGenres.length > 0) count++;
        if (yearFrom || yearTo) count++;
        if (sortBy !== 'popularity.desc') count++;
        if (actorId) count++;
        return count;
    }

    /* ── Apply filters ── */
    function handleApply() {
        setFilterLoading(true);
        setFiltersApplied(true);
        setFilterOpen(false);

        if (query.trim()) {
            // Text query + filters: search by text, then filter client-side by genre
            const searchUrl = `${TMDB_BASE}/search/movie?api_key=***&query=${encodeURIComponent(query)}&page=1`;
            console.log('[CineLog Search] GET (text + filters)', searchUrl);
            console.log('[CineLog Search] Client-side genre filter:', selectedGenres.join(','));

            setSearchParams(buildParams(), { replace: true });

            searchMovies(query)
                .then((data) => {
                    let movies = data.results || [];
                    if (selectedGenres.length > 0) {
                        movies = movies.filter((m) =>
                            m.genre_ids && selectedGenres.some((gid) => m.genre_ids.includes(gid))
                        );
                    }
                    setResults(movies);
                    setSearched(true);
                    setFilterResults([]);
                })
                .catch(console.error)
                .finally(() => setFilterLoading(false));
        } else {
            // No text query: use /discover/movie with all filter params
            const params = { sort_by: sortBy };

            if (selectedGenres.length > 0) {
                params.with_genres = selectedGenres.join(',');
            }
            if (yearFrom) {
                params['primary_release_date.gte'] = `${yearFrom}-01-01`;
            }
            if (yearTo) {
                params['primary_release_date.lte'] = `${yearTo}-12-31`;
            }
            if (actorId) {
                params.with_cast = actorId;
            }
            // Avoid obscure results with fake ratings
            if (sortBy === 'vote_average.desc') {
                params['vote_count.gte'] = 100;
            }

            // Log the final URL for verification
            const logUrl = new URL(`${TMDB_BASE}/discover/movie`);
            logUrl.searchParams.set('api_key', '***');
            Object.entries(params).forEach(([k, v]) => logUrl.searchParams.set(k, v));
            console.log('[CineLog Search] GET', logUrl.toString());

            // Clear text search state
            setQuery('');
            setResults([]);
            setSearched(false);

            // Update URL with filter params
            setSearchParams(buildParams({ query: '' }), { replace: true });

            getDiscover(params)
                .then((data) => setFilterResults(data.results || []))
                .catch(console.error)
                .finally(() => setFilterLoading(false));
        }
    }

    /* ── Reset filters ── */
    function handleReset() {
        setSelectedGenres([]);
        setYearFrom('');
        setYearTo('');
        setSortBy('popularity.desc');
        setActorQuery('');
        setActorId(null);
        setActorName('');
        setFilterResults([]);
        setFiltersApplied(false);
        // Clear URL params
        setSearchParams({}, { replace: true });
    }

    /* ── Determine what to show ── */
    const showEmpty = !searched && !query && !filtersApplied;
    const moviesToShow = query && searched ? results : filterResults;
    const activeCount = getActiveFilterCount();

    return (
        <div className="search-page" style={pageStyle}>
            <h1 className="search-header" style={headerStyle}>Search the Vault</h1>

            {/* ── Search bar + Filter button ── */}
            <div className="search-bar-row" style={searchRow}>
                <div style={inputWrap}>
                    <span style={searchIcon}>🔍</span>
                    <input
                        className="search-input"
                        style={inputStyle}
                        type="text"
                        placeholder="Search for a movie..."
                        value={query}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            if (val.trim()) {
                                setFiltersApplied(false);
                                setFilterResults([]);
                            }
                            // Sync query to URL
                            const p = buildParams({ query: val, genres: [], yearFrom: '', yearTo: '', sortBy: 'popularity.desc', actorId: null });
                            if (val.trim()) {
                                setSearchParams({ query: val }, { replace: true });
                            } else {
                                setSearchParams({}, { replace: true });
                            }
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                        onBlur={(e) => (e.target.style.borderColor = '#1e1e1e')}
                    />
                </div>
                <button
                    className="search-filter-toggle"
                    style={{
                        ...filterToggleBtn,
                        borderColor: filterOpen ? '#FFB800' : '#1e1e1e',
                        background: filterOpen ? 'rgba(255,184,0,0.08)' : '#0e0e0e',
                    }}
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="8" y1="12" x2="20" y2="12" />
                        <line x1="12" y1="18" x2="20" y2="18" />
                    </svg>
                    Filter
                    {activeCount > 0 && <span style={filterBadge}>{activeCount}</span>}
                </button>
            </div>

            {/* ── Filter Panel ── */}
            <div
                className="search-filter-panel"
                style={{
                    ...panelStyle,
                    maxHeight: filterOpen ? 600 : 0,
                    opacity: filterOpen ? 1 : 0,
                    pointerEvents: filterOpen ? 'auto' : 'none',
                }}
            >
                <div style={panelInner}>
                    {/* Genres */}
                    <div style={sectionLabel}>Genres</div>
                    <div className="search-filter-genres" style={genreGrid}>
                        {GENRES.map((g) => (
                            <button
                                key={g.id}
                                style={selectedGenres.includes(g.id) ? genreTagActive : genreTag}
                                onClick={() => toggleGenre(g.id)}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>

                    {/* Year Range */}
                    <div style={sectionLabel}>Year Range</div>
                    <div className="search-filter-years" style={yearRow}>
                        <input
                            type="number"
                            placeholder="From"
                            value={yearFrom}
                            onChange={(e) => setYearFrom(e.target.value)}
                            style={yearInput}
                            min="1900"
                            max="2030"
                            onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                        />
                        <span style={yearDash}>—</span>
                        <input
                            type="number"
                            placeholder="To"
                            value={yearTo}
                            onChange={(e) => setYearTo(e.target.value)}
                            style={yearInput}
                            min="1900"
                            max="2030"
                            onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                        />
                    </div>

                    {/* Sort By */}
                    <div style={sectionLabel}>Sort By</div>
                    <div className="search-filter-sort" style={sortRow}>
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                style={sortBy === opt.value ? sortBtnActive : sortBtn}
                                onClick={() => setSortBy(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Actor */}
                    <div style={sectionLabel}>Actor</div>
                    <input
                        type="text"
                        className="search-filter-actor"
                        placeholder="Search by actor name..."
                        value={actorQuery}
                        onChange={(e) => setActorQuery(e.target.value)}
                        style={actorInputStyle}
                        onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                        onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                    />
                    {actorName && (
                        <div style={actorMatch}>
                            Matched: <span style={actorMatchName}>{actorName}</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={panelFooter}>
                        <button
                            style={applyBtn}
                            onClick={handleApply}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                            Apply
                        </button>
                        <button
                            style={resetBtn}
                            onClick={handleReset}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFB800')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Empty state ── */}
            {showEmpty && <EmptyBackground />}

            {/* ── No results for text search ── */}
            {searched && results.length === 0 && (
                <div style={noResultStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>😕</p>
                    <p>No results found for "{query}"</p>
                </div>
            )}

            {/* ── Loading skeleton ── */}
            {filterLoading && (
                <div className="search-grid" style={gridStyle}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="skeleton-block"
                            style={{
                                aspectRatio: '2/3',
                                borderRadius: 12,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ── Results grid ── */}
            {!filterLoading && moviesToShow.length > 0 && (
                <div className="search-grid" style={gridStyle}>
                    {moviesToShow.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}

            {/* ── No filter results ── */}
            {filtersApplied && !filterLoading && filterResults.length === 0 && (
                <div style={noResultStyle}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>🎬</p>
                    <p>No movies match your filters. Try adjusting them.</p>
                </div>
            )}
        </div>
    );
}
