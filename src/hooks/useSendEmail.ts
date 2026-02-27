import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { makersService } from "../services/makers.service";
import { emailService } from "../services/email.service";
import { usePageTitle } from "../contexts/PageTitleContext";
import { useModal } from "../contexts/ModalContext";
import { MakerPreviewDTO } from "../types/dtos/maker.dto";
import { EmailTemplateType } from "../types/enums/email-template.enum";

export const useSendEmail = () => {
  const { setPageTitle } = usePageTitle();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [makers, setMakers] = useState<MakerPreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedMakers, setSelectedMakers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [templateType, setTemplateType] = useState<EmailTemplateType>(
    EmailTemplateType.INFO,
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setPageTitle("Enviar E-mail");
    loadMakers();
  }, [setPageTitle]);

  const loadMakers = async () => {
    try {
      setLoading(true);
      const response = await makersService.getMakers();
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as any).data || [];
      setMakers(data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro",
        message: "Não foi possível carregar a lista de makers.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaker = (id: string) => {
    setSelectedMakers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedMakers(ids);
  };

  const handleSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (selectedMakers.length === 0) {
      showModal({
        type: "error",
        title: "Atenção",
        message: "Selecione pelo menos um destinatário.",
      });
      return;
    }

    if (!subject.trim()) {
      showModal({
        type: "error",
        title: "Campo Obrigatório",
        message: "Por favor, preencha o assunto do e-mail.",
      });
      return;
    }

    if (!message.trim()) {
      showModal({
        type: "error",
        title: "Campo Obrigatório",
        message: "O conteúdo da mensagem não pode estar vazio.",
      });
      return;
    }

    showModal({
      type: "confirm",
      title: "Confirmar Envio",
      message: `Deseja enviar este e-mail para ${selectedMakers.length} destinatário(s)?`,
      confirmText: "Enviar",
      onConfirm: async () => {
        try {
          setSending(true);

          await emailService.sendEmail({
            recipients: selectedMakers,
            subject: subject,
            message: message,
            type: templateType,
          });

          showModal({
            type: "success",
            title: "Sucesso",
            message: "E-mails enviados para a fila de processamento!",
            confirmText: "Voltar para Ações",
            onConfirm: () => {
              setSubject("");
              setMessage("");
              setSelectedMakers([]);
              setTemplateType(EmailTemplateType.INFO);
              navigate("/actions");
            },
          });
        } catch (error) {
          console.error(error);
          showModal({
            type: "error",
            title: "Erro",
            message: "Falha ao enviar. Verifique o console ou tente novamente.",
          });
        } finally {
          setSending(false);
        }
      },
    });
  };

  return {
    makers,
    loading,
    sending,
    selectedMakers,
    subject,
    message,
    templateType,
    searchTerm,
    navigate,
    setSubject,
    setMessage,
    setTemplateType,
    setSearchTerm,
    handleToggleMaker,
    handleSelectAll,
    handleSendEmail,
  };
};
