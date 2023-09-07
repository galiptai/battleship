# Battleship✖

My take on the classic 1v1 game, where your aim is to guess where your opponent's ships are.

## Features

- Local game
  - Both players play on the same device, taking turns
  - Save system for storing the last unfinished game
- Online game
  - Play with multiple devices on the same network
  - Public and private games
- Desktop and mobile friendly

## How to start

### With Docker:

What you need: Docker with Docker Compose

- In the terminal navigate to the app **client** directory
- Create a .env.local file, and place a VITE_ADDRESS variable in it, with the value being the address where the app will run on your network. *(For example: VITE_ADDRESS=192.168.0.255:8080)*
  - If you don't add this, the default value is localhost:8080, and online functionality will still be available on the machine you're running it on (if its running on the 8080 port)
- Navigate back to the root directory of the app
- The app will try to use port **8080** by default, if you wish to change that, open up the docker-compose.yaml file, and in the ports section, change the first number to the port you want *(For example to run on the port 8001, change it to "8001:8080")*
- Run `docker compose up -d`
- Wait for the image to build and the container to start
- Once its running, you can reach the app on port **8080** or whatever port you specified

### Without Docker:

#### Backend:

What you need: JDK 17

- In the terminal navigate to the **server** directory of the app
- Run `./mvnw clean install` to build the server
- Once it's built, you can start it with `java -jar target/battleship-0.0.1.jar`
- The server will need a few seconds to start, after that, it will be reachable on port **8080** on your network, if you wish to change that, add --server.port=<YOUR_PORT> to the end of the start command

#### Frontend:

What you need: Node.js and npm (latest versions recommended)

- In a different terminal navigate to the **client** directory of the app
- Create a .env.local file, and place a VITE_ADDRESS variable in it, with the value being the address of the server on your network. *(For example: VITE_ADDRESS=192.168.0.255:8080)*
- Run `npm ci` to install the dependencies
- Run `npm run build` to build the frontend
- Run `npm run preview` to start the frontend
- The frontend will be reachable on port **4000** on your network, if you wish to change that, you can do so in the vite.config.ts file, by changing the port value in the preview section before starting it

## How to play

### Rules

Here's a quick summary of the rules:

- Two players play against each other
- Each player has a 10x10 board, on which in the setup phase they place ships of different lengths
- The ships can't overlap, and they can't touch
- In the play phase, the players take turns trying to guess where the other player's ships are
- A ship is sunk if each tile of it is guessed
- A player wins when they manage to sink all of the other player's ships

### Local

Both players play on one device. After the setup phase the game will prompt the player whose turn it is. After they press ready, they can make a guess, and then pass with the button in the actions tab. They should then give the device to the other player. No peeking!

The game is being saved after each turn, so you can close it and come back to it anytime. Starting a new game will overwrite this save.

### Online

Both players can play on their own device, as long as they are on the same network. If you play on the same device, use incognito mode for the other player, or a different browser.

Two options are available to start/join an online game:
- Quick game: players join a public, queue-based lobby and get assigned a game from there automatically
- Private game: players have the option to start a new private game. The game's unique ID will be displayed to the player starting it. The other player can use this ID to join.

Upon picking either option, the game will first check whether the player has any running unfinished games, and offers the option to rejoin or forfeit.

Leaving the game in the setup phase will end the match. In the play phase, one player leaving will suspend the game, if they rejoin, the match will continue. Both players leaving will end the game.

## Stack/Technologies

- Frontend: React with TypeScript via Vite
- Backend: Java Spring Boot
- STOMP over Websocket
