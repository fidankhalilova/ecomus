export default function Offers() {
  return (
    <div className="container mx-auto mt-15">
      <div className="grid grid-cols-3 gap-6 justify-between">
        <div className="relative">
          <img
            src="https://themesflat.co/html/ecomus/images/collections/collection-39.jpg"
            alt=""
          />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-semibold text-xl">Up to 30% off</p>
                <h2 className="font-semibold text-3xl">Essential Basics</h2>
              </div>
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black text-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-gray-400/20"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://themesflat.co/html/ecomus/images/collections/collection-40.jpg"
            alt=""
          />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-semibold text-xl">Up to 30% off</p>
                <h2 className="font-semibold text-3xl">Athleisure Wear</h2>
              </div>
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black text-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-gray-400/20"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://themesflat.co/html/ecomus/images/collections/collection-41.jpg"
            alt=""
          />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-semibold text-xl">Up to 30% off</p>
                <h2 className="font-semibold text-3xl">Seasonal Favorites</h2>
              </div>
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black text-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-gray-400/20"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
