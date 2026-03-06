import { OrderStatusEnum } from "../types/enums/order-status.enum";
import { MakerStatusEnum } from "../types/enums/maker-status.enum";

export const getStatusLabel = (status: OrderStatusEnum) => {
  switch (status) {
    case OrderStatusEnum.REFUND_IN_ANALYSIS:
      return "Em Análise";
    case OrderStatusEnum.REFUNDED:
      return "Reembolsado";
    case OrderStatusEnum.PARTIAL_REFUND:
      return "Reembolso Parcial";
    case OrderStatusEnum.DONE:
      return "Concluído";
    case OrderStatusEnum.REFUND_IN_PROCESS:
      return "Reembolso em Processamento";
    case OrderStatusEnum.PARTIAL_REFUND_IN_PROCESS:
      return "Reembolso Parcial em Processamento";
    default:
      return status;
  }
};

export const getMakerStatusBadge = (status: MakerStatusEnum) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    [MakerStatusEnum.ACTIVE]: { label: "Ativo", className: "badge-success" },
    [MakerStatusEnum.PENDING]: {
      label: "Pendente",
      className: "badge-warning",
    },
    [MakerStatusEnum.PAUSED]: { label: "Pausado", className: "badge-info" },
    [MakerStatusEnum.BLOCKED]: {
      label: "Bloqueado",
      className: "badge-error",
    },
  };

  const config = statusMap[status] || {
    label: status,
    className: "badge-default",
  };
  return (
    <span className={`badge ${config.className} maker-status-small`}>
      {config.label}
    </span>
  );
};
