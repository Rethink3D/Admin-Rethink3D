import React, { useEffect, useState } from "react";
import {
  Clock,
  MessageSquare,
  Eye,
  EyeOff,
  User,
  Mail,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Loading from "../../../components/shared/Loading";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useFeedbacks } from "../../../hooks/useFeedbacks";
import { useAuth } from "../../../contexts/AuthContext";
import AuthenticatedImage, {
  getAuthenticatedUrl,
} from "../../../components/shared/AuthenticatedImage";
import "./Feedbacks.css";

const Feedbacks: React.FC = () => {
  const { token } = useAuth();
  const { setPageTitle, setBackAction } = usePageTitle();
  const {
    feedbacks,
    loading,
    filterSeen,
    setFilterSeen,
    markAsSeen,
    markAsUnseen,
  } = useFeedbacks();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setPageTitle("Feedbacks");
    setBackAction({ label: "Ações", path: "/actions" });
  }, [setPageTitle, setBackAction]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="feedbacks-page">
      <div className="filter-box">
        <select
          value={filterSeen === null ? "" : filterSeen.toString()}
          onChange={(e) => {
            const val = e.target.value;
            setFilterSeen(val === "" ? null : val === "true");
          }}
          className="filter-select"
        >
          <option value="">Todos</option>
          <option value="false">Pendentes</option>
          <option value="true">Vistos</option>
        </select>
      </div>

      <div className="feedbacks-container">
        {feedbacks.length > 0 ? (
          <div className="feedbacks-list">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`feedback-card ${feedback.seen ? "seen" : "new"}`}
              >
                <div
                  className="feedback-card-header"
                  onClick={() => toggleExpand(feedback.id)}
                >
                  <div className="feedback-user-info">
                    <div className="avatar-placeholder">
                      <User size={20} />
                    </div>
                    <div className="user-details">
                      <h4>{feedback.user?.name || "Usuário Anônimo"}</h4>
                      <span className="email-small">
                        <Mail size={12} /> {feedback.user?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="feedback-meta">
                    <div className="feedback-date">
                      <Clock size={14} />
                      <span>{formatDate(feedback.createdAt)}</span>
                    </div>
                    {feedback.seen ? (
                      <span className="status-badge seen">Visto</span>
                    ) : (
                      <span className="status-badge new">Novo</span>
                    )}
                    <button className="expand-button">
                      {expandedId === feedback.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className={`feedback-card-content ${expandedId === feedback.id ? "expanded" : ""}`}
                >
                  <div className="feedback-description">
                    <MessageSquare size={16} className="quote-icon" />
                    <p>{feedback.description}</p>
                  </div>

                  {feedback.images.length > 0 && (
                    <div className="feedback-images-section">
                      <h5>
                        <ImageIcon size={16} /> Imagens (
                        {feedback.images.length})
                      </h5>
                      <div className="feedback-images-grid">
                        {feedback.images.map((img) => (
                          <div key={img.id} className="feedback-image-wrapper">
                            <AuthenticatedImage
                              src={img.url}
                              alt="Feedback"
                              onClick={() =>
                                window.open(
                                  getAuthenticatedUrl(img.url, token),
                                  "_blank",
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="feedback-actions">
                    {!feedback.seen ? (
                      <button
                        className="action-btn mark-seen"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsSeen(feedback.id);
                        }}
                      >
                        <Eye size={18} /> Marcar como visto
                      </button>
                    ) : (
                      <button
                        className="action-btn mark-unseen"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsUnseen(feedback.id);
                        }}
                      >
                        <EyeOff size={18} /> Marcar como pendente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhum feedback encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
