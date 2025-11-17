import React, { useState, useEffect, useRef } from "react";
import Template1 from "../Layout/HomeTemplates/Template1";
import Template2 from "../Layout/HomeTemplates/Template2";
import Template3 from "../Layout/HomeTemplates/Template3";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Import your existing SearchBar component
import SearchBar from "../Components/SearchBar";

// 🔹 Import CategoriesItem component
import CategoryBar from "../Layout/Sections/CategoryBar";
import DiscountCards from "../Layout/Sections/CardTemplates";
import LatestCollections from "../Layout/Sections/LatestCollections";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoScrollIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const templates = [
    { id: 1, component: <Template1 /> },
    { id: 2, component: <Template2 /> },
    { id: 3, component: <Template3 /> },
  ];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Progress bar effect
  useEffect(() => {
    setProgress(0);
    if (isAutoScrolling) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1; // 1% every 50ms = 5s total
        });
      }, 50);
    }
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [currentSlide, isAutoScrolling]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % templates.length);
      }, 5000); // Change slide every 5 seconds
    }
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, templates.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of manual navigation
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToPrevious = () => {
    const newSlide =
      currentSlide === 0 ? templates.length - 1 : currentSlide - 1;
    goToSlide(newSlide);
  };

  const goToNext = () => {
    const newSlide = (currentSlide + 1) % templates.length;
    goToSlide(newSlide);
  };

  // Touch handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="w-full bg-[#f1f3f6]">
      {/* 🔹 SearchBar with padding */}
      <div className="bg-[#f1f3f6]">
        <SearchBar />
      </div>

      {/* 🔹 Main Carousel */}
      <div
        ref={containerRef}
        className="relative lg:w-[70%] overflow-hidden h-[67vh] lg:h-[60vh] px-3 lg:px-8 rounded-lg lg:rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative lg:w-full overflow-hidden h-[67vh] lg:h-[60vh] lg:px-8 rounded-lg lg:rounded-2xl">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
                index === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
              style={{
                transform:
                  index === currentSlide
                    ? "translateX(0)"
                    : index < currentSlide
                    ? "translateX(-100%)"
                    : "translateX(100%)",
              }}
            >
              <div className="w-full h-full overflow-hidden">
                {template.component}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons - Hidden on mobile */}
        <button
          onClick={goToPrevious}
          className="hidden md:block absolute left-14 top-1/2 transform -translate-y-1/2 z-20 bg-white/50 hover:bg-white/60 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="hidden md:block absolute right-14 top-1/2 transform -translate-y-1/2 z-20 bg-white/50 hover:bg-white/60 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Progress bars - Hidden on mobile */}
        <div className="hidden md:flex absolute bottom-5 left-1/2 transform -translate-x-1/2 space-x-1 z-20">
          {templates.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 bg-gray-300 rounded-full overflow-hidden transition-all duration-200 ${
                index === currentSlide ? "w-10" : "w-4"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-50 ${
                  index === currentSlide ? "bg-[#415a77]" : "bg-gray-100"
                }`}
                style={{
                  width: index === currentSlide ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 CategoriesItem placed after the carousel */}
      <div>
        <LatestCollections />
      </div>
      <div className="px-3 py-5 xl:px-10 bg-[#e8ecf0]">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 lg:py-2">
          <div className="h-[1px] sm:h-[1.2px] bg-gray-300 flex-1 max-w-[50px] sm:max-w-none"></div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 tracking-wide sm:tracking-wider px-2">
            CATEGORIES
          </h1>
          <div className="h-[1px] sm:h-[1.2px] bg-gray-300 flex-1 max-w-[50px] sm:max-w-none"></div>
        </div>
        <CategoryBar />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6 lg:px-10 py-3 sm:py-5">
        <DiscountCards />
        <DiscountCards />
        <DiscountCards />
      </div>
    </div>
  );
};

export default Home;
