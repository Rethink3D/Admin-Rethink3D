import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingCart,
  User,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Info,
  Copy,
  Check,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import { usePageTitle } from "../../contexts/PageTitleContext";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import { getOrderTypeLabel, getStatusBadge } from "../../utils/order-utils";
import "./OrderDetail.css";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setPageTitle, setBackAction } = usePageTitle();
  const { order, loading } = useOrderDetail(id!);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order) {
      setPageTitle(`Pedido - #${order.id.split("-")[0].toUpperCase()}`);
    } else {
      setPageTitle("Detalhes do Pedido");
    }
    setBackAction({ label: "Pedidos", path: "/orders" });
  }, [order, setPageTitle, setBackAction]);

  const handleCopyId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <div className="order-detail-header">
          <div className="header-main">
            <div className="header-title-area">
              <h1>Pedido #{order.id.split("-")[0].toUpperCase()}</h1>
              {getStatusBadge(order.status)}
            </div>
            <div className="header-meta">
              <span className="meta-item">
                <Calendar size={14} />
                {formatDateTime(order.creationTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="detail-main-col">
            <div className="dual-card-row">
              <div className="info-card">
                <h2 className="card-title">
                  <User size={18} />
                  Cliente
                </h2>
                <div className="stack-info">
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Nome</span>
                      <span className="info-value">{order.user.name}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{order.user.email}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Telefone</span>
                      <span className="info-value">
                        {order.user.phone || "Não informado"}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Localização</span>
                      <span className="info-value">
                        <MapPin
                          size={14}
                          style={{ marginRight: "4px", display: "inline" }}
                        />
                        {order.user.address.city}/{order.user.address.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h2 className="card-title">
                  <ShoppingCart size={18} />
                  Maker
                </h2>
                <div className="stack-info">
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Loja (Maker)</span>
                      <span className="info-value">{order.maker.name}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{order.maker.email}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Telefone</span>
                      <span className="info-value">
                        {order.maker.phone || "Não informado"}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="item-content">
                      <span className="info-label">Localização</span>
                      <span className="info-value">
                        <MapPin
                          size={14}
                          style={{ marginRight: "4px", display: "inline" }}
                        />
                        {order.maker.city || "Não informada"}/
                        {order.maker.state || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card product-card">
              <h2 className="card-title">
                <Package size={18} />
                Produtos do Pedido
              </h2>
              <div className="table-responsive desktop-only">
                <table className="order-products-table">
                  <thead>
                    <tr>
                      <th className="text-left">Produto</th>
                      <th className="text-center" style={{ width: "80px" }}>
                        Qtd
                      </th>
                      <th className="text-center" style={{ width: "120px" }}>
                        Preço Unit.
                      </th>
                      <th className="text-center" style={{ width: "120px" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.productsToOrder.map((item, index) => (
                      <tr key={index}>
                        <td className="text-left">
                          <div className="product-cell">
                            <span>{item.product.name}</span>
                          </div>
                        </td>
                        <td className="text-center font-medium">
                          {item.quantity}
                        </td>
                        <td className="text-center">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="text-center font-semibold">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-products mobile-only">
                {order.productsToOrder.map((item, index) => (
                  <div key={index} className="product-mobile-card">
                    <div className="product-mobile-header">
                      <span className="product-name">{item.product.name}</span>
                      <span className="product-qty">{item.quantity}x</span>
                    </div>
                    <div className="product-mobile-footer">
                      <span className="unit-price">
                        {formatCurrency(item.price)} un.
                      </span>
                      <span className="total-price">
                        {formatCurrency(item.quantity * item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-side-col">
            <div className="info-card financial-card primary-border">
              <h2 className="card-title">
                <DollarSign size={18} />
                Resumo Financeiro
              </h2>
              <div className="financial-rows">
                <div className="financial-section">
                  <span className="section-label">Entrada</span>
                  <div className="financial-row highlight-blue">
                    <span className="label">Total Pago pelo Cliente</span>
                    <span className="value">
                      {formatCurrency(order.totalValue)}
                    </span>
                  </div>
                </div>

                <div className="financial-section">
                  <span className="section-label">Deduções e Repasse</span>
                  {order.paymentFee > 0 && (
                    <div className="financial-row">
                      <span className="label">Taxa de Pagamento</span>
                      <span className="value red-text">
                        - {formatCurrency(order.paymentFee)}
                      </span>
                    </div>
                  )}
                  <div className="financial-row highlight-orange">
                    <span className="label">Repasse ao Maker</span>
                    <span className="value">
                      {formatCurrency(
                        order.totalValue -
                          order.paymentFee -
                          order.totalIntermediaryFee,
                      )}
                    </span>
                  </div>
                </div>

                <div className="financial-divider"></div>

                <div className="financial-section">
                  <span className="section-label">Resultado (Rethink3D)</span>
                  <div className="financial-row total-row success-bg">
                    <span className="label">Lucro (Taxa de Intermediação)</span>
                    <span className="value green-text">
                      {formatCurrency(order.totalIntermediaryFee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card meta-card">
              <h2 className="card-title">
                <Info size={18} />
                Detalhes Internos
              </h2>
              <div className="stack-info border-top">
                <div className="info-item-stacked">
                  <span className="info-label">Tipo de Pedido</span>
                  <span className="info-value primary-text font-bold">
                    {getOrderTypeLabel(order.type)}
                  </span>
                </div>

                <div className="info-item-stacked">
                  <span className="info-label">ID Completo</span>
                  <div className="id-field">
                    <span className="code">{order.id}</span>
                    <button
                      className={`copy-button ${copied ? "copied" : ""}`}
                      onClick={() => handleCopyId(order.id)}
                      title="Copiar ID"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="dual-card-row">
                  <div className="info-item-stacked">
                    <span className="info-label">Data Limite</span>
                    <span className="info-value">
                      {order.deadline
                        ? formatDateTime(order.deadline)
                        : "Não definido"}
                    </span>
                  </div>
                  <div className="info-item-stacked">
                    <span className="info-label">Atualização</span>
                    <span className="info-value">
                      {order.updatedAt
                        ? formatDateTime(order.updatedAt)
                        : "Não definido"}
                    </span>
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

export default OrderDetail;
