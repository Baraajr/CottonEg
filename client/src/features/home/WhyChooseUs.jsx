import { FiTruck, FiRefreshCw, FiShield, FiAward } from 'react-icons/fi';

const features = [
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across Egypt.',
    bg: 'bg-blue-50',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: 'Hassle-free returns and exchanges.',
    bg: 'bg-emerald-50',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    description: 'Protected checkout.',
    bg: 'bg-violet-50',
  },
  {
    icon: FiAward,
    title: 'Premium Quality',
    description: 'Selected with care.',
    bg: 'bg-amber-50',
  },
];
function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Shopping Made Simple
          </h2>

          <p className="mt-4 text-gray-600">
            Everything you need for a smooth shopping experience, from checkout
            to delivery.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description, bg }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}
              >
                <Icon size={26} />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {title}
              </h3>

              <p className="leading-7 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
