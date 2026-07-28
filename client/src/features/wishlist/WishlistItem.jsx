import { useNavigate } from 'react-router-dom';
import { FaTrash, FaStar } from 'react-icons/fa';

import useRemoveProduct from './useRemoveProduct';
import IconButton from '../../ui/IconButton';

function WishlistItem({ product }) {
  const navigate = useNavigate();
  const { removeProduct, isLoading: isRemoving } = useRemoveProduct();

  const colors = [
    ...new Map(
      product.variants.map((v) => [v.color.name.toLowerCase(), v.color]),
    ).values(),
  ];

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const inStock = product.variants.some((v) => v.quantity > 0);

  return (
    <div className="group flex items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Clickable section */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="flex flex-1 cursor-pointer gap-5"
      >
        {/* Image */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={product.imageCover}
            alt={product.name}
            className="h-24 w-24 object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <h2 className="truncate text-lg font-semibold text-gray-900">
              {product.name}
            </h2>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {product.price} EGP
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              {product.ratingsQuantity > 0 && (
                <div className="flex items-center gap-1 text-gray-600">
                  <FaStar size={13} className="text-yellow-400" />
                  <span>
                    {product.ratingsAverage} ({product.ratingsQuantity})
                  </span>
                </div>
              )}

              <span
                className={`font-medium ${
                  inStock ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Colors
              </span>

              <div className="flex gap-2">
                {colors.map((color) => (
                  <span
                    key={color.name}
                    title={color.name}
                    className="h-5 w-5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Sizes
              </span>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete */}
      <IconButton
        variant="danger"
        disabled={isRemoving}
        onClick={() => removeProduct(product._id)}
        aria-label="Remove product"
      >
        <FaTrash className="h-3.5 w-3.5" />
      </IconButton>
    </div>
  );
}

export default WishlistItem;
