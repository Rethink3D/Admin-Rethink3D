import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDevolutions } from "./useDevolutions";
import { devolutionService } from "../services/devolution.service";
import { OrderStatusEnum } from "../types/enums/order-status.enum";
import { DevolutionResponseDTO } from "../types/dtos/devolution.dto";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";

export const useDevolutionAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { devolutions, loading, refresh } = useDevolutions();
  const { showModal } = useModal();

  const devolution = useMemo(() => {
    const dev = devolutions.find((d: DevolutionResponseDTO) => d.id === id);
    if (!dev || !token) return dev;

    return {
      ...dev,
      images: dev.images.map((url) => {
        if (url.includes("access_token=")) return url;
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}access_token=${token}`;
      }),
      user: dev.user
        ? {
            ...dev.user,
            avatar:
              dev.user.avatar && !dev.user.avatar.includes("access_token=")
                ? `${dev.user.avatar}${dev.user.avatar.includes("?") ? "&" : "?"}access_token=${token}`
                : dev.user.avatar,
          }
        : dev.user,
      maker: dev.maker
        ? {
            ...dev.maker,
            avatar:
              dev.maker.avatar && !dev.maker.avatar.includes("access_token=")
                ? `${dev.maker.avatar}${dev.maker.avatar.includes("?") ? "&" : "?"}access_token=${token}`
                : dev.maker.avatar,
          }
        : dev.maker,
    };
  }, [devolutions, id, token]);

  const [approvedItems, setApprovedItems] = useState<Record<string, number>>(
    {},
  );
  const [adminObservation, setAdminObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (devolution) {
      const initialApproved: Record<string, number> = {};
      devolution.items?.forEach((item) => {
        initialApproved[item.id] = item.quantity;
      });
      setApprovedItems(initialApproved);
      setAdminObservation(devolution.adminObservation || "");
    }
  }, [devolution]);

  const handleQuantityChange = (itemId: string, val: number, max: number) => {
    const qty = Math.max(0, Math.min(max, val));
    setApprovedItems((prev) => ({ ...prev, [itemId]: qty }));
  };

  const handleAction = async (
    decision: "REFUNDED" | "PARTIAL_REFUND" | "DONE",
  ) => {
    if (!devolution) return;

    const label =
      decision === "REFUNDED"
        ? "Reembolso Total"
        : decision === "PARTIAL_REFUND"
          ? "Reembolso Parcial"
          : "Concluir sem Reembolso";

    showModal({
      type: "confirm",
      title: "Confirmar Ação",
      message: `Tem certeza que deseja aprovar: "${label}" para esta devolução? Esta ação não pode ser desfeita.`,
      confirmText: "Sim, confirmar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          const backendStatus =
            decision === "DONE"
              ? OrderStatusEnum.DONE
              : OrderStatusEnum.REFUND_IN_PROCESS;

          const itemsPayload = Object.entries(approvedItems).map(
            ([itemToDevolutionId, quantity]) => ({
              itemToDevolutionId,
              quantity,
            }),
          );

          await devolutionService.updateDevolutionStatus({
            devolutionId: devolution.id,
            status: backendStatus as unknown as OrderStatusEnum,
            items: itemsPayload,
            adminObservation,
          });

          showModal({
            type: "success",
            title: "Ação Realizada!",
            message: `A devolução foi marcada como "${label}" com sucesso.`,
            onConfirm: () => {
              refresh();
              navigate("/actions/devolutions");
            },
          });
        } catch (err) {
          console.error(err);
          showModal({
            type: "error",
            title: "Erro",
            message: "Não foi possível realizar a ação. Tente novamente.",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const totalOriginal = useMemo(
    () =>
      (devolution?.items || []).reduce(
        (acc: number, item) => acc + Number(item.priceWithFee) * item.quantity,
        0,
      ),
    [devolution],
  );

  const totalApproved = useMemo(
    () =>
      (devolution?.items || []).reduce(
        (acc: number, item) =>
          acc + Number(item.priceWithFee) * (approvedItems[item.id] || 0),
        0,
      ),
    [devolution, approvedItems],
  );

  const returnedToMaker = totalOriginal - totalApproved;

  const isAnalysisOpen =
    devolution?.orderStatus === OrderStatusEnum.REFUND_IN_ANALYSIS;

  return {
    devolution,
    loading,
    isSubmitting,
    approvedItems,
    adminObservation,
    setAdminObservation,
    totalOriginal,
    totalApproved,
    returnedToMaker,
    isAnalysisOpen,
    handleQuantityChange,
    handleAction,
    navigate,
    refresh,
  };
};
