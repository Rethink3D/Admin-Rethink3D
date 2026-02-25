import React, { useState } from "react";
import { Send, Eye, Edit3, Smartphone, Info } from "lucide-react";
import { PushTargetEnum } from "../../services/push.service";
import "../../pages/Actions/SendEmail/SendEmail.css";

interface PushEditorProps {
  title: string;
  message: string;
  target: PushTargetEnum;
  onTitleChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onTargetChange: (val: PushTargetEnum) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  hasRecipients: boolean;
  selectedUsers: string[];
}

const PushEditor: React.FC<PushEditorProps> = ({
  title,
  message,
  target,
  onTitleChange,
  onMessageChange,
  onTargetChange,
  onSubmit,
  loading,
  hasRecipients,
  selectedUsers,
}) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  const isFormValid =
    (target !== PushTargetEnum.SELECTED || hasRecipients) &&
    title.trim() !== "" &&
    message.trim() !== "";

  return (
    <div className="editor-column push-editor-container">
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
          <Eye size={16} /> Preview Mobile
        </button>
      </div>

      <div className="push-editor-content">
        {viewMode === "edit" ? (
          <div className="push-form-fields">
            <div className="section-title">
              <Smartphone size={20} />
              <span>Configurações do Push</span>
            </div>

            <div className="form-group">
              <label htmlFor="target">Público-alvo</label>
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
                <option value={PushTargetEnum.CLIENTS}>
                  Apenas Clientes (Não Makers)
                </option>
                <option value={PushTargetEnum.SELECTED}>
                  Selecionar Manualmente
                </option>
              </select>
              <p className="field-hint">
                <Info size={12} />
                {target === PushTargetEnum.ALL &&
                  "Todos os usuários que possuem o app instalado e notificações ativadas receberão."}
                {target === PushTargetEnum.MAKERS &&
                  "Apenas usuários registrados como Makers que possuem o app instalado e notificações ativadas receberão."}
                {target === PushTargetEnum.CLIENTS &&
                  "Apenas usuários que NÃO são Makers que possuem o app instalado e notificações ativadas receberão."}
                {target === PushTargetEnum.SELECTED &&
                  "Apenas os usuários selecionados na lista ao lado que possuem o app instalado e notificações ativadas receberão."}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="title">Título da Notificação</label>
              <input
                id="title"
                type="text"
                placeholder="Ex: Novo recurso disponível!"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                required
                className="full-width-input"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="message">Texto da Notificação</label>
              <textarea
                id="message"
                placeholder="Digite o conteúdo da mensagem..."
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                required
                className="full-width-textarea"
                rows={8}
              />
            </div>
          </div>
        ) : (
          <div className="push-preview-container">
            <div className="smartphone-mockup">
              <div className="smartphone-screen">
                <div className="wallpaper-gradient"></div>
                <div className="notification-banner">
                  <div className="notification-header">
                    <img
                      src="/Logo.webp"
                      alt="Logo"
                      className="app-logo-preview"
                    />
                    <span className="app-name">Rethink3D</span>
                    <span className="notification-time">agora</span>
                  </div>
                  <div className="notification-content">
                    <h4 className="notification-title">
                      {title || "Título da Notificação"}
                    </h4>
                    <p className="notification-body">
                      {message || "O conteúdo da sua mensagem aparecerá aqui."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions sticky-actions">
        {target === PushTargetEnum.SELECTED && (
          <span className="selection-count">
            {selectedUsers.length} usuários selecionados
          </span>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="send-button-push"
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <>
              <div className="spinner-small"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Enviar Notificação</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PushEditor;
