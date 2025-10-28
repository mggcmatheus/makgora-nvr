/**
 * Página do Painel - Exibe todas as câmeras com streaming ativo
 */
import { useState, useEffect } from 'react';
import type { Camera } from '../types/camera';
import { cameraService, streamService } from '../services/api';
import VideoStream from '../components/VideoStream';
import './Dashboard.css';

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [streamingCameras, setStreamingCameras] = useState<Set<number>>(new Set());
  const [streamKey, setStreamKey] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allCameras = await cameraService.getAllCameras();
      
      // Verificar se allCameras é um array
      if (!Array.isArray(allCameras)) {
        console.error('allCameras is not an array:', allCameras);
        setError('Erro ao carregar câmeras: formato inválido');
        return;
      }
      
      // Verificar streams ativos existentes e iniciar apenas os que não estão ativos
      for (const camera of allCameras) {
        if (camera.is_active) {
          try {
            // Verificar se já está streaming
            const status = await streamService.getStatus(camera.id);
            
            if (!status.is_streaming) {
              // Iniciar apenas se não estiver ativo
              await streamService.startStream(camera.id, camera.rtsp_url);
              // Aguardar FFmpeg estabilizar
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Marcar como ativo independente (pode ser de outra sessão)
            setStreamingCameras(prev => new Set(prev).add(camera.id));
          } catch (err) {
            console.error(`Erro ao iniciar stream para câmera ${camera.id}:`, err);
            // Mesmo se der erro, tentar exibir (pode estar rodando de outra sessão)
            setStreamingCameras(prev => new Set(prev).add(camera.id));
          }
        }
      }
      
      setCameras(allCameras.filter(c => c.is_active));
    } catch (err) {
      setError('Erro ao carregar câmeras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopAllStreams = async () => {
    for (const cameraId of streamingCameras) {
      try {
        await streamService.stopStream(cameraId);
      } catch (err) {
        console.error(`Erro ao parar stream ${cameraId}:`, err);
      }
    }
    setStreamingCameras(new Set());
  };

  const startAllStreams = async () => {
    for (const camera of cameras) {
      if (!streamingCameras.has(camera.id)) {
        try {
          await streamService.startStream(camera.id, camera.rtsp_url);
          await new Promise(resolve => setTimeout(resolve, 500));
          setStreamingCameras(prev => new Set(prev).add(camera.id));
        } catch (err) {
          console.error(`Erro ao iniciar stream para câmera ${camera.id}:`, err);
        }
      }
    }
    // Forçar atualização dos players de vídeo
    setStreamKey(prev => prev + 1);
  };

  // Verificar quantas câmeras estão offline
  const offlineCount = cameras.filter(c => !streamingCameras.has(c.id)).length;
  const hasOfflineCameras = offlineCount > 0;

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopAllStreams();
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando painel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">⚠️ {error}</div>
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <p>Nenhuma câmera ativa</p>
          <p>Configure e ative câmeras para visualizar o painel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Painel de Monitoramento</h1>
        <div className="dashboard-info">
          <span>{cameras.length} câmera(s) ativa(s) ({streamingCameras.size} streaming)</span>
          <div className="dashboard-actions">
            <button 
              className="btn btn-primary" 
              onClick={startAllStreams}
              disabled={!hasOfflineCameras}
              title={hasOfflineCameras ? `${offlineCount} câmera(s) offline` : 'Todas as câmeras estão ativas'}
            >
              Iniciar Todos os Streams {hasOfflineCameras && `(${offlineCount})`}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={stopAllStreams}
              disabled={streamingCameras.size === 0}
            >
              Parar Todos os Streams
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {cameras.map(camera => (
          <div key={camera.id} className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>{camera.name}</h3>
              <span className={`status-badge ${streamingCameras.has(camera.id) ? 'streaming' : 'offline'}`}>
                {streamingCameras.has(camera.id) ? '● Ao Vivo' : '○ Offline'}
              </span>
            </div>
            
            <div className="dashboard-card-body">
              {streamingCameras.has(camera.id) ? (
                <VideoStream
                  key={`${camera.id}-${streamKey}`}
                  cameraId={camera.id}
                  hlsUrl={`http://localhost:8001/streams/camera_${camera.id}/playlist.m3u8?t=${streamKey}`}
                  isActive={true}
                />
              ) : (
                <div className="video-placeholder-small">
                  <p>Stream não iniciado</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

