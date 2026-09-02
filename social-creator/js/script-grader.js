/**
 * script-grader.js — Recursive Script Grader for Credit Republic
 * Implements the 10-Criteria Grader for CSOS.
 * Relies on BrandValidator for brand-specific strict rules.
 */

const ScriptGrader = (function () {
  'use strict';

  // Specific D2C Diaries Criteria
  const CRITERIA = [
    {
      id: 'd2c_hook',
      name: '1. Pattern Interrupt Hook',
      desc: 'Primele 3 secunde opresc scroll-ul? (Folosește un winning hook sau contrarian statement).',
      weight: 15,
      check: (text) => text.split(/[.?!]/)[0].length > 10 // Basic heuristic for a solid first sentence
    },
    {
      id: 'd2c_problem_id',
      name: '2. Identificarea Problemei',
      desc: 'Numește direct simptomul cu care se confruntă micro-persona?',
      weight: 10,
      check: (text) => /(banc[aă]|credit|dob[aâ]nd[aă]|rat[aă]|dosar|aprobare)/i.test(text)
    },
    {
      id: 'd2c_pain_agitation',
      name: '3. Agitarea Durerii (Cost of Inaction)',
      desc: 'De ce soluțiile clasice au eșuat / Cât îl costă dacă nu acționează?',
      weight: 10,
      // am[aâ]n (not am[aâ]ni) so the noun "amânare/amânarea" matches too, not just the verb "amâni/amâna".
      check: (text) => /(pierd|cost[aă]|timp|luni de zile|bani|am[aâ]n|iner[tț]ia)/i.test(text)
    },
    {
      id: 'd2c_unique_mech',
      name: '4. Mecanismul Unic',
      desc: 'Se menționează abordarea nouă (Algoritm + Broker)?',
      weight: 10,
      // "compar" (not "compara") because Romanian conjugates the verb as compară/comparăm/
      // comparat — all of those contain "compar", but only the bare infinitive-ish "compara"
      // matches the literal substring "compara", so the old pattern missed most real usage.
      check: (text) => /(algoritm|compar|tehnologie|platform[aă])/i.test(text)
    },
    {
      id: 'd2c_social_proof',
      name: '5. Social Proof / Autoritate',
      desc: 'Este menționată Florența Nistoroiu sau calitatea de broker AVBS?',
      weight: 15,
      check: (text) => /(Floren[tț]a|Nistoroiu|AVBS|broker)/i.test(text)
    },
    {
      id: 'd2c_risk_reversal',
      name: '6. Risk Reversal',
      desc: 'Este explicat de ce serviciul e sigur / 0 lei comision?',
      weight: 10,
      check: (text) => /(0 lei|gratuit|zero|banca pl[aă]te[sș]te|comisionul vine de la banc[aă])/i.test(text)
    },
    {
      id: 'd2c_single_cta',
      name: '7. Single Non-Friction CTA',
      desc: 'Există un singur apel la acțiune clar?',
      weight: 10,
      check: (text) => /(aplic[aă]|calculeaz[aă]|afl[aă]|intr[aă]|verific[aă]|las[aă]-ne)/i.test(text)
    }
  ];

  // The remaining 20 points come from BrandValidator strict rules (0 penalties = 20 pts)

  return {
    /**
     * Evaluates a script against 10 Criteria and Brand Rules
     * @param {string} scriptText 
     * @returns {Object} result with score and feedback
     */
    evaluateScript: function (scriptText) {
      if (!scriptText || typeof scriptText !== 'string') {
        return { score: 0, feedback: [], d2cChecks: [] };
      }

      let score = 0;
      const feedback = [];
      const d2cChecks = [];

      // 1. D2C Criteria Check (max 80 points)
      CRITERIA.forEach(crit => {
        const passed = crit.check(scriptText);
        d2cChecks.push({
          id: crit.id,
          name: crit.name,
          passed: passed,
          desc: crit.desc
        });

        if (passed) {
          score += crit.weight;
        } else {
          feedback.push({
            type: 'warning',
            title: `Lipsește: ${crit.name}`,
            desc: crit.desc
          });
        }
      });

      // 2. BrandValidator Check (max 20 points, deducts points for severe errors)
      // Expecting BrandValidator to be loaded in the environment
      if (typeof BrandValidator !== 'undefined') {
        const brandIssues = BrandValidator.validateText(scriptText, 'Video Script');
        
        let brandScore = 20;
        brandIssues.forEach(issue => {
          if (issue.rule.severity === 'error') {
            brandScore -= 10;
          } else {
            brandScore -= 5;
          }

          feedback.push({
            type: issue.rule.severity,
            title: `Brand Violation: ${issue.rule.title}`,
            desc: `Ai scris "${issue.match}". Sugestie: "${issue.suggestion}". ${issue.rule.desc}`
          });
        });

        // Add remaining brand score
        score += Math.max(0, brandScore);
      } else {
        // Fallback if BrandValidator not loaded
        score += 20;
      }

      // Cap at 100
      score = Math.min(100, Math.max(0, score));

      return {
        score: score,
        feedback: feedback,
        d2cChecks: d2cChecks,
        isProductionReady: score >= 85 && !feedback.some(f => f.type === 'error')
      };
    }
  };
})();

// Export for browser or Node environment
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { ScriptGrader };
} else {
  window.ScriptGrader = ScriptGrader;
}
