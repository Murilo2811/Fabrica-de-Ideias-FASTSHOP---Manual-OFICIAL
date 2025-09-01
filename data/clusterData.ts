export interface Cluster {
  id: string;
  shortTitle: string;
  title: string;
  valor: string;
  necessidades: string[];
}

export const clusterData: Cluster[] = [
  {
    id: "casa-inteligente-automacao",
    shortTitle: "Casa Inteligente",
    title: "1. Casa Inteligente & Automação do Lar",
    valor: "Transformar a casa em um ecossistema proativo e inteligente, utilizando automação e IA para otimizar rotinas, aumentar a segurança, gerenciar recursos e proporcionar conveniência.",
    necessidades: [
        "Gerenciar e automatizar tarefas diárias para liberar tempo.",
        "Monitorar e otimizar gastos de energia para economia e sustentabilidade.",
        "Garantir a segurança física da residência e a proteção contra ameaças digitais.",
        "Reabastecer consumíveis de forma programada e sem esforço.",
        "Sincronizar dispositivos para criar experiências de entretenimento imersivas."
    ]
  },
  {
    id: "suporte-tecnico-ciclo-vida",
    shortTitle: "Suporte Técnico",
    title: "2. Suporte Técnico & Ciclo de Vida do Produto",
    valor: "Garantir a performance, longevidade e conveniência de todos os produtos e sistemas, oferecendo um suporte completo que vai da instalação e configuração à manutenção preditiva e reparo.",
    necessidades: [
        "Resolver problemas técnicos e configurar aparelhos complexos rapidamente.",
        "Evitar falhas inesperadas e custos de reparo com manutenção proativa.",
        "Encontrar especialistas para instalação e adaptação de infraestrutura.",
        "Aprender a utilizar e extrair o máximo potencial dos dispositivos.",
        "Assegurar o funcionamento contínuo e a durabilidade dos produtos."
    ]
  },
  {
    id: "acesso-flexivel-experiencia",
    shortTitle: "Acesso Flexível",
    title: "3. Acesso Flexível & Modelos de Experiência",
    valor: "Democratizar o acesso a tecnologias e experiências de alto valor, permitindo o uso temporário, a experimentação e o upgrade de produtos de forma flexível e sem o alto custo da aquisição.",
    necessidades: [
        "Utilizar itens diversos temporariamente sem o custo da compra.",
        "Experimentar produtos de alto valor antes de decidir pela aquisição.",
        "Acessar equipamentos de ponta para eventos ou usos pontuais.",
        "Renovar dispositivos tecnológicos com custo reduzido e processo simplificado."
    ]
  },
  {
    id: "saude-bem-estar-familiar",
    shortTitle: "Saúde e Bem-Estar",
    title: "4. Saúde, Bem-Estar & Cuidado Familiar",
    valor: "Promover um ambiente doméstico mais saudável, seguro e adaptado às necessidades de cada membro da família, desde bebês e pets até idosos, através de tecnologia e serviços especializados.",
    necessidades: [
        "Monitorar a saúde, o bem-estar e a qualidade do ambiente doméstico.",
        "Adaptar a casa para garantir a segurança e autonomia de idosos ou pessoas com necessidades especiais.",
        "Gerenciar a rotina de alimentação e segurança de animais de estimação.",
        "Criar um ambiente seguro e monitorado para bebês e crianças.",
        "Organizar e projetar ambientes para maior funcionalidade e conforto."
    ]
  },
  {
    id: "varejo-servicos-financeiros",
    shortTitle: "Varejo e Finanças",
    title: "5. Inovação no Varejo & Serviços Financeiros",
    valor: "Facilitar a jornada de aquisição e fidelizar clientes com soluções financeiras, programas de troca e experiências de engajamento que tornam a tecnologia mais acessível e desejada.",
    necessidades: [
        "Acesso a crédito, parcelamento flexível ou consórcio para compras de alto valor.",
        "Garantir vantagens exclusivas e acesso prioritário a lançamentos.",
        "Testar jogos e equipamentos em um ambiente imersivo e social.",
        "Simplificar o processo de presentear amigos e familiares."
    ]
  },
  {
    id: "infraestrutura-parcerias-b2b",
    shortTitle: "Infra & B2B",
    title: "6. Infraestrutura & Parcerias (B2B/B2B2C)",
    valor: "Construir a base tecnológica para um lar conectado e oferecer soluções robustas para o mercado corporativo (B2B), garantindo conectividade, energia e uma rede de parceiros qualificados.",
    necessidades: [
        "Garantir uma rede de internet estável e eficiente para múltiplos dispositivos.",
        "Encontrar e contratar profissionais qualificados para serviços complexos.",
        "Atender às demandas tecnológicas e de serviços de clientes empresariais.",
        "Solucionar necessidades de infraestrutura para mobilidade elétrica."
    ]
  }
];
