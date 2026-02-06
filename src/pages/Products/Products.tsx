import React, { useEffect } from "react";
import { Trash2, DollarSign, CheckCircle, XCircle } from "lucide-react";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useProductsPreview } from "../../hooks/useProductsPreview";
import "./Products.css";

const Products: React.FC = () => {
  const { setPageTitle } = usePageTitle();

  const {
    products,
    makers,
    loading,
    searchQuery,
    setSearchQuery,
    filterMaker,
    setFilterMaker,
    handleDelete,
  } = useProductsPreview();

  useEffect(() => {
    setPageTitle("Produtos");
  }, [setPageTitle]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="products-page">
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterMaker}
            onChange={(e) => setFilterMaker(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Makers</option>
            {makers.map((maker) => (
              <option key={maker.id} value={maker.name}>
                {maker.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
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
                  <button
                    className="icon-button icon-button-danger"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.map((product) => (
          <div key={product.id} className="mobile-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">{product.name}</h3>
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
                <span className="mobile-card-value">{product.makerName}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Preço</span>
                <span className="mobile-card-value font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </span>
              </div>
            </div>
            <div className="mobile-card-actions">
              <button
                className="icon-button icon-button-danger"
                onClick={() => handleDelete(product)}
              >
                <Trash2 size={18} />
                <span style={{ marginLeft: "8px" }}>Excluir</span>
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="empty-state">
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
