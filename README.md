# Battleship✖

My take on the classic 1v1 game, where your aim is to guess where your opponent's ships are.

## Features

- Local game
  - Both players play on the same device, taking turns
  - Save system for storing the last unfinished game
- Desktop and mobile friendly

## How to start

What you need: Docker with Docker Compose

- in the terminal, navigate to the app's directory
- run ```docker compose up -d```
- wait for the image to build and the container to start
- once it's running, you can reach the app on localhost:8080

## Stack

- Frontend: React with TypeScript via Vite
- Backend: Java Spring Boot
