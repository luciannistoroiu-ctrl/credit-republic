/**
 * Brand tokens — mirrors social-creator/css/brand-templates.css so this
 * pipeline and the /animatie-video pipeline draw from the same source of truth.
 * If the CSS file's --cream/--plum/--coral/--sunshine/--mint/--semnal values
 * ever change, update them here too.
 */
export const colors = {
  cream: '#FFF8F0',
  plum: '#2B2640',
  coral: '#FF6B4A',
  sunshine: '#FFD166',
  mint: '#06D6A0',
  // rezervat: rezultat confirmat / buton activ — max o dată pe ecran.
  signal: '#2C86F6',
} as const;

export const fonts = {
  // Omnes cere licență Adobe Fonts (kit web); Plus Jakarta Sans e fallback-ul
  // brand-ului însuși în social-creator, deci e alegerea corectă cât timp
  // KIT_ID de Typekit nu e conectat aici.
  display: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
} as const;

// easing identic cu startCounterAnimation() din social-creator/js/motion-engine.js —
// 1 - (1-progress)^3 — ca numărătorile din remotion să se simtă din aceeași familie.
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
