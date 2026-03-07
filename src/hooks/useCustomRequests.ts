import { useState, useEffect, useCallback } from "react";
import { customRequestsService } from "../services/custom-requests.service";
import {
  CustomRequestResponseDTO,
  CustomRequestFilterDTO,
} from "../types/dtos/custom-request.dto";
import { CustomRequestStatusEnum } from "../types/enums/custom-request-status.enum";
import { useModal } from "../contexts/ModalContext";
import { MetaDTO } from "../types/dtos/response.dto";

export const useCustomRequests = () => {
  const [requests, setRequests] = useState<CustomRequestResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    CustomRequestStatusEnum | ""
  >("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [meta, setMeta] = useState<MetaDTO | null>(null);
  const { showModal } = useModal();

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const filter: CustomRequestFilterDTO = {
        page,
        limit,
        status: filterStatus || undefined,
        search: search || undefined,
      };
      const response = await customRequestsService.getCustomRequests(filter);
      setRequests(response.data);
      setMeta(response.meta);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar solicitações",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search, page, limit, showModal]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return {
    requests,
    loading,
    filterStatus,
    setFilterStatus,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    meta,
    refresh: loadRequests,
  };
};
