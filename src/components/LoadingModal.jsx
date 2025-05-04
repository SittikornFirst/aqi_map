import React from 'react';

export default function LoadingModal({ show = false }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-200/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-700 text-sm">Loading...</p>
            </div>
        </div>
    );
}
