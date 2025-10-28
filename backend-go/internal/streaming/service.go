package streaming

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"time"
)

type CameraStream struct {
	ID       int       `json:"id"`
	RTSPURL  string    `json:"rtsp_url"`
	HLSPath  string    `json:"hls_path"`
	Status   string    `json:"status"`
	Active   bool      `json:"active"`
	Process  *exec.Cmd `json:"-"`
	LastSeen time.Time `json:"last_seen"`
}

type StreamService struct {
	streams map[int]*CameraStream
	mu      sync.RWMutex
	baseDir string
}

func NewStreamService(baseDir string) *StreamService {
	os.MkdirAll(baseDir, 0755)
	return &StreamService{
		streams: make(map[int]*CameraStream),
		baseDir: baseDir,
	}
}

func (s *StreamService) StartStream(cameraID int, rtspURL string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if stream, exists := s.streams[cameraID]; exists && stream.Active {
		return fmt.Errorf("stream already active for camera %d", cameraID)
	}

	hlsDir := filepath.Join(s.baseDir, fmt.Sprintf("camera_%d", cameraID))
	os.MkdirAll(hlsDir, 0755)
	hlsPath := filepath.Join(hlsDir, "playlist.m3u8")

	// Comando FFmpeg
	cmd := exec.Command("ffmpeg",
		"-rtsp_transport", "tcp",
		"-fflags", "+genpts",
		"-i", rtspURL,
		"-c:v", "libx264",
		"-preset", "ultrafast",
		"-tune", "zerolatency",
		"-err_detect", "ignore_err",
		"-c:a", "aac",
		"-hls_time", "2",
		"-hls_list_size", "6",
		"-hls_flags", "delete_segments+independent_segments",
		"-f", "hls",
		hlsPath,
	)

	stderr, _ := os.OpenFile("/tmp/ffmpeg_camera_"+fmt.Sprintf("%d", cameraID)+".log",
		os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	cmd.Stderr = stderr
	cmd.Stdout = nil

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start ffmpeg: %v", err)
	}

	log.Printf("FFmpeg started for camera %d with PID %d", cameraID, cmd.Process.Pid)
	log.Printf("RTSP URL: %s", rtspURL)

	stream := &CameraStream{
		ID:       cameraID,
		RTSPURL:  rtspURL,
		HLSPath:  hlsPath,
		Status:   "streaming",
		Active:   true,
		Process:  cmd,
		LastSeen: time.Now(),
	}

	s.streams[cameraID] = stream

	// Monitorar processo
	go func() {
		if err := cmd.Wait(); err != nil {
			log.Printf("Stream %d terminated with error: %v", cameraID, err)
		} else {
			log.Printf("Stream %d ended normally", cameraID)
		}

		s.mu.Lock()
		if stream, exists := s.streams[cameraID]; exists {
			stream.Active = false
			stream.Status = "stopped"
		}
		s.mu.Unlock()
	}()

	return nil
}

func (s *StreamService) StopStream(cameraID int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	stream, exists := s.streams[cameraID]
	if !exists || !stream.Active {
		return fmt.Errorf("stream not active for camera %d", cameraID)
	}

	if stream.Process != nil && stream.Process.Process != nil {
		log.Printf("Stopping stream %d (PID %d)", cameraID, stream.Process.Process.Pid)
		if err := stream.Process.Process.Kill(); err != nil {
			return fmt.Errorf("failed to stop stream: %v", err)
		}
	}

	stream.Active = false
	stream.Status = "stopped"
	delete(s.streams, cameraID)

	log.Printf("Stopped stream for camera %d", cameraID)
	return nil
}

func (s *StreamService) GetStreamStatus(cameraID int) (*CameraStream, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	stream, exists := s.streams[cameraID]
	if !exists {
		return nil, fmt.Errorf("stream not found for camera %d", cameraID)
	}

	return stream, nil
}

func (s *StreamService) GetActiveStreams() []*CameraStream {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var active []*CameraStream
	for _, stream := range s.streams {
		if stream.Active {
			active = append(active, stream)
		}
	}

	return active
}
