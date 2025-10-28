package api

import (
	"encoding/json"
	"net/http"

	"makgora-nvr/backend-go/internal/models"

	"github.com/gorilla/mux"
)

// GetCameras lista todas as câmeras
func GetCameras(w http.ResponseWriter, r *http.Request) {
	rows, err := DB.Query("SELECT * FROM cameras ORDER BY created_at DESC")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cameras []models.Camera
	for rows.Next() {
		var c models.Camera
		if err := models.ScanCameraFromRow(rows, &c); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		cameras = append(cameras, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cameras)
}

// GetCamera busca uma câmera por ID
func GetCamera(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var c models.Camera

	err := DB.QueryRow("SELECT * FROM cameras WHERE id = ?", vars["id"]).
		Scan(&c.ID, &c.Name, &c.IP, &c.Port, &c.Path, &c.Username, &c.Password, &c.IsActive, &c.CreatedAt, &c.UpdatedAt)

	if err != nil {
		http.Error(w, "Câmera não encontrada", http.StatusNotFound)
		return
	}

	c.GenerateRTSPURL()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

// CreateCamera cria uma nova câmera
func CreateCamera(w http.ResponseWriter, r *http.Request) {
	var input models.CameraCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := DB.Exec(
		"INSERT INTO cameras (name, ip, port, path, username, password, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
		input.Name, input.IP, input.Port, input.Path, input.Username, input.Password, input.IsActive,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, _ := result.LastInsertId()
	var c models.Camera
	DB.QueryRow("SELECT * FROM cameras WHERE id = ?", id).
		Scan(&c.ID, &c.Name, &c.IP, &c.Port, &c.Path, &c.Username, &c.Password, &c.IsActive, &c.CreatedAt, &c.UpdatedAt)

	c.GenerateRTSPURL()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(c)
}

// UpdateCamera atualiza uma câmera
func UpdateCamera(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var updates models.CameraCreate
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := DB.Exec(
		"UPDATE cameras SET name=?, ip=?, port=?, path=?, username=?, password=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
		updates.Name, updates.IP, updates.Port, updates.Path, updates.Username, updates.Password, updates.IsActive, vars["id"],
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var c models.Camera
	DB.QueryRow("SELECT * FROM cameras WHERE id = ?", vars["id"]).
		Scan(&c.ID, &c.Name, &c.IP, &c.Port, &c.Path, &c.Username, &c.Password, &c.IsActive, &c.CreatedAt, &c.UpdatedAt)

	c.GenerateRTSPURL()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

// DeleteCamera remove uma câmera
func DeleteCamera(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_, err := DB.Exec("DELETE FROM cameras WHERE id = ?", vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// HealthCheck retorna status do serviço
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
