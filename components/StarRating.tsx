import React from 'react';
import { StarIcon } from './icons/Icons';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: string;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = React.memo(({ rating, setRating, size = 'h-5 w-5', className }) => {
  const isInteractive = !!setRating;

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={starValue}
            className={`
              ${size}
              ${starValue <= rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}
              ${isInteractive ? 'cursor-pointer transition-transform hover:scale-125' : ''}
            `}
            onClick={isInteractive ? () => setRating(starValue) : undefined}
          />
        );
      })}
    </div>
  );
});