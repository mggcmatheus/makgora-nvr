/**
 * Serviço de API para comunicação com o backend
 */
import axios from 'axios';
import type { Camera, CameraFormData } from '../types/camera';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cameraService = {
  // Listar todas as câmeras
  getAllCameras: async (): Promise<Camera[]> => {
    const response = await api.get<Camera[]>('/cameras');
    return response.data || [];
  },

  // Buscar uma câmera por ID
  getCameraById: async (id: number): Promise<Camera> => {
    const response = await api.get<Camera>(`/cameras/${id}`);
    return response.data;
  },

  // Criar nova câmera
  createCamera: async (data: CameraFormData): Promise<Camera> => {
    const response = await api.post<Camera>('/cameras', data);
    return response.data;
  },

  // Atualizar câmera
  updateCamera: async (id: number, data: Partial<CameraFormData>): Promise<Camera> => {
    const response = await api.put<Camera>(`/cameras/${id}`, data);
    return response.data;
  },

  // Deletar câmera
  deleteCamera: async (id: number): Promise<void> => {
    await api.delete(`/cameras/${id}`);
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await axios.get('http://localhost:8000/health');
    return response.data;
  },
};

// Serviço de streaming (Go service na porta 8001)
const streamApi = axios.create({
  baseURL: 'http://localhost:8001/api/stream',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const streamService = {
  startStream: async (cameraId: number, rtspUrl: string) => {
    const response = await streamApi.post(`/start/${cameraId}`, {
      rtsp_url: rtspUrl
    });
    return response.data;
  },

  stopStream: async (cameraId: number) => {
    const response = await streamApi.post(`/stop/${cameraId}`);
    return response.data;
  },

  getStatus: async (cameraId: number) => {
    const response = await streamApi.get(`/status/${cameraId}`);
    return response.data;
  },

  getActiveStreams: async () => {
    const response = await streamApi.get('/active');
    return response.data;
  },
};

