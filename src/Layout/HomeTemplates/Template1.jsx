import Banner1 from "../../assets/Banner-1.webp";
import { ShoppingBag } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import Button from "../../Components/Button";

const Template1 = () => {
  return (
    <div>
      <div className="w-full h-[67vh] lg:h-[60vh] flex flex-col md:flex-row justify-around items-center bg-gradient-to-br from-[#ffc2d1] to-red-600 p-4 md:p-0">
        {/* Left Side */}
        <div className="w-full md:w-[50%] relative md:left-20 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-bold text-white md:mb-0">
            Unleash <span className="text-[#bf0603]">Your Style.</span>
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-medium md:mt-5 text-[#343a40]">
            Summer Sale Up to <span className="text-[#dc2f02]">50%</span> Off!
          </h2>
          <p className="text-[12px] sm:text-[16px] md:text-[16px] mt-2 md:mt-5 text-[#212529]">
            Style meets comfort in our latest collection.
            <br className="hidden md:block" />
            Grab your favourites today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-4 md:mt-10 w-full md:w-auto justify-center md:justify-start items-center">
            <Button
              icon={ShoppingBag}
              text="Explore Fashion"
              className="text-[12px] sm:text-[17px] text-white font-medium bg-[#dc2f02] hover:scale-105 transition-all hover:cursor-pointer px-3 py-1 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl w-fit"
            />
            <Button
              icon={ShoppingCart}
              text="Shop Now"
              className="text-[12px] sm:text-[17px] text-white font-medium bg-[#dc2f02] hover:scale-105 transition-all hover:cursor-pointer px-3 py-1 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl w-fit"
            />
          </div>
        </div>
        {/* Right Side */}
        <div className="relative w-full md:w-[50%] flex justify-center items-center mt-8 md:mt-0 md:top-9 overflow-visible">
          <div className="bg-transparent rounded-2xl flex justify-center items-center">
            <img
              src={Banner1}
              className="h-[50vh] sm:h-[40vh] md:h-[50vh] w-[300px] sm:w-[300px] md:w-auto object-contain rounded-2xl filter drop-shadow-xl relative bottom-[10vh] sm:bottom-0"
              alt="Fashion Model"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;