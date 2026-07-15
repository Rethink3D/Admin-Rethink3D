import { useEffect, useState } from "react";
import { DollarSign, RefreshCw, AlertTriangle } from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import { useModal } from "../../../contexts/ModalContext";
import { paymentsService } from "../../../services/payments.service";
import "./MakerPayments.css";

const MakerPayments: React.FC = () => {
  const { setPageTitle, setBackAction } = usePageTitle();
  const { showModal } = useModal();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setPageTitle("Repasses aos Makers");
    setBackAction({ label: "Ações", path: "/actions" });
  }, [setPageTitle, setBackAction]);

  const handleRetry = () => {
    showModal({
      type: "confirm",
      title: "Reprocessar repasses pendentes?",
      message:
        "Todas as transferências PIX em estado de retentativa serão reenviadas ao provedor de pagamento agora. Os Makers com dados válidos receberão o valor imediatamente.",
      onConfirm: async () => {
        setProcessing(true);
        try {
          const { data } = await paymentsService.retryMakerPayments();
          showModal({
            type: "success",
            title: "Reprocessamento disparado",
            message:
              data.processed > 0
                ? `${data.processed} pagamento(s) em retentativa foram reprocessados. Acompanhe a confirmação pelo status dos pedidos.`
                : "Nenhum pagamento pendente de retentativa foi encontrado.",
          });
        } catch (error) {
          showModal({
            type: "error",
            title: "Erro ao reprocessar",
            message:
              error instanceof Error
                ? error.message
                : "Erro ao reprocessar pagamentos.",
          });
        } finally {
          setProcessing(false);
        }
      },
    });
  };

  return (
    <div className="maker-payments-page animate-fadeIn">
      <div className="maker-payments-card">
        <div className="maker-payments-header">
          <DollarSign className="maker-payments-icon" size={24} />
          <div>
            <h3>Reprocessar Repasses PIX</h3>
            <p>
              Quando uma transferência PIX para um Maker falha, ela fica
              pendente em estado de retentativa e é reprocessada
              automaticamente apenas na rotina diária (1h da manhã). Use este
              botão para disparar o reprocessamento imediatamente.
            </p>
          </div>
        </div>

        <button
          className="maker-payments-retry-btn"
          onClick={handleRetry}
          disabled={processing}
        >
          <RefreshCw size={18} className={processing ? "spinning" : ""} />
          {processing
            ? "Reprocessando..."
            : "Reprocessar pagamentos pendentes"}
        </button>

        <div className="maker-payments-warning">
          <AlertTriangle size={16} />
          <p>
            Pagamentos que falharem novamente continuam em retentativa (até 5
            tentativas). Se um pagamento estourar o limite, ele é marcado como
            falho e precisa de tratamento manual.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakerPayments;
