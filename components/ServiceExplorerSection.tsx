

import React, { useState, useMemo, forwardRef, useEffect } from 'react';
import type { Service, ServiceStatus } from '../types';
import Section from './Section';
import { mapBusinessModel, businessModelCategories } from '../utils/businessModelMapper';
import Modal from './Modal';
import { clusterData } from '../data/clusterData';
import { useServices } from '../contexts/ServicesContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Pagination from './Pagination';
import { criteriaData } from '../data/criteriaData';


interface ServiceExplorerSectionProps {}

interface Filters {
  type: string;
  value: string;
  classification: string;
  status: string;
  searchText: string;
}

const getClassificationText = (score: number) => {
  if (score >= 21) return 'Altíssima';
  if (score >= 16) return 'Alta';
  if (score >= 11) return 'Média';
  return 'Baixa';
};

const statusDisplayMap: Record<ServiceStatus, string> = {
    'avaliação': 'Avaliação',
    'aprovada': 'Aprovada',
    'cancelada': 'Cancelada',
    'finalizada': 'Finalizada',
};
const statusColorMap: Record<ServiceStatus, string> = {
    'avaliação': 'bg-yellow-100 text-yellow-800',
    'aprovada': 'bg-green-100 text-green-800',
    'cancelada': 'bg-red-100 text-red-800',
    'finalizada': 'bg-blue-100 text-blue-800',
};
const statusOptions: ServiceStatus[] = ['avaliação', 'aprovada', 'cancelada', 'finalizada'];

