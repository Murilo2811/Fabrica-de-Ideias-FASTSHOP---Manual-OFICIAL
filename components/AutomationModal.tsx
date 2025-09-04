import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Service } from '../types';
import { useServices } from '../contexts/ServicesContext';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const AutomationModal: React.FC<AutomationModalProps> = ({ isOpen, onClose, service }) => {
  const { triggerAutomation } = useServices();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMessage('');
      setIsSending(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!service) return;

    setIsSending(true);
    setError(null);
    try {
      await triggerAutomation(service, message);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Acionar Fluxo de Automação">
      <div className="space-y-4">
        <p className="text-gray-700">
          Você está prestes a enviar os dados da ideia <strong className="text-brand-dark">{service.service}</strong> para um fluxo de automação externo.
        </p>

        <div>
          <label htmlFor="automation-message" className="block text-sm font-medium text-gray-700">
            Mensagem Adicional (Opcional)
          </label>
          <textarea
            id="automation-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Adicione aqui qualquer informação extra para o fluxo de automação..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="bg-brand-mid text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : 'Enviar para Automação'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AutomationModal;
