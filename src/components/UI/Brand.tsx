import React from 'react';

type BrandProps = {
  className?: string;
  subtle?: boolean; // when true, use smaller, subtler styling
};

const Brand: React.FC<BrandProps> = ({ className = '', subtle = false }) => {
  const base = subtle
    ? 'text-lg font-extrabold tracking-tight'
    : 'text-2xl sm:text-3xl font-extrabold tracking-tight';

  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-vertex-blue-600 to-vertex-cyan drop-shadow-sm ${base} ${className}`}
    >
      Vertex
    </span>
  );
};

export default Brand;
