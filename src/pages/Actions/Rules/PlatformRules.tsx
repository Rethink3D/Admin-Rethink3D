import { useEffect, useState } from "react";
import {
  ArrowLeft,
  DollarSign,
  Save,
  AlertTriangle,
  Smartphone,
  Mail,
  Plus,
  X,
  FileText,
  Pencil,
  Shield,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useConstants } from "../../../hooks/useConstants";
import { useModal } from "../../../contexts/ModalContext";
import { ConstantNameEnum } from "../../../types/enums/constant-name.enum";
import Loading from "../../../components/shared/Loading";
import "./PlatformRules.css";

interface TermsDraft {
  termsVersion: string;
  termsUrl: string;
  privacyVersion: string;
  privacyUrl: string;
  makerTermsVersion: string;
  makerTermsUrl: string;
}

const EMPTY_DRAFT: TermsDraft = {
  termsVersion: "",
  termsUrl: "",
  privacyVersion: "",
  privacyUrl: "",
  makerTermsVersion: "",
  makerTermsUrl: "",
};

const PlatformRules: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const { getConstants, updateConstant, loading } = useConstants();
  const { showModal } = useModal();

  const [intermediaryTax, setIntermediaryTax] = useState<string>("");
  const [paymentTaxPix, setPaymentTaxPix] = useState<string>("");
  const [savedTerms, setSavedTerms] = useState<TermsDraft>(EMPTY_DRAFT);
  const [draftTerms, setDraftTerms] = useState<TermsDraft>(EMPTY_DRAFT);
  const [termsEditMode, setTermsEditMode] = useState(false);
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
      ConstantNameEnum.TERMS_VERSION,
      ConstantNameEnum.TERMS_URL,
      ConstantNameEnum.PRIVACY_VERSION,
      ConstantNameEnum.PRIVACY_URL,
      ConstantNameEnum.MAKER_TERMS_VERSION,
      ConstantNameEnum.MAKER_TERMS_URL,
    ]);

    if (data) {
      const taxValue = Number(data[ConstantNameEnum.INTERMEDIARY_TAX]);
      setIntermediaryTax(parseFloat((taxValue * 100).toFixed(2)).toString());
      setPaymentTaxPix(
        (data[ConstantNameEnum.PAYMENT_TAX_PIX] || 0).toString(),
      );

      const fetched: TermsDraft = {
        termsVersion: String(data[ConstantNameEnum.TERMS_VERSION] || ""),
        termsUrl: String(data[ConstantNameEnum.TERMS_URL] || ""),
        privacyVersion: String(data[ConstantNameEnum.PRIVACY_VERSION] || ""),
        privacyUrl: String(data[ConstantNameEnum.PRIVACY_URL] || ""),
        makerTermsVersion: String(
          data[ConstantNameEnum.MAKER_TERMS_VERSION] || "",
        ),
        makerTermsUrl: String(data[ConstantNameEnum.MAKER_TERMS_URL] || ""),
      };
      setSavedTerms(fetched);
      setDraftTerms(fetched);

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

  const handleEnterTermsEdit = () => {
    setDraftTerms(savedTerms);
    setTermsEditMode(true);
  };

  const handleCancelTermsEdit = () => {
    setDraftTerms(savedTerms);
    setTermsEditMode(false);
  };

  const handleSaveTerms = () => {
    const emptyField = Object.entries(draftTerms).find(
      ([, val]) => !String(val).trim(),
    );
    if (emptyField) {
      showModal({
        type: "error",
        title: "Campo obrigatório",
        message: "Nenhum campo de termos pode ficar vazio antes de salvar.",
      });
      return;
    }

    const changed = (Object.keys(draftTerms) as (keyof TermsDraft)[]).filter(
      (key) => draftTerms[key] !== savedTerms[key],
    );

    if (changed.length === 0) {
      setTermsEditMode(false);
      return;
    }

    const changedLabels: Record<keyof TermsDraft, string> = {
      termsVersion: "Versão dos Termos de Uso",
      termsUrl: "URL dos Termos de Uso",
      privacyVersion: "Versão da Política de Privacidade",
      privacyUrl: "URL da Política de Privacidade",
      makerTermsVersion: "Versão dos Termos do Maker",
      makerTermsUrl: "URL dos Termos do Maker",
    };

    const changedLabelsText = changed
      .map((k) => `• ${changedLabels[k]}: ${draftTerms[k]}`)
      .join("\n");

    showModal({
      type: "confirm",
      title: "Salvar alterações nos Termos?",
      message: `Os seguintes campos serão atualizados:\n\n${changedLabelsText}`,
      onConfirm: async () => {
        const nameMap: Record<keyof TermsDraft, ConstantNameEnum> = {
          termsVersion: ConstantNameEnum.TERMS_VERSION,
          termsUrl: ConstantNameEnum.TERMS_URL,
          privacyVersion: ConstantNameEnum.PRIVACY_VERSION,
          privacyUrl: ConstantNameEnum.PRIVACY_URL,
          makerTermsVersion: ConstantNameEnum.MAKER_TERMS_VERSION,
          makerTermsUrl: ConstantNameEnum.MAKER_TERMS_URL,
        };

        const results = await Promise.all(
          changed.map((key) => updateConstant(nameMap[key], draftTerms[key])),
        );

        if (results.every(Boolean)) {
          showModal({
            type: "success",
            title: "Sucesso",
            message: "Termos e links legais atualizados com sucesso!",
          });
          setTermsEditMode(false);
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
    setAdminEmails([...adminEmails, newEmail.trim()]);
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

        <div
          className={`rule-card${termsEditMode ? " rule-card--editing" : ""}`}
        >
          <div className="rule-header">
            <FileText className="rule-icon" size={24} />
            <div className="rule-header-text">
              <h3>Termos e Links Legais</h3>
              <p>
                Versões e URLs dos documentos legais exibidos no app. Novos
                cadastros sempre receberão a versão vigente.
              </p>
            </div>
            {termsEditMode ? (
              <div className="terms-edit-actions">
                <button
                  className="terms-cancel-btn"
                  onClick={handleCancelTermsEdit}
                  disabled={loading}
                >
                  <XCircle size={16} />
                  Cancelar
                </button>
                <button
                  className="save-rule-btn"
                  onClick={handleSaveTerms}
                  disabled={loading}
                >
                  <Save size={16} />
                  Salvar tudo
                </button>
              </div>
            ) : (
              <button className="terms-edit-btn" onClick={handleEnterTermsEdit}>
                <Pencil size={15} />
                Editar
              </button>
            )}
          </div>

          <div className="rule-content-vertical">
            <p className="terms-section-label">
              <FileText size={13} /> Termos de Uso do Usuário
            </p>

            <div className="terms-field-row">
              <div className="terms-field">
                <label>Versão</label>
                <div
                  className={`rule-input-group${termsEditMode ? "" : " rule-input-group--readonly"}`}
                >
                  <input
                    type="text"
                    value={draftTerms.termsVersion}
                    onChange={(e) =>
                      setDraftTerms({
                        ...draftTerms,
                        termsVersion: e.target.value,
                      })
                    }
                    readOnly={!termsEditMode}
                    placeholder="ex: v1.0 - 2026-02-13"
                  />
                </div>
              </div>
              <div className="terms-field terms-field--url">
                <label>URL</label>
                <div
                  className={`rule-input-group${termsEditMode ? "" : " rule-input-group--readonly"}`}
                >
                  <input
                    type="text"
                    value={draftTerms.termsUrl}
                    onChange={(e) =>
                      setDraftTerms({ ...draftTerms, termsUrl: e.target.value })
                    }
                    readOnly={!termsEditMode}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="terms-divider" />

            <p className="terms-section-label">
              <Shield size={13} /> Política de Privacidade
            </p>

            <div className="terms-field-row">
              <div className="terms-field">
                <label>Versão</label>
                <div
                  className={`rule-input-group${termsEditMode ? "" : " rule-input-group--readonly"}`}
                >
                  <input
                    type="text"
                    value={draftTerms.privacyVersion}
                    onChange={(e) =>
                      setDraftTerms({
                        ...draftTerms,
                        privacyVersion: e.target.value,
                      })
                    }
                    readOnly={!termsEditMode}
                    placeholder="ex: v1.0 - 2026-02-13"
                  />
                </div>
              </div>
              <div className="terms-field terms-field--url">
                <label>URL</label>
                <div
                  className={`rule-input-group${termsEditMode ? "" : " rule-input-group--readonly"}`}
                >
                  <input
                    type="text"
                    value={draftTerms.privacyUrl}
                    onChange={(e) =>
                      setDraftTerms({
                        ...draftTerms,
                        privacyUrl: e.target.value,
                      })
                    }
                    readOnly={!termsEditMode}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="terms-divider" />

            <p className="terms-section-label">
              <FileText size={13} /> Termos de Contrato do Maker
            </p>

            <div className="terms-field-row">
              <div className="terms-field">
                <label>Versão</label>
                <div
                  className={`rule-input-group${termsEditMode ? "" : " rule-input-group--readonly"}`}
                >
                  <input
                    type="text"
                    value={draftTerms.makerTermsVersion}
                    onChange={(e) =>
                      setDraftTerms({
                        ...draftTerms,
                        makerTermsVersion: e.target.value,
                      })
                    }
                    readOnly={!termsEditMode}
                    placeholder="ex: v1.0-maker-2026-02-13"
                  />
                </div>
              </div>
              <div className="terms-field terms-field--url">
                <label>URL</label>
                <div
                  className={`rule-input-group${termsEditMode ? "" : " rule-input-group--readonly"}`}
                >
                  <input
                    type="text"
                    value={draftTerms.makerTermsUrl}
                    onChange={(e) =>
                      setDraftTerms({
                        ...draftTerms,
                        makerTermsUrl: e.target.value,
                      })
                    }
                    readOnly={!termsEditMode}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {termsEditMode && (
              <div className="warning-box">
                <AlertTriangle size={16} />
                <p>
                  Ao alterar a versão, novos cadastros registrarão a versão
                  atualizada. Usuários existentes não são afetados
                  automaticamente.
                </p>
              </div>
            )}
          </div>
        </div>

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
