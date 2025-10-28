/**
 * Componente de formulário para criar/editar câmeras
 */
import { useState, useEffect } from 'react';
import type { Camera, CameraFormData } from '../types/camera';
import './CameraForm.css';

interface CameraFormProps {
  camera?: Camera | null;
  onSubmit: (data: CameraFormData) => void;
  onCancel: () => void;
}

export default function CameraForm({ camera, onSubmit, onCancel }: CameraFormProps) {
  const [formData, setFormData] = useState<CameraFormData>({
    name: '',
    ip: '',
    port: 554,
    path: '/',
    username: '',
    password: '',
    is_active: true,
  });

  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        ip: camera.ip,
        port: camera.port,
        path: camera.path,
        username: camera.username || '',
        password: camera.password || '',
        is_active: camera.is_active,
      });
    }
  }, [camera]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="camera-form-container">
      <form className="camera-form" onSubmit={handleSubmit}>
        <h2>{camera ? 'Editar Câmera' : 'Nova Câmera'}</h2>

        <div className="form-group">
          <label htmlFor="name">Nome da Câmera *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: Corredor Fundo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ip">Endereço IP *</label>
          <input
            type="text"
            id="ip"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            required
            placeholder="192.168.1.101"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="port">Porta *</label>
            <input
              type="number"
              id="port"
              name="port"
              value={formData.port}
              onChange={handleChange}
              required
              min="1"
              max="65535"
            />
          </div>

          <div className="form-group">
            <label htmlFor="path">Path *</label>
            <input
              type="text"
              id="path"
              name="path"
              value={formData.path}
              onChange={handleChange}
              required
              placeholder="/onvif1 ou /stream1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Usuário RTSP</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha RTSP</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active">Câmera ativa</label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {camera ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
}

