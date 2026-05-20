import { useState, useEffect, useCallback } from "react";
import { reportsService } from "../services/reports.service";
import { ReportResponseDTO, ReportFilterDTO } from "../types/dtos/report.dto";
import { MetaDTO } from "../types/dtos/response.dto";

export const useReports = () => {
  const [reports, setReports] = useState<ReportResponseDTO[]>([]);
  const [meta, setMeta] = useState<MetaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState<string>("");
  const [filterResolved, setFilterResolved] = useState<boolean | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const filters: ReportFilterDTO = {
        page,
        limit: 10,
        search: search || undefined,
        reason: reason || undefined,
      };

      const response = await reportsService.getReports(filters);
      setReports(response.data.data);
      setMeta(response.data.meta);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar denúncias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, reason]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const resolveReport = async (id: string) => {
    try {
      await reportsService.resolveReport(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: true } : r))
      );
    } catch (err) {
      console.error("Erro ao resolver denúncia", err);
    }
  };

  const unresolveReport = async (id: string) => {
    try {
      await reportsService.unresolveReport(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: false } : r))
      );
    } catch (err) {
      console.error("Erro ao reabrir denúncia", err);
    }
  };

  const closeChatReport = async (id: string) => {
    try {
      await reportsService.closeChatReport(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: true } : r))
      );
    } catch (err) {
      console.error("Erro ao encerrar chat da denúncia", err);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterResolved === null) return true;
    return r.resolved === filterResolved;
  });

  return {
    reports: filteredReports,
    meta,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    reason,
    setReason,
    filterResolved,
    setFilterResolved,
    resolveReport,
    unresolveReport,
    closeChatReport,
    refresh: fetchReports,
  };
};
