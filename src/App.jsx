import './App.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useGestures } from './useGestures';
import { useSlideStorage } from './hooks/useSlideStorage';
import { SlideManager } from './components/SlideManager';

function App() {
  const { slides, isLoading, addSlides, removeSlide, clearAllSlides } = useSlideStorage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showManager, setShowManager] = useState(false);
  const videoRef = useRef(null);
  const gesture = useGestures(videoRef);
  const lastActionTimeRef = useRef(0);
  const pendingNavigationRef = useRef(null);

  useEffect(() => {
    let stream = null;
    
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Webcam initialized");
        }
      } catch (error) {
        console.error("Failed to access webcam:", error);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const navigate = useCallback((direction, slideCount) => {
    const now = Date.now();
    if (now - lastActionTimeRef.current < 300) return;
    lastActionTimeRef.current = now;
    
    if (direction === 'next') {
      setCurrentSlide(prev => prev < slideCount - 1 ? prev + 1 : prev);
    } else {
      setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
    }
  }, []);

  useEffect(() => {
    if (!gesture || slides.length === 0) return;

    if (gesture === 'Open_Palm') {
      pendingNavigationRef.current = () => navigate('next', slides.length);
    } else if (gesture === 'Victory') {
      pendingNavigationRef.current = () => navigate('prev', slides.length);
    }

    const timeoutId = setTimeout(() => {
      if (pendingNavigationRef.current) {
        pendingNavigationRef.current();
        pendingNavigationRef.current = null;
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [gesture, navigate, slides.length]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (slides.length === 0) return;
      
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        navigate('next', slides.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate('prev', slides.length);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, navigate]);

  const safeCurrentSlide = slides.length > 0 ? Math.min(currentSlide, slides.length - 1) : 0;

  if (isLoading) {
    return (
      <div className="app-container loading">
        <div className="loading-spinner"></div>
        <p>Loading slides...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="slide-area">
        {slides.length === 0 ? (
          <div className="no-slides-display">
            <div className="no-slides-content">
              <h2>No Slides</h2>
              <p>Upload slides to start presenting</p>
              <button 
                className="upload-slides-btn"
                onClick={() => setShowManager(true)}
              >
                Upload Slides
              </button>
            </div>
          </div>
        ) : (
          <>
            <img
              className="slide-img"
              src={slides[safeCurrentSlide].dataUrl}
              alt={`Slide ${safeCurrentSlide + 1}`}
            />
            <div className="gesture-overlay">
              <span>{gesture || 'Show hand gesture'}</span>
            </div>
            <div className="slide-counter">
              {safeCurrentSlide + 1} / {slides.length}
            </div>
            <button 
              className="nav-arrow nav-prev" 
              onClick={() => navigate('prev', slides.length)}
              disabled={safeCurrentSlide === 0}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button 
              className="nav-arrow nav-next" 
              onClick={() => navigate('next', slides.length)}
              disabled={safeCurrentSlide === slides.length - 1}
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="sidebar">
        <div className="sidebar-title">
          <h2>Spatial Presenter</h2>
          <p>Control slides with hand gestures</p>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="webcam-preview"
        />

        <div className="info-card">
          <h3>Current Gesture</h3>
          <p className={`gesture-value ${gesture ? 'active' : 'inactive'}`}>
            {gesture || 'None detected'}
          </p>
        </div>

        <div className="info-card">
          <h3>Gestures</h3>
          <div className="guide-rows">
            <div>Open Palm - Next</div>
            <div>Victory/Peace - Back</div>
          </div>
        </div>

        <div className="info-card">
          <h3>Keyboard</h3>
          <div className="guide-rows">
            <div>Arrow Right/Space - Next</div>
            <div>Arrow Left - Previous</div>
          </div>
        </div>

        <button 
          className="manage-slides-btn"
          onClick={() => setShowManager(true)}
        >
          Manage Slides
        </button>
      </div>

      {showManager && (
        <SlideManager
          slides={slides}
          onAddSlides={addSlides}
          onRemoveSlide={removeSlide}
          onClearAll={clearAllSlides}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  );
}

export default App;
