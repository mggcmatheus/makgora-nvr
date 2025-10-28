package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"makgora-nvr/backend-go/internal/api"

	"github.com/gorilla/mux"
)

func main() {
	api.InitDB()

	r := mux.NewRouter()

	// API de Câmeras
	r.HandleFunc("/api/cameras", api.GetCameras).Methods("GET")
	r.HandleFunc("/api/cameras/{id}", api.GetCamera).Methods("GET")
	r.HandleFunc("/api/cameras", api.CreateCamera).Methods("POST")
	r.HandleFunc("/api/cameras/{id}", api.UpdateCamera).Methods("PUT")
	r.HandleFunc("/api/cameras/{id}", api.DeleteCamera).Methods("DELETE")

	// Health check
	r.HandleFunc("/health", api.HealthCheck).Methods("GET")

	// Aplicar CORS
	var handler http.Handler = r
	handler = api.CORSMiddleware(handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	// Graceful shutdown
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
		<-sigint

		log.Println("Shutting down server...")
		if err := server.Close(); err != nil {
			log.Fatal(err)
		}
	}()

	log.Printf("API server started on port %s", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
