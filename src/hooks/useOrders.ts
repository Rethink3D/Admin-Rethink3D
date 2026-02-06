import { useState, useEffect, useCallback } from "react";
import { ordersService } from "../services/orders.service";
import { OrderResponseDTO } from "../types/dtos/order.dto";
import { OrderStatusEnum } from "../types/enums/order-status.enum";
import { useModal } from "../contexts/ModalContext";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatusEnum | "">("");
  const { showModal } = useModal();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordersService.getOrders(
        filterStatus ? { status: filterStatus } : undefined,
      );
      setOrders(response.data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar pedidos",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  }, [filterStatus, showModal]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    filterStatus,
    setFilterStatus,
    refresh: loadOrders,
  };
};
