# Spatial Presenter

A gesture-controlled presentation app that lets you navigate slides using hand gestures captured through your webcam. Perfect for presenting without holding a remote or keyboard.

## Features

- **🤚 Gesture Recognition**: Uses MediaPipe to detect hand gestures in real-time
- **📹 Webcam Integration**: Accesses your device's camera to track hand movements
- **⏩ Slide Navigation**: Navigate through presentation slides with intuitive hand gestures
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **✨ Real-time Feedback**: Visual indicators for the currently detected gesture and slide position

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Webcam/camera access
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
git clone https://github.com/karanbalaji/spatial-presenter.git
cd spatial-presenter
npm install
npm run dev
```

The app will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Usage

1. Allow camera access when prompted
2. Show hand gestures to the webcam to navigate:
   - **✋ Open Palm** → Next slide
   - **✌️ Victory / Peace sign** → Previous slide

### Desktop Layout
- **Right Sidebar**: Shows webcam preview, current gesture, and gesture guide
- **Main Area**: Full-screen slide display with gesture and slide indicators

### Mobile Layout
- **Bottom Strip**: Compact horizontal layout with mini webcam preview and controls
- **Main Area**: Full-screen slide display optimized for portrait/landscape viewing

## Controls Guide

| Gesture | Action |
|---------|--------|
| ✋ Open Palm | Next Slide |
| ✌️ Victory/Peace | Previous Slide |

## Tech Stack

- **React** - UI framework
- **Vite** - Lightning-fast build tool
- **MediaPipe** - ML-based hand gesture detection
- **CSS3** - Responsive design with media queries

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**No gesture detected?**
- Ensure adequate lighting
- Position hand clearly in the webcam frame
- Allow at least 1 second between gestures

**Camera not working?**
- Check browser permissions for camera access
- Try a different browser
- Ensure webcam is not in use by another application

## License

MIT
