import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve([{
        dataUrl: e.target.result,
        filename: file.name,
        type: file.type
      }]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processSVG(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let svgContent = e.target.result;
      if (!svgContent.startsWith('data:')) {
        svgContent = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
      }
      resolve([{
        dataUrl: svgContent,
        filename: file.name,
        type: 'image/svg+xml'
      }]);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function processPDF(file, onProgress) {
  const slides = [];
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (onProgress) {
        onProgress(pageNum, numPages);
      }
      
      const page = await pdf.getPage(pageNum);
      const scale = 2;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      const dataUrl = canvas.toDataURL('image/png');
      slides.push({
        dataUrl,
        filename: `${file.name} - Page ${pageNum}`,
        type: 'image/png'
      });
    }
    
    return slides;
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
}

export async function processPPTX(file) {
  const slides = [];
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    const mediaFiles = [];
    zip.forEach((relativePath, zipEntry) => {
      if (relativePath.startsWith('ppt/media/') && !zipEntry.dir) {
        mediaFiles.push({ path: relativePath, entry: zipEntry });
      }
    });
    
    mediaFiles.sort((a, b) => {
      const numA = parseInt(a.path.match(/(\d+)/)?.[1] || '0');
      const numB = parseInt(b.path.match(/(\d+)/)?.[1] || '0');
      return numA - numB;
    });
    
    for (const { path, entry } of mediaFiles) {
      const blob = await entry.async('blob');
      const extension = path.split('.').pop().toLowerCase();
      
      const mimeType = getMimeType(extension);
      const dataUrl = await blobToDataUrl(blob);
      
      slides.push({
        dataUrl,
        filename: path.split('/').pop(),
        type: mimeType
      });
    }
    
    if (slides.length === 0) {
      throw new Error('No images found in PPTX file');
    }
    
    return slides;
  } catch (error) {
    console.error('PPTX processing error:', error);
    throw new Error(`Failed to process PPTX: ${error.message}`);
  }
}

function getMimeType(extension) {
  const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    'webp': 'image/webp'
  };
  return mimeTypes[extension] || 'image/png';
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function processFile(file, onProgress) {
  const extension = file.name.split('.').pop().toLowerCase();
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
  
  if (imageExtensions.includes(extension)) {
    return processImage(file);
  }
  
  if (extension === 'svg') {
    return processSVG(file);
  }
  
  if (extension === 'pdf') {
    return processPDF(file, onProgress);
  }
  
  if (extension === 'pptx') {
    return processPPTX(file);
  }
  
  throw new Error(`Unsupported file type: ${extension}`);
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}
