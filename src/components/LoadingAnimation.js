// src/components/LoadingAnimation.js
import React from 'react';

const LoadingAnimation = () => (
    <div className="flex items-center justify-center h-full">
        <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
            <g fill="none" strokeWidth="4">
                <path stroke="red" d="M 50 10 L 50 90" />
                <path stroke="blue" d="M 10 50 L 90 50" />
            </g>
        </svg>
    </div>
);

export default LoadingAnimation;