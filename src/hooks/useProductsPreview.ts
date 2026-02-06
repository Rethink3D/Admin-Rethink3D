import { useState, useEffect, useMemo } from "react";
import { productsService } from "../services/products.service";
import { makersService } from "../services/makers.service";
import { ProductResponseDTO } from "../types/dtos/product.dto";
import { MakerPreviewDTO } from "../types/dtos/maker.dto";
import { useModal } from "../contexts/ModalContext";

export const useProductsPreview = () => {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [makers, setMakers] = useState<MakerPreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMaker, setFilterMaker] = useState("");
  const { showModal } = useModal();

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, makersResponse] = await Promise.all([
        productsService.getProducts(),
        makersService.getMakers(),
      ]);

      setProducts(productsResponse.data.data);
      setMakers(makersResponse.data.data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar dados",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.makerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMaker = !filterMaker || product.makerName === filterMaker;
      return matchesSearch && matchesMaker;
    });
  }, [products, searchQuery, filterMaker]);

  return {
    products: filteredProducts,
    makers,
    loading,
    searchQuery,
    setSearchQuery,
    filterMaker,
    setFilterMaker,
    handleDelete,
    refresh: loadData,
  };
};
