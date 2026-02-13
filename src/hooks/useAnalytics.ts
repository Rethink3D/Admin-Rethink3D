import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analytics.service";
import {
  AnalyticsOverviewDTO,
  EventMetricDTO,
  ProductMetricDTO,
  MakerMetricDTO,
  DownloadStatsDTO,
  PageMetricDTO,
} from "../types/dtos/analytics.dto";

interface UseAnalyticsReturn {
  loading: boolean;
  dateRange: { startDate: string; endDate: string };
  overview: AnalyticsOverviewDTO | null;
  topEvents: EventMetricDTO[];
  topProducts: ProductMetricDTO[];
  topMakers: MakerMetricDTO[];
  downloadStats: DownloadStatsDTO | null;
  topPages: PageMetricDTO[];

  setDateRange: (startDate: string, endDate: string) => void;
  reload: () => void;

  formatDuration: (seconds: number) => string;
  formatPercent: (value: number) => string;
}

export const useAnalytics = (initialDays: number = 30): UseAnalyticsReturn => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRangeState] = useState({
    startDate: "",
    endDate: "",
  });
  const [overview, setOverview] = useState<AnalyticsOverviewDTO | null>(null);
  const [topEvents, setTopEvents] = useState<EventMetricDTO[]>([]);
  const [topProducts, setTopProducts] = useState<ProductMetricDTO[]>([]);
  const [topMakers, setTopMakers] = useState<MakerMetricDTO[]>([]);
  const [downloadStats, setDownloadStats] = useState<DownloadStatsDTO | null>(
    null,
  );
  const [topPages, setTopPages] = useState<PageMetricDTO[]>([]);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - initialDays);

    setDateRangeState({
      endDate: end.toISOString().split("T")[0],
      startDate: start.toISOString().split("T")[0],
    });
  }, [initialDays]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      loadData();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        overviewData,
        eventsData,
        productsData,
        makersData,
        downloadsData,
        pagesData,
      ] = await Promise.all([
        analyticsService.getOverview(dateRange),
        analyticsService.getTopEvents({ ...dateRange, limit: 10 }),
        analyticsService.getTopProducts({ ...dateRange, limit: 10 }),
        analyticsService.getTopMakers({ ...dateRange, limit: 5 }),
        analyticsService.getDownloadStats(dateRange),
        analyticsService.getTopPages({ ...dateRange, limit: 10 }),
      ]);

      setOverview(overviewData);
      setTopEvents(eventsData);
      setTopProducts(productsData);
      setTopMakers(makersData);
      setDownloadStats(downloadsData);
      setTopPages(pagesData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setDateRangeState({ startDate, endDate });
  }, []);

  const reload = useCallback(() => {
    if (dateRange.startDate && dateRange.endDate) {
      loadData();
    }
  }, [dateRange]);

  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const formatPercent = useCallback((value: number): string => {
    return `${value.toFixed(2)}%`;
  }, []);

  return {
    loading,
    dateRange,
    overview,
    topEvents,
    topProducts,
    topMakers,
    downloadStats,
    topPages,
    setDateRange,
    reload,
    formatDuration,
    formatPercent,
  };
};
