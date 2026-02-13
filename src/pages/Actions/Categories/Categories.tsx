import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Tag,
  AlertCircle,
  Loader2,
  X,
  ArrowLeft,
} from "lucide-react";
import Loading from "../../../components/shared/Loading";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useCategories } from "../../../hooks/useCategories";
import { useModal } from "../../../contexts/ModalContext";
import "./Categories.css";

const Categories: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const {
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    addCategory,
    removeCategory,
    getImpact,
  } = useCategories();
  const { showModal } = useModal();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setPageTitle("Categorias");
  }, [setPageTitle]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    const success = await addCategory(newCategoryName.trim());
    setIsAdding(false);

    if (success) {
      setNewCategoryName("");
      showModal({
        type: "success",
        title: "Sucesso",
        message: "Categoria adicionada com sucesso!",
      });
    } else {
      showModal({
        type: "error",
        title: "Erro",
        message:
          "Não foi possível adicionar a categoria. Verifique se ela já existe.",
      });
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (name === "OUTROS") {
      showModal({
        type: "error",
        title: "Ação Negada",
        message: "A categoria 'OUTROS' é protegida e não pode ser excluída.",
      });
      return;
    }

    const impact = await getImpact(id);
    let impactMessage = `Tem certeza que deseja excluir a categoria "${name}"? Esta ação não poderá ser desfeita.`;

    if (
      impact &&
      (impact.productCount > 0 ||
        impact.makerCount > 0 ||
        impact.requestCount > 0)
    ) {
      impactMessage = `Esta categoria está sendo usada por:\n`;
      if (impact.productCount > 0)
        impactMessage += `- ${impact.productCount} produtos\n`;
      if (impact.makerCount > 0)
        impactMessage += `- ${impact.makerCount} makers\n`;
      if (impact.requestCount > 0)
        impactMessage += `- ${impact.requestCount} solicitações customizadas\n`;
      impactMessage += `\nAo excluir, esses itens que possuírem apenas esta categoria serão automaticamente movidos para "OUTROS". Deseja prosseguir?`;
    }

    showModal({
      type: "confirm",
      title: "Confirmar Exclusão",
      message: impactMessage,
      onConfirm: async () => {
        const success = await removeCategory(id);
        if (success) {
          showModal({
            type: "success",
            title: "Excluída",
            message: "Categoria removida com sucesso.",
          });
        } else {
          showModal({
            type: "error",
            title: "Erro",
            message: "Não foi possível remover a categoria.",
          });
        }
      },
    });
  };

  if (loading && categories.length === 0) {
    return <Loading />;
  }

  return (
    <div className="categories-page animate-fadeIn">
      <button className="back-btn" onClick={() => navigate("/actions")}>
        <ArrowLeft size={18} />
        <span>Voltar para Ações</span>
      </button>

      <div className="categories-header-actions">
        <form className="add-category-form" onSubmit={handleAddCategory}>
          <div className="input-group">
            <Tag size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Nova categoria..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={isAdding}
            />
          </div>
          <button
            type="submit"
            className="add-btn"
            disabled={isAdding || !newCategoryName.trim()}
          >
            {isAdding ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            <span>Adicionar</span>
          </button>
        </form>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="category-chip animate-scaleIn">
              <span className="category-name">{category.name}</span>
              <button
                className="delete-category-btn"
                onClick={() => handleDeleteCategory(category.id, category.name)}
                title="Excluir categoria"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>
              {searchTerm
                ? "Nenhuma categoria encontrada para essa busca."
                : "Nenhuma categoria cadastrada."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
