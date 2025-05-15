import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Tag,
  ShoppingBag,
  Users,
  ClipboardList,
  ArrowDownUp,
  LogOut,
  Package,
} from 'lucide-react';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, theme }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/categories', icon: <Tag size={20} />, label: 'Categorias' },
    { to: '/suppliers', icon: <Users size={20} />, label: 'Fornecedores' },
    { to: '/products', icon: <Package size={20} />, label: 'Produtos' },
    { to: '/orders', icon: <ClipboardList size={20} />, label: 'Pedidos' },
    { to: '/order-items', icon: <ShoppingBag size={20} />, label: 'Itens de Pedidos' },
    { to: '/inventory', icon: <ArrowDownUp size={20} />, label: 'Movimentações' },
  ];

  return (
    <>
      <div
        className={`border-r min-h-screen flex flex-col fixed top-0 left-0 z-40 transform transition-transform duration-300 md:static md:translate-x-0 w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
          }`}
        >
          <h1
            className={`text-xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Gestão de Estoque
          </h1>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-blue-800 text-blue-400 border-r-4 border-blue-400'
                          : 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-600 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span
                    className={`mr-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`p-4 border-t mt-auto ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
          }`}
        >
          <Button
            variant="ghost"
            fullWidth
            onClick={logout}
            leftIcon={<LogOut size={18} />}
            className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : ''}
          >
            Sair
          </Button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;