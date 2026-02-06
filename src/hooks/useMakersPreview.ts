import { useState, useEffect, useMemo } from "react";
import { makersService } from "../services/makers.service";
import { MakerPreviewDTO } from "../types/dtos/maker.dto";
import { useModal } from "../contexts/ModalContext";

export const useMakersPreview = () => {
  const [makers, setMakers] = useState<MakerPreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showModal } = useModal();

  const loadMakers = async () => {
    try {
      setLoading(true);
      const response = await makersService.getMakers();
      setMakers(response.data.data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar makers",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMakers();
  }, []);

  const filteredMakers = useMemo(() => {
    if (!searchQuery.trim()) return makers;
    const query = searchQuery.toLowerCase();
    return makers.filter((maker) => maker.name.toLowerCase().includes(query));
  }, [makers, searchQuery]);

  return {
    makers: filteredMakers,
    loading,
    searchQuery,
    setSearchQuery,
    refresh: loadMakers,
  };
};
