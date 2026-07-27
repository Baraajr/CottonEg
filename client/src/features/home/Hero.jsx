import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    subtitle: 'NEW COLLECTION',
    title: 'Timeless Essentials',
    description:
      'Premium cotton clothing designed for everyday comfort and effortless style.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80',
    actions: [
      {
        text: 'Shop Men',
        link: '/products?gender=men',
      },
      {
        text: 'Shop Women',
        link: '/products?gender=women',
      },
      {
        text: 'Shop Kids',
        link: '/products?gender=kids',
      },
    ],
  },
];

function Hero() {
  const slide = slides[0];

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-xs font-semibold tracking-[0.35em] uppercase">
              {slide.subtitle}
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              {slide.title}
            </h1>

            <p className="mb-10 text-base text-gray-200 md:text-lg">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {slide.actions.map((action, index) => (
                <Link
                  key={action.text}
                  to={action.link}
                  className={`flex h-12 min-w-[160px] items-center justify-center px-8 text-sm font-semibold transition ${
                    index === 0
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'border border-white text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {action.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
