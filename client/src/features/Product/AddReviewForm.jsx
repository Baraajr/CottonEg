import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProductReview } from '../../services/products';
import RatingStars from '../../ui/RatingStars';
import Button from '../../ui/Button';

function AddReviewForm({ productId, onCloseModal }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    ratings: 0,
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data) => createProductReview(productId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });

      setFormData({
        title: '',
        ratings: 0,
      });

      onCloseModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.ratings) return;

    mutate({
      title: formData.title.trim(),
      ratings: formData.ratings,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      {/* Heading */}
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Customer feedback
        </span>

        <h2 className="mt-2 font-display text-2xl font-medium text-foreground">
          Write a Review
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Share your experience with this product.
        </p>
      </div>

      {/* Rating */}
      <div>
        <label className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-foreground">
          Your rating
        </label>

        <RatingStars
          rating={formData.ratings}
          interactive
          onChange={(rating) =>
            setFormData((prev) => ({
              ...prev,
              ratings: rating,
            }))
          }
        />

        {!formData.ratings && (
          <p className="mt-2 text-xs text-muted-foreground">
            Select a rating from 1 to 5 stars.
          </p>
        )}
      </div>

      {/* Review */}
      <div>
        <label
          htmlFor="review-title"
          className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-foreground"
        >
          Your review
        </label>

        <input
          id="review-title"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="Share your experience"
          maxLength={100}
          className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />

        <p className="mt-1.5 text-right text-[10px] text-muted-foreground">
          {formData.title.length}/100
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="border-l-2 border-primary bg-accent px-3 py-2 text-xs text-foreground">
          {error.message || 'Failed to submit review'}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCloseModal}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending || !formData.title.trim() || !formData.ratings}
          loading={isPending}
        >
          Submit review
        </Button>
      </div>
    </form>
  );
}

export default AddReviewForm;
