import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/Hero1.jfif';

const slide = {
  subtitle: 'NEW COLLECTION',
  title: 'Timeless Essentials',
  description: 'Premium cotton pieces made for everyday living.',
  image: heroImage,
  actions: [
    {
      text: 'Shop Men',
      link: '/products?gender=men',
    },
    {
      text: 'Shop Women',
      link: '/products?gender=women',
    },
  ],
};

function Hero() {
  return (
    <section className="relative h-[calc(100vh-72px)] min-h-150 max-h-225 overflow-hidden">
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 h-full w-full object-fit object-center"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="max-w-lg text-white">
            <p className="mb-4 text-[11px] font-medium tracking-[0.35em]">
              {slide.subtitle}
            </p>

            <h1 className="mb-5 text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {slide.title}
            </h1>

            <p className="mb-8 max-w-md text-sm leading-6 text-white/85 sm:text-base">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {slide.actions.map((action, index) => (
                <Link
                  key={action.text}
                  to={action.link}
                  className={`flex h-12 min-w-36 items-center justify-center px-7 text-xs font-medium uppercase tracking-wide transition ${
                    index === 0
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'border border-white/80 bg-black/10 text-white backdrop-blur-sm hover:bg-white hover:text-black'
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
