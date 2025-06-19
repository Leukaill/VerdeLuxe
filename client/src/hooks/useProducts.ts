import { useState, useEffect } from 'react';
import { getPlants, getCategories } from '@/lib/firebase';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrls: string[];
  stock: number;
  featured: boolean;
  tags: string[];
  careInstructions?: string;
  lightRequirement?: string;
  wateringFrequency?: string;
  difficultyLevel?: string;
  rating?: number;
  reviewCount?: number;
  threeDModelUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (categoryId?: string, featured?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlants(categoryId, featured);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);
  }, []);

  const getProductsByCategory = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return [];
    return products.filter(product => product.categoryId === category.id);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const sortProducts = (products: Product[], sortBy: string) => {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
      default:
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    sortProducts,
  };
};
