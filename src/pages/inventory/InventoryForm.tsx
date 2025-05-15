import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryApi, productsApi } from '../../services/api';
import { InventoryFormData, Product } from '../../types';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

function InventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<InventoryFormData>({
    produtoId: 0,
    tipo: 'Entrada',
    quantidade: 0,
    data: new Date().toISOString().split('T')[0],
    motivo: '',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productList = await productsApi.getAll();
        setProducts(productList);

        if (isEditMode) {
          const inventory = await inventoryApi.getById(Number(id));
          setFormData({
            produtoId: inventory.produtoId,
            tipo: inventory.tipo,
            quantidade: inventory.quantidade,
            data: inventory.data.slice(0, 10),
            motivo: inventory.motivo,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do inventário ou produtos');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantidade' || name === 'produtoId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await inventoryApi.update(Number(id), formData);
        toast.success('Movimentação atualizada com sucesso!');
      } else {
        await inventoryApi.create(formData);
        toast.success('Movimentação criada com sucesso!');
      }
      navigate('/inventory');
    } catch {
      toast.error('Erro ao salvar movimentação.');
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  if (loading) return <p className="text-center mt-6 dark:text-gray-200">Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-6 dark:text-white">
      <h1 className="text-2xl font-semibold mb-4">
        {isEditMode ? 'Editar Movimentação' : 'Nova Movimentação'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-300">Produto</label>
          <select
            name="produtoId"
            value={formData.produtoId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-300">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="Entrada">Entrada</option>
            <option value="Saida">Saída</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-300">Quantidade</label>
          <input
            type="number"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            min={1}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-300">Data</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-300">Motivo</label>
          <input
            type="text"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {isEditMode ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;
