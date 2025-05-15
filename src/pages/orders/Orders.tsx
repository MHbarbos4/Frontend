import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ordersApi, suppliersApi } from '../../services/api';
import { Order, Supplier } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ordersData, suppliersData] = await Promise.all([
        ordersApi.getAll(),
        suppliersApi.getAll(),
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError('Falha ao carregar dados. Verifique se a API está disponível.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      await ordersApi.delete(deleteId);
      setOrders(orders.filter(order => order.id !== deleteId));
      toast.success('Pedido excluído com sucesso!');
    } catch (error) {
      toast.error('Não foi possível excluir o pedido.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const getSupplierName = (supplierId: number) => {
    return suppliers.find(sup => sup.id === supplierId)?.nome || 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Concluido':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center px-6 py-8 bg-red-50 border border-red-200 rounded-lg max-w-lg dark:bg-red-900 dark:border-red-700">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4 dark:text-red-300" />
          <h2 className="text-lg font-semibold text-red-700 mb-2 dark:text-red-100">Erro ao carregar dados</h2>
          <p className="text-red-600 mb-4 dark:text-red-200">{error}</p>
          <Button onClick={fetchData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pedidos</h2>
        <Link to="/orders/new">
          <Button leftIcon={<Plus size={16} />}>
            Novo Pedido
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4 dark:text-gray-400">Nenhum pedido encontrado</p>
            <Link to="/orders/new">
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                Criar Pedido
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(order.data).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {getSupplierName(order.fornecedorId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/orders/${order.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Eye size={14} />}
                          >
                            Visualizar
                          </Button>
                        </Link>
                        <Link to={`/orders/edit/${order.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit size={14} />}
                          >
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash2 size={14} />}
                          onClick={() => openDeleteModal(order.id)}
                          disabled={order.status === 'Concluido'}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="dark:text-gray-300">Tem certeza que deseja excluir este pedido?</p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Esta ação não poderá ser desfeita. Todos os itens associados a este pedido também serão excluídos.
        </p>
      </Modal>
    </div>
  );
};

export default Orders;