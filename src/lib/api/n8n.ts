import type { N8nApiClient, StatusResponse, NewsletterResult } from './types';

const config = {
  baseUrl: process.env.N8N_WEBHOOK_BASE_URL || '',
  createEndpoint: process.env.N8N_WEBHOOK_CREATE || '/webhook/newsletter/create',
  statusEndpoint: process.env.N8N_WEBHOOK_STATUS || '/webhook/newsletter/status',
  resultEndpoint: process.env.N8N_WEBHOOK_RESULT || '/webhook/newsletter/result',
};

export const n8nClient: N8nApiClient = {
  async triggerGeneration(newsletterId: string): Promise<void> {
    const response = await fetch(`${config.baseUrl}${config.createEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletter_id: newsletterId }),
    });

    if (!response.ok) {
      throw new Error(`Webhook-Fehler: ${response.status} ${response.statusText}`);
    }
  },

  async getStatus(jobId: string): Promise<StatusResponse> {
    const response = await fetch(`${config.baseUrl}${config.statusEndpoint}?jobId=${jobId}`);

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`);
    }

    return response.json();
  },

  async getResult(jobId: string): Promise<NewsletterResult> {
    const response = await fetch(`${config.baseUrl}${config.resultEndpoint}?jobId=${jobId}`);

    if (!response.ok) {
      throw new Error(`Failed to get result: ${response.statusText}`);
    }

    return response.json();
  },
};

export default n8nClient;
