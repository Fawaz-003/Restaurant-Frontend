import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shopDetails } from "../Data/dummyData";
import MenuList from "./MenuList";
import ShopDetails from "./ShopDetails";

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const shop = useMemo(
    () => shopDetails.find((entry) => entry.id === id),
    [id]
  );

  if (!shop) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm uppercase tracking-[0.4rem] text-amber-600">
          Shop unavailable
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          We couldn't find that restaurant
        </h1>
        <p className="text-sm text-slate-500">
          Please pick a featured restaurant from the homepage.
        </p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          Back to home
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-8 py-10">
      <ShopDetails shop={shop} />
      <MenuList sections={shop.menuSections} />
    </section>
  );
};

export default ShopPage;

