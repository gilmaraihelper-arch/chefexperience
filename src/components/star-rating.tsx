'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  reviewCount
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < Math.floor(rating) 
                ? 'fill-amber-400 text-amber-400' 
                : i < rating 
                  ? 'fill-amber-400/50 text-amber-400' 
                  : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">
          ({reviewCount} avaliações)
        </span>
      )}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRatingInput({ 
  value, 
  onChange, 
  size = 'md' 
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = hoverValue !== null 
          ? starValue <= hoverValue 
          : starValue <= value;

        return (
          <button
            key={i}
            type="button"
            className="transition-transform hover:scale-110 focus:outline-none"
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'fill-gray-200 text-gray-200 hover:text-amber-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
