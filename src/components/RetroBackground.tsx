import React from 'react';

export const RetroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0f172a]">
      {/* Dynamic mesh gradients for Frosted Glass feel */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 20% 30%, #312e81 0%, transparent 45%), radial-gradient(circle at 80% 20%, #5b21b6 0%, transparent 45%), radial-gradient(circle at 50% 80%, #1e1b4b 0%, transparent 55%)'
        }}
      />
      {/* Decorative floating ambient highlights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse duration-10000 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse duration-8000 pointer-events-none" />
    </div>
  );
};
