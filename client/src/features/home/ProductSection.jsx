import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from '../../ui/Button';

import ProductCard from '../../ui/ProductCard';
import Spinner from '../../ui/Spinner';
import useProducts from '../../hooks/useProducts';
import IconButton from '../../ui/IconButton';

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
    watchDrag: products.length > 4, // optional
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

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>

            {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          </div>

          <Link
            to={viewAllLink}
            className="hidden font-medium hover:underline md:block"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="
                        min-w-0
                        flex-[0_0_85%]
                        px-2
                        sm:flex-[0_0_50%]
                        lg:flex-[0_0_25%]
                      "
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {canScrollPrev && (
                <IconButton
                  size="lg"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="bg-white! absolute! left-4! top-[43%]! z-10! -translate-y-"
                >
                  <FaChevronLeft className="text-sm" />
                </IconButton>
              )}

              {canScrollNext && (
                <IconButton
                  size="lg"
                  onClick={() => emblaApi?.scrollNext()}
                  className="!bg-white !absolute !right-4 !top-[43%] z-10! !-translate-y-1/2"
                >
                  <FaChevronRight className="text-sm" />
                </IconButton>
              )}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                to={viewAllLink}
                className="inline-flex rounded-lg border px-6 py-3 font-medium transition hover:bg-black hover:text-white"
              >
                View All
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;
