import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

/**
 * Componente para crear un nuevo producto.
 * Permite a los usuarios ingresar el nombre, descripción y precio de un producto
 * y enviarlo a la API para su creación.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.toast - Referencia al componente Toast para mostrar notificaciones.
 */
const CreateProduct = ({ toast }) => {
  // Estado para almacenar los datos del nuevo producto
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const navigate = useNavigate();
  // Obtiene el token de autenticación del almacenamiento de sesión
  const token = sessionStorage.getItem('token');

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
   * Maneja el envío del formulario para crear un producto.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Envía una solicitud POST a la API para crear el producto
      await axios.post('http://localhost:3000/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` } // Incluye el token de autorización
      });
      showToast('success', 'Producto Creado', 'Producto creado correctamente.');
      // Redirige a la página de productos después de la creación exitosa
      navigate('/products');
    } catch (error) {
      // Muestra un mensaje de error si la creación del producto falla
      showToast('error', 'Error al Crear Producto', error.response?.data?.message || 'Fallo al crear el producto.');
    }
  };

  return (
    <div className="form-container flex justify-content-center align-items-center">
      <Card title="Crear Producto" className="form-card w-full max-w-400">
        <form onSubmit={handleCreate} className="p-fluid">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <InputText id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="description">Descripción</label>
            <InputText id="description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="price">Precio</label>
            <InputNumber id="price" value={newProduct.price} onValueChange={(e) => setNewProduct({ ...newProduct, price: e.value })} mode="currency" currency="USD" locale="en-US" required />
          </div>
          <div className="flex justify-content-end mt-4">
            <Button type="button" label="Cancelar" className="p-button-secondary mr-2" onClick={() => navigate('/products')} />
            <Button type="submit" label="Crear Producto" className="p-button-primary" />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProduct;
