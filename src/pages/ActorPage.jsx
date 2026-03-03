import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPersonDetails, getPersonMovieCredits, IMG_BASE } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';

/* ═══════════════════════════════════════════
   ACTOR PAGE — Cinematic Redesign
   Full-width backdrop · Film-poster photo · Gold accents
   ═══════════════════════════════════════════ */

/* ── Page ── */
const pageWrap = {
    background: '#050505',
    minHeight: '100vh',
};

/* ── Backdrop Hero ── */
const backdropWrap = {
    position: 'relative',
    width: '100%',
    minHeight: 580,
    overflow: 'hidden',
};

const backdropImg = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(8px) brightness(0.35) saturate(1.1)',
    transform: 'scale(1.1)',
};

const backdropGradient = {
    position: 'absolute',
    inset: 0,
    background:
        'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.85) 30%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,0.7) 100%)',
    zIndex: 1,
};

const backdropGrain = {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    opacity: 0.04,
    pointerEvents: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat',
    backgroundSize: '150px 150px',
};

const heroContent = {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    gap: 40,
    maxWidth: 1200,
    margin: '0 auto',
    padding: '110px 32px 56px',
    alignItems: 'flex-end',
};

/* ── Actor Photo (film poster style) ── */
const posterWrap = {
    flexShrink: 0,
    position: 'relative',
};

const posterImg = {
    width: 240,
    height: 360,
    objectFit: 'cover',
    borderRadius: 6,
    border: '2px solid rgba(255,184,0,0.35)',
    boxShadow:
        '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,184,0,0.08), 0 0 80px rgba(255,184,0,0.06)',
    display: 'block',
};

const posterPlaceholder = {
    width: 240,
    height: 360,
    borderRadius: 6,
    border: '2px solid rgba(255,184,0,0.35)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
    background: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#444',
    fontSize: 72,
};

/* ── Info ── */
const infoWrap = {
    flex: 1,
    minWidth: 0,
    paddingBottom: 8,
};

const nameStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 72,
    fontWeight: 400,
    letterSpacing: 4,
    color: '#fff',
    lineHeight: 0.95,
    margin: '0 0 16px',
    textShadow: '0 4px 32px rgba(0,0,0,0.5)',
};

const metaRow = {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    marginBottom: 24,
};

const metaChip = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    color: '#ccc',
    letterSpacing: 0.3,
};

const metaLabel = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#FFB800',
    display: 'block',
    marginBottom: 2,
};

const bioStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 300,
    color: '#aaa',
    lineHeight: 1.75,
    maxWidth: 650,
    margin: 0,
};

const readMoreBtn = {
    background: 'none',
    border: 'none',
    color: '#FFB800',
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    marginTop: 10,
    padding: 0,
    transition: 'opacity 0.2s',
};

/* ── Sections ── */
const sectionContainer = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '48px 32px',
};

const sectionHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
};

const sectionTitle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 32,
    fontWeight: 400,
    letterSpacing: 4,
    color: '#fff',
    margin: 0,
};

const sectionCount = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    color: '#555',
    letterSpacing: 1,
    textTransform: 'uppercase',
};

const dividerLine = {
    height: 1,
    background: 'linear-gradient(to right, rgba(255,184,0,0.3), rgba(255,184,0,0.05), transparent)',
    marginBottom: 32,
};

/* ── Known-For scroll row ── */
const scrollRow = {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    paddingBottom: 8,
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
};

const scrollArrow = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(5,5,5,0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,184,0,0.2)',
    color: '#FFB800',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    zIndex: 2,
};

