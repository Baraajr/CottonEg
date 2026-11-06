import { useNavigate } from 'react-router-dom';
import { FaTrash, FaStar, FaArrowRight } from 'react-icons/fa';

import useRemoveProduct from './useRemoveProduct';

function WishlistItem({ product }) {
  const navigate = useNavigate();

  const { removeProduct, isLoading: isRemoving } = useRemoveProduct();

  const variants = product.variants || [];

  const colors = [
    ...new Map(
      variants
        .filter((v) => v.color?.name)
        .map((v) => [v.color.name.toLowerCase(), v.color]),
    ).values(),
  ];

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const inStock = variants.some((v) => v.quantity > 0);

  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  function handleRemove(e) {
    e.stopPropagation();
    removeProduct(product._id);
  }

  function goToProduct() {
    navigate(`/product/${product._id}`);
  }

  return (
    <article className="group flex gap-4 border-b border-border py-5 sm:gap-6 sm:py-6">
      {/* Product image */}
      <div
        onClick={goToProduct}
        className="relative aspect-3/4 w-28 shrink-0 cursor-pointer overflow-hidden bg-accent sm:w-36 md:w-40"
      >
        <img
          src={product.imageCover}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {!inStock && (
          <span className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
            Sold out
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
                CottonEg Collection
              </span>

              <h2
                onClick={goToProduct}
                className="mt-1.5 cursor-pointer font-serif text-base leading-snug text-foreground transition-colors hover:text-muted-foreground sm:text-lg"
              >
                {product.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label="Remove product from wishlist"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaTrash size={12} />
            </button>
          </div>

          {/* Price */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground sm:text-base">
              {hasDiscount
                ? `${product.priceAfterDiscount} EGP`
                : `${product.price} EGP`}
            </span>

            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {product.price} EGP
              </span>
            )}
          </div>

          {/* Rating and availability */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            {product.ratingsQuantity > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <FaStar size={11} />
                <span>
                  {product.ratingsAverage} ({product.ratingsQuantity})
                </span>
              </div>
            )}

            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  inStock ? 'bg-foreground' : 'bg-muted-foreground'
                }`}
              />
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Available colors */}
          {colors.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Colors
              </span>

              <div className="flex items-center gap-2">
                {colors.map((color) => (
                  <span
                    key={color.name}
                    title={color.name}
                    className="h-4 w-4 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available sizes */}
          {sizes.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Sizes
              </span>

              {sizes.map((size) => (
                <span
                  key={size}
                  className="border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View product */}
        <button
          type="button"
          onClick={goToProduct}
          className="mt-5 flex w-fit items-center gap-2 border-b border-foreground pb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground transition-all duration-300 hover:gap-4 sm:text-[10px]"
        >
          View Product
          <FaArrowRight size={10} />
        </button>
      </div>
    </article>
  );
}

export default WishlistItem;
