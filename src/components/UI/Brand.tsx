import React from 'react';

type BrandProps = {
  className?: string;
  subtle?: boolean; // when true, use smaller, subtler styling
};

const Brand: React.FC<BrandProps> = ({ className = '', subtle = false }) => {
  const size = subtle ? 'h-6 sm:h-7' : 'h-8 sm:h-10';

  return (
    <img
      src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/405b6af4-fc2b-4340-a894-ac812f27e041-bull-svgrepo-com%20(1).png"
      alt="BullionFX"
      className={`${size} ${className}`}
    />
  );
};

export default Brand;
