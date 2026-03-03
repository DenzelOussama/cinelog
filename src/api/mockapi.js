const MOCK_BASE = 'https://69a4cd9e885dcb6bd6a6a284.mockapi.io/api/v1';

async function request(path, options = {}) {
    const res = await fetch(`${MOCK_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) throw new Error(`MockAPI error ${res.status}`);
    return res.json();
}

// ── Users ──
export function getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/user${query ? `?${query}` : ''}`);
}

export function getUserById(id) {
    return request(`/user/${id}`);
}

export function createUser(data) {
    return request('/user', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateUser(id, data) {
    return request(`/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// ── Reviews ──
export function getReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/reviews${query ? `?${query}` : ''}`);
}

export function createReview(data) {
    return request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function deleteReview(id) {
    return request(`/reviews/${id}`, { method: 'DELETE' });
}
