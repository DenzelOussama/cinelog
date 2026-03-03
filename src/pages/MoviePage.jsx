import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, IMG_BASE } from '../api/tmdb';
import { getReviews, createReview, updateUser } from '../api/mockapi';
import { useAuth } from '../context/AuthContext';
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
        'linear-gradient(to top, #080809 0%, rgba(8,8,9,0.6) 50%, rgba(8,8,9,0.85) 100%)',
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
    fontFamily: "'Playfair Display', serif",
    fontSize: 40,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
    lineHeight: 1.15,
};
const metaRow = {
    display: 'flex',
    gap: 16,
    color: '#999',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 20,
    flexWrap: 'wrap',
};
const genreTag = {
    display: 'inline-block',
    background: 'rgba(233,168,64,0.1)',
    color: '#e9a840',
    fontSize: 12,
    padding: '4px 12px',
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
};
const overviewStyle = {
    color: '#bbb',
    fontSize: 15,
    lineHeight: 1.7,
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: 600,
};
const sectionTitle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 700,
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
    border: active ? 'none' : '1px solid #26262f',
    background: active ? '#e9a840' : '#17171c',
    color: active ? '#080809' : '#ccc',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
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
    background: '#26262f',
};
const castName = {
    color: '#fff',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 8,
};
const castChar = {
    color: '#666',
    fontSize: 11,
    fontFamily: "'DM Sans', sans-serif",
};

const textAreaStyle = {
    width: '100%',
    minHeight: 100,
    padding: '12px 16px',
    background: '#17171c',
    border: '1px solid #26262f',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: 12,
};

const submitBtn = {
    padding: '10px 32px',
    borderRadius: 10,
    border: 'none',
    background: '#e9a840',
    color: '#080809',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 12,
};

const reviewCard = {
    background: '#111114',
    border: '1px solid #26262f',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
};

export default function MoviePage() {
    const { id } = useParams();
    const { user, refreshUser } = useAuth();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    // reviews
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // list states
    const [listLoading, setListLoading] = useState('');

    const isWatched = (user?.watched || []).some((m) => String(m.movieId) === String(id));
    const isWatchlisted = (user?.watchlist || []).some((m) => String(m.movieId) === String(id));

    useEffect(() => {
        setLoading(true);
        getMovieDetails(id)
            .then(setMovie)
            .catch(console.error)
            .finally(() => setLoading(false));

        getReviews({ movieId: id })
            .then(setReviews)
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
        } catch (err) {
            console.error(err);
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
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div style={{ ...container, paddingTop: 120, textAlign: 'center', color: '#666' }}>
                Loading movie…
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

    return (
        <div>
            {/* ── Backdrop Hero ── */}
            <div style={backdropWrap}>
                {movie.backdrop_path && (
                    <img
                        src={`${IMG_BASE}/original${movie.backdrop_path}`}
                        alt=""
                        style={backdropImg}
                    />
                )}
                <div style={gradient} />
                <div style={heroContent}>
                    {movie.poster_path && (
                        <img
                            src={`${IMG_BASE}/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={posterStyle}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <h1 style={titleStyle}>{movie.title}</h1>
                        <div style={metaRow}>
                            {year && <span>{year}</span>}
                            {runtime && <span>·  {runtime}</span>}
                            {movie.vote_average > 0 && (
                                <span style={{ color: '#e9a840' }}>
                                    ★ {movie.vote_average.toFixed(1)}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                            {(movie.genres || []).map((g) => (
                                <span key={g.id} style={genreTag}>{g.name}</span>
                            ))}
                        </div>
                        <p style={overviewStyle}>{movie.overview}</p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button
                                style={actionBtn(isWatched)}
                                onClick={() => handleAddToList('watched')}
                                disabled={listLoading === 'watched'}
                            >
                                {listLoading === 'watched' ? '…' : isWatched ? '✓ Watched' : '+ Watched'}
                            </button>
                            <button
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

            {/* ── Cast ── */}
            {cast.length > 0 && (
                <div style={container}>
                    <h2 style={sectionTitle}>Cast</h2>
                    <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8 }}>
                        {cast.map((c) => (
                            <div key={c.credit_id} style={castCard}>
                                {c.profile_path ? (
                                    <img
                                        src={`${IMG_BASE}/w185${c.profile_path}`}
                                        alt={c.name}
                                        style={castImg}
                                    />
                                ) : (
                                    <div style={{ ...castImg, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#26262f', color: '#555', fontSize: 28 }}>
                                        👤
                                    </div>
                                )}
                                <p style={castName}>{c.name}</p>
                                <p style={castChar}>{c.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Write Review ── */}
            <div style={container}>
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
                <div style={container}>
                    <h2 style={sectionTitle}>Reviews</h2>
                    {reviews.map((r) => (
                        <div key={r.id} style={reviewCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                                    {r.username}
                                </span>
                                <StarRating value={r.rating} readOnly size={16} />
                            </div>
                            <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                                {r.text}
                            </p>
                            <span style={{ color: '#555', fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 10, display: 'block' }}>
                                {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
