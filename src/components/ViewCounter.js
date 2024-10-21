import React, { useState, useEffect } from 'react';

const ViewCounter = () => {
    const [views, setViews] = useState(0);

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const response = await fetch('/api/views');
                const data = await response.json();
                setViews(data.views);
            } catch (error) {
                console.error('Error fetching views:', error);
            }
        };

        fetchViews();
    }, []);

    return (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{views.toLocaleString()} views</span>
        </div>
    );
};

export default ViewCounter;
