import { useState, useEffect } from "react";
import { makersService } from "../services/makers.service";
import { MakerDetailDTO, AdminUpdateMakerDTO } from "../types/dtos/maker.dto";
import { useModal } from "../contexts/ModalContext";
import { useNavigate } from "react-router-dom";

export const useMakerDetail = (id: string) => {
  const [maker, setMaker] = useState<MakerDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showModal } = useModal();
  const navigate = useNavigate();

  const loadMaker = async () => {
    try {
      setLoading(true);
      const response = await makersService.getMakerById(id);
      setMaker(response.data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar maker",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
      navigate("/makers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMaker();
    }
  }, [id]);

  const updateMaker = async (data: AdminUpdateMakerDTO) => {
    showModal({
      type: "confirm",
      title: "Confirmar alterações",
      message: "Deseja realmente salvar as alterações deste maker?",
      confirmText: "Salvar",
      onConfirm: async () => {
        try {
          setSaving(true);
          await makersService.updateMaker(id, data);

          showModal({
            type: "success",
            title: "Maker atualizado",
            message: "As informações foram atualizadas com sucesso!",
          });

          setTimeout(() => {
            navigate("/makers");
          }, 2000);
        } catch (error) {
          showModal({
            type: "error",
            title: "Erro ao atualizar",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  return {
    maker,
    loading,
    saving,
    updateMaker,
    refresh: loadMaker,
  };
};
