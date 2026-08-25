/**
 * exporter.js — High-DPI Social Post Exporter for Credit Republic
 * Renders HTML canvas elements into ultra-crisp PNG images and manages carousel exports.
 */

const Exporter = (function () {
  'use strict';

  /**
   * Export single DOM element as high-res PNG
   * @param {HTMLElement} element 
   * @param {string} fileName 
   * @param {number} scale 
   */
  async function exportToPNG(element, fileName = 'credit-republic-post.png', scale = 2) {
    if (!element) return;

    // Use html2canvas if loaded, or native SVG foreignObject renderer
    if (typeof html2canvas !== 'undefined') {
      try {
        const canvas = await html2canvas(element, {
          scale: scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false
        });
        downloadCanvas(canvas, fileName);
        return true;
      } catch (err) {
        console.error('html2canvas export failed, trying fallback:', err);
      }
    }

    // Fallback: SVG ForeignObject to Canvas
    return renderSvgFallback(element, fileName, scale);
  }

  /**
   * Fallback SVG ForeignObject renderer
   */
  function renderSvgFallback(element, fileName, scale = 2) {
    return new Promise((resolve, reject) => {
      try {
        const width = element.offsetWidth * scale;
        const height = element.offsetHeight * scale;
        
        // Clone element with inline computed styles
        const clone = element.cloneNode(true);
        copyComputedStyles(element, clone);

        const data = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="transform: scale(${scale}); transform-origin: top left; width: ${element.offsetWidth}px; height: ${element.offsetHeight}px;">
                ${clone.outerHTML}
              </div>
            </foreignObject>
          </svg>
        `;

        const img = new Image();
        const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          downloadCanvas(canvas, fileName);
          resolve(true);
        };

        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          console.error('SVG fallback render error', e);
          reject(e);
        };

        img.src = url;
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Recursively clone computed styles
   */
  function copyComputedStyles(src, dest) {
    const computed = window.getComputedStyle(src);
    for (let key of computed) {
      dest.style[key] = computed.getPropertyValue(key);
    }
    for (let i = 0; i < src.children.length; i++) {
      if (dest.children[i]) {
        copyComputedStyles(src.children[i], dest.children[i]);
      }
    }
  }

  /**
   * Trigger browser file download from canvas
   */
  function downloadCanvas(canvas, fileName) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export all carousel slides sequentially
   */
  async function exportCarouselSlides(postData, renderFn, onProgress = null) {
    const total = (postData.slides && postData.slides.length) || 1;
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '1080px';
    tempContainer.style.height = '1080px';
    document.body.appendChild(tempContainer);

    for (let i = 0; i < total; i++) {
      if (onProgress) onProgress(i + 1, total);
      tempContainer.innerHTML = renderFn(postData, { isCarousel: true, slideIndex: i });
      const targetEl = tempContainer.querySelector('.post-canvas-wrapper');
      
      // Wait for DOM & images to stabilize
      await new Promise(r => setTimeout(r, 200));
      
      const fileName = `credit-republic-carusel-slide-${i + 1}-din-${total}.png`;
      await exportToPNG(targetEl, fileName, 2);
      
      // Pause slightly between downloads to avoid browser block
      await new Promise(r => setTimeout(r, 400));
    }

    document.body.removeChild(tempContainer);
  }

  /**
   * Copy caption text & hashtags to clipboard
   */
  async function copyToClipboard(text) {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
    await navigator.clipboard.writeText(text);
    return true;
  }

  return {
    exportToPNG,
    exportCarouselSlides,
    copyToClipboard
  };
})();

if (typeof window !== 'undefined') {
  window.Exporter = Exporter;
}
