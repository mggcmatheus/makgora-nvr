/**
 * Tipos TypeScript para streaming
 */

export type StreamStatus = {
  camera_id: number;
  is_streaming: boolean;
  hls_url?: string;
  status?: string;
};

export type ActiveStreams = {
  active_streams: number[];
  count: number;
};

