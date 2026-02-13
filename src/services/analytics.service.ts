import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  AnalyticsOverviewDTO,
  EventMetricDTO,
  ProductMetricDTO,
  MakerMetricDTO,
  DownloadStatsDTO,
  PageMetricDTO,
  DateRangeParams,
  AnalyticsQueryParams,
} from "../types/dtos/analytics.dto";

export const analyticsService = {
  async getOverview(params: DateRangeParams): Promise<AnalyticsOverviewDTO> {
    const response = await apiClient.get<AnalyticsOverviewDTO>(
      API_ENDPOINTS.ANALYTICS.OVERVIEW,
      { params },
    );
    return response.data;
  },

  async getTopEvents(params: AnalyticsQueryParams): Promise<EventMetricDTO[]> {
    const response = await apiClient.get<EventMetricDTO[]>(
      API_ENDPOINTS.ANALYTICS.TOP_EVENTS,
      { params },
    );
    return response.data;
  },

  async getTopProducts(
    params: AnalyticsQueryParams,
  ): Promise<ProductMetricDTO[]> {
    const response = await apiClient.get<ProductMetricDTO[]>(
      API_ENDPOINTS.ANALYTICS.TOP_PRODUCTS,
      { params },
    );
    return response.data;
  },

  async getTopMakers(params: AnalyticsQueryParams): Promise<MakerMetricDTO[]> {
    const response = await apiClient.get<MakerMetricDTO[]>(
      API_ENDPOINTS.ANALYTICS.TOP_MAKERS,
      { params },
    );
    return response.data;
  },

  async getDownloadStats(params: DateRangeParams): Promise<DownloadStatsDTO> {
    const response = await apiClient.get<DownloadStatsDTO>(
      API_ENDPOINTS.ANALYTICS.DOWNLOAD_STATS,
      { params },
    );
    return response.data;
  },

  async getTopPages(params: AnalyticsQueryParams): Promise<PageMetricDTO[]> {
    const response = await apiClient.get<PageMetricDTO[]>(
      API_ENDPOINTS.ANALYTICS.TOP_PAGES,
      { params },
    );
    return response.data;
  },
};
