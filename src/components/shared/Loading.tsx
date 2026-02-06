import React from "react";
import "./Loading.css";

interface LoadingProps {
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? "loading-container full-screen"
    : "loading-container";

  return (
    <div className={containerClass}>
      <div className="loading-spinner"></div>
      <p className="loading-text">Carregando...</p>
    </div>
  );
};

export default Loading;
