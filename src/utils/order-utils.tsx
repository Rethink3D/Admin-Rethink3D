import { OrderStatusEnum } from "../types/enums/order-status.enum";
import { OrderTypeEnum } from "../types/enums/order-type.enum";

export const getOrderTypeLabel = (type: string) => {
  if (type === OrderTypeEnum.PRODUCT) return "Produto do Catálogo";
  if (type === OrderTypeEnum.CUSTOM) return "Produto Personalizado";
  return type;
};

export const getStatusBadge = (status: OrderStatusEnum) => {
  const statusMap: Record<
    OrderStatusEnum,
    { label: string; className: string }
  > = {
    [OrderStatusEnum.AWAITING_PAYMENT]: {
      label: "Aguardando Pagamento",
      className: "badge-warning",
    },
    [OrderStatusEnum.AWAITING_MAKER]: {
      label: "Aguardando Maker",
      className: "badge-info",
    },
    [OrderStatusEnum.ON_GOING]: {
      label: "Em Andamento",
      className: "badge-info",
    },
    [OrderStatusEnum.DELAYED]: {
      label: "Atrasado",
      className: "badge-error",
    },
    [OrderStatusEnum.NEW_DEADLINE]: {
      label: "Novo Prazo",
      className: "badge-warning",
    },
    [OrderStatusEnum.READY]: { label: "Pronto", className: "badge-success" },
    [OrderStatusEnum.AWAITING_CONFIRMATION]: {
      label: "Aguardando Confirmação",
      className: "badge-warning",
    },
    [OrderStatusEnum.REFUND_IN_ANALYSIS]: {
      label: "Reembolso em Análise",
      className: "badge-warning",
    },
    [OrderStatusEnum.REFUND_IN_PROCESS]: {
      label: "Reembolso em Processo",
      className: "badge-warning",
    },
    [OrderStatusEnum.PARTIAL_REFUND_IN_PROCESS]: {
      label: "Reembolso Parcial",
      className: "badge-warning",
    },
    [OrderStatusEnum.PARTIAL_REFUND]: {
      label: "Reembolso Parcial",
      className: "badge-warning",
    },
    [OrderStatusEnum.REFUNDED]: {
      label: "Reembolsado",
      className: "badge-error",
    },
    [OrderStatusEnum.DONE]: {
      label: "Concluído",
      className: "badge-success",
    },
  };

  const { label, className } = statusMap[status] || {
    label: status,
    className: "badge-default",
  };
  return <span className={`badge ${className}`}>{label}</span>;
};
