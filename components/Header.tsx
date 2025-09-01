
import React from 'react';

interface HeaderProps {
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="relative bg-gradient-to-br from-brand-dark to-brand-mid text-white p-8 md:p-12 text-center shadow-lg">
       <div className="absolute top-4 right-4">
        <button
          onClick={onHelpClick}
          className="bg-white/20 hover:bg-white/30 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Ajuda e Informações sobre o App"
        >
          <span className="text-2xl">?</span>
        </button>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Fábrica de Ideias - FASTSHOP</h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto">
        Uma plataforma interativa para análise, priorização e exploração de um portfólio de ideias de serviços inovadores.
      </p>
    </header>
  );
};

export default Header;