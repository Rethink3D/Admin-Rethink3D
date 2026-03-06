import { useEffect } from "react";
import {
  ArrowLeft,
  User,
  Package,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Info,
  Hammer,
  AlertCircle,
  History,
  TrendingDown,
  Plus,
  Minus,
} from "lucide-react";
import Loading from "../../../components/shared/Loading";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useDevolutionAnalysis } from "../../../hooks/useDevolutionAnalysis";
import { OrderTypeEnum } from "../../../types/enums/order-type.enum";
import {
  getStatusLabel,
  getMakerStatusBadge,
} from "../../../utils/devolution-utils";
import "./DevolutionAnalysis.css";

const DevolutionAnalysis = () => {
  const { setPageTitle } = usePageTitle();
  const {
    devolution,
    loading,
    isSubmitting,
    approvedItems,
    adminObservation,
    setAdminObservation,
    totalOriginal,
    totalApproved,
    returnedToMaker,
    isAnalysisOpen,
    handleQuantityChange,
    handleAction,
    navigate,
  } = useDevolutionAnalysis();

  useEffect(() => {
    setPageTitle("Análise de Devolução");
  }, [setPageTitle]);

  if (loading) return <Loading />;
  if (!devolution)
    return <div className="error-state">Devolução não encontrada</div>;

  return (
    <div className="analysis-page">
      <button
        className="back-btn"
        onClick={() => navigate("/actions/devolutions")}
      >
        <ArrowLeft size={18} />
        <span>Voltar para Lista</span>
      </button>

      <div className="analysis-grid">
        <div className="case-details">
          <section className="case-section">
            <h3 className="section-title">
              <History size={20} /> Motivo da Devolução
            </h3>
            <div className="bubble-reason">
              <p>{devolution.reason || "Nenhum motivo fornecido"}</p>
            </div>
            <div className="contact-info">
              <span>
                Contato fornecido:{" "}
                <strong>{devolution.contact || "N/A"}</strong>
              </span>
            </div>
          </section>

          <section className="case-section">
            <h3 className="section-title">
              <Package size={20} /> Itens Solicitados
            </h3>
            <div className="items-list">
              {(devolution.items || []).map((item) => (
                <div key={item.id} className="item-row">
                  <div className="item-main-info">
                    <div className="item-icon-box">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="item-name">
                        {item.name || "Item sem descrição"}
                      </p>
                      <span className="item-type">
                        {item.type === OrderTypeEnum.PRODUCT
                          ? "Produto de Catálogo"
                          : item.type === OrderTypeEnum.CUSTOM
                            ? "Pedido Personalizado"
                            : "Tipo Desconhecido"}
                      </span>
                    </div>
                  </div>
                  <div className="item-qty-control">
                    <div className="qty-info">
                      <span>
                        Solicitado: <strong>{item.quantity}un</strong>
                      </span>
                      <span>
                        Preço unit:{" "}
                        <strong>
                          R$ {Number(item.priceWithFee).toFixed(2)}
                        </strong>
                      </span>
                    </div>
                    <div className="qty-selector">
                      <label>Aprovar Qtd:</label>
                      <div className="qty-stepper">
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (approvedItems[item.id] || 0) - 1,
                              item.quantity,
                            )
                          }
                          disabled={
                            !isAnalysisOpen ||
                            (approvedItems[item.id] || 0) <= 0
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-display">
                          {approvedItems[item.id] || 0}
                        </span>
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (approvedItems[item.id] || 0) + 1,
                              item.quantity,
                            )
                          }
                          disabled={
                            !isAnalysisOpen ||
                            (approvedItems[item.id] || 0) >= item.quantity
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="case-section">
            <h3 className="section-title">
              <ExternalLink size={20} /> Evidências (Fotos)
            </h3>
            {(devolution.images || []).length > 0 ? (
              <div className="evidence-grid">
                {(devolution.images || []).map((url, idx) => (
                  <div
                    key={idx}
                    className="evidence-img-wrapper"
                    onClick={() => window.open(url, "_blank")}
                  >
                    <img src={url} alt={`Evidência ${idx + 1}`} />
                    <div className="zoom-overlay">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-evidence">Nenhuma foto enviada.</p>
            )}
          </section>

          <section className="case-section observation-section">
            <h3 className="section-title">
              <Info size={20} /> Conclusão / Observação
            </h3>
            {isAnalysisOpen ? (
              <>
                <textarea
                  className="admin-textarea"
                  placeholder="Descreva a conclusão da análise (ex: 'O produto apresenta vício de fabricação...', 'O cliente desistiu do reembolso...')"
                  value={adminObservation}
                  onChange={(e) => setAdminObservation(e.target.value)}
                />
                <p className="observation-hint">
                  <Info size={13} />
                  Esta observação será exibida para o <strong>cliente</strong> e
                  o <strong>maker</strong> após a conclusão da análise.
                </p>
              </>
            ) : (
              <div className="bubble-observation">
                <p>
                  {devolution.adminObservation ||
                    "Nenhuma observação registrada."}
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="stakeholders-panel">
          <section className="stakeholder-card user-card">
            <h4>Cliente</h4>
            <div className="stakeholder-info">
              <div className="avatar-wrapper">
                {devolution.user?.avatar ? (
                  <img
                    src={devolution.user.avatar}
                    alt={devolution.user.name}
                  />
                ) : (
                  <User size={32} />
                )}
              </div>
              <div>
                <h5>{devolution.user?.name || "Cliente não identificado"}</h5>
                <p>{devolution.user?.email || "E-mail não disponível"}</p>
              </div>
            </div>
          </section>

          <section className="stakeholder-card maker-card">
            <h4>Maker Responsável</h4>
            <div className="stakeholder-info">
              <div className="avatar-wrapper">
                {devolution.maker?.avatar ? (
                  <img
                    src={devolution.maker.avatar}
                    alt={devolution.maker.name}
                  />
                ) : (
                  <Hammer size={32} />
                )}
              </div>
              <div>
                <h5>{devolution.maker?.name || "Maker não identificado"}</h5>
                {devolution.maker?.status ? (
                  getMakerStatusBadge(devolution.maker.status)
                ) : (
                  <span className="maker-badge">Status não disponível</span>
                )}
              </div>
            </div>
          </section>

          {!isAnalysisOpen && (
            <section className="status-closed-info">
              <AlertCircle size={20} />
              <div>
                <h5>Análise Concluída</h5>
                <p>
                  Esta solicitação já foi processada e está com o status{" "}
                  <strong>{getStatusLabel(devolution.orderStatus)}</strong>. Não
                  é possível alterar a decisão.
                </p>
              </div>
            </section>
          )}

          <section className="refund-summary">
            <h4>Resumo Financeiro</h4>

            <div className="summary-row">
              <span>
                <Package size={14} /> Valor Total Solicitado:
              </span>
              <strong>R$ {totalOriginal.toFixed(2)}</strong>
            </div>

            <div className="summary-row maker-return">
              <span>
                <TrendingDown size={14} /> Retorno ao Maker (Mantido):
              </span>
              <strong>R$ {returnedToMaker.toFixed(2)}</strong>
            </div>

            <div className="summary-row highlighted">
              <span>
                <CheckCircle2 size={18} /> Total Reembolso ao Cliente:
              </span>
              <span className="total-refund">
                R$ {totalApproved.toFixed(2)}
              </span>
            </div>

            <div
              className={`partial-order-notice ${totalApproved >= (devolution?.orderTotalValue || 0) ? "full-refund" : ""}`}
            >
              <Info size={14} />
              <span>
                {totalApproved >= (devolution?.orderTotalValue || 0) ? (
                  <>
                    Este reembolso corresponde ao{" "}
                    <strong>valor total pago</strong> pelo cliente (R${" "}
                    {devolution.orderTotalValue.toFixed(2)}).
                  </>
                ) : (
                  <>
                    Este resumo refere-se aos{" "}
                    <strong>itens selecionados</strong>. O valor total do pedido
                    original foi{" "}
                    <strong>R$ {devolution?.orderTotalValue.toFixed(2)}</strong>
                    .
                  </>
                )}
              </span>
            </div>
          </section>

          <div className="decision-actions">
            <button
              className="btn-decision btn-approve"
              disabled={isSubmitting || totalApproved === 0 || !isAnalysisOpen}
              onClick={() =>
                handleAction(
                  totalApproved === totalOriginal
                    ? "REFUNDED"
                    : "PARTIAL_REFUND",
                )
              }
            >
              <CheckCircle2 size={18} />
              {totalApproved === totalOriginal
                ? "Aprovar Reembolso Total"
                : "Aprovar Reembolso Parcial"}
            </button>
            <button
              className="btn-decision btn-reject"
              disabled={isSubmitting || !isAnalysisOpen}
              onClick={() => handleAction("DONE")}
            >
              <XCircle size={18} />
              Rejeitar / Concluir sem Reembolso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevolutionAnalysis;
