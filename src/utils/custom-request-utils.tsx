import { CustomRequestStatusEnum } from "../types/enums/custom-request-status.enum";

export const getCustomRequestStatusBadge = (
  status: CustomRequestStatusEnum,
) => {
  switch (status) {
    case CustomRequestStatusEnum.OPEN:
      return <span className="badge badge-info">Aberta</span>;
    case CustomRequestStatusEnum.ACCEPTED:
      return <span className="badge badge-success">Aceita</span>;
    case CustomRequestStatusEnum.CANCELLED:
      return <span className="badge badge-error">Cancelada</span>;
    default:
      return <span className="badge badge-secondary">{status}</span>;
  }
};
