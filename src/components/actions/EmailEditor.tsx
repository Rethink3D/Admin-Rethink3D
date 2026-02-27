import React, { useState } from "react";
import { Send, LayoutTemplate, Eye, Edit3 } from "lucide-react";
import {
  EMAIL_TEMPLATES,
  generatePreviewHTML,
} from "../../constants/email-templates";
import { EmailTemplateType } from "../../types/enums/email-template.enum";
import "../../pages/Actions/SendEmail/SendEmail.css";

interface EmailEditorProps {
  subject: string;
  message: string;
  templateType: EmailTemplateType;
  onSubjectChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onTypeChange: (val: EmailTemplateType) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  hasRecipients: boolean;
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  subject,
  message,
  templateType,
  onSubjectChange,
  onMessageChange,
  onTypeChange,
  onSubmit,
  loading,
  hasRecipients,
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
    hasRecipients && subject.trim() !== "" && message.trim() !== "";

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

      {viewMode === "edit" ? (
        <>
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
              <option value={EmailTemplateType.ALERT}>Alerta (Vermelho)</option>
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

      <div className="form-actions">
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
