import './App.css';
import { useState, useRef, useEffect } from 'react';
import { useGestures } from './useGestures';

const slides = [
  './slides/slide1.svg',
  './slides/slide2.svg',
  './slides/slide3.svg',
  './slides/slide4.svg',
  './slides/slide5.svg',
  './slides/slide6.svg',
  './slides/slide7.svg',
  './slides/slide8.svg',
  './slides/slide9.svg',
  './slides/slide10.svg'
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef(null);
  const gesture = useGestures(videoRef);
  const [lastGestureTime, setLastGestureTime] = useState(0);

  // Setup webcam
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("📹 Webcam initialized");
        }
      } catch (error) {
        console.error("❌ Failed to access webcam:", error);
        alert("Please allow camera access to use gesture controls!");
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle gestures with debouncing
  useEffect(() => {
    if (!gesture) return;

    const now = Date.now();
    const debounceTime = 1000; // 1 second between gesture actions

    if (now - lastGestureTime < debounceTime) return;

    if (gesture === 'Open_Palm') {
      const nextSlide = Math.min(currentSlide + 1, slides.length - 1);
      if (nextSlide !== currentSlide) {
        setCurrentSlide(nextSlide);
        setLastGestureTime(now);
        console.log(`➡️  Next slide: ${nextSlide + 1}`);
      }
    } else if (gesture === 'Victory') {
      const prevSlide = Math.max(currentSlide - 1, 0);
      if (prevSlide !== currentSlide) {
        setCurrentSlide(prevSlide);
        setLastGestureTime(now);
        console.log(`⬅️  Previous slide: ${prevSlide + 1}`);
      }
    }
  }, [gesture, currentSlide, lastGestureTime]);

  return (
    <div className="app-container">
      {/* Main slide area */}
      <div className="slide-area">
        <img
          className="slide-img"
          src={slides[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
        />

        {/* Gesture indicator overlay */}
        <div className="gesture-overlay">
          <span>👋</span>
          <span>{gesture || 'Show hand gesture'}</span>
        </div>

        {/* Slide counter */}
        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Sidebar / bottom strip */}
      <div className="sidebar">
        <div className="sidebar-title">
          <h2>🎯 Spatial Presenter</h2>
          <p>Control slides with hand gestures</p>
        </div>

        {/* Webcam preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="webcam-preview"
        />

        {/* Current gesture */}
        <div className="info-card">
          <h3>Current Gesture</h3>
          <p className={`gesture-value ${gesture ? 'active' : 'inactive'}`}>
            {gesture || 'None detected'}
          </p>
        </div>

        {/* Controls guide */}
        <div className="info-card">
          <h3>🤚 Gestures</h3>
          <div className="guide-rows">
            <div>✋ <strong>Open Palm</strong> → Next</div>
            <div>✌️ <strong>Victory/Peace</strong> → Back</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
