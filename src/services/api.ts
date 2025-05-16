import { toast } from 'react-hot-toast';
import {
  Category,
  CategoryFormData,
  Supplier,
  SupplierFormData,
  Product,
  ProductFormData,
  Order,
  OrderFormData,
  OrderItem,
  OrderItemFormData,
  Inventory,
  InventoryFormData

} from '../types';

const API_BASE_URL = 'https://backend-2dud.onrender.com/api';

// Generic fetch function with error handling
async function fetchFromAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // For DELETE and some PUT operations that return no content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred');
    }
    throw error;
  }
}

// Categories API
export const categoriesApi = {
  getAll: () => fetchFromAPI<Category[]>('/categorias'),
  getById: (id: number) => fetchFromAPI<Category>(`/categorias/${id}`),
  create: (data: CategoryFormData) => 
    fetchFromAPI<Category>('/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: CategoryFormData) =>
    fetchFromAPI<void>(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchFromAPI<void>(`/categorias/${id}`, {
      method: 'DELETE',
    }),
};

// Suppliers API
export const suppliersApi = {
  getAll: () => fetchFromAPI<Supplier[]>('/fornecedores'),
  getById: (id: number) => fetchFromAPI<Supplier>(`/fornecedores/${id}`),
  create: (data: SupplierFormData) =>
    fetchFromAPI<Supplier>('/fornecedores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: SupplierFormData) =>
    fetchFromAPI<void>(`/fornecedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchFromAPI<void>(`/fornecedores/${id}`, {
      method: 'DELETE',
    }),
};

// Products API
export const productsApi = {
  getAll: () => fetchFromAPI<Product[]>('/produtos'),
  getById: (id: number) => fetchFromAPI<Product>(`/produtos/${id}`),
  create: (data: ProductFormData) =>
    fetchFromAPI<Product>('/produtos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: ProductFormData) =>
    fetchFromAPI<void>(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchFromAPI<void>(`/produtos/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersApi = {
  getAll: () => fetchFromAPI<Order[]>('/pedidos'),
  getById: (id: number) => fetchFromAPI<Order>(`/pedidos/${id}`),
  create: (data: OrderFormData) =>
    fetchFromAPI<Order>('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: OrderFormData) =>
    fetchFromAPI<void>(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchFromAPI<void>(`/pedidos/${id}`, {
      method: 'DELETE',
    }),
};

// Order Items API
export const orderItemsApi = {
  getAll: () => fetchFromAPI<OrderItem[]>('/itenspedidos'),
  getById: (id: number) => fetchFromAPI<OrderItem>(`/itenspedidos/${id}`),
  create: (data: OrderItemFormData) =>
    fetchFromAPI<OrderItem>('/itenspedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: OrderItemFormData) =>
    fetchFromAPI<void>(`/itenspedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchFromAPI<void>(`/itenspedidos/${id}`, {
      method: 'DELETE',
    }),
};

// Inventory Movements API
export const inventoryApi = {
  getAll: () => fetchFromAPI<Inventory[]>('/movimentacoes'),
  getById: (id: number) => fetchFromAPI<Inventory>(`/movimentacoes/${id}`),
  create: (data: InventoryFormData) =>
    fetchFromAPI<Inventory>('/movimentacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: InventoryFormData) =>
    fetchFromAPI<void>(`/movimentacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchFromAPI<void>(`/movimentacoes/${id}`, {
      method: 'DELETE',
    }),
};

// Login e Registro
export const authApi = {
  login: (email: string, senha: string) =>
    fetch('https://backend-2dud.onrender.com/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      body: JSON.stringify({ email, senha }),
    }).then((res) => {
      if (!res.ok) throw new Error('Login inválido');
      return res.text(); // Retorna token
    }),

  register: (email: string, senha: string, role: string) =>
    fetch('https://backend-2dud.onrender.com/api/Auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({ email, senha, role }),
    }).then((res) => {
      if (!res.ok) throw new Error('Erro no registro');
      return res.ok;
    }),
};