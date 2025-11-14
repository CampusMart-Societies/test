import React, { useState } from 'react';
import { Item, User, Review } from '../types';
import { Button } from './Button';
import { XMarkIcon } from './icons/Icons';
import { StarRating } from './StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onAddReview: (reviewData: Omit<Review, 'id' | 'postedDate' | 'reviewerId' | 'reviewerName' | 'reviewerProfilePictureUrl'> & { revieweeId: string }) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = React.memo(({ isOpen, onClose, item, onAddReview, showToast }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      showToast('Please leave a comment.');
      return;
    }

    onAddReview({
      revieweeId: item.sellerId,
      itemId: item.id,
      rating,
      comment,
    });
    
    // Reset state and close
    setRating(0);
    setComment('');
    onClose();
  };
  
  const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
  const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leave a Review</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">For "{item.title}"</p>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={formLabelClass}>Your Rating</label>
            <StarRating rating={rating} setRating={setRating} size="h-8 w-8" className="mt-2" />
          </div>
          <div>
            <label htmlFor="comment" className={formLabelClass}>Your Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className={formInputClass}
              rows={4}
              placeholder={`Share your experience with ${item.seller}...`}
              required
            ></textarea>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </div>
    </div>
  );
});