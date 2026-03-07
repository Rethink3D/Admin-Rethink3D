import React, { useEffect, useState, useMemo } from "react";
import {
  Clock,
  ChevronRight,
  AlertCircle,
  Package,
  User,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/shared/Loading";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useDevolutions } from "../../../hooks/useDevolutions";
import { OrderStatusEnum } from "../../../types/enums/order-status.enum";
import "./Devolutions.css";

const FILTER_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Em Análise", value: OrderStatusEnum.REFUND_IN_ANALYSIS },
  { label: "Em Processamento", value: OrderStatusEnum.REFUND_IN_PROCESS },
  {
    label: "Parcial Processando",
    value: OrderStatusEnum.PARTIAL_REFUND_IN_PROCESS,
  },
  { label: "Reembolsados", value: OrderStatusEnum.REFUNDED },
  { label: "Parcial", value: OrderStatusEnum.PARTIAL_REFUND },
  { label: "Finalizados", value: OrderStatusEnum.DONE },
];

const Devolutions: React.FC = () => {
  const { setPageTitle, setBackAction } = usePageTitle();
  const navigate = useNavigate();
  const { devolutions, loading, error } = useDevolutions();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    setPageTitle("Gerenciar Devoluções");
    setBackAction({ label: "Ações", path: "/actions" });
  }, [setPageTitle, setBackAction]);

  const filteredAndSortedDevolutions = useMemo(() => {
    let result = [...devolutions];

    if (filterStatus !== "all") {
      result = result.filter((d) => d.orderStatus === filterStatus);
    }

    return result.sort((a, b) => {
      if (
        a.orderStatus === OrderStatusEnum.REFUND_IN_ANALYSIS &&
        b.orderStatus !== OrderStatusEnum.REFUND_IN_ANALYSIS
      )
        return -1;
      if (
        a.orderStatus !== OrderStatusEnum.REFUND_IN_ANALYSIS &&
        b.orderStatus === OrderStatusEnum.REFUND_IN_ANALYSIS
      )
        return 1;

      return (
        new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
      );
    });
  }, [devolutions, filterStatus]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusBadgeClass = (status: OrderStatusEnum) => {
    switch (status) {
      case OrderStatusEnum.REFUND_IN_ANALYSIS:
        return "status-analysis";
      case OrderStatusEnum.REFUND_IN_PROCESS:
        return "status-processing";
      case OrderStatusEnum.PARTIAL_REFUND_IN_PROCESS:
        return "status-partial-processing";
      case OrderStatusEnum.REFUNDED:
        return "status-refunded";
      case OrderStatusEnum.PARTIAL_REFUND:
        return "status-partial";
      case OrderStatusEnum.DONE:
        return "status-done";
      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status: OrderStatusEnum) => {
    switch (status) {
      case OrderStatusEnum.REFUND_IN_ANALYSIS:
        return "Em Análise";
      case OrderStatusEnum.REFUND_IN_PROCESS:
        return "Reemb. em Proc.";
      case OrderStatusEnum.PARTIAL_REFUND_IN_PROCESS:
        return "Parcial em Proc.";
      case OrderStatusEnum.REFUNDED:
        return "Reembolsado";
      case OrderStatusEnum.PARTIAL_REFUND:
        return "Reemb. Parcial";
      case OrderStatusEnum.DONE:
        return "Concluído";
      default:
        return status;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="devolutions-page">
      <div className="dev-notice">
        <AlertCircle size={18} className="dev-notice__icon" />
        <p className="dev-notice__text">
          Listagem de todas as solicitações de devolução e reembolso iniciadas
          pelos clientes. Analise os motivos e evidências antes de tomar uma
          decisão.
        </p>
      </div>

      <div className="dev-toolbar">
        <div className="dev-filters">
          <div className="dev-filters-desktop">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`dev-filter-btn${filterStatus === opt.value ? " active" : ""}`}
                onClick={() => setFilterStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <select
            className="dev-filters-mobile"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="dev-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="dev-list">
        {filteredAndSortedDevolutions.length > 0 ? (
          <div className="dev-grid">
            {filteredAndSortedDevolutions.map((devolution) => (
              <div
                key={devolution.id}
                className="dev-card"
                onClick={() =>
                  navigate(`/actions/devolutions/${devolution.id}`)
                }
              >
                <div className="dev-card__top">
                  <div className="dev-card__order-id">
                    <Package size={15} />
                    <span>
                      Pedido #{devolution.orderId?.substring(0, 8) || "N/A"}
                    </span>
                  </div>
                  <span
                    className={`dev-badge ${getStatusBadgeClass(devolution.orderStatus)}`}
                  >
                    {getStatusLabel(devolution.orderStatus)}
                  </span>
                </div>

                <div className="dev-card__body">
                  <div className="dev-card__user">
                    <User size={14} />
                    <span>
                      {devolution.user?.name || "Usuário não identificado"}
                    </span>
                  </div>
                  <p className="dev-card__reason">
                    {(devolution.reason || "").length > 100
                      ? `${devolution.reason.substring(0, 100)}...`
                      : devolution.reason || "Sem motivo informado"}
                  </p>
                </div>

                <div className="dev-card__footer">
                  <div className="dev-card__date">
                    <Clock size={13} />
                    <span>{formatDate(devolution.creationTime)}</span>
                  </div>
                  <div className="dev-card__action">
                    Analise <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dev-empty">
            <Info size={44} />
            <h3>Nenhuma devolução encontrada</h3>
            <p>Não há solicitações de devolução no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devolutions;
