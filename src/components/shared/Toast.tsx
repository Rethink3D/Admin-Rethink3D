import React from "react";
import { useToast } from "../../contexts/ToastContext";
import "./Toast.css";

const Toast: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-title">{toast.title}</div>
          {toast.message && (
            <div className="toast-message">{toast.message}</div>
          )}
          {toast.duration !== Infinity && (
            <div
              className="toast-progress"
              style={{ animationDuration: `${toast.duration}ms` }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Toast;
