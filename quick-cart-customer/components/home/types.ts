/**
 * Home Screen Types
 * Type definitions for home screen data
 */

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  rating: number;
  reviewCount: number;
  farm: string;
  isOrganic?: boolean;
}

export interface Deal {
  id: string;
  title: string;
  discount: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}
