import { useState, useEffect, useCallback } from "react";
import { makersService } from "../services/makers.service";
import { MakerPreviewDTO } from "../types/dtos/maker.dto";
import { useModal } from "../contexts/ModalContext";
import { MetaDTO } from "../types/dtos/response.dto";

export const useMakersPreview = () => {
  const [makers, setMakers] = useState<MakerPreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [meta, setMeta] = useState<MetaDTO | null>(null);

  const { showModal } = useModal();

  const loadMakers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await makersService.getMakers({
        page,
        limit,
        search: search || undefined,
      });
      setMakers(response.data.data);
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar makers",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, limit, showModal]);

  useEffect(() => {
    loadMakers();
  }, [loadMakers]);

  return {
    makers,
    loading,
    search,
    setSearch,
    page,
    setPage,
    meta,
    refresh: loadMakers,
  };
};
