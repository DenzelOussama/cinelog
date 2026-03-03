import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080809',
    fontFamily: "'DM Sans', sans-serif",
};

const cardStyle = {
    width: 400,
    maxWidth: '90vw',
    background: '#111114',
    borderRadius: 16,
    border: '1px solid #26262f',
    padding: '48px 40px',
};

const logoStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 800,
    color: '#e9a840',
    textAlign: 'center',
    marginBottom: 8,
};

const subtitleStyle = {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
};

const tabRow = {
    display: 'flex',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 28,
    border: '1px solid #26262f',
};

const tabBase = {
    flex: 1,
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
};

const tabActive = {
    ...tabBase,
    background: '#e9a840',
    color: '#080809',
};

const tabInactive = {
    ...tabBase,
    background: '#17171c',
    color: '#777',
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#17171c',
    border: '1px solid #26262f',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
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
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.05em',
    cursor: 'pointer',
    padding: '4px 6px',
    transition: 'color 0.2s',
};

const btnStyle = {
    width: '100%',
    padding: '13px 0',
    background: '#e9a840',
    color: '#080809',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 8,
    transition: 'opacity 0.2s',
};

const errorStyle = {
    color: '#e85454',
    fontSize: 13,
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
                <h1 style={logoStyle}>cinelog</h1>
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
                            onMouseEnter={(e) => (e.target.style.color = '#e9a840')}
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
