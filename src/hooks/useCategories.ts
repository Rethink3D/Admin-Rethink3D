import { useState, useEffect, useCallback } from "react";
import { categoriesService, CategoryDto } from "../services/categories.service";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoriesService.getCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string) => {
    try {
      await categoriesService.createCategory(name);
      await fetchCategories();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const removeCategory = async (id: number) => {
    try {
      await categoriesService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getImpact = async (id: number) => {
    try {
      const response = await categoriesService.getImpact(id);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    categories: filteredCategories,
    allCategories: categories,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    addCategory,
    removeCategory,
    getImpact,
    refresh: fetchCategories,
  };
};
