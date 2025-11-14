import React from 'react';

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition shadow-lg ${disabled ? 'opacity-25' : ''} ${className}`}
            disabled={disabled}
        >{children}</button>
    );
}