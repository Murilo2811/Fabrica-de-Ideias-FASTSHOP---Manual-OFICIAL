
import React, { useState, forwardRef, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ReferenceLine, Label
} from 'recharts';
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

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs animate-fade-in">
        <p className="font-bold text-brand-dark truncate">{data.service}</p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>{criteriaData[1].shortTitle}:</strong> {data.valorCliente}
        </p>
        <p className="text-sm text-gray-600">
          <strong>{criteriaData[3].shortTitle}:</strong> {data.viabilidade}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Pontuação Total:</strong> {data.total}
        </p>
      </div>
    );
  }
  return null;
};

// Prioritization Matrix component (Scatter Plot)
const PrioritizationMatrix: React.FC<{ data: (Service & { total: number })[] }> = ({ data }) => {
  const chartData = useMemo(() => data.map(service => ({
    ...service,
    viabilidade: service.scores[3] || 0, // Index 3 is Viability
    valorCliente: service.scores[1] || 0, // Index 1 is Customer Value
  })), [data]);

  return (
    <div className="w-full h-[500px] bg-gray-50/50 p-4 rounded-lg border my-6 relative">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-80px)] h-[calc(100%-80px)] grid grid-cols-2 grid-rows-2 gap-0 pointer-events-none z-0">
        <div className="flex items-end justify-start p-2"><span className="text-xs font-semibold text-gray-400 bg-white/70 px-2 py-1 rounded">A Questionar</span></div>
        <div className="flex items-end justify-end p-2 text-right"><span className="text-xs font-semibold text-gray-400 bg-white/70 px-2 py-1 rounded">Apostar</span></div>
        <div className="flex items-start justify-start p-2"><span className="text-xs font-semibold text-gray-400 bg-white/70 px-2 py-1 rounded">Possível</span></div>
        <div className="flex items-start justify-end p-2 text-right"><span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Executar</span></div>
      </div>
       <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="viabilidade" 
            name={criteriaData[3].shortTitle} 
            domain={[0, 5.2]} 
            ticks={[0, 1, 2, 3, 4, 5]}
          >
             <Label value="Viabilidade" offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="valorCliente" 
            name={criteriaData[1].shortTitle} 
            domain={[0, 5.2]} 
            ticks={[0, 1, 2, 3, 4, 5]}
          >
            <Label value="Valor para o Cliente" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} offset={-5} />
          </YAxis>
          <ZAxis type="number" dataKey="total" range={[40, 300]} name="Pontuação Total" />
          
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          
          <ReferenceLine y={2.5} stroke="#A0AEC0" strokeDasharray="4 4" />
          <ReferenceLine x={2.5} stroke="#A0AEC0" strokeDasharray="4 4" />
          
           <Scatter data={chartData} fill="#2D3748" className="transition-opacity hover:opacity-100 opacity-70" shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
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

interface RankingTableProps {
  data: (Service & { total: number })[];
  onServiceChange: (service: Service) => void;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  pageStartIndex: number;
  modifiedServiceIds: number[];
}

