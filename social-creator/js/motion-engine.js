/**
 * motion-engine.js — Credit Republic Motion & Kinetic Animation Controller
 * Implements continuous, slow motion in one direction adhering to brand brief.
 */

const MotionEngine = (function () {
  'use strict';

  const PRESETS = [
    {
      id: 'motion_story_progress',
      name: 'Story / Reel Progress Bar',
      desc: 'Bară de derulare lentă continuă, ideală pentru formatul 9:16.',
      class: 'motion-active'
    },
    {
      id: 'motion_rate_counter',
      name: 'Numărătoare Rate & Economie',
      desc: 'Animație a procentului de dobândă și a economiei calculate.',
      class: 'motion-counter-active'
    },
    {
      id: 'motion_queue_scan',
      name: 'Scanare Coada de Oferte',
      desc: 'Scanare luminoasă continuă de la stânga la dreapta.',
      class: 'motion-queue-active'
    },
    {
      id: 'motion_gentle_drift',
      name: 'Plutire Cursivă (Gentle Drift)',
      desc: 'Mișcare lentă a titlului și a elementelor de accent.',
      class: 'motion-drift-active'
    },
    {
      id: 'motion_kinetic_type',
      name: 'Kinetic Typography (Cuvânt cu cuvânt)',
      desc: 'Apariție secvențială lentă a textului pe ecran.',
      class: 'motion-kinetic-active'
    },
    {
      id: 'motion_foto_deriva',
      name: 'Foto cu mișcare (Ken Burns)',
      desc: 'Zoom și derivă lentă, continuă, pe fotografia de fundal (bgImage). Fără efect dacă postarea nu are fotografie.',
      class: 'motion-photo-active'
    }
  ];

  let isPlaying = true;
  let currentPreset = 'motion_story_progress';
  let durationSeconds = 5;
  let counterInterval = null;

  /**
   * Apply motion classes to canvas wrapper
   */
  function applyMotion(wrapperEl, presetId = currentPreset, duration = durationSeconds) {
    if (!wrapperEl) return;

    // Clear old classes
    PRESETS.forEach(p => wrapperEl.classList.remove(p.class));

    if (!isPlaying) return;

    const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    wrapperEl.classList.add(preset.class);
    wrapperEl.style.setProperty('--motion-duration', `${duration}s`);

    // If kinetic typography is selected, split text
    if (presetId === 'motion_kinetic_type') {
      splitKineticText(wrapperEl);
    }

    // If rate counter is selected, start animated numbers
    if (presetId === 'motion_rate_counter') {
      startCounterAnimation(wrapperEl, duration);
    }
  }

  /**
   * Split headline into kinetic words with staggered delay
   */
  function splitKineticText(wrapperEl) {
    const headline = wrapperEl.querySelector('.statement-headline, .post-main-title, .slide-main-headline');
    if (!headline || headline.dataset.kineticized) return;

    const words = headline.innerText.split(' ');
    headline.innerHTML = words.map((w, idx) => `
      <span class="kinetic-word" style="animation-delay: ${idx * 0.12}s;">${w}&nbsp;</span>
    `).join('');
    headline.dataset.kineticized = 'true';
  }

  /**
   * Animate numeric interest rates & savings
   */
  function startCounterAnimation(wrapperEl, duration = 5) {
    if (counterInterval) clearInterval(counterInterval);

    const oldRateEl = wrapperEl.querySelector('.card-old .metric-val');
    const newRateEl = wrapperEl.querySelector('.card-new .metric-val');
    const savingAmountEl = wrapperEl.querySelector('.conf-amount');

    if (!newRateEl && !savingAmountEl) return;

    let start = performance.now();
    const durationMs = duration * 1000;

    function frame(now) {
      let elapsed = (now - start) % durationMs;
      let progress = elapsed / durationMs;
      
      // Smooth ease-out
      let ease = 1 - Math.pow(1 - progress, 3);

      if (newRateEl) {
        let currentRate = (7.90 - (7.90 - 5.75) * ease).toFixed(2);
        newRateEl.innerText = `${currentRate}%`;
      }

      if (savingAmountEl) {
        let currentSavings = Math.round(2880 * ease);
        savingAmountEl.innerText = `${currentSavings.toLocaleString('ro-RO')} lei economisiți`;
      }

      if (isPlaying) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  function setPlaying(playing) {
    isPlaying = playing;
  }

  function setDuration(sec) {
    durationSeconds = sec;
  }

  return {
    PRESETS,
    applyMotion,
    setPlaying,
    setDuration
  };
})();

if (typeof window !== 'undefined') {
  window.MotionEngine = MotionEngine;
}
