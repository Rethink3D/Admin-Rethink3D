import { EmailTemplateType } from "../enums/email-template.enum";

export interface SendEmailDTO {
  recipients: string[];
  subject: string;
  message: string;
  type: EmailTemplateType;
}
