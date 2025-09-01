
import React, { useState, forwardRef, useMemo, useEffect } from 'react';
import type { Service, ServiceStatus } from '../types';
import Section from './Section';
import Loader from './Loader';
import { useServices } from '../contexts/ServicesContext';
import { criteriaData } from '../data/criteriaData';
import Pagination from './Pagination';

interface PrioritizationSectionProps {}

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: string;
  direction: SortDirection;
}

type SavingState = {
  [serviceId: number]: {
    [field: string]: boolean;
  };
};

const getClassification = (score: number) => {
  if (score >= 21) return { text: 'Altíssima', color: 'bg-green-600 text-white' };
  if (score >= 16) return { text: 'Alta', color: 'bg-blue-500 text-white' };
  if (score >= 11) return { text: 'Média', color: 'bg-yellow-400 text-gray-800' };
  return { text: 'Baixa', color: 'bg-red-500 text-white' };
};

const statusDisplayMap: Record<ServiceStatus, string> = {
    'avaliação': 'Avaliação',
    'aprovada': 'Aprovada',
    'cancelada': 'Cancelada',
    'finalizada': 'Finalizada',
};
const statusOptions: ServiceStatus[] = ['avaliação', 'aprovada', 'cancelada', 'finalizada'];


const SortableHeader: React.FC<{
    title: string;
    sortKey: string;
    onSort: (key: string) => void;
    sortConfig: SortConfig | null;
    className?: string;
    isText?: boolean;
}> = ({ title, sortKey, onSort, sortConfig, className = '', isText = false }) => {
    const isSorted = sortConfig?.key === sortKey;
    const directionIcon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';

    return (
        <th className={`px-2 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider ${isText ? 'text-left' : 'text-center'}`}>
            <button
                onClick={() => onSort(sortKey)}
                className={`font-bold text-gray-600 uppercase tracking-wider hover:text-brand-dark focus:outline-none flex items-center gap-1 w-full ${isText ? 'justify-start' : 'justify-center'}`}
                title={`Ordenar por ${title}`}
            >
                <span>{title}</span>
                {isSorted && <span className="text-xs">{directionIcon}</span>}
            </button>
        </th>
    );
};


