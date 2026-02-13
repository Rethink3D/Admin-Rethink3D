import React, { useEffect } from "react";
import { Menu } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { usePageTitle } from "../../contexts/PageTitleContext";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleMobile }) => {
  const location = useLocation();
  const params = useParams();
  const { pageTitle, setPageTitle } = usePageTitle();

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
    } else {
      setPageTitle("Rethink3D");
    }
  }, [location.pathname, params.id, setPageTitle]);

  return (
    <header className="header">
      <button className="header-menu-btn desktop" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>
      <button className="header-menu-btn mobile" onClick={onToggleMobile}>
        <Menu size={20} />
      </button>

      <div className="header-title">
        <h1>Admin - {pageTitle}</h1>
      </div>
    </header>
  );
};

export default Header;
