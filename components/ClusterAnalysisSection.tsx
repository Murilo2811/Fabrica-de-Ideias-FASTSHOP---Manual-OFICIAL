import React, { useState, useMemo, forwardRef } from 'react';
import Section from './Section';
import Modal from './Modal';
import { clusterData, Cluster } from '../data/clusterData';
import { useServices } from '../contexts/ServicesContext';
import { criteriaData } from '../data/criteriaData';
import { mapBusinessModel } from '../utils/businessModelMapper';
import type { Service, ServiceStatus } from '../types';

interface ClusterAnalysisSectionProps {
  highlightedClusterId?: string | null;
}

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

const ClusterCard: React.FC<{ title: string; valor: string; necessidades: string[] }> = ({ title, valor, necessidades }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col h-full">
    <h3 className="text-2xl font-bold text-brand-dark mb-3">{title}</h3>
    <p className="text-gray-600 mb-4 flex-grow">
      <strong>Proposta de Valor:</strong> {valor}
    </p>
    <div className="mt-auto">
      <h4 className="text-lg font-semibold text-gray-700 mb-2">Necessidades Principais:</h4>
      <ul className="list-disc ml-6 text-gray-600 space-y-1">
        {necessidades.map((need, index) => <li key={index}>{need}</li>)}
      </ul>
    </div>
  </div>
);

const ServiceDetailView: React.FC<{ service: Service; onBack: () => void; }> = ({ service, onBack }) => {
    const totalScore = service.scores.reduce((acc, score) => acc + (score || 0), 0);
    const revenueFormatted = (service.revenueEstimate || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div>
            <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-mid hover:text-brand-dark transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Voltar para a lista
            </button>
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
        </div>
    );
};

const ClusterAnalysisSection = forwardRef<HTMLElement, ClusterAnalysisSectionProps>(({ highlightedClusterId }, ref) => {
  const { services } = useServices();
  const [activeCluster, setActiveCluster] = useState<Cluster | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const ideasForCluster = useMemo(() => {
    if (!activeCluster) return [];
    return services.filter(s => s.cluster === activeCluster.shortTitle);
  }, [activeCluster, services]);

  const handleClusterClick = (cluster: Cluster) => {
    setActiveCluster(cluster);
  };
  
  const handleCloseModal = () => {
    setActiveCluster(null);
    setSelectedService(null);
  };

  const modalTitle = useMemo(() => {
    if (selectedService) return selectedService.service;
    if (activeCluster) return `Ideias do Cluster: ${activeCluster.shortTitle}`;
    return '';
  }, [activeCluster, selectedService]);

  return (
    <Section ref={ref} id="clusterAnalysis" title="Análise dos Clusters Estratégicos">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clusterData.map(cluster => {
            const isHighlighted = highlightedClusterId === cluster.id;
            const cardWrapperClasses = `
              rounded-xl transition-all duration-300 cursor-pointer
              ${isHighlighted 
                ? 'scale-105 ring-4 ring-brand-accent ring-offset-4 ring-offset-gray-100 shadow-2xl' 
                : 'hover:scale-105'}
            `;
            return (
              <div id={`cluster-card-${cluster.id}`} key={cluster.id} className={cardWrapperClasses} onClick={() => handleClusterClick(cluster)}>
                <ClusterCard {...cluster} />
              </div>
            );
        })}
      </div>

      {activeCluster && (
        <Modal isOpen={!!activeCluster} onClose={handleCloseModal} title={modalTitle}>
          {selectedService ? (
            <ServiceDetailView service={selectedService} onBack={() => setSelectedService(null)} />
          ) : (
            <div>
              {ideasForCluster.length > 0 ? (
                <ul className="space-y-2">
                  {ideasForCluster.map(service => (
                    <li key={service.id}>
                      <button 
                        onClick={() => setSelectedService(service)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-brand-light transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent"
                      >
                        <h4 className="font-semibold text-brand-dark">{service.service}</h4>
                        <p className="text-sm text-gray-600 truncate mt-1">{service.need}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma ideia foi cadastrada para este cluster ainda.</p>
              )}
            </div>
          )}
        </Modal>
      )}
    </Section>
  );
});

export default ClusterAnalysisSection;