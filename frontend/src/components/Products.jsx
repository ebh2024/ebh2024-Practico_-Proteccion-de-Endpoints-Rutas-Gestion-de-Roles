import React, { useEffect, useState } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

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
      const response = await api.get('/products');
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
      await api.put(`/products/${id}`, editingProduct);
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
          await api.delete(`/products/${id}`);
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

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setEditingProduct(null)} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => handleUpdate(editingProduct.id)} />
    </>
  );

  return (
    <div className="p-4">
      <ConfirmDialog />

      <Dialog visible={!!editingProduct} style={{ width: '450px' }} header="Edit Product" modal className="p-fluid" footer={productDialogFooter} onHide={() => setEditingProduct(null)}>
        {editingProduct && (
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required autoFocus />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <InputText id="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="price">Price</label>
              <InputNumber id="price" value={editingProduct.price} onValueChange={(e) => setEditingProduct({ ...editingProduct, price: e.value })} mode="currency" currency="USD" locale="en-US" required />
            </div>
          </div>
        )}
      </Dialog>

      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        {user && user.role === 'admin' && (
          <Button label="Create Product" icon="pi pi-plus" onClick={() => navigate('/products/create')} className="p-button-primary" />
        )}
      </div>

      <div className="mb-4">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            type="text"
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full"
            style={{ borderRadius: '20px', paddingLeft: '2.5rem', backgroundColor: 'var(--facebook-white)', border: '1px solid var(--facebook-light-gray)' }}
          />
        </span>
      </div>

      <div className="grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-12 md:col-6 lg:col-4">
            <Card title={product.name} className="product-card h-full">
              <div>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                {user && user.role === 'admin' && (
                  <div className="mt-4 flex justify-content-end">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary mr-2" onClick={() => setEditingProduct(product)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(product.id)} />
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
