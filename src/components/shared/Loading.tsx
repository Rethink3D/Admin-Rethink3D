import React from "react";
import "./Loading.css";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  message = "Carregando...",
}) => {
  const containerClass = fullScreen
    ? "loading-container full-screen"
    : "loading-container";

  return (
    <div className={containerClass}>
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
