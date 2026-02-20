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
  const [voiceActive, setVoiceActive] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState('');
  const [voiceCommandSuccess, setVoiceCommandSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

  // Setup Web Speech API for voice commands
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("⚠️  Web Speech API not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started");
      setVoiceActive(true);
      setIsListening(true);
    };

    recognition.onaudiostart = () => {
      setIsListening(true);
    };

    recognition.onaudioend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log(`🎤 Heard: "${transcript}"`);
      setLastVoiceCommand(transcript);

      let commandExecuted = false;

      if (transcript.includes('next') || transcript.includes('forward')) {
        const nextSlide = Math.min(currentSlide + 1, slides.length - 1);
        if (nextSlide !== currentSlide) {
          setCurrentSlide(nextSlide);
          console.log(`🎤 Voice command: Next slide (${nextSlide + 1})`);
          commandExecuted = true;
        }
      } else if (transcript.includes('previous') || transcript.includes('back') || transcript.includes('backwards')) {
        const prevSlide = Math.max(currentSlide - 1, 0);
        if (prevSlide !== currentSlide) {
          setCurrentSlide(prevSlide);
          console.log(`🎤 Voice command: Previous slide (${prevSlide + 1})`);
          commandExecuted = true;
        }
      } else if (transcript.includes('first') || transcript.includes('start')) {
        setCurrentSlide(0);
        console.log("🎤 Voice command: First slide");
        commandExecuted = true;
      } else if (transcript.includes('last') || transcript.includes('end')) {
        setCurrentSlide(slides.length - 1);
        console.log("🎤 Voice command: Last slide");
        commandExecuted = true;
      }

      if (commandExecuted) {
        setVoiceCommandSuccess(true);
        setTimeout(() => setVoiceCommandSuccess(false), 2000);
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.error("🎤 Speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      // Automatically restart recognition if it stops
      try {
        recognition.start();
      } catch (error) {
        // Ignore errors when trying to restart
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
    }

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        // Ignore errors on cleanup
      }
    };
  }, [currentSlide]);

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0, overflow: 'hidden' }}>
      {/* Main slide area */}
      <div style={{
        flex: 1,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <img
          src={slides[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />

        {/* Gesture indicator overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '20px',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>👋</span>
          <span>{gesture || 'Show hand gesture'}</span>
        </div>

        {/* Voice listening indicator */}
        {isListening && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'pulse 1.5s infinite'
          }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              animation: 'pulse 1s infinite'
            }}></span>
            <span>🎤 LISTENING...</span>
          </div>
        )}

        {/* Voice command success indicator */}
        {voiceCommandSuccess && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(16, 185, 129, 0.95)',
            color: 'white',
            padding: '30px 50px',
            borderRadius: '16px',
            fontSize: '36px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.3s ease-in-out',
            zIndex: 1000
          }}>
            ✓ VOICE COMMAND EXECUTED!
          </div>
        )}

        {/* Slide counter */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Slide {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Sidebar with webcam and controls */}
      <div style={{
        width: '320px',
        padding: '20px',
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>🎯 Spatial Presenter</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Control slides with gestures or voice
          </p>
        </div>

        {/* Webcam preview */}
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '2px solid #ddd',
              background: '#000'
            }}
          />
        </div>

        {/* Gesture info */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Current Gesture</h3>
          <p style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: gesture ? '#059669' : '#666'
          }}>
            {gesture || 'None detected'}
          </p>
        </div>

        {/* Controls guide */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          fontSize: '14px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🤚 Gestures</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>✋ <strong>Open Palm</strong> → Next</div>
            <div>✌️ <strong>Victory/Peace</strong> → Back</div>
          </div>
        </div>

        <div style={{
          background: voiceActive ? '#f0fdf4' : 'white',
          padding: '15px',
          borderRadius: '8px',
          border: voiceActive ? '2px solid #10b981' : '1px solid #e5e7eb',
          fontSize: '14px',
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎤</span>
            <span>Voice {voiceActive ? 'ACTIVE' : 'Inactive'}</span>
            {voiceActive && (
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }}></span>
            )}
          </h3>

          {/* Listening status */}
          {isListening && (
            <div style={{
              padding: '10px',
              background: '#fef2f2',
              borderRadius: '6px',
              marginBottom: '10px',
              border: '2px solid #ef4444',
              fontSize: '13px',
              fontWeight: 'bold',
              color: '#991b1b',
              textAlign: 'center'
            }}>
              🔴 LISTENING NOW...
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>Say <strong>"next"</strong></div>
            <div>Say <strong>"back"</strong></div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              Also: "first", "last"
            </div>
            {lastVoiceCommand && (
              <div style={{
                marginTop: '8px',
                padding: '10px',
                background: voiceCommandSuccess ? '#d1fae5' : '#f0fdf4',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#166534',
                border: voiceCommandSuccess ? '2px solid #10b981' : 'none',
                fontWeight: voiceCommandSuccess ? 'bold' : 'normal'
              }}>
                {voiceCommandSuccess && '✓ '} Last heard: "{lastVoiceCommand}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
