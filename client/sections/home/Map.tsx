import { ArrowUpRight } from "lucide-react";

export default function Map() {
  return (
    <div className="container mx-auto mt-15">
      <div className="relative h-full">
        <img
          src="https://themesflat.co/html/ecomus/images/country/map-1.jpg"
          alt=""
          className="w-full h-full object-cover relative"
        />

        <div className="h-full absolute z-3 top-40 left-20">
          <div className="bg-white p-15 flex flex-col justify-center w-100">
            <h1 className="text-3xl mb-2">Toronto Store</h1>
            <p className="text-md text-gray-400 mb-6">
              301 Front St W Toronto, Canada <br /> support@ecomus.com <br />{" "}
              (08) 8942 1299
            </p>
            <p className="text-md text-gray-400">
              Mon - Fri, 8:30am - 10:30pm <br /> Saturday, 8:30am - 10:30pm{" "}
              <br /> Sunday Closed
            </p>
            <button className="border-b-2 flex items-center gap-2 border-black mt-6 text-black font-medium hover:text-red-500 transition w-35">
              Get Directions <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
