import React from "react";
import { UserResponseDTO } from "../../services/users.service";
import {
  Search,
  CheckSquare,
  Square,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../pages/Actions/SendEmail/SendEmail.css";

interface UserRecipientListProps {
  users: UserResponseDTO[];
  selectedUsers: string[];
  onToggleUser: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  disabled?: boolean;
}

const UserRecipientList: React.FC<UserRecipientListProps> = ({
  users,
  selectedUsers,
  onToggleUser,
  searchTerm,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
  totalUsers,
  disabled = false,
}) => {
  return (
    <div
      className={`recipients-column push-recipients-container ${disabled ? "disabled-column" : ""}`}
    >
      <div className="recipients-header">
        <div className="header-info">
          <label>Destinatários ({selectedUsers.length})</label>
          <span className="total-count">{totalUsers} total</span>
        </div>
      </div>

      {!disabled && (
        <div className="search-recipient">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      <div className="makers-list-scroll fixed-scroll">
        {disabled ? (
          <div className="empty-list">
            <Users size={32} />
            <p>Seleção manual desativada para o filtro atual.</p>
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`maker-item ${
                selectedUsers.includes(user.id) ? "selected" : ""
              }`}
              onClick={() => onToggleUser(user.id)}
            >
              <div className="checkbox-custom">
                {selectedUsers.includes(user.id) ? (
                  <CheckSquare size={20} color="var(--primary)" />
                ) : (
                  <Square size={20} color="var(--text-tertiary)" />
                )}
              </div>
              <div className="maker-item-info">
                <span className="maker-item-name">
                  {user.name} {user.lastName}
                </span>
                <span className="maker-item-email">{user.email}</span>
                <div className="badge-row">
                  {user.isMaker && (
                    <span className="badge badge-maker">Maker</span>
                  )}
                  <span className="badge badge-client">Cliente</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-list">
            <Users size={32} />
            <p>Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {!disabled && totalPages > 1 && (
        <div className="pagination-footer">
          <button
            type="button"
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="page-info">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserRecipientList;
