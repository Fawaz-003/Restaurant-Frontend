import { ShoppingBag, ShoppingCart, CheckCircle } from "lucide-react";
import Banner3 from "../../assets/Banner-3.webp";

const Button = ({ icon: Icon, text, className }) => (
  <button className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${className}`}>
    <Icon className="w-4 h-4" />
    {text}
  </button>
);

const features = [
  "All-day Battery Life",
  "Ultra-fast Performance", 
  "Stunning Display Options",
  "Secure & Reliable"
];

const Template3 = () => {
  return (
    <div>
      <div className="w-full h-[67vh] lg:h-[60vh] flex flex-col lg:flex-row justify-center items-center bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] p-4 lg:p-0 overflow-hidden">
        {/* Left Side - Content */}
        <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start text-center md:pl-20">
          <h1 className="text-xl mt-2 md:text-2xl lg:text-3xl font-bold text-white leading-tight">
            Power Meets  
            <span className="text-[#f59e0b]"> Performance.</span>
          </h1>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-medium lg:mt-5 text-[#f3f4f6]">
            Summer Sale Up to <span className="text-[#f59e0b] font-bold">50%</span> Off!
          </h2>
          <p className="text-[12px] md:text-base lg:text-m lg:mt-5 text-[#e5e7eb] max-w-md leading-relaxed">
            Experience the next generation of laptops built for creators, gamers, and professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 mb-4 lg:mt-8 w-full sm:w-auto">
            <Button
              icon={ShoppingBag}
              text="Explore Fashion"
              className="text-sm md:text-base text-white font-semibold bg-gradient-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:cursor-pointer w-full sm:w-auto"
            />
            <Button
              icon={ShoppingCart}
              text="Shop Now"
              className="text-sm md:text-base text-[#6366f1] font-semibold bg-white hover:bg-[#f8fafc] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:cursor-pointer w-full sm:w-auto border border-white/20"
            />
          </div>
        </div>

        {/* Right Side - Product Display */}
        <div className="relative w-full lg:w-[50%] flex justify-center items-center">
          <div className="relative rounded-xl bg-gradient-to-br from-[#f2cc34] via-[#e77e06] to-[#ed7804] p-4 lg:rounded-l-full shadow-2xl border-2 border-[#f59e0b]/20 flex flex-col md:flex-row items-center backdrop-blur-sm">
            
            {/* Discount Badge - Smaller on mobile */}
            <div className="absolute -top-2 md:-top-6 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 z-20 animate-bounce">
              <div className="bg-gradient-to-b from-[#10b981] to-[#059669] px-2 md:px-5 py-1 md:py-2 text-center font-bold rounded-t-lg shadow-xl relative border-2 border-white/20">
                <div className="text-sm md:text-xl font-extrabold text-white">20%</div>
                <div className="text-[10px] md:text-xs tracking-wide text-white/90">DISCOUNT</div>
                <div className="absolute bottom-[-8px] md:bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] md:border-l-[18px] border-l-transparent border-r-[8px] md:border-r-[18px] border-r-transparent border-t-[8px] md:border-t-[15px] border-t-[#059669]"></div>
              </div>
            </div>

            {/* Product Image with lighter background overlay */}
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <div className="relative">
                <img
                  src={Banner3}
                  className="rounded-2xl lg:rounded-l-full lg:rounded-r-2xl h-32 md:h-48 lg:h-64 w-48 md:w-64 lg:w-80 object-cover shadow-2xl border-4 border-white/30"
                  alt="Laptop and gadgets"
                />
                {/* Light overlay for better contrast */}
                <div className="absolute inset-0 rounded-2xl lg:rounded-l-full lg:rounded-r-2xl bg-gradient-to-t from-white/20 via-white/10 to-white/5"></div>
              </div>
            </div>

            {/* Vertical Divider - Hidden on mobile */}
            <div className="hidden lg:block mx-6 h-48 w-[3px] bg-gradient-to-b from-white/40 via-white/20 to-white/40 rounded-full" />

            {/* Features List */}
            <div className="w-full md:w-auto">
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs md:text-xs lg:text-base text-[#1f2937] font-semibold">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1 text-[#0f23fd] flex-shrink-0 drop-shadow-sm" />
                    <span className="text-[10px] md:text-[15px] drop-shadow-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3;