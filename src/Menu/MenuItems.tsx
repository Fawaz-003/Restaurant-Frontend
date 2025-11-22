import { MenuItem } from "../utils/constant";

export const categories = ['All', 'Pizza', 'Burgers', 'Sushi', 'Desserts', 'Beverages'];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 299,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    description: 'Classic pizza with fresh mozzarella and basil',
    rating: 4.5,
    isVeg: true
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 399,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    description: 'Loaded with pepperoni and cheese',
    rating: 4.7,
    isVeg: false
  },
  {
    id: 3,
    name: 'Classic Burger',
    category: 'Burgers',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    description: 'Juicy beef patty with lettuce and tomato',
    rating: 4.3,
    isVeg: false
  },
  {
    id: 4,
    name: 'Veggie Burger',
    category: 'Burgers',
    price: 179,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
    description: 'Healthy veggie patty with fresh vegetables',
    rating: 4.4,
    isVeg: true
  },
  {
    id: 5,
    name: 'California Roll',
    category: 'Sushi',
    price: 349,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    description: 'Fresh crab, avocado, and cucumber',
    rating: 4.8,
    isVeg: false
  },
  {
    id: 6,
    name: 'Salmon Nigiri',
    category: 'Sushi',
    price: 449,
    image: 'https://images.unsplash.com/photo-1617196035796-5f8cb0f3a0c2?w=400',
    description: 'Premium salmon over seasoned rice',
    rating: 4.9,
    isVeg: false
  },
  {
    id: 7,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 149,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    description: 'Warm chocolate cake with molten center',
    rating: 4.6,
    isVeg: true
  },
  {
    id: 8,
    name: 'Tiramisu',
    category: 'Desserts',
    price: 169,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    description: 'Classic Italian coffee-flavored dessert',
    rating: 4.5,
    isVeg: true
  },
  {
    id: 9,
    name: 'Fresh Lemonade',
    category: 'Beverages',
    price: 79,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400',
    description: 'Refreshing homemade lemonade',
    rating: 4.2,
    isVeg: true
  },
  {
    id: 10,
    name: 'Iced Coffee',
    category: 'Beverages',
    price: 99,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    description: 'Cold brew coffee with ice',
    rating: 4.4,
    isVeg: true
  }
];