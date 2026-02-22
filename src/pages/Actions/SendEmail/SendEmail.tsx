import React from "react";
import { ArrowLeft } from "lucide-react";
import Loading from "../../../components/shared/Loading";
import RecipientList from "../../../components/actions/RecipientList";
import EmailEditor from "../../../components/actions/EmailEditor";
import { useSendEmail } from "../../../hooks/useSendEmail";
import "./SendEmail.css";

const SendEmail: React.FC = () => {
  const {
    makers,
    loading,
    sending,
    selectedMakers,
    subject,
    message,
    templateType,
    searchTerm,
    navigate,
    setSubject,
    setMessage,
    setTemplateType,
    setSearchTerm,
    handleToggleMaker,
    handleSelectAll,
    handleSendEmail,
  } = useSendEmail();

  if (loading) return <Loading />;
  if (sending)
    return (
      <Loading fullScreen message="Enviando e-mails, por favor aguarde..." />
    );

  return (
    <div className="send-email-page">
      <div className="page-header-actions">
        <button className="back-button" onClick={() => navigate("/actions")}>
          <ArrowLeft size={20} />
          <span>Voltar para Ações</span>
        </button>
      </div>

      <div className="action-tool-card">
        <div className="tool-header">
          <h2>Nova Mensagem</h2>
          <p>Selecione os makers e personalize o modelo de e-mail.</p>
        </div>

        <div className="email-form-layout">
          <RecipientList
            makers={makers}
            selectedMakers={selectedMakers}
            onToggleMaker={handleToggleMaker}
            onSelectAll={handleSelectAll}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <EmailEditor
            subject={subject}
            message={message}
            templateType={templateType}
            onSubjectChange={setSubject}
            onMessageChange={setMessage}
            onTypeChange={setTemplateType}
            onSubmit={handleSendEmail}
            loading={sending}
            hasRecipients={selectedMakers.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
