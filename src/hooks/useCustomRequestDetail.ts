import { useState, useEffect } from "react";
import { customRequestsService } from "../services/custom-requests.service";
import { CustomRequestDetailDTO } from "../types/dtos/custom-request.dto";
import { useModal } from "../contexts/ModalContext";
import { useNavigate } from "react-router-dom";

export const useCustomRequestDetail = (id: string) => {
  const [request, setRequest] = useState<CustomRequestDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();
  const navigate = useNavigate();

  const loadRequest = async () => {
    try {
      setLoading(true);
      const data = await customRequestsService.getCustomRequestById(id);
      setRequest(data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar solicitação",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
      navigate("/custom-requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  return {
    request,
    loading,
    refresh: loadRequest,
  };
};
