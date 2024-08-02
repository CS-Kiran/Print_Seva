import { useState, useEffect } from "react";
import axios from "axios";

interface Shop {
  shopkeeper_id: number;
  shop_name: string;
  address: string;
  shop_image: string | null;
  name: string;
  cost_single_side: string | null;
  cost_both_sides: string | null;
}

const AvailableShops = () => {
  const [shopsData, setShopsData] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get<Shop[]>(
          "http://127.0.0.1:5000/api/shops"
        );
        setShopsData(response.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, []);

  const defaultImageUrl = "default-image-url";

  return (
    <div className="flex-1 p-4 mx-auto my-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shopsData.map((shop) => (
        <div
          key={shop.shop_name}
          className="min-w-xl max-h-[23rem] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 mx-auto"
        >
          <img
            className="object-cover rounded-t-lg w-full h-52"
            src={shop.shop_image || defaultImageUrl}
            alt={shop.shop_name}
          />
          <div className="px-2 py-3">
            <h1 className="text-lg font-bold text-gray-800 uppercase">
              {shop.shop_name} - {shop.shopkeeper_id}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Address: {shop.address}
            </p>
            <p className="mt-2 text-sm text-gray-600 font-semibold">
              Owner: {shop.name}
            </p>
            <div className="mt-2 font-medium">
              Costs:
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">
                  Single Side: {shop.cost_single_side}
                </p>
                <p className="text-sm text-gray-600">
                  Both Sides: {shop.cost_both_sides}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableShops;
