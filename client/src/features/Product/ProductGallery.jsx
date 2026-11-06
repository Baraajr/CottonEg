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
      className={`group relative flex ${heightClass} w-full cursor-zoom-in items-center justify-center overflow-hidden border border-border bg-surface`}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-accent" />}

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

      {/* Image Counter */}
      {hasMultiple && (
        <span className="pointer-events-none absolute bottom-3 left-3 bg-background/90 px-3 py-1.5 text-[10px] font-medium tracking-wider text-foreground backdrop-blur-sm">
          {activeIndex + 1} / {productImages.length}
        </span>
      )}

      {/* Expand */}
      <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-border bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
        <FaExpand size={14} />
      </span>

      {/* Navigation */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-background/90 text-foreground opacity-0 transition-all duration-200 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FaChevronLeft size={14} />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-background/90 text-foreground opacity-0 transition-all duration-200 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FaChevronRight size={14} />
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
          ? 'flex-wrap justify-center'
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
            className={`relative h-16 w-16 shrink-0 overflow-hidden border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              active
                ? 'border-primary'
                : 'border-border hover:border-foreground'
            }`}
          >
            <img
              src={img.url}
              alt=""
              className={`h-full w-full object-cover transition-opacity duration-200 ${
                active ? 'opacity-100' : 'opacity-60 hover:opacity-100'
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black sm:right-6 sm:top-6"
      >
        <FaTimes size={17} />
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
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black sm:left-6 sm:h-12 sm:w-12"
          >
            <FaChevronLeft size={17} />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black sm:right-6 sm:h-12 sm:w-12"
          >
            <FaChevronRight size={17} />
          </button>
        </>
      )}

      <img
        src={displayed.url}
        alt={product.name}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[85vw] object-contain"
      />

      {hasMultiple && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/80">
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

  if (!product || !displayed) return null;

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
      <div className="flex min-w-0 flex-col gap-3">
        <MainFrame heightClass="aspect-square" {...mainFrameProps} />

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
    <div className="flex min-w-0 gap-4">
      {hasMultiple && (
        <Thumbnails
          direction="col"
          productImages={productImages}
          activeIndex={activeIndex}
          onSelect={goTo}
        />
      )}

      <div className="min-w-0 flex-1">
        <MainFrame
          heightClass="aspect-square max-h-[620px]"
          {...mainFrameProps}
        />
      </div>

      <Lightbox {...lightboxProps} />
    </div>
  );
}

export default ProductGallery;
