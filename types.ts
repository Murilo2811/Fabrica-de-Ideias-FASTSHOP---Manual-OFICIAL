
export type ServiceStatus = 'avaliação' | 'aprovada' | 'cancelada' | 'finalizada';

export interface Service {
  id: number;
  service: string;
  need: string;
  cluster: string;
  businessModel: string;
  targetAudience?: string;
  status?: ServiceStatus;
  creatorName?: string;
  creationDate?: string;
  // Propriedades do Ranking unificadas
  scores: number[];
  revenueEstimate?: number;
}

export interface ParsedError {
  title: string;
  details: React.ReactNode;
  troubleshootingSteps: React.ReactNode;
}

// FIX: Add User interface to resolve import error in AuthContext.
export interface User {
  id: string;
  name: string;
  email: string;
}
