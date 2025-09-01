import React from 'react';
import Modal from './Modal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guia Rápido da Fábrica de Ideias">
      <div className="space-y-6 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Visão Geral do Portfólio</h3>
          <p>
            Esta é a sua central de comando. Aqui você encontra um resumo do número total de ideias, a quantidade de clusters estratégicos e a variedade de modelos de negócio. O gráfico principal mostra como as ideias estão distribuídas, ajudando a identificar rapidamente as áreas de maior e menor foco.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-brand-dark mb-2">Análise de Clusters</h3>
          <p>
            Cada cluster representa uma categoria estratégica para a inovação. Nesta seção, você pode explorar a proposta de valor e as principais necessidades que cada cluster busca resolver. Use isso como inspiração ao criar novas ideias ou para entender melhor o posicionamento de cada serviço.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Gerador de Ideias</h3>
          <p>
            O ponto de partida para a inovação. Use este formulário para cadastrar novas ideias de serviço de forma estruturada. Preencha o nome, o benefício principal, o público-alvo, o modelo de negócio e associe a ideia a um cluster estratégico. As ideias cadastradas aqui aparecerão instantaneamente nas outras seções.
          </p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-brand-dark mb-2">Priorização de Ideias</h3>
           <p>
            O coração estratégico da ferramenta. Nesta tabela, você e sua equipe podem atribuir notas (de 0 a 5) para cada ideia com base nos critérios definidos (Alinhamento, Valor para o Cliente, etc.). As ideias são automaticamente ranqueadas pela pontuação total, facilitando a tomada de decisão sobre quais propostas devem avançar.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Buscador de Ideias</h3>
           <p>
            Sua base de conhecimento completa. Aqui você pode visualizar, filtrar e pesquisar todas as ideias cadastradas no portfólio. Use os filtros para encontrar ideias por cluster, modelo de negócio, classificação ou status. Você também pode editar ou excluir ideias diretamente a partir daqui.
          </p>
        </div>

        <div className="text-center pt-4">
            <button
            onClick={onClose}
            className="bg-brand-mid text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HelpModal;