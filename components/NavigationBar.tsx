import React from 'react';

interface NavigationBarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

const NavItem: React.FC<{ sectionId: string; title: string; onNavigate: (id: string) => void; isActive: boolean }> = ({ sectionId, title, onNavigate, isActive }) => {
  const activeClasses = "text-brand-dark font-semibold border-b-2 border-brand-dark";
  const inactiveClasses = "text-gray-600 hover:text-brand-dark";
  return (
    <button
      onClick={() => onNavigate(sectionId)}
      className={`transition-colors px-4 py-2 rounded-t-md text-sm sm:text-base focus:outline-none ${isActive ? activeClasses : inactiveClasses}`}
    >
      {title}
    </button>
  );
};

const NavigationBar: React.FC<NavigationBarProps> = ({ onNavigate, activeSection }) => {
  const navItems = [
    { id: 'overview', title: 'Visão Geral' },
    { id: 'clusterAnalysis', title: 'Análise de Clusters' },
    { id: 'ideaGenerator', title: 'Gerador de Ideias' },
    { id: 'prioritization', title: 'Priorização de Ideias' },
    { id: 'serviceExplorer', title: 'Buscador de Ideias' },
  ];

  return (
    <nav className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-md z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <div className="overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {navItems.map(item => (
              <NavItem
                key={item.id}
                sectionId={item.id}
                title={item.title}
                onNavigate={onNavigate}
                isActive={activeSection === item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;