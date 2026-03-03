import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}

/* ── Toast Container & Items ── */

const containerStyle = {
    position: 'fixed',
    bottom: 32,
    right: 24,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    pointerEvents: 'none',
};

const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
};

const accentColors = {
    success: '#FFB800',
    error: '#e85454',
    info: '#4ea8de',
};

function ToastContainer({ toasts }) {
    if (toasts.length === 0) return null;

    return (
        <div style={containerStyle}>
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'rgba(14,14,14,0.95)',
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${accentColors[t.type]}33`,
                        borderLeft: `3px solid ${accentColors[t.type]}`,
                        borderRadius: 10,
                        padding: '14px 20px',
                        minWidth: 260,
                        maxWidth: 380,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${accentColors[t.type]}15`,
                        animation: t.exiting
                            ? 'toastOut 0.3s ease forwards'
                            : 'toastIn 0.35s ease forwards',
                        pointerEvents: 'auto',
                    }}
                >
                    <span
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: `${accentColors[t.type]}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 700,
                            color: accentColors[t.type],
                            flexShrink: 0,
                        }}
                    >
                        {icons[t.type]}
                    </span>
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#ddd',
                            letterSpacing: 0.3,
                            lineHeight: 1.4,
                        }}
                    >
                        {t.message}
                    </span>
                </div>
            ))}
        </div>
    );
}
