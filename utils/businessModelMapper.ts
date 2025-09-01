
export const businessModelCategories = [
    'Assinatura/Recorrência',
    'Pacote de Serviço',
    'Locação',
    'Consultoria',
    'Soluções B2B',
    'Financeiro/Benefício'
];

export const mapBusinessModel = (model: string): string => {
    const lowerCaseModel = model.toLowerCase();

    // First, check if the model is already a standard category (e.g., from the idea generator)
    if (businessModelCategories.includes(model)) {
        return model;
    }

    if (lowerCaseModel.includes("assinatura") || lowerCaseModel.includes("recorrência") || lowerCaseModel.includes("monitoramento")) return "Assinatura/Recorrência";
    if (lowerCaseModel.includes("pacote") || lowerCaseModel.includes("instalação") || lowerCaseModel.includes("reparo") || lowerCaseModel.includes("limpeza") || lowerCaseModel.includes("serviço de instalação") || lowerCaseModel.includes("venda de produto") || lowerCaseModel.includes("armazenamento")) return "Pacote de Serviço";
    if (lowerCaseModel.includes("locação") || lowerCaseModel.includes("crédito na compra")) return "Locação";
    if (lowerCaseModel.includes("consultoria") || lowerCaseModel.includes("atendimento consultivo") || lowerCaseModel.includes("venda de cursos") || lowerCaseModel.includes("personal") || lowerCaseModel.includes("comissão") || lowerCaseModel.includes("experiência") || lowerCaseModel.includes("curadoria")) return "Consultoria";
    if (lowerCaseModel.includes("b2b") || lowerCaseModel.includes("solução b2b") || lowerCaseModel.includes("pj")) return "Soluções B2B";
    if (lowerCaseModel.includes("financeiro") || lowerCaseModel.includes("indenização") || lowerCaseModel.includes("seguro") || lowerCaseModel.includes("oferta exclusiva")) return "Financeiro/Benefício";

    return "Pacote de Serviço"; // Fallback for any edge cases to ensure categorization.
};
