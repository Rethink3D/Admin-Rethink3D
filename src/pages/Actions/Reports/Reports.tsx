import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Flag,
  User,
  Store,
  Box,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Search,
  ExternalLink,
  Ban,
  Unlock,
  X,
} from "lucide-react";
import Loading from "../../../components/shared/Loading";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useReports } from "../../../hooks/useReports";
import { useToast } from "../../../contexts/ToastContext";
import { useModal } from "../../../contexts/ModalContext";
import { productsService } from "../../../services/products.service";
import { makersService } from "../../../services/makers.service";
import { MakerStatusEnum } from "../../../types/enums/maker-status.enum";
import "./Reports.css";

const reasonTranslations: Record<string, string> = {
  INAPPROPRIATE_CONTENT: "Conteúdo Inadequado",
  COPYRIGHT_INFRINGEMENT: "Violação de Direitos Autorais",
  ILLEGAL_PRODUCT: "Produto Ilegal ou Restrito",
  MISLEADING_INFORMATION: "Informação Falsa / Enganosa",
  SAFETY_ISSUE: "Questão de Segurança",
  MISLEADING_IMAGES: "Imagens Enganosas",
  FAKE_STORE: "Loja Falsa / Golpe",
  ABUSIVE_BEHAVIOR: "Comportamento Abusivo",
  NON_RESPONSIVENESS: "Falta de Retorno / Resposta",
  FRAUD_OR_NON_DELIVERY: "Fraude ou Não Entrega",
  SPAM_OR_ABUSE: "Spam ou Abuso",
  OTHER: "Outro",
};

