/**
 * Tipos TypeScript para o sistema de câmeras
 */

export type Camera = {
  id: number;
  name: string;
  ip: string;
  port: number;
  path: string;
  username: string | null;
  password: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  rtsp_url: string;
};

export type CameraFormData = {
  name: string;
  ip: string;
  port: number;
  path: string;
  username?: string;
  password?: string;
  is_active: boolean;
};