const RankingTable: React.FC<{
  data: (Service & { total: number })[];
  onUpdateService: (service: Service) => Promise<void>;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  pageStartIndex: number;
}> = ({ data, onUpdateService, sortConfig, onSort, pageStartIndex }) => {
  
  const [localServices, setLocalServices] = useState(data);
  const [savingState, setSavingState] = useState<SavingState>({});

  React.useEffect(() => {
    setLocalServices(data);
  }, [data]);

  const handleFieldChange = (id: number, field: string, value: number) => {
    setLocalServices(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (field.startsWith('score_')) {
            const index = parseInt(field.split('_')[1], 10);
            const newScores = [...item.scores];
            newScores[index] = value;
            return { ...item, scores: newScores };
          }
          if (field === 'revenue') {
            return { ...item, revenueEstimate: value };
          }
        }
        return item;
      })
    );
  };
  
  const handleUpdate = async (id: number, field: string) => {
    const serviceToUpdate = localServices.find(s => s.id === id);
    if (serviceToUpdate) {
        setSavingState(prev => ({...prev, [id]: {...prev[id], [field]: true}}));
        try {
            await onUpdateService(serviceToUpdate);
        } catch (error) {
            // Error is handled by context notification, just need to reset saving state
        } finally {
            setSavingState(prev => ({...prev, [id]: {...prev[id], [field]: false}}));
        }
    }
  };

  const handleStatusChange = async (id: number, status: ServiceStatus) => {
    const serviceToUpdate = localServices.find(s => s.id === id);
    if(serviceToUpdate) {
        const updatedService = { ...serviceToUpdate, status };
        setLocalServices(prev => prev.map(s => s.id === id ? updatedService : s));
        await onUpdateService(updatedService);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rank</th>
            <SortableHeader title="Ideia de Serviço" sortKey="service" onSort={onSort} sortConfig={sortConfig} isText />
            {criteriaData.map((criterion, i) => (
              <SortableHeader key={criterion.id} title={criterion.shortTitle} sortKey={`score_${i}`} onSort={onSort} sortConfig={sortConfig} />
            ))}
            <SortableHeader title="Est. Faturamento" sortKey="revenueEstimate" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader title="Total" sortKey="total" onSort={onSort} sortConfig={sortConfig} />
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Classificação</th>
            <SortableHeader title="Status" sortKey="status" onSort={onSort} sortConfig={sortConfig} />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {localServices.map((item, index) => {
            const total = item.scores.reduce((acc, val) => acc + (val || 0), 0);
            const classification = getClassification(total);
            return (
              <tr key={item.id}>
                <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-gray-700">{pageStartIndex + index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap"><div className="font-semibold text-gray-900">{item.service}</div><div className="text-xs text-gray-500">ID: {item.id}</div></td>
                {item.scores.map((score, i) => {
                    const fieldName = `score_${i}`;
                    const isSaving = savingState[item.id]?.[fieldName];
                    return (
                      <td key={i} className="px-2 py-3 whitespace-nowrap text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={score}
                          onChange={(e) => handleFieldChange(item.id, fieldName, Math.max(0, Math.min(5, Number(e.target.value))))}
                          onBlur={() => handleUpdate(item.id, fieldName)}
                          disabled={isSaving}
                          className={`w-14 text-center rounded-md border-gray-300 p-1 focus:border-brand-mid focus:ring-brand-mid ${isSaving ? 'bg-gray-200 animate-pulse' : ''}`}
                        />
                      </td>
                    )
                })}
                <td className="px-2 py-3 whitespace-nowrap text-center">
                    {(() => {
                        const fieldName = 'revenue';
                        const isSaving = savingState[item.id]?.[fieldName];
                        return (
                            <input
                                type="number"
                                min="0"
                                value={item.revenueEstimate || ''}
                                onChange={(e) => handleFieldChange(item.id, fieldName, Number(e.target.value))}
                                onBlur={() => handleUpdate(item.id, fieldName)}
                                disabled={isSaving}
                                className={`w-28 text-center rounded-md border-gray-300 p-1 focus:border-brand-mid focus:ring-brand-mid ${isSaving ? 'bg-gray-200 animate-pulse' : ''}`}
                                placeholder="R$"
                            />
                        )
                    })()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-gray-800">{total}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`py-1 px-3 rounded-full font-semibold text-xs uppercase ${classification.color}`}>{classification.text}</span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <select
                    value={item.status || 'avaliação'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as ServiceStatus)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white p-1"
                    style={{ minWidth: '120px' }}
                  >
                    {statusOptions.map(status => <option key={status} value={status}>{statusDisplayMap[status]}</option>)}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};


const PrioritizationSection = forwardRef<HTMLElement, PrioritizationSectionProps>((props, ref) => {
  const { services, updateService, downloadCSV, refreshData, isRefreshing } = useServices();
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'total', direction: 'descending' });
  const [filters, setFilters] = useState({ cluster: 'all', classification: 'all', status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const uniqueClusters = useMemo(() => [...new Set(services.map(s => s.cluster).filter(Boolean))].sort(), [services]);
  const classificationOptions = ['Altíssima', 'Alta', 'Média', 'Baixa'];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value}));
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      const isSameKey = prevConfig?.key === key;
      const newDirection = isSameKey && prevConfig.direction === 'descending' ? 'ascending' : 'descending';
      return { key, direction: newDirection };
    });
  };

  const processedData = useMemo(() => {
    let filteredServices = services
      .map(service => ({
        ...service,
        total: service.scores.reduce((acc, val) => acc + (val || 0), 0),
      }));
      
    // Apply filters
    if (filters.cluster !== 'all') {
      filteredServices = filteredServices.filter(s => s.cluster === filters.cluster);
    }
    if (filters.status !== 'all') {
      filteredServices = filteredServices.filter(s => (s.status || 'avaliação') === filters.status);
    }
    if (filters.classification !== 'all') {
      filteredServices = filteredServices.filter(s => getClassification(s.total).text === filters.classification);
    }
      
    // Apply sorting
    if (sortConfig) {
      filteredServices.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key.startsWith('score_')) {
          const index = parseInt(sortConfig.key.split('_')[1], 10);
          aValue = a.scores[index] ?? 0;
          bValue = b.scores[index] ?? 0;
        } else {
          aValue = a[sortConfig.key as keyof typeof a];
          bValue = b[sortConfig.key as keyof typeof b];
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
           if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
           if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredServices;
  }, [services, filters, sortConfig]);
  
  const totalPages = useMemo(() => Math.ceil(processedData.length / itemsPerPage), [processedData]);

  const paginatedData = useMemo(() => {
    return processedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [processedData, currentPage]);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  const isLoading = isRefreshing;

  return (
    <Section
      ref={ref}
      id="prioritization"
      title="Priorização de Ideias"
      subtitle="Atribua notas para cada ideia com base nos critérios estratégicos. Clique nos cabeçalhos da tabela para ordenar os resultados."
    >
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <button onClick={refreshData} disabled={isLoading} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50">
            Sincronizar Dados
          </button>
          <button onClick={downloadCSV} disabled={services.length === 0} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Baixar Planilha Completa
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-6 border-y bg-gray-50/50 rounded-lg">
            <div>
                <label htmlFor="cluster-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cluster</label>
                <select id="cluster-filter" name="cluster" value={filters.cluster} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white">
                    <option value="all">Todos os Clusters</option>
                    {uniqueClusters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="classification-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Classificação</label>
                <select id="classification-filter" name="classification" value={filters.classification} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white">
                    <option value="all">Todas as Classificações</option>
                    {classificationOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status</label>
                <select id="status-filter" name="status" value={filters.status} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white">
                    <option value="all">Todos os Status</option>
                    {statusOptions.map(s => <option key={s} value={s}>{statusDisplayMap[s]}</option>)}
                </select>
            </div>
        </div>

        {isRefreshing && <Loader text="Sincronizando com a base de dados..." />}
        
        {!isLoading && processedData.length > 0 && (
          <>
            <RankingTable 
              data={paginatedData} 
              onUpdateService={updateService}
              sortConfig={sortConfig}
              onSort={handleSort}
              pageStartIndex={(currentPage - 1) * itemsPerPage}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        {!isLoading && processedData.length === 0 && (
             <p className="text-center text-gray-500 py-8">Nenhuma ideia encontrada para os filtros selecionados.</p>
        )}
      </div>
    </Section>
  );
});

export default PrioritizationSection;
