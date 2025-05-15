import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ setIsOpen, theme, toggleTheme }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/categories') return 'Gerenciar Categorias';
    if (path === '/suppliers') return 'Gerenciar Fornecedores';
    if (path === '/products') return 'Gerenciar Produtos';
    if (path === '/orders') return 'Gerenciar Pedidos';
    if (path === '/order-items') return 'Gerenciar Itens de Pedidos';
    if (path === '/inventory') return 'Gerenciar Movimentações';
    
    return 'Sistema de Gestão de Estoque';
  };

  return (
    <header
      className={`border-b py-4 px-6 flex items-center justify-between ${
        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      }`}
    >
      <button className="md:hidden" onClick={() => setIsOpen(true)}>
        <Menu
          size={24}
          className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}
        />
      </button>

      <h1
        className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}
      >
        {getPageTitle()}
      </h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-600 text-yellow-300' : 'bg-gray-200 text-gray-800'
          }`}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex items-center">
          <div
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'
            }`}
          >
            <User
              size={20}
              className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
            />
          </div>
          <div className="ml-2">
            <p
              className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {auth.role || 'No connection'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;