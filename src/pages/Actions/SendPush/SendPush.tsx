import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import Loading from "../../../components/shared/Loading";
import UserRecipientList from "../../../components/actions/UserRecipientList";
import PushEditor from "../../../components/actions/PushEditor";
import { useSendPush } from "../../../hooks/useSendPush";
import { PushTargetEnum } from "../../../services/push.service";
import "./SendPush.css";

const SendPush: React.FC = () => {
  const { setPageTitle, setBackAction } = usePageTitle();
  const {
    users,
    loading,
    sending,
    selectedUsers,
    title,
    message,
    target,
    searchTerm,
    page,
    totalPages,
    totalUsers,
    setTitle,
    setMessage,
    setTarget,
    setSearchTerm,
    handleToggleUser,
    handleSendPush,
    handlePageChange,
  } = useSendPush();

  useEffect(() => {
    setPageTitle("Notificações Push");
    setBackAction({ label: "Ações", path: "/actions" });
  }, [setPageTitle, setBackAction]);

  if (loading && users.length === 0) return <Loading />;

  return (
    <div className="send-push-page">
      <div className="action-tool-card push-main-card">
        <div className="tool-header">
          <h2>
            <Bell size={24} className="icon-orange" /> Notificações Push
          </h2>
          <p>
            Mantenha contato direto com seus usuários através de alertas no
            celular.
          </p>
        </div>

        <div className="push-form-layout">
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

          <PushEditor
            title={title}
            message={message}
            target={target}
            onTitleChange={setTitle}
            onMessageChange={setMessage}
            onTargetChange={setTarget}
            onSubmit={handleSendPush}
            loading={sending}
            hasRecipients={selectedUsers.length > 0}
            selectedUsers={selectedUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default SendPush;