const ServiceCard: React.FC<{
  service: Service;
  onDelete: (id: number) => Promise<void>;
  onEdit: (service: Service) => void;
  onView: (service: Service) => void;
}> = ({ service, onDelete, onEdit, onView }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`Tem certeza que deseja excluir a ideia "${service.service}"? Esta ação não pode ser desfeita.`)){
      setIsDeleting(true);
      try {
        await onDelete(service.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(service);
  };

  return (
    <div
      onClick={() => onView(service)}
      className={`bg-gray-50 p-4 rounded-lg shadow-md flex flex-col justify-between relative transform hover:-translate-y-1 transition-transform duration-200 cursor-pointer ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="absolute top-2 right-2 flex gap-1">
        <button onClick={handleEdit} disabled={isDeleting} className="p-1 rounded-full text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors disabled:opacity-50" title="Editar Ideia">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
        </button>
        <button onClick={handleDelete} disabled={isDeleting} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50" title="Excluir Ideia">
          {isDeleting ? (
            <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
          )}
        </button>
      </div>
      <div className="pr-12">
        <p className="text-xs font-semibold text-gray-500 mb-1">ID: {service.id}</p>
        <h4 className="text-lg font-bold text-brand-dark mb-2">{service.service}</h4>
        <p className="text-sm text-gray-700 mb-3 flex-grow">{service.need}</p>
      </div>
      <div className="mt-auto pt-2 border-t border-gray-200 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500"><strong>Cluster:</strong> {service.cluster}</p>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColorMap[service.status || 'avaliação']}`}>
              {statusDisplayMap[service.status || 'avaliação']}
          </span>
        </div>
        {service.targetAudience && (
          <p className="text-xs text-gray-500"><strong>Público:</strong> {service.targetAudience}</p>
        )}
        <p className="text-xs text-gray-500"><strong>Modelo:</strong> {mapBusinessModel(service.businessModel)}</p>
        {service.creatorName && (
          <p className="text-xs text-gray-500"><strong>Criador:</strong> {service.creatorName}</p>
        )}
        {service.creationDate && (
          <p className="text-xs text-gray-500"><strong>Criado em:</strong> {new Date(service.creationDate).toLocaleDateString('pt-BR')}</p>
        )}
      </div>
    </div>
  );
}

const EditServiceModal: React.FC<{
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => Promise<void>;
}> = ({ service, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (service && isOpen) {
      setFormData(service);
      setError(null);
    }
  }, [service, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev!, [name]: value }));
  };

  const handleSave = async () => {
    if (formData) {
      setIsSaving(true);
      setError(null);
      try {
        await onSave(formData);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao salvar. Tente novamente.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar: ${service.service}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="cluster" className="block text-sm font-medium text-gray-700">
            Cluster Estratégico
          </label>
          <select
            id="cluster"
            name="cluster"
            value={formData.cluster}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white"
          >
            {clusterData.map(c => <option key={c.id} value={c.shortTitle}>{c.shortTitle}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="businessModel" className="block text-sm font-medium text-gray-700">
            Modelo de Negócio
          </label>
          <select
            id="businessModel"
            name="businessModel"
            value={formData.businessModel}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white"
          >
            {businessModelCategories.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'avaliação'}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white"
          >
            {statusOptions.map(s => <option key={s} value={s}>{statusDisplayMap[s]}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700">
            Nome do Criador
          </label>
          <input
            type="text"
            id="creatorName"
            name="creatorName"
            value={formData.creatorName || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white"
          />
        </div>
        {formData.creationDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Criação
            </label>
            <p className="mt-1 text-sm text-gray-500 bg-gray-100 p-2 rounded-md">{new Date(formData.creationDate).toLocaleString('pt-BR')}</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md mt-4">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-mid text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const ViewDetailsModal: React.FC<{ service: Service; isOpen: boolean; onClose: () => void; }> = ({ service, isOpen, onClose }) => {
    if (!isOpen) return null;

    const totalScore = service.scores.reduce((acc, score) => acc + (score || 0), 0);
    const revenueFormatted = (service.revenueEstimate || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={service.service}>
            <div className="space-y-5">
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Benefício Principal</h4>
                    <p className="text-gray-800 mt-1">{service.need}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
                    <div><strong className="text-gray-600 block text-sm">Público-Alvo:</strong> {service.targetAudience}</div>
                    <div><strong className="text-gray-600 block text-sm">Modelo de Negócio:</strong> {mapBusinessModel(service.businessModel)}</div>
                    <div>
                        <strong className="text-gray-600 block text-sm">Status:</strong>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColorMap[service.status || 'avaliação']}`}>
                            {statusDisplayMap[service.status || 'avaliação']}
                        </span>
                    </div>
                    <div><strong className="text-gray-600 block text-sm">Criador:</strong> {service.creatorName || 'N/A'}</div>
                </div>
                 <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ranking de Priorização</h4>
                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                        {criteriaData.map((criterion, index) => (
                        <div key={criterion.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{criterion.shortTitle}</span>
                            <span className="font-bold text-lg text-brand-mid">{service.scores[index] || 0}</span>
                        </div>
                        ))}
                        <div className="flex justify-between items-center border-t pt-2 mt-2">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="font-bold text-xl text-brand-dark">{totalScore}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimativa Faturamento</h4>
                    <p className="text-gray-800 text-2xl font-bold mt-1">{revenueFormatted}</p>
                </div>
            </div>
        </Modal>
    );
};


const ServiceExplorerSection = forwardRef<HTMLElement, ServiceExplorerSectionProps>((props, ref) => {
  const { services, deleteService, updateService, downloadCSV } = useServices();
  const [filters, setFilters] = useLocalStorage<Filters>('serviceExplorerFilters', {
    type: 'all',
    value: '',
    classification: 'all',
    status: 'all',
    searchText: '',
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const filterOptions = useMemo(() => {
    if (filters.type === 'cluster') return [...new Set(services.map(s => s.cluster))].sort();
    if (filters.type === 'businessModel') return businessModelCategories;
    return [];
  }, [filters.type, services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Text search filter
      if (filters.searchText && !service.service.toLowerCase().includes(filters.searchText.toLowerCase())) {
        return false;
      }
      
      // Category filters
      if (filters.type === 'cluster' && filters.value && service.cluster !== filters.value) return false;
      if (filters.type === 'businessModel' && filters.value && mapBusinessModel(service.businessModel) !== filters.value) return false;
      
      if (filters.classification !== 'all') {
        const totalScore = service.scores.reduce((a, b) => a + b, 0);
        if (getClassificationText(totalScore) !== filters.classification) return false;
      }

      if (filters.status !== 'all') {
        const serviceStatus = service.status || 'avaliação';
        if (serviceStatus !== filters.status) return false;
      }
      return true;
    }).sort((a,b) => b.id - a.id); // Sort by most recent
  }, [services, filters]);
  
  const totalPages = useMemo(() => Math.ceil(filteredServices.length / itemsPerPage), [filteredServices]);

  const paginatedServices = useMemo(() => {
    return filteredServices.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredServices, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);


  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    if (newType === 'all') {
      setFilters({ ...filters, type: newType, value: '' });
    } else {
      const options = newType === 'cluster' 
        ? [...new Set(services.map(s => s.cluster))].sort() 
        : businessModelCategories;
      setFilters({ ...filters, type: newType, value: options[0] || '' });
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
  };

  const handleViewClick = (service: Service) => {
    setViewingService(service);
  };

  const handleCloseModal = () => {
    setEditingService(null);
    setViewingService(null);
  };

  return (
    <Section ref={ref} id="serviceExplorer" title="Buscador de Ideias de Serviços">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="border-b pb-4 mb-6">
            <div className="mb-4">
                <label htmlFor="search-text" className="block text-sm font-medium text-gray-700">Buscar por Nome da Ideia:</label>
                <input
                    id="search-text"
                    type="text"
                    value={filters.searchText}
                    onChange={e => setFilters({ ...filters, searchText: e.target.value })}
                    placeholder="Digite para pesquisar..."
                    className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700">Agrupar por:</label>
                    <select id="filter-type" value={filters.type} onChange={handleFilterTypeChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white">
                    <option value="all">Todos os Serviços</option>
                    <option value="cluster">Cluster</option>
                    <option value="businessModel">Modelo de Negócio</option>
                    </select>
                </div>
                <div className={filters.type === 'all' ? 'hidden' : ''}>
                    <label htmlFor="filter-value" className="block text-sm font-medium text-gray-700">Filtrar por:</label>
                    <select id="filter-value" value={filters.value} onChange={e => setFilters({...filters, value: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white" disabled={!filters.value}>
                    {filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-classification" className="block text-sm font-medium text-gray-700">Classificação:</label>
                    <select id="filter-classification" value={filters.classification} onChange={e => setFilters({...filters, classification: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white">
                    <option value="all">Todas</option>
                    <option value="Altíssima">Altíssima</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">Status:</label>
                    <select id="filter-status" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-mid focus:border-brand-mid sm:text-sm rounded-md shadow-sm bg-white">
                    <option value="all">Todos</option>
                    {statusOptions.map(s => <option key={s} value={s}>{statusDisplayMap[s]}</option>)}
                    </select>
                </div>
            </div>
             <div className="mt-4 flex justify-start">
                <button 
                  onClick={downloadCSV} 
                  disabled={services.length === 0} 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Baixar Planilha Completa
                </button>
            </div>
        </div>
        <div className="mb-6 text-sm text-gray-600">
          <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedServices.length > 0 ? (
            paginatedServices.map(service => <ServiceCard key={service.id} service={service} onDelete={deleteService} onEdit={handleEditClick} onView={handleViewClick} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full py-8">Nenhum serviço encontrado para os filtros selecionados.</p>
          )}
        </div>
        
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}

      </div>
      {editingService && (
        <EditServiceModal 
          isOpen={!!editingService}
          onClose={handleCloseModal}
          onSave={updateService}
          service={editingService}
        />
      )}
      {viewingService && (
        <ViewDetailsModal 
          isOpen={!!viewingService}
          onClose={() => setViewingService(null)}
          service={viewingService}
        />
      )}
    </Section>
  );
});

export default ServiceExplorerSection;