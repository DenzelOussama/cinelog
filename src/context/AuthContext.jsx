import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getUsers, createUser, getUserById } from '../api/mockapi';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('cinelog_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('cinelog_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('cinelog_user');
        }
    }, [user]);

    async function login(username, password) {
        const users = await getUsers({ username });
        const found = users.find(
            (u) => u.username === username && u.password === password
        );
        if (!found) throw new Error('Invalid username or password');
        setUser(found);
        return found;
    }

    async function register(username, password) {
        // Check if username already taken
        // MockAPI returns 404 when no users match the query — that means
        // the username is available, so we treat 404 / empty array as "go ahead".
        try {
            const existing = await getUsers({ username });
            if (Array.isArray(existing) && existing.some((u) => u.username === username)) {
                throw new Error('Username already taken');
            }
        } catch (err) {
            // Re-throw only if it's our own "already taken" error
            if (err.message === 'Username already taken') throw err;
            // Any other error (404, network, etc.) → username is available
        }
        const newUser = await createUser({
            username,
            password,
            watched: [],
            watchlist: [],
        });
        setUser(newUser);
        return newUser;
    }

    function logout() {
        setUser(null);
    }

    async function refreshUser() {
        if (!user) return;
        const updated = await getUserById(user.id);
        setUser(updated);
        return updated;
    }

    const value = { user, login, register, logout, refreshUser, setUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
}
