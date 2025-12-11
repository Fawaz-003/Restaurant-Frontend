import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import ShopCard from "../../Components/Shop/ShopCard";
import ShopDetailsModal from "../../Components/Shop/ShopDetailsModal";

const Shops = () => {
  const navigate = useNavigate();
  const [selectedShop, setSelectedShop] = useState(null);
  const {
    shops,
    shopsLoading,
    shopsError,
    fetchShops,
  } = useAppContext();

  useEffect(() => {
    if (!shops?.length && !shopsLoading) {
      fetchShops();
    }
  }, [fetchShops, shops?.length, shopsLoading]);

  const normalizedShops = useMemo(() => {
    const placeholderImage =
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80";

    return (shops || []).map((shop, index) => ({
      id: shop._id || shop.id || index,
      name: shop.storeName || shop.name || "Restaurant",
      image: shop.image?.url || shop.image || placeholderImage,
      description: shop.description || "No description available.",
      owner: shop.shopOwner?.name || shop.owner || "Owner details unavailable",
      contact:
        shop.shopOwner?.contact || shop.contact || "Contact info unavailable",
      location: {
        title: shop.address || shop.location?.title || "Address not available",
        desc: shop.location?.desc || "",
        address: shop.address || shop.location?.address || "",
      },
    }));
  }, [shops]);

  const handleShowDetails = (shop) => {
    setSelectedShop(shop);
  };

  const handleVisitShop = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  const handleCloseModal = () => {
    setSelectedShop(null);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6">Available Restaurants</h2>
      {shopsLoading && (
        <p className="text-gray-600">Loading shops...</p>
      )}
      {shopsError && !shopsLoading && (
        <p className="text-red-600">Failed to load shops: {shopsError}</p>
      )}
      {!shopsLoading && !shopsError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {normalizedShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onShowDetails={handleShowDetails}
              onVisitShop={handleVisitShop}
            />
          ))}

          {!normalizedShops.length && (
            <p className="col-span-full text-gray-600 text-center">
              No shops available.
            </p>
          )}
        </div>
      )}

      <ShopDetailsModal
        shop={selectedShop}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Shops;