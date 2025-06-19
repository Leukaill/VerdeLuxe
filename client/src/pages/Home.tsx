import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import ThreeDVisualization from '@/components/ThreeDVisualization';
import ServiceHighlights from '@/components/ServiceHighlights';

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <ThreeDVisualization />
      <ServiceHighlights />
    </div>
  );
};

export default Home;
