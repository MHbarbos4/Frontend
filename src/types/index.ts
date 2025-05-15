// Entity Types
export interface Category {
  id: number;
  nome: string;
}

export interface Supplier {
  id: number;
  nome: string;
  contato: string;
}

export interface Product {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  categoriaId: number;
  fornecedorId: number;
}

export interface Order {
  id: number;
  data: string;
  fornecedorId: number;
  status: 'Pendente' | 'Concluido' | 'Cancelado';
}

export interface OrderItem {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export interface Inventory {
  id: number;
  produtoId: number;
  tipo: 'Entrada' | 'Saida';
  quantidade: number;
  data: string;
  motivo: string;
}

// Form Types
export interface CategoryFormData {
  nome: string;
}

export interface SupplierFormData {
  nome: string;
  contato: string;
}

export interface ProductFormData {
  nome: string;
  preco: number;
  quantidade: number;
  categoriaId: number;
  fornecedorId: number;
}

export interface OrderFormData {
  data: string;
  fornecedorId: number;
  status: 'Pendente' | 'Concluido' | 'Cancelado';
}

export interface OrderItemFormData {
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export interface InventoryFormData {
  produtoId: number;
  tipo: 'Entrada' | 'Saida';
  quantidade: number;
  data: string;
  motivo: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export interface UserCredentials {
  email: string;
  senha: string;
}