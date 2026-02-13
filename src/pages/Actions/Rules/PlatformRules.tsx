import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  DollarSign,
  Save,
  AlertTriangle,
  Smartphone,
  Mail,
  Plus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useConstants } from "../../../hooks/useConstants";
import { useModal } from "../../../contexts/ModalContext";
import { ConstantNameEnum } from "../../../types/enums/constant-name.enum";
import Loading from "../../../components/shared/Loading";
import "./PlatformRules.css";

const PlatformRules: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const { getConstants, updateConstant, loading } = useConstants();
  const { showModal } = useModal();

  const [intermediaryTax, setIntermediaryTax] = useState<string>("");
  const [paymentTaxPix, setPaymentTaxPix] = useState<string>("");
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setPageTitle("Regras da Plataforma");
    fetchData();
  }, [setPageTitle]);

  const fetchData = async () => {
    setInitialLoading(true);
    const data = await getConstants([
      ConstantNameEnum.INTERMEDIARY_TAX,
      ConstantNameEnum.PAYMENT_TAX_PIX,
      ConstantNameEnum.ADMIN_NOTIFICATION_EMAIL,
    ]);

    if (data) {
      // Numerical values
      const taxValue = Number(data[ConstantNameEnum.INTERMEDIARY_TAX]);
      const taxPercent = (taxValue * 100).toFixed(2);
      setIntermediaryTax(parseFloat(taxPercent).toString());

      setPaymentTaxPix(
        (data[ConstantNameEnum.PAYMENT_TAX_PIX] || 0).toString(),
      );

      // List of emails
      const rawEmails = data[ConstantNameEnum.ADMIN_NOTIFICATION_EMAIL];
      if (rawEmails && rawEmails !== "0") {
        setAdminEmails(
          String(rawEmails)
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0),
        );
      } else {
        setAdminEmails([]);
      }
    }
    setInitialLoading(false);
  };

  const handleSaveNumeric = async (
    name: ConstantNameEnum,
    value: string,
    label: string,
    warning: string,
    isPercentage: boolean,
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      showModal({
        type: "error",
        title: "Valor Inválido",
        message: "Por favor, insira um valor numérico válido e positivo.",
      });
      return;
    }

    const valueToSave = isPercentage ? numValue / 100 : numValue;
    const displaySuffix = isPercentage ? "%" : "";
    const displayPrefix = !isPercentage ? "R$ " : "";

    showModal({
      type: "confirm",
      title: `Alterar ${label}?`,
      message: `${warning}\n\nNovo valor: ${displayPrefix}${value}${displaySuffix}`,
      onConfirm: async () => {
        const success = await updateConstant(name, valueToSave);
        if (success) {
          showModal({
            type: "success",
            title: "Sucesso",
            message: `${label} atualizada com sucesso!`,
          });
          fetchData();
        }
      },
    });
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    if (!newEmail.includes("@")) {
      showModal({
        type: "error",
        title: "E-mail Inválido",
        message: "Por favor, insira um endereço de e-mail válido.",
      });
      return;
    }
    if (adminEmails.includes(newEmail.trim())) {
      showModal({
        type: "error",
        title: "E-mail Duplicado",
        message: "Este e-mail já está na lista.",
      });
      return;
    }

    const updatedEmails = [...adminEmails, newEmail.trim()];
    setAdminEmails(updatedEmails);
    setNewEmail("");
  };

  const handleRemoveEmail = (email: string) => {
    setAdminEmails(adminEmails.filter((e) => e !== email));
  };

  const handleSaveEmails = async () => {
    const valueToSave = adminEmails.length > 0 ? adminEmails.join(",") : "0";

    showModal({
      type: "confirm",
      title: "Salvar Lista de Notificação?",
      message:
        "Os e-mails listados serão notificados sobre novos cadastros de Makers.",
      onConfirm: async () => {
        const success = await updateConstant(
          ConstantNameEnum.ADMIN_NOTIFICATION_EMAIL,
          valueToSave,
        );
        if (success) {
          showModal({
            type: "success",
            title: "Sucesso",
            message: "Lista de e-mails atualizada com sucesso!",
          });
          fetchData();
        }
      },
    });
  };

  if (initialLoading) return <Loading />;

  return (
    <div className="rules-page animate-fadeIn">
      <button className="back-btn" onClick={() => navigate("/actions")}>
        <ArrowLeft size={18} />
        <span>Voltar para Ações</span>
      </button>

      <div className="rules-container">
        {/* Taxa de Intermediação */}
        <div className="rule-card">
          <div className="rule-header">
            <DollarSign className="rule-icon" size={24} />
            <div>
              <h3>Taxa de Serviço (Intermediação)</h3>
              <p>Porcentagem cobrada sobre o valor do serviço do Maker.</p>
            </div>
          </div>

          <div className="rule-content">
            <div className="rule-input-group">
              <input
                type="number"
                value={intermediaryTax}
                onChange={(e) => setIntermediaryTax(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
              <span>%</span>
            </div>
            <button
              className="save-rule-btn"
              disabled={loading}
              onClick={() =>
                handleSaveNumeric(
                  ConstantNameEnum.INTERMEDIARY_TAX,
                  intermediaryTax,
                  "Taxa de Serviço",
                  "Atenção: Esta mudança afetará o cálculo de preços de TODOS os novos orçamentos, produtos e pedidos.",
                  true,
                )
              }
            >
              <Save size={18} />
              Salvar
            </button>
          </div>

          <div className="warning-box">
            <AlertTriangle size={16} />
            <p>
              Alterações aqui impactam diretamente a receita da plataforma e o
              custo final para o cliente.
            </p>
          </div>
        </div>

        {/* Taxa PIX */}
        <div className="rule-card">
          <div className="rule-header">
            <Smartphone className="rule-icon" size={24} />
            <div>
              <h3>Taxa de Processamento (PIX)</h3>
              <p>Tarifa fixa em Reais cobrada na transação via PIX.</p>
            </div>
          </div>

          <div className="rule-content">
            <div className="rule-input-group">
              <span>R$</span>
              <input
                type="number"
                value={paymentTaxPix}
                onChange={(e) => setPaymentTaxPix(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <button
              className="save-rule-btn"
              disabled={loading}
              onClick={() =>
                handleSaveNumeric(
                  ConstantNameEnum.PAYMENT_TAX_PIX,
                  paymentTaxPix,
                  "Taxa PIX",
                  "Atenção: Esta taxa fixa será aplicada no checkout de novos pedidos pagos via PIX.",
                  false,
                )
              }
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </div>

        {/* E-mails de Notificação */}
        <div className="rule-card">
          <div className="rule-header">
            <Mail className="rule-icon" size={24} />
            <div>
              <h3>Controle de Notificações</h3>
              <p>
                E-mails que receberão um aviso toda vez que um novo Maker se
                cadastrar.
              </p>
            </div>
          </div>

          <div className="rule-content-vertical">
            <div className="email-add-group">
              <div className="rule-input-group">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Novo e-mail de administrador..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                />
              </div>
              <button
                type="button"
                className="add-email-btn"
                onClick={handleAddEmail}
                disabled={!newEmail.trim()}
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>

            <div className="emails-list">
              {adminEmails.length > 0 ? (
                adminEmails.map((email) => (
                  <div key={email} className="email-chip">
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      aria-label={`Remover ${email}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="empty-emails">
                  Nenhum e-mail configurado para notificações.
                </p>
              )}
            </div>

            <button
              className="save-rule-btn full-width"
              disabled={loading}
              onClick={handleSaveEmails}
            >
              <Save size={18} />
              Salvar Configuração de E-mails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformRules;
