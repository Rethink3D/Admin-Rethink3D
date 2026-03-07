import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomRequestStatusEnum } from "../../types/enums/custom-request-status.enum";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useCustomRequests } from "../../hooks/useCustomRequests";
import { useToast } from "../../contexts/ToastContext";
import { formatDateTime } from "../../utils/formatters";
import { getCustomRequestStatusBadge } from "../../utils/custom-request-utils";
import { CustomRequestResponseDTO } from "../../types/dtos/custom-request.dto";
import { Search, ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import "../Orders/Orders.css";

const CustomRequests: React.FC = () => {
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();
  const {
    requests,
    loading,
    filterStatus,
    setFilterStatus,
    setSearch,
    page,
    setPage,
    meta,
  } = useCustomRequests();
  const { showToast } = useToast();

  const handleRequestClick = (id: string) => {
    navigate(`/custom-requests/${id}`);
  };

  useEffect(() => {
    setPageTitle("Solicitações Customizadas");
  }, [setPageTitle]);

  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearched, setLastSearched] = useState("");

  useEffect(() => {
    if (searchTerm === lastSearched) return;

    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setLastSearched(searchTerm);
      setPage(1);

      if (searchTerm) {
        showToast({
          type: "info",
          title: "Buscando...",
          message: `Filtrando por: ${searchTerm}`,
          duration: 3000,
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchTerm, lastSearched, setSearch, setPage, showToast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchTerm !== lastSearched) {
        setSearch(searchTerm);
        setLastSearched(searchTerm);
        setPage(1);
        if (searchTerm) {
          showToast({
            type: "info",
            title: "Buscando...",
            message: `Filtrando por: ${searchTerm}`,
            duration: 3000,
          });
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setLastSearched("");
    setSearch("");
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as CustomRequestStatusEnum | "");
    setPage(1);
  };

  if (loading && !requests.length) {
    return <Loading />;
  }

  return (
    <div className="orders-page">
      <div className="filter-area">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por Título, ID, Cliente ou Maker..."
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

        <div className="filter-box">
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="">Todos os status</option>
            <option value={CustomRequestStatusEnum.OPEN}>Aberta</option>
            <option value={CustomRequestStatusEnum.ACCEPTED}>Aceita</option>
            <option value={CustomRequestStatusEnum.CANCELLED}>Cancelada</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Cliente</th>
              <th>Maker Designado</th>
              <th>Status</th>
              <th>Data</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request: CustomRequestResponseDTO) => (
              <tr
                key={request.id}
                onClick={() => handleRequestClick(request.id)}
                className="clickable-row"
              >
                <td className="font-medium">{request.title}</td>
                <td>{request.user.name}</td>
                <td>
                  {request.maker?.name || (
                    <span className="text-tertiary">Aguardando...</span>
                  )}
                </td>
                <td>{getCustomRequestStatusBadge(request.status)}</td>
                <td>
                  <div className="flex items-center gap-xs text-secondary">
                    <Calendar size={16} />
                    <span>{formatDateTime(request.creationTime)}</span>
                  </div>
                </td>
                <td className="text-right">
                  <ChevronRight
                    size={20}
                    color="var(--text-tertiary)"
                    className="action-icon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.map((request: CustomRequestResponseDTO) => (
          <div
            key={request.id}
            className="mobile-card clickable-card"
            onClick={() => handleRequestClick(request.id)}
          >
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">{request.title}</h3>
              <ChevronRight size={18} color="var(--text-tertiary)" />
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Cliente</span>
                <span className="mobile-card-value">{request.user.name}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Maker</span>
                <span className="mobile-card-value">
                  {request.maker?.name || "Aguardando..."}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Status</span>
                <span className="mobile-card-value">
                  {getCustomRequestStatusBadge(request.status)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma solicitação encontrada</p>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Página {meta.page} de {meta.totalPages} ({meta.total} total)
            </div>
            <button
              className="page-button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  Math.abs(p - page) <= 2 || p === 1 || p === meta.totalPages,
              )
              .map((p, i, arr) => {
                const showEllipsis = i > 0 && p !== arr[i - 1] + 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      className={`page-button ${page === p ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
            <button
              className="page-button"
              onClick={() => setPage(page + 1)}
              disabled={page === meta.totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRequests;
