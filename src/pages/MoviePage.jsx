import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getSimilarMovies, IMG_BASE } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { getReviews, createReview, updateUser } from '../api/mockapi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/StarRating';

/* ────── styles ────── */
const backdropWrap = {
    position: 'relative',
    width: '100%',
    minHeight: 520,
    overflow: 'hidden',
};
const backdropImg = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.3,
};
const gradient = {
    position: 'absolute',
    inset: 0,
    background:
        'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 50%, rgba(5,5,5,0.85) 100%)',
};
const heroContent = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    gap: 40,
    maxWidth: 1200,
    margin: '0 auto',
    padding: '120px 32px 48px',
    alignItems: 'flex-end',
};
const posterStyle = {
    width: 260,
    borderRadius: 14,
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    flexShrink: 0,
};
const titleStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 56,
    fontWeight: 400,
    letterSpacing: 3,
    color: '#fff',
    margin: '0 0 8px',
    lineHeight: 1,
};
const metaRow = {
    display: 'flex',
    gap: 16,
    color: '#999',
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    marginBottom: 20,
    flexWrap: 'wrap',
};
const genreTag = {
    display: 'inline-block',
    background: 'rgba(255,184,0,0.1)',
    color: '#FFB800',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: '4px 12px',
    borderRadius: 20,
    fontFamily: "'Inter', sans-serif",
};
const overviewStyle = {
    color: '#999',
    fontSize: 15,
    fontWeight: 300,
    lineHeight: 1.7,
    fontFamily: "'Inter', sans-serif",
    maxWidth: 600,
};
const sectionTitle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    fontWeight: 400,
    letterSpacing: 3,
    color: '#fff',
    margin: '0 0 20px',
};
const container = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 32px',
};

/* buttons */
const actionBtn = (active) => ({
    padding: '10px 22px',
    borderRadius: 10,
    border: active ? 'none' : '1px solid #1e1e1e',
    background: active ? '#FFB800' : '#141414',
    color: active ? '#050505' : '#ccc',
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.2s',
});

const castCard = {
    flexShrink: 0,
    width: 110,
    textAlign: 'center',
};
const castImg = {
    width: 90,
    height: 90,
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#1e1e1e',
};
const castName = {
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    marginTop: 8,
};
const castChar = {
    color: '#666',
    fontSize: 11,
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
};

const textAreaStyle = {
    width: '100%',
    minHeight: 100,
    padding: '12px 16px',
    background: '#141414',
    border: '1px solid #1e1e1e',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: 12,
};

const submitBtn = {
    padding: '10px 32px',
    borderRadius: 10,
    border: 'none',
    background: '#FFB800',
    color: '#050505',
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    marginTop: 12,
};

const reviewCard = {
    background: '#0e0e0e',
    border: '1px solid #1e1e1e',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
};

/* Trailer button */
const trailerBtn = {
    padding: '10px 22px',
    borderRadius: 10,
    border: '1px solid #FFB800',
    background: 'transparent',
    color: '#FFB800',
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
};

/* ── Trailer Modal ── */
function TrailerModal({ videoKey, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [onClose]);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.88)',
                    backdropFilter: 'blur(8px)',
                }}
            />

            {/* Video container */}
            <div
                style={{
                    position: 'relative',
                    width: '90vw',
                    maxWidth: 960,
                    aspectRatio: '16/9',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,184,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    animation: 'modalSlideUp 0.4s ease',
                }}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                />
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 24,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    zIndex: 2,
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,184,0,0.15)';
                    e.target.style.borderColor = '#FFB800';
                    e.target.style.color = '#FFB800';
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(20,20,20,0.8)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = '#fff';
                }}
            >
                ✕
            </button>
        </div>
    );
}

/* ── Time helper ── */
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

