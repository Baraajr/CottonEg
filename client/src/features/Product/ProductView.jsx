import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../services/products';
import Spinner from '../../ui/Spinner';
import ProductGallery from './ProductGallery';
import ProductPurchase from './ProductPurchase';

function ProductView({ productId: propId }) {
  const { productId: paramId } = useParams();
  const productId = propId || paramId;

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  });

  const product = data?.data;

  if (isLoading) return <Spinner />;
  if (error) return <p className="py-10 text-center">Failed to load product</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Gallery + Purchase */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />

        <ProductPurchase product={product} />
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
    </div>
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
