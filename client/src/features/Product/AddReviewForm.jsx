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
      {/* Rating */}
      <div>
        <label className="mb-3 block text-sm font-medium">Your rating</label>

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
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="review-title"
          className="mb-3 block text-sm font-medium"
        >
          Review
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
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error.message || 'Failed to submit review'}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
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
        >
          {isPending ? 'Submitting...' : 'Submit review'}
        </Button>
      </div>
    </form>
  );
}

export default AddReviewForm;
