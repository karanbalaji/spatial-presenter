import { useState } from 'react';
import { FileUpload } from './FileUpload';

export function SlideManager({ slides, onAddSlides, onRemoveSlide, onClearAll, onClose }) {
  const [showUpload, setShowUpload] = useState(false);

  const handleNewSession = () => {
    if (window.confirm('Are you sure you want to start a new session? All slides will be removed.')) {
      onClearAll();
      setShowUpload(true);
    }
  };

  return (
    <div className="slide-manager-overlay">
      <div className="slide-manager">
        <div className="slide-manager-header">
          <h2>Slide Manager</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="slide-manager-actions">
          <button 
            className="action-btn upload-btn"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? 'Hide Upload' : '📁 Upload Slides'}
          </button>
          <button 
            className="action-btn clear-btn"
            onClick={handleNewSession}
          >
            🔄 New Session
          </button>
        </div>

        {showUpload && (
          <FileUpload onSlidesAdded={(newSlides) => {
            onAddSlides(newSlides);
            setShowUpload(false);
          }} />
        )}

        <div className="slides-grid-container">
          <p className="slides-count">{slides.length} slide{slides.length !== 1 ? 's' : ''}</p>
          
          {slides.length === 0 ? (
            <div className="no-slides">
              <p>No slides yet. Upload some files to get started!</p>
            </div>
          ) : (
            <div className="slides-grid">
              {slides.map((slide, index) => (
                <div key={slide.id} className="slide-thumbnail-wrapper">
                  <div className="slide-number">{index + 1}</div>
                  <img
                    src={slide.dataUrl}
                    alt={slide.filename}
                    className="slide-thumbnail"
                  />
                  <button
                    className="remove-slide-btn"
                    onClick={() => onRemoveSlide(slide.id)}
                    title="Remove slide"
                  >
                    🗑️
                  </button>
                  <p className="slide-filename" title={slide.filename}>
                    {slide.filename}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="slide-manager-footer">
          <button className="done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
