import { useState, useCallback } from "react";
import { constantsService } from "../services/constants.service";
import { useModal } from "../contexts/ModalContext";
import { ConstantNameEnum } from "../types/enums/constant-name.enum";

export const useConstants = () => {
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const getConstants = useCallback(
    async (names: ConstantNameEnum[]) => {
      setLoading(true);
      try {
        const response = await constantsService.getConstantsBatch(names);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar constantes:", error);
        showModal({
          type: "error",
          title: "Erro",
          message: "Falha ao carregar as regras da plataforma.",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showModal],
  );

  const updateConstant = async (
    name: ConstantNameEnum,
    value: string | number,
  ) => {
    setLoading(true);
    try {
      await constantsService.updateConstant(name, value);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar constante ${name}:`, error);
      showModal({
        type: "error",
        title: "Erro",
        message: "Falha ao atualizar a regra. Tente novamente.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getConstants,
    updateConstant,
  };
};
