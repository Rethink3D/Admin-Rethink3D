import React, { useEffect } from "react";
import { Mail } from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import Loading from "../../../components/shared/Loading";
import UserRecipientList from "../../../components/actions/UserRecipientList";
import EmailEditor from "../../../components/actions/EmailEditor";
import { useSendEmail } from "../../../hooks/useSendEmail";
import { PushTargetEnum } from "../../../services/push.service";
import "./SendEmail.css";

const SendEmail: React.FC = () => {
  const { setPageTitle, setBackAction } = usePageTitle();
  const {
    users,
    loading,
    sending,
    selectedUsers,
    subject,
    message,
    target,
    templateType,
    searchTerm,
    page,
    totalPages,
    totalUsers,
    setSubject,
    setMessage,
    setTarget,
    setTemplateType,
    setSearchTerm,
    handleToggleUser,
    handleSendEmail,
    handlePageChange,
  } = useSendEmail();

  useEffect(() => {
    setPageTitle("Envio de E-mail");
    setBackAction({ label: "Ações", path: "/actions" });
  }, [setPageTitle, setBackAction]);

  if (loading && users.length === 0) return <Loading />;
  if (sending)
    return (
      <Loading fullScreen message="Enviando e-mails, por favor aguarde..." />
    );

  return (
    <div className="send-email-page">
      <div className="action-tool-card">
        <div className="tool-header">
          <h2>
            <Mail
              size={24}
              className="icon-orange"
              style={{ marginRight: 8 }}
            />
            Nova Mensagem
          </h2>
          <p>Selecione o público e personalize o modelo de e-mail.</p>
        </div>

        <div className="email-form-layout">
          <UserRecipientList
            users={users}
            selectedUsers={selectedUsers}
            onToggleUser={handleToggleUser}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalUsers={totalUsers}
            disabled={target !== PushTargetEnum.SELECTED}
          />

          <EmailEditor
            subject={subject}
            message={message}
            target={target}
            templateType={templateType}
            onSubjectChange={setSubject}
            onMessageChange={setMessage}
            onTargetChange={setTarget}
            onTypeChange={setTemplateType}
            onSubmit={handleSendEmail}
            loading={sending}
            hasRecipients={selectedUsers.length > 0}
            selectedUsers={selectedUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
