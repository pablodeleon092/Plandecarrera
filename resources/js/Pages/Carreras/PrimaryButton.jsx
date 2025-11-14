import React from 'react';

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition shadow-lg ${disabled ? 'opacity-25' : ''} ${className}`}
            disabled={disabled}
        >{children}</button>
    );
}