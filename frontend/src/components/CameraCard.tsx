/**
 * Componente para exibir uma câmera em um card
 */
import type { Camera } from '../types/camera';
import './CameraCard.css';

interface CameraCardProps {
  camera: Camera;
  onEdit: (camera: Camera) => void;
  onDelete: (id: number) => void;
  onView?: (camera: Camera) => void;
}

export default function CameraCard({ camera, onEdit, onDelete, onView }: CameraCardProps) {
  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a câmera "${camera.name}"?`)) {
      onDelete(camera.id);
    }
  };

  return (
    <div className="camera-card">
      <div className="camera-card-header">
        <h3>{camera.name}</h3>
        <span className={`status-badge ${camera.is_active ? 'active' : 'inactive'}`}>
          {camera.is_active ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      <div className="camera-card-body">
        <div className="info-row">
          <span className="label">IP:</span>
          <span className="value">{camera.ip}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Porta:</span>
          <span className="value">{camera.port}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Path:</span>
          <span className="value">{camera.path}</span>
        </div>

        {camera.username && (
          <div className="info-row">
            <span className="label">Usuário:</span>
            <span className="value">{camera.username}</span>
          </div>
        )}

        <div className="info-row rtsp-url">
          <span className="label">RTSP URL:</span>
          <span className="value" title={camera.rtsp_url}>
            {camera.rtsp_url}
          </span>
        </div>
      </div>

      <div className="camera-card-actions">
        {onView && (
          <button 
            className="btn btn-primary"
            onClick={() => onView(camera)}
          >
            Visualizar
          </button>
        )}
        <button 
          className="btn btn-secondary"
          onClick={() => onEdit(camera)}
        >
          Editar
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

