import type {
  AuthResponse,
  CrlvData,
  User,
  Vehicle,
  VehicleInput,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
const TOKEN_KEY = 'drivo.token';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export const tokenStorage = {
  get: () =>
    typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/** Chamado quando a API responde 401 (token expirado): o AuthProvider faz logout. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

/** Erros do Nest vêm como { message: string | string[] }. */
async function readErrorMessage(response: Response) {
  try {
    const body = await response.json();
    const message = Array.isArray(body.message)
      ? body.message[0]
      : body.message;
    if (typeof message === 'string' && message) return message;
  } catch {
    // corpo vazio ou não-JSON
  }
  return response.status === 413
    ? 'Arquivo maior que 10 MB'
    : 'Algo deu errado. Tente novamente';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = tokenStorage.get();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // FormData define o próprio Content-Type (com boundary)
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor', 0);
  }

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized?.();
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const json = (body: unknown) => JSON.stringify(body);

export const api = {
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: json(data) }),

  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: json(data),
    }),

  getProfile: () => request<User>('/users/me'),

  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>) =>
    request<User>('/users/me', { method: 'PATCH', body: json(data) }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<void>('/users/me/password', { method: 'PATCH', body: json(data) }),

  listVehicles: (search?: string) =>
    request<Vehicle[]>(
      `/vehicles${search ? `?search=${encodeURIComponent(search)}` : ''}`,
    ),

  getVehicle: (id: string) => request<Vehicle>(`/vehicles/${id}`),

  createVehicle: (data: VehicleInput) =>
    request<Vehicle>('/vehicles', { method: 'POST', body: json(data) }),

  updateVehicle: (id: string, data: Partial<VehicleInput>) =>
    request<Vehicle>(`/vehicles/${id}`, { method: 'PATCH', body: json(data) }),

  deleteVehicle: (id: string) =>
    request<void>(`/vehicles/${id}`, { method: 'DELETE' }),

  scanCrlv: (file: File) => {
    const body = new FormData();
    body.append('file', file);
    return request<CrlvData>('/crlv/scan', { method: 'POST', body });
  },
};