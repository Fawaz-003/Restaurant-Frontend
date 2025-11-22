import { Shop } from "../utils/constant";

export const shops: Shop[] = [
  {
    id: 1,
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1601924915398-1e6e87f4e4fb?q=80&w=600",
    description: "Best wood-fired pizzas with fresh cheese.",
    owner: "John Peter",
    contact: "+91 98765 43210",
    website: "https://pizzaparadise.com",
    location: { title: "City Center Mall", desc: "Near Food Court", address: "Chennai, Tamil Nadu" },
  },
  {
    id: 2,
    name: "Burger Haven",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600",
    description: "Juicy burgers with secret homemade sauce.",
    owner: "Priya Singh",
    contact: "+91 90909 80808",
    website: "https://burgerhaven.com",
    location: { title: "Main Road Street", desc: "Opposite Bus Stand", address: "Bangalore, Karnataka" },
  },
  {
    id: 3,
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1562158070-57d1e60b9fbb?q=80&w=600",
    description: "Traditional sushi prepared by experts.",
    owner: "Kenji Takahiro",
    contact: "+91 77889 88900",
    website: "https://sushimaster.com",
    location: { title: "Elite Plaza", desc: "2nd Floor", address: "Hyderabad, Telangana" },
  },
  {
    id: 4,
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1601924994986-b37a7cbe72d1?q=80&w=600",
    description: "Authentic tacos with spicy fillings.",
    owner: "Carlos Vega",
    contact: "+91 66543 22110",
    website: "https://tacofiesta.com",
    location: { title: "Food Hub Area", desc: "Near Central Park", address: "Mumbai, Maharashtra" },
  },
];