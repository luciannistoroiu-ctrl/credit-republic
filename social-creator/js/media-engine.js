/**
 * media-engine.js — AI Image Prompts, Asset Studio & Brand Image Filters for Credit Republic
 */

const MediaEngine = (function () {
  'use strict';

  // Curated Brand Asset Library
  const ASSETS = [
    {
      id: 'asset_phone_desk',
      name: 'Telefon & Birou (Candid)',
      category: 'lifestyle',
      path: 'assets/photo_phone_desk.jpg',
      desc: 'Mâini pe birou de lemn cu smartphone și lumină caldă de dimineață.'
    },
    {
      id: 'asset_modern_interior',
      name: 'Interior Arhitectural Minimalist',
      category: 'architecture',
      path: 'assets/photo_modern_interior.jpg',
      desc: 'Living scandinav modern cu pereți crem și umbre geometrice.'
    },
    {
      id: 'asset_florenta_avatar',
      name: 'Florența Nistoroiu (Broker AVBS)',
      category: 'broker',
      path: 'assets/Florenta Broker v2.webp',
      desc: 'Portret profesional broker autorizat AVBS.'
    }
  ];

  // AI Prompt Templates tailored for Credit Republic
  const AI_PROMPTS = [
    {
      id: 'prompt_candid_phone',
      title: 'Candid: Verificare rate pe telefon',
      prompt: 'Candid close-up editorial photo of hands holding a smartphone on a clean minimalist desk with warm natural sunlight, ceramic cup, soft shadows, warm cream and wood tones, realistic lifestyle photography, authentic, no forced poses, no stock cliches.'
    },
    {
      id: 'prompt_scandinavian_home',
      title: 'Imobiliar: Living cald cu lumină naturală',
      prompt: 'Clean contemporary living room interior with warm architectural sunlight casting soft geometric shadows on cream plaster wall, subtle minimalist wooden furniture, airy, sophisticated, no people.'
    },
    {
      id: 'prompt_signing_keys',
      title: 'Semnare: Detaliu document & stilou pe birou',
      prompt: 'Minimalist close-up of a contract folder, elegant pen, and espresso cup on a natural oak table in soft morning light, editorial business magazine style, cinematic and authentic.'
    },
    {
      id: 'prompt_urban_facade',
      title: 'Arhitectură: Fațadă rezidențială contemporană',
      prompt: 'Modern architectural building facade with clean geometric lines, large windows reflecting warm golden hour sky, elegant urban residential design in Bucharest, realistic photo.'
    }
  ];

  // Brand Image Filters (CSS Filter strings)
  const FILTERS = [
    { id: 'filter_none', name: 'Original', css: 'none' },
    { id: 'filter_warm_cream', name: 'Warm Cream (#FFF8F0)', css: 'sepia(0.15) brightness(1.02) contrast(1.05)' },
    { id: 'filter_plum_shadow', name: 'Plum Contrast', css: 'contrast(1.15) brightness(0.95) saturate(1.05)' },
    { id: 'filter_candid_matte', name: 'Matte Editorial', css: 'contrast(0.95) brightness(1.04) saturate(0.9)' },
    { id: 'filter_soft_blur', name: 'Glassmorphic Soft', css: 'blur(2px) brightness(0.9)' }
  ];

  /**
   * Handle Custom File Upload (converts to base64 DataURL)
   */
  function handleImageUpload(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Fișierul selectat nu este o imagine validă.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  return {
    ASSETS,
    AI_PROMPTS,
    FILTERS,
    handleImageUpload
  };
})();

if (typeof window !== 'undefined') {
  window.MediaEngine = MediaEngine;
}
