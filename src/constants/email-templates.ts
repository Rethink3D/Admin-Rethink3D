import { EmailTemplateType } from "../types/enums/email-template.enum";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: EmailTemplateType;
  content: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "info",
    name: "Comunicado Informativo",
    subject: "Atualização Importante: Rethink3D",
    type: EmailTemplateType.INFO,
    content:
      "Olá,\n\nGostaríamos de compartilhar uma informação importante sobre suas atividades na plataforma.\n\nCaso tenha dúvidas, nossa equipe está sempre à disposição para ajudar.",
  },
  {
    id: "update",
    name: "Novidade na Plataforma",
    subject: "Confira as novidades da Rethink3D",
    type: EmailTemplateType.INFO,
    content:
      "Olá,\n\nTemos novidades incríveis na plataforma! Acabamos de lançar novas funcionalidades de gestão de pedidos.\n\nAcesse seu painel agora mesmo para conferir as mudanças que vão agilizar o seu dia a dia.",
  },
  {
    id: "alert",
    name: "Aviso de Pendência",
    subject: "Ação Necessária: Verifique sua conta",
    type: EmailTemplateType.ALERT,
    content:
      "Prezado parceiro,\n\nDetectamos uma pendência em seu cadastro que precisa de atenção imediata.\n\nPor favor, verifique seus dados bancários para evitar atrasos nos repasses.\n\nCaso já tenha regularizado, desconsidere este aviso.",
  },
];

export const generatePreviewHTML = (
  subject: string,
  bodyContent: string,
  type: EmailTemplateType = EmailTemplateType.INFO,
) => {
  const palettes: Record<
    EmailTemplateType,
    { accent: string; btnBg: string; btnColor: string }
  > = {
    [EmailTemplateType.WELCOME]: {
      accent: "#7c3aed",
      btnBg: "#7c3aed",
      btnColor: "#ffffff",
    },
    [EmailTemplateType.INFO]: {
      accent: "#000000",
      btnBg: "#000000",
      btnColor: "#ffffff",
    },
    [EmailTemplateType.ALERT]: {
      accent: "#dc2626",
      btnBg: "#dc2626",
      btnColor: "#ffffff",
    },
  };

  const selectedPalette = palettes[type] || palettes[EmailTemplateType.INFO];

  const theme = {
    primary: selectedPalette.accent,
    btnBg: selectedPalette.btnBg,
    btnColor: selectedPalette.btnColor,
    bgWhite: "#ffffff",
    bodyBg: "#f5f5f5",
    textPrimary: "#171717",
    textSecondary: "#525252",
  };

  const formattedBody = bodyContent.replace(/\n/g, "<br/>");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background-color: ${theme.bodyBg}; -webkit-font-smoothing: antialiased; }
        .wrapper { padding: 40px 20px; background-color: ${theme.bodyBg}; }
        .container { max-width: 600px; margin: 0 auto; background-color: ${theme.bgWhite}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e5e5e5; }
        .header { background-color: #000000; padding: 24px 40px; border-bottom: 4px solid ${theme.primary}; display: flex; justify-content: space-between; align-items: center; }
        .logo { height: 32px; width: auto; display: block; }
        .brand-name { color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.025em; }
        .content { padding: 48px 40px; color: ${theme.textPrimary}; line-height: 1.7; font-size: 16px; background-color: ${theme.bgWhite}; }
        .title { margin-top: 0; margin-bottom: 24px; color: #000000; font-size: 24px; font-weight: 600; letter-spacing: -0.025em; }
        .body-text { color: ${theme.textSecondary}; font-size: 15px; margin-bottom: 32px; }
        .button-wrapper { text-align: center; margin-top: 32px; }
        .button { display: inline-block; padding: 14px 32px; background-color: ${theme.btnBg}; color: ${theme.btnColor} !important; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; transition: background-color 0.2s; letter-spacing: 0.01em; }
        .footer { background-color: #fafafa; padding: 32px 40px; text-align: center; color: #a3a3a3; font-size: 13px; border-top: 1px solid #e5e5e5; }
        .footer p { margin: 8px 0 0 0; }
        
        @media only screen and (max-width: 600px) {
          .wrapper { padding: 20px 10px; }
          .container { border-radius: 8px; }
          .header { padding: 20px; }
          .brand-name { font-size: 18px; }
          .content { padding: 32px 20px; }
          .footer { padding: 24px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; border-bottom: 4px solid ${theme.primary}; text-align: center;">
            <tr>
              <td style="padding: 16px 40px; text-align: center; vertical-align: middle;">
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="padding-right: 16px; vertical-align: middle;">
                      <img class="logo" src="https://web.rethink3d.com.br/Logo.webp" alt="Rethink3D Logo" style="height: 40px; width: auto; display: block;" />
                    </td>
                    <td style="text-align: left; vertical-align: middle;">
                      <span class="brand-name" style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.025em; font-family: 'Inter', system-ui, -apple-system, sans-serif;">Rethink3D</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="content">
            <h2 class="title">${subject}</h2>
            <div class="body-text">${formattedBody}</div>
            
            <div class="button-wrapper">
              <a href="https://web.rethink3d.com.br/dashboard" 
                 target="_blank" 
                 class="button">
                 Acessar Painel
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Este é um e-mail automático, por favor não responda a esta mensagem.</p>
            <p>&copy; ${new Date().getFullYear()} Rethink3D. Todos os direitos reservados. (Preview Visual)</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
