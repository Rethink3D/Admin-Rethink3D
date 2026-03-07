import { useState, useEffect, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { usersService, UserResponseDTO } from "../services/users.service";
import { emailService } from "../services/email.service";
import { usePageTitle } from "../contexts/PageTitleContext";
import { useModal } from "../contexts/ModalContext";
import { EmailTemplateType } from "../types/enums/email-template.enum";
import { PushTargetEnum } from "../services/push.service";

export const useSendEmail = () => {
  const { setPageTitle } = usePageTitle();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<PushTargetEnum>(PushTargetEnum.MAKERS);
  const [templateType, setTemplateType] = useState<EmailTemplateType>(
    EmailTemplateType.INFO,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    setPageTitle("Enviar E-mail");
  }, [setPageTitle]);

  const loadUsers = useCallback(
    async (pageToLoad: number, search: string) => {
      try {
        setLoading(true);
        const response = await usersService.getUsers({
          page: pageToLoad,
          limit: 50,
          search: search || undefined,
        });

        const data = response.data.data || [];
        const meta = response.data.meta;

        setUsers(data);
        setTotalPages(meta.totalPages || 1);
        setTotalUsers(meta.total || 0);
        setPage(meta.page || 1);
      } catch (error) {
        showModal({
          type: "error",
          title: "Erro",
          message: "Não foi possível carregar a lista de usuários.",
        });
      } finally {
        setLoading(false);
      }
    },
    [showModal],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, loadUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadUsers(newPage, searchTerm);
    }
  };

  const handleToggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedUsers(ids);
  };

  const handleSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (target === PushTargetEnum.SELECTED && selectedUsers.length === 0) {
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

    let targetLabel = "todos os usuários";
    if (target === PushTargetEnum.MAKERS) targetLabel = "todos os Makers";
    if (target === PushTargetEnum.CLIENTS) targetLabel = "todos os Clientes";
    if (target === PushTargetEnum.SELECTED)
      targetLabel = `${selectedUsers.length} usuário(s) selecionado(s)`;

    showModal({
      type: "confirm",
      title: "Confirmar Envio",
      message: `Deseja enviar este e-mail para ${targetLabel}?`,
      confirmText: "Enviar",
      onConfirm: async () => {
        try {
          setSending(true);

          await emailService.sendEmail({
            target,
            recipients:
              target === PushTargetEnum.SELECTED ? selectedUsers : undefined,
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
              setSelectedUsers([]);
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
    users,
    loading,
    sending,
    selectedUsers,
    subject,
    message,
    target,
    templateType,
    searchTerm,
    page,
    totalPages,
    totalUsers,
    navigate,
    setSubject,
    setMessage,
    setTarget,
    setTemplateType,
    setSearchTerm,
    handleToggleUser,
    handleSelectAll,
    handleSendEmail,
    handlePageChange,
  };
};
