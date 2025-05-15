import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/login/Login';
import Register from './pages/login/Register'; // Importa a página de cadastro
import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';
import Categories from './pages/categories/Categories';
import CategoryForm from './pages/categories/CategoryForm';
import Suppliers from './pages/suppliers/Suppliers';
import SupplierForm from './pages/suppliers/SupplierForm';
import Products from './pages/products/Products';
import ProductForm from './pages/products/ProductForm';
import Orders from './pages/orders/Orders';
import OrderForm from './pages/orders/OrderForm';
import OrderDetails from './pages/orders/OrderDetails';
import OrderItems from './pages/order-items/OrderItems';
import Inventory from './pages/inventory/Inventory';
import InventoryForm from './pages/inventory/InventoryForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página de login */}
          <Route path="/login" element={<Login />} />
          {/* Página de cadastro */}
          <Route path="/register" element={<Register />} /> {/* Nova Rota para Cadastro */}

          {/* Rota protegida que só pode ser acessada se o usuário estiver autenticado */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Categories Routes */}
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />

            {/* Suppliers Routes */}
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="suppliers/new" element={<SupplierForm />} />
            <Route path="suppliers/edit/:id" element={<SupplierForm />} />

            {/* Products Routes */}
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />

            {/* Orders Routes */}
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<OrderForm />} />
            <Route path="orders/edit/:id" element={<OrderForm />} />
            <Route path="orders/:id" element={<OrderDetails />} />

            {/* Order Items Routes */}
            <Route path="order-items" element={<OrderItems />} />

            {/* Inventory Routes */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/new" element={<InventoryForm />} />
            <Route path="inventory/edit/:id" element={<InventoryForm />} />
          </Route>

          {/* Rota padrão caso a URL não corresponda a nenhuma existente */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
