import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from 'react-icons/fa';

function MainFrame({
  heightClass,
  frameRef,
  displayed,
  product,
  activeIndex,
  productImages,
  hasMultiple,
  isZooming,
  zoomOrigin,
  loaded,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onOpenLightbox,
  onLoadImage,
  onPrev,
  onNext,
}) {
  return (
    <div
      ref={frameRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={onOpenLightbox}
      className={`group relative flex ${heightClass} w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50`}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-100" />
      )}

      <img
        key={displayed.url}
        src={displayed.url}
        alt={`${product.name}${activeIndex ? ` — view ${activeIndex + 1}` : ''}`}
        onLoad={onLoadImage}
        style={isZooming ? { transformOrigin: zoomOrigin } : undefined}
        className={`h-full w-full object-contain transition-all duration-300 ease-out motion-reduce:transition-none ${
          isZooming ? 'scale-[1.8]' : 'scale-100'
        } ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Image counter */}
      {hasMultiple && (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
          {activeIndex + 1} / {productImages.length}
        </span>
      )}

      {/* FaExpand hint */}
      <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
        <FaExpand size={15} />
      </span>

      {/* Prev / Next arrows */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 opacity-0 shadow-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 opacity-0 shadow-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
          >
            <FaChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}

function Thumbnails({ direction, productImages, activeIndex, onSelect }) {
  return (
    <div
      className={`flex gap-2 ${
        direction === 'row'
          ? 'justify-center flex-wrap'
          : 'flex-col items-center'
      }`}
    >
      {productImages.map((img, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            aria-label={`View image ${index + 1}`}
            aria-current={active}
            onClick={() => onSelect(index)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
              active
                ? 'ring-2 ring-zinc-900'
                : 'ring-1 ring-zinc-200 hover:ring-zinc-400'
            }`}
          >
            <img
              src={img.url}
              alt=""
              className={`h-full w-full object-cover transition-opacity duration-200 ${
                active ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  open,
  product,
  displayed,
  activeIndex,
  productImages,
  hasMultiple,
  onClose,
  onPrev,
  onNext,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <FaTimes size={20} />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaChevronRight size={22} />
          </button>
        </>
      )}

      <img
        src={displayed.url}
        alt={product.name}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[88vw] object-contain"
      />

      {hasMultiple && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {activeIndex + 1} / {productImages.length}
        </span>
      )}
    </div>
  );
}

function ProductGallery({ product, compact = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);

  const productImages = useMemo(() => {
    if (!product) return [];
    return [{ url: product.imageCover }, ...(product.images || [])];
  }, [product]);

  const displayed = productImages[activeIndex] ?? productImages[0];
  const hasMultiple = productImages.length > 1;

  const goTo = useCallback(
    (i) => {
      setActiveIndex(() => {
        const len = productImages.length || 1;
        return (i + len) % len;
      });
      setLoaded(false);
    },
    [productImages.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goNext, goPrev]);

  const handleMouseMove = (e) => {
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  if (!product) return null;

  const mainFrameProps = {
    frameRef,
    displayed,
    product,
    activeIndex,
    productImages,
    hasMultiple,
    isZooming,
    zoomOrigin,
    loaded,
    onMouseEnter: () => setIsZooming(true),
    onMouseLeave: () => setIsZooming(false),
    onMouseMove: handleMouseMove,
    onOpenLightbox: () => setLightboxOpen(true),
    onLoadImage: () => setLoaded(true),
    onPrev: goPrev,
    onNext: goNext,
  };

  const lightboxProps = {
    open: lightboxOpen,
    product,
    displayed,
    activeIndex,
    productImages,
    hasMultiple,
    onClose: () => setLightboxOpen(false),
    onPrev: goPrev,
    onNext: goNext,
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        <MainFrame heightClass="h-[420px]" {...mainFrameProps} />
        {hasMultiple && (
          <Thumbnails
            direction="row"
            productImages={productImages}
            activeIndex={activeIndex}
            onSelect={goTo}
          />
        )}
        <Lightbox {...lightboxProps} />
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {hasMultiple && (
        <Thumbnails
          direction="col"
          productImages={productImages}
          activeIndex={activeIndex}
          onSelect={goTo}
        />
      )}
      <div className="flex-1">
        <MainFrame heightClass="h-[520px]" {...mainFrameProps} />
      </div>
      <Lightbox {...lightboxProps} />
    </div>
  );
}

export default ProductGallery;
