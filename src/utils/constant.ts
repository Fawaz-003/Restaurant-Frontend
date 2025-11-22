export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  isVeg: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
export interface ShopLocation {
  title: string;
  desc: string;
  address: string;
}

export interface Shop {
  id: number;
  name: string;
  image: string;
  description: string;
  owner: string;
  contact: string;
  website: string;
  location: ShopLocation;
}