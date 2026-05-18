import { useState, useEffect, useCallback } from "react";
import { productsService } from "../services/products.service";
import { ProductDetailDTO } from "../types/dtos/product.dto";
import { useModal } from "../contexts/ModalContext";

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showModal } = useModal();

  const loadProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await productsService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar detalhes",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  }, [id, showModal]);

  const toggleActive = useCallback(async () => {
    if (!id) return;
    try {
      setToggling(true);
      await productsService.toggleProductActive(id);
      await loadProduct();
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao alterar status",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setToggling(false);
    }
  }, [id, loadProduct, showModal]);

  const deleteProduct = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    try {
      setDeleting(true);
      await productsService.deleteProduct(id);
      return true;
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao excluir produto",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
      return false;
    } finally {
      setDeleting(false);
    }
  }, [id, showModal]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return {
    product,
    loading,
    toggling,
    deleting,
    refresh: loadProduct,
    toggleActive,
    deleteProduct,
  };
};
