import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = error?.status === 404;
  const errorMessage = error?.statusText || error?.message || 'An unexpected error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl font-bold text-red-500 mb-4">
          {error?.status || '❌'}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isNotFound ? 'Page Not Found' : 'Oops! Something went wrong'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isNotFound
            ? "The page you're looking for doesn't exist."
            : errorMessage}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
