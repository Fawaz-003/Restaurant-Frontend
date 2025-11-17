import { useEffect, useState } from "react";
import Banner2 from "../../assets/Banner-2.webp";
import Banner2i from "../../assets/Banner-2i.webp";
import Banner2ii from "../../assets/Banner-2ii.webp";
import Button from "../../Components/Button"
import { ShoppingBag } from "lucide-react";

const images = [Banner2, Banner2i, Banner2ii];

const Template2 = () => {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setAnimate(true);
      }, 50);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const prevIndex = (current - 1 + images.length) % images.length;
  const nextIndex = (current + 1) % images.length;

  return (
    <div className="w-full h-[67vh] lg:h-[60vh] flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#90e0ef] to-[#0077b6] px-2 md:px-10 py-2 md:py-0">
      {/* Left Content */}
      <div className="w-full md:w-[35%] text-white space-y-2 relative md:left-10 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-xl mt-2 sm:text-4xl md:text-4xl font-bold leading-tight">
          Style Meets <span className="text-[#d62828]">Performance.</span>
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-2xl font-bold">
          Flat <span className="text-[#354f52]">30% OFF</span> Limited Stock
          <span className="text-[#354f52]">!</span>
        </h2>
        <p className="text-[12px] sm:text-[16px] md:text-m">
          Whether it's music, calls, or podcasts, SirPods deliver crisp audio
          with effortless connectivity and stylish design.
        </p>
        <Button
          icon={ShoppingBag}
          text="Shop Now"
          className="text-[12px] mt-2 sm:text-[17px] text-[#0a8297] rounded-lg lg:rounded-xl font-medium bg-white hover:scale-105 hover:cursor-pointer"
        />
      </div>

      {/* Right Image Slider */}
      <div className="w-full md:w-[60%] flex items-center justify-center gap-2 sm:gap-8 relative mt-12 md:mt-0 mb-[10vh] md:mb-0">
        {/* Left Preview Image */}
        <div
          className={`bg-white rounded-2xl p-1 blur-xs scale-90 transition-all duration-500 w-[28vw] sm:w-[25%] ${
            animate ? "fade-left" : ""
          }`}
        >
          <img
            src={images[prevIndex]}
            alt="prev"
            className="w-full object-cover rounded-2xl"
          />
        </div>

        {/* Center Main Image */}
        <div
          className={`bg-white rounded-2xl p-1 scale-120 transition-all duration-500 w-[42vw] md:w-[12vw] sm:w-[25%] ${
            animate ? "slide-up" : ""
          }`}
        >
          <img
            src={images[current]}
            alt="current"
            className="w-full object-cover rounded-2xl"
          />
        </div>

        {/* Right Preview Image */}
        <div
          className={`bg-white rounded-2xl p-1 blur-xs scale-90  transition-all duration-500 w-[28vw] sm:w-[25%] ${
            animate ? "slide-up" : ""
          }`}
        >
          <img
            src={images[nextIndex]}
            alt="next"
            className="w-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        .fade-left {
          animation: fadeLeft 1s ease-out;
        }
        .fade-right {
          animation: fadeRight 1s ease-out;
        }
        .fade-up {
          animation: fadeUp 1s ease-out;
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Template2;