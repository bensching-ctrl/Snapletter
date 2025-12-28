import type { NewsletterStatus } from '@/types';

export interface TriggerGenerationPayload {
  newsletter_id: string;
}

export interface NewsletterResult {
  subject: string;
  text: string;
  html: string;
  generated_at: string;
}

export interface StatusResponse {
  status: NewsletterStatus;
}

export interface N8nApiClient {
  triggerGeneration(newsletterId: string): Promise<void>;
  getStatus(jobId: string): Promise<StatusResponse>;
  getResult(jobId: string): Promise<NewsletterResult>;
}
