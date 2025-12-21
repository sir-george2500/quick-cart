/**
 * Mock Data for Home Screen
 * Using high-quality Unsplash images for professional look
 */

import { Category, Product, Deal, Banner } from "./types";

export const HERO_BANNER: Banner = {
  id: "1",
  title: "Fresh & Organic",
  subtitle: "Farm to table in 24 hours\nGet 20% off your first order",
  buttonText: "Shop Now",
  image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
};

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80",
    productCount: 45,
  },
  {
    id: "2",
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80",
    productCount: 32,
  },
  {
    id: "3",
    name: "Dairy",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80",
    productCount: 18,
  },
  {
    id: "4",
    name: "Grains",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80",
    productCount: 24,
  },
  {
    id: "5",
    name: "Meat",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80",
    productCount: 15,
  },
  {
    id: "6",
    name: "Organic",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&q=80",
    productCount: 28,
  },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    price: 2.99,
    originalPrice: 3.99,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80",
    rating: 4.8,
    reviewCount: 124,
    farm: "Green Valley Farm",
    isOrganic: true,
  },
  {
    id: "2",
    name: "Organic Apples",
    price: 4.49,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80",
    rating: 4.9,
    reviewCount: 89,
    farm: "Sunrise Orchards",
    isOrganic: true,
  },
  {
    id: "3",
    name: "Free Range Eggs",
    price: 5.99,
    originalPrice: 7.49,
    unit: "dozen",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80",
    rating: 4.7,
    reviewCount: 203,
    farm: "Happy Hen Farm",
  },
  {
    id: "4",
    name: "Fresh Milk",
    price: 3.49,
    unit: "liter",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80",
    rating: 4.6,
    reviewCount: 156,
    farm: "Meadow Dairy",
  },
];

export const DEALS: Deal[] = [
  {
    id: "1",
    title: "Farm Bundle",
    discount: "30% OFF",
    subtitle: "Fresh vegetables pack",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80",
    backgroundColor: "#10B981",
  },
  {
    id: "2",
    title: "Organic Week",
    discount: "25% OFF",
    subtitle: "All organic products",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&q=80",
    backgroundColor: "#059669",
  },
  {
    id: "3",
    title: "Dairy Delight",
    discount: "20% OFF",
    subtitle: "Milk, cheese & more",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    backgroundColor: "#0EA5E9",
  },
];
