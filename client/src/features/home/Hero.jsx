import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/1.png';
import heroImage2 from '../../assets/images/2.png'; // for mobile

const slide = {
  subtitle: 'NEW COLLECTION',
  title: 'Timeless Essentials',
  description: 'Premium cotton pieces made for everyday living.',
  image: heroImage,
  mobileImage: heroImage2,
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
    <section className="relative md:h-dvh h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Desktop Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
      />

      {/* Mobile Image */}
      <img
        src={slide.mobileImage}
        alt={slide.title}
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent md:bg-linear-to-r md:from-black/55 md:via-black/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-5 pb-12 sm:px-6 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="max-w-lg text-white">
            <p className="mb-3 text-[11px] font-medium tracking-[0.35em] sm:mb-4">
              {slide.subtitle}
            </p>

            <h1 className="mb-4 text-4xl font-medium leading-[0.95] tracking-tight sm:mb-5 sm:text-6xl md:text-7xl lg:text-8xl">
              {slide.title}
            </h1>

            <p className="mb-6 max-w-md text-sm leading-6 text-white/85 sm:mb-8 sm:text-base">
              {slide.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {slide.actions.map((action, index) => (
                <Link
                  key={action.text}
                  to={action.link}
                  className={`flex h-12 w-full sm:w-auto sm:min-w-36 items-center justify-center px-7 text-xs font-medium uppercase tracking-wide transition ${
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
