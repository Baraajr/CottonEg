import { useNavigate } from 'react-router-dom';
import { FaCartPlus, FaHeart, FaRegHeart } from 'react-icons/fa';
import useWishlist from '../features/wishlist/useWishlist';
import useAddToWishlist from '../hooks/useAddToWishlist';
import Modal from './Modal';
import ProductGallery from '../features/Product/ProductGallery';
import ProductPurchase from '../features/Product/ProductPurchase';
import useUser from '../hooks/useUser';

function ProductCard({ product }) {
  const { addToWishlist, isPending } = useAddToWishlist();
  const navigate = useNavigate();
  const { data } = useUser();
  const user = data?.data;
  const { data: wishlistData } = useWishlist({
    enabled: user?.role === 'user',
  });

  const wishlist = wishlistData?.data || [];

  const isInWishlist = wishlist.some((item) => item._id === product._id);

  return (
    <Modal>
      <div className="group bg-grey-50  overflow-hidden border border-gray-100 hover:shadow-lg transition">
        {/* IMAGE */}
        <div
          onClick={(e) => {
            if (e.target.closest('button')) return;
            navigate(`/product/${product._id}`);
          }}
          className="relative aspect-3/4 bg-gray-50 overflow-hidden cursor-pointer"
        >
          <img
            onClick={() => navigate(`/product/${product._id}`)}
            src={product.imageCover}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />

          {/* Wishlist */}
          <button
            disabled={isPending}
            onClick={(e) => {
              e.stopPropagation();
              if (!isInWishlist) addToWishlist(product._id);
            }}
            className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm shadow-md transition-all duration-300
    ${
      isInWishlist
        ? 'bg-red-50 text-red-500'
        : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500 hover:scale-110 hover:shadow-xl'
    }
    md:opacity-0 md:group-hover:opacity-100`}
          >
            {isInWishlist ? (
              <FaHeart className="text-lg" />
            ) : (
              <FaRegHeart className="text-lg" />
            )}
          </button>

          {/* Add to Cart */}
          <Modal.Open opens={product.name}>
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-1/2 flex  -translate-x-1/2 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white shadow-lg opacity-95 transition-all duration-300 hover:-translate-x-1/2 hover:-translate-y-1 hover:bg-gray-900 hover:shadow-2xl active:translate-y-0 md:opacity-0 md:group-hover:opacity-100"
            >
              <FaCartPlus className="text-base" />
              <span className="hidden lg:block">Add to Cart</span>
            </button>
          </Modal.Open>
          <Modal.Window name={product.name}>
            <div className="flex flex-col gap-6">
              <ProductGallery product={product} compact />
              <ProductPurchase product={product} compact showWishlist={false} />
            </div>
          </Modal.Window>
        </div>

        {/* TEXT */}
        <div className="p-3 text-center">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-1 flex items-center justify-center gap-2">
            {product.priceAfterDiscount &&
            product.priceAfterDiscount < product.price ? (
              <>
                <p className="text-base font-semibold text-black">
                  ${product.priceAfterDiscount}
                </p>

                <p className="text-sm text-gray-400 line-through">
                  ${product.price}
                </p>
              </>
            ) : (
              <p className="text-base font-semibold text-black">
                ${product.price}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProductCard;
