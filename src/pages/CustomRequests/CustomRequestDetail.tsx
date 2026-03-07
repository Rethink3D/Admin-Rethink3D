import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthenticatedImage from "../../components/shared/AuthenticatedImage";
import {
  User,
  Calendar,
  Info,
  Copy,
  Check,
  Wrench,
  FileText,
  Link as LinkIcon,
  ImageIcon,
  Layers,
  Box,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useCustomRequestDetail } from "../../hooks/useCustomRequestDetail";
import { formatDateTime } from "../../utils/formatters";
import { getCustomRequestStatusBadge } from "../../utils/custom-request-utils";
import "../Orders/OrderDetail.css";
import "./CustomRequestDetail.css";

const CustomRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setPageTitle, setBackAction } = usePageTitle();
  const { request, loading } = useCustomRequestDetail(id!);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (request) {
      setPageTitle(`Solicitação - #${request.id.split("-")[0].toUpperCase()}`);
    } else {
      setPageTitle("Detalhes da Solicitação");
    }
    setBackAction({ label: "Solicitações", path: "/custom-requests" });
  }, [request, setPageTitle, setBackAction]);

  const handleCopyId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loading />;
  }

  if (!request) {
    return null;
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <div className="order-detail-header">
          <div className="header-main">
            <div className="header-title-area">
              <h1>{request.title}</h1>
              {getCustomRequestStatusBadge(request.status)}
            </div>
            <div className="header-meta">
              <span className="meta-item">
                <Calendar size={14} />
                {formatDateTime(request.creationTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="detail-main-col">
            <div className="info-card">
              <h2 className="card-title">
                <FileText size={18} />
                Descrição do Projeto
              </h2>
              <div className="description-text">{request.description}</div>
            </div>

            <div className="dual-card-row">
              <div className="info-card">
                <h2 className="card-title">
                  <User size={18} />
                  Cliente
                </h2>
                <div className="stack-info">
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Nome</span>
                      <span className="info-value">{request.user.name}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{request.user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h2 className="card-title">
                  <Wrench size={18} />
                  Maker Designado
                </h2>
                <div className="stack-info">
                  {request.maker ? (
                    <div className="info-item">
                      <div className="item-content">
                        <span className="info-label">Nome da Loja</span>
                        <span className="info-value">{request.maker.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-maker-alert">
                      Aguardando aceitação de um maker.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {request.images && request.images.length > 0 && (
              <div className="info-card">
                <h2 className="card-title">
                  <ImageIcon size={18} />
                  Referências / Imagens
                </h2>
                <div className="image-grid">
                  {request.images.map((img: { id: string; url: string }) => (
                    <div key={img.id} className="request-image-wrapper">
                      <AuthenticatedImage src={img.url} alt="Referência" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="detail-side-col">
            <div className="info-card primary-border">
              <h2 className="card-title">
                <Layers size={18} />
                Especificações Técnicas
              </h2>
              <div className="stack-info">
                <div className="info-item-stacked">
                  <span className="info-label">Tipo de Serviço</span>
                  <span className="info-value accent-text">
                    {request.service === "printing"
                      ? "Impressão 3D"
                      : "Impressão + Modelagem"}
                  </span>
                </div>

                <div className="info-item-stacked">
                  <span className="info-label">Quantidade Requerida</span>
                  <span className="info-value">
                    {request.quantity} unidade(s)
                  </span>
                </div>

                {request.materials && request.materials.length > 0 && (
                  <div className="info-item-stacked">
                    <span className="info-label">Materiais Preferenciais</span>
                    <div className="tags-container">
                      {request.materials.map((m: string) => (
                        <span key={m} className="tag">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {request.categories && request.categories.length > 0 && (
                  <div className="info-item-stacked">
                    <span className="info-label">Categorias</span>
                    <div className="tags-container">
                      {request.categories.map(
                        (c: { id: number; name: string }) => (
                          <span key={c.id} className="tag secondary">
                            {c.name}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <h2 className="card-title">
                <Box size={18} />
                Arquivos e Links
              </h2>
              <div className="stack-info">
                {request.projectLink ? (
                  <div className="info-item-stacked">
                    <span className="info-label">Link Externo</span>
                    <a
                      href={request.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      <LinkIcon size={14} /> Ver Projeto Externo
                    </a>
                  </div>
                ) : (
                  <div className="info-item-stacked">
                    <span className="info-label">Link do Projeto</span>
                    <span className="info-value text-tertiary text-xs italic">
                      Não fornecido
                    </span>
                  </div>
                )}

                {request.projectFiles && request.projectFiles.length > 0 ? (
                  <div className="info-item-stacked">
                    <span className="info-label">Arquivos Vinculados</span>
                    <div className="files-list">
                      {request.projectFiles.map((_: string, i: number) => (
                        <div key={i} className="file-item">
                          <FileText size={14} />
                          <span>Arquivo {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="info-item-stacked">
                    <span className="info-label">Arquivos</span>
                    <span className="info-value text-tertiary text-xs italic">
                      Nenhum arquivo anexado
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card meta-card">
              <h2 className="card-title">
                <Info size={18} />
                Identificação
              </h2>
              <div className="stack-info border-top">
                <div className="info-item-stacked">
                  <span className="info-label">ID da Solicitação</span>
                  <div className="id-field">
                    <span className="code">{request.id}</span>
                    <button
                      className={`copy-button ${copied ? "copied" : ""}`}
                      onClick={() => handleCopyId(request.id)}
                      title="Copiar ID"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRequestDetail;
