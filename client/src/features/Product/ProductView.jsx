import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../services/products';
import Spinner from '../../ui/Spinner';
import ProductGallery from './ProductGallery';
import ProductPurchase from './ProductPurchase';
import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import AddReviewForm from './AddReviewForm';
import RatingStars from '../../ui/RatingStars';

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
  if (error) return <p className="py-10 text-center">Failed to load product</p>;

  return (
    <Modal>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Gallery + Purchase */}
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="lg:flex-1">
            <ProductGallery product={product} compact={width < 1024} />
          </div>
          <div className="lg:flex-1">
            <ProductPurchase product={product} compact={width < 1024} />
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Product Details
          </h2>

          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
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
        </div>

        {/* Reviews */}
        <section className="mt-20 border-t pt-12">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                Customer feedback
              </p>

              <h2 className="mt-2 text-3xl font-medium tracking-tight">
                Reviews
              </h2>

              <p className="mt-2 text-sm text-gray-500">
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

          {/* Rating summary */}
          <div className="mt-10 grid gap-8 rounded-2xl bg-gray-50 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <div className="flex items-center gap-5 sm:block">
              <div className="text-5xl font-medium tracking-tight">
                {product.ratingsAverage?.toFixed(1) || '0.0'}
              </div>

              <div className="mt-1">
                <RatingStars rating={product.ratingsAverage || 0} />

                <p className="mt-1 text-xs text-gray-500">
                  {product.ratingsQuantity} verified review
                  {product.ratingsQuantity !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating bars */}
            <div className="max-w-md space-y-2">
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
                    <span className="w-3 text-gray-500">{rating}</span>

                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-black transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-5 text-right text-gray-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews list */}
          <div className="mt-8 max-w-4xl space-y-4">
            {product.reviews?.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-300 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.user.profileImg}
                      alt={review.user.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.user.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
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

                  <div className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    <RatingStars rating={review.ratings} />
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-white px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {review.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state */}
          {!product.reviews?.length && (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-200 py-14 text-center">
              <p className="font-medium">No reviews yet</p>

              <p className="mt-1 text-sm text-gray-500">
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
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default ProductView;
