const CategoriesItem = [
  {
    name: "Mobiles & Tablets",
    img: "https://res.cloudinary.com/duexwltx6/image/upload/v1756644836/Phones_imvfxh.png",
  },
  {
    name: "Fashion",
    img: "https://res.cloudinary.com/duexwltx6/image/upload/v1756722218/fashion_dmgpa3.png",
  },
  {
    name: "Laptops",
    img: "https://res.cloudinary.com/duexwltx6/image/upload/v1756722947/laptops_gmniva.png",
  },
  {
    name: "Home & Furniture",
    img: "https://res.cloudinary.com/duexwltx6/image/upload/v1756723235/furniture_oe0bph.png",
  },
  {
    name: "TVs & Appliances",
    img: "https://res.cloudinary.com/duexwltx6/image/upload/v1756644042/TV_appliances_fx5xqn.png",
  },
  {
    name: "Headsets & Airpods",
    img: "https://res.cloudinary.com/duexwltx6/image/upload/v1756722471/headsets_oni3t7.png",
  },
];

const CategoryBar = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Grid layout that adapts to screen size */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {CategoriesItem.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium mt-2 text-gray-800 text-center leading-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;