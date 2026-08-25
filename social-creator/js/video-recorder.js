/**
 * video-recorder.js — Native 60FPS Video Recorder for Social Media Stories & Reels
 * Records animated canvas/DOM in real-time into MP4/WebM video files directly in the browser.
 */

const VideoRecorder = (function () {
  'use strict';

  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

  /**
   * Check if browser supports MediaRecorder
   */
  function isSupported() {
    return typeof window.MediaRecorder !== 'undefined';
  }

  /**
   * Record element for a specified duration in seconds
   * @param {HTMLElement} element 
   * @param {number} durationSeconds 
   * @param {Function} onProgress (currentSec, totalSec)
   * @returns {Promise<Blob>}
   */
  async function recordElement(element, durationSeconds = 5, onProgress = null) {
    if (!element) throw new Error('Elementul canvas nu a fost găsit.');

    return new Promise(async (resolve, reject) => {
      try {
        isRecording = true;
        recordedChunks = [];

        // Create offscreen high-res recording canvas
        const width = 1080;
        const height = element.classList.contains('format-9-16') ? 1920 : 1080;

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const ctx = offscreenCanvas.getContext('2d');

        // Capture stream at 60 FPS
        const stream = offscreenCanvas.captureStream(60);

        // Pick supported mime type
        const mimeTypes = [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4'
        ];
        const selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';

        mediaRecorder = new MediaRecorder(stream, {
          mimeType: selectedMime,
          videoBitsPerSecond: 8000000 // 8 Mbps high quality
        });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          isRecording = false;
          const blob = new Blob(recordedChunks, { type: selectedMime });
          const extension = selectedMime.includes('mp4') ? 'mp4' : 'webm';
          downloadVideoBlob(blob, `credit-republic-video-${Date.now()}.${extension}`);
          resolve(blob);
        };

        mediaRecorder.start();

        // Render loop
        const startTime = performance.now();
        const totalMs = durationSeconds * 1000;

        async function drawFrame(now) {
          if (!isRecording) return;
          const elapsed = now - startTime;

          if (onProgress) {
            const currentSec = Math.min(durationSeconds, (elapsed / 1000).toFixed(1));
            onProgress(currentSec, durationSeconds);
          }

          if (elapsed >= totalMs) {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
            return;
          }

          // Use html2canvas to capture snapshot if available
          if (typeof html2canvas !== 'undefined') {
            try {
              const snapshotCanvas = await html2canvas(element, {
                scale: 1,
                backgroundColor: null,
                logging: false
              });
              ctx.clearRect(0, 0, width, height);
              ctx.drawImage(snapshotCanvas, 0, 0, width, height);
            } catch (err) {
              console.error('Frame capture error:', err);
            }
          }

          requestAnimationFrame(drawFrame);
        }

        requestAnimationFrame(drawFrame);

      } catch (err) {
        isRecording = false;
        reject(err);
      }
    });
  }

  function downloadVideoBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
  }

  return {
    isSupported,
    recordElement,
    stopRecording
  };
})();

if (typeof window !== 'undefined') {
  window.VideoRecorder = VideoRecorder;
}
