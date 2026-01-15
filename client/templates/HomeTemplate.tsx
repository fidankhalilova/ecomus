import HeroBanner from "@/sections/home/HeroBanner";
import Map from "@/sections/home/Map";
import Offers from "@/sections/home/Offers";
import Policies from "@/sections/home/Policies";
import ProductList from "@/sections/home/ProductList";
import SeasonCollection from "@/sections/home/SeasonCollection";
import Sponsors from "@/sections/home/Sponsors";
export default function HomeTemplate() {
  return (
    <div>
      <HeroBanner />
      <SeasonCollection />
      <ProductList />
      <Offers />
      <Policies />
      <Map />
      <Sponsors />
    </div>
  );
}
