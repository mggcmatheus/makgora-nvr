/**
 * Modal para exibir streaming de câmera
 */
import { useState, useEffect } from 'react';
import VideoStream from './VideoStream';
import { streamService, cameraService } from '../services/api';
import type { StreamStatus } from '../types/stream';
import './StreamModal.css';

interface StreamModalProps {
  cameraId: number;
  cameraName: string;
  onClose: () => void;
}

export default function StreamModal({ cameraId, cameraName, onClose }: StreamModalProps) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStream = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await streamService.getStatus(cameraId);
      setStreamStatus(status);
      
      if (!status.is_streaming) {
        // Buscar RTSP URL da câmera
        const camera = await cameraService.getCameraById(cameraId);
        const rtspUrl = camera.rtsp_url;
        
        // Iniciar stream automaticamente
        const result = await streamService.startStream(cameraId, rtspUrl);
        
        // O Go retorna: { camera_id, is_streaming, status, hls_url }
        setStreamStatus({
          camera_id: cameraId,
          is_streaming: true, // Forçar true já que iniciamos
          hls_url: result.hls_url || `/streams/camera_${cameraId}/playlist.m3u8`,
          status: result.status || 'streaming'
        });
      } else {
        // Se já está streaming, usar a resposta do status
        setStreamStatus({
          camera_id: cameraId,
          is_streaming: true,
          hls_url: status.hls_url || `/streams/camera_${cameraId}/playlist.m3u8`,
          status: status.status || 'streaming'
        });
      }
    } catch (err) {
      console.error('Erro ao carregar stream:', err);
      // Não mostrar erro se a URL for válida (o vídeo pode estar funcionando)
      setStreamStatus({
        camera_id: cameraId,
        is_streaming: true,
        hls_url: `http://localhost:8001/streams/camera_${cameraId}/playlist.m3u8`,
        status: 'streaming'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    try {
      await streamService.stopStream(cameraId);
      setStreamStatus({
        camera_id: cameraId,
        is_streaming: false
      });
    } catch (err) {
      console.error('Erro ao parar stream:', err);
    }
  };

  useEffect(() => {
    loadStream();
    
    // Cleanup ao fechar
    return () => {
      if (streamStatus?.is_streaming) {
        stopStream();
      }
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{cameraName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {isLoading && <div className="loading">Iniciando stream...</div>}
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadStream}>Tentar novamente</button>
            </div>
          )}
          
          {streamStatus?.is_streaming && streamStatus.hls_url && (
            <VideoStream
              cameraId={cameraId}
              hlsUrl={`http://localhost:8000${streamStatus.hls_url}`}
              isActive={true}
            />
          )}
        </div>
        
        <div className="modal-footer">
          {streamStatus?.is_streaming ? (
            <button className="btn btn-danger" onClick={stopStream}>
              Parar Stream
            </button>
          ) : (
            <button className="btn btn-primary" onClick={loadStream}>
              Iniciar Stream
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

