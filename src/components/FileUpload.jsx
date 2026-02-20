import { useState, useCallback } from 'react';
import { processFile } from '../utils/fileProcessor';

export function FileUpload({ onSlidesAdded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFiles = useCallback(async (files) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });
    
    const allSlides = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });
      
      try {
        const slides = await processFile(file, (pageNum, totalPages) => {
          setProgress({ current: pageNum, total: totalPages, isPdf: true });
        });
        allSlides.push(...slides);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        alert(`Failed to process ${file.name}: ${error.message}`);
      }
    }
    
    if (allSlides.length > 0) {
      onSlidesAdded(allSlides);
    }
    
    setIsProcessing(false);
    setProgress({ current: 0, total: 0 });
  }, [onSlidesAdded]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="upload-progress">
            <div className="spinner"></div>
            <p>
              {progress.isPdf 
                ? `Processing PDF: Page ${progress.current} of ${progress.total}`
                : `Processing file ${progress.current} of ${progress.total}`}
            </p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p className="upload-text">Drag & drop files here</p>
            <p className="upload-subtext">or click to browse</p>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.gif,.svg,.pdf,.pptx"
              onChange={handleFileInput}
              className="file-input"
            />
          </>
        )}
      </div>
      <div className="supported-formats">
        <span>Supported: PNG, JPG, GIF, SVG, PDF, PPTX</span>
      </div>
    </div>
  );
}
