import React, { useEffect, useState } from "react";
import {
  Trash2,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useProductsPreview } from "../../hooks/useProductsPreview";
import { useToast } from "../../contexts/ToastContext";
import "./Products.css";

const Products: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { products, loading, setSearch, page, setPage, meta, handleDelete } =
    useProductsPreview();

  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearched, setLastSearched] = useState("");

  useEffect(() => {
    setPageTitle("Produtos");
  }, [setPageTitle]);

  useEffect(() => {
    if (searchTerm === lastSearched) return;

    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setLastSearched(searchTerm);
      setPage(1);

      if (searchTerm) {
        showToast({
          type: "info",
          title: "Buscando...",
          message: `Filtrando por: ${searchTerm}`,
          duration: 3000,
        });
      } else if (lastSearched) {
        showToast({
          type: "info",
          title: "Limpando filtros...",
          message: "Exibindo todos os produtos",
          duration: 3000,
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchTerm, lastSearched, setSearch, setPage, showToast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchTerm !== lastSearched) {
        setSearch(searchTerm);
        setLastSearched(searchTerm);
        setPage(1);

        if (searchTerm) {
          showToast({
            type: "info",
            title: "Buscando...",
            message: `Filtrando por: ${searchTerm}`,
            duration: 3000,
          });
        } else {
          showToast({
            type: "info",
            title: "Limpando filtros...",
            message: "Exibindo todos os produtos",
            duration: 3000,
          });
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setLastSearched("");
    setSearch("");
    setPage(1);
    showToast({
      type: "info",
      title: "Busca Limpa",
      message: "Exibindo todos os produtos",
      duration: 3000,
    });
  };

  const handleViewDetail = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="products-page">
      <div className="products-header-actions">
        <div className="search-input-wrapper full-width">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por ID, nome ou Maker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={handleClearSearch}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {loading && !products.length ? (
          <div className="loading-container">
            <Loading />
          </div>
        ) : (
          <>
            <table className="data-table desktop-only">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Maker</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="text-xs text-secondary">
                      #{product.id.split("-")[0]}
                    </td>
                    <td className="font-medium">{product.name}</td>
                    <td>{product.makerName}</td>
                    <td>
                      <div className="flex items-center gap-xs">
                        <DollarSign size={16} color="var(--success)" />
                        <span className="font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {product.isActive ? (
                        <span className="badge badge-success">
                          <CheckCircle size={14} /> Ativo
                        </span>
                      ) : (
                        <span className="badge badge-error">
                          <XCircle size={14} /> Inativo
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="icon-button"
                          onClick={() => handleViewDetail(product.id)}
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="icon-button icon-button-danger"
                          onClick={() => handleDelete(product)}
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mobile-only">
              <div className="mobile-cards-list">
                {products.map((product) => (
                  <div key={product.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="title-block">
                        <span className="id-tag">
                          #{product.id.split("-")[0]}
                        </span>
                        <h3 className="mobile-card-title">{product.name}</h3>
                      </div>
                      {product.isActive ? (
                        <span className="badge badge-success">
                          <CheckCircle size={12} /> Ativo
                        </span>
                      ) : (
                        <span className="badge badge-error">
                          <XCircle size={12} /> Inativo
                        </span>
                      )}
                    </div>
                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Maker</span>
                        <span className="mobile-card-value text-secondary">
                          {product.makerName}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Preço</span>
                        <span className="mobile-card-value font-bold primary-text">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price)}
                        </span>
                      </div>
                    </div>
                    <div className="mobile-card-actions">
                      <button
                        className="mobile-action-btn"
                        onClick={() => handleViewDetail(product.id)}
                      >
                        <Eye size={18} /> Detalhes
                      </button>
                      <button
                        className="mobile-action-btn danger"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={18} /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {products.length === 0 && (
              <div className="empty-state">
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="products-page-footer">
        <div className="pagination-area">
          {meta && meta.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="pagination-info">
                Página <span>{page}</span> de <span>{meta.totalPages}</span>
              </div>
              <button
                className="pagination-btn"
                disabled={page === meta.totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="products-stats-discreet">
          Total de <strong>{meta?.total || 0}</strong> produtos
        </div>
      </div>
    </div>
  );
};

export default Products;
