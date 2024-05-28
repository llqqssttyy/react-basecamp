import { useState, useEffect } from "react";
import { PRODUCTS_ENDPOINT } from "../api/endpoints";
import { fetchProducts } from "../api/products";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: unknown;
  page: number;
  fetchNextPage: () => void;
}

export default function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data, isLastPage } = await fetchProducts(page, 4);
        setProducts((prevProducts) => [...prevProducts, ...data]);
        setIsLastPage(isLastPage);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [page]);

  const fetchNextPage = () => {
    if (!isLastPage) {
      setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { products, page, loading, error, fetchNextPage };
}
