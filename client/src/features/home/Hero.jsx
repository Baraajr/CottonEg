import { Link } from 'react-router-dom';
import { HiArrowUpRight } from 'react-icons/hi2';

import heroImage from '../../assets/images/1.png';
import heroImage2 from '../../assets/images/2.png';

const slide = {
  subtitle: 'THE NEW SEASON · 2026',
  title: 'Timeless\nEssentials.',
  description:
    'Premium cotton pieces, thoughtfully designed for everyday living.',
  image: heroImage,
  mobileImage: heroImage2,
  actions: [
    { text: 'Shop Men', link: '/products?gender=men' },
    { text: 'Shop Women', link: '/products?gender=women' },
  ],
};

function Hero() {
  return (
    <section className="relative h-[calc(100dvh-4rem)] min-h-[560px] overflow-hidden bg-black md:h-dvh">
      {/* Desktop image */}
      <img
        src={slide.image}
        alt={slide.title.replace('\n', ' ')}
        className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
      />

      {/* Mobile image */}
      <img
        src={slide.mobileImage}
        alt={slide.title.replace('\n', ' ')}
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-400 items-end px-5 pb-14 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div className="max-w-3xl text-white">
          <div className="mb-5 flex items-center gap-3 sm:mb-7">
            <span className="h-px w-8 bg-white" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-xs">
              {slide.subtitle}
            </p>
          </div>

          <h1 className="whitespace-pre-line font-display text-[clamp(3.8rem,9vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.055em]">
            {slide.title}
          </h1>

          <p className="mt-6 max-w-sm text-sm leading-6 text-white/75 sm:mt-7 sm:text-base sm:leading-7">
            {slide.description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-3">
            {slide.actions.map((action, index) => (
              <Link
                key={action.text}
                to={action.link}
                className={`group flex h-12 items-center justify-center gap-5 px-7 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                  index === 0
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'border border-white/70 bg-black/10 text-white hover:bg-white hover:text-black'
                }`}
              >
                {action.text}
                <HiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom detail */}
      <div className="absolute bottom-7 right-8 z-10 hidden items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] text-white/70 md:flex lg:right-16">
        <span>Designed for everyday</span>
        <span className="h-px w-9 bg-white/60" />
        <span>01 / 01</span>
      </div>
    </section>
  );
}

export default Hero;
