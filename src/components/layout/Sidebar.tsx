import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Megaphone,
  LogOut,
  Sun,
  Moon,
  ClipboardList,
} from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onToggleMobile,
}) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/makers", icon: Users, label: "Makers" },
    { path: "/products", icon: Package, label: "Produtos" },
    { path: "/orders", icon: ShoppingCart, label: "Pedidos" },
    { path: "/custom-requests", icon: ClipboardList, label: "Solicitações" },
    { path: "/actions", icon: Megaphone, label: "Ações" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!collapsed && (
            <>
              <img
                src="/Logo.webp"
                alt="Rethink3D"
                className="sidebar-logo-image"
              />
              <span className="sidebar-logo-text">Rethink3D</span>
            </>
          )}
          {collapsed && <span className="sidebar-logo-icon">R3D</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={window.innerWidth <= 1024 ? onToggleMobile : undefined}
          >
            <item.icon className="sidebar-icon" size={20} />
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="sidebar-icon" size={20} />
          ) : (
            <Moon className="sidebar-icon" size={20} />
          )}
          {!collapsed && (
            <span className="sidebar-label">
              {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            </span>
          )}
        </button>

        <button className="sidebar-link" onClick={handleLogout}>
          <LogOut className="sidebar-icon" size={20} />
          {!collapsed && <span className="sidebar-label">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
