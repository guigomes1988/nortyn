export const CRM_CONFIG = {
  ENDPOINT: 'https://api.aguirratech.com/crm/v1/lead/incluir',
  TOKEN: 'org_3e5884714b767ae81dcabee80a43fb685663014163756e6c688214ef10ceac4c',
};

export const EQUIPE_VENDA_OPTIONS = [
  '0 - 2 vendedores',
  '3 - 5 vendedores',
  '6 - 10 vendedores',
  '11 - 20 vendedores',
  '20 - 30 vendedores',
  'Acima de 30 vendedores',
] as const;

export type EquipeVendaOption = (typeof EQUIPE_VENDA_OPTIONS)[number];

export interface LeadPayload {
  nome?: string;
  email?: string;
  fone: string;
  empresa?: string;
  cargo?: string;
  setor?: string;
  equipeVenda?: EquipeVendaOption | string;
  origem: 'institucional' | 'diagnostico';
}

export interface CrmResponse {
  traceId?: string;
  code?: number;
  timestamp?: string;
  apiVersion?: string;
  data?: {
    id?: string;
    [key: string]: any;
  };
  error?: string | string[];
}

export async function submitLead(payload: LeadPayload): Promise<CrmResponse> {
  const body: Record<string, string> = {
    fone: payload.fone,
    origem: payload.origem,
  };

  if (payload.nome && payload.nome.trim() !== '') {
    body.nome = payload.nome.trim();
  }
  if (payload.email && payload.email.trim() !== '') {
    body.email = payload.email.trim();
  }
  if (payload.empresa && payload.empresa.trim() !== '') {
    body.empresa = payload.empresa.trim();
  }
  if (payload.cargo && payload.cargo.trim() !== '') {
    body.cargo = payload.cargo.trim();
  }
  if (payload.setor && payload.setor.trim() !== '') {
    body.setor = payload.setor.trim();
  }

  // Envia equipeVenda somente se casar com as opções válidas
  if (
    payload.equipeVenda &&
    EQUIPE_VENDA_OPTIONS.includes(payload.equipeVenda as EquipeVendaOption)
  ) {
    body.equipeVenda = payload.equipeVenda;
  }

  const response = await fetch(CRM_CONFIG.ENDPOINT, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-org-token': CRM_CONFIG.TOKEN,
    },
    body: JSON.stringify(body),
  });

  const result: CrmResponse = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.join(', ')
      : result.error || `Erro ${response.status} ao processar o lead`;
    throw new Error(errorMsg);
  }

  return result;
}
