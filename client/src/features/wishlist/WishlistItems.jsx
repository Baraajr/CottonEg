import Spinner from '../../ui/Spinner';
import useWishlist from './useWishlist';
import WishlistItem from './WishlistItem';

function WishlistItems() {
  const { data, isLoading, error } = useWishlist();

  if (isLoading) return <Spinner />;

  if (error)
    return (
      <p className="text-center text-red-500 py-6">Failed to load wishlist</p>
    );

  const wishlist = data?.data;

  if (!wishlist?.length)
    return (
      <h1 className="text-center text-xl py-14 text-gray-600">
        Start adding products to your wishlist
      </h1>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Items */}
      <div className="flex flex-col gap-4">
        {wishlist?.map((product) => (
          <WishlistItem product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
}

export default WishlistItems;
