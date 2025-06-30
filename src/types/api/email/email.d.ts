import { ApiResponse } from "../api";

export interface SendEmailRequest {
  email: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface EmailData {
  message: string;
}

export type EmailResponse = ApiResponse<EmailData>;
