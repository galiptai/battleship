# Battleship✖

My take on the classic 1v1 game, where your aim is to guess where your opponent's ships are.

## Features

- Local game
  - Both players play on the same device, taking turns
  - Save system for storing the last unfinished game
- Desktop and mobile friendly

## In development
- Online play

## How to start

### With Docker:

What you need: Docker with Docker Compose
- in the terminal, navigate to the app's directory
- run `docker compose up -d`
- wait for the image to build and the container to start
- once it's running, you can reach the app on localhost:8080

### Without Docker:
#### Frontend:
What you need: Node.js and npm (latest versions recommended)
- in the terminal navigate to the client directory of the app
- run `npm ci` to install the dependencies
- run `npm run dev` to start a server which will host the app on localhost:3000
- if you want to change the port, you can do so in the package.json, by modifying the port in the dev script

#### Backend:
At this point the backend is only there to serve the frontend, so it's not needed
## Stack

- Frontend: React with TypeScript via Vite
- Backend: Java Spring Boot
