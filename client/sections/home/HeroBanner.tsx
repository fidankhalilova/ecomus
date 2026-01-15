"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
export default function HeroBanner() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <div className="h-185 flex">
          <div className="w-1/2 bg-[#eef1e0]">
            <div className="p-20 flex flex-col items-start justify-center gap-10 h-full">
              <div className="flex flex-col items-start justify-center gap-6">
                <h1 className="text-[90px]/25 font-medium">
                  Summer <br /> Escapades
                </h1>
                <h3 className="text-2xl">
                  Embrace the sun-kissed season with our collection of breezy
                </h3>
              </div>
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black text-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Collection <ChevronRight />
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-gray-400/20"></div>
                </div>
              </button>
            </div>
          </div>
          <div className="w-1/2">
            <img
              src="https://themesflat.co/html/ecomus/images/slider/fashion-06-slide1.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="h-185 flex">
          <div className="w-1/2 bg-[#eef1e0]">
            <div className="p-20 flex flex-col items-start justify-center gap-10 h-full">
              <div className="flex flex-col items-start justify-center gap-6">
                <h1 className="text-[90px]/25 font-medium">
                  Multi-faceted <br /> Beauty
                </h1>
                <h3 className="text-2xl">
                  Embrace the sun-kissed season with our collection of breezy
                </h3>
              </div>
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black hover:bg-white/90 text-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Collection <ChevronRight />
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-gray-400/20"></div>
                </div>
              </button>
            </div>
          </div>
          <div className="w-1/2">
            <img
              src="https://themesflat.co/html/ecomus/images/slider/fashion-06-slide2.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="h-185 flex">
          <div className="w-1/2 bg-[#eef1e0]">
            <div className="p-20 flex flex-col items-start justify-center gap-10 h-full">
              <div className="flex flex-col items-start justify-center gap-6">
                <h1 className="text-[90px]/25 font-medium">
                  Effortless <br /> Elegance
                </h1>
                <h3 className="text-2xl">
                  Embrace the sun-kissed season with our collection of breezy
                </h3>
              </div>
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black hover:bg-white/90 text-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Collection <ChevronRight />
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-gray-400/20"></div>
                </div>
              </button>
            </div>
          </div>
          <div className="w-1/2">
            <img
              src="https://themesflat.co/html/ecomus/images/slider/fashion-06-slide3.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
