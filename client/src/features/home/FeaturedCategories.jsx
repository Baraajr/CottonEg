import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Men',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=men',
  },
  {
    name: 'Women',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=women',
  },
  {
    name: 'Kids',
    image:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
    link: '/products?gender=kids',
  },
];

function FeaturedCategories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Shop by Category
          </h2>

          <p className="mt-3 text-gray-600">
            Discover collections designed for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative h-[420px] overflow-hidden rounded-2xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition group-hover:from-black/80" />

              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-bold text-white">
                  {category.name}
                </h3>

                <span className="mt-4 inline-flex items-center border border-white px-5 py-2 text-sm font-medium text-white transition-all duration-300 group-hover:bg-white group-hover:text-black">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;
