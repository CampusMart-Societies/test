import React, { useMemo } from 'react';
import { User } from '../../types';
import { StarRating } from '../StarRating';

interface ReviewsSectionProps {
  user: User;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = React.memo(({ user }) => {
  const { reviewsReceived } = user;

  const stats = useMemo(() => {
    if (reviewsReceived.length === 0) {
      return { avg: 0, count: 0 };
    }
    const total = reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    return {
      avg: total / reviewsReceived.length,
      count: reviewsReceived.length,
    };
  }, [reviewsReceived]);

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Reviews</h3>

      <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Overall Rating</h4>
        {stats.count > 0 ? (
          <div className="flex items-center gap-3">
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.avg.toFixed(1)}</p>
            <div>
              <StarRating rating={stats.avg} size="h-5 w-5" />
              <p className="text-sm text-slate-500 dark:text-slate-400">from {stats.count} reviews</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No reviews yet.</p>
        )}
      </div>

      {reviewsReceived.length > 0 ? (
        <div className="space-y-6">
          {reviewsReceived.map(review => (
            <div key={review.id} className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 dark:text-primary-400 font-bold text-lg overflow-hidden flex-shrink-0">
                  {review.reviewerProfilePictureUrl ? (
                    <img src={review.reviewerProfilePictureUrl} alt={review.reviewerName} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(review.reviewerName)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{review.reviewerName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(review.postedDate).toLocaleDateString()}</p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-xl">
          <p className="font-medium">You haven't received any reviews yet.</p>
          <p className="text-sm mt-1">Sell items to start getting feedback from buyers!</p>
        </div>
      )}
    </div>
  );
});