import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shop } from "../../utils/constant";
import { shops } from "../../Shop/shopsData";
import ShopCard from "../../Shop/ShopCard";
import ShopDetailsModal from "../../Shop/ShopDetailsModal";

const Shops = () => {
  const navigate = useNavigate();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const handleShowDetails = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const handleVisitShop = (shopId: number) => {
    navigate(`/shop/${shopId}`);
  };

  const handleCloseModal = () => {
    setSelectedShop(null);
  };

  return (
    <div >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Restaurants</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onShowDetails={handleShowDetails}
            onVisitShop={handleVisitShop}
          />
        ))}
      </div>

      <ShopDetailsModal
        shop={selectedShop}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Shops;