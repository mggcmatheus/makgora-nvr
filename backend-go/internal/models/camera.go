package models

import (
	"database/sql"
	"fmt"
)

// Camera representa uma câmera no sistema
type Camera struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	IP        string `json:"ip"`
	Port      int    `json:"port"`
	Path      string `json:"path"`
	Username  string `json:"username,omitempty"`
	Password  string `json:"password,omitempty"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at,omitempty"`
	UpdatedAt string `json:"updated_at,omitempty"`
	RTSPURL   string `json:"rtsp_url,omitempty"`
}

// CameraCreate representa dados para criar uma câmera
type CameraCreate struct {
	Name     string `json:"name"`
	IP       string `json:"ip"`
	Port     int    `json:"port"`
	Path     string `json:"path"`
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
	IsActive bool   `json:"is_active"`
}

// GenerateRTSPURL gera a URL RTSP da câmera
func (c *Camera) GenerateRTSPURL() {
	if c.Username != "" && c.Password != "" {
		c.RTSPURL = fmt.Sprintf("rtsp://%s:%s@%s:%d%s", c.Username, c.Password, c.IP, c.Port, c.Path)
	} else {
		c.RTSPURL = fmt.Sprintf("rtsp://%s:%d%s", c.IP, c.Port, c.Path)
	}
}

// ScanCameraFromRow escaneia uma linha do banco para um Camera
func ScanCameraFromRow(rows *sql.Rows, c *Camera) error {
	var username, password sql.NullString
	err := rows.Scan(&c.ID, &c.Name, &c.IP, &c.Port, &c.Path, &username, &password, &c.IsActive, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return err
	}

	if username.Valid {
		c.Username = username.String
	}
	if password.Valid {
		c.Password = password.String
	}

	c.GenerateRTSPURL()
	return nil
}
