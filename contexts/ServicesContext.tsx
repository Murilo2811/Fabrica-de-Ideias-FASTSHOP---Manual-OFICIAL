
import React, { createContext, useState, useCallback, useEffect, useContext, ReactNode } from 'react';
import type { Service, ParsedError } from '../types';
import { getServices, addServiceToSheet, updateServiceInSheet, deleteServiceFromSheet } from '../services/googleSheetService';
import { sendToWebhook } from '../services/webhookService';
import { criteriaData } from '../data/criteriaData';
import { mapBusinessModel } from '../utils/businessModelMapper';
import { parseApiError } from '../utils/errorHandler';


type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  type: NotificationType;
  id: number;
}

interface ServicesContextType {
  services: Service[];
  isLoading: boolean;
  isRefreshing: boolean;
  loadingMessage: string;
  appError: ParsedError | null;
  notification: NotificationState | null;

  addService: (service: Omit<Service, 'id' | 'creationDate' | 'scores' | 'revenueEstimate'>) => Promise<void>;
  updateService: (updatedService: Service) => Promise<void>;
  deleteService: (idToDelete: number) => Promise<void>;
  downloadCSV: () => void;
  refreshData: () => void;
  triggerAutomation: (service: Service, message: string) => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Conectando ao banco de ideias...');
  const [appError, setAppError] = useState<ParsedError | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: NotificationType = 'info') => {
    const newNotification = { message, type, id: Date.now() };
    setNotification(newNotification);
    setTimeout(() => {
        setNotification(current => current?.id === newNotification.id ? null : current);
    }, 5000);
  };

  const fetchData = useCallback(async (message: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
    setAppError(null);
    try {
      const sheetServices = await getServices();
      const sanitizedServices = sheetServices.map(s => ({
        ...s,
        scores: Array.isArray(s.scores) ? s.scores : Array(criteriaData.length).fill(0),
      }));
      setServices(sanitizedServices);
    } catch (err: any) {
      console.error("Failed to load data from sheet:", err);
      setAppError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData('Conectando ao banco de ideias...');
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    setLoadingMessage('Atualizando ideias da planilha...');
    await fetchData('Atualizando ideias da planilha...');
    showNotification('Dados sincronizados com sucesso!', 'success');
    setIsRefreshing(false);
  }, [fetchData]);

  const addService = useCallback(async (service: Omit<Service, 'id' | 'creationDate' | 'scores' | 'revenueEstimate'>) => {
    try {
        const newService = await addServiceToSheet(service);
        const sanitizedNewService = {
          ...newService,
          scores: Array.isArray(newService.scores) ? newService.scores : Array(criteriaData.length).fill(0),
        };
        setServices(prevServices => [...prevServices, sanitizedNewService]);
        showNotification('Ideia adicionada com sucesso!', 'success');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        showNotification(`Falha ao adicionar a ideia: ${errorMessage}`, 'error');
        throw error;
    }
  }, []);

  const updateService = useCallback(async (updatedService: Service) => {
    try {
      await updateServiceInSheet(updatedService);
      setServices(prevServices =>
        prevServices.map(s => (s.id === updatedService.id ? updatedService : s))
      );
      showNotification('Ideia salva com sucesso!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showNotification(`Falha ao salvar a ideia: ${errorMessage}`, 'error');
      throw error;
    }
  }, []);

  const deleteService = useCallback(async (idToDelete: number) => {
    try {
      await deleteServiceFromSheet(idToDelete);
      setServices(prevServices => prevServices.filter(s => s.id !== idToDelete));
      showNotification('Ideia excluída com sucesso.', 'success');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        showNotification(`Falha ao excluir a ideia: ${errorMessage}`, 'error');
        throw error;
    }
  }, []);

  const downloadCSV = useCallback(() => {
    if (services.length === 0) {
        showNotification("Não há dados para baixar.", "info");
        return;
    }

    const headers = [
        'ID', 'Serviço', 'Benefício Principal', 'Público-Alvo', 'Cluster', 'Modelo de Negócio', 'Status',
        'Criador', 'Data de Criação',
        ...criteriaData.map(c => c.title), 'Estimativa Faturamento', 'Pontuação Total'
    ];

    const escapeAndQuote = (value: string | number | undefined): string => {
        if (value === null || value === undefined) return '';
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
    };

    const csvRows = services.map(service => {
        const total = service.scores.reduce((acc, val) => acc + (val || 0), 0);
        const rowData = [
            service.id,
            service.service,
            service.need,
            service.targetAudience || '',
            service.cluster,
            mapBusinessModel(service.businessModel),
            service.status || 'avaliação',
            service.creatorName || '',
            service.creationDate ? new Date(service.creationDate).toLocaleDateString('pt-BR') : '',
            ...service.scores,
            service.revenueEstimate || 0,
            total
        ];
        return rowData.map(escapeAndQuote).join(';');
    });

    const csvContent = [headers.join(';'), ...csvRows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ideias_priorizadas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Download da planilha iniciado.', 'success');
  }, [services]);

  const triggerAutomation = useCallback(async (service: Service, message: string) => {
    try {
      const payload = {
        idea: {
          id: service.id,
          name: service.service,
          description: service.need,
          cluster: service.cluster,
          businessModel: service.businessModel,
          targetAudience: service.targetAudience,
          status: service.status,
          creator: service.creatorName,
          creationDate: service.creationDate,
          scores: service.scores,
          totalScore: service.scores.reduce((a, b) => a + (b || 0), 0),
          revenueEstimate: service.revenueEstimate,
        },
        message: message,
        triggeredBy: 'FabricaDeIdeiasApp',
        timestamp: new Date().toISOString(),
      };
      await sendToWebhook(payload);
      showNotification('Ideia enviada para o fluxo de automação!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showNotification(`Falha ao acionar automação: ${errorMessage}`, 'error');
      throw error;
    }
  }, []);

  const value = {
    services,
    isLoading: isLoading && !isRefreshing,
    isRefreshing,
    loadingMessage,
    appError,
    notification,
    addService,
    updateService,
    deleteService,
    downloadCSV,
    refreshData,
    triggerAutomation,
  };

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServices = (): ServicesContextType => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};