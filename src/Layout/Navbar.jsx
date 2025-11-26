import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import {
  MapPin,
  Search,
  ShoppingCart,
  Smartphone,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token, userData } = useAppContext();
  const authenticated = isAuthenticated();
  const avatarLetter =
    userData?.name?.trim()?.charAt(0)?.toUpperCase() || "P";
  const [locationValue, setLocationValue] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (token && location.pathname === "/login") {
      navigate("/profile", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  const handleProfileClick = () => {
    navigate(authenticated ? "/profile" : "/login");
  };

  const handleViewDashboardClick = () => {
    if (userData?.role?.toLowerCase() === "admin") {
      navigate("/admin-dashboard");
    } else if (userData?.role?.toLowerCase() === "seller") {
      navigate("/seller-dashboard");
    }
  };

  const handleDetectLocation = () => {
    if (isLocating) return;

    if (!navigator.geolocation) {
      setLocationValue("Location not supported");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          const params = new URLSearchParams({
            format: "jsonv2",
            lat: latitude.toString(),
            lon: longitude.toString(),
          });
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
          );
          const data = await response.json();
          const address = data?.address || {};
          const streetLine = [
            [address.house_number, address.road || address.street || address.residential]
              .filter(Boolean)
              .join(" "),
          ];
          const localityLine = [
            address.neighbourhood ||
              address.suburb ||
              address.village ||
              address.hamlet,
          ];
          const cityLine = [
            address.city ||
              address.town ||
              address.municipality ||
              address.county ||
              address.city_district,
          ];
          const regionLine = [address.state, address.postcode].filter(Boolean).join(" ");

          const locationText = [
            streetLine.filter(Boolean).join(" "),
            localityLine.filter(Boolean).join(" "),
            cityLine.filter(Boolean).join(" "),
            regionLine,
          ]
            .filter(Boolean)
            .join(", ");

          setLocationValue(locationText || "Location detected");
        } catch (error) {
          setLocationValue("Unable to fetch address");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationValue("Location permission denied");
        } else {
          setLocationValue("Unable to access location");
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-slate-900"
        >
          <span className="rounded-full bg-amber-500 px-3 py-1 text-sm uppercase tracking-widest text-white">
            Resto
          </span>
          <span className="text-slate-900">Marketplace</span>
        </Link>

        <div className="flex flex-none items-center gap-3">
          <button className="hidden h-9 items-center gap-2 rounded-full border border-amber-200 bg-white px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 sm:inline-flex">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            <span>Get the app</span>
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-full bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>Cart</span>
          </button>
          {authenticated && (userData?.role?.toLowerCase() === "admin" || userData?.role?.toLowerCase() === "seller") && (
            <button
              onClick={handleViewDashboardClick}
              className="hidden h-9 items-center rounded-full border border-blue-300 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:inline-flex"
            >
              View Dashboard
            </button>
          )}
          {!authenticated ? (
            <>
              <Link
                to="/login"
                className="hidden h-11 items-center rounded-full px-4 text-sm font-semibold text-slate-600 transition hover:text-amber-600 sm:flex"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden h-11 items-center rounded-full border border-amber-300 px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 sm:flex"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleProfileClick}
              className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-amber-500 hover:text-amber-600"
            >
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name || "Profile"}
                  className="h-6 w-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                  {avatarLetter}
                </span>
              )}
              <span>Profile</span>
            </button>
          )}
        </div>
      </header>

      <div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4">
          <form
            className="flex w-full flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-gray-50 px-5 py-2 shadow-md shadow-white/40 backdrop-blur-xl"
            onSubmit={(e) => e.preventDefault()}
            style={{ flexBasis: "60%" }}
          >
            <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search dishes, chefs, cuisines..."
              className="w-full rounded-xl border border-white/80 bg-white/10 px-3 py-2 text-sm text-slate-800 placeholder-slate-500 outline-none backdrop-blur ring-1 ring-white/30 transition focus:border-amber-400 focus:bg-white/60 focus:ring-amber-200/60"
            />
            <button
              type="submit"
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Search
            </button>
          </form>
          <div
            className="flex w-full flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-gray-50 px-4 py-2 text-sm text-slate-700 shadow-md shadow-white/40 backdrop-blur-xl"
            style={{ flexBasis: "40%" }}
          >
            <MapPin className="h-6 w-6 text-amber-600" aria-hidden="true" />
            <input
              type="text"
              readOnly
              value={locationValue}
              placeholder={
                isLocating ? "Detecting your location..." : "Use my current location"
              }
              className="w-full cursor-pointer rounded-xl border border-white/80 bg-white/40 px-3 py-2 text-sm text-slate-800 placeholder-slate-500 outline-none backdrop-blur ring-1 ring-white/30 transition focus:border-amber-400 focus:bg-white/60 focus:ring-amber-200/60"
              onClick={handleDetectLocation}
              onFocus={handleDetectLocation}
            />
            <button
              type="button"
              className="rounded-full bg-slate-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-900"
              onClick={(e) => {
                e.stopPropagation();
                handleDetectLocation();
              }}
            >
              {isLocating ? "Locating..." : "Detect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
