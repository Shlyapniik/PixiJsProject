# Interactive 2D Web Experience

An interactive 2D web experience built with **PixiJS** and **JavaScript**.

The project features an animated character, interactive movement, camera transitions, background effects and sound.

## Features

* Interactive character animation
* Sprite sheet animation using `PIXI.AnimatedSprite`
* Custom jump and movement animation
* Two-phase character movement with camera transitions
* Parallax-like background movement
* Interactive sound effects and background music
* Responsive canvas scaling
* Modular game structure

## Tech Stack

* **JavaScript**
* **PixiJS 8**
* **@pixi/sound**
* **Vite**

## Project Structure

```text
src/
├── Character.js      # Character animation and movement
├── ClickHandler.js   # User interaction and sound control
├── Game.js           # Game initialization and scene management
├── config.js         # Game configuration
└── main.js           # Application entry point
```

## How It Works

The project uses a fixed virtual resolution that is scaled to fit the browser window.

The character is animated using a sprite sheet and moves through the scene along a calculated parabolic trajectory. After completing each movement phase, the camera smoothly shifts the world to reveal the next part of the scene.

User interaction is handled separately from the character logic, while audio is managed through `@pixi/sound`.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The project will then be available through the local Vite development server.

## Project Status

**Completed**

This project was created as a practical experiment with PixiJS, interactive 2D animation and browser-based game development.
