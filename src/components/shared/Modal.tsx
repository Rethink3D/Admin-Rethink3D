import React from "react";
import { useModal } from "../../contexts/ModalContext";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import "./Modal.css";

const Modal: React.FC = () => {
  const { isVisible, modalConfig, hideModal } = useModal();

  if (!isVisible || !modalConfig) return null;

  const { type, title, message, onConfirm, onCancel, confirmText, cancelText } =
    modalConfig;

  const handleConfirm = () => {
    onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="modal-icon success" size={48} />;
      case "error":
        return <AlertCircle className="modal-icon error" size={48} />;
      case "warning":
        return <AlertTriangle className="modal-icon warning" size={48} />;
      case "info":
        return <Info className="modal-icon info" size={48} />;
      case "confirm":
        return <AlertCircle className="modal-icon confirm" size={48} />;
      default:
        return null;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content animate-scaleIn">
        <button className="modal-close" onClick={handleCancel}>
          <X size={20} />
        </button>

        <div className="modal-icon-wrapper">{getIcon()}</div>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          {type === "confirm" ? (
            <>
              <button
                className="modal-button modal-button-secondary"
                onClick={handleCancel}
              >
                {cancelText || "Cancelar"}
              </button>
              <button
                className="modal-button modal-button-primary"
                onClick={handleConfirm}
              >
                {confirmText || "Confirmar"}
              </button>
            </>
          ) : (
            <button
              className="modal-button modal-button-primary"
              onClick={handleConfirm}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
