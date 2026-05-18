import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminUpdateMakerDTO } from "../../types/dtos/maker.dto";
import { MakerStatusEnum } from "../../types/enums/maker-status.enum";
import { ServiceTypeEnum } from "../../types/enums/service-type.enum";
import {
  Save,
  Package,
  ShoppingCart,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Info,
  Store,
  Copy,
  Check,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useMakerDetail } from "../../hooks/useMakerDetail";
import { useModal } from "../../contexts/ModalContext";
import "./MakerDetail.css";

const MakerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageTitle, setBackAction } = usePageTitle();
  const { maker, loading, saving, updateMaker } = useMakerDetail(id!);
  const { showModal } = useModal();

  const [copiedMakerId, setCopiedMakerId] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);

  const [formData, setFormData] = useState<AdminUpdateMakerDTO>({
    name: "",
    description: "",
    status: undefined,
    service: undefined,
  });

  useEffect(() => {
    if (maker) {
      setFormData({
        name: maker.name,
        description: maker.description,
        status: maker.status,
        service: maker.service,
      });
      setPageTitle(`Detalhamento do Maker`);
    }
  }, [maker, setPageTitle]);

  const hasChanges = useMemo(() => {
    if (!maker) return false;
    return (
      formData.name !== maker.name ||
      formData.description !== maker.description ||
      formData.status !== maker.status ||
      formData.service !== maker.service
    );
  }, [formData, maker]);

  const willSendWelcomeEmail = useMemo(() => {
    if (!maker) return false;
    return (
      maker.status === MakerStatusEnum.PENDING &&
      formData.status === MakerStatusEnum.ACTIVE
    );
  }, [maker, formData.status]);

  const willResolveAllReports = useMemo(() => {
    if (!maker) return false;
    return (
      maker.status === MakerStatusEnum.BLOCKED &&
      formData.status === MakerStatusEnum.ACTIVE
    );
  }, [maker, formData.status]);

  const handleBack = useCallback(() => {
    if (hasChanges) {
      showModal({
        type: "confirm",
        title: "Alterações não salvas",
        message: "Você tem edições pendentes. Deseja sair sem salvar?",
        confirmText: "Sair sem salvar",
        onConfirm: () => navigate("/makers"),
      });
    } else {
      navigate("/makers");
    }
  }, [hasChanges, navigate, showModal]);

  useEffect(() => {
    setBackAction({ label: "Makers", onClick: handleBack });
  }, [handleBack, setBackAction]);

  const handleSave = () => {
    updateMaker(formData);
  };

  const handleCopyMakerId = () => {
    if (maker?.id) {
      navigator.clipboard.writeText(maker.id);
      setCopiedMakerId(true);
      setTimeout(() => setCopiedMakerId(false), 2000);
    }
  };

  const handleCopyUserId = () => {
    if (maker?.userId) {
      navigator.clipboard.writeText(maker.userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return <Loading />;
  }

  if (!maker) {
    return null;
  }

  return (
    <div className="maker-detail-page">
      <div className="maker-detail-container">
        <div className="detail-header">
          <div className="header-info">
            <h1 className="header-title">{maker.name}</h1>
          </div>

          <button
            className="save-button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            <Save size={20} />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>

        <div className="maker-detail-grid">
          <div className="detail-column">
            <div className="id-over-card">
              <span className="id-label-mini">MAKER ID</span>
              <div className="maker-id-container">
                <span className="maker-id-badge">{maker.id}</span>
                <button
                  className={`copy-id-btn ${copiedMakerId ? "copied" : ""}`}
                  onClick={handleCopyMakerId}
                  title="Copiar ID do Maker"
                >
                  {copiedMakerId ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="info-card">
              <h2 className="card-title">
                <Store size={20} /> Perfil da Loja
              </h2>

              <div className="maker-profile-section">
                <div className="maker-avatar-large">
                  {maker.imageUrl ? (
                    <img src={maker.imageUrl} alt={maker.name} />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <div className="form-area" style={{ flex: 1 }}>
                  <div className="form-group">
                    <label>Nome da Loja</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-area">
                <div className="form-row dual">
                  <div className="form-group">
                    <label>Especialidade</label>
                    <select
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service: e.target.value as ServiceTypeEnum,
                        })
                      }
                    >
                      <option value={ServiceTypeEnum.PRINTING}>
                        Impressão
                      </option>
                      <option value={ServiceTypeEnum.PRINTING_MODELING}>
                        Modelagem + Impressão
                      </option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status da Conta</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as MakerStatusEnum,
                        })
                      }
                      className={`status-select ${formData.status?.toLowerCase()}`}
                    >
                      <option value={MakerStatusEnum.ACTIVE}>Ativo</option>
                      <option value={MakerStatusEnum.PENDING}>Pendente</option>
                      <option value={MakerStatusEnum.PAUSED}>Pausado</option>
                      <option value={MakerStatusEnum.BLOCKED}>Bloqueado</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição da Loja</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {willSendWelcomeEmail && (
                  <div className="welcome-email-notice">
                    <Info size={18} />
                    <span>
                      <strong>E-mail Automático:</strong> Salvar como Ativo
                      enviará boas-vindas.
                    </span>
                  </div>
                )}

                {willResolveAllReports && (
                  <div className="resolve-reports-notice">
                    <Info size={18} />
                    <span>
                      <strong>Aviso de Denúncias:</strong> Ao alterar de Bloqueado para Ativo, todas as denúncias abertas contra este Maker serão automaticamente marcadas como resolvidas (zerando a contagem de denúncias ativas).
                    </span>
                  </div>
                )}
              </div>

              <div className="stats-row">
                <div className="stat-box">
                  <Package size={20} />
                  <div className="stat-content">
                    <span className="stat-value">{maker.productsCount}</span>
                    <span className="stat-label">Produtos</span>
                  </div>
                </div>
                <div className="stat-box">
                  <ShoppingCart size={20} />
                  <div className="stat-content">
                    <span className="stat-value">{maker.ordersCount}</span>
                    <span className="stat-label">Vendas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-column">
            <div className="id-over-card">
              <span className="id-label-mini">USER ID</span>
              <div className="maker-id-container">
                <span className="maker-id-badge">{maker.userId}</span>
                <button
                  className={`copy-id-btn ${copiedUserId ? "copied" : ""}`}
                  onClick={handleCopyUserId}
                  title="Copiar ID do Usuário"
                >
                  {copiedUserId ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="info-card">
              <h2 className="card-title">
                <User size={20} /> Perfil do Usuário
              </h2>

              <div className="info-list">
                <div className="info-field stacked">
                  <span className="field-label">Nome Completo</span>
                  <div className="field-value-box">
                    <User size={16} />
                    <span className="field-value">{maker.userName}</span>
                  </div>
                </div>

                <div className="info-field stacked">
                  <span className="field-label">E-mail de Acesso</span>
                  <div className="field-value-box">
                    <Mail size={16} />
                    <span className="field-value">{maker.userEmail}</span>
                  </div>
                </div>

                <div className="info-item-row">
                  <div className="info-field stacked">
                    <span className="field-label">WhatsApp / Telefone</span>
                    <div className="field-value-box">
                      <Phone size={16} />
                      <span className="field-value">
                        {maker.userPhone || "Não informado"}
                      </span>
                    </div>
                  </div>
                  <div className="info-field stacked">
                    <span className="field-label">Localização</span>
                    <div className="field-value-box">
                      <MapPin size={16} />
                      <span className="field-value">
                        {maker.city && maker.state
                          ? `${maker.city}/${maker.state}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-field stacked">
                  <span className="field-label">Data de Cadastro</span>
                  <div className="field-value-box accent">
                    <CalendarDays size={16} />
                    <span className="field-value">
                      {formatDate(maker.creationTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakerDetail;
