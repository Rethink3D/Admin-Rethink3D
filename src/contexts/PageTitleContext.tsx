import React, { createContext, useContext, useState, ReactNode } from "react";

interface BackAction {
  label?: string;
  path?: string;
  onClick?: () => void;
}

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  backAction: BackAction | null;
  setBackAction: (action: BackAction | null) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(
  undefined,
);

export const PageTitleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pageTitle, setPageTitle] = useState("Rethink3D");
  const [backAction, setBackAction] = useState<BackAction | null>(null);

  return (
    <PageTitleContext.Provider
      value={{ pageTitle, setPageTitle, backAction, setBackAction }}
    >
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("usePageTitle must be used within PageTitleProvider");
  }
  return context;
};
