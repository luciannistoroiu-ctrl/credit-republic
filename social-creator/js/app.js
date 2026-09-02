/**
 * app.js — Main Controller for Credit Republic Social Media Studio
 * 3-Step Guided Wizard: Step 1 (Tip Postare & Șablon) -> Step 2 (Conținut) -> Step 3 (Prompt AI & Export)
 */

(function () {
  'use strict';

  // Global Studio State
  const state = {
    currentStep: 1, // 1: Tip & Șablon, 2: Conținut, 3: Prompt & Export
    selectedPostType: 'graphic_text',
    promptMode: 'photo', // 'photo' | 'video'
    activeAngleId: '01_mecanismul',
    activeRegisterId: 'observational',
    activePresetId: 'p_01_master_statement',
    previewMode: 'canvas', // 'canvas' | 'instagram'
    isCarouselMode: false,
    currentSlideIndex: 0,
    
    // Motion & Video State
    isMotionPlaying: true,
    activeMotionPreset: 'motion_story_progress',
    videoDuration: 5, // in seconds
    isRecording: false,

    postData: {
      angleId: '01_mecanismul',
      theme: 'plum',
      format: '1:1',
      templateType: 'statement',
      eyebrow: 'obiceiul din piață',
      title: 'nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.',
      subtitle: 'inerția este cel mai scump comision pe care îl plătești când cumperi o casă.',
      point1: '',
      point2: '',
      point3: '',
      footerNote: 'credit republic · neobroker de credite',
      ctaText: '',
      hasSignalBlue: false,
      showWordmark: true,
      showSigQueue: false,
      showProgressBar: false,
      markType: 'auto',
      bgImage: '',
      imageFilter: '',
      caption: '',
      slides: []
    }
  };

  // DOM Elements cache
  let dom = {};

  function init() {
    cacheDom();
    bindEvents();
    renderPostTypesList();
    renderAnglesList();
    renderMediaAssets();
    renderAiPrompts();
    renderVideoPrompts();
    loadPreset(state.activePresetId);
    applyPostTypeConfig(state.selectedPostType);
    initCSOS();
    goToStep(1);
    updatePreview();
  }

  function cacheDom() {
    dom = {
      viewportStage: document.getElementById('viewport-stage'),
      anglesScroller: document.getElementById('angles-scroller'),
      presetsList: document.getElementById('presets-list'),
      postTypesGrid: document.getElementById('post-types-grid'),
      
      // Stepper
      stepTabs: document.querySelectorAll('.step-tab'),
      stepPanes: document.querySelectorAll('.step-pane'),
      btnStep1Next: document.getElementById('btn-step1-next'),
      btnStep2Prev: document.getElementById('btn-step2-prev'),
      btnStep2Next: document.getElementById('btn-step2-next'),
      btnStep3Prev: document.getElementById('btn-step3-prev'),

      // Inputs (Step 2)
      inputEyebrow: document.getElementById('input-eyebrow'),
      inputTitle: document.getElementById('input-title'),
      inputSubtitle: document.getElementById('input-subtitle'),
      inputPoint1: document.getElementById('input-point1'),
      inputPoint2: document.getElementById('input-point2'),
      inputPoint3: document.getElementById('input-point3'),
      inputFooterNote: document.getElementById('input-footer-note'),
      inputCta: document.getElementById('input-cta'),
      inputCaption: document.getElementById('input-caption'),
      checkSignalBlue: document.getElementById('check-signal-blue'),
      checkWordmark: document.getElementById('check-wordmark'),
      checkSigQueue: document.getElementById('check-sig-queue'),
      checkProgressBar: document.getElementById('check-progress-bar'),
      selectTemplate: document.getElementById('select-template'),
      selectBgImage: document.getElementById('select-bg-image'),
      selectFilter: document.getElementById('select-filter'),
      inputCustomUpload: document.getElementById('input-custom-upload'),

      // Carousel controls
      carouselToggleBtn: document.getElementById('btn-carousel-mode'),
      carouselNavWrap: document.getElementById('carousel-slide-nav'),
      slideCounterLabel: document.getElementById('slide-counter-label'),
      btnPrevSlide: document.getElementById('btn-prev-slide'),
      btnNextSlide: document.getElementById('btn-next-slide'),
      btnAddSlide: document.getElementById('btn-add-slide'),
      btnDeleteSlide: document.getElementById('btn-delete-slide'),

      // Step 3 (AI Dynamic Prompt & Media)
      aiDynamicPromptText: document.getElementById('ai-dynamic-prompt-text'),
      btnPromptTypePhoto: document.getElementById('btn-prompt-type-photo'),
      btnPromptTypeVideo: document.getElementById('btn-prompt-type-video'),
      btnCopyDynamicPrompt: document.getElementById('btn-copy-dynamic-prompt'),
      btnRegeneratePrompt: document.getElementById('btn-regenerate-prompt'),
      btnApplyRecommendedPhoto: document.getElementById('btn-apply-recommended-photo'),
      selectMotionPreset: document.getElementById('select-motion-preset'),
      rangeDuration: document.getElementById('range-duration'),
      labelDuration: document.getElementById('label-duration'),
      btnToggleMotion: document.getElementById('btn-toggle-motion'),
      btnRecordVideo: document.getElementById('btn-record-video'),
      btnRecordVideoTop: document.getElementById('btn-record-video-top'),
      mediaAssetsGrid: document.getElementById('media-assets-grid'),
      aiPromptsList: document.getElementById('ai-prompts-list'),
      videoPromptsList: document.getElementById('video-prompts-list'),

      // Compliance
      compScoreBadge: document.getElementById('comp-score-badge'),
      compIssuesList: document.getElementById('comp-issues-list'),
      btnAutofixAll: document.getElementById('btn-autofix-all'),
      topCompliancePill: document.getElementById('top-compliance-pill'),

      // Caption & Export
      captionPreviewText: document.getElementById('caption-preview-text'),
      btnCopyCaption: document.getElementById('btn-copy-caption'),
      btnExportPng: document.getElementById('btn-export-png'),
      btnExportCarousel: document.getElementById('btn-export-carousel'),

      // Preview Modes
      modeBtns: document.querySelectorAll('.mode-btn'),

      // CSOS Elements
      selectPersona: document.getElementById('select-persona'),
      btnGenerateScript: document.getElementById('btn-generate-script'),
      csosScriptInput: document.getElementById('csos-script-input'),
      btnGradeScript: document.getElementById('btn-grade-script'),
      btnExportJson: document.getElementById('btn-export-json'),
      csosGraderResults: document.getElementById('csos-grader-results'),
      csosScoreBadge: document.getElementById('csos-score-badge'),
      csosFeedbackList: document.getElementById('csos-feedback-list')
    };
  }

  function bindEvents() {
    // Stepper navigation
    dom.stepTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stepRaw = tab.dataset.step;
        const step = stepRaw === 'csos' ? 'csos' : parseInt(stepRaw, 10);
        goToStep(step);
      });
    });

    if (dom.btnStep1Next) dom.btnStep1Next.addEventListener('click', () => goToStep(2));
    if (dom.btnStep2Prev) dom.btnStep2Prev.addEventListener('click', () => goToStep(1));
    if (dom.btnStep2Next) dom.btnStep2Next.addEventListener('click', () => goToStep(3));
    if (dom.btnStep3Prev) dom.btnStep3Prev.addEventListener('click', () => goToStep(2));

    // CSOS 
    if (dom.btnGenerateScript) dom.btnGenerateScript.addEventListener('click', handleCSOSGenerate);
    if (dom.btnGradeScript) dom.btnGradeScript.addEventListener('click', handleCSOSGrade);
    if (dom.btnExportJson) dom.btnExportJson.addEventListener('click', handleCSOSExport);

    // Theme swatches
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        state.postData.theme = swatch.dataset.theme;
        updatePreview();
      });
    });

    // Format buttons
    document.querySelectorAll('.btn-format').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-format').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.postData.format = btn.dataset.format;
        updatePreview();
      });
    });

    // Preview Mode buttons
    dom.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.previewMode = btn.dataset.mode;
        updatePreview();
      });
    });

    // Form Inputs real-time listener
    const bindInput = (el, key) => {
      if (!el) return;
      el.addEventListener('input', (e) => {
        state.postData[key] = e.target.value;
        if (state.isCarouselMode && state.postData.slides[state.currentSlideIndex]) {
          if (key === 'title') state.postData.slides[state.currentSlideIndex].title = e.target.value;
          if (key === 'subtitle') state.postData.slides[state.currentSlideIndex].body = e.target.value;
        }
        updatePreview();
        updateDynamicAiPrompt();
      });
    };

    bindInput(dom.inputEyebrow, 'eyebrow');
    bindInput(dom.inputTitle, 'title');
    bindInput(dom.inputSubtitle, 'subtitle');
    bindInput(dom.inputPoint1, 'point1');
    bindInput(dom.inputPoint2, 'point2');
    bindInput(dom.inputPoint3, 'point3');
    bindInput(dom.inputFooterNote, 'footerNote');
    bindInput(dom.inputCta, 'ctaText');
    bindInput(dom.inputCaption, 'caption');

    // Checkboxes & Selects
    if (dom.checkSignalBlue) {
      dom.checkSignalBlue.addEventListener('change', (e) => {
        state.postData.hasSignalBlue = e.target.checked;
        updatePreview();
      });
    }

    if (dom.checkWordmark) {
      dom.checkWordmark.addEventListener('change', (e) => {
        state.postData.showWordmark = e.target.checked;
        updatePreview();
      });
    }

    if (dom.checkSigQueue) {
      dom.checkSigQueue.addEventListener('change', (e) => {
        state.postData.showSigQueue = e.target.checked;
        updatePreview();
      });
    }

    if (dom.checkProgressBar) {
      dom.checkProgressBar.addEventListener('change', (e) => {
        state.postData.showProgressBar = e.target.checked;
        updatePreview();
      });
    }

    if (dom.selectTemplate) {
      dom.selectTemplate.addEventListener('change', (e) => {
        state.postData.templateType = e.target.value;
        updatePreview();
      });
    }

    if (dom.selectBgImage) {
      dom.selectBgImage.addEventListener('change', (e) => {
        state.postData.bgImage = e.target.value;
        updatePreview();
      });
    }

    if (dom.selectFilter) {
      dom.selectFilter.addEventListener('change', (e) => {
        state.postData.imageFilter = e.target.value;
        updatePreview();
      });
    }

    // Custom Image Upload
    if (dom.inputCustomUpload) {
      dom.inputCustomUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const dataUrl = await MediaEngine.handleImageUpload(file);
            state.postData.bgImage = dataUrl;
            updatePreview();
            showToast('Imaginea a fost încărcată cu succes!');
          } catch (err) {
            showToast(err.message);
          }
        }
      });
    }

    // Step 3: Dynamic AI Prompt handlers (Photo vs Video)
    if (dom.btnPromptTypePhoto) {
      dom.btnPromptTypePhoto.addEventListener('click', () => {
        state.promptMode = 'photo';
        dom.btnPromptTypePhoto.classList.add('active');
        dom.btnPromptTypeVideo.classList.remove('active');
        updateDynamicAiPrompt();
      });
    }

    if (dom.btnPromptTypeVideo) {
      dom.btnPromptTypeVideo.addEventListener('click', () => {
        state.promptMode = 'video';
        dom.btnPromptTypeVideo.classList.add('active');
        dom.btnPromptTypePhoto.classList.remove('active');
        updateDynamicAiPrompt();
      });
    }

    if (dom.btnCopyDynamicPrompt) {
      dom.btnCopyDynamicPrompt.addEventListener('click', async () => {
        if (dom.aiDynamicPromptText) {
          await Exporter.copyToClipboard(dom.aiDynamicPromptText.innerText);
          const typeLabel = state.promptMode === 'video' ? 'video (Runway/Sora/Luma)' : 'imagine';
          showToast(`Prompt-ul AI pentru ${typeLabel} a fost copiat în clipboard!`);
        }
      });
    }

    if (dom.btnRegeneratePrompt) {
      dom.btnRegeneratePrompt.addEventListener('click', () => {
        updateDynamicAiPrompt();
        showToast('Prompt-ul AI a fost regenerat pe baza conținutului actual!');
      });
    }

    if (dom.btnApplyRecommendedPhoto) {
      dom.btnApplyRecommendedPhoto.addEventListener('click', () => {
        const type = CopyEngine.POST_TYPES.find(t => t.id === state.selectedPostType);
        if (type && type.defaultPhoto) {
          state.postData.bgImage = type.defaultPhoto;
        } else {
          state.postData.bgImage = 'assets/photo_phone_desk.jpg';
        }
        updatePreview();
        showToast('Fotografia editorială recomandată a fost aplicată pe canvas!');
      });
    }

    // Motion controls
    if (dom.selectMotionPreset) {
      dom.selectMotionPreset.addEventListener('change', (e) => {
        state.activeMotionPreset = e.target.value;
        updatePreview();
      });
    }

    if (dom.rangeDuration) {
      dom.rangeDuration.addEventListener('input', (e) => {
        state.videoDuration = parseInt(e.target.value, 10);
        if (dom.labelDuration) dom.labelDuration.innerText = `${state.videoDuration}s`;
        MotionEngine.setDuration(state.videoDuration);
        updatePreview();
      });
    }

    if (dom.btnToggleMotion) {
      dom.btnToggleMotion.addEventListener('click', () => {
        state.isMotionPlaying = !state.isMotionPlaying;
        MotionEngine.setPlaying(state.isMotionPlaying);
        dom.btnToggleMotion.innerText = state.isMotionPlaying ? '⏸ Pauză Animație' : '▶ Pornește Animația';
        updatePreview();
      });
    }

    // Video Recording Handlers
    const handleVideoRecord = async () => {
      const canvasEl = document.getElementById('social-post-canvas');
      if (!canvasEl) return;

      if (!VideoRecorder.isSupported()) {
        showToast('Înregistrarea video nu este suportată de acest browser.');
        return;
      }

      try {
        state.isRecording = true;
        showToast(`Înregistrare video (${state.videoDuration}s)...`);
        
        await VideoRecorder.recordElement(canvasEl, state.videoDuration, (current, total) => {
          showToast(`Înregistrare: ${current}s / ${total}s`);
        });

        state.isRecording = false;
        showToast('Video generat și descărcat cu succes (MP4/WebM 60FPS)!');
      } catch (err) {
        state.isRecording = false;
        console.error('Video record error:', err);
        showToast('Eroare la înregistrarea video.');
      }
    };

    if (dom.btnRecordVideo) dom.btnRecordVideo.addEventListener('click', handleVideoRecord);
    if (dom.btnRecordVideoTop) dom.btnRecordVideoTop.addEventListener('click', handleVideoRecord);

    // Carousel Mode Toggle
    if (dom.carouselToggleBtn) {
      dom.carouselToggleBtn.addEventListener('click', () => {
        state.isCarouselMode = !state.isCarouselMode;
        dom.carouselToggleBtn.classList.toggle('active', state.isCarouselMode);
        dom.carouselNavWrap.style.display = state.isCarouselMode ? 'flex' : 'none';
        if (dom.btnExportCarousel) {
          dom.btnExportCarousel.style.display = state.isCarouselMode ? 'inline-flex' : 'none';
        }
        if (state.isCarouselMode && (!state.postData.slides || state.postData.slides.length === 0)) {
          state.postData.slides = [
            { eyebrow: state.postData.eyebrow, title: state.postData.title, body: state.postData.subtitle },
            { eyebrow: 'explicație', title: 'de ce contează pentru tine', body: 'Fiecare 0.5% economisit înseamnă mii de lei.' },
            { eyebrow: 'concluzie', title: 'verifică piața gratuit', body: '0 lei comision. Toate băncile comparate.' }
          ];
        }
        state.currentSlideIndex = 0;
        syncFormWithCurrentSlide();
        updatePreview();
      });
    }

    // Carousel Navigation
    if (dom.btnPrevSlide) {
      dom.btnPrevSlide.addEventListener('click', () => {
        if (state.currentSlideIndex > 0) {
          state.currentSlideIndex--;
          syncFormWithCurrentSlide();
          updatePreview();
        }
      });
    }

    if (dom.btnNextSlide) {
      dom.btnNextSlide.addEventListener('click', () => {
        const total = (state.postData.slides && state.postData.slides.length) || 1;
        if (state.currentSlideIndex < total - 1) {
          state.currentSlideIndex++;
          syncFormWithCurrentSlide();
          updatePreview();
        }
      });
    }

    if (dom.btnAddSlide) {
      dom.btnAddSlide.addEventListener('click', () => {
        const total = state.postData.slides.length;
        state.postData.slides.push({
          eyebrow: `pasul 0${total + 1}`,
          title: `slide nou 0${total + 1}`,
          body: 'descrierea noului slide de prezentare...'
        });
        state.currentSlideIndex = state.postData.slides.length - 1;
        syncFormWithCurrentSlide();
        updatePreview();
      });
    }

    if (dom.btnDeleteSlide) {
      dom.btnDeleteSlide.addEventListener('click', () => {
        if (state.postData.slides.length > 1) {
          state.postData.slides.splice(state.currentSlideIndex, 1);
          if (state.currentSlideIndex >= state.postData.slides.length) {
            state.currentSlideIndex = state.postData.slides.length - 1;
          }
          syncFormWithCurrentSlide();
          updatePreview();
        }
      });
    }

    // Auto-fix All issues
    if (dom.btnAutofixAll) {
      dom.btnAutofixAll.addEventListener('click', () => {
        state.postData = BrandValidator.autoFixAll(state.postData);
        populateFormFromState();
        updatePreview();
        showToast('Toate regulile de brand au fost aplicate automat!');
      });
    }

    // Copy Caption
    if (dom.btnCopyCaption) {
      dom.btnCopyCaption.addEventListener('click', async () => {
        const fullCaption = dom.captionPreviewText.innerText;
        await Exporter.copyToClipboard(fullCaption);
        showToast('Textul postării și hashtag-urile au fost copiate!');
      });
    }

    // Export Single PNG
    if (dom.btnExportPng) {
      dom.btnExportPng.addEventListener('click', async () => {
        const canvasEl = document.getElementById('social-post-canvas');
        if (canvasEl) {
          showToast('Generare imagine PNG de înaltă rezoluție (2x)...');
          await Exporter.exportToPNG(canvasEl, `credit-republic-post-${Date.now()}.png`, 2);
          showToast('Imaginea a fost descărcată cu succes!');
        }
      });
    }

    // Export Full Carousel
    if (dom.btnExportCarousel) {
      dom.btnExportCarousel.addEventListener('click', async () => {
        showToast('Se generează toate slide-urile caruselului...');
        await Exporter.exportCarouselSlides(state.postData, TemplatesEngine.render, (current, total) => {
          showToast(`Descărcare slide ${current} din ${total}...`);
        });
        showToast('Toate slide-urile au fost descărcate!');
      });
    }
  }

  function goToStep(stepNum) {
    state.currentStep = stepNum;
    dom.stepTabs.forEach(tab => {
      const tabStepRaw = tab.dataset.step;
      const tabStep = tabStepRaw === 'csos' ? 'csos' : parseInt(tabStepRaw, 10);
      tab.classList.toggle('active', tabStep === stepNum);
      if (typeof tabStep === 'number' && typeof stepNum === 'number') {
        tab.classList.toggle('completed', tabStep < stepNum);
      } else {
        tab.classList.toggle('completed', false);
      }
    });

    dom.stepPanes.forEach(pane => {
      const paneStepRaw = pane.dataset.step;
      const paneStep = paneStepRaw === 'csos' ? 'csos' : parseInt(paneStepRaw, 10);
      if (paneStep === stepNum) {
        pane.classList.add('active');
        pane.style.display = 'flex';
      } else {
        pane.classList.remove('active');
        pane.style.display = 'none';
      }
    });

    if (stepNum === 3) {
      updateDynamicAiPrompt();
    }
  }

  function renderPostTypesList() {
    if (!dom.postTypesGrid) return;
    dom.postTypesGrid.innerHTML = CopyEngine.POST_TYPES.map(type => `
      <div class="post-type-card ${type.id === state.selectedPostType ? 'active' : ''}" data-type-id="${type.id}">
        <div class="post-type-icon">${type.icon}</div>
        <div class="post-type-info">
          <span class="post-type-name">${type.name}</span>
          <span class="post-type-desc">${type.desc}</span>
        </div>
      </div>
    `).join('');

    dom.postTypesGrid.querySelectorAll('.post-type-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectedPostType = card.dataset.typeId;
        dom.postTypesGrid.querySelectorAll('.post-type-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        applyPostTypeConfig(state.selectedPostType);
        updatePreview();
        updateDynamicAiPrompt();
        showToast(`Format configurat: ${card.querySelector('.post-type-name').innerText}`);
      });
    });
  }

  function applyPostTypeConfig(typeId) {
    const type = CopyEngine.POST_TYPES.find(t => t.id === typeId) || CopyEngine.POST_TYPES[0];
    state.postData.theme = type.recommendedTheme || state.postData.theme;
    state.postData.format = type.recommendedFormat || state.postData.format;
    
    if (type.hasPhoto) {
      state.postData.bgImage = type.defaultPhoto || 'assets/photo_phone_desk.jpg';
    } else {
      state.postData.bgImage = '';
    }

    if (type.hasMotion) {
      state.isMotionPlaying = true;
      state.activeMotionPreset = type.motionPreset || 'motion_story_progress';
      state.postData.showProgressBar = (type.id === 'anim_video');
    } else {
      state.isMotionPlaying = false;
      state.postData.showProgressBar = false;
    }

    if (type.id === 'anim_video') {
      state.promptMode = 'video';
      if (dom.btnPromptTypeVideo) dom.btnPromptTypeVideo.classList.add('active');
      if (dom.btnPromptTypePhoto) dom.btnPromptTypePhoto.classList.remove('active');
    }

    MotionEngine.setPlaying(state.isMotionPlaying);
    populateFormFromState();
  }

  function updateDynamicAiPrompt() {
    if (!dom.aiDynamicPromptText) return;
    let prompt = '';
    if (state.promptMode === 'video') {
      prompt = CopyEngine.generateVideoPrompt(state.postData, state.selectedPostType);
    } else {
      prompt = CopyEngine.generateAiPrompt(state.postData, state.selectedPostType);
    }
    dom.aiDynamicPromptText.innerText = prompt;
  }

  function renderVideoPrompts() {
    if (!dom.videoPromptsList) return;
    dom.videoPromptsList.innerHTML = CopyEngine.VIDEO_PROMPTS.map(p => `
      <div class="ai-prompt-card">
        <span class="prompt-title">${p.title}</span>
        <p class="prompt-text">${p.prompt}</p>
        <button class="btn-copy-prompt" data-prompt="${escapeHtml(p.prompt)}">🎬 Copiază Prompt Video</button>
      </div>
    `).join('');

    dom.videoPromptsList.querySelectorAll('.btn-copy-prompt').forEach(btn => {
      btn.addEventListener('click', async () => {
        await Exporter.copyToClipboard(btn.dataset.prompt);
        showToast('Prompt-ul video (Runway/Sora/Luma) a fost copiat în clipboard!');
      });
    });
  }

  function renderAnglesList() {
    if (!dom.anglesScroller) return;
    dom.anglesScroller.innerHTML = CopyEngine.ANGLES.map(a => `
      <div class="angle-card ${a.id === state.activeAngleId ? 'active' : ''}" data-angle-id="${a.id}">
        <span class="angle-num">${a.num} · ${a.defaultRegister}</span>
        <span class="angle-name">${a.title}</span>
      </div>
    `).join('');

    dom.anglesScroller.querySelectorAll('.angle-card').forEach(card => {
      card.addEventListener('click', () => {
        state.activeAngleId = card.dataset.angleId;
        state.postData.angleId = state.activeAngleId;
        dom.anglesScroller.querySelectorAll('.angle-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Auto-load default content for this angle
        const presets = CopyEngine.getPresetsByAngle(state.activeAngleId);
        if (presets && presets.length > 0) {
          loadPreset(presets[0].id);
        }
        applyPostTypeConfig(state.selectedPostType);
        updateDynamicAiPrompt();
        updatePreview();
      });
    });
  }

  function renderMediaAssets() {
    if (!dom.mediaAssetsGrid) return;
    dom.mediaAssetsGrid.innerHTML = MediaEngine.ASSETS.map(asset => `
      <div class="media-asset-card" data-path="${asset.path}">
        <img src="${asset.path}" alt="${asset.name}" class="asset-thumb" onerror="this.src='assets/cr_semn_light.png'">
        <span class="asset-name">${asset.name}</span>
      </div>
    `).join('');

    dom.mediaAssetsGrid.querySelectorAll('.media-asset-card').forEach(card => {
      card.addEventListener('click', () => {
        state.postData.bgImage = card.dataset.path;
        updatePreview();
        showToast(`Fundal selectat: ${card.querySelector('.asset-name').innerText}`);
      });
    });
  }

  function renderAiPrompts() {
    if (!dom.aiPromptsList) return;
    dom.aiPromptsList.innerHTML = MediaEngine.AI_PROMPTS.map(p => `
      <div class="ai-prompt-card">
        <span class="prompt-title">${p.title}</span>
        <p class="prompt-text">${p.prompt}</p>
        <button class="btn-copy-prompt" data-prompt="${escapeHtml(p.prompt)}">📋 Copiază Prompt</button>
      </div>
    `).join('');

    dom.aiPromptsList.querySelectorAll('.btn-copy-prompt').forEach(btn => {
      btn.addEventListener('click', async () => {
        await Exporter.copyToClipboard(btn.dataset.prompt);
        showToast('Prompt-ul AI pentru imagine a fost copiat în clipboard!');
      });
    });
  }

  function loadPreset(presetId) {
    const preset = CopyEngine.getPresetById(presetId);
    if (!preset) return;

    state.activePresetId = preset.id;
    state.activeAngleId = preset.angleId;
    state.activeRegisterId = preset.registerId;
    
    state.postData = {
      angleId: preset.angleId || '01_mecanismul',
      theme: preset.theme || 'plum',
      format: preset.format || '1:1',
      templateType: preset.templateType || 'statement',
      eyebrow: preset.eyebrow || '',
      title: preset.title || '',
      subtitle: preset.subtitle || '',
      point1: preset.point1 || '',
      point2: preset.point2 || '',
      point3: preset.point3 || '',
      footerNote: preset.footerNote || 'credit republic · neobroker',
      ctaText: preset.ctaText || '',
      hasSignalBlue: preset.hasSignalBlue || false,
      showWordmark: true,
      showSigQueue: false,
      showProgressBar: false,
      markType: 'auto',
      bgImage: preset.bgImage || '',
      photoIsLight: preset.photoIsLight || false,
      textPosition: preset.textPosition || 'cap',
      imageFilter: '',
      caption: preset.caption || '',
      slides: preset.slides ? JSON.parse(JSON.stringify(preset.slides)) : []
    };

    populateFormFromState();
    updatePreview();
  }

  function populateFormFromState() {
    if (dom.inputEyebrow) dom.inputEyebrow.value = state.postData.eyebrow || '';
    if (dom.inputTitle) dom.inputTitle.value = state.postData.title || '';
    if (dom.inputSubtitle) dom.inputSubtitle.value = state.postData.subtitle || '';
    if (dom.inputPoint1) dom.inputPoint1.value = state.postData.point1 || '';
    if (dom.inputPoint2) dom.inputPoint2.value = state.postData.point2 || '';
    if (dom.inputPoint3) dom.inputPoint3.value = state.postData.point3 || '';
    if (dom.inputFooterNote) dom.inputFooterNote.value = state.postData.footerNote || '';
    if (dom.inputCta) dom.inputCta.value = state.postData.ctaText || '';
    if (dom.inputCaption) dom.inputCaption.value = state.postData.caption || '';
    if (dom.checkSignalBlue) dom.checkSignalBlue.checked = state.postData.hasSignalBlue || false;
    if (dom.selectTemplate) dom.selectTemplate.value = state.postData.templateType || 'statement';

    // Update active swatch
    document.querySelectorAll('.theme-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === state.postData.theme);
    });

    // Update active format button
    document.querySelectorAll('.btn-format').forEach(b => {
      b.classList.toggle('active', b.dataset.format === state.postData.format);
    });
  }

  function syncFormWithCurrentSlide() {
    if (!state.isCarouselMode || !state.postData.slides) return;
    const current = state.postData.slides[state.currentSlideIndex];
    if (current) {
      if (dom.inputEyebrow) dom.inputEyebrow.value = current.eyebrow || state.postData.eyebrow;
      if (dom.inputTitle) dom.inputTitle.value = current.title || '';
      if (dom.inputSubtitle) dom.inputSubtitle.value = current.body || '';
    }
    if (dom.slideCounterLabel) {
      dom.slideCounterLabel.innerText = `Slide ${state.currentSlideIndex + 1} din ${state.postData.slides.length}`;
    }
  }

  function updatePreview() {
    const renderedHtml = TemplatesEngine.render(state.postData, {
      isCarousel: state.isCarouselMode,
      slideIndex: state.currentSlideIndex
    });

    // Wrap in device frame if selected
    let finalView = renderedHtml;
    if (state.previewMode === 'instagram') {
      finalView = `
        <div class="device-frame-instagram">
          <div class="insta-header">
            <div class="insta-user">
              <img src="assets/Florenta Broker v2.webp" class="insta-avatar" alt="creditrepublic" onerror="this.src='assets/cr_semn_light.png'">
              <span class="insta-name">creditrepublic</span>
            </div>
            <span class="insta-dots">•••</span>
          </div>
          ${renderedHtml}
          <div class="insta-actions">
            <div class="insta-icons-left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="insta-caption-preview">
            <strong>creditrepublic</strong> ${escapeHtml(state.postData.caption.slice(0, 140))}...
          </div>
        </div>
      `;
    }

    if (dom.viewportStage) {
      dom.viewportStage.innerHTML = finalView;
      const canvasEl = document.getElementById('social-post-canvas');
      if (canvasEl) {
        MotionEngine.applyMotion(canvasEl, state.activeMotionPreset, state.videoDuration);
      }
    }

    // Update Caption text
    if (dom.captionPreviewText) {
      dom.captionPreviewText.innerText = state.postData.caption || 'Nu există text generat pentru această postare.';
    }

    // Run Brand Compliance Validation
    runComplianceCheck();
  }

  function runComplianceCheck() {
    const report = BrandValidator.validatePost(state.postData);

    if (dom.topCompliancePill) {
      if (report.isValid) {
        dom.topCompliancePill.className = 'compliance-pill';
        dom.topCompliancePill.innerHTML = `<span class="compliance-dot"></span> 100% Brand Compliant`;
      } else {
        dom.topCompliancePill.className = 'compliance-pill has-issues';
        dom.topCompliancePill.innerHTML = `<span class="compliance-dot"></span> ${report.errorsCount} reguli de corectat`;
      }
    }

    if (dom.compScoreBadge) {
      dom.compScoreBadge.className = report.isValid ? 'comp-score-badge score-perfect' : 'comp-score-badge score-warning';
      dom.compScoreBadge.innerText = report.isValid ? '✓ 100% Conform Ghidului' : `⚠️ ${report.errorsCount} Atenționări`;
    }

    if (dom.compIssuesList) {
      if (report.issues.length === 0) {
        dom.compIssuesList.innerHTML = `<div style="font-size:0.8rem; color:var(--brand-mint); padding:10px 0;">Toate textele și culorile respectă ghidul oficial Credit Republic.</div>`;
      } else {
        dom.compIssuesList.innerHTML = report.issues.map(issue => `
          <div class="comp-issue-card">
            <span class="issue-title">${issue.rule.title}</span>
            <span class="issue-match">Găsit: „${issue.match}” (${issue.field})</span>
            <span style="font-size:0.7rem; opacity:0.8;">Sugestie: ${issue.suggestion}</span>
          </div>
        `).join('');
      }
    }
  }

  function showToast(msg) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- CSOS Module Integration ---
  
  let currentModularBrief = null;

  function initCSOS() {
    if (!dom.selectPersona || typeof MicroPersonas === 'undefined') return;
    const personas = MicroPersonas.getPersonas();
    dom.selectPersona.innerHTML = personas.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
  }

  function handleCSOSGenerate() {
    if (typeof ScriptEngine === 'undefined' || typeof MicroPersonas === 'undefined') {
      showToast('Eroare: Modulele CSOS nu au fost încărcate.');
      return;
    }
    const personaId = dom.selectPersona.value;
    const persona = MicroPersonas.getPersonaById(personaId);
    if (!persona) return;

    currentModularBrief = ScriptEngine.generateModularBrief(persona);
    const promptText = ScriptEngine.toJSONPrompt(currentModularBrief);
    
    dom.csosScriptInput.value = promptText;
    
    // Auto-grade it
    handleCSOSGrade();
    showToast('Brief modular JSON generat! (20x Variații)');
  }

  function handleCSOSGrade() {
    if (typeof ScriptGrader === 'undefined') {
      showToast('Eroare: ScriptGrader nu a fost încărcat.');
      return;
    }
    const text = dom.csosScriptInput.value;
    if (!text.trim()) {
      showToast('Introdu un script pentru a-l evalua.');
      return;
    }

    const result = ScriptGrader.evaluateScript(text);
    
    // Render Results
    dom.csosGraderResults.style.display = 'block';
    
    // Update Badge
    dom.csosScoreBadge.innerText = `Scor: ${result.score}/100`;
    if (result.score >= 85 && result.isProductionReady) {
      dom.csosScoreBadge.style.backgroundColor = 'var(--color-mint)';
      dom.csosScoreBadge.style.color = 'var(--color-plum)';
    } else {
      dom.csosScoreBadge.style.backgroundColor = 'var(--color-coral)';
      dom.csosScoreBadge.style.color = 'white';
    }

    // Render Feedback
    const allChecks = [...result.d2cChecks, ...result.feedback];
    
    dom.csosFeedbackList.innerHTML = result.d2cChecks.map(check => {
      const color = check.passed ? 'var(--color-mint)' : 'var(--color-coral)';
      const icon = check.passed ? '✓' : '✗';
      return `<div style="padding:4px 8px; border-left: 3px solid ${color}; background:rgba(255,255,255,0.05); margin-bottom:4px;">
        <strong style="color:${color}">${icon} ${check.name}</strong><br>
        <span style="opacity:0.8">${check.desc}</span>
      </div>`;
    }).join('');

    result.feedback.forEach(f => {
      const isErr = f.type === 'error';
      const color = isErr ? 'var(--color-coral)' : 'var(--color-sunshine)';
      dom.csosFeedbackList.innerHTML += `<div style="padding:4px 8px; border-left: 3px solid ${color}; background:rgba(255,255,255,0.05); margin-bottom:4px;">
        <strong style="color:${color}">⚠️ ${f.title}</strong><br>
        <span style="opacity:0.8">${f.desc}</span>
      </div>`;
    });
  }

  function handleCSOSExport() {
    const text = dom.csosScriptInput.value;
    if (!text.trim()) return showToast('Nu există brief de exportat.');
    
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CR_Brief_Video_AI_${dom.selectPersona.value}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fișier JSON descărcat!');
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);
})();
