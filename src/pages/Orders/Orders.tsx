import React, { useEffect } from "react";
import { OrderStatusEnum } from "../../types/enums/order-status.enum";
import { DollarSign, Calendar } from "lucide-react";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useOrders } from "../../hooks/useOrders";
import "./Orders.css";

const Orders: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  const { orders, loading, filterStatus, setFilterStatus } = useOrders();

  useEffect(() => {
    setPageTitle("Pedidos");
  }, [setPageTitle]);

  const getStatusBadge = (status: OrderStatusEnum) => {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="actions-page">
      <div className="filter-box">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as OrderStatusEnum | "")
          }
          className="filter-select"
        >
          <option value="">Todos os status</option>
          <option value={OrderStatusEnum.AWAITING_PAYMENT}>
            Aguardando Pagamento
          </option>
          <option value={OrderStatusEnum.ON_GOING}>Em Andamento</option>
          <option value={OrderStatusEnum.READY}>Pronto</option>
          <option value={OrderStatusEnum.DONE}>Concluído</option>
          <option value={OrderStatusEnum.DELAYED}>Atrasado</option>
          <option value={OrderStatusEnum.REFUNDED}>Reembolsado</option>
        </select>
      </div>

      <div className="table-container">
        {/* Desktop Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Maker</th>
              <th>Valor Total</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">{order.customerName}</td>
                <td>{order.makerName}</td>
                <td>
                  <div className="flex items-center gap-xs">
                    <DollarSign size={16} color="var(--success)" />
                    <span className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.totalValue)}
                    </span>
                  </div>
                </td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <div className="flex items-center gap-xs text-secondary">
                    <Calendar size={16} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        {orders.map((order) => (
          <div key={order.id} className="mobile-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">{order.customerName}</h3>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Maker</span>
                <span className="mobile-card-value">{order.makerName}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Valor Total</span>
                <span className="mobile-card-value font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(order.totalValue)}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Status</span>
                <span className="mobile-card-value">
                  {getStatusBadge(order.status)}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Data</span>
                <span className="mobile-card-value">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="empty-state">
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
