export interface Criterion {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  subCriteria: string[];
}

export const criteriaData: Criterion[] = [
  {
    id: 1,
    title: 'Alinhamento Estratégico e Propósito da Marca',
    shortTitle: 'Alinhamento',
    description: 'Avalia o quanto a ideia está conectada com a missão, visão e posicionamento premium da Fast Shop, reforçando a imagem da marca e facilitando a vida do cliente.',
    subCriteria: [
      'Conexão com a Missão e Visão: A ideia contribui para "Encantar e Cuidar dos Clientes, Colaboradores e do Planeta por toda a vida" e para "Conquistar 1MM de Fãs"?',
      'Posicionamento Premium: O serviço reforça a imagem da Fast Shop como "a marca mais desejada" e "referência em experiência premium no varejo"?',
      'Facilitação da Vida Diária: A proposta realmente "facilita a vida das pessoas no dia a dia (mais fácil, mais divertido e ganhar tempo)", conforme a necessidade central dos clientes?',
      'Inovação e Pioneirismo: O serviço tem potencial para ser algo "lançado primeiro e bem feito" pela Fast Shop, demonstrando "Inovação" e "Curadoria" da marca?',
    ],
  },
  {
    id: 2,
    title: 'Potencial de Geração de Valor para o Cliente',
    shortTitle: 'Valor Cliente',
    description: 'Mede a eficácia da ideia em resolver dores reais e recorrentes dos clientes, superar expectativas e oferecer soluções personalizadas que criem encantamento e fortaleçam o relacionamento.',
    subCriteria: [
      'Resolução de Dores Reais: Quão eficaz a ideia é em resolver uma ou mais das dores críticas e recorrentes expressas pelos clientes na pesquisa?',
      'Criação de "Ganhos" e Encantamento: O serviço oferece benefícios claros e tangíveis que superam as expectativas, transformando clientes em "fãs"?',
      'Personalização e Relevância: A solução pode ser adaptada para atender às necessidades individuais dos clientes, entregando "soluções personalizadas"?',
    ],
  },
  {
    id: 3,
    title: 'Potencial de Impacto no Faturamento e Rentabilidade',
    shortTitle: 'Impacto Fin.',
    description: 'Analisa o potencial da ideia em gerar receita, especialmente recorrente, aumentar o ticket médio e contribuir para a margem operacional da empresa, alinhado à meta de R$ 1 bilhão em serviços.',
    subCriteria: [
      'Contribuição para a Meta de R$ 1 Bilhão em Serviços: Qual a projeção de receita direta que este serviço pode gerar?',
      'Geração de Receita Recorrente: O modelo permite a criação de um fluxo de receita previsível (assinaturas, mensalidades)?',
      'Impacto no Ticket Médio e Vendas Adicionais: O serviço impulsiona o cross-sell/upsell de outros produtos e serviços?',
      'Rentabilidade e Eficiência: O serviço possui uma margem de lucro atrativa e pode ser operado de forma eficiente?',
    ],
  },
  {
    id: 4,
    title: 'Viabilidade e Capacidade de Execução',
    shortTitle: 'Viabilidade',
    description: 'Avalia a complexidade de implementação da ideia, os recursos necessários (capital, tecnologia, talentos) e o tempo estimado para o lançamento no mercado.',
    subCriteria: [
      'Complexidade de Implementação: Qual o nível de dificuldade (tecnológica, operacional, cultural) para desenvolver e integrar o serviço?',
      'Recursos Necessários: A Fast Shop possui (ou pode adquirir) o capital, a tecnologia e os talentos necessários?',
      'Tempo para o Mercado (Time to Market): Qual a agilidade possível para lançar o serviço e começar a gerar valor e aprendizado?',
    ],
  },
  {
    id: 5,
    title: 'Diferenciação e Vantagem Competitiva',
    shortTitle: 'Vantagem Comp.',
    description: 'Mede o grau de inovação e exclusividade da ideia em comparação com o mercado, e como ela alavanca os pontos fortes da marca Fast Shop para criar barreiras de entrada para a concorrência.',
    subCriteria: [
      'Caráter Inovador e Exclusividade: O serviço oferece algo verdadeiramente novo ou significativamente melhor do que o que já existe no mercado?',
      'Alavancagem dos Atributos da Marca: O serviço capitaliza os pontos fortes da Fast Shop (Confiança, Curadoria, Atendimento) que os concorrentes teriam dificuldade em replicar?',
      'Defensibilidade no Mercado: O serviço cria barreiras de entrada para a concorrência, protegendo a posição da Fast Shop como líder?',
    ],
  },
];
