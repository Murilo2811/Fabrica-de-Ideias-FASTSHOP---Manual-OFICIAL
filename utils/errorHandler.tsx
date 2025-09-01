import React from 'react';
import type { ParsedError } from '../types';

export const parseApiError = (error: any): ParsedError => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Cenário 1: Falha na conexão (CORS, URL errada, sem internet)
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
    return {
      title: 'Erro de Conexão com o Servidor',
      details: (
        <>
          <p>O aplicativo não conseguiu se comunicar com o seu backend (Google Apps Script). Isso geralmente acontece por um dos motivos abaixo.</p>
          <p className="mt-2 text-sm text-gray-500"><strong>Detalhe técnico:</strong> <code>{errorMessage}</code></p>
        </>
      ),
      troubleshootingSteps: (
        <ul className="list-decimal list-inside space-y-3 text-left">
          <li>
            <strong>Teste de Acessibilidade da URL:</strong>
            <p className="pl-4 text-sm text-gray-600">
              Abra o arquivo <code>services/googleSheetService.ts</code> e verifique se a constante <code>WEB_APP_URL</code> contém a URL <strong>exata</strong> da sua implantação.
            </p>
            <p className="mt-1 pl-4 text-sm text-gray-600">
              <strong>Para confirmar, cole a URL diretamente no seu navegador.</strong> O que você deve ver?
            </p>
            <ul className="list-disc list-inside mt-1 pl-8 text-sm">
                <li><strong className="text-green-700">Resultado BOM:</strong> Ver uma página de erro do Google com a mensagem "Script function not found: doGet". Isso confirma que a URL está online e acessível.</li>
                <li><strong className="text-red-700">Resultado RUIM:</strong> Ver uma página de login do Google ou um erro de "permissão negada". Isso significa que as permissões de acesso na implantação estão incorretas (veja o próximo passo).</li>
            </ul>
          </li>
          <li>
            <strong>Verifique as Permissões de Acesso (Causa Comum):</strong>
            <p className="pl-4 text-sm text-gray-600">Na implantação do seu Google Apps Script, a opção <strong>"Quem pode acessar"</strong> deve estar configurada como <strong>"Qualquer pessoa"</strong>. Esta é a causa mais comum de falhas de conexão.</p>
          </li>
          <li>
            <strong>Verifique a Conexão com a Internet:</strong>
             <p className="pl-4 text-sm text-gray-600">Assegure-se de que você está conectado à internet.</p>
          </li>
        </ul>
      ),
    };
  }

  // Cenário 2: O backend retornou um erro (ex: Ação desconhecida, HTML em vez de JSON)
  if (errorMessage.toLowerCase().includes('unexpected token') || errorMessage.includes('JSON') || errorMessage.includes('Ação desconhecida')) {
     return {
      title: 'Erro na Resposta do Backend',
      details: (
        <>
          <p>O seu backend (Google Apps Script) parece estar desatualizado ou retornou uma resposta inesperada. Isso acontece quando o aplicativo é atualizado com novas funções que o script antigo não reconhece.</p>
           <p className="mt-2 text-sm text-gray-500"><strong>Detalhe técnico:</strong> <code>{errorMessage}</code></p>
        </>
      ),
      troubleshootingSteps: (
        <div className="text-left">
            <p className="font-semibold text-gray-800">Solução (Obrigatória):</p>
            <ul className="list-decimal list-inside space-y-3 mt-2">
            <li>
                <strong>Atualize o Código do Backend:</strong>
                <p className="pl-4 text-sm text-gray-600">
                    Vá para o arquivo <code>README.md</code> do projeto. Na "Parte 2: Configurar o Backend", copie o <strong>bloco de código completo</strong> fornecido para o `Code.gs`.
                </p>
            </li>
            <li>
                <strong>Substitua o Código Antigo:</strong>
                <p className="pl-4 text-sm text-gray-600">
                    Cole este novo código no seu editor do Google Apps Script, <strong>substituindo todo o conteúdo existente</strong>.
                </p>
            </li>
            <li>
                <strong>Crie uma Nova Implantação:</strong>
                <p className="pl-4 text-sm text-gray-600">
                    Após colar o novo código, clique em "Implantar" {'>'} "Gerenciar implantações". Edite sua implantação ativa e selecione <strong>"Nova versão"</strong> antes de implantar novamente.
                </p>
            </li>
            </ul>
        </div>
      ),
    };
  }

  // Cenário 3: Erro genérico da API
  return {
    title: 'Erro Inesperado na API',
    details: (
        <>
         <p>Ocorreu um erro durante a comunicação com a API. Verifique os detalhes abaixo.</p>
         <p className="mt-2 text-sm text-gray-500"><strong>Mensagem:</strong> <code>{errorMessage}</code></p>
        </>
    ),
    troubleshootingSteps: (
         <ul className="list-decimal list-inside space-y-4 text-left">
           <li>
            <strong>Verifique o Código do Backend (`Code.gs`):</strong>
            <p className="pl-4 text-sm text-gray-600">
                Garanta que o código no seu editor do Apps Script é uma cópia <strong>exata</strong> do código fornecido no arquivo <code>README.md</code>. Um script desatualizado pode causar erros inesperados.
            </p>
          </li>
           <li>Siga as mesmas etapas de verificação para "Erro de Conexão" e "Erro na Resposta do Backend".</li>
        </ul>
    ),
  };
};