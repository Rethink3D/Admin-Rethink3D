import React from "react";
import { LucideIcon } from "lucide-react";
import "./MetricCard.css";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "var(--primary)",
}) => {
  return (
    <div className="metric-card">
      <div className="metric-card-icon" style={{ background: color }}>
        <Icon size={20} color="white" />
      </div>
      <div className="metric-card-content">
        <p className="metric-card-title">{title}</p>
        <h3 className="metric-card-value">{value}</h3>
        {subtitle && <p className="metric-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
