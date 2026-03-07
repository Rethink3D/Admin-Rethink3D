import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MakerStatusEnum } from "../../types/enums/maker-status.enum";
import { MakerPreviewDTO } from "../../types/dtos/maker.dto";
import {
  MapPin,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import { useMakersPreview } from "../../hooks/useMakersPreview";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useToast } from "../../contexts/ToastContext";
import "./Makers.css";

const Makers: React.FC = () => {
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();
  const { showToast } = useToast();

  const {
    makers = [],
    loading,
    setSearch,
    page,
    setPage,
    meta,
  } = useMakersPreview();

  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearched, setLastSearched] = useState("");

  useEffect(() => {
    setPageTitle("Makers");
  }, [setPageTitle]);

  useEffect(() => {
    if (searchTerm === lastSearched) return;

    const timer = setTimeout(() => {
      if (typeof setSearch === "function") {
        setSearch(searchTerm);
        setLastSearched(searchTerm);
        if (typeof setPage === "function") setPage(1);

        if (searchTerm) {
          showToast({
            type: "info",
            title: "Buscando...",
            message: `Filtrando por: ${searchTerm}`,
            duration: 3000,
          });
        } else if (lastSearched) {
          showToast({
            type: "info",
            title: "Limpando filtros...",
            message: "Exibindo todos os makers",
            duration: 3000,
          });
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchTerm, lastSearched, setSearch, setPage, showToast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchTerm !== lastSearched && typeof setSearch === "function") {
        setSearch(searchTerm);
        setLastSearched(searchTerm);
        if (typeof setPage === "function") setPage(1);

        if (searchTerm) {
          showToast({
            type: "info",
            title: "Buscando...",
            message: `Filtrando por: ${searchTerm}`,
            duration: 3000,
          });
        } else {
          showToast({
            type: "info",
            title: "Limpando filtros...",
            message: "Exibindo todos os makers",
            duration: 3000,
          });
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setLastSearched("");
    if (typeof setSearch === "function") setSearch("");
    if (typeof setPage === "function") setPage(1);
    showToast({
      type: "info",
      title: "Busca Limpa",
      message: "Exibindo todos os makers",
      duration: 3000,
    });
  };

  const handleEdit = (maker: MakerPreviewDTO) => {
    if (maker?.id) {
      navigate(`/makers/${maker.id}`);
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "-";
      return new Intl.DateTimeFormat("pt-BR").format(d);
    } catch {
      return "-";
    }
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
      label: String(status),
      className: "badge-default",
    };
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

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

      <div className="makers-header-actions">
        <div className="search-input-wrapper full-width">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={handleClearSearch}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {loading && (!makers || makers.length === 0) ? (
          <div className="loading-container">
            <Loading />
          </div>
        ) : (
          <>
            <table className="data-table desktop-only">
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
                {makers?.map((maker) => (
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
                    <td>{maker.productsCount || 0}</td>
                    <td>{maker.ordersCount || 0}</td>
                    <td>{getStatusBadge(maker.status)}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={() => handleEdit(maker)}
                        title="Editar Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mobile-only">
              <div className="mobile-cards-list">
                {makers?.map((maker) => (
                  <div key={maker.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-header-left">
                        <div className="maker-avatar-wrapper">
                          {maker.imageUrl ? (
                            <img
                              src={maker.imageUrl}
                              alt={maker.name}
                              className="maker-avatar"
                            />
                          ) : (
                            <div className="maker-avatar placeholder">
                              <User size={24} />
                            </div>
                          )}
                        </div>
                        <h3 className="mobile-card-title">{maker.name}</h3>
                      </div>
                      <div className="mobile-card-header-right">
                        {getStatusBadge(maker.status)}
                      </div>
                    </div>
                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Local</span>
                        <span className="mobile-card-value text-secondary">
                          {maker.city ? `${maker.city}/${maker.state}` : "N/A"}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Entrada</span>
                        <span className="mobile-card-value text-secondary">
                          {formatDate(maker.creationTime)}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Produtos</span>
                        <span className="mobile-card-value font-bold">
                          {maker.productsCount || 0}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Pedidos</span>
                        <span className="mobile-card-value font-bold">
                          {maker.ordersCount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="mobile-card-actions">
                      <button
                        className="mobile-action-btn"
                        onClick={() => handleEdit(maker)}
                      >
                        <Eye size={18} />
                        <span>Editar Detalhes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(!makers || makers.length === 0) && (
              <div className="empty-state">
                <p>Nenhum maker encontrado</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="makers-page-footer">
        <div className="pagination-area">
          {meta && meta.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() =>
                  typeof setPage === "function" && setPage(page - 1)
                }
              >
                <ChevronLeft size={20} />
              </button>
              <div className="pagination-info">
                Página <span>{page}</span> de <span>{meta.totalPages}</span>
              </div>
              <button
                className="pagination-btn"
                disabled={page === meta.totalPages}
                onClick={() =>
                  typeof setPage === "function" && setPage(page + 1)
                }
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="makers-stats-discreet">
          Total de <strong>{meta?.total || 0}</strong> makers
        </div>
      </div>
    </div>
  );
};

export default Makers;
