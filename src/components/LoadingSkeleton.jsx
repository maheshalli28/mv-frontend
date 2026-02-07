import React from 'react';
import './LoadingSkeleton.css';

// Skeleton loading component for tables
export const TableSkeleton = ({ rows = 10, columns = 6 }) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          {[...Array(columns)].map((_, i) => (
            <th key={i}>
              <div className="skeleton skeleton-text" style={{ height: '20px', width: '80%' }}></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, i) => (
          <tr key={i}>
            {[...Array(columns)].map((_, j) => (
              <td key={j}>
                <div className="skeleton skeleton-text" style={{ height: '16px', width: '90%' }}></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Skeleton for stats cards
export const StatsSkeleton = ({ count = 4 }) => (
  <div className="row g-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="col-md-3">
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: "1.5rem 1rem",
          textAlign: "center"
        }}>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '60%', margin: '0 auto 15px', borderRadius: '4px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '32px', width: '45%', margin: '0 auto', borderRadius: '4px' }}></div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for customer profile
export const ProfileSkeleton = () => (
  <div className="card">
    <div className="card-body">
      <div className="row">
        <div className="col-md-6">
          <div className="skeleton skeleton-text" style={{ height: '20px', width: '30%', marginBottom: '15px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '80%', marginBottom: '10px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '70%', marginBottom: '10px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '90%', marginBottom: '10px' }}></div>
        </div>
        <div className="col-md-6">
          <div className="skeleton skeleton-text" style={{ height: '20px', width: '30%', marginBottom: '15px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '75%', marginBottom: '10px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '85%', marginBottom: '10px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '65%', marginBottom: '10px' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Generic skeleton component
export const Skeleton = ({ width = '100%', height = '20px', className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height }}
  ></div>
);

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className="text-center">
        <div className={`spinner-border text-primary ${sizeClass}`} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {text && <div className="mt-2 text-muted">{text}</div>}
      </div>
    </div>
  );
};

// Error component
export const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => (
  <div className="alert alert-danger d-flex align-items-center" role="alert">
    <div className="flex-grow-1">
      <strong>Error:</strong> {message}
    </div>
    {onRetry && (
      <button
        className="btn btn-outline-danger btn-sm ms-3"
        onClick={onRetry}
      >
        Retry
      </button>
    )}
  </div>
);
