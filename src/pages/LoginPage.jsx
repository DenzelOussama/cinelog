import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050505',
    fontFamily: "'Inter', sans-serif",
};

const cardStyle = {
    width: 400,
    maxWidth: '90vw',
    background: '#0e0e0e',
    borderRadius: 16,
    border: '1px solid #1e1e1e',
    padding: '48px 40px',
};

const logoStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 56,
    fontWeight: 400,
    letterSpacing: 3,
    color: '#FFB800',
    textAlign: 'center',
    marginBottom: 8,
};

const subtitleStyle = {
    fontFamily: "'Inter', sans-serif",
    color: '#666',
    fontSize: 15,
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: 32,
};

const tabRow = {
    display: 'flex',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 28,
    border: '1px solid #1e1e1e',
};

const tabBase = {
    flex: 1,
    padding: '10px 0',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s',
};

const tabActive = {
    ...tabBase,
    background: '#FFB800',
    color: '#050505',
};

const tabInactive = {
    ...tabBase,
    background: '#141414',
    color: '#777',
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#141414',
    border: '1px solid #1e1e1e',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    marginBottom: 16,
    outline: 'none',
    boxSizing: 'border-box',
};

const inputWrapStyle = {
    position: 'relative',
    marginBottom: 16,
};

const passwordInputStyle = {
    ...inputStyle,
    paddingRight: 60,
    marginBottom: 0,
};

const toggleBtnStyle = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#555',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '4px 6px',
    transition: 'color 0.2s',
};

const btnStyle = {
    width: '100%',
    padding: '13px 0',
    background: '#FFB800',
    color: '#050505',
    border: 'none',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    marginTop: 8,
    transition: 'opacity 0.2s',
};

const errorStyle = {
    color: '#e85454',
    fontSize: 13,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 12,
};

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(username.trim(), password);
            } else {
                await register(username.trim(), password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={logoStyle}>CINELOG</h1>
                <p style={subtitleStyle}>Your personal movie journal</p>

                <div style={tabRow}>
                    <button
                        style={isLogin ? tabActive : tabInactive}
                        onClick={() => {
                            setIsLogin(true);
                            setError('');
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        style={!isLogin ? tabActive : tabInactive}
                        onClick={() => {
                            setIsLogin(false);
                            setError('');
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                    <div style={inputWrapStyle}>
                        <input
                            style={passwordInputStyle}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            style={toggleBtnStyle}
                            onClick={() => setShowPassword((v) => !v)}
                            onMouseEnter={(e) => (e.target.style.color = '#FFB800')}
                            onMouseLeave={(e) => (e.target.style.color = '#555')}
                            tabIndex={-1}
                        >
                            {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                    </div>
                    {error && <p style={errorStyle}>{error}</p>}
                    <button style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }} disabled={loading}>
                        {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
