import { useState, useEffect, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { usersService, UserResponseDTO } from "../services/users.service";
import { pushService, PushTargetEnum } from "../services/push.service";
import { usePageTitle } from "../contexts/PageTitleContext";
import { useModal } from "../contexts/ModalContext";

export const useSendPush = () => {
  const { setPageTitle } = usePageTitle();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<PushTargetEnum>(PushTargetEnum.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    setPageTitle("Notificações Push");
  }, [setPageTitle]);

  const loadUsers = useCallback(
    async (pageToLoad: number, search: string) => {
      try {
        setLoading(true);
        const response = await usersService.getUsers({
          page: pageToLoad,
          limit: 50,
          search: search || undefined,
          hasDevices: true,
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

  const handleSendPush = async (e: FormEvent) => {
    e.preventDefault();

    if (target === PushTargetEnum.SELECTED && selectedUsers.length === 0) {
      showModal({
        type: "error",
        title: "Atenção",
        message: "Selecione pelo menos um destinatário.",
      });
      return;
    }

    if (!title.trim()) {
      showModal({
        type: "error",
        title: "Campo Obrigatório",
        message: "Por favor, preencha o título da notificação.",
      });
      return;
    }

    if (!message.trim()) {
      showModal({
        type: "error",
        title: "Campo Obrigatório",
        message: "O conteúdo da notificação não pode estar vazio.",
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
      message: `Deseja enviar esta notificação para ${targetLabel}?`,
      confirmText: "Enviar",
      onConfirm: async () => {
        try {
          setSending(true);

          await pushService.sendPushNotification({
            target,
            userIds:
              target === PushTargetEnum.SELECTED ? selectedUsers : undefined,
            title,
            message,
          });

          showModal({
            type: "success",
            title: "Sucesso",
            message: "Notificações enviadas com sucesso!",
            confirmText: "Voltar para Ações",
            onConfirm: () => {
              setTitle("");
              setMessage("");
              setSelectedUsers([]);
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
    title,
    message,
    target,
    searchTerm,
    page,
    totalPages,
    totalUsers,
    navigate,
    setTitle,
    setMessage,
    setTarget,
    setSearchTerm,
    handleToggleUser,
    handleSendPush,
    handlePageChange,
  };
};
