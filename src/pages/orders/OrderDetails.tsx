import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ordersApi, orderItemsApi, productsApi, suppliersApi } from '../../services/api';
import { Order, OrderItem, Product, Supplier } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [precoUnitario, setPrecoUnitario] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const orderId = parseInt(id);
      const [orderData, itemsData, productsData] = await Promise.all([
        ordersApi.getById(orderId),
        orderItemsApi.getAll(),
        productsApi.getAll(),
      ]);

      setOrder(orderData);
      setOrderItems(itemsData.filter(item => item.pedidoId === orderId));
      setProducts(productsData);

      const supplierData = await suppliersApi.getById(orderData.fornecedorId);
      setSupplier(supplierData);
    } catch (err) {
      setError('Falha ao carregar dados do pedido. Verifique se a API está disponível.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    
    try {
      setIsDeleting(true);
      await orderItemsApi.delete(deleteItemId);
      setOrderItems(orderItems.filter(item => item.id !== deleteItemId));
      toast.success('Item removido com sucesso!');
    } catch (error) {
      toast.error('Não foi possível remover o item do pedido.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const openDeleteModal = (itemId: number) => {
    setDeleteItemId(itemId);
    setIsDeleteModalOpen(true);
  };

  const getProductName = (productId: number) => {
    return products.find(p => p.id === productId)?.nome || 'N/A';
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!produtoId || quantidade <= 0) {
      toast.error('Preencha todos os campos corretamente.');
      return;
    }
  
    try {
      setIsLoading(true);
  
      const newItem: any = {
        id: Date.now(),
        pedidoId: parseInt(id),
        produtoId,
        quantidade,
      };
  
      if (precoUnitario > 0) {
        newItem.precoUnitario = precoUnitario;
      }
  
      await orderItemsApi.create(newItem);
      toast.success('Item adicionado com sucesso!');
      setIsAddingItem(false);
      fetchData();
    } catch (err) {
      setError('Falha ao adicionar item.');
      toast.error('Falha ao adicionar item.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order || !supplier) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center px-6 py-8 bg-red-50 border border-red-200 rounded-lg max-w-lg dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4 dark:text-red-400" />
          <h2 className="text-lg font-semibold text-red-700 mb-2 dark:text-red-300">Erro ao carregar dados</h2>
          <p className="text-red-600 mb-4 dark:text-red-400">{error || 'Pedido não encontrado'}</p>
          <Button onClick={() => navigate('/orders')}>Voltar para Pedidos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:text-gray-200">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          leftIcon={<ArrowLeft size={16} />}
          className="mr-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
        >
          Voltar
        </Button>
        <h2 className="text-xl font-semibold dark:text-white">
          Detalhes do Pedido #{order.id}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Informações do Pedido</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data</p>
                <p className="mt-1 dark:text-gray-300">{new Date(order.data).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    order.status === 'Concluido' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fornecedor</p>
                <p className="mt-1 dark:text-gray-300">{supplier.nome}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.contato}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Ações</h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                leftIcon={<Plus size={16} />}
                disabled={order.status !== 'Pendente'}
                onClick={() => setIsAddingItem(true)}
              >
                Adicionar Item
              </Button>
              <Link to={`/orders/edit/${order.id}`} className="block">
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<Edit size={16} />}
                  disabled={order.status === 'Concluido'}
                >
                  Editar Pedido
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-medium text-gray-00 dark:text-gray-200">Itens do Pedido</h3>
            </div>
            
            {orderItems.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-4 dark:text-gray-400">Nenhum item adicionado ao pedido</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                          Preço Unit.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-100 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 ">
                      {orderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {getProductName(item.produtoId)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                            {item.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                            {item.quantidade}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                            {(item.quantidade * item.precoUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <Button
                              variant="danger"
                              onClick={() => openDeleteModal(item.id)}
                              disabled={order.status === 'Concluido'}
                              leftIcon={<Trash2 size={16} />}
                            >
                              Remover
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 text-right bg-gray-50 dark:bg-gray-800">
                  <p className="text-xl font-semibold dark:text-white">
                    Total: {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Item */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-gray-800">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Adicionar Item ao Pedido</h3>
            <form onSubmit={handleAddItem} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Produto</label>
                <select
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={produtoId ?? ''}
                  onChange={(e) => setProdutoId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione um Produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  required
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-4 dark:text-white">Remover Item</h3>
            <p className="text-sm text-gray-700 mb-6 dark:text-gray-300">Tem certeza que deseja remover este item do pedido?</p>
            <div className="flex justify-end space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteItem}
                isLoading={isDeleting}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;