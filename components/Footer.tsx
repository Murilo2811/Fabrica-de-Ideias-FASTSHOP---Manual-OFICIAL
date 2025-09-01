
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-brand-dark to-brand-mid text-white p-6 text-center mt-12">
      <p>&copy; {new Date().getFullYear()} Análise de Portfólio de Serviços. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;