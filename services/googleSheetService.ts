import type { Service, User } from '../types';

// ====================================================================================
// PASSO CRÍTICO DE CONFIGURAÇÃO: INSIRA A URL DO SEU BACKEND AQUI
// ====================================================================================
// Para conectar o aplicativo à sua Planilha Google, substitua o valor abaixo
// pela URL do seu Aplicativo Web do Google Apps Script que você copiou na etapa de implantação.
//
// Exemplo: 'https://script.google.com/macros/s/SUA_ID_UNICA_AQUI/exec'
//
// Se esta URL não for alterada, o aplicativo funcionará em MODO DE DEMONSTRAÇÃO com dados fictícios.
export const WEB_APP_URL: string = 'https://script.google.com/macros/s/AKfycbw3-1hNKtskLwMG2QjAMWieeEkue4gtwFzk6vt96idmUhJORyNIZ8YV7dF2dQ5_ROqs/exec';

// --- Funções de Mock para demonstração ---
// FIX: Add mock data and AuthResponse interface for authentication feature.
interface AuthResponse {
    user: User;
    token: string;
}
let mockUsers: User[] = [
    { id: '1', name: 'Usuário Demo', email: 'demo@example.com' },
];
const mockPasswords: { [email: string]: string } = {
    'demo@example.com': 'password123',
};
let nextUserId = 2;

let mockServices: Service[] = [
    { id: 1, service: "Consultoria de Casa Inteligente", need: "Ajuda para escolher e instalar dispositivos de casa inteligente compatíveis.", cluster: "Casa Inteligente", businessModel: "Consultoria", targetAudience: "Proprietários de casas", status: "aprovada", creatorName: "Ana", creationDate: "203-10-01T10:00:00Z", scores: [5, 4, 3, 5, 4], revenueEstimate: 150000 },
    { id: 2, service: "Plano de Suporte Técnico Premium", need: "Suporte técnico 24/7 para todos os eletrônicos da casa.", cluster: "Suporte Técnico", businessModel: "Assinatura/Recorrência", targetAudience: "Famílias com muitos dispositivos", status: "avaliação", creatorName: "Bruno", creationDate: "2023-10-02T11:30:00Z", scores: [4, 5, 5, 4, 3], revenueEstimate: 500000 },
    { id: 3, service: "Aluguel de Equipamentos de Realidade Virtual", need: "Acesso a equipamentos de VR de ponta para eventos ou uso casual.", cluster: "Acesso Flexível", businessModel: "Locação", targetAudience: "Gamers e planejadores de eventos", status: "avaliação", creatorName: "Carlos", creationDate: "2023-10-03T14:00:00Z", scores: [3, 4, 3, 4, 4], revenueEstimate: 80000 },
];
let nextId = mockServices.reduce((max, s) => Math.max(max, s.id), 0) + 1;

async function handleMockRequest(action: string, payload?: any): Promise<any> {
    return new Promise(resolve => {
        setTimeout(() => {
            try {
                switch (action) {
                    case 'getServices':
                        resolve({ success: true, data: [...mockServices] });
                        break;
                    case 'addService': {
                        const newService: Service = { ...payload.service, id: nextId++, creationDate: new Date().toISOString(), scores: Array(5).fill(0), revenueEstimate: 0, status: 'avaliação' };
                        mockServices.push(newService);
                        resolve({ success: true, data: newService });
                        break;
                    }
                    case 'updateService': {
                        const index = mockServices.findIndex(s => s.id === payload.service.id);
                        if (index > -1) { mockServices[index] = { ...mockServices[index], ...payload.service }; resolve({ success: true, data: mockServices[index] }); } 
                        else { throw new Error(`Serviço com id ${payload.service.id} não encontrado.`); }
                        break;
                    }
                    case 'deleteService': {
                        mockServices = mockServices.filter(s => s.id !== payload.id);
                        resolve({ success: true, data: { id: payload.id } });
                        break;
                    }
                    // FIX: Add mock handlers for login and register to resolve import errors.
                    case 'loginUser': {
                        const { email, password } = payload;
                        const user = mockUsers.find(u => u.email === email);
                        if (user && mockPasswords[email] === password) {
                            const response: AuthResponse = { user, token: `mock_token_${Date.now()}` };
                            resolve({ success: true, data: response });
                        } else {
                            throw new Error('Email ou senha inválidos.');
                        }
                        break;
                    }
                    case 'registerUser': {
                        const { name, email, password } = payload;
                        if (mockUsers.some(u => u.email === email)) {
                            throw new Error('Este email já está em uso.');
                        }
                        const newUser: User = { id: String(nextUserId++), name, email };
                        mockUsers.push(newUser);
                        mockPasswords[email] = password;
                        const response: AuthResponse = { user: newUser, token: `mock_token_${Date.now()}` };
                        resolve({ success: true, data: response });
                        break;
                    }
                    default:
                        throw new Error(`Ação de mock desconhecida: ${action}`);
                }
            } catch (e: any) {
                console.error("Mock API Error:", e);
                resolve({ success: false, error: e.message });
            }
        }, 300 + Math.random() * 400);
    });
}


export async function apiRequest<T>(action: string, payload?: object): Promise<T> {
    if (WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' || !WEB_APP_URL) {
        const mockResponse = await handleMockRequest(action, payload);
        if (mockResponse.success) return mockResponse.data as T;
        throw new Error(mockResponse.error || 'Ocorreu um erro no mock da API.');
    }

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action, payload }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na API: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.error || 'Ocorreu um erro desconhecido na API.');
        }
        return result.data as T;

    } catch (error: any) {
        console.error(`Falha na ação "${action}":`, error);
        throw new Error(`Não foi possível se comunicar com o servidor. Verifique sua conexão. Detalhes: ${error.message}`);
    }
}


// --- Funções de Serviço ---

const serviceToSheetData = (service: Partial<Service>) => ({
    id: service.id,
    service: service.service,
    need: service.need,
    cluster: service.cluster,
    businessModel: service.businessModel,
    targetAudience: service.targetAudience || '',
    status: service.status || 'avaliação',
    creatorName: service.creatorName || '',
    creationDate: service.creationDate || '',
    score_alinhamento: service.scores?.[0] ?? 0,
    score_valor_cliente: service.scores?.[1] ?? 0,
    score_impacto_fin: service.scores?.[2] ?? 0,
    score_viabilidade: service.scores?.[3] ?? 0,
    score_vantagem_comp: service.scores?.[4] ?? 0,
    revenue_estimate: service.revenueEstimate ?? 0,
});

export const getServices = (): Promise<Service[]> => apiRequest<Service[]>('getServices');
export const addServiceToSheet = (service: Omit<Service, 'id' | 'creationDate' | 'scores' | 'revenueEstimate'>): Promise<Service> => apiRequest<Service>('addService', { service });
export const updateServiceInSheet = (service: Service): Promise<Service> => apiRequest<Service>('updateService', { service: serviceToSheetData(service) });
export const deleteServiceFromSheet = (id: number): Promise<{ id: number }> => apiRequest<{ id: number }>('deleteService', { id });

// FIX: Export loginUser and registerUser functions to resolve import errors in AuthContext.
export const loginUser = (email: string, password: string): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('loginUser', { email, password });

export const registerUser = (name: string, email: string, password: string): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('registerUser', { name, email, password });