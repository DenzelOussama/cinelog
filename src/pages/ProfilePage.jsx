import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviews, deleteReview, updateUser } from '../api/mockapi';
import { IMG_BASE } from '../api/tmdb';
import StarRating from '../components/StarRating';

const pageStyle = {
    padding: '96px 32px 48px',
    maxWidth: 1200,
    margin: '0 auto',
    fontFamily: "'DM Sans', sans-serif",
};

const greeting = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
};

const subGreeting = {
    color: '#666',
    fontSize: 14,
    marginBottom: 36,
};

const tabRow = {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid #26262f',
    marginBottom: 32,
};

const tabBase = {
    padding: '12px 28px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#666',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
};

const tabActive = {
    ...tabBase,
    color: '#e9a840',
    borderBottomColor: '#e9a840',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 20,
};

const movieItem = {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#17171c',
    cursor: 'pointer',
    transition: 'transform 0.2s',
};

const imgStyle = {
    width: '100%',
    aspectRatio: '2/3',
    objectFit: 'cover',
    display: 'block',
};

const removeBtn = {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.7)',
    border: 'none',
    color: '#e85454',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const infoStyle = {
    padding: '10px 12px',
};

const titleStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const reviewCard = {
    background: '#111114',
    border: '1px solid #26262f',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
    display: 'flex',
    gap: 20,
};

const reviewPoster = {
    width: 70,
    borderRadius: 8,
    flexShrink: 0,
    cursor: 'pointer',
};

const emptyState = {
    textAlign: 'center',
    color: '#555',
    marginTop: 60,
};

const placeholderStyle = {
    width: '100%',
    aspectRatio: '2/3',
    background: '#26262f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: 28,
};

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('watched');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

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
        const updated = (user[listName] || []).filter(
            (m) => String(m.movieId) !== String(movieId)
        );
        await updateUser(user.id, { [listName]: updated });
        await refreshUser();
    }

    async function handleDeleteReview(reviewId) {
        await deleteReview(reviewId);
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }

    const watched = user?.watched || [];
    const watchlist = user?.watchlist || [];

    function renderMovieGrid(list, listName) {
        if (list.length === 0) {
            return (
                <div style={emptyState}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>🎬</p>
                    <p>No movies in your {listName} yet</p>
                </div>
            );
        }
        return (
            <div style={gridStyle}>
                {list.map((m) => (
                    <div
                        key={m.movieId}
                        style={movieItem}
                        onClick={() => navigate(`/movie/${m.movieId}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <button
                            style={removeBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromList(listName, m.movieId);
                            }}
                            title="Remove"
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
            return <p style={{ color: '#666', textAlign: 'center' }}>Loading…</p>;
        }
        if (reviews.length === 0) {
            return (
                <div style={emptyState}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>✍️</p>
                    <p>You haven't written any reviews yet</p>
                </div>
            );
        }
        return reviews.map((r) => (
            <div key={r.id} style={reviewCard}>
                {r.posterPath ? (
                    <img
                        src={`${IMG_BASE}/w154${r.posterPath}`}
                        alt={r.movieTitle}
                        style={reviewPoster}
                        onClick={() => navigate(`/movie/${r.movieId}`)}
                    />
                ) : (
                    <div
                        style={{ ...reviewPoster, width: 70, height: 100, background: '#26262f', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 20 }}
                        onClick={() => navigate(`/movie/${r.movieId}`)}
                    >
                        🎬
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
                            {r.movieTitle}
                        </span>
                        <button
                            style={{ background: 'none', border: 'none', color: '#e85454', cursor: 'pointer', fontSize: 13 }}
                            onClick={() => handleDeleteReview(r.id)}
                        >
                            Delete
                        </button>
                    </div>
                    <StarRating value={r.rating} readOnly size={16} />
                    <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.6, margin: '8px 0 0' }}>
                        {r.text}
                    </p>
                    <span style={{ color: '#555', fontSize: 11, marginTop: 8, display: 'block' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        ));
    }

    return (
        <div style={pageStyle}>
            <h1 style={greeting}>Hey, {user?.username} 👋</h1>
            <p style={subGreeting}>Your movie journal</p>

            <div style={tabRow}>
                <button
                    style={tab === 'watched' ? tabActive : tabBase}
                    onClick={() => setTab('watched')}
                >
                    Watched ({watched.length})
                </button>
                <button
                    style={tab === 'watchlist' ? tabActive : tabBase}
                    onClick={() => setTab('watchlist')}
                >
                    Watchlist ({watchlist.length})
                </button>
                <button
                    style={tab === 'reviews' ? tabActive : tabBase}
                    onClick={() => setTab('reviews')}
                >
                    Reviews ({reviews.length})
                </button>
            </div>

            {tab === 'watched' && renderMovieGrid(watched, 'watched')}
            {tab === 'watchlist' && renderMovieGrid(watchlist, 'watchlist')}
            {tab === 'reviews' && renderReviews()}
        </div>
    );
}
