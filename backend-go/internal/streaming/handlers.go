package streaming

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// StartStreamHandler inicia um stream
func (s *StreamService) StartStreamHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var req struct {
		RTSPURL string `json:"rtsp_url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var id int
	if _, err := fmt.Sscanf(vars["id"], "%d", &id); err != nil {
		http.Error(w, "Invalid camera ID", http.StatusBadRequest)
		return
	}

	if err := s.StartStream(id, req.RTSPURL); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := map[string]interface{}{
		"camera_id":    id,
		"is_streaming": true,
		"status":       "streaming",
		"hls_url":      fmt.Sprintf("/streams/camera_%d/playlist.m3u8", id),
	}
	json.NewEncoder(w).Encode(resp)
}

// StopStreamHandler para um stream
func (s *StreamService) StopStreamHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var id int
	if _, err := fmt.Sscanf(vars["id"], "%d", &id); err != nil {
		http.Error(w, "Invalid camera ID", http.StatusBadRequest)
		return
	}

	if err := s.StopStream(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// StatusHandler retorna o status de um stream
func (s *StreamService) StatusHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var id int
	if _, err := fmt.Sscanf(vars["id"], "%d", &id); err != nil {
		http.Error(w, "Invalid camera ID", http.StatusBadRequest)
		return
	}

	stream, err := s.GetStreamStatus(id)
	if err != nil || stream == nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"camera_id":    id,
			"is_streaming": false,
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"camera_id":    id,
		"is_streaming": stream.Active,
		"status":       stream.Status,
		"hls_url":      fmt.Sprintf("/streams/camera_%d/playlist.m3u8", id),
	})
}

// ActiveStreamsHandler lista todos os streams ativos
func (s *StreamService) ActiveStreamsHandler(w http.ResponseWriter, r *http.Request) {
	active := s.GetActiveStreams()
	var ids []int
	for _, stream := range active {
		ids = append(ids, stream.ID)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"active_streams": ids,
		"count":          len(ids),
	})
}

// HealthCheck retorna o status do serviço
func (s *StreamService) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}
