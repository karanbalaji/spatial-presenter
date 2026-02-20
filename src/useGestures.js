import { useEffect, useRef, useState } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

export function useGestures(videoRef) {
  const [gesture, setGesture] = useState(null);
  const recognizerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
          },
          numHands: 1,
          runningMode: "VIDEO"
        });

        console.log("✅ MediaPipe GestureRecognizer initialized");
        detectLoop();
      } catch (error) {
        console.error("❌ Failed to initialize gesture recognizer:", error);
      }
    }

    function detectLoop() {
      if (!isActive) return;

      if (videoRef.current && recognizerRef.current && videoRef.current.readyState >= 2) {
        try {
          const nowMs = Date.now();
          const result = recognizerRef.current.recognizeForVideo(videoRef.current, nowMs);

          if (result.gestures && result.gestures[0] && result.gestures[0][0]) {
            const detectedGesture = result.gestures[0][0];
            if (detectedGesture.score > 0.7) { // Confidence threshold
              setGesture(detectedGesture.categoryName);
              console.log(`👋 Detected: ${detectedGesture.categoryName} (${(detectedGesture.score * 100).toFixed(1)}%)`);
            }
          } else {
            setGesture(null);
          }
        } catch (error) {
          console.error("Error during gesture detection:", error);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectLoop);
    }

    init();

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, [videoRef]);

  return gesture;
}
