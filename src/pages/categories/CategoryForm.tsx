import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { categoriesApi } from '../../services/api';
import { CategoryFormData } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>();

  // Fetch category data when editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEditMode) return;

      try {
        setIsFetching(true);
        const categoryId = parseInt(id as string);
        const data = await categoriesApi.getById(categoryId);
        reset({
          nome: data.nome,
        });
      } catch (error) {
        toast.error('Erro ao carregar categoria');
        navigate('/categories');
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [id, isEditMode, navigate, reset]);

  // Form submission handler
  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsLoading(true);

      if (isEditMode) {
        await categoriesApi.update(parseInt(id as string), data);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await categoriesApi.create(data);
        toast.success('Categoria criada com sucesso!');
      }

      navigate('/categories');
    } catch (error) {
      toast.error(
        isEditMode
          ? 'Erro ao atualizar categoria'
          : 'Erro ao criar categoria'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
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
          onClick={() => navigate('/categories')}
          leftIcon={<ArrowLeft size={16} />}
          className="mr-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
        >
          Voltar
        </Button>
        <h2 className="text-xl font-semibold dark:text-white">
          {isEditMode ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
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
                    message: 'Nome deve ter pelo menos 2 caracteres',
                  },
                })}
                error={errors.nome?.message}
                placeholder="Digite o nome da categoria"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/categories')}
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
              {isEditMode ? 'Atualizar' : 'Criar'} Categoria
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
