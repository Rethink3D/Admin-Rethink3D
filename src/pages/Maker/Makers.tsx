import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MakerStatusEnum } from "../../types/enums/maker-status.enum";
import { MakerPreviewDTO } from "../../types/dtos/maker.dto";
import { Edit2, MapPin, Info, ChevronDown, ChevronUp } from "lucide-react";
import Loading from "../../components/shared/Loading";
import { useMakersPreview } from "../../hooks/useMakersPreview";
import "./Makers.css";

const Makers: React.FC = () => {
  const navigate = useNavigate();
  const { makers, loading, searchQuery, setSearchQuery } = useMakersPreview();
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const handleEdit = (maker: MakerPreviewDTO) => {
    navigate(`/makers/${maker.id}`);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const getStatusBadge = (status: MakerStatusEnum) => {
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
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="makers-page">
      <div className="status-legend-card">
        <div
          className="legend-header"
          onClick={() => setIsLegendOpen(!isLegendOpen)}
        >
          <div className="legend-title-wrapper">
            <Info size={20} className="text-secondary" />
            <h3>Entenda os Status</h3>
          </div>
          <button className="legend-toggle-btn">
            {isLegendOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isLegendOpen && (
          <div className="legend-grid animate-fadeIn">
            <div className="legend-item">
              <span className="badge badge-success">Ativo</span>
              <p>
                Loja visível e operante. Acesso total para gerenciar pedidos,
                enviar orçamentos e usar o chat.
              </p>
            </div>
            <div className="legend-item">
              <span className="badge badge-warning">Pendente</span>
              <p>
                Aguardando análise. Pode cadastrar produtos, mas a loja
                permanece invisível e não recebe pedidos.
              </p>
            </div>
            <div className="legend-item">
              <span className="badge badge-info">Pausado</span>
              <p>
                Loja temporariamente oculta. Não recebe novos pedidos, mas pode
                finalizar os que estão em andamento.
              </p>
            </div>
            <div className="legend-item">
              <span className="badge badge-error">Bloqueado</span>
              <p>
                Conta suspensa devido a infrações. Acesso às funcionalidades e
                visibilidade da loja estão revogados.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Buscar maker por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="table-container desktop-only">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Localização</th>
              <th>Entrada</th>
              <th>Produtos</th>
              <th>Pedidos</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {makers.map((maker) => (
              <tr key={maker.id}>
                <td>
                  <div className="maker-info">
                    {maker.imageUrl && (
                      <img
                        src={maker.imageUrl}
                        alt={maker.name}
                        className="maker-avatar"
                      />
                    )}
                    <span className="maker-name">{maker.name}</span>
                  </div>
                </td>
                <td className="text-secondary text-sm">
                  {maker.city && maker.state ? (
                    <div className="flex items-center gap-xs">
                      <MapPin size={14} />
                      {maker.city} - {maker.state}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="text-secondary text-sm">
                  {formatDate(maker.creationTime)}
                </td>
                <td>{maker.productsCount}</td>
                <td>{maker.ordersCount}</td>
                <td>{getStatusBadge(maker.status)}</td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => handleEdit(maker)}
                    title="Editar Detalhes"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards mobile-only">
        {makers.map((maker) => (
          <div key={maker.id} className="mobile-card">
            <div className="mobile-card-header">
              {maker.imageUrl && (
                <img
                  src={maker.imageUrl}
                  alt={maker.name}
                  className="maker-avatar"
                />
              )}
              <div className="mobile-card-header-content">
                <h3 className="mobile-card-title">{maker.name}</h3>
                {getStatusBadge(maker.status)}
              </div>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Local</span>
                <span className="mobile-card-value">
                  {maker.city ? `${maker.city}/${maker.state}` : "N/A"}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Entrada</span>
                <span className="mobile-card-value">
                  {formatDate(maker.creationTime)}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Produtos</span>
                <span className="mobile-card-value">{maker.productsCount}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Pedidos</span>
                <span className="mobile-card-value">{maker.ordersCount}</span>
              </div>
            </div>

            <div className="mobile-card-actions">
              <button
                className="mobile-action-btn"
                onClick={() => handleEdit(maker)}
              >
                <Edit2 size={18} />
                <span>Editar Detalhes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Makers;
