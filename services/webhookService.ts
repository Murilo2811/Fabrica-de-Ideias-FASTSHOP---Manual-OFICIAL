// ====================================================================================
// PASSO CRÍTICO DE CONFIGURAÇÃO: INSIRA A URL DO SEU WEBHOOK AQUI
// ====================================================================================
// Para acionar seu fluxo de automação (ex: Zapier, N8N, Make, etc.),
// substitua o valor abaixo pela URL do seu webhook.
//
// Exemplo: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/'
//
// Se esta URL não for alterada, o envio falhará com um erro de rede.
const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';

/**
 * Envia dados para um webhook externo.
 * @param payload O objeto de dados a ser enviado no corpo da requisição.
 * @returns Uma promessa que resolve se a requisição for bem-sucedida.
 */
export async function sendToWebhook(payload: object): Promise<void> {
  if (WEBHOOK_URL === 'YOUR_WEBHOOK_URL_HERE' || !WEBHOOK_URL) {
    console.error('URL do Webhook não configurada em services/webhookService.ts');
    throw new Error('A URL do Webhook não foi configurada. Verifique o arquivo services/webhookService.ts.');
  }

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar para o webhook: ${response.status} ${response.statusText} - ${errorText}`);
  }
}
