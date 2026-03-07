import React, { useState } from "react";
import { Send, LayoutTemplate, Eye, Edit3, Info, Users } from "lucide-react";
import {
  EMAIL_TEMPLATES,
  generatePreviewHTML,
} from "../../constants/email-templates";
import { EmailTemplateType } from "../../types/enums/email-template.enum";
import { PushTargetEnum } from "../../services/push.service";
import "../../pages/Actions/SendEmail/SendEmail.css";

interface EmailEditorProps {
  subject: string;
  message: string;
  target: PushTargetEnum;
  templateType: EmailTemplateType;
  onSubjectChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onTargetChange: (val: PushTargetEnum) => void;
  onTypeChange: (val: EmailTemplateType) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  hasRecipients: boolean;
  selectedUsers: string[];
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  subject,
  message,
  target,
  templateType,
  onSubjectChange,
  onMessageChange,
  onTargetChange,
  onTypeChange,
  onSubmit,
  loading,
  hasRecipients,
  selectedUsers,
}) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tId = e.target.value;
    setSelectedTemplateId(tId);

    const template = EMAIL_TEMPLATES.find((t) => t.id === tId);
    if (template) {
      onSubjectChange(template.subject);
      onMessageChange(template.content);
      onTypeChange(template.type);
    }
  };

  const previewHTML = generatePreviewHTML(subject, message, templateType);

  const isFormValid =
    (target !== PushTargetEnum.SELECTED || hasRecipients) &&
    subject.trim() !== "" &&
    message.trim() !== "";

  return (
    <div className="editor-column">
      <div className="editor-tabs">
        <button
          type="button"
          className={`tab-btn ${viewMode === "edit" ? "active" : ""}`}
          onClick={() => setViewMode("edit")}
        >
          <Edit3 size={16} /> Editor
        </button>
        <button
          type="button"
          className={`tab-btn ${viewMode === "preview" ? "active" : ""}`}
          onClick={() => setViewMode("preview")}
        >
          <Eye size={16} /> Visualizar (Preview)
        </button>
      </div>

      <div className="email-editor-content">
        {viewMode === "edit" ? (
          <>
            <div className="form-group">
              <label htmlFor="target">
                <Users size={16} /> Público-alvo
              </label>
              <select
                id="target"
                value={target}
                onChange={(e) =>
                  onTargetChange(e.target.value as PushTargetEnum)
                }
                className="full-width-input"
              >
                <option value={PushTargetEnum.ALL}>Todos os Usuários</option>
                <option value={PushTargetEnum.MAKERS}>Apenas Makers</option>
                <option value={PushTargetEnum.CLIENTS}>Apenas Clientes</option>
                <option value={PushTargetEnum.SELECTED}>
                  Selecionar Manualmente
                </option>
              </select>
              <p className="field-hint">
                <Info size={12} />
                {target === PushTargetEnum.ALL &&
                  "Todos os usuários cadastrados receberão este e-mail."}
                {target === PushTargetEnum.MAKERS &&
                  "Apenas os usuários registrados como Makers receberão este e-mail."}
                {target === PushTargetEnum.CLIENTS &&
                  "Apenas os usuários que NÃO são Makers receberão este e-mail."}
                {target === PushTargetEnum.SELECTED &&
                  "Apenas os usuários selecionados na lista ao lado receberão este e-mail."}
              </p>
            </div>

            <div className="template-selector">
              <label>
                <LayoutTemplate size={16} />
                Carregar Modelo:
              </label>
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className="template-select"
              >
                <option value="">Nenhum (Texto livre)</option>
                {EMAIL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Assunto</label>
              <input
                id="subject"
                type="text"
                placeholder="Ex: Atualização importante"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                required
                className="full-width-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Tipo de Layout (Detalhe Visual)</label>
              <select
                id="type"
                value={templateType}
                onChange={(e) =>
                  onTypeChange(e.target.value as EmailTemplateType)
                }
                className="full-width-input"
              >
                <option value={EmailTemplateType.INFO}>
                  Padrão (Preto Premium)
                </option>
                <option value={EmailTemplateType.ALERT}>
                  Alerta (Vermelho)
                </option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="message">Mensagem (Texto)</label>
              <textarea
                id="message"
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                required
                className="full-width-textarea"
              />
            </div>
          </>
        ) : (
          <div className="email-preview-container">
            <div className="email-preview-header">
              <div className="preview-row">
                <span className="preview-label">Assunto:</span>
                <span className="preview-value font-bold">
                  {subject || "(Sem assunto)"}
                </span>
              </div>
            </div>

            <div className="email-preview-frame">
              <iframe
                title="Email Preview"
                srcDoc={previewHTML}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#f3f4f6",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-actions sticky-actions">
        {target === PushTargetEnum.SELECTED && (
          <span className="selection-count">
            {selectedUsers.length} destinatários selecionados
          </span>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="send-button"
          disabled={loading || !isFormValid}
        >
          <Send size={18} />
          <span>{loading ? "Enviando..." : "Enviar Email"}</span>
        </button>
      </div>
    </div>
  );
};

export default EmailEditor;
