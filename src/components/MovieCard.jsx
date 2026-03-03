import { useNavigate } from 'react-router-dom';
import { IMG_BASE } from '../api/tmdb';

const cardStyle = {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#17171c',
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
};

const imgStyle = {
    width: '100%',
    aspectRatio: '2/3',
    objectFit: 'cover',
    display: 'block',
};

const infoStyle = {
    padding: '12px 14px',
};

const titleStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
};

const yearStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: '#888',
};

const ratingBadge = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: '#e9a840',
    background: 'rgba(233,168,64,0.12)',
    padding: '2px 8px',
    borderRadius: 6,
};

const placeholderStyle = {
    width: '100%',
    aspectRatio: '2/3',
    background: '#26262f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: 36,
};

export default function MovieCard({ movie }) {
    const navigate = useNavigate();

    const year = (movie.release_date || '').substring(0, 4);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
    const poster = movie.poster_path
        ? `${IMG_BASE}/w342${movie.poster_path}`
        : null;

    return (
        <div
            style={cardStyle}
            onClick={() => navigate(`/movie/${movie.id}`)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {poster ? (
                <img src={poster} alt={movie.title} style={imgStyle} loading="lazy" />
            ) : (
                <div style={placeholderStyle}>🎬</div>
            )}
            <div style={infoStyle}>
                <p style={titleStyle}>{movie.title}</p>
                <div style={metaStyle}>
                    <span style={yearStyle}>{year}</span>
                    {rating && <span style={ratingBadge}>★ {rating}</span>}
                </div>
            </div>
        </div>
    );
}
