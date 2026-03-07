import { PushTargetEnum } from "../../services/push.service";
import { EmailTemplateType } from "../enums/email-template.enum";

export interface SendEmailDTO {
  target: PushTargetEnum;
  recipients?: string[];
  subject: string;
  message: string;
  type: EmailTemplateType;
}
