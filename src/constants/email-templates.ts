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
    id: "welcome",
    name: "Boas-vindas (Oficial)",
    subject: "Bem-vindo à Rethink3D! 🚀",
    type: EmailTemplateType.WELCOME,
    content:
      "Olá Maker,\n\nEstamos muito felizes em ter você conosco! Sua loja já está ativa e pronta para receber pedidos.\n\nAqui estão alguns passos para começar:\n- Complete seu perfil\n- Cadastre seus primeiros produtos\n- Configure suas formas de recebimento\n\nConte conosco para crescer!",
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
  const colors = {
    [EmailTemplateType.WELCOME]: { header: "#4f46e5", bg: "#eef2ff" },
    [EmailTemplateType.INFO]: { header: "#2563eb", bg: "#eff6ff" },
    [EmailTemplateType.ALERT]: { header: "#dc2626", bg: "#fef2f2" },
  };

  const theme = colors[type] || colors[EmailTemplateType.INFO];
  const formattedBody = bodyContent.replace(/\n/g, "<br/>");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: ${theme.header}; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px; background-color: ${theme.bg}; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .btn { display: inline-block; padding: 12px 24px; background-color: ${theme.header}; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div style="padding: 40px 0;">
        <div class="container">
          <div class="header"><h1>Rethink3D</h1></div>
          <div class="content">
            <h2 style="margin-top: 0; color: #111827;">${subject}</h2>
            <div>${formattedBody}</div>
            <br/>
            <center>
                <a href="https://web.rethink3d.com.br/dashboard" target="_blank" class="btn">Acessar Painel</a>
            </center>
          </div>
          <div class="footer"><p>Preview do Sistema</p></div>
        </div>
      </div>
    </body>
    </html>
  `;
};
