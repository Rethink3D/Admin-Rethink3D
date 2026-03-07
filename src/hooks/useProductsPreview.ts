import { useState, useEffect, useCallback } from "react";
import { productsService } from "../services/products.service";
import { ProductResponseDTO } from "../types/dtos/product.dto";
import { useModal } from "../contexts/ModalContext";
import { MetaDTO } from "../types/dtos/response.dto";

export const useProductsPreview = () => {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [meta, setMeta] = useState<MetaDTO | null>(null);

  const { showModal } = useModal();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsService.getProducts({
        page,
        limit,
        search: search || undefined,
      });

      setProducts(response.data.data);
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar produtos",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, limit, showModal]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (product: ProductResponseDTO) => {
    showModal({
      type: "confirm",
      title: "Confirmar exclusão",
      message: `Deseja realmente excluir o produto "${product.name}"?`,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          await productsService.deleteProduct(product.id);
          showModal({
            type: "success",
            title: "Produto excluído",
            message: "O produto foi excluído com sucesso!",
          });
          loadData();
        } catch (error) {
          showModal({
            type: "error",
            title: "Erro ao excluir produto",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      },
    });
  };

  return {
    products,
    loading,
    search,
    setSearch,
    page,
    setPage,
    meta,
    handleDelete,
    refresh: loadData,
  };
};
