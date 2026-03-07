import React, { useEffect } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../../contexts/PageTitleContext";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleMobile }) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { pageTitle, setPageTitle, backAction, setBackAction } = usePageTitle();

  useEffect(() => {
    const mainPaths = [
      "/dashboard",
      "/makers",
      "/products",
      "/orders",
      "/custom-requests",
      "/actions",
    ];
    if (mainPaths.includes(location.pathname) || location.pathname === "/") {
      setBackAction(null);
    }
  }, [location.pathname, setBackAction]);

  const handleBack = () => {
    if (backAction?.onClick) {
      backAction.onClick();
    } else if (backAction?.path) {
      navigate(backAction.path);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const path = location.pathname;

    if (path === "/dashboard" || path === "/") {
      setPageTitle("Dashboard");
    } else if (path === "/makers") {
      setPageTitle("Makers");
    } else if (path.startsWith("/makers/") && params.id) {
      setPageTitle("Maker");
    } else if (path === "/products") {
      setPageTitle("Produtos");
    } else if (path.startsWith("/products/") && params.id) {
      setPageTitle("Produto");
    } else if (path === "/actions") {
      setPageTitle("Ações");
    } else if (path === "/actions/categories") {
      setPageTitle("Categorias");
    } else if (path === "/actions/rules") {
      setPageTitle("Regras da Plataforma");
    } else if (path === "/actions/feedbacks") {
      setPageTitle("Feedbacks");
    } else if (path === "/custom-requests") {
      setPageTitle("Solicitações Customizadas");
    } else if (path.startsWith("/custom-requests/") && params.id) {
      setPageTitle("Detalhes da Solicitação");
    } else {
      setPageTitle("Rethink3D");
    }
  }, [location.pathname, params.id, setPageTitle]);

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn desktop" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <button className="header-menu-btn mobile" onClick={onToggleMobile}>
          <Menu size={20} />
        </button>

        {backAction && (
          <button className="back-nav-btn animate-fadeIn" onClick={handleBack}>
            <ArrowLeft size={20} />
            {backAction.label && (
              <span className="back-label">{backAction.label}</span>
            )}
          </button>
        )}
      </div>

      <div className="header-title">
        <h1>{pageTitle}</h1>
      </div>
    </header>
  );
};

export default Header;
