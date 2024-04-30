package main

import (
	"net/http"
	"log"
)

func main() {
	// Serve all files from the dist folder
	fs := http.FileServer(http.Dir("dist"))
	http.Handle("/", fs)

	// Start the server
	log.Println("Server is running on http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}