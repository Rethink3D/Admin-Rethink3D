export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export interface AnalyticsQueryParams extends DateRangeParams {
  limit?: number;
}

export interface AnalyticsOverviewDTO {
  activeUsers: number;
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export interface EventMetricDTO {
  eventName: string;
  eventCount: number;
  uniqueUsers: number;
}

export interface ProductMetricDTO {
  productId: string;
  productName: string;
  imageUrl?: string;
  price?: number;
  makerName?: string;
  category?: string;
  viewCount: number;
  clickCount: number;
  clickThroughRate: number;
}

export interface MakerMetricDTO {
  makerId: string;
  makerName: string;
  imageUrl?: string;
  city?: string;
  state?: string;
  profileViewCount: number;
  clickCount: number;
}

export interface DownloadStatsDTO {
  totalDownloadClicks: number;
  iosClicks: number;
  androidClicks: number;
  ctaClicks: number;
  conversionRate: number;
}

export interface PageMetricDTO {
  pagePath: string;
  pageTitle: string;
  viewCount: number;
  uniqueUsers: number;
  averageTimeOnPage: number;
}
