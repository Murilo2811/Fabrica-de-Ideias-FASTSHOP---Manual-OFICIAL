
import React, { useState, useRef, useEffect } from 'react';
import { ServicesProvider, useServices } from './contexts/ServicesContext';

import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import OverviewSection from './components/OverviewSection';
import ClusterAnalysisSection from './components/ClusterAnalysisSection';
import IdeaGeneratorSection from './components/IdeaGeneratorSection';
import PrioritizationSection from './components/PrioritizationSection';
import ServiceExplorerSection from './components/ServiceExplorerSection';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Notification from './components/Notification';
import HelpModal from './components/HelpModal';

const App: React.FC = () => {
  return (
    <ServicesProvider>
      <MainAppContent />
    </ServicesProvider>
  );
};

const MainAppContent: React.FC = () => {
  const { isLoading, loadingMessage, appError, notification } = useServices();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [highlightedClusterId, setHighlightedClusterId] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const sections: { [key: string]: React.RefObject<HTMLElement> } = {
    overview: useRef<HTMLElement>(null),
    clusterAnalysis: useRef<HTMLElement>(null),
    ideaGenerator: useRef<HTMLElement>(null),
    prioritization: useRef<HTMLElement>(null),
    serviceExplorer: useRef<HTMLElement>(null),
  };
  
  useEffect(() => {
    const clearHighlight = () => setHighlightedClusterId(null);
    document.addEventListener('click', clearHighlight);
    return () => document.removeEventListener('click', clearHighlight);
  }, []);

  const handleNavigate = (sectionId: string) => {
    sections[sectionId].current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };
  
  const handleClusterNavigate = (clusterId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = document.getElementById(`cluster-card-${clusterId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedClusterId(clusterId);
        setActiveSection('clusterAnalysis');
    }
  };

  if (isLoading && !appError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Loader text={loadingMessage} />
      </div>
    );
  }

  if (appError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl text-center">
           <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4.998C12.962 3.667 11.038 3.667 10.268 4.998L3.33 16.002c-.77 1.333.162 3 1.732 3z" />
           </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{appError.title}</h2>
          <div className="mt-4 text-gray-600">{appError.details}</div>
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Como Resolver?</h3>
            {appError.troubleshootingSteps}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header onHelpClick={() => setIsHelpModalOpen(true)} />
      <NavigationBar onNavigate={handleNavigate} activeSection={activeSection} />

      <main className="container mx-auto p-4 md:p-8">
        <OverviewSection ref={sections.overview} onClusterClick={handleClusterNavigate} />
        <ClusterAnalysisSection ref={sections.clusterAnalysis} highlightedClusterId={highlightedClusterId} />
        <IdeaGeneratorSection ref={sections.ideaGenerator} />
        <PrioritizationSection ref={sections.prioritization} />
        <ServiceExplorerSection ref={sections.serviceExplorer} />
      </main>

      <Footer />

      {notification && <Notification message={notification.message} type={notification.type} />}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default App;