import { useState } from 'react';

const containerStyle = {
    display: 'inline-flex',
    gap: 4,
};

const starBase = {
    fontSize: 22,
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
    userSelect: 'none',
};

const starReadonly = {
    ...starBase,
    cursor: 'default',
};

export default function StarRating({
    value = 0,
    onChange,
    readOnly = false,
    size = 22,
}) {
    const [hover, setHover] = useState(0);

    return (
        <div style={containerStyle}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = readOnly ? star <= value : star <= (hover || value);
                return (
                    <span
                        key={star}
                        style={{
                            ...(readOnly ? starReadonly : starBase),
                            fontSize: size,
                            color: filled ? '#FFB800' : '#333',
                            transform: !readOnly && hover === star ? 'scale(1.2)' : 'scale(1)',
                        }}
                        onClick={() => !readOnly && onChange?.(star)}
                        onMouseEnter={() => !readOnly && setHover(star)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}
