/**
 * script-engine.js — 8-Phase Scriptwriting Engine & Modular JSON Generator
 * For Credit Republic CSOS
 */

const ScriptEngine = (function () {
  'use strict';

  // 8 Phases of a High-Converting Script
  const PHASES = [
    '1_pattern_interrupt',
    '2_problem_id',
    '3_pain_agitation',
    '4_unique_mechanism',
    '5_visual_proof',
    '6_social_proof',
    '7_risk_reversal',
    '8_cta'
  ];

  /**
   * Generates a 20-Variation Modular Brief (5 Hooks, 2 Bodies, 2 CTAs)
   * @param {Object} persona - MicroPersona object from MicroPersonas
   * @returns {Object} Modular Brief
   */
  function generateModularBrief(persona) {
    if (!persona) return null;

    // 5 Visual/Verbal Hooks based on TEEP trigger
    const hooks = persona.winningHooks.map((text, idx) => ({
      id: `hook_${idx + 1}`,
      visual: `Close-up dinamic, încadratură strânsă. Text pe ecran în pastilă: "${text}"`,
      voiceover: text,
      duration_sec: 3
    }));
    
    // Add 2 generic contrarian hooks
    if (hooks.length < 5) {
      hooks.push({
        id: 'hook_4',
        visual: 'Split screen: bancă clasică vs aplicație credit republic.',
        voiceover: 'Ofertele băncilor par la fel la prima vedere. Până ajungi la ghișeu.',
        duration_sec: 3
      });
      hooks.push({
        id: 'hook_5',
        visual: 'Privire directă în cameră, ton confidențial.',
        voiceover: 'Adevărul despre comisioanele de brokeraj la credite.',
        duration_sec: 3
      });
    }

    // 2 Bodies (Phase 2-6)
    const body1 = {
      id: 'body_1_logical',
      phases: {
        '2_problem_id': `Știu că te gândești că ${persona.TEEP.painPoint.toLowerCase()}`,
        '3_pain_agitation': `Iar asta înseamnă timp pierdut și bani lăsați la bănci diferite, dacă dosarul circulă de la una la alta.`,
        '4_unique_mechanism': `Dar la credit republic, algoritmul nostru compară toate băncile instant.`,
        '5_visual_proof': `[Ecran telefon scrollând printre oferte] Fără Excel-uri complicate.`,
        '6_social_proof': `Iar Florența Nistoroiu, broker autorizat AVBS, negociază dobânda direct pentru tine.`
      }
    };

    const body2 = {
      id: 'body_2_emotional',
      phases: {
        '2_problem_id': `Te simți blocat pentru că ${persona.TEEP.painPoint.toLowerCase()}`,
        '3_pain_agitation': `E frustrant să lași decizia de mii de euro la voia întâmplării.`,
        '4_unique_mechanism': `De aceea am creat un sistem hibrid: tehnologie rapidă plus factorul uman.`,
        '5_visual_proof': `[Cadru cu un raport de credit clar] Tu primești doar lista scurtă cu cele mai bune variante.`,
        '6_social_proof': `Un broker AVBS cu peste 10 ani experiență te ghidează pas cu pas.`
      }
    };

    // 2 CTAs (Phase 7-8)
    const cta1 = {
      id: 'cta_1_direct',
      phases: {
        '7_risk_reversal': `Costul pentru tine? 0 lei comision. Banca ne plătește pe noi, nu tu.`,
        '8_cta': `Verifică-ți opțiunile acum — 4 minute, gratuit.`
      }
    };

    const cta2 = {
      id: 'cta_2_soft',
      phases: {
        '7_risk_reversal': `Comision zero la analiză și acordare, costurile noastre sunt suportate de bancă.`,
        '8_cta': `Calculează-ți rata în 4 minute, direct pe site.`
      }
    };

    return {
      persona: persona.title,
      hooks: hooks.slice(0, 5),
      bodies: [body1, body2],
      ctas: [cta1, cta2]
    };
  }

  /**
   * Formats a modular brief to a stringified JSON Prompt suitable for AI Video generators
   * @param {Object} brief 
   */
  function toJSONPrompt(brief) {
    if (!brief) return '';
    return JSON.stringify(brief, null, 2);
  }

  return {
    generateModularBrief,
    toJSONPrompt
  };
})();

// Export for browser or Node environment
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { ScriptEngine };
} else {
  window.ScriptEngine = ScriptEngine;
}
