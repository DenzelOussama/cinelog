import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviews, deleteReview, updateReview, updateUser } from '../api/mockapi';
import { IMG_BASE } from '../api/tmdb';
import StarRating from '../components/StarRating';
import { useToast } from '../context/ToastContext';


/* ═══════════════════════════════════════════
   PROFILE PAGE — Styled to match CINELOG design
   ═══════════════════════════════════════════ */

/* ── Hero header section ── */
const heroStyle = {
    position: 'relative',
    background: '#0a0a0a',
    borderBottom: '1px solid #1a1a1a',
    padding: '120px 64px 48px',
    overflow: 'hidden',
};

const heroGrain = {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    pointerEvents: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat',
    backgroundSize: '150px 150px',
};

const heroInner = {
    position: 'relative',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 32,
    flexWrap: 'wrap',
};

const avatarStyle = {
    width: 96,
    height: 96,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFB800 0%, #e5a600 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    color: '#050505',
    fontFamily: "'Bebas Neue', sans-serif",
    fontWeight: 400,
    flexShrink: 0,
    border: '3px solid rgba(255,184,0,0.3)',
    boxShadow: '0 0 40px rgba(255,184,0,0.15)',
};

const heroTextCol = {
    flex: 1,
};

const greetingStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 52,
    fontWeight: 400,
    letterSpacing: 3,
    color: '#fff',
    lineHeight: 1,
    marginBottom: 6,
};

const memberSince = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 300,
    color: '#555',
    letterSpacing: 0.5,
};

/* ── Stats row ── */
const statsRow = {
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap',
};

const statItem = {
    textAlign: 'center',
};

const statNumber = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 36,
    fontWeight: 400,
    color: '#FFB800',
    lineHeight: 1,
    letterSpacing: 1,
};

const statLabel = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#555',
    marginTop: 4,
};

/* ── Content section ── */
const contentStyle = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 64px 64px',
    fontFamily: "'Inter', sans-serif",
};

/* ── Tabs ── */
const tabRow = {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid #1e1e1e',
    marginBottom: 36,
    paddingTop: 36,
};

const tabBase = {
    padding: '14px 32px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    color: '#555',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontFamily: "'Inter', sans-serif",
    transition: 'color 0.2s, border-color 0.2s',
    position: 'relative',
};

const tabActive = {
    ...tabBase,
    color: '#FFB800',
    borderBottomColor: '#FFB800',
};

/* ── Movie grid ── */
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
    gap: 20,
};

const movieItem = {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#141414',
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
};

const imgStyle = {
    width: '100%',
    aspectRatio: '2/3',
    objectFit: 'cover',
    display: 'block',
};

const removeBtn = {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(5,5,5,0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e85454',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    zIndex: 2,
};

const infoStyle = {
    padding: '12px 14px',
};

const titleStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#fff',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

/* ── Review cards ── */
const reviewCard = {
    background: '#0e0e0e',
    border: '1px solid #1e1e1e',
    borderRadius: 12,
    padding: '24px 28px',
    marginBottom: 16,
    display: 'flex',
    gap: 24,
    transition: 'border-color 0.2s',
};

const reviewPoster = {
    width: 80,
    borderRadius: 8,
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    objectFit: 'cover',
    aspectRatio: '2/3',
};

const reviewMovieTitle = {
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: 0.3,
};

const reviewDeleteBtn = {
    background: 'none',
    border: '1px solid rgba(232,84,84,0.3)',
    color: '#e85454',
    cursor: 'pointer',
    fontSize: 10,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    padding: '5px 14px',
    borderRadius: 20,
    transition: 'all 0.2s',
};

const reviewEditBtn = {
    background: 'none',
    border: '1px solid rgba(255,184,0,0.3)',
    color: '#FFB800',
    cursor: 'pointer',
    fontSize: 10,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    padding: '5px 14px',
    borderRadius: 20,
    transition: 'all 0.2s',
};

const editTextArea = {
    width: '100%',
    minHeight: 80,
    padding: '10px 14px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: 10,
    transition: 'border-color 0.2s',
};

const editSaveBtn = {
    padding: '6px 20px',
    borderRadius: 20,
    border: 'none',
    background: '#FFB800',
    color: '#050505',
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
};

const editCancelBtn = {
    padding: '6px 20px',
    borderRadius: 20,
    border: 'none',
    background: 'transparent',
    color: '#666',
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'color 0.2s',
};

const reviewText = {
    color: '#999',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.7,
    margin: '10px 0 0',
    fontFamily: "'Inter', sans-serif",
};

const reviewDate = {
    color: '#444',
    fontSize: 11,
    fontFamily: "'Inter', sans-serif",
    marginTop: 10,
    display: 'block',
    letterSpacing: 0.5,
};

/* ── Empty states ── */
const emptyWrap = {
    textAlign: 'center',
    padding: '64px 0',
};

const emptyIcon = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,184,0,0.06)',
    border: '1px solid rgba(255,184,0,0.15)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    marginBottom: 20,
};

