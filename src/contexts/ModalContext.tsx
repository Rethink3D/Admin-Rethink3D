import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

type ModalType = "success" | "error" | "warning" | "info" | "confirm";

interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextData {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  isVisible: boolean;
  modalConfig: ModalConfig | null;
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showModal = useCallback((config: ModalConfig) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setModalConfig(config);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setModalConfig(null);
      timeoutRef.current = null;
    }, 300);
  }, []);

  return (
    <ModalContext.Provider
      value={{ showModal, hideModal, isVisible, modalConfig }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
