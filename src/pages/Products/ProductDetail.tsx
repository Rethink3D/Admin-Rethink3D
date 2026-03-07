import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  DollarSign,
  Info,
  Layers,
  Box,
  Clock,
  Layout,
  Tag,
  Check,
  Copy,
} from "lucide-react";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useProductDetail } from "../../hooks/useProductDetail";
import Loading from "../../components/shared/Loading";
import { formatCurrency } from "../../utils/formatters";
import "./ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setPageTitle, setBackAction } = usePageTitle();
  const { product, loading } = useProductDetail(id);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    setPageTitle("Detalhes do Produto");
    setBackAction({
      label: "Voltar para Produtos",
      path: "/products",
    });
  }, [setPageTitle, setBackAction]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loading />;
  if (!product)
    return <div className="empty-state">Produto não encontrado</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-header">
          <div className="header-main">
            <div className="header-title-area">
              <h1>{product.name}</h1>
              {product.isActive ? (
                <span className="badge badge-success">Ativo</span>
              ) : (
                <span className="badge badge-error">Inativo</span>
              )}
            </div>
            <div className="header-meta">
              <span className="meta-item">
                <Tag size={14} />
                {product.categories?.map((c) => c.name).join(", ") ||
                  "Sem categoria"}
              </span>
            </div>
          </div>
        </div>

        <div className="product-detail-grid">
          <div className="detail-main-col">
            <div className="info-card">
              <h2 className="card-title">
                <Layout size={18} />
                Galeria e Descrição
              </h2>
              <div className="product-gallery">
                {(product.images?.length ?? 0) > 0 ? (
                  <div className="images-grid">
                    {product.images?.map((img) => (
                      <div key={img.id} className="image-wrapper">
                        <img src={img.url} alt={product.name} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-images">
                    <Package size={48} />
                    <span>Nenhuma imagem cadastrada</span>
                  </div>
                )}
              </div>
              <div className="product-description-section">
                <span className="info-label">Descrição</span>
                <p className="description-text">{product.description}</p>
              </div>
            </div>

            <div className="dual-card-row">
              <div className="info-card">
                <h2 className="card-title">
                  <Layers size={18} />
                  Materiais e Produção
                </h2>
                <div className="stack-info">
                  <div className="info-item-stacked">
                    <span className="info-label">Materiais Compatíveis</span>
                    <div className="tags-list">
                      {product.materials?.map((m) => (
                        <span key={m} className="tag-pill">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="info-item-stacked">
                    <span className="info-label">Tempo de Produção</span>
                    <span className="info-value">
                      <Clock size={16} /> {product.productionDays} dias úteis
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h2 className="card-title">
                  <Box size={18} />
                  Dimensões e Peso
                </h2>
                <div className="stack-info">
                  {product.productDimensions ? (
                    <div className="dimensions-grid">
                      <div className="dim-item">
                        <span className="dim-label">Peso</span>
                        <span className="dim-value">
                          {product.productDimensions.weight}g
                        </span>
                      </div>
                      <div className="dim-item">
                        <span className="dim-label">Alt.</span>
                        <span className="dim-value">
                          {product.productDimensions.height}cm
                        </span>
                      </div>
                      <div className="dim-item">
                        <span className="dim-label">Larg.</span>
                        <span className="dim-value">
                          {product.productDimensions.width}cm
                        </span>
                      </div>
                      <div className="dim-item">
                        <span className="dim-label">Comp.</span>
                        <span className="dim-value">
                          {product.productDimensions.length}cm
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-dimensions">
                      <span className="text-secondary text-sm">
                        Dimensões não informadas para este produto
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-side-col">
            <div className="info-card primary-border">
              <h2 className="card-title">
                <DollarSign size={18} />
                Precificação
              </h2>
              <div className="pricing-stack">
                <div className="price-item">
                  <span className="label">Preço Base (Maker)</span>
                  <span className="value">{formatCurrency(product.price)}</span>
                </div>
                <div className="price-item highlight">
                  <span className="label">Preço de Venda (C/ Taxas)</span>
                  <span className="value">
                    {formatCurrency(product.priceWithFee)}
                  </span>
                </div>
                <div className="price-info">
                  Taxa de intermediação aplicada:{" "}
                  <strong>
                    {formatCurrency(product.priceWithFee - product.price)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="info-card meta-card">
              <h2 className="card-title">
                <Info size={18} />
                Dados do Sistema
              </h2>
              <div className="stack-info">
                <div className="info-item-stacked">
                  <span className="info-label">Dono do Produto (Maker)</span>
                  <span className="info-value font-bold text-primary">
                    {product.makerName}
                  </span>
                </div>
                <div className="info-item-stacked">
                  <span className="info-label">ID do Produto</span>
                  <div className="id-field">
                    <span className="code">{product.id}</span>
                    <button
                      className={`copy-button ${copied ? "copied" : ""}`}
                      onClick={() => handleCopyId(product.id)}
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

export default ProductDetail;
