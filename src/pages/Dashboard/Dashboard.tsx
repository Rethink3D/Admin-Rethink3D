import React, { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboard.service";
import { DashboardStatsDTO } from "../../types/dtos/dashboard.dto";
import {
  Users,
  Package,
  ShoppingCart,
  UserCheck,
  Activity,
  Eye,
  Zap,
  TrendingDown,
  Download,
  FileText,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import DateRangePicker from "../../components/shared/DateRangePicker";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable";
import { useModal } from "../../contexts/ModalContext";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useAnalytics } from "../../hooks/useAnalytics";

import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const { showModal } = useModal();
  const { setPageTitle } = usePageTitle();

  const analytics = useAnalytics(30);

  useEffect(() => {
    setPageTitle("Dashboard");
  }, [setPageTitle]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      showModal({
        type: "error",
        title: "Erro ao carregar estatísticas",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const appStatCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",
    },
    {
      title: "Total de Makers",
      value: stats?.totalMakers || 0,
      icon: UserCheck,
      gradient: "linear-gradient(135deg, #404040 0%, #262626 100%)",
    },
    {
      title: "Total de Produtos",
      value: stats?.totalProducts || 0,
      icon: Package,
      gradient: "linear-gradient(135deg, #525252 0%, #2d2d2d 100%)",
    },
    {
      title: "Total de Pedidos",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      gradient: "linear-gradient(135deg, #737373 0%, #404040 100%)",
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-section">
        <h2 className="section-title">Estatísticas do App</h2>
        <div className="stats-grid">
          {appStatCards.map((card, index) => (
            <div
              key={index}
              className="stat-card animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="stat-icon" style={{ background: card.gradient }}>
                <card.icon size={28} color="white" />
              </div>
              <div className="stat-content">
                <p className="stat-label">{card.title}</p>
                <h2 className="stat-value">
                  {card.value.toLocaleString("pt-BR")}
                </h2>
              </div>
              <div
                className="stat-decoration"
                style={{ background: card.gradient }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section analytics-section">
        <div className="section-header">
          <h2 className="section-title">
            Analytics do Site (Google Analytics)
          </h2>
          <DateRangePicker
            startDate={analytics.dateRange.startDate}
            endDate={analytics.dateRange.endDate}
            onChange={analytics.setDateRange}
          />
        </div>

        {analytics.loading ? (
          <Loading />
        ) : (
          <>
            {analytics.overview && (
              <div className="analytics-overview">
                <MetricCard
                  title="Usuários Ativos"
                  value={analytics.overview.activeUsers.toLocaleString("pt-BR")}
                  icon={Users}
                  color="var(--primary)"
                />
                <MetricCard
                  title="Sessões"
                  value={analytics.overview.totalSessions.toLocaleString(
                    "pt-BR",
                  )}
                  icon={Activity}
                  color="var(--secondary)"
                />
                <MetricCard
                  title="Visualizações"
                  value={analytics.overview.totalPageViews.toLocaleString(
                    "pt-BR",
                  )}
                  icon={Eye}
                  color="var(--success)"
                />
                <MetricCard
                  title="Eventos"
                  value={analytics.overview.totalEvents.toLocaleString("pt-BR")}
                  icon={Zap}
                  color="var(--warning)"
                />
              </div>
            )}

            {analytics.downloadStats && (
              <div className="analytics-overview download-stats-row">
                <MetricCard
                  title="Total Downloads"
                  value={analytics.downloadStats.totalDownloadClicks.toLocaleString(
                    "pt-BR",
                  )}
                  icon={Download}
                  color="var(--info)"
                />
                <MetricCard
                  title="iOS"
                  value={analytics.downloadStats.iosClicks.toLocaleString(
                    "pt-BR",
                  )}
                  icon={Download}
                  color="var(--primary)"
                />
                <MetricCard
                  title="Android"
                  value={analytics.downloadStats.androidClicks.toLocaleString(
                    "pt-BR",
                  )}
                  icon={Download}
                  color="var(--success)"
                />
                <MetricCard
                  title="Taxa de Conversão"
                  value={analytics.formatPercent(
                    analytics.downloadStats.conversionRate,
                  )}
                  subtitle={`${analytics.downloadStats.ctaClicks} CTAs clicados`}
                  icon={TrendingDown}
                  color="var(--warning)"
                />
              </div>
            )}

            <div className="analytics-grid">
              <div className="analytics-card">
                <DataTable
                  title={
                    <h3 className="card-title">
                      <Zap size={20} />
                      Top Eventos
                    </h3>
                  }
                  columns={[
                    {
                      key: "eventName",
                      label: "Evento",
                      render: (value) => value,
                    },
                    {
                      key: "eventCount",
                      label: "Total",
                      render: (value) => value.toLocaleString("pt-BR"),
                    },
                    {
                      key: "uniqueUsers",
                      label: "Usuários Únicos",
                      render: (value) => value.toLocaleString("pt-BR"),
                    },
                  ]}
                  data={analytics.topEvents}
                  emptyMessage="Nenhum evento registrado"
                />
              </div>

              <div className="analytics-card">
                <DataTable
                  title={
                    <h3 className="card-title">
                      <UserCheck size={20} />
                      Top Makers
                    </h3>
                  }
                  columns={[
                    {
                      key: "makerName",
                      label: "Loja",
                      render: (_, row) => (
                        <div className="table-item-info">
                          {row.imageUrl ? (
                            <img
                              src={row.imageUrl}
                              alt={row.makerName}
                              className="table-item-avatar"
                            />
                          ) : (
                            <div className="table-item-avatar" />
                          )}
                          <div className="table-item-details">
                            <span className="table-item-name">
                              {row.makerName}
                            </span>
                            <span className="table-item-subtitle">
                              {row.city && row.state
                                ? `${row.city} / ${row.state}`
                                : "Localização não informada"}
                            </span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "profileViewCount",
                      label: "Visualizações",
                      render: (value) => value.toLocaleString("pt-BR"),
                    },
                  ]}
                  data={analytics.topMakers}
                  emptyMessage="Nenhum maker visualizado"
                />
              </div>

              <div className="analytics-card full-width">
                <DataTable
                  title={
                    <h3 className="card-title">
                      <Package size={20} />
                      Top Produtos
                    </h3>
                  }
                  columns={[
                    {
                      key: "productName",
                      label: "Produto",
                      render: (_, row) => (
                        <div className="table-item-info">
                          {row.imageUrl ? (
                            <img
                              src={row.imageUrl}
                              alt={row.productName}
                              className="table-item-image"
                            />
                          ) : (
                            <div className="table-item-image" />
                          )}
                          <div className="table-item-details">
                            <span className="table-item-name">
                              {row.productName}
                            </span>
                            <span className="table-item-subtitle">
                              {row.category}
                            </span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "viewCount",
                      label: "Visualizações",
                      render: (value) => value.toLocaleString("pt-BR"),
                    },
                    {
                      key: "price",
                      label: "Preço",
                      render: (value) =>
                        value
                          ? value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "-",
                    },
                  ]}
                  data={analytics.topProducts}
                  emptyMessage="Nenhum produto visualizado"
                />
              </div>
              <div className="analytics-card full-width">
                <DataTable
                  title={
                    <h3 className="card-title">
                      <FileText size={20} />
                      Top Páginas
                    </h3>
                  }
                  columns={[
                    {
                      key: "pageTitle",
                      label: "Página",
                      render: (value) => value,
                    },
                    { key: "pagePath", label: "URL" },
                    {
                      key: "viewCount",
                      label: "Visualizações",
                      render: (value) => value.toLocaleString("pt-BR"),
                    },
                    {
                      key: "uniqueUsers",
                      label: "Usuários Únicos",
                      render: (value) => value.toLocaleString("pt-BR"),
                    },
                    {
                      key: "averageTimeOnPage",
                      label: "Tempo Médio",
                      render: (value) => analytics.formatDuration(value),
                    },
                  ]}
                  data={analytics.topPages}
                  emptyMessage="Nenhuma página visualizada"
                />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
