import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminUpdateMakerDTO } from "../../types/dtos/maker.dto";
import { MakerStatusEnum } from "../../types/enums/maker-status.enum";
import { ServiceTypeEnum } from "../../types/enums/service-type.enum";
import {
  ArrowLeft,
  Save,
  Package,
  ShoppingCart,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Info,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useMakerDetail } from "../../hooks/useMakerDetail";
import { useModal } from "../../contexts/ModalContext";
import "./MakerEdit.css";

const MakerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();
  const { maker, loading, saving, updateMaker } = useMakerDetail(id!);
  const { showModal } = useModal();

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
      setPageTitle(`Maker - ${maker.name}`);
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

  const handleBack = () => {
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
  };

  const handleSave = () => {
    updateMaker(formData);
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
    <div className="maker-edit-page">
      <div className="maker-edit-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <div className="header-actions">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={20} />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </div>

      <div className="maker-edit-content">
        <div className="info-card">
          <h2 className="card-title">Informações do Usuário</h2>
          <div className="info-grid">
            <div className="maker-image-container">
              {maker.imageUrl && (
                <img
                  src={maker.imageUrl}
                  alt={maker.userName}
                  className="maker-image"
                />
              )}
              <div
                className="info-item"
                style={{
                  marginTop: "1rem",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <MapPin size={16} className="info-icon" />
                <span className="info-value">
                  {maker.city && maker.state
                    ? `${maker.city} - ${maker.state}`
                    : "Sem localização"}
                </span>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <User size={18} className="info-icon" />
                <div>
                  <span className="info-label">Nome Completo</span>
                  <span className="info-value">{maker.userName}</span>
                </div>
              </div>
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{maker.userEmail}</span>
                </div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <Phone size={18} className="info-icon" />
                <div>
                  <span className="info-label">Telefone</span>
                  <span className="info-value">
                    {maker.userPhone || "Não informado"}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <CalendarDays size={18} className="info-icon" />
                <div>
                  <span className="info-label">Data de Entrada</span>
                  <span className="info-value">
                    {formatDate(maker.creationTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <Package size={18} className="info-icon" />
                <div>
                  <span className="info-label">Produtos Cadastrados</span>
                  <span className="info-value">{maker.productsCount}</span>
                </div>
              </div>
              <div className="info-item">
                <ShoppingCart size={18} className="info-icon" />
                <div>
                  <span className="info-label">Vendas Realizadas</span>
                  <span className="info-value">{maker.ordersCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2 className="card-title">Dados da Loja</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nome de Apresentação</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome da loja"
              />
            </div>

            <div className="form-group">
              <label htmlFor="service">Especialidade</label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    service: e.target.value as ServiceTypeEnum,
                  })
                }
              >
                <option value={ServiceTypeEnum.PRINTING}>
                  Apenas Impressão
                </option>
                <option value={ServiceTypeEnum.PRINTING_MODELING}>
                  Modelagem + Impressão
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status da Conta</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as MakerStatusEnum,
                  })
                }
              >
                <option value={MakerStatusEnum.ACTIVE}>Ativo</option>
                <option value={MakerStatusEnum.PENDING}>Pendente</option>
                <option value={MakerStatusEnum.PAUSED}>Pausado</option>
                <option value={MakerStatusEnum.BLOCKED}>Bloqueado</option>
              </select>

              {willSendWelcomeEmail && (
                <div className="status-email-alert">
                  <Info size={18} style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Atenção:</strong> Salvar esta alteração enviará
                    automaticamente o e-mail de boas-vindas para o Maker.
                  </span>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Sobre a Loja</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição visível para os clientes"
                rows={5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakerEdit;
