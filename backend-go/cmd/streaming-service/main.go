package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"makgora-nvr/backend-go/internal/streaming"

	"github.com/gorilla/mux"
)

func main() {
	service := streaming.NewStreamService("./streams")

	r := mux.NewRouter()

	// Stream endpoints
	r.HandleFunc("/api/stream/start/{id}", service.StartStreamHandler).Methods("POST")
	r.HandleFunc("/api/stream/stop/{id}", service.StopStreamHandler).Methods("POST")
	r.HandleFunc("/api/stream/status/{id}", service.StatusHandler).Methods("GET")
	r.HandleFunc("/api/stream/active", service.ActiveStreamsHandler).Methods("GET")

	// Health check
	r.HandleFunc("/health", service.HealthCheck).Methods("GET")

	// Servir arquivos HLS estáticos
	r.PathPrefix("/streams/").Handler(
		streaming.HLSMiddleware(http.StripPrefix("/streams/", http.FileServer(http.Dir("./streams")))))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}

	// Adicionar middleware CORS
	var handler http.Handler = r
	handler = streaming.CORSMiddleware(handler)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	// Graceful shutdown
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
		<-sigint

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Fatalf("Server shutdown failed: %v", err)
		}
	}()

	log.Printf("Streaming service started on port %s", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}
}
