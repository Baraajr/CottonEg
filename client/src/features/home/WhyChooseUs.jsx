import { FiTruck, FiRefreshCw, FiShield, FiAward } from 'react-icons/fi';

const features = [
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across Egypt.',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: 'Hassle-free returns and exchanges.',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    description: 'A safe and protected checkout experience.',
  },
  {
    icon: FiAward,
    title: 'Premium Quality',
    description: 'Thoughtfully selected pieces made to last.',
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-surface py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-400 px-5 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-9 max-w-xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-foreground" />
            <span className="section-label">The Cotton experience</span>
          </div>

          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            More than just <span className="italic">shopping.</span>
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            From carefully selected pieces to your doorstep, every detail is
            designed around you.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group flex gap-4 px-4 py-6 transition-colors duration-300 hover:bg-background sm:px-6 lg:flex-col lg:gap-5 lg:px-6 lg:py-8 ${
                  index !== 0
                    ? 'border-t border-border sm:border-t-0 lg:border-l'
                    : ''
                } ${index === 1 || index === 3 ? 'sm:border-l' : ''}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                  <Icon size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <h3 className="font-display text-lg font-medium text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 max-w-52 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
