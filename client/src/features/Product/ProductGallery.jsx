import { useMemo, useState } from 'react';

function ProductGallery({ product, compact = false }) {
  const [activeImage, setActiveImage] = useState(null);

  const productImages = useMemo(() => {
    if (!product) return [];
    return [{ url: product.imageCover }, ...(product.images || [])];
  }, [product]);

  const displayedImage = activeImage || product?.imageCover;

  if (!product) return null;

  if (compact) {
    return (
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="flex items-center justify-center rounded-xl bg-gray-100 p-4">
          <img
            src={displayedImage}
            alt={product.name}
            className="h-[420px] w-full object-contain transition duration-300 hover:scale-105"
          />
        </div>

        {/* Thumbnails */}
        {productImages.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            {productImages.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(img.url)}
                className={`h-16 w-16 overflow-hidden rounded-lg border transition ${
                  displayedImage === img.url
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={img.url}
                  alt={`${product.name}-${index}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {productImages.map((img, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveImage(img.url)}
            className={`h-16 w-16 overflow-hidden rounded-lg border transition ${
              displayedImage === img.url
                ? 'border-black'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <img
              src={img.url}
              alt={`${product.name}-${index}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex h-[520px] w-full items-center justify-center overflow-hidden rounded-2xl border bg-white">
        <img
          src={displayedImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}

export default ProductGallery;
