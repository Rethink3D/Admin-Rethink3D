import { useState, useEffect, useCallback } from "react";
import { devolutionService } from "../services/devolution.service";
import { DevolutionResponseDTO } from "../types/dtos/devolution.dto";

export const useDevolutions = () => {
  const [devolutions, setDevolutions] = useState<DevolutionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevolutions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await devolutionService.getDevolutions();
      setDevolutions(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar devoluções");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevolutions();
  }, [fetchDevolutions]);

  return {
    devolutions,
    loading,
    error,
    refresh: fetchDevolutions,
  };
};
