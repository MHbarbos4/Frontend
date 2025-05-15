import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { categoriesApi, productsApi, suppliersApi, ordersApi } from '../services/api';
import {
  LayoutDashboard,
  Tag,
  ShoppingBag,
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface OutletContext {
  theme: string;
}

const COLORS = ['#FACC15', '#4ADE80', '#F87171'];

const Dashboard: React.FC = () => {
  const { theme } = useOutletContext<OutletContext>();

  const [counts, setCounts] = useState({
    categories: 0,
    products: 0,
    suppliers: 0,
    orders: 0,
    pendingOrders: 0,
    lowStock: 0,
  });
  const [categoryChart, setCategoryChart] = useState<any[]>([]);
  const [orderStatusChart, setOrderStatusChart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const [categories, products, suppliers, orders] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll(),
          suppliersApi.getAll(),
          ordersApi.getAll(),
        ]);

        const pendingOrders = orders.filter(order => order.status === 'Pendente');
        const completedOrders = orders.filter(order => order.status === 'Concluido');
        const cancelledOrders = orders.filter(order => order.status === 'Cancelado');
        const lowStockProducts = products.filter(product => product.quantidade < 10);

        const productsPerCategory = categories.map((cat: any) => ({
          name: cat.nome,
          produtos: products.filter((p: any) => p.categoriaId === cat.id).length,
        }));

        setCounts({
          categories: categories.length,
          products: products.length,
          suppliers: suppliers.length,
          orders: orders.length,
          pendingOrders: pendingOrders.length,
          lowStock: lowStockProducts.length,
        });

        setCategoryChart(productsPerCategory);
        setOrderStatusChart([
          { name: 'Pendentes', value: pendingOrders.length },
          { name: 'Concluídos', value: completedOrders.length },
          { name: 'Cancelados', value: cancelledOrders.length },
        ]);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard. Verifique se a API está disponível.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const abreviarNome = (nome: string) => nome.slice(0, 3);

  const cards = [
    {
      title: 'Categorias',
      count: counts.categories,
      icon: <Tag className="h-8 w-8 text-blue-400" />,
      link: '/categories',
    },
    {
      title: 'Produtos',
      count: counts.products,
      icon: <ShoppingBag className="h-8 w-8 text-green-400" />,
      link: '/products',
    },
    {
      title: 'Fornecedores',
      count: counts.suppliers,
      icon: <Users className="h-8 w-8 text-purple-400" />,
      link: '/suppliers',
    },
    {
      title: 'Pedidos',
      count: counts.orders,
      icon: <ClipboardList className="h-8 w-8 text-amber-400" />,
      link: '/orders',
    },
  ];

  const alertCards = [
    {
      title: 'Pedidos Pendentes',
      count: counts.pendingOrders,
      icon: <TrendingUp className="h-8 w-8 text-yellow-400" />,
      link: '/orders',
      textColor: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700',
      bg: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-yellow-50 border-gray-100',
    },
    {
      title: 'Estoque Baixo',
      count: counts.lowStock,
      icon: <AlertCircle className="h-8 w-8 text-red-400" />,
      link: '/products',
      textColor: theme === 'dark' ? 'text-red-300' : 'text-red-700',
      bg: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-gray-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center px-4 py-8 rounded-lg max-w-lg border"
          style={{ backgroundColor: theme === 'dark' ? '#fee2e2' : '#fff1f2', borderColor: '#fecaca' }}>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">Erro ao carregar dados</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Visão Geral */}
      <section>
        <div className="flex items-center mb-4">
          <LayoutDashboard className="mr-2 h-6 w-6 text-blue-500" />
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Visão Geral</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`rounded-lg p-6 shadow-sm border transition-transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-3xl font-bold">{card.count}</p>
                </div>
                <div>{card.icon}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <h3 className="font-semibold mb-4">Produtos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChart}>
              <XAxis
                dataKey="name"
                interval={0}
                angle={-20}
                textAnchor="end"
                tick={{ fill: theme === 'dark' ? '#fff' : '#000' }}
                tickFormatter={(value) => abreviarNome(value)}
              />
              <YAxis tick={{ fill: theme === 'dark' ? '#fff' : '#000' }} />
              <Tooltip />
              <Bar dataKey="produtos" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <h3 className="font-semibold mb-4">Status dos Pedidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {orderStatusChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Alertas */}
      <section>
        <div className="flex items-center mb-4">
          <TrendingDown className="mr-2 h-6 w-6 text-amber-500" />
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Alertas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`rounded-lg p-6 shadow-sm border transition-transform hover:scale-105 ${card.bg}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`${card.textColor} text-sm font-medium`}>{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{card.count}</p>
                </div>
                <div>{card.icon}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ações Rápidas */}
      <section className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow p-6`}>
        <h3 className="font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/products/new" className="px-4 py-3 bg-blue-100 rounded-md border border-blue-200 text-blue-700 flex items-center hover:bg-blue-200 transition-colors">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Adicionar Produto
          </Link>
          <Link to="/orders/new" className="px-4 py-3 bg-green-100 rounded-md border border-green-200 text-green-700 flex items-center hover:bg-green-200 transition-colors">
            <ClipboardList className="h-5 w-5 mr-2" />
            Criar Pedido
          </Link>
          <Link to="/suppliers/new" className="px-4 py-3 bg-purple-100 rounded-md border border-purple-200 text-purple-700 flex items-center hover:bg-purple-200 transition-colors">
            <Users className="h-5 w-5 mr-2" />
            Adicionar Fornecedor
          </Link>
          <Link to="/categories/new" className="px-4 py-3 bg-amber-100 rounded-md border border-amber-200 text-amber-700 flex items-center hover:bg-amber-200 transition-colors">
            <Tag className="h-5 w-5 mr-2" />
            Adicionar Categoria
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
