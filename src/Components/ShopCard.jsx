import { Link } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80&auto=format&fit=crop";

const ShopCard = ({ shop }) => {
  const shopId = shop?.id || shop?._id;
  const imageSrc = shop?.heroImage || shop?.image?.url || PLACEHOLDER_IMAGE;
  const shopName = shop?.name || shop?.storeName || "Featured restaurant";
  const cuisineLabel =
    shop?.cuisine ||
    shop?.address ||
    (shop?.isOpen ? "Now delivering" : "Limited availability");

  const reviews = Array.isArray(shop?.reviews) ? shop.reviews : [];
  const derivedRating =
    typeof shop?.rating === "number"
      ? shop.rating
      : reviews.length
      ? reviews.reduce((sum, entry) => sum + (entry.rating || 0), 0) /
        reviews.length
      : null;
  const ratingLabel = derivedRating ? `★ ${derivedRating.toFixed(1)}` : "New";

  const fallbackTags = [
    typeof shop?.isOpen === "boolean"
      ? shop.isOpen
        ? "Open now"
        : "Closed for today"
      : null,
    shop?.openingHours?.open && shop?.openingHours?.close
      ? `${shop.openingHours.open} – ${shop.openingHours.close}`
      : null,
  ].filter(Boolean);
  const tags =
    Array.isArray(shop?.tags) && shop.tags.length ? shop.tags : fallbackTags;

  const highlightItems =
    (Array.isArray(shop?.menuHighlights) && shop.menuHighlights.length
      ? shop.menuHighlights
      : Array.isArray(shop?.menu) && shop.menu.length
      ? shop.menu.slice(0, 3).map((item) => item.foodName)
      : []
    ).filter(Boolean);

  const highlightText = highlightItems.length
    ? highlightItems.join(", ")
    : shop?.description || "Fresh, local meals delivered to you";

  return (
    <Link
      to={shopId ? `/shop/${shopId}` : "#"}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 transition hover:-translate-y-1 hover:border-slate-300"
    >
      <div className="h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={shopName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500">{cuisineLabel}</p>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {ratingLabel}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{shopName}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-slate-600">Highlights: {highlightText}</div>
      </div>
    </Link>
  );
};

export default ShopCard;

