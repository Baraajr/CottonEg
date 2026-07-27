import FeaturedCategories from '../features/home/FeaturedCategories';
import Hero from '../features/home/Hero';
import ProductsSection from '../features/home/ProductSection';
import WhyChooseUs from '../features/home/WhyChooseUs';

function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />

      <ProductsSection
        title="Featured Products"
        subtitle="Our most popular picks."
        filters={{ featured: true }}
      />

      <WhyChooseUs />

      <ProductsSection
        title="New Arrivals"
        subtitle="Fresh styles just landed."
        filters={{ sort: 'createdAt-asc', gender: 'men' }}
      />
    </>
  );
}

export default Home;