/* ── Filmography grid ── */
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
    gap: 20,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function ActorPage() {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bioExpanded, setBioExpanded] = useState(false);
    const knownForRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        setPerson(null);
        setMovies([]);
        setBioExpanded(false);

        Promise.all([
            getPersonDetails(id),
            getPersonMovieCredits(id),
        ])
            .then(([personData, creditsData]) => {
                setPerson(personData);
                // Deduplicate and sort by popularity, filter to movies with posters
                const seen = new Set();
                const unique = (creditsData.cast || [])
                    .filter((m) => {
                        if (!m.poster_path || seen.has(m.id)) return false;
                        seen.add(m.id);
                        return true;
                    })
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                setMovies(unique);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    function scrollKnownFor(direction) {
        if (!knownForRef.current) return;
        const amount = knownForRef.current.offsetWidth * 0.65;
        knownForRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    }

    /* ── Loading skeleton ── */
    if (loading) {
        return (
            <div style={pageWrap}>
                <div style={{ ...backdropWrap, background: '#0a0a0a' }}>
                    <div style={backdropGradient} />
                    <div style={heroContent}>
                        {/* Poster skeleton */}
                        <div className="skeleton-block" style={{ width: 240, height: 360, borderRadius: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
                            {/* Name skeleton */}
                            <div className="skeleton-block" style={{ width: '65%', height: 64, marginBottom: 16 }} />
                            {/* Meta skeleton */}
                            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                                <div>
                                    <div className="skeleton-block" style={{ width: 70, height: 10, marginBottom: 6 }} />
                                    <div className="skeleton-block" style={{ width: 90, height: 14 }} />
                                </div>
                                <div>
                                    <div className="skeleton-block" style={{ width: 40, height: 10, marginBottom: 6 }} />
                                    <div className="skeleton-block" style={{ width: 140, height: 14 }} />
                                </div>
                                <div>
                                    <div className="skeleton-block" style={{ width: 40, height: 10, marginBottom: 6 }} />
                                    <div className="skeleton-block" style={{ width: 120, height: 14 }} />
                                </div>
                            </div>
                            {/* Bio skeleton */}
                            <div className="skeleton-block" style={{ width: '100%', height: 14, marginBottom: 8, maxWidth: 600 }} />
                            <div className="skeleton-block" style={{ width: '85%', height: 14, marginBottom: 8, maxWidth: 520 }} />
                            <div className="skeleton-block" style={{ width: '60%', height: 14, maxWidth: 400 }} />
                        </div>
                    </div>
                </div>
                {/* Known For skeleton */}
                <div style={sectionContainer}>
                    <div className="skeleton-block" style={{ width: 160, height: 28, marginBottom: 24 }} />
                    <div style={{ display: 'flex', gap: 16 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-block" style={{ flexShrink: 0, width: 170, aspectRatio: '2/3', borderRadius: 12 }} />
                        ))}
                    </div>
                </div>
                {/* Grid skeleton */}
                <div style={sectionContainer}>
                    <div className="skeleton-block" style={{ width: 200, height: 28, marginBottom: 24 }} />
                    <div style={gridStyle}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="skeleton-block" style={{ aspectRatio: '2/3', borderRadius: 12 }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!person) {
        return (
            <div style={{ ...sectionContainer, paddingTop: 120, textAlign: 'center', color: '#666' }}>
                Actor not found.
            </div>
        );
    }

    /* ── Derived data ── */
    const birthday = person.birthday
        ? new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;
    const age = person.birthday
        ? Math.floor((Date.now() - new Date(person.birthday).getTime()) / 31557600000)
        : null;
    const bio = person.biography || '';
    const BIO_LIMIT = 500;

    // Use most popular movie's backdrop for the hero
    const heroBackdrop = movies.find((m) => m.backdrop_path);
    const knownForMovies = movies.slice(0, 15);
    const allMovies = movies;

    return (
        <div style={pageWrap}>

            {/* ═══════ BACKDROP HERO ═══════ */}
            <div className="actor-backdrop" style={backdropWrap}>
                {heroBackdrop && (
                    <img
                        src={`${IMG_BASE}/original${heroBackdrop.backdrop_path}`}
                        alt=""
                        style={backdropImg}
                    />
                )}
                <div style={backdropGradient} />
                <div style={backdropGrain} />

                <div className="actor-hero" style={heroContent}>
                    {/* Film-poster style photo */}
                    <div style={posterWrap}>
                        {person.profile_path ? (
                            <img
                                src={`${IMG_BASE}/h632${person.profile_path}`}
                                alt={person.name}
                                className="actor-photo"
                                style={posterImg}
                            />
                        ) : (
                            <div className="actor-photo" style={posterPlaceholder}>👤</div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="actor-info" style={infoWrap}>
                        <h1 className="actor-name" style={nameStyle}>{person.name}</h1>

                        <div className="actor-meta" style={metaRow}>
                            {person.known_for_department && (
                                <div className="actor-meta-item">
                                    <span style={metaLabel}>Known for</span>
                                    <span style={metaChip}>{person.known_for_department}</span>
                                </div>
                            )}
                            {birthday && (
                                <div className="actor-meta-item">
                                    <span style={metaLabel}>Born</span>
                                    <span style={metaChip}>
                                        {birthday}{age && !person.deathday ? ` (${age})` : ''}
                                    </span>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div className="actor-meta-item">
                                    <span style={metaLabel}>From</span>
                                    <span style={metaChip}>{person.place_of_birth}</span>
                                </div>
                            )}
                        </div>

                        {bio && (
                            <div className="actor-bio-wrap">
                                <div
                                    style={{
                                        maxHeight: bioExpanded ? 500 : 80,
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s ease',
                                    }}
                                >
                                    <p className="actor-bio" style={bioStyle}>
                                        {bio}
                                    </p>
                                </div>
                                {bio.length > BIO_LIMIT && (
                                    <button
                                        onClick={() => setBioExpanded(!bioExpanded)}
                                        style={readMoreBtn}
                                        onMouseEnter={(e) => (e.target.style.opacity = '0.65')}
                                        onMouseLeave={(e) => (e.target.style.opacity = '1')}
                                    >
                                        {bioExpanded ? '← Show less' : 'Read more →'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════ KNOWN FOR ═══════ */}
            {knownForMovies.length > 0 && (
                <div className="actor-section" style={sectionContainer}>
                    <div style={sectionHeader}>
                        <h2 style={sectionTitle}>Known For</h2>
                    </div>
                    <div style={dividerLine} />
                    <div style={{ position: 'relative' }}>
                        <button
                            className="actor-scroll-arrow"
                            style={{ ...scrollArrow, left: -12 }}
                            onClick={() => scrollKnownFor('left')}
                            aria-label="Scroll left"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,184,0,0.15)';
                                e.currentTarget.style.borderColor = '#FFB800';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(5,5,5,0.8)';
                                e.currentTarget.style.borderColor = 'rgba(255,184,0,0.2)';
                            }}
                        >
                            ‹
                        </button>
                        <div className="actor-known-scroll" ref={knownForRef} style={scrollRow}>
                            {knownForMovies.map((movie) => (
                                <div className="actor-known-item" key={movie.id} style={{ flexShrink: 0, width: 170 }}>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                        <button
                            className="actor-scroll-arrow"
                            style={{ ...scrollArrow, right: -12 }}
                            onClick={() => scrollKnownFor('right')}
                            aria-label="Scroll right"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,184,0,0.15)';
                                e.currentTarget.style.borderColor = '#FFB800';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(5,5,5,0.8)';
                                e.currentTarget.style.borderColor = 'rgba(255,184,0,0.2)';
                            }}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════ FULL FILMOGRAPHY ═══════ */}
            {allMovies.length > 0 && (
                <div className="actor-section" style={{ ...sectionContainer, paddingTop: 16 }}>
                    <div style={sectionHeader}>
                        <h2 style={sectionTitle}>Filmography</h2>
                        <span style={sectionCount}>{allMovies.length} films</span>
                    </div>
                    <div style={dividerLine} />
                    <div className="actor-grid" style={gridStyle}>
                        {allMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