const Reports: React.FC = () => {
  const { setPageTitle, setBackAction } = usePageTitle();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, hideModal } = useModal();
  const {
    reports,
    meta,
    loading,
    page,
    setPage,
    setSearch,
    reason,
    setReason,
    filterResolved,
    setFilterResolved,
    resolveReport,
    unresolveReport,
    refresh,
  } = useReports();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearched, setLastSearched] = useState("");
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    setPageTitle("Gerenciar Denúncias");
    setBackAction({ label: "Ações", path: "/actions" });
  }, [setPageTitle, setBackAction]);

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
      } else {
        showToast({
          type: "info",
          title: "Limpando filtros...",
          message: "Exibindo todas as denúncias",
          duration: 3000,
        });
      }
    }, 800);

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
        } else {
          showToast({
            type: "info",
            title: "Limpando filtros...",
            message: "Exibindo todas as denúncias",
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
    showToast({
      type: "info",
      title: "Busca Limpa",
      message: "Exibindo todas as denúncias",
      duration: 3000,
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleResolve = async (id: string) => {
    await resolveReport(id);
    showToast({
      type: "success",
      title: "Denúncia Resolvida",
      message: "A denúncia foi marcada como resolvida com sucesso.",
    });
  };

  const handleUnresolve = async (id: string) => {
    await unresolveReport(id);
    showToast({
      type: "info",
      title: "Denúncia Reaberta",
      message: "A denúncia foi reaberta para análise.",
    });
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    showModal({
      type: "confirm",
      title: "Excluir Produto Denunciado",
      message: `Tem certeza absoluta de que deseja excluir permanentemente o produto "${productName}"? Esta ação não pode ser desfeita.`,
      confirmText: "Sim, Excluir",
      cancelText: "Não, Cancelar",
      onConfirm: async () => {
        try {
          await productsService.deleteProduct(productId);
          showToast({
            type: "success",
            title: "Produto Excluído",
            message: "O produto foi removido da plataforma com sucesso.",
          });
          hideModal();
          refresh();
        } catch (err) {
          showToast({
            type: "error",
            title: "Erro ao Excluir",
            message: "Não foi possível excluir o produto.",
          });
          hideModal();
        }
      },
      onCancel: hideModal,
    });
  };

  const handleBlockMaker = (makerId: string, makerName: string, reportId: string) => {
    showModal({
      type: "confirm",
      title: "Bloquear Maker / Loja",
      message: `Tem certeza de que deseja BLOQUEAR o Maker "${makerName}"? Todos os produtos dele ficarão ocultos e esta denúncia será marcada como resolvida automaticamente.`,
      confirmText: "Sim, Bloquear",
      cancelText: "Não, Cancelar",
      onConfirm: async () => {
        try {
          await makersService.updateMaker(makerId, {
            status: MakerStatusEnum.BLOCKED,
          });
          await resolveReport(reportId);
          showToast({
            type: "success",
            title: "Maker Bloqueado",
            message: `A loja "${makerName}" foi suspensa e a denúncia resolvida com sucesso.`,
          });
          hideModal();
          refresh();
        } catch (err) {
          showToast({
            type: "error",
            title: "Erro ao Bloquear",
            message: "Não foi possível bloquear a loja.",
          });
          hideModal();
        }
      },
      onCancel: hideModal,
    });
  };

  if (loading && reports.length === 0) {
    return <Loading />;
  }

  return (
    <div className="reports-page">
      <div className={`reports-rules-accordion ${showRules ? "is-open" : ""}`}>
        <button
          className="accordion-header"
          onClick={() => setShowRules(!showRules)}
          title={showRules ? "Ocultar Diretrizes de Moderação" : "Visualizar Diretrizes de Moderação"}
        >
          <div className="header-title">
            <AlertTriangle className="banner-icon" size={18} />
            <span>Diretrizes e Regras do Sistema (Clique para expandir)</span>
          </div>
          <div className="header-arrow">
            {showRules ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {showRules && (
          <div className="accordion-content">
            <ul>
              <li>
                <strong>Bloqueio Automático (Auto-Block):</strong> Se um Maker acumular <strong>5 denúncias ativas (não resolvidas)</strong>, o sistema suspende sua loja automaticamente e oculta seus produtos.
              </li>
              <li>
                <strong>Prevenção contra Spam / Boicote:</strong> Cada cliente pode manter apenas <strong>uma única denúncia ativa por vez</strong> direcionada ao mesmo Maker, protegendo contra ataques coordenados de reports.
              </li>
              <li>
                <strong>Fluxo de Moderação & Reativação:</strong>
                <ul>
                  <li>Ao bloquear um Maker através de uma denúncia ativa, ela é resolvida automaticamente no mesmo instante.</li>
                  <li>Ao reativar um Maker bloqueado (alterando de "Bloqueado" para "Ativo"), <strong>todas as denúncias ativas contra ele são marcadas como resolvidas</strong>, limpando o histórico dele.</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="reports-header-bar filter-area">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Pesquisar por denunciante, produto ou loja..."
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

        <div className="filters-group">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Motivos</option>
            {Object.entries(reasonTranslations).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={filterResolved === null ? "" : filterResolved.toString()}
            onChange={(e) => {
              const val = e.target.value;
              setFilterResolved(val === "" ? null : val === "true");
            }}
            className="filter-select"
          >
            <option value="">Todas as Situações</option>
            <option value="false">Pendentes</option>
            <option value="true">Resolvidas</option>
          </select>
        </div>
      </div>

      <div className="reports-container">
        {reports.length > 0 ? (
          <div className="reports-list">
            {reports.map((report) => {
              const isProductReport = !!report.productId;

              return (
                <div
                  key={report.id}
                  className={`report-card ${report.resolved ? "resolved" : "pending"}`}
                >
                  <div
                    className="report-card-header"
                    onClick={() => toggleExpand(report.id)}
                  >
                    <div className="report-badge-section">
                      {isProductReport ? (
                        <div className="item-badge product-type">
                          <Box size={16} />
                          <span>Produto</span>
                        </div>
                      ) : (
                        <div className="item-badge maker-type">
                          <Store size={16} />
                          <span>Loja</span>
                        </div>
                      )}

                      <div className="user-info">
                        <h4>Denunciado: {isProductReport ? report.productName : report.makerName}</h4>
                        <span className="reporter-span">
                          <User size={12} /> Feito por: {report.userName || "Usuário"}
                        </span>
                      </div>
                    </div>

                    <div className="report-meta">
                      <span className="reason-badge">
                        {reasonTranslations[report.reason] || report.reason}
                      </span>

                      <div className="report-date">
                        <Clock size={14} />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>

                      {report.resolved ? (
                        <span className="status-badge resolved">Resolvida</span>
                      ) : (
                        <span className="status-badge pending">Pendente</span>
                      )}

                      <button className="expand-button">
                        {expandedId === report.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedId === report.id && (
                    <div className="report-card-content">
                      <div className="details-grid">
                        <div className="details-column">
                          <h5>Dados Gerais</h5>
                          <p>
                            <strong>Denunciante:</strong> {report.userName}
                          </p>
                          <p>
                            <strong>Loja do Maker:</strong> {report.makerName}
                          </p>
                          {isProductReport && (
                            <p>
                              <strong>Produto:</strong> {report.productName}
                            </p>
                          )}
                        </div>

                        <div className="details-column">
                          <h5>Descrição do Problema</h5>
                          {report.reason === "OTHER" ? (
                            <div className="description-box highlight">
                              <AlertTriangle size={16} className="alert-icon" />
                              <p>
                                <strong>Descrição do Usuário:</strong>{" "}
                                {report.other || "Sem descrição adicional fornecida."}
                              </p>
                            </div>
                          ) : (
                            <p>
                              Esta denúncia foi categorizada sob o motivo{" "}
                              <strong>"{reasonTranslations[report.reason]}"</strong>.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="report-actions-bar">
                        <div className="nav-actions">
                          {isProductReport && report.productId && (
                            <button
                              className="nav-btn"
                              onClick={() => navigate(`/products/${report.productId}`)}
                            >
                              <ExternalLink size={16} /> Ver Produto
                            </button>
                          )}
                          <button
                            className="nav-btn"
                            onClick={() => navigate(`/makers/${report.makerId}`)}
                          >
                            <ExternalLink size={16} /> Ver Perfil da Loja
                          </button>
                        </div>

                        <div className="moderation-actions">
                          {!report.resolved ? (
                            <>
                              {isProductReport && report.productId && (
                                <button
                                  className="action-btn danger-btn"
                                  onClick={() =>
                                    handleDeleteProduct(
                                      report.productId!,
                                      report.productName || "Produto"
                                    )
                                  }
                                >
                                  <Trash2 size={16} /> Excluir Produto
                                </button>
                              )}

                              <button
                                className="action-btn warning-btn"
                                onClick={() =>
                                  handleBlockMaker(report.makerId, report.makerName, report.id)
                                }
                              >
                                <Ban size={16} /> Bloquear Maker
                              </button>

                              <button
                                className="action-btn success-btn"
                                onClick={() => handleResolve(report.id)}
                              >
                                <CheckCircle2 size={16} /> Marcar Resolvida
                              </button>
                            </>
                          ) : (
                            <button
                              className="action-btn info-btn"
                              onClick={() => handleUnresolve(report.id)}
                            >
                              <Unlock size={16} /> Reabrir Denúncia
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Flag size={48} className="empty-icon" />
            <p>Nenhuma denúncia encontrada para os critérios selecionados.</p>
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="pagination-container">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="page-btn"
          >
            Anterior
          </button>
          <span className="page-info">
            Página {page} de {meta.totalPages}
          </span>
          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
            className="page-btn"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
