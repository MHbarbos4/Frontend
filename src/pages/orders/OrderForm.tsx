import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { ordersApi, suppliersApi } from '../../services/api';
import { OrderFormData } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const OrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [suppliers, setSuppliers] = useState<Array<{ id: number; nome: string }>>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const suppliersData = await suppliersApi.getAll();
        setSuppliers(suppliersData);

        if (isEditMode) {
          const orderId = parseInt(id as string);
          const orderData = await ordersApi.getById(orderId);
          reset({
            data: new Date(orderData.data).toISOString().slice(0, 16),
            fornecedorId: orderData.fornecedorId,
            status: orderData.status,
          });
        } else {
          reset({
            data: new Date().toISOString().slice(0, 16),
            status: 'Pendente',
          });
        }
      } catch (error) {
        toast.error('Erro ao carregar dados');
        navigate('/orders');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      setIsLoading(true);

      if (isEditMode) {
        await ordersApi.update(parseInt(id as string), data);
        toast.success('Pedido atualizado com sucesso!');
      } else {
        await ordersApi.create(data);
        toast.success('Pedido criado com sucesso!');
      }

      navigate('/orders');
    } catch (error) {
      toast.error(isEditMode
        ? 'Erro ao atualizar pedido'
        : 'Erro ao criar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          {isEditMode ? 'Editar Pedido' : 'Novo Pedido'}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="data"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Data
              </label>
              <Input
                id="data"
                type="datetime-local"
                {...register('data', {
                  required: 'Data é obrigatória'
                })}
                error={errors.data?.message}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="fornecedorId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Fornecedor
              </label>
              <Select
                id="fornecedorId"
                {...register('fornecedorId', {
                  required: 'Fornecedor é obrigatório'
                })}
                error={errors.fornecedorId?.message}
                options={suppliers.map(supplier => ({
                  value: supplier.id,
                  label: supplier.nome
                }))}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <Select
                id="status"
                {...register('status', {
                  required: 'Status é obrigatório'
                })}
                error={errors.status?.message}
                options={[
                  { value: 'Pendente', label: 'Pendente' },
                  { value: 'Concluido', label: 'Concluído' },
                  { value: 'Cancelado', label: 'Cancelado' },
                ]}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/orders')}
              disabled={isLoading}
              className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Save size={16} />}
            >
              {isEditMode ? 'Atualizar' : 'Criar'} Pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
