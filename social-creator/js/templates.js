/**
 * templates.js — Credit Republic Visual Templates Engine
 * Renders HTML canvas elements with exact brand typography, pill motifs, and color blocks.
 */

const TemplatesEngine = (function () {
  'use strict';

  // SVG Brand Marks
  const SVGS = {
    markLight: `<svg class="brand-svg-mark" viewBox="0 0 106 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="82" height="26" rx="13" fill="#2B2640" fill-opacity="0.22"/>
      <rect x="24" y="32" width="82" height="26" rx="13" fill="#FF6B4A"/>
    </svg>`,
    markDark: `<svg class="brand-svg-mark" viewBox="0 0 106 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="82" height="26" rx="13" fill="#FFF8F0" fill-opacity="0.22"/>
      <rect x="24" y="32" width="82" height="26" rx="13" fill="#FF6B4A"/>
    </svg>`,
    markMono: `<svg class="brand-svg-mark" viewBox="0 0 106 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="82" height="26" rx="13" fill="#2B2640" fill-opacity="0.3"/>
      <rect x="24" y="32" width="82" height="26" rx="13" fill="#2B2640"/>
    </svg>`,
    markMonoWhite: `<svg class="brand-svg-mark" viewBox="0 0 106 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="82" height="26" rx="13" fill="#FFF8F0" fill-opacity="0.35"/>
      <rect x="24" y="32" width="82" height="26" rx="13" fill="#FFF8F0"/>
    </svg>`,
    signatureQueue: `<svg class="sig-queue-svg" viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="4" width="38" height="16" rx="8" fill="#FF6B4A" />
      <rect x="46" y="4" width="32" height="16" rx="8" fill="currentColor" opacity="0.2" />
      <rect x="86" y="4" width="32" height="16" rx="8" fill="currentColor" opacity="0.2" />
      <rect x="126" y="4" width="32" height="16" rx="8" fill="currentColor" opacity="0.2" />
      <rect x="166" y="4" width="32" height="16" rx="8" fill="#06D6A0" />
      <rect x="206" y="4" width="32" height="16" rx="8" fill="currentColor" opacity="0.2" />
    </svg>`
  };

  /**
   * Helper to format wordmark with coral pill dot on 'i'
   */
  function formatWordmark(colorClass = '') {
    return `<div class="brand-wordmark ${colorClass}">
      <span class="wm-credit">cred<span class="i-pill">i</span>t</span>
      <span class="wm-republic">republ<span class="i-pill">i</span>c</span>
    </div>`;
  }

  /**
   * Get brand mark svg based on theme
   */
  function getBrandMark(theme, markType = 'auto') {
    if (markType === 'mono') return SVGS.markMono;
    if (markType === 'mono_white') return SVGS.markMonoWhite;
    if (theme === 'plum') return SVGS.markDark;
    return SVGS.markLight;
  }

  /**
   * Render Header (Eyebrow + Logo)
   */
  function renderHeader(postData, totalSlides = null, currentSlide = null) {
    const markSvg = getBrandMark(postData.theme, postData.markType);
    const eyebrowClass = (postData.theme === 'plum') ? 'eyebrow on-dark' : 'eyebrow';
    const isCarousel = totalSlides && currentSlide;

    return `
      <div class="post-header">
        <div class="post-header-left">
          ${postData.eyebrow ? `<span class="${eyebrowClass}">${escapeHtml(postData.eyebrow)}</span>` : ''}
          ${isCarousel ? `<span class="carousel-counter-pill">${currentSlide} / ${totalSlides}</span>` : ''}
        </div>
        <div class="post-header-brand">
          ${markSvg}
          ${postData.showWordmark !== false ? formatWordmark(postData.theme === 'plum' ? 'wm-light' : 'wm-dark') : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render Footer (Broker / Legal / Queue Signature / CTA)
   */
  function renderFooter(postData) {
    // pe fotografie, culoarea textului liber urmează fotografia (photoIsLight),
    // nu tema de fundal — regula „cream pe imagine închisă, plum pe imagine deschisă”
    const isDark = postData.bgImage ? !postData.photoIsLight : postData.theme === 'plum';
    const signalBlueBtn = postData.hasSignalBlue && postData.ctaText;

    return `
      <div class="post-footer">
        <div class="footer-left">
          ${postData.showSigQueue ? `<div class="footer-sig-queue">${SVGS.signatureQueue}</div>` : ''}
          ${postData.footerNote ? `<div class="footer-note ${isDark ? 'text-cream-70' : 'text-plum-70'}">${escapeHtml(postData.footerNote)}</div>` : ''}
        </div>
        <div class="footer-right">
          ${signalBlueBtn ? `
            <div class="footer-cta-pill cta-signal-blue">
              <span>${escapeHtml(postData.ctaText)}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          ` : (postData.ctaText ? `
            <div class="footer-cta-pill ${isDark ? 'cta-on-dark' : 'cta-default'}">
              <span>${escapeHtml(postData.ctaText)}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          ` : '')}
        </div>
      </div>
    `;
  }

  /**
   * Render Template 1: Statement / Axiom
   */
  function renderStatement(postData) {
    // pe fotografie, culoarea textului liber urmează fotografia (photoIsLight),
    // nu tema de fundal — regula „cream pe imagine închisă, plum pe imagine deschisă”
    const isDark = postData.bgImage ? !postData.photoIsLight : postData.theme === 'plum';
    return `
      <div class="post-layout layout-statement">
        ${renderHeader(postData)}
        <div class="post-body">
          <h1 class="statement-headline">${formatHighlightText(postData.title)}</h1>
          ${postData.subtitle ? `<p class="statement-lead ${isDark ? 'text-cream-70' : 'text-plum-70'}">${escapeHtml(postData.subtitle)}</p>` : ''}
        </div>
        ${renderFooter(postData)}
      </div>
    `;
  }

  /**
   * Render Template 2: Myth vs Reality
   */
  function renderMythReality(postData) {
    return `
      <div class="post-layout layout-myth-reality">
        ${renderHeader(postData)}
        <div class="post-body">
          <h2 class="post-main-title">${escapeHtml(postData.title)}</h2>
          ${postData.subtitle ? `<p class="myth-reality-lead">${escapeHtml(postData.subtitle)}</p>` : ''}
          <div class="myth-reality-cards">
            <div class="mr-card card-myth">
              <div class="mr-badge badge-myth">mitul din piață</div>
              <div class="mr-text">${escapeHtml(postData.point1 || 'Merg la banca mea pentru că primesc salariul acolo.')}</div>
            </div>
            <div class="mr-card card-reality">
              <div class="mr-badge badge-reality">realitatea</div>
              <div class="mr-text">${escapeHtml(postData.point2 || 'Fidelitatea bancară este rareori răsplătită cu cel mai mic cost total.')}</div>
            </div>
          </div>
          ${postData.point3 ? `
            <div class="mr-takeaway-pill">
              <span class="takeaway-label">concluzie:</span>
              <span class="takeaway-text">${escapeHtml(postData.point3)}</span>
            </div>
          ` : ''}
        </div>
        ${renderFooter(postData)}
      </div>
    `;
  }

  /**
   * Render Template 3: Calculator & Financial Impact
   */
  function renderCalcImpact(postData) {
    // fără cifre inventate sau ilustrative într-un chip de rezultat (regulă de brand):
    // eticheta veche/nouă e text calitativ implicit; o cifră reală apare doar dacă
    // postData chiar o furnizează (rezultat verificat, nu exemplu generic)
    const oldLabel = postData.oldRateTag || 'ofertă veche';
    const oldVal = postData.oldRateVal || 'dobânda ta actuală';
    const oldSub = postData.oldRateSub || '';
    const newLabel = postData.newRateTag || 'refinanțare';
    const newVal = postData.newRateVal || 'dobânda renegociată';
    const newSub = postData.newRateSub || '';
    const resultTitle = postData.resultTitle || 'economie posibilă la refinanțare';
    const resultVal = postData.resultVal || 'calculată individual, la verificare';

    return `
      <div class="post-layout layout-calc-impact">
        ${renderHeader(postData)}
        <div class="post-body">
          <h2 class="post-main-title">${escapeHtml(postData.title)}</h2>
          ${postData.subtitle ? `<p class="calc-subtitle">${escapeHtml(postData.subtitle)}</p>` : ''}

          <div class="calc-metrics-grid">
            <div class="calc-metric-card card-old">
              <span class="metric-tag">${escapeHtml(oldLabel)}</span>
              <span class="metric-val text-strike">${escapeHtml(oldVal)}</span>
              ${oldSub ? `<span class="metric-sub">${escapeHtml(oldSub)}</span>` : ''}
            </div>
            <div class="calc-metric-card card-new">
              <span class="metric-tag tag-mint">${escapeHtml(newLabel)}</span>
              <span class="metric-val text-mint">${escapeHtml(newVal)}</span>
              ${newSub ? `<span class="metric-sub">${escapeHtml(newSub)}</span>` : ''}
            </div>
          </div>

          <div class="confirmed-result-pill ${postData.hasSignalBlue ? 'bg-signal-blue' : 'bg-mint-pill'}">
            <div class="confirmed-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="confirmed-content">
              <span class="conf-title">${escapeHtml(resultTitle)}</span>
              <span class="conf-amount">${escapeHtml(resultVal)}</span>
            </div>
          </div>
        </div>
        ${renderFooter({ ...postData, hasSignalBlue: false })}
      </div>
    `;
  }

  /**
   * Render Template 4: Broker AVBS + AI
   */
  function renderBrokerAI(postData) {
    // pe fotografie, culoarea textului liber urmează fotografia (photoIsLight),
    // nu tema de fundal — regula „cream pe imagine închisă, plum pe imagine deschisă”
    const isDark = postData.bgImage ? !postData.photoIsLight : postData.theme === 'plum';
    return `
      <div class="post-layout layout-broker-ai">
        ${renderHeader(postData)}
        <div class="post-body">
          ${postData.title ? `<h2 class="post-main-title broker-headline">${escapeHtml(postData.title)}</h2>` : ''}
          ${postData.subtitle ? `<p class="broker-lead ${isDark ? 'text-cream-70' : 'text-plum-70'}">${escapeHtml(postData.subtitle)}</p>` : ''}
          <div class="broker-hero-row">
            <div class="broker-avatar-wrap">
              <img src="assets/Florenta Broker v2.webp" alt="Florența Nistoroiu" class="broker-img" onerror="this.src='assets/Florenta Broker.webp'">
              <div class="broker-badge-avbs">AVBS</div>
            </div>
            <div class="broker-identity">
              <h2 class="broker-name">Florența Nistoroiu</h2>
              <p class="broker-role">broker autorizat AVBS · negociator credite</p>
              <div class="broker-dual-tag">
                <span class="tag-ai">${escapeHtml(postData.aiTag || 'AI compară piața')}</span>
                <span class="tag-divider">+</span>
                <span class="tag-human">${escapeHtml(postData.humanTag || 'omul negociază')}</span>
              </div>
            </div>
          </div>

          <div class="broker-points-card ${isDark ? 'bg-plum-card' : 'bg-cream-card'}">
            <div class="point-item">
              <span class="point-bullet bullet-coral"></span>
              <span class="point-txt">${escapeHtml(postData.point1 || 'Algoritmul filtrează 100% din piață în 4 minute.')}</span>
            </div>
            <div class="point-item">
              <span class="point-bullet bullet-sunshine"></span>
              <span class="point-txt">${escapeHtml(postData.point2 || 'Florența Nistoroiu verifică actele și negociază marja direct cu banca.')}</span>
            </div>
            <div class="point-item">
              <span class="point-bullet bullet-mint"></span>
              <span class="point-txt">${escapeHtml(postData.point3 || '0 lei comision pentru tine. Plata este suportată de bancă.')}</span>
            </div>
          </div>
        </div>
        ${renderFooter(postData)}
      </div>
    `;
  }

  /**
   * Render Template 5: Steps / Process
   */
  function renderSteps(postData) {
    // pe fotografie, culoarea textului liber urmează fotografia (photoIsLight),
    // nu tema de fundal — regula „cream pe imagine închisă, plum pe imagine deschisă”
    const isDark = postData.bgImage ? !postData.photoIsLight : postData.theme === 'plum';
    return `
      <div class="post-layout layout-steps">
        ${renderHeader(postData)}
        <div class="post-body">
          <h2 class="post-main-title">${escapeHtml(postData.title)}</h2>
          ${postData.subtitle ? `<p class="steps-lead ${isDark ? 'text-cream-70' : 'text-plum-70'}">${escapeHtml(postData.subtitle)}</p>` : ''}
          
          <div class="steps-list">
            <div class="step-card">
              <div class="step-num-pill">01</div>
              <div class="step-content">
                <span class="step-label">precalificare online</span>
                <span class="step-desc">${escapeHtml(postData.point1 || 'Toate băncile comparate în 4 minute, fără interogare la birou.')}</span>
              </div>
            </div>
            <div class="step-card">
              <div class="step-num-pill">02</div>
              <div class="step-content">
                <span class="step-label">analiză & negociere</span>
                <span class="step-desc">${escapeHtml(postData.point2 || 'Florența Nistoroiu (broker AVBS) preia dosarul și optimizează oferta.')}</span>
              </div>
            </div>
            <div class="step-card">
              <div class="step-num-pill">03</div>
              <div class="step-content">
                <span class="step-label">semnare & 0 lei comision</span>
                <span class="step-desc">${escapeHtml(postData.point3 || 'Mergi la bancă doar pentru semnare. Serviciul este gratuit pentru tine.')}</span>
              </div>
            </div>
          </div>
        </div>
        ${renderFooter(postData)}
      </div>
    `;
  }

  /**
   * Render Template 6: Checklist
   */
  function renderChecklist(postData) {
    return `
      <div class="post-layout layout-checklist">
        ${renderHeader(postData)}
        <div class="post-body">
          <h2 class="post-main-title">${escapeHtml(postData.title)}</h2>
          ${postData.subtitle ? `<p class="checklist-lead">${escapeHtml(postData.subtitle)}</p>` : ''}
          
          <div class="checklist-items">
            <div class="check-item">
              <div class="check-icon">✓</div>
              <div class="check-text">${escapeHtml(postData.point1 || 'Verifică dacă veniturile non-salariale sunt acceptate 100%')}</div>
            </div>
            <div class="check-item">
              <div class="check-icon">✓</div>
              <div class="check-text">${escapeHtml(postData.point2 || 'Calculează costul total incluzând asigurările obligatorii')}</div>
            </div>
            <div class="check-item">
              <div class="check-icon">✓</div>
              <div class="check-text">${escapeHtml(postData.point3 || 'Compară toate băncile înainte de depunerea actelor finale')}</div>
            </div>
          </div>
        </div>
        ${renderFooter(postData)}
      </div>
    `;
  }

  /**
   * Render Template 7: Side-by-Side Comparison
   */
  function renderComparison(postData) {
    const oldItems = (postData.oldItems && postData.oldItems.length) ? postData.oldItems : [
      '5 drumuri la 5 sucursale', 'formulare repetate de 5 ori', 'fără pârghie de negociere'
    ];
    const newItems = (postData.newItems && postData.newItems.length) ? postData.newItems : [
      '1 singură aplicare online', 'toate băncile comparate', 'broker autorizat AVBS dedicat'
    ];
    return `
      <div class="post-layout layout-comparison">
        ${renderHeader(postData)}
        <div class="post-body">
          <h2 class="post-main-title">${escapeHtml(postData.title)}</h2>
          ${postData.subtitle ? `<p class="comparison-lead">${escapeHtml(postData.subtitle)}</p>` : ''}

          <div class="comp-table">
            <div class="comp-col col-old">
              <div class="comp-col-header">${escapeHtml(postData.oldColHeader || 'pe cont propriu')}</div>
              ${oldItems.map(item => `<div class="comp-item"><span class="comp-cross">✕</span> ${escapeHtml(item)}</div>`).join('')}
            </div>
            <div class="comp-col col-cr">
              <div class="comp-col-header">${escapeHtml(postData.newColHeader || 'credit republic')}</div>
              ${newItems.map(item => `<div class="comp-item"><span class="comp-check">✓</span> ${escapeHtml(item)}</div>`).join('')}
            </div>
          </div>
        </div>
        ${renderFooter(postData)}
      </div>
    `;
  }

  /**
   * Render a Single Slide for Carousel Mode
   */
  function renderCarouselSlide(postData, slideIndex, totalSlides) {
    const slide = postData.slides[slideIndex] || postData.slides[0];
    const isLast = slideIndex === totalSlides - 1;
    const isFirst = slideIndex === 0;

    const slideData = {
      ...postData,
      eyebrow: slide.eyebrow || postData.eyebrow,
      title: slide.title,
      subtitle: slide.body,
      ctaText: isLast ? (postData.ctaText || 'vezi poziția ta') : 'glisează →',
      hasSignalBlue: isLast && postData.hasSignalBlue
    };

    return `
      <div class="post-layout layout-carousel-slide ${isFirst ? 'slide-first' : ''} ${isLast ? 'slide-last' : ''}">
        ${renderHeader(slideData, totalSlides, slideIndex + 1)}
        <div class="post-body slide-body">
          <div class="slide-content-wrap">
            <h2 class="slide-main-headline">${formatHighlightText(slide.title)}</h2>
            ${slide.body ? `<p class="slide-lead-text">${escapeHtml(slide.body)}</p>` : ''}
          </div>
          ${!isLast ? `
            <div class="slide-swipe-indicator">
              <span>continuă</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          ` : ''}
        </div>
        ${renderFooter(slideData)}
      </div>
    `;
  }

  /**
   * Master Render Function
   */
  function render(postData, options = {}) {
    const templateType = postData.templateType || 'statement';
    const isCarousel = options.isCarousel || false;
    const slideIndex = options.slideIndex || 0;
    const totalSlides = (postData.slides && postData.slides.length) || 1;

    let contentHtml = '';

    if (isCarousel) {
      contentHtml = renderCarouselSlide(postData, slideIndex, totalSlides);
    } else {
      switch (templateType) {
        case 'statement':
          contentHtml = renderStatement(postData);
          break;
        case 'myth_reality':
          contentHtml = renderMythReality(postData);
          break;
        case 'calc_impact':
          contentHtml = renderCalcImpact(postData);
          break;
        case 'broker_ai':
          contentHtml = renderBrokerAI(postData);
          break;
        case 'steps':
          contentHtml = renderSteps(postData);
          break;
        case 'checklist':
          contentHtml = renderChecklist(postData);
          break;
        case 'comparison':
          contentHtml = renderComparison(postData);
          break;
        default:
          contentHtml = renderStatement(postData);
      }
    }

    const themeClass = `theme-${postData.theme || 'plum'}`;
    const formatClass = `format-${(postData.format || '1:1').replace(':', '-')}`;
    const bgFilterStyle = postData.imageFilter ? `filter: ${postData.imageFilter};` : '';
    const bgImageStyle = postData.bgImage ? `background-image: url('${postData.bgImage}'); background-size: cover; background-position: center; ${bgFilterStyle}` : '';
    // regula: nicio pastilă peste fotografie — text liber în loc. vezi brand-templates.css
    // textPosition alege banda liberă de subiect a fotografiei ('cap' implicit, 'talpa' când
    // subiectul fotografiei ocupă partea de sus a cadrului)
    const onPhotoClass = postData.bgImage
      ? `on-photo${postData.photoIsLight ? ' on-photo--plum' : ''}${postData.textPosition === 'talpa' ? ' on-photo--talpa' : ''}`
      : '';

    const showStoryProgress = postData.format === '9:16' || postData.showProgressBar;

    return `
      <div id="social-post-canvas" class="post-canvas-wrapper ${themeClass} ${formatClass} ${onPhotoClass}" style="${bgImageStyle}">
        ${showStoryProgress ? `
          <div class="story-progress-container">
            <div class="story-progress-bar"><div class="story-progress-fill"></div></div>
          </div>
        ` : ''}
        ${contentHtml}
      </div>
    `;
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatHighlightText(text) {
    if (!text) return '';
    // Format sentence case and highlight key terms with pastel pill spans
    let safe = escapeHtml(text);
    return safe;
  }

  return {
    SVGS,
    render,
    renderCarouselSlide
  };
})();

if (typeof window !== 'undefined') {
  window.TemplatesEngine = TemplatesEngine;
}
