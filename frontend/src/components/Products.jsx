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

/**
 * Componente para la gestión de productos.
 * Permite a los usuarios ver, crear, editar y eliminar productos.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.toast - Referencia al componente Toast para mostrar notificaciones.
 */
const Products = ({ toast }) => {
  // Estados para almacenar la lista de productos, el producto en edición y el filtro de búsqueda global
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();

  // Obtiene el token de sesión y decodifica la información del usuario
  const token = sessionStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  /**
   * Muestra una notificación Toast.
   * @param {string} severity - La severidad de la notificación (ej. 'success', 'error').
   * @param {string} summary - El resumen o título de la notificación.
   * @param {string} detail - El mensaje detallado de la notificación.
   */
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  /**
   * Obtiene la lista de productos desde la API.
   */
  const fetchProducts = async () => {
    try {
      // Verifica si hay un token antes de intentar obtener productos
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

  // Efecto para cargar los productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []); // Se ejecuta solo una vez al montar el componente

  /**
   * Maneja la actualización de un producto existente.
   * @param {string} id - El ID del producto a actualizar.
   */
  const handleUpdate = async (id) => {
    try {
      await api.put(`/products/${id}`, editingProduct);
      setEditingProduct(null); // Cierra el diálogo de edición
      fetchProducts(); // Vuelve a cargar los productos
      showToast('success', 'Producto Actualizado', 'Producto actualizado correctamente.');
    } catch (error) {
      showToast('error', 'Error al Actualizar Producto', error.response?.data?.message || 'Fallo al actualizar el producto.');
    }
  };

  /**
   * Maneja la eliminación de un producto.
   * Muestra un diálogo de confirmación antes de eliminar.
   * @param {string} id - El ID del producto a eliminar.
   */
  const handleDelete = (id) => {
    confirmDialog({
      message: '¿Estás seguro de que quieres eliminar este producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await api.delete(`/products/${id}`);
          fetchProducts(); // Vuelve a cargar los productos
          showToast('success', 'Producto Eliminado', 'Producto eliminado correctamente.');
        } catch (error) {
          showToast('error', 'Error al Eliminar Producto', error.response?.data?.message || 'Fallo al eliminar el producto.');
        }
      }
    });
  };

  // Filtra los productos basándose en el filtro global (nombre o descripción)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
    product.description.toLowerCase().includes(globalFilter.toLowerCase())
  );

  // Pie de página para el diálogo de edición de producto
  const productDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setEditingProduct(null)} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={() => handleUpdate(editingProduct.id)} />
    </>
  );

  return (
    <div className="p-4">
      {/* Componente de diálogo de confirmación */}
      <ConfirmDialog />

      {/* Diálogo para editar un producto */}
      <Dialog visible={!!editingProduct} style={{ width: '450px' }} header="Editar Producto" modal className="p-fluid" footer={productDialogFooter} onHide={() => setEditingProduct(null)}>
        {editingProduct && (
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required autoFocus />
            </div>
            <div className="field">
              <label htmlFor="description">Descripción</label>
              <InputText id="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="price">Precio</label>
              <InputNumber id="price" value={editingProduct.price} onValueChange={(e) => setEditingProduct({ ...editingProduct, price: e.value })} mode="currency" currency="USD" locale="en-US" required />
            </div>
          </div>
        )}
      </Dialog>

      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Productos</h2>
        {/* Botón para crear producto, visible solo para administradores */}
        {user && (user.role === 'admin' || user.role === 'moderator') && (
          <Button label="Crear Producto" icon="pi pi-plus" onClick={() => navigate('/products/create')} className="p-button-primary" />
        )}
      </div>

      {/* Campo de búsqueda global para productos */}
      <div className="mb-4">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            type="text"
            placeholder="Buscar productos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full"
            style={{ borderRadius: '20px', paddingLeft: '2.5rem', backgroundColor: 'var(--facebook-white)', border: '1px solid var(--facebook-light-gray)' }}
          />
        </span>
      </div>

      {/* Cuadrícula de tarjetas de productos */}
      <div className="grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-12 md:col-6 lg:col-4">
            <Card title={product.name} className="product-card h-full">
              <div>
                <p>{product.description}</p>
                <p><strong>Precio:</strong> ${product.price}</p>
                {/* Botones de editar y eliminar, visibles solo para administradores y moderadores */}
                {user && (user.role === 'admin' || user.role === 'moderator') && (
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
