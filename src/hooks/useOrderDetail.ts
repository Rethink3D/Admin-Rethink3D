import { useState, useEffect } from "react";
import { ordersService } from "../services/orders.service";
import { OrderDetailDTO } from "../types/dtos/order.dto";
import { useModal } from "../contexts/ModalContext";
import { useNavigate } from "react-router-dom";

export const useOrderDetail = (id: string) => {
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();
  const navigate = useNavigate();

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar pedido",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  return {
    order,
    loading,
    refresh: loadOrder,
  };
};
