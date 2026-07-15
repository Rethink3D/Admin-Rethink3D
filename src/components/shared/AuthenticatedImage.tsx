import React from "react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthenticatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const resolveStorageUrl = (url: string): string => {
  if (!url || !url.startsWith("/storage/")) return url;
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  return `${base}${url}`;
};

export const getAuthenticatedUrl = (url: string, token: string | null) => {
  url = resolveStorageUrl(url);
  if (!token || !url || !url.includes("/storage/")) return url;

  const isPrivatePath =
    url.includes("/chats/") ||
    url.includes("/custom_requests/") ||
    url.includes("/custom-requests/") ||
    url.includes("/devolutions/") ||
    url.includes("/feedbacks/");

  if (!isPrivatePath) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}access_token=${token}`;
};

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  src,
  ...props
}) => {
  const { token } = useAuth();

  return <img src={getAuthenticatedUrl(src, token)} {...props} />;
};

export default AuthenticatedImage;
