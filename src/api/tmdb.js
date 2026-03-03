const TMDB_KEY = '71dd76bc3cd4101b0bbfa924c9acc935';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

async function request(path, params = {}) {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('api_key', TMDB_KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB error ${res.status}`);
    return res.json();
}

export function getTrending(page = 1) {
    return request('/trending/movie/week', { page });
}

export function searchMovies(query, page = 1) {
    return request('/search/movie', { query, page });
}

export function getMovieDetails(id) {
    return request(`/movie/${id}`, { append_to_response: 'credits' });
}
