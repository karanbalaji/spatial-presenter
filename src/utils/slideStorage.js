const STORAGE_KEY = 'spatial-presenter-slides';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createDemoSlide(title, content, bgColor = '#1a1a2e') {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="${bgColor}"/>
  <text x="640" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml(title)}</text>
  ${content}
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svgContent.trim())}`;
}

function getDemoSlides() {
  return [
    {
      id: 'demo-welcome',
      dataUrl: createDemoSlide('Welcome to Spatial Presenter', `
        <text x="640" y="200" font-family="system-ui, sans-serif" font-size="28" fill="#a0a0a0" text-anchor="middle">Control your presentations with hand gestures!</text>
        <text x="640" y="320" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">No clicker needed - just use your hands</text>
        <text x="640" y="380" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">Open source and free to use</text>
        <text x="640" y="500" font-family="system-ui, sans-serif" font-size="20" fill="#6b7280" text-anchor="middle">Swipe through these slides to learn more</text>
      `),
      filename: 'Welcome',
      type: 'demo'
    },
    {
      id: 'demo-upload',
      dataUrl: createDemoSlide('Upload Your Slides', `
        <text x="640" y="180" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">Click Manage Slides in the sidebar</text>
        <text x="640" y="240" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">Then drag and drop your files or click to browse</text>
        <rect x="340" y="300" width="600" height="200" rx="12" fill="#2a2a4e" stroke="#4a4a6e" stroke-width="2"/>
        <text x="640" y="380" font-family="system-ui, sans-serif" font-size="20" fill="#a0a0a0" text-anchor="middle">Drop files here</text>
        <text x="640" y="420" font-family="system-ui, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">or click to browse</text>
        <text x="640" y="560" font-family="system-ui, sans-serif" font-size="18" fill="#6b7280" text-anchor="middle">Your slides are saved locally and persist between sessions</text>
      `),
      filename: 'How to Upload',
      type: 'demo'
    },
    {
      id: 'demo-gestures',
      dataUrl: createDemoSlide('Gesture Controls', `
        <rect x="140" y="160" width="450" height="300" rx="16" fill="#2a2a4e"/>
        <text x="365" y="230" font-family="system-ui, sans-serif" font-size="80" text-anchor="middle">Open Hand</text>
        <text x="365" y="300" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">Open Palm</text>
        <text x="365" y="350" font-family="system-ui, sans-serif" font-size="22" fill="#10b981" text-anchor="middle">Next Slide</text>
        <text x="365" y="400" font-family="system-ui, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">Show your open hand</text>
        
        <rect x="690" y="160" width="450" height="300" rx="16" fill="#2a2a4e"/>
        <text x="915" y="230" font-family="system-ui, sans-serif" font-size="80" text-anchor="middle">Peace Sign</text>
        <text x="915" y="300" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">Victory / Peace</text>
        <text x="915" y="350" font-family="system-ui, sans-serif" font-size="22" fill="#3b82f6" text-anchor="middle">Previous Slide</text>
        <text x="915" y="400" font-family="system-ui, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">Show two fingers</text>
        
        <text x="640" y="540" font-family="system-ui, sans-serif" font-size="18" fill="#6b7280" text-anchor="middle">Make sure your hand is visible in the webcam preview</text>
        <text x="640" y="580" font-family="system-ui, sans-serif" font-size="18" fill="#6b7280" text-anchor="middle">Hold the gesture briefly - there is a 1 second debounce</text>
      `),
      filename: 'Gestures',
      type: 'demo'
    },
    {
      id: 'demo-formats',
      dataUrl: createDemoSlide('Supported File Formats', `
        <rect x="80" y="160" width="240" height="160" rx="12" fill="#2a2a4e"/>
        <text x="200" y="220" font-family="system-ui, sans-serif" font-size="40" text-anchor="middle">Images</text>
        <text x="200" y="270" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">Images</text>
        <text x="200" y="300" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">PNG, JPG, GIF, SVG</text>
        
        <rect x="360" y="160" width="240" height="160" rx="12" fill="#2a2a4e"/>
        <text x="480" y="220" font-family="system-ui, sans-serif" font-size="40" text-anchor="middle">PDF</text>
        <text x="480" y="270" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">PDF</text>
        <text x="480" y="300" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Each page = 1 slide</text>
        
        <rect x="640" y="160" width="240" height="160" rx="12" fill="#2a2a4e"/>
        <text x="760" y="220" font-family="system-ui, sans-serif" font-size="40" text-anchor="middle">PPTX</text>
        <text x="760" y="270" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">PowerPoint</text>
        <text x="760" y="300" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Extracts images</text>
        
        <rect x="920" y="160" width="240" height="160" rx="12" fill="#2a2a4e"/>
        <text x="1040" y="220" font-family="system-ui, sans-serif" font-size="40" text-anchor="middle">SVG</text>
        <text x="1040" y="270" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">SVG</text>
        <text x="1040" y="300" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Vector graphics</text>
        
        <text x="640" y="400" font-family="system-ui, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">Pro Tip: Export your Google Slides or Keynote as PDF</text>
        <text x="640" y="450" font-family="system-ui, sans-serif" font-size="18" fill="#6b7280" text-anchor="middle">This preserves all formatting and layouts perfectly!</text>
      `),
      filename: 'File Formats',
      type: 'demo'
    },
    {
      id: 'demo-tips',
      dataUrl: createDemoSlide('Tips for Best Results', `
        <text x="200" y="180" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff">Position yourself so the webcam can see your hand clearly</text>
        <text x="200" y="240" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff">Good lighting improves gesture recognition</text>
        <text x="200" y="300" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff">Hold gestures for about 1 second</text>
        <text x="200" y="360" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff">Use New Session to clear all slides and start fresh</text>
        <text x="200" y="420" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff">Slides are saved in your browser - no account needed</text>
        
        <rect x="340" y="480" width="600" height="100" rx="12" fill="#10b98120" stroke="#10b981" stroke-width="2"/>
        <text x="640" y="540" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#10b981" text-anchor="middle">Ready to present? Upload your slides!</text>
      `),
      filename: 'Tips',
      type: 'demo'
    }
  ];
}

export function loadSlides() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return getDemoSlides();
  } catch (error) {
    console.error('Failed to load slides from localStorage:', error);
    return getDemoSlides();
  }
}

export function saveSlides(slides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      alert('Storage quota exceeded. Please delete some slides or start a new session.');
      return false;
    }
    console.error('Failed to save slides:', error);
    return false;
  }
}

export function clearSlides() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear slides:', error);
    return false;
  }
}

export function generateId() {
  return `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
