import React from 'react';

export const SkeletonLoader = ({ height = '120px', count = 1 }) => {
  return (
    <div className="d-flex flex-column gap-3 w-100">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card-static w-100 p-4 position-relative overflow-hidden"
          style={{ height, opacity: 0.6 }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
