import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const CreateProduct = ({ toast }) => {
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('success', 'Producto Creado', 'Producto creado correctamente.');
      navigate('/products');
    } catch (error) {
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
