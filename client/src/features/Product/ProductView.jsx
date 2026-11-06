import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getProduct } from '../../services/products';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import RatingStars from '../../ui/RatingStars';

import ProductGallery from './ProductGallery';
import ProductPurchase from './ProductPurchase';
import AddReviewForm from './AddReviewForm';

function ProductView({ productId: propId }) {
  const { productId: paramId } = useParams();

  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const productId = propId || paramId;

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  });

  const product = data?.data;

  if (isLoading) return <Spinner />;

  if (error || !product)
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Failed to load product</p>
      </div>
    );

  return (
    <Modal>
      <div className="mx-auto min-h-screen w-full max-w-360 px-4 py-7 sm:px-8 sm:py-10 lg:px-12">
        {/* Gallery + Purchase */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <ProductGallery product={product} compact={width < 1024} />
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <ProductPurchase product={product} compact={width < 1024} />
          </div>
        </div>

        {/* Product Details */}
        <section className="mt-12 border-t border-border pt-8 sm:mt-16 sm:pt-10">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Product information
              </span>

              <h2 className="mt-2 font-display text-2xl font-medium sm:text-3xl">
                Product Details
              </h2>
            </div>

            <p className="text-xs text-muted-foreground">
              Everything you need to know about this piece.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {product?.category?.name && (
              <Info label="Category" value={product.category.name} />
            )}

            {product?.subcategory?.name && (
              <Info label="Subcategory" value={product.subcategory.name} />
            )}

            {product?.gender && <Info label="Gender" value={product.gender} />}

            {product?.fit && <Info label="Fit" value={product.fit} />}

            {product?.material && (
              <Info label="Material" value={product.material} />
            )}

            {product?.season?.length > 0 && (
              <Info label="Season" value={product.season.join(', ')} />
            )}

            {product?.tags?.length > 0 && (
              <Info label="Tags" value={product.tags.join(', ')} />
            )}

            {product?.sold !== undefined && (
              <Info label="Sold" value={product.sold} />
            )}

            {product?.ratingsQuantity !== undefined && (
              <Info label="Reviews" value={product.ratingsQuantity} />
            )}

            {product?.featured !== undefined && (
              <Info label="Featured" value={product.featured ? 'Yes' : 'No'} />
            )}

            {product?.isActive !== undefined && (
              <Info label="Active" value={product.isActive ? 'Yes' : 'No'} />
            )}

            <Info label="Total Stock" value={product?.quantity ?? 0} />
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-14 border-t border-border pt-9 sm:mt-20 sm:pt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Customer feedback
              </span>

              <h2 className="mt-2 font-display text-3xl font-medium sm:text-4xl">
                Reviews
              </h2>

              <p className="mt-2 text-xs text-muted-foreground">
                {product.ratingsQuantity} review
                {product.ratingsQuantity !== 1 ? 's' : ''}
              </p>
            </div>

            <Modal.Open opens="Add-review">
              <Button type="button">Write a review</Button>
            </Modal.Open>

            <Modal.Window name="Add-review">
              <AddReviewForm productId={product._id} onCloseModal={() => {}} />
            </Modal.Window>
          </div>

          {/* Rating Summary */}
          <div className="mt-8 grid gap-7 border-y border-border py-7 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-12 sm:py-9">
            <div>
              <div className="font-display text-5xl font-medium tracking-tight">
                {product.ratingsAverage?.toFixed(1) || '0.0'}
              </div>

              <div className="mt-2">
                <RatingStars rating={product.ratingsAverage || 0} />

                <p className="mt-2 text-xs text-muted-foreground">
                  {product.ratingsQuantity} verified review
                  {product.ratingsQuantity !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating Bars */}
            <div className="max-w-lg space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  product.reviews?.filter(
                    (review) => Math.round(review.ratings) === rating,
                  ).length || 0;

                const percentage = product.ratingsQuantity
                  ? Math.round((count / product.ratingsQuantity) * 100)
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-3 text-xs">
                    <span className="w-3 text-muted-foreground">{rating}</span>

                    <div className="h-1.5 flex-1 overflow-hidden bg-accent">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-6 text-right tabular-nums text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="mt-7 max-w-4xl divide-y divide-border">
            {product.reviews?.map((review) => (
              <article key={review._id} className="py-6 first:pt-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={review.user?.profileImg || '/default-avatar.png'}
                      alt={review.user?.name || 'Deleted User'}
                      className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {review.user?.name || 'Deleted User'}
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <RatingStars rating={review.ratings} />
                  </div>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {review.title}
                </h3>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {!product.reviews?.length && (
            <div className="mt-7 border-y border-border py-12 text-center">
              <h3 className="font-display text-xl">No reviews yet</h3>

              <p className="mt-2 text-xs text-muted-foreground">
                Be the first to review this product.
              </p>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export default ProductView;
