import HeroSection from "../components/HeroSection";
import MenuCollection from "../components/MenuCollection";
import SectionHeading from "../components/SectionHeading";
import ShopCard from "../components/ShopCard";
import { curatedMenus, featuredShops, heroContent } from "../Data/dummyData";

const Home = () => {
  return (
    <div className="space-y-16 py-10">
      <HeroSection data={heroContent} />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Now trending"
          title="Handpicked neighborhood kitchens"
          description="Browse the most-loved restaurants based on ratings, prep time, and menu freshness."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Curated menus"
          title="Plan meals around your day"
          description="Pick a ready-to-order collection or mix and match items with a single checkout."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {curatedMenus.map((collection) => (
            <MenuCollection key={collection.title} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
