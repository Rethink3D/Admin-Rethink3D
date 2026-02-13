import React, { useMemo } from "react";
import { MakerPreviewDTO } from "../../types/dtos/maker.dto";
import { Search, CheckSquare, Square, Users } from "lucide-react";
import "../../pages/Actions/SendEmail/SendEmail.css";

interface RecipientListProps {
  makers: MakerPreviewDTO[];
  selectedMakers: string[];
  onToggleMaker: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const RecipientList: React.FC<RecipientListProps> = ({
  makers,
  selectedMakers,
  onToggleMaker,
  onSelectAll,
  searchTerm,
  onSearchChange,
}) => {
  const filteredMakers = useMemo(() => {
    return makers.filter((maker) =>
      maker.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [makers, searchTerm]);

  const handleSelectAllClick = () => {
    if (
      selectedMakers.length === filteredMakers.length &&
      filteredMakers.length > 0
    ) {
      onSelectAll([]);
    } else {
      onSelectAll(filteredMakers.map((m) => m.id));
    }
  };

  return (
    <div className="recipients-column">
      <div className="recipients-header">
        <label>Destinatários ({selectedMakers.length})</label>
        <button
          type="button"
          className="text-btn"
          onClick={handleSelectAllClick}
        >
          {selectedMakers.length > 0 &&
          selectedMakers.length === filteredMakers.length
            ? "Desmarcar todos"
            : "Selecionar todos"}
        </button>
      </div>

      <div className="search-recipient">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="makers-list-scroll">
        {filteredMakers.length > 0 ? (
          filteredMakers.map((maker) => (
            <div
              key={maker.id}
              className={`maker-item ${
                selectedMakers.includes(maker.id) ? "selected" : ""
              }`}
              onClick={() => onToggleMaker(maker.id)}
            >
              <div className="checkbox-custom">
                {selectedMakers.includes(maker.id) ? (
                  <CheckSquare size={20} color="var(--primary)" />
                ) : (
                  <Square size={20} color="var(--text-tertiary)" />
                )}
              </div>
              <div className="maker-item-info">
                <span className="maker-item-name">{maker.name}</span>
                <span className="maker-item-details">
                  {maker.productsCount} produtos
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-list">
            <Users size={32} />
            <p>Nenhum maker encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientList;
