import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaHeart, FaRegHeart, FaRegImage } from 'react-icons/fa';

import useWishlist from '../features/wishlist/useWishlist';
import useAddToWishlist from '../hooks/useAddToWishlist';
import Modal from './Modal';
import ProductGallery from '../features/Product/ProductGallery';
import ProductPurchase from '../features/Product/ProductPurchase';
import useUser from '../hooks/useUser';
import useRemoveProduct from '../features/wishlist/useRemoveProduct';

// Supports strings or { url } objects
const toUrl = (img) => (typeof img === 'string' ? img : img?.url);

function ProductCard({ product }) {
  const { addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { removeProduct, isPending: isRemoving } = useRemoveProduct();
  const { data } = useUser();
  const user = data?.data;

  const { data: wishlistData } = useWishlist({
    enabled: user?.role === 'user',
  });

  const [coverFailed, setCoverFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const wishlist = wishlistData?.data || [];
  const isInWishlist = wishlist.some((item) => item._id === product._id);
  const isWishlistPending = isAdding || isRemoving;

  // Pricing
  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const finalPrice = hasDiscount ? product.priceAfterDiscount : product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
    : 0;

  // Images
  const cover = toUrl(product.imageCover) || toUrl(product.images?.[0]);
  const hoverImage = Array.isArray(product.images)
    ? product.images.map(toUrl).find((url) => url && url !== cover)
    : undefined;

  const showCover = Boolean(cover) && !coverFailed;
  const showHover = showCover && Boolean(hoverImage) && !hoverFailed;

  const outOfStock = product.quantity === 0;

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) removeProduct(product._id);
    else addToWishlist(product._id);
  }

  return (
    <Modal>
      <article className="group overflow-hidden border border-border bg-background transition-all duration-300 hover:border-foreground/30">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          <Link
            to={`/product/${product._id}`}
            aria-label={`View ${product.name}`}
            className="block h-full w-full"
          >
            {showCover ? (
              <img
                src={cover}
                alt={product.name}
                loading="lazy"
                onError={() => setCoverFailed(true)}
                className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                  showHover ? 'group-hover:opacity-0' : ''
                }`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface text-muted-foreground">
                <FaRegImage className="text-4xl" />
              </div>
            )}

            {showHover && (
              <img
                src={hoverImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                onError={() => setHoverFailed(true)}
                className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          {/* Discount */}
          {discount > 0 && (
            <span className="pointer-events-none absolute left-3 top-3 bg-foreground px-2.5 py-1 text-[10px] font-semibold tracking-wide text-background">
              -{discount}%
            </span>
          )}

          {/* Out of stock */}
          {outOfStock && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <span className="border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground">
                Sold out
              </span>
            </div>
          )}

          {/* Wishlist */}
          <button
            type="button"
            aria-label={
              isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
            }
            aria-pressed={isInWishlist}
            disabled={isWishlistPending}
            onClick={handleWishlist}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-border/50 bg-background/95 text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${
              isInWishlist ? 'md:opacity-100' : ''
            }`}
          >
            {isInWishlist ? (
              <FaHeart className="text-sm" />
            ) : (
              <FaRegHeart className="text-sm" />
            )}
          </button>

          {/* Quick add */}
          {!outOfStock && (
            <>
              <Modal.Open opens={product.name}>
                <button
                  type="button"
                  aria-label={`Quick add ${product.name} to cart`}
                  className="absolute bottom-3 left-3 right-3 flex h-10 items-center justify-center gap-2 bg-background text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  <FaCartPlus className="text-sm" />
                  <span>Add to Cart</span>
                </button>
              </Modal.Open>

              <Modal.Window name={product.name}>
                <div className="flex flex-col gap-6">
                  <ProductGallery product={product} compact />
                  <ProductPurchase
                    product={product}
                    compact
                    showWishlist={false}
                  />
                </div>
              </Modal.Window>
            </>
          )}
        </div>

        {/* Product details */}
        <div className="p-3.5 sm:p-4">
          {product.category?.name && (
            <p className="mb-1.5 truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {product.category.name}
            </p>
          )}

          <h3 className="line-clamp-2 min-h-10 font-display text-sm font-medium leading-5 text-foreground sm:text-base">
            <Link
              to={`/product/${product._id}`}
              className="transition-colors hover:text-muted-foreground"
            >
              {product.name}
            </Link>
          </h3>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground sm:text-base">
              ${finalPrice}
            </span>

            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </article>
    </Modal>
  );
}

export default ProductCard;