const emptyTitle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    fontWeight: 400,
    letterSpacing: 2,
    color: '#fff',
    marginBottom: 8,
};

const emptySub = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 300,
    color: '#555',
};

const placeholderStyle = {
    width: '100%',
    aspectRatio: '2/3',
    background: '#1e1e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: 28,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [tab, setTab] = useState('watched');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    /* ── Edit review state ── */
    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editText, setEditText] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        setLoadingReviews(true);
        getReviews({ userId: user.id })
            .then(setReviews)
            .catch(console.error)
            .finally(() => setLoadingReviews(false));
    }, [user]);

    async function handleRemoveFromList(listName, movieId) {
        if (!user) return;
        try {
            const updated = (user[listName] || []).filter(
                (m) => String(m.movieId) !== String(movieId)
            );
            await updateUser(user.id, { [listName]: updated });
            await refreshUser();
            const label = listName === 'watched' ? 'Watched' : 'Watchlist';
            toast(`Removed from ${label}`, 'success');
        } catch (err) {
            console.error(err);
            toast('Failed to remove', 'error');
        }
    }

    async function handleDeleteReview(reviewId) {
        try {
            await deleteReview(reviewId);
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            toast('Review deleted', 'success');
        } catch (err) {
            console.error(err);
            toast('Failed to delete review', 'error');
        }
    }

    function handleEditReview(review) {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditText(review.text);
    }

    function handleCancelEdit() {
        setEditingId(null);
        setEditRating(0);
        setEditText('');
    }

    async function handleSaveEdit(reviewId) {
        if (!editRating || !editText.trim()) return;
        setSaving(true);
        try {
            const updated = await updateReview(reviewId, {
                rating: editRating,
                text: editText.trim(),
            });
            setReviews((prev) =>
                prev.map((r) => (r.id === reviewId ? { ...r, ...updated } : r))
            );
            setEditingId(null);
            setEditRating(0);
            setEditText('');
            toast('Review updated', 'success');
        } catch (err) {
            console.error(err);
            toast('Failed to update review', 'error');
        } finally {
            setSaving(false);
        }
    }

    const watched = user?.watched || [];
    const watchlist = user?.watchlist || [];
    const initial = (user?.username || '?')[0].toUpperCase();

    /* ── Sort state ── */
    const [movieSort, setMovieSort] = useState('recent');
    const [reviewSort, setReviewSort] = useState('newest');

    const MOVIE_SORT_OPTIONS = [
        { value: 'recent', label: 'Recently Added' },
        { value: 'title-az', label: 'Title A → Z' },
        { value: 'title-za', label: 'Title Z → A' },
    ];

    const REVIEW_SORT_OPTIONS = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'rating-high', label: 'Highest Rating' },
        { value: 'rating-low', label: 'Lowest Rating' },
    ];

    function sortMovies(list) {
        const sorted = [...list];
        switch (movieSort) {
            case 'title-az':
                sorted.sort((a, b) => (a.movieTitle || '').localeCompare(b.movieTitle || ''));
                break;
            case 'title-za':
                sorted.sort((a, b) => (b.movieTitle || '').localeCompare(a.movieTitle || ''));
                break;
            case 'recent':
            default:
                sorted.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
                break;
        }
        return sorted;
    }

    const sortedReviews = useMemo(() => {
        const sorted = [...reviews];
        switch (reviewSort) {
            case 'oldest':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'rating-high':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                sorted.sort((a, b) => a.rating - b.rating);
                break;
            case 'newest':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
        return sorted;
    }, [reviews, reviewSort]);

    function renderMovieGrid(list, listName) {
        if (list.length === 0) {
            return (
                <div style={emptyWrap}>
                    <div style={emptyIcon}>
                        {listName === 'watched' ? '👁' : '📋'}
                    </div>
                    <h3 style={emptyTitle}>
                        {listName === 'watched' ? 'No Movies Watched Yet' : 'Watchlist Is Empty'}
                    </h3>
                    <p style={emptySub}>
                        {listName === 'watched'
                            ? 'Start exploring and mark movies as watched'
                            : 'Browse movies and add them to your watchlist'}
                    </p>
                </div>
            );
        }
        return (
            <div className="profile-grid" style={gridStyle}>
                {list.map((m) => (
                    <div
                        key={m.movieId}
                        style={movieItem}
                        onClick={() => navigate(`/movie/${m.movieId}`)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.04)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <button
                            style={removeBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromList(listName, m.movieId);
                            }}
                            title="Remove"
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(232,84,84,0.2)';
                                e.target.style.borderColor = '#e85454';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(5,5,5,0.8)';
                                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            ✕
                        </button>
                        {m.posterPath ? (
                            <img
                                src={`${IMG_BASE}/w342${m.posterPath}`}
                                alt={m.movieTitle}
                                style={imgStyle}
                                loading="lazy"
                            />
                        ) : (
                            <div style={placeholderStyle}>🎬</div>
                        )}
                        <div style={infoStyle}>
                            <p style={titleStyle}>{m.movieTitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function renderReviews() {
        if (loadingReviews) {
            return (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="skeleton-block"
                            style={{
                                flex: '1 1 100%',
                                height: 120,
                                borderRadius: 12,
                            }}
                        />
                    ))}
                </div>
            );
        }
        if (reviews.length === 0) {
            return (
                <div style={emptyWrap}>
                    <div style={emptyIcon}>✍️</div>
                    <h3 style={emptyTitle}>No Reviews Yet</h3>
                    <p style={emptySub}>Watch a movie and share your thoughts</p>
                </div>
            );
        }
        return sortedReviews.map((r) => {
            const isEditing = editingId === r.id;
            return (
                <div
                    key={r.id}
                    className="profile-review-card"
                    style={{
                        ...reviewCard,
                        borderColor: isEditing ? 'rgba(255,184,0,0.25)' : undefined,
                    }}
                    onMouseEnter={(e) => { if (!isEditing) e.currentTarget.style.borderColor = '#2a2a2a'; }}
                    onMouseLeave={(e) => { if (!isEditing) e.currentTarget.style.borderColor = '#1e1e1e'; }}
                >
                    {r.posterPath ? (
                        <img
                            src={`${IMG_BASE}/w154${r.posterPath}`}
                            alt={r.movieTitle}
                            style={reviewPoster}
                            onClick={() => navigate(`/movie/${r.movieId}`)}
                            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                        />
                    ) : (
                        <div
                            style={{
                                ...reviewPoster,
                                width: 80,
                                height: 120,
                                background: '#1e1e1e',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#555',
                                fontSize: 20,
                            }}
                            onClick={() => navigate(`/movie/${r.movieId}`)}
                        >
                            🎬
                        </div>
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={reviewMovieTitle}>{r.movieTitle}</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {!isEditing && (
                                    <button
                                        style={reviewEditBtn}
                                        onClick={() => handleEditReview(r)}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255,184,0,0.1)';
                                            e.target.style.borderColor = '#FFB800';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'none';
                                            e.target.style.borderColor = 'rgba(255,184,0,0.3)';
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    style={reviewDeleteBtn}
                                    onClick={() => handleDeleteReview(r.id)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(232,84,84,0.1)';
                                        e.target.style.borderColor = '#e85454';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'none';
                                        e.target.style.borderColor = 'rgba(232,84,84,0.3)';
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {isEditing ? (
                            /* ── Inline edit form ── */
                            <div>
                                <StarRating value={editRating} onChange={setEditRating} size={18} />
                                <textarea
                                    style={editTextArea}
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                                    onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                                />
                                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                                    <button
                                        style={{ ...editSaveBtn, opacity: saving ? 0.6 : 1 }}
                                        onClick={() => handleSaveEdit(r.id)}
                                        disabled={saving || !editRating || !editText.trim()}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = saving ? '0.6' : '1')}
                                    >
                                        {saving ? 'Saving…' : 'Save'}
                                    </button>
                                    <button
                                        style={editCancelBtn}
                                        onClick={handleCancelEdit}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFB800')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ── Read-only view ── */
                            <>
                                <StarRating value={r.rating} readOnly size={16} />
                                <p style={reviewText}>{r.text}</p>
                                <span style={reviewDate}>
                                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            );
        });
    }

    const tabs = [
        { id: 'watched', label: 'Watched', count: watched.length },
        { id: 'watchlist', label: 'Watchlist', count: watchlist.length },
        { id: 'reviews', label: 'Reviews', count: reviews.length },
    ];

    return (
        <div style={{ background: '#050505', minHeight: '100vh' }}>
            {/* ── Hero header ── */}
            <div className="profile-hero" style={heroStyle}>
                <div style={heroGrain} />
                <div className="profile-hero-inner" style={heroInner}>
                    <div className="profile-avatar" style={avatarStyle}>{initial}</div>
                    <div style={heroTextCol}>
                        <h1 className="profile-greeting" style={greetingStyle}>{user?.username}</h1>
                        <p style={memberSince}>Your personal movie journal</p>
                    </div>
                    <div className="profile-stats" style={statsRow}>
                        <div style={statItem}>
                            <div className="profile-stat-number" style={statNumber}>{watched.length}</div>
                            <div style={statLabel}>Watched</div>
                        </div>
                        <div style={statItem}>
                            <div className="profile-stat-number" style={statNumber}>{watchlist.length}</div>
                            <div style={statLabel}>Watchlist</div>
                        </div>
                        <div style={statItem}>
                            <div className="profile-stat-number" style={statNumber}>{reviews.length}</div>
                            <div style={statLabel}>Reviews</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="profile-content" style={contentStyle}>
                <div className="profile-tabs" style={tabRow}>
                    {tabs.map((t) => {
                        const isActive = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                className="profile-tab"
                                style={{
                                    ...tabBase,
                                    color: isActive ? '#FFB800' : '#555',
                                    borderBottomColor: isActive ? '#FFB800' : 'transparent',
                                }}
                                onClick={() => setTab(t.id)}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.target.style.color = '#aaa';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.target.style.color = '#555';
                                }}
                            >
                                {t.label} ({t.count})
                            </button>
                        );
                    })}
                </div>

                {/* Sort bar */}
                {((tab === 'watched' && watched.length > 1) ||
                    (tab === 'watchlist' && watchlist.length > 1) ||
                    (tab === 'reviews' && reviews.length > 1)) && (
                        <div className="profile-sort-bar" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 10,
                            marginBottom: 24,
                        }}>
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: 1.5,
                                color: '#555',
                            }}>
                                Sort by
                            </span>
                            <select
                                className="profile-sort-select"
                                value={tab === 'reviews' ? reviewSort : movieSort}
                                onChange={(e) => {
                                    if (tab === 'reviews') setReviewSort(e.target.value);
                                    else setMovieSort(e.target.value);
                                }}
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: '#FFB800',
                                    background: '#141414',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: 8,
                                    padding: '8px 32px 8px 14px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFB800'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center',
                                    backgroundSize: '18px',
                                }}
                            >
                                {(tab === 'reviews' ? REVIEW_SORT_OPTIONS : MOVIE_SORT_OPTIONS).map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                {tab === 'watched' && renderMovieGrid(sortMovies(watched), 'watched')}
                {tab === 'watchlist' && renderMovieGrid(sortMovies(watchlist), 'watchlist')}
                {tab === 'reviews' && renderReviews()}
            </div>

        </div>
    );
}
