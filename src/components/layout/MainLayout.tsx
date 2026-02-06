import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./MainLayout.css";

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { hideModal } = useModal();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    setMobileOpen(false);

    hideModal();
  }, [location, hideModal]);

  return (
    <div className="main-layout">
      {mobileOpen && <div className="mobile-overlay" onClick={toggleMobile} />}

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleMobile={toggleMobile}
      />
      <div className={`main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Header onToggleSidebar={toggleSidebar} onToggleMobile={toggleMobile} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