export default function MoviePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const toast = useToast();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    // reviews
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [showTrailer, setShowTrailer] = useState(false);

    // list states
    const [listLoading, setListLoading] = useState('');

    const isWatched = (user?.watched || []).some((m) => String(m.movieId) === String(id));
    const isWatchlisted = (user?.watchlist || []).some((m) => String(m.movieId) === String(id));

    // similar movies
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        setLoading(true);
        getMovieDetails(id)
            .then(setMovie)
            .catch(console.error)
            .finally(() => setLoading(false));

        getReviews({ movieId: id })
            .then(setReviews)
            .catch(console.error);

        getSimilarMovies(id)
            .then((data) => setSimilar((data.results || []).filter((m) => m.poster_path).slice(0, 12)))
            .catch(console.error);
    }, [id]);

    async function handleAddToList(listName) {
        if (!movie || !user) return;
        setListLoading(listName);
        try {
            const current = user[listName] || [];
            const exists = current.some((m) => String(m.movieId) === String(id));
            let updated;
            if (exists) {
                updated = current.filter((m) => String(m.movieId) !== String(id));
            } else {
                updated = [
                    ...current,
                    {
                        movieId: movie.id,
                        movieTitle: movie.title,
                        posterPath: movie.poster_path,
                        addedAt: new Date().toISOString(),
                    },
                ];
            }
            await updateUser(user.id, { [listName]: updated });
            await refreshUser();
            const label = listName === 'watched' ? 'Watched' : 'Watchlist';
            toast(exists ? `Removed from ${label}` : `Added to ${label}`, 'success');
        } catch (err) {
            console.error(err);
            toast('Something went wrong', 'error');
        } finally {
            setListLoading('');
        }
    }

    async function handleSubmitReview(e) {
        e.preventDefault();
        if (!rating || !reviewText.trim()) return;
        setSubmitting(true);
        try {
            const newReview = await createReview({
                userId: user.id,
                movieId: Number(id),
                movieTitle: movie?.title || '',
                posterPath: movie?.poster_path || '',
                rating,
                text: reviewText.trim(),
                username: user.username,
                createdAt: new Date().toISOString(),
            });
            setReviews((prev) => [newReview, ...prev]);
            setRating(0);
            setReviewText('');
            toast('Review posted!', 'success');
        } catch (err) {
            console.error(err);
            toast('Failed to post review', 'error');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div>
                {/* Backdrop skeleton */}
                <div className="movie-backdrop" style={{ ...backdropWrap, background: '#0a0a0a' }}>
                    <div style={gradient} />
                    <div className="movie-hero" style={heroContent}>
                        {/* Poster skeleton */}
                        <div
                            className="movie-poster skeleton-block"
                            style={{ width: 260, height: 390, borderRadius: 14, flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Title skeleton */}
                            <div className="skeleton-block" style={{ width: '70%', height: 48, marginBottom: 16 }} />
                            {/* Meta row skeleton */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                                <div className="skeleton-block" style={{ width: 50, height: 16 }} />
                                <div className="skeleton-block" style={{ width: 70, height: 16 }} />
                                <div className="skeleton-block" style={{ width: 60, height: 16 }} />
                            </div>
                            {/* Genre tags skeleton */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                <div className="skeleton-block" style={{ width: 72, height: 28, borderRadius: 20 }} />
                                <div className="skeleton-block" style={{ width: 56, height: 28, borderRadius: 20 }} />
                                <div className="skeleton-block" style={{ width: 80, height: 28, borderRadius: 20 }} />
                            </div>
                            {/* Overview skeleton */}
                            <div className="skeleton-block" style={{ width: '100%', height: 14, marginBottom: 8, maxWidth: 600 }} />
                            <div className="skeleton-block" style={{ width: '85%', height: 14, marginBottom: 8, maxWidth: 510 }} />
                            <div className="skeleton-block" style={{ width: '60%', height: 14, marginBottom: 24, maxWidth: 360 }} />
                            {/* Action buttons skeleton */}
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div className="skeleton-block" style={{ width: 140, height: 42, borderRadius: 10 }} />
                                <div className="skeleton-block" style={{ width: 120, height: 42, borderRadius: 10 }} />
                                <div className="skeleton-block" style={{ width: 120, height: 42, borderRadius: 10 }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cast skeleton */}
                <div className="movie-section" style={container}>
                    <div className="skeleton-block" style={{ width: 100, height: 28, marginBottom: 20 }} />
                    <div style={{ display: 'flex', gap: 20, overflowX: 'auto' }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ ...castCard, flexShrink: 0 }}>
                                <div className="skeleton-block" style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto' }} />
                                <div className="skeleton-block" style={{ width: 70, height: 12, marginTop: 10, margin: '10px auto 0' }} />
                                <div className="skeleton-block" style={{ width: 50, height: 10, marginTop: 4, margin: '4px auto 0' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review section skeleton */}
                <div className="movie-section" style={container}>
                    <div className="skeleton-block" style={{ width: 180, height: 28, marginBottom: 20 }} />
                    <div className="skeleton-block" style={{ width: '100%', height: 120, borderRadius: 12 }} />
                </div>
            </div>
        );
    }
    if (!movie) {
        return (
            <div style={{ ...container, paddingTop: 120, textAlign: 'center', color: '#666' }}>
                Movie not found.
            </div>
        );
    }

    const year = (movie.release_date || '').substring(0, 4);
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
    const cast = (movie.credits?.cast || []).slice(0, 10);

    // Find the best trailer (prefer Official Trailer, then any YouTube trailer)
    const videos = movie.videos?.results || [];
    const trailer =
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find((v) => v.site === 'YouTube');

    return (
        <div>
            {/* ── Backdrop Hero ── */}
            <div className="movie-backdrop" style={backdropWrap}>
                {movie.backdrop_path && (
                    <img
                        src={`${IMG_BASE}/original${movie.backdrop_path}`}
                        alt=""
                        style={backdropImg}
                    />
                )}
                <div style={gradient} />
                <div className="movie-hero" style={heroContent}>
                    {movie.poster_path && (
                        <img
                            className="movie-poster"
                            src={`${IMG_BASE}/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={posterStyle}
                        />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 className="movie-title" style={titleStyle}>{movie.title}</h1>
                        <div style={metaRow}>
                            {year && <span>{year}</span>}
                            {runtime && <span>·  {runtime}</span>}
                            {movie.vote_average > 0 && (
                                <span style={{ color: '#FFB800' }}>
                                    ★ {movie.vote_average.toFixed(1)}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                            {(movie.genres || []).map((g) => (
                                <span key={g.id} style={genreTag}>{g.name}</span>
                            ))}
                        </div>
                        <p className="movie-overview" style={overviewStyle}>{movie.overview}</p>
                        <div className="movie-actions" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                            {trailer && (
                                <button
                                    className="movie-action-btn"
                                    style={trailerBtn}
                                    onClick={() => setShowTrailer(true)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#FFB800';
                                        e.currentTarget.style.color = '#050505';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#FFB800';
                                    }}
                                >
                                    <span style={{ fontSize: 16 }}>▶</span> Watch Trailer
                                </button>
                            )}
                            <button
                                className="movie-action-btn"
                                style={actionBtn(isWatched)}
                                onClick={() => handleAddToList('watched')}
                                disabled={listLoading === 'watched'}
                            >
                                {listLoading === 'watched' ? '…' : isWatched ? '✓ Watched' : '+ Watched'}
                            </button>
                            <button
                                className="movie-action-btn"
                                style={actionBtn(isWatchlisted)}
                                onClick={() => handleAddToList('watchlist')}
                                disabled={listLoading === 'watchlist'}
                            >
                                {listLoading === 'watchlist' ? '…' : isWatchlisted ? '✓ Watchlist' : '+ Watchlist'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && trailer && (
                <TrailerModal
                    videoKey={trailer.key}
                    onClose={() => setShowTrailer(false)}
                />
            )}

            {/* ── Cast ── */}
            {cast.length > 0 && (
                <div className="movie-section" style={container}>
                    <h2 style={sectionTitle}>Cast</h2>
                    <div className="movie-cast-scroll" style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                        {cast.map((c) => (
                            <div
                                key={c.credit_id}
                                style={{ ...castCard, cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => navigate(`/actor/${c.id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {c.profile_path ? (
                                    <img
                                        src={`${IMG_BASE}/w185${c.profile_path}`}
                                        alt={c.name}
                                        style={castImg}
                                    />
                                ) : (
                                    <div style={{ ...castImg, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', color: '#555', fontSize: 28 }}>
                                        👤
                                    </div>
                                )}
                                <p style={{ ...castName, color: '#FFB800', transition: 'opacity 0.2s' }}>{c.name}</p>
                                <p style={castChar}>{c.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Write Review ── */}
            <div className="movie-section" style={container}>
                <h2 style={sectionTitle}>Write a Review</h2>
                <form onSubmit={handleSubmitReview}>
                    <StarRating value={rating} onChange={setRating} size={28} />
                    <textarea
                        style={textAreaStyle}
                        placeholder="Share your thoughts on this film…"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button
                        type="submit"
                        style={{ ...submitBtn, opacity: submitting ? 0.6 : 1 }}
                        disabled={submitting || !rating || !reviewText.trim()}
                    >
                        {submitting ? 'Posting…' : 'Post Review'}
                    </button>
                </form>
            </div>

            {/* ── Reviews List ── */}
            {reviews.length > 0 && (
                <div className="movie-section" style={container}>
                    <h2 style={sectionTitle}>Reviews</h2>
                    {reviews.map((r) => (
                        <div key={r.id} style={reviewCard}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                {/* User avatar */}
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #FFB800, #e09500)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: '#050505',
                                        fontFamily: "'Inter', sans-serif",
                                        flexShrink: 0,
                                    }}
                                >
                                    {(r.username || '?')[0].toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                                            {r.username}
                                        </span>
                                        <span style={{ color: '#444', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>
                                            · {timeAgo(r.createdAt)}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <StarRating value={r.rating} readOnly size={15} />
                                    </div>
                                    <p style={{ color: '#bbb', fontSize: 14, fontWeight: 400, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", margin: 0 }}>
                                        {r.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Similar Movies ── */}
            {similar.length > 0 && (
                <div className="movie-section" style={container}>
                    <h2 style={sectionTitle}>Similar Movies</h2>
                    <div
                        style={{
                            display: 'flex',
                            gap: 16,
                            overflowX: 'auto',
                            paddingBottom: 8,
                            scrollbarWidth: 'none',
                        }}
                    >
                        {similar.map((m) => (
                            <div key={m.id} style={{ flexShrink: 0, width: 160 }}>
                                <MovieCard movie={m} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
