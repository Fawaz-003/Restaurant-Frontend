import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shops } from "../../Components/Shop/shopsData";
import ShopCard from "../../Components/Shop/ShopCard";
import ShopDetailsModal from "../../Components/Shop/ShopDetailsModal";


const Shops = () => {
  const navigate = useNavigate();
  const [selectedShop, setSelectedShop] = useState(null);

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
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