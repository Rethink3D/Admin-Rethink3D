import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  MessageSquare,
  Tag,
  ArrowRight,
  Settings,
  Bell,
} from "lucide-react";
import { usePageTitle } from "../../contexts/PageTitleContext";
import "./Actions.css";

const Actions: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Ações");
  }, [setPageTitle]);

  const actions = [
    {
      id: "email",
      title: "Enviar E-mail",
      description:
        "Envie comunicados, novidades e avisos para seus Makers parceiros via e-mail.",
      icon: Mail,
      path: "/actions/email",
      color: "var(--primary)",
      disabled: false,
    },
    {
      id: "notifications",
      title: "Notificações Push",
      description:
        "Envie notificações direto para o app móvel dos usuários (Em breve).",
      icon: Bell,
      path: "/actions/push",
      color: "var(--warning)",
      disabled: true,
    },
    {
      id: "coupons",
      title: "Gerar Cupons",
      description:
        "Crie campanhas de desconto em massa para produtos específicos (Em breve).",
      icon: Tag,
      path: "/actions/coupons",
      color: "var(--success)",
      disabled: true,
    },
    {
      id: "categories",
      title: "Gerenciar Categorias",
      description:
        "Crie, edite e organize as categorias globais de produtos e solicitações.",
      icon: Tag,
      path: "/actions/categories",
      color: "var(--primary)",
      disabled: false,
    },
    {
      id: "rules",
      title: "Regras da Plataforma",
      description:
        "Defina taxas de serviço, prazos e configurações globais do sistema.",
      icon: Settings,
      path: "/actions/rules",
      color: "var(--text-primary)",
      disabled: false,
    },
    {
      id: "feedbacks",
      title: "Feedbacks dos Usuários",
      description:
        "Veja e gerencie as opiniões e sugestões enviadas pelos usuários.",
      icon: MessageSquare,
      path: "/actions/feedbacks",
      color: "var(--primary-dark)",
      disabled: false,
    },
  ];

  return (
    <div className="actions-menu-page">
      <div className="actions-grid">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`action-menu-card ${action.disabled ? "disabled" : ""}`}
            onClick={() => !action.disabled && navigate(action.path)}
          >
            <div className="action-card-icon" style={{ color: action.color }}>
              <action.icon size={32} />
            </div>
            <div className="action-card-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
            {!action.disabled && (
              <div className="action-card-arrow">
                <ArrowRight size={20} />
              </div>
            )}
            {action.disabled && (
              <span className="badge-coming-soon">Em Breve</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actions;
