import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';

const Products = ({ toast }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const fetchProducts = async () => {
    try {
      if (!token) {
        showToast('error', 'Error de Autenticación', 'Debes iniciar sesión para ver los productos.');
        return;
      }
      const response = await axios.get('http://localhost:3000/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      showToast('error', 'Error al Cargar Productos', error.response?.data?.message || 'Fallo al cargar los productos.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/products/${id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProduct(null);
      fetchProducts();
      showToast('success', 'Producto Actualizado', 'Producto actualizado correctamente.');
    } catch (error) {
      showToast('error', 'Error al Actualizar Producto', error.response?.data?.message || 'Fallo al actualizar el producto.');
    }
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: '¿Estás seguro de que quieres eliminar este producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axios.delete(`http://localhost:3000/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchProducts();
          showToast('success', 'Producto Eliminado', 'Producto eliminado correctamente.');
        } catch (error) {
          showToast('error', 'Error al Eliminar Producto', error.response?.data?.message || 'Fallo al eliminar el producto.');
        }
      }
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
    product.description.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="p-4">
      <ConfirmDialog />
      <h2 className="text-center mb-4">Products</h2>

      {user && user.role === 'admin' && (
        <div className="text-center mt-4 mb-4">
          <Button label="Create Product" icon="pi pi-plus" onClick={() => navigate('/products/create')} />
        </div>
      )}

      <div className="text-center mt-4 mb-4">
        <InputText
          type="text"
          placeholder="Search products..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input w-full max-w-400"
        />
      </div>

      <div className="grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-12 md:col-6 lg:col-4">
            <Card title={product.name} className="product-card h-full">
              {editingProduct && editingProduct.id === product.id ? (
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(product.id); }} className="p-fluid">
                  <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputText id="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label htmlFor="price">Price</label>
                    <InputNumber id="price" value={editingProduct.price} onValueChange={(e) => setEditingProduct({ ...editingProduct, price: e.value })} mode="currency" currency="USD" locale="en-US" required />
                  </div>
                  <div className="flex justify-content-between mt-4">
                    <Button type="submit" label="Save" className="p-button-success" />
                    <Button type="button" label="Cancel" className="p-button-secondary" onClick={() => setEditingProduct(null)} />
                  </div>
                </form>
              ) : (
                <div>
                  <p>{product.description}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  {user && user.role === 'admin' && (
                    <div className="mt-4">
                      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => setEditingProduct(product)} />
                      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(product.id)} />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;