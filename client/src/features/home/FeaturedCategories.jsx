import { HiArrowUpRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Men',
    subtitle: 'EVERYDAY REDEFINED',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=men',
  },
  {
    name: 'Women',
    subtitle: 'EFFORTLESS EXPRESSION',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=women',
  },
  {
    name: 'Kids',
    subtitle: 'MADE FOR LITTLE MOMENTS',
    image:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=kids',
  },
];

function FeaturedCategories() {
  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-400 px-5 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-7 bg-foreground" />
              <span className="section-label">Explore our collections</span>
            </div>

            <h2 className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find your <span className="italic">style.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Thoughtfully selected essentials for every wardrobe and every
            generation.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative block overflow-hidden bg-surface"
            >
              <div className="aspect-[4/4.8] overflow-hidden sm:aspect-3/4">
                <img
                  src={category.image}
                  alt={`${category.name} collection`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Image overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

              {/* Card content */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6 lg:p-7">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-5 bg-white/70" />
                  <p className="text-[9px] font-medium tracking-[0.22em] text-white/75">
                    {category.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
                    {category.name}
                  </h3>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                    <HiArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </div>

                <div className="mt-5 h-px w-full bg-white/30">
                  <div className="h-full w-0 bg-white transition-all duration-500 group-hover:w-full" />
                </div>
              </div>

              <span className="absolute right-5 top-5 text-[10px] tracking-widest text-white/80">
                0{index + 1}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;
