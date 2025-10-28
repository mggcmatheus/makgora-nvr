/**
 * Página principal de listagem de câmeras
 */
import { useState, useEffect } from 'react';
import type { Camera } from '../types/camera';
import { cameraService } from '../services/api';
import CameraCard from '../components/CameraCard';
import CameraForm from '../components/CameraForm';
import StreamModal from '../components/StreamModal';
import './CameraList.css';

export default function CameraManagement() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [viewingCamera, setViewingCamera] = useState<Camera | null>(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cameraService.getAllCameras();
      
      // Verificar se data é um array
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        setError('Erro ao carregar câmeras: formato inválido');
        setCameras([]);
        return;
      }
      
      setCameras(data);
    } catch (err) {
      setError('Erro ao carregar câmeras. Verifique se o backend está rodando.');
      console.error(err);
      setCameras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCamera = async (formData: any) => {
    try {
      await cameraService.createCamera(formData);
      setShowForm(false);
      loadCameras();
    } catch (err) {
      alert('Erro ao criar câmera');
      console.error(err);
    }
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    setShowForm(true);
  };

  const handleUpdateCamera = async (formData: any) => {
    if (!editingCamera) return;
    
    try {
      await cameraService.updateCamera(editingCamera.id, formData);
      setShowForm(false);
      setEditingCamera(null);
      loadCameras();
    } catch (err) {
      alert('Erro ao atualizar câmera');
      console.error(err);
    }
  };

  const handleDeleteCamera = async (id: number) => {
    try {
      await cameraService.deleteCamera(id);
      loadCameras();
    } catch (err) {
      alert('Erro ao excluir câmera');
      console.error(err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCamera(null);
  };

  const handleViewCamera = (camera: Camera) => {
    setViewingCamera(camera);
    setShowStream(true);
  };

  const handleCloseStream = () => {
    setShowStream(false);
    setViewingCamera(null);
  };

  if (showForm) {
    return (
      <div className="camera-list-container">
        <CameraForm
          camera={editingCamera}
          onSubmit={editingCamera ? handleUpdateCamera : handleCreateCamera}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div className="camera-list-container">
      <div className="camera-list-header">
        <h1>Makgora NVR - Gerenciamento de Câmeras</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nova Câmera
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : cameras.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma câmera cadastrada.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Adicionar primeira câmera
          </button>
        </div>
      ) : (
        <div className="camera-grid">
          {cameras.map(camera => (
            <CameraCard
              key={camera.id}
              camera={camera}
              onEdit={handleEditCamera}
              onDelete={handleDeleteCamera}
              onView={handleViewCamera}
            />
          ))}
        </div>
      )}

      {showStream && viewingCamera && (
        <StreamModal
          cameraId={viewingCamera.id}
          cameraName={viewingCamera.name}
          onClose={handleCloseStream}
        />
      )}
    </div>
  );
}

