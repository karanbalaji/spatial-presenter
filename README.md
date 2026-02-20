# Spatial Presenter

A gesture-controlled presentation app that lets you navigate slides using hand gestures captured through your webcam.

## Features

- **Gesture Recognition**: Uses MediaPipe to detect hand gestures in real-time
- **Webcam Integration**: Accesses your device's camera to track hand movements
- **Slide Navigation**: Navigate through presentation slides with intuitive hand gestures
- **Voice Commands**: Control presentations with voice input
- **Real-time Feedback**: Visual indicators for gesture and voice command detection

## Getting Started

### Prerequisites
- Node.js and npm
- Webcam access
- Modern browser with camera permissions

### Installation

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173`

## Usage

1. Allow camera access when prompted
2. Use hand gestures to navigate between slides
3. Use voice commands to control the presentation

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **MediaPipe** - Gesture recognition
- **Web APIs** - Webcam and voice input
