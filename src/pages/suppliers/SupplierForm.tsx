import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { productsApi, categoriesApi, suppliersApi } from '../../services/api';
import { ProductFormData, Category, Supplier } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [categoriesData, suppliersData] = await Promise.all([
          categoriesApi.getAll(),
          suppliersApi.getAll(),
        ]);
        setCategories(categoriesData);
        setSuppliers(suppliersData);

        if (isEditMode) {
          const productId = parseInt(id as string);
          const productData = await productsApi.getById(productId);
          reset({
            nome: productData.nome,
            preco: productData.preco,
            quantidade: productData.quantidade,
            categoriaId: productData.categoriaId,
            fornecedorId: productData.fornecedorId,
          });
        }
      } catch (error) {
        toast.error('Erro ao carregar dados');
        navigate('/products');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);

      if (isEditMode) {
        await productsApi.update(parseInt(id as string), data);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await productsApi.create(data);
        toast.success('Produto criado com sucesso!');
      }

      navigate('/products');
    } catch (error) {
      toast.error(isEditMode
        ? 'Erro ao atualizar produto'
        : 'Erro ao criar produto');
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
          onClick={() => navigate('/products')}
          leftIcon={<ArrowLeft size={16} />}
          className="mr-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
        >
          Voltar
        </Button>
        <h2 className="text-xl font-semibold dark:text-white">
          {isEditMode ? 'Editar Produto' : 'Novo Produto'}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome
              </label>
              <Input
                id="nome"
                {...register('nome', {
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                  }
                })}
                error={errors.nome?.message}
                placeholder="Digite o nome do produto"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="preco"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Preço
              </label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                {...register('preco', {
                  required: 'Preço é obrigatório',
                  min: {
                    value: 0.01,
                    message: 'Preço deve ser maior que zero'
                  }
                })}
                error={errors.preco?.message}
                placeholder="0.00"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="quantidade"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Quantidade
              </label>
              <Input
                id="quantidade"
                type="number"
                {...register('quantidade', {
                  required: 'Quantidade é obrigatória',
                  min: {
                    value: 0,
                    message: 'Quantidade não pode ser negativa'
                  }
                })}
                error={errors.quantidade?.message}
                placeholder="0"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="categoriaId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Categoria
              </label>
              <Select
                id="categoriaId"
                {...register('categoriaId', {
                  required: 'Categoria é obrigatória'
                })}
                error={errors.categoriaId?.message}
                options={categories.map(category => ({
                  value: category.id,
                  label: category.nome
                }))}
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
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/products')}
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
              {isEditMode ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