const RankingTable: React.FC<RankingTableProps> = ({ data, onServiceChange, sortConfig, onSort, pageStartIndex, modifiedServiceIds }) => {
  const [localServices, setLocalServices] = useState(data);

  React.useEffect(() => {
    setLocalServices(data);
  }, [data]);

  const handleLocalChange = (id: number, field: keyof Service | `score_${number}`, value: any) => {
    let changedService: Service | undefined;
    
    const newLocalServices = localServices.map(s => {
      if (s.id === id) {
        const updatedService = { ...s };
        if (typeof field === 'string' && field.startsWith('score_')) {
          const index = parseInt(field.split('_')[1], 10);
          const newScores = [...updatedService.scores];
          newScores[index] = Math.max(0, Math.min(5, Number(value)));
          updatedService.scores = newScores;
        } else if (field === 'revenueEstimate') {
            updatedService.revenueEstimate = Number(value) >= 0 ? Number(value) : 0;
        }
        else {
          (updatedService as any)[field] = value;
        }
        changedService = updatedService;
        return updatedService;
      }
      return s;
    });

    setLocalServices(newLocalServices);
    
    if (changedService) {
      onServiceChange(changedService);
    }
  };

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
            const isModified = modifiedServiceIds.includes(item.id);

            return (
              <tr key={item.id} className={`${isModified ? 'bg-yellow-50' : ''} transition-colors`}>
                <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-gray-700">{pageStartIndex + index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap"><div className="font-semibold text-gray-900">{item.service}</div><div className="text-xs text-gray-500">ID: {item.id}</div></td>
                {item.scores.map((score, i) => (
                    <td key={i} className="px-2 py-3 whitespace-nowrap text-center">
                        <input
                            type="number"
                            min="0"
                            max="5"
                            value={score}
                            onChange={(e) => handleLocalChange(item.id, `score_${i}`, e.target.value)}
                            className="w-14 text-center rounded-md border-gray-300 p-1 focus:border-brand-mid focus:ring-brand-mid"
                        />
                    </td>
                ))}
                <td className="px-2 py-3 whitespace-nowrap text-center">
                    <input
                        type="number"
                        min="0"
                        value={item.revenueEstimate || ''}
                        onChange={(e) => handleLocalChange(item.id, 'revenueEstimate', e.target.value)}
                        className="w-28 text-center rounded-md border-gray-300 p-1 focus:border-brand-mid focus:ring-brand-mid"
                        placeholder="R$"
                    />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-gray-800">{total}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`py-1 px-3 rounded-full font-semibold text-xs uppercase ${classification.color}`}>{classification.text}</span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <select
                    value={item.status || 'avaliação'}
                    onChange={(e) => handleLocalChange(item.id, 'status', e.target.value as ServiceStatus)}
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
  const [showChart, setShowChart] = useState(false);
  const [modifiedServices, setModifiedServices] = useState<{ [id: number]: Service }>({});
  const [isSaving, setIsSaving] = useState(false);

  const uniqueClusters = useMemo(() => [...new Set(services.map(s => s.cluster).filter(Boolean))].sort(), [services]);
  const classificationOptions = ['Altíssima', 'Alta', 'Média', 'Baixa'];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (Object.keys(modifiedServices).length > 0) {
      if (!window.confirm('Você possui alterações não salvas. Mudar os filtros irá descartá-las. Deseja continuar?')) {
        return;
      }
      setModifiedServices({});
    }
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

  const handleServiceChange = (service: Service) => {
    setModifiedServices(prev => ({
      ...prev,
      [service.id]: service,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const updates = Object.values(modifiedServices);
    try {
      await Promise.all(updates.map(service => updateService(service)));
      setModifiedServices({});
    } catch (error) {
      console.error("Falha ao salvar alterações em massa", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (window.confirm('Tem certeza que deseja descartar todas as alterações não salvas? Esta ação não pode ser desfeita.')) {
        setModifiedServices({});
    }
  };

  const processedData = useMemo(() => {
    let filteredServices = services
      .map(service => ({
        ...service,
        total: service.scores.reduce((acc, val) => acc + (val || 0), 0),
      }));
      
    if (filters.cluster !== 'all') {
      filteredServices = filteredServices.filter(s => s.cluster === filters.cluster);
    }
    if (filters.status !== 'all') {
      filteredServices = filteredServices.filter(s => (s.status || 'avaliação') === filters.status);
    }
    if (filters.classification !== 'all') {
      filteredServices = filteredServices.filter(s => getClassification(s.total).text === filters.classification);
    }
      
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
  
  const totalPages = useMemo(() => Math.ceil(processedData.length / itemsPerPage), [processedData, itemsPerPage]);

  const paginatedData = useMemo(() => {
    return processedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [processedData, currentPage, itemsPerPage]);

  const paginatedDataWithModifications = useMemo(() => {
    // FIX: When retrieving a modified service, it was missing the calculated 'total' property, causing type errors.
    // This fix recalculates the 'total' for any modified service, ensuring data consistency.
    return paginatedData.map(service => {
      const modifiedService = modifiedServices[service.id];
      if (modifiedService) {
        return {
          ...modifiedService,
          total: modifiedService.scores.reduce((acc, val) => acc + (val || 0), 0),
        };
      }
      return service;
    });
  }, [paginatedData, modifiedServices]);

  const modifiedServiceIds = useMemo(() => Object.keys(modifiedServices).map(Number), [modifiedServices]);
  
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
      subtitle="Atribua notas para cada ideia com base nos critérios estratégicos. Use os filtros e a visualização gráfica para análise."
    >
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <button onClick={refreshData} disabled={isLoading || isSaving} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50">
            Sincronizar Dados
          </button>
           <button 
            onClick={() => setShowChart(!showChart)} 
            disabled={isSaving}
            className="bg-brand-mid text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            {showChart ? 'Ocultar Gráfico' : 'Visualizar Gráfico'}
          </button>
          <button onClick={downloadCSV} disabled={services.length === 0 || isSaving} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Baixar Planilha Completa
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-6 border-y bg-gray-50/50 rounded-lg">
            <div>
                <label htmlFor="cluster-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cluster</label>
                <select id="cluster-filter" name="cluster" value={filters.cluster} onChange={handleFilterChange} disabled={isSaving} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white disabled:opacity-50">
                    <option value="all">Todos os Clusters</option>
                    {uniqueClusters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="classification-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Classificação</label>
                <select id="classification-filter" name="classification" value={filters.classification} onChange={handleFilterChange} disabled={isSaving} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white disabled:opacity-50">
                    <option value="all">Todas as Classificações</option>
                    {classificationOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status</label>
                <select id="status-filter" name="status" value={filters.status} onChange={handleFilterChange} disabled={isSaving} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-mid focus:ring-brand-mid sm:text-sm bg-white disabled:opacity-50">
                    <option value="all">Todos os Status</option>
                    {statusOptions.map(s => <option key={s} value={s}>{statusDisplayMap[s]}</option>)}
                </select>
            </div>
        </div>

        {isRefreshing && <Loader text="Sincronizando com a base de dados..." />}
        
        {showChart && !isLoading && processedData.length > 0 && (
          <PrioritizationMatrix data={processedData} />
        )}

        {!isLoading && processedData.length > 0 && (
          <>
            <RankingTable 
              data={paginatedDataWithModifications} 
              onServiceChange={handleServiceChange}
              sortConfig={sortConfig}
              onSort={handleSort}
              pageStartIndex={(currentPage - 1) * itemsPerPage}
              modifiedServiceIds={modifiedServiceIds}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        {!isLoading && processedData.length === 0 && (
             <p className="text-center text-gray-500 py-8">Nenhuma ideia encontrada para os filtros selecionados.</p>
        )}
        
        {Object.keys(modifiedServices).length > 0 && (
          <div className="sticky bottom-6 mt-6 z-20 w-full flex justify-center animate-fade-in pointer-events-none">
            <div className="bg-brand-dark text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 pointer-events-auto">
                <span className="font-semibold text-lg">{Object.keys(modifiedServices).length}</span>
                <span className="text-base">{Object.keys(modifiedServices).length === 1 ? 'alteração não salva' : 'alterações não salvas'}</span>
                <button
                    onClick={handleDiscardChanges}
                    disabled={isSaving}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                    Descartar
                </button>
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? 'Salvando...' : 'Confirmar'}
                </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
});

export default PrioritizationSection;
