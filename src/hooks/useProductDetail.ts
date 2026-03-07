import { useState, useEffect, useCallback } from "react";
import { productsService } from "../services/products.service";
import { ProductDetailDTO } from "../types/dtos/product.dto";
import { useModal } from "../contexts/ModalContext";

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return { product, loading, refresh: loadProduct };
};
