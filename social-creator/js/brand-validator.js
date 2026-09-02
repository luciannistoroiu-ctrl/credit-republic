/**
 * brand-validator.js — Credit Republic Social Media Brand Compliance Engine
 * Validates copy and visual rules strictly according to brand/cr_brief_claude_design.md
 */

const BrandValidator = (function () {
  'use strict';

  // Strict Brand Rules
  const RULES = {
    LOWERCASE_BRAND: {
      id: 'rule_lowercase_brand',
      severity: 'error',
      title: 'Scriere „credit republic” exclusiv cu minuscule',
      desc: 'Numele mărcii se scrie strict „credit republic” — niciodată „Credit Republic”, „CREDIT REPUBLIC” sau „Credit republic”.'
    },
    MARKET_COVERAGE: {
      id: 'rule_market_coverage',
      severity: 'error',
      title: 'Acoperirea pieței: strict „toate băncile”',
      desc: 'Interzis să specifici un număr de bănci (ex: „15 bănci”, „20 bănci”, „30 de bănci”). Se folosește exclusiv „toate băncile”.'
    },
    NO_SUPERLATIVES: {
      id: 'rule_no_superlatives',
      severity: 'error',
      title: 'Fără superlative nepermise',
      desc: 'Sunt interzise „cel mai bun”, „cea mai bună”, „perfect”, „maxim”, „nr 1”, „numărul 1”. Singura excepție este linia master: „nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.”'
    },
    NO_READER_BLAME: {
      id: 'rule_no_reader_blame',
      severity: 'error',
      title: 'Fără culpabilizarea cititorului',
      desc: 'Subiectul este sistemul, banca sau noi. Niciodată cititorul ca autor al unei greșeli (interzis: „ai lăsat”, „nu știi”, „ai greșit”, „de ce să te oprești la”, „ai pierdut”).'
    },
    SENTENCE_CASE: {
      id: 'rule_sentence_case',
      severity: 'warning',
      title: 'Sentence case peste tot (Fără ALL CAPS)',
      desc: 'Fără majuscule complete în titluri sau pastile. Textul se scrie natural (Sentence case) sau minuscule.'
    },
    SIGNAL_BLUE_LIMIT: {
      id: 'rule_signal_blue',
      severity: 'error',
      title: 'Albastru Semnal #2C86F6 apare cel mult o dată',
      desc: 'Albastrul semnal este o regulă de moment, nu de suprafață. Apare o singură dată într-un ecran, exclusiv pe un rezultat pozitiv confirmat sau buton activ.'
    },
    NO_UNVERIFIED_DAE: {
      id: 'rule_no_unverified_dae',
      severity: 'warning',
      title: 'Fără DAE sau exemplu reprezentativ neautorizat',
      desc: 'Fără mențiuni generice de DAE dacă nu există cifre oficiale verificate legal.'
    },
    PILL_ON_PHOTO: {
      id: 'rule_pill_on_photo',
      severity: 'error',
      title: 'Nicio pastilă peste fotografie',
      desc: 'Peste o fotografie textul rulează liber (cream pe imagine închisă, plum pe imagine deschisă) — fără cutie, fără umbră, fără contur. Verifică faptul că postarea are fotografie de fundal (bgImage) și mod „text liber” activ (on-photo), nu pastile pline.'
    }
  };

  // Master line exception
  const MASTER_LINE = "nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.";

  /**
   * Validate a single string of text
   * @param {string} text 
   * @param {string} fieldName 
   * @returns {Array} List of detected issues
   */
  function validateText(text, fieldName = 'Text') {
    if (!text || typeof text !== 'string') return [];
    const issues = [];
    const lower = text.toLowerCase();

    // 1. Lowercase Brand Check
    const brandRegex = /\b(Credit Republic|CREDIT REPUBLIC|Credit republic|Credit-Republic)\b/g;
    if (brandRegex.test(text)) {
      issues.push({
        rule: RULES.LOWERCASE_BRAND,
        field: fieldName,
        match: text.match(brandRegex)?.[0] || 'Credit Republic',
        suggestion: 'credit republic',
        autoFix: (val) => val.replace(brandRegex, 'credit republic')
      });
    }

    // 2. Market Coverage Numeric Banks Check
    const bankCountRegex = /\b(\d{1,3}\+?\s*(de\s*)?b[aăâ]nci|\bzece bănci|\bdouăzeci de bănci|\b15 bănci|\b25 bănci|\b30 bănci)\b/gi;
    if (bankCountRegex.test(text)) {
      issues.push({
        rule: RULES.MARKET_COVERAGE,
        field: fieldName,
        match: text.match(bankCountRegex)?.[0],
        suggestion: 'toate băncile',
        autoFix: (val) => val.replace(bankCountRegex, 'toate băncile')
      });
    }

    // 3. Superlatives Check
    const isMasterLine = lower.includes("nimeni nu alege cel mai bun credit");
    if (!isMasterLine) {
      const superlativeRegex = /\b(cel mai bun|cea mai bun[aă]|cel mai avantajos|cea mai avantajoas[aă]|maxim[aă]?|perfect[aă]?|nr\.?\s*1|num[aă]rul 1|f[aă]r[aă] concuren[tț][aă]|cea mai mic[aă] dob[aâ]nd[aă])\b/gi;
      const match = text.match(superlativeRegex);
      if (match) {
        issues.push({
          rule: RULES.NO_SUPERLATIVES,
          field: fieldName,
          match: match[0],
          suggestion: 'o dobândă verificată / opțiunea potrivită profilului tău',
          autoFix: (val) => val.replace(superlativeRegex, 'o dobândă comparată')
        });
      }
    }

    // 4. Reader Blame Check
    const blameRegex = /\b(ai l[aă]sat|nu [sș]tii|ai gre[sș]it|de ce s[aă] te opre[sș]ti la|ai pierdut|faci o gre[sș]eal[aă]|pl[aă]te[sș]ti degeaba|nu ai comparat)\b/gi;
    const blameMatch = text.match(blameRegex);
    if (blameMatch) {
      issues.push({
        rule: RULES.NO_READER_BLAME,
        field: fieldName,
        match: blameMatch[0],
        suggestion: 'Reformulează cu subiectul pe sistem sau pe piață (ex: „inerția costă”, „băncile nu compară între ele”).',
        autoFix: (val) => {
          return val
            .replace(/ai lăsat/gi, 'rămân în piață')
            .replace(/nu știi/gi, 'este greu de văzut')
            .replace(/ai greșit/gi, 'prima ofertă nu e singura')
            .replace(/de ce să te oprești la/gi, 'fără să compari cu');
        }
      });
    }

    // 5. ALL CAPS Words (more than 4 uppercase letters in a row, excluding standard abbreviations like AI, AVBS, EUR, RON, DAE)
    const allCapsRegex = /\b[A-ZĂÂÎȘȚ]{4,}\b/g;
    const allCapsMatches = text.match(allCapsRegex);
    if (allCapsMatches) {
      const filtered = allCapsMatches.filter(w => !['AVBS', 'ANPC', 'ROBOR', 'IRCC', 'EUR', 'RON', 'USD'].includes(w));
      if (filtered.length > 0) {
        issues.push({
          rule: RULES.SENTENCE_CASE,
          field: fieldName,
          match: filtered.join(', '),
          suggestion: filtered.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(', '),
          autoFix: (val) => {
            let res = val;
            filtered.forEach(w => {
              const lowerWord = w.toLowerCase();
              res = res.replace(new RegExp('\\b' + w + '\\b', 'g'), lowerWord);
            });
            return res;
          }
        });
      }
    }

    return issues;
  }

  /**
   * Validate entire post object
   * @param {Object} postData 
   * @returns {Object} Complete validation report
   */
  function validatePost(postData) {
    const issues = [];

    // Fields to check
    const textFields = [
      { name: 'Eyebrow', val: postData.eyebrow },
      { name: 'Titlu', val: postData.title },
      { name: 'Subtitlu / Descriere', val: postData.subtitle },
      { name: 'Punct 1', val: postData.point1 },
      { name: 'Punct 2', val: postData.point2 },
      { name: 'Punct 3', val: postData.point3 },
      { name: 'Notă / Subsol', val: postData.footerNote },
      { name: 'CTA', val: postData.ctaText },
      { name: 'Text Postare (Caption)', val: postData.caption }
    ];

    // Carousel slides check if carousel mode
    if (Array.isArray(postData.slides)) {
      postData.slides.forEach((slide, idx) => {
        textFields.push(
          { name: `Slide ${idx + 1} - Titlu`, val: slide.title },
          { name: `Slide ${idx + 1} - Text`, val: slide.body },
          { name: `Slide ${idx + 1} - Eyebrow`, val: slide.eyebrow }
        );
      });
    }

    textFields.forEach(f => {
      if (f.val) {
        const found = validateText(f.val, f.name);
        issues.push(...found);
      }
    });

    // Check Signal Blue Count rule — reflectă câmpurile reale folosite de
    // app.js/templates.js (postData.hasSignalBlue), nu nume vechi neutilizate.
    // calc_impact randează mereu albastrul pe rezultatul confirmat și forțează
    // butonul CTA la plum (templates.js renderCalcImpact); toate celelalte
    // template-uri pun albastrul doar pe butonul CTA. Cele două nu pot coexista
    // per postare — verificarea de mai jos e o gardă de regresie, nu o
    // corecție a unui bug curent cunoscut.
    let signalBlueCount = 0;
    if (postData.hasSignalBlue) signalBlueCount++;
    if (postData.templateType === 'calc_impact' && postData.hasSignalBlue && postData.ctaText && postData.forceSignalBlueCta) {
      signalBlueCount++;
    }

    if (signalBlueCount > 1) {
      issues.push({
        rule: RULES.SIGNAL_BLUE_LIMIT,
        field: 'Elemente Vizuale',
        match: `${signalBlueCount} elemente albastre semnal (#2C86F6)`,
        suggestion: 'Păstrează albastrul semnal o singură dată pe ecran, exclusiv pe rezultatul confirmat. Pe calc_impact, figura confirmată câștigă albastrul — butonul CTA rămâne plum.',
        autoFix: (data) => {
          data.forceSignalBlueCta = false;
          return data;
        }
      });
    }

    // Check pill-on-photo rule. templates.js/app.js aplică automat clasa
    // .on-photo (text liber, fără pastilă) când bgImage e setat — verificarea
    // de aici e o gardă: dacă cineva randează manual eyebrow/CTA ca pastilă
    // plină peste o fotografie, semnalează.
    if (postData.bgImage && postData.forcePillOverPhoto) {
      issues.push({
        rule: RULES.PILL_ON_PHOTO,
        field: 'Fundal fotografie',
        match: 'pastilă forțată peste fotografie',
        suggestion: 'Lasă modul „text liber” (on-photo) activ — nu forța stilul de pastilă peste bgImage.',
        autoFix: (data) => {
          data.forcePillOverPhoto = false;
          return data;
        }
      });
    }

    const errors = issues.filter(i => i.rule.severity === 'error');
    const warnings = issues.filter(i => i.rule.severity === 'warning');

    return {
      isValid: errors.length === 0,
      errorsCount: errors.length,
      warningsCount: warnings.length,
      totalIssues: issues.length,
      issues: issues
    };
  }

  /**
   * Automatically sanitize and fix all known issues in postData
   * @param {Object} postData 
   * @returns {Object} Cleaned postData
   */
  function autoFixAll(postData) {
    const cloned = JSON.parse(JSON.stringify(postData));

    function sanitizeString(str) {
      if (!str || typeof str !== 'string') return str;
      let s = str;
      // 1. Lowercase brand
      s = s.replace(/\b(Credit Republic|CREDIT REPUBLIC|Credit republic|Credit-Republic)\b/g, 'credit republic');
      // 2. Numeric banks
      s = s.replace(/\b(\d{1,3}\+?\s*(de\s*)?b[aăâ]nci|\bzece bănci|\bdouăzeci de bănci|\b15 bănci|\b25 bănci|\b30 bănci)\b/gi, 'toate băncile');
      // 3. Reader blame
      s = s.replace(/ai lăsat/gi, 'rămân în piață')
           .replace(/nu știi/gi, 'este greu de văzut')
           .replace(/ai greșit/gi, 'prima ofertă nu e singura')
           .replace(/de ce să te oprești la/gi, 'fără să compari cu');
      return s;
    }

    ['eyebrow', 'title', 'subtitle', 'point1', 'point2', 'point3', 'footerNote', 'ctaText', 'caption'].forEach(k => {
      if (cloned[k]) cloned[k] = sanitizeString(cloned[k]);
    });

    if (Array.isArray(cloned.slides)) {
      cloned.slides.forEach(slide => {
        ['eyebrow', 'title', 'body', 'highlight'].forEach(k => {
          if (slide[k]) slide[k] = sanitizeString(slide[k]);
        });
      });
    }

    if (cloned.useSignalBlueBadge && cloned.useSignalBlueButton) {
      cloned.useSignalBlueButton = false;
    }

    return cloned;
  }

  return {
    RULES,
    MASTER_LINE,
    validateText,
    validatePost,
    autoFixAll
  };
})();

if (typeof window !== 'undefined') {
  window.BrandValidator = BrandValidator;
}
