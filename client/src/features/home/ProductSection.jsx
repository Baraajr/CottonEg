import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import ProductCard from '../../ui/ProductCard';
import Spinner from '../../ui/Spinner';
import IconButton from '../../ui/IconButton';
import useProducts from '../../hooks/useProducts';

function ProductsSection({
  title,
  subtitle,
  filters = {},
  viewAllLink = '/products',
}) {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 8,
    ...filters,
  });

  const products = data?.data || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    loop: false,
    watchDrag: products.length > 4,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const controlClass =
    '!static !translate-y-0 !rounded-full !border !border-border !bg-transparent !text-foreground transition-all hover:!border-foreground hover:!bg-foreground hover:!text-background disabled:!opacity-30';

  return (
    <section className="bg-background py-14 sm:py-18 lg:py-22">
      <div className="mx-auto max-w-400 px-5 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-7 bg-foreground" />
              <span className="section-label">Curated for you</span>
            </div>

            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop controls */}
          <div className="hidden shrink-0 items-center gap-5 md:flex">
            <Link
              to={viewAllLink}
              className="group flex items-center gap-2 border-b border-foreground pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:text-muted-foreground"
            >
              View collection
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            {!isLoading && products.length > 0 && (
              <div className="flex gap-2">
                <IconButton
                  size="lg"
                  disabled={!canScrollPrev}
                  onClick={() => emblaApi?.scrollPrev()}
                  className={`${controlClass} h-9! w-9!`}
                  aria-label="Previous products"
                >
                  <FaChevronLeft className="text-[10px]" />
                </IconButton>

                <IconButton
                  size="lg"
                  disabled={!canScrollNext}
                  onClick={() => emblaApi?.scrollNext()}
                  className={`${controlClass} h-9! w-9!`}
                  aria-label="Next products"
                >
                  <FaChevronRight className="text-[10px]" />
                </IconButton>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <div className="border-y border-border py-14 text-center">
            <p className="font-display text-2xl text-foreground">
              Nothing here just yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for new arrivals.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="-ml-3 flex sm:-ml-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="min-w-0 flex-[0_0_82%] pl-3 sm:flex-[0_0_50%] sm:pl-4 lg:flex-[0_0_25%]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile controls */}
            <div className="mt-5 flex items-center justify-between md:hidden">
              <Link
                to={viewAllLink}
                className="border-b border-foreground pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground"
              >
                View collection →
              </Link>

              <div className="flex gap-2">
                <IconButton
                  size="lg"
                  disabled={!canScrollPrev}
                  onClick={() => emblaApi?.scrollPrev()}
                  className={`${controlClass} h-9! w-9!`}
                  aria-label="Previous products"
                >
                  <FaChevronLeft className="text-[10px]" />
                </IconButton>

                <IconButton
                  size="lg"
                  disabled={!canScrollNext}
                  onClick={() => emblaApi?.scrollNext()}
                  className={`${controlClass} h-9! w-9!`}
                  aria-label="Next products"
                >
                  <FaChevronRight className="text-[10px]" />
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;
