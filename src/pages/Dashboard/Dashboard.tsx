import React, { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboard.service";
import { DashboardStatsDTO } from "../../types/dtos/dashboard.dto";
import { Users, Package, ShoppingCart, UserCheck } from "lucide-react";
import Loading from "../../components/shared/Loading";
import { useModal } from "../../contexts/ModalContext";
import { usePageTitle } from "../../contexts/PageTitleContext";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();
  const { setPageTitle } = usePageTitle();

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

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",
      color: "#c0c0c0",
    },
    {
      title: "Total de Makers",
      value: stats?.totalMakers || 0,
      icon: UserCheck,
      gradient: "linear-gradient(135deg, #404040 0%, #262626 100%)",
      color: "#d4d4d4",
    },
    {
      title: "Total de Produtos",
      value: stats?.totalProducts || 0,
      icon: Package,
      gradient: "linear-gradient(135deg, #525252 0%, #2d2d2d 100%)",
      color: "#e5e5e5",
    },
    {
      title: "Total de Pedidos",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      gradient: "linear-gradient(135deg, #737373 0%, #404040 100%)",
      color: "#ffffff",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        {statCards.map((card, index) => (
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
    </div>
  );
};

export default Dashboard;
