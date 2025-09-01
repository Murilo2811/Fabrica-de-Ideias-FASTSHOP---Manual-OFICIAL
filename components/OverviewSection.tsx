
import React, { useMemo, forwardRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { Service } from '../types';
import Section from './Section';
import { mapBusinessModel } from '../utils/businessModelMapper';
import { useServices } from '../contexts/ServicesContext';
import { clusterData } from '../data/clusterData';


interface OverviewSectionProps {
  onClusterClick: (clusterId: string, event: React.MouseEvent) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; subtitle: string; color: string }> = ({ title, value, subtitle, color }) => (
  <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-lg h-full">
    <p className="text-2xl font-semibold text-gray-600 mb-2">{title}</p>
    <p className={`text-7xl font-bold ${color}`}>{value}</p>
    <p className="text-lg text-gray-500 mt-2">{subtitle}</p>
  </div>
);

const COLORS = ['#2D3748', '#4A5568', '#718096', '#A0AEC0', '#CBD5E0', '#E2E8F0'];

// Custom Legend Component
const CustomLegend = (props: any) => {
  const { payload, onClusterClick } = props;
  return (
    <ul className="flex flex-wrap justify-center list-none p-0 mt-4 text-sm gap-x-4 gap-y-2">
      {payload.map((entry: any, index: number) => {
        const clusterInfo = clusterData.find(c => c.shortTitle === entry.value);
        if (!clusterInfo) return null;
        return (
            <li
            key={`item-${index}`}
            onClick={(e) => onClusterClick(clusterInfo.id, e)}
            className="flex items-center cursor-pointer hover:opacity-75 transition-opacity"
            aria-label={`Ver detalhes do cluster ${entry.value}`}
            >
            <span className="w-3 h-3 block mr-2" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.value}</span>
            </li>
        )
        })}
    </ul>
  );
};


const OverviewSection = forwardRef<HTMLElement, OverviewSectionProps>(({ onClusterClick }, ref) => {
  const { services } = useServices();

  const { totalIdeas, totalClusters, totalBusinessModels, clusterDistribution } = useMemo(() => {
    const clusterCounts = services.reduce((acc, service) => {
      acc[service.cluster] = (acc[service.cluster] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const businessModelSet = new Set(services.map(s => mapBusinessModel(s.businessModel)));

    return {
      totalIdeas: services.length,
      totalClusters: Object.keys(clusterCounts).length,
      totalBusinessModels: businessModelSet.size,
      clusterDistribution: Object.entries(clusterCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    };
  }, [services]);

  return (
    <Section ref={ref} id="overview" title="Visão Geral do Portfólio">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <StatCard title="Total de Ideias" value={totalIdeas} subtitle="Serviços Analisados" color="text-brand-dark" />
        <StatCard title="Total de Clusters" value={totalClusters} subtitle="Categorias Estratégicas" color="text-brand-accent" />
        <StatCard title="Modelos de Negócio" value={totalBusinessModels} subtitle="Estratégias de Monetização" color="text-brand-mid" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-xl font-semibold text-center mb-2">Distribuição de Serviços por Cluster</h3>
        <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">Esta visualização mostra a concentração de ideias em cada cluster estratégico, destacando as áreas com maior volume de serviços propostos.</p>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={clusterDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  if (percent < 0.05) return '';
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {clusterDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} serviços`} />
              <Legend content={<CustomLegend onClusterClick={onClusterClick} />} wrapperStyle={{ position: 'relative' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Section>
  );
});

export default OverviewSection;