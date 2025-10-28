/**
 * Componente para exibir vídeo em tempo real via HLS
 */
import { useEffect, useRef } from 'react';
import './VideoStream.css';

interface VideoStreamProps {
  cameraId: number;
  hlsUrl: string;
  isActive?: boolean;
}

export default function VideoStream({ cameraId, hlsUrl, isActive = false }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !isActive) return;

    const video = videoRef.current;

    // Carregar fonte HLS
    video.src = hlsUrl;
    
    video.addEventListener('loadedmetadata', () => {
      video.play().catch((e) => {
        console.error('Erro ao iniciar reprodução:', e);
      });
    });

    video.addEventListener('error', (e) => {
      console.error('Erro no vídeo:', e);
    });

    // Cleanup
    return () => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [hlsUrl, isActive]);

  if (!isActive) {
    return (
      <div className="video-placeholder">
        <p>Clique em "Iniciar Stream" para visualizar</p>
      </div>
    );
  }

  return (
    <div className="video-stream">
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        className="video-player"
      />
    </div>
  );
}

