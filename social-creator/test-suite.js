/**
 * test-suite.js — Automated Verification for Credit Republic Social Creator Engine
 * Tests BrandValidator, CopyEngine, TemplatesEngine, MotionEngine, MediaEngine, VideoRecorder, Step 2-to-Step 3 Prompt Synthesis & 3-Step Wizard
 */

const fs = require('fs');
const path = require('path');

// Mock window
global.window = {};

// Load modules
require('./js/brand-validator.js');
require('./js/copy-engine.js');
require('./js/motion-engine.js');
require('./js/media-engine.js');
require('./js/video-recorder.js');
require('./js/templates.js');
require('./js/exporter.js');

const BrandValidator = global.window.BrandValidator;
const CopyEngine = global.window.CopyEngine;
const MotionEngine = global.window.MotionEngine;
const MediaEngine = global.window.MediaEngine;
const VideoRecorder = global.window.VideoRecorder;
const TemplatesEngine = global.window.TemplatesEngine;
const Exporter = global.window.Exporter;
const { ScriptGrader } = require('./js/script-grader.js');
const { MicroPersonas } = require('./js/micro-personas.js');
const { ScriptEngine } = require('./js/script-engine.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✕ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing BrandValidator ---');

// Test 1.1: Brand name capitalization check
const badBrand = BrandValidator.validateText('Credit Republic oferă cele mai bune condiții');
assert(badBrand.some(i => i.rule.id === 'rule_lowercase_brand'), 'Flags uppercase "Credit Republic"');

// Test 1.2: Numeric banks check
const badBanks = BrandValidator.validateText('Avem parteneriate cu 25 de bănci din România');
assert(badBanks.some(i => i.rule.id === 'rule_market_coverage'), 'Flags numeric bank count ("25 de bănci")');

// Test 1.3: Superlatives check
const badSuperlative = BrandValidator.validateText('Găsește cel mai bun credit ipotecar');
assert(badSuperlative.some(i => i.rule.id === 'rule_no_superlatives'), 'Flags forbidden superlative ("cel mai bun")');

// Test 1.4: Master line exception check
const masterLine = BrandValidator.validateText('nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.');
assert(masterLine.length === 0, 'Permits master line exception without false positives');

// Test 1.5: Reader blame check
const badBlame = BrandValidator.validateText('ai lăsat mii de lei la bancă pentru că nu știi piața');
assert(badBlame.some(i => i.rule.id === 'rule_no_reader_blame'), 'Flags reader blame phrases ("ai lăsat", "nu știi")');

// Test 1.6: Auto-fixer check
const dirtyPost = {
  title: 'Credit Republic compară 15 bănci',
  subtitle: 'nu știi de ce să te oprești la prima ofertă',
  eyebrow: 'IMPORTANT',
  hasSignalBlue: true,
  useSignalBlueBadge: true,
  useSignalBlueButton: true
};
const cleaned = BrandValidator.autoFixAll(dirtyPost);
assert(cleaned.title.includes('credit republic'), 'Auto-fix cleans brand casing');
assert(cleaned.title.includes('toate băncile'), 'Auto-fix cleans numeric banks');
assert(!cleaned.useSignalBlueButton, 'Auto-fix limits signal blue occurrences to max 1');

// Test 1.7: Regression - diacritic-ending superlatives were silently skipped by a plain
// \b, since JS treats "ă" as a non-word character (this exact phrase shipped live on
// parteneri.html uncaught before the fix).
const dropAccentSuperlative = BrandValidator.validateText('el primește cea mai mică dobândă din piață');
assert(dropAccentSuperlative.some(i => i.rule.id === 'rule_no_superlatives'), 'Flags feminine/diacritic-ending superlative ("cea mai mică dobândă")');

// Test 1.8: Regression - "cel/cea mai bine" (adverbial "works best") is the same claim
// as "cel mai bun" and should be treated as a superlative too.
const worksBestSuperlative = BrandValidator.validateText('combinația funcționează cel mai bine pentru creditul tău');
assert(worksBestSuperlative.some(i => i.rule.id === 'rule_no_superlatives'), 'Flags adverbial superlative ("cel mai bine")');

console.log('\n--- 1b. Testing ScriptGrader ---');

// Test 1b.1: Regression - the mechanism check looked for the literal substring "compara",
// which Romanian conjugation almost never produces ("compară", "comparăm" don't contain it).
const mechScore = ScriptGrader.evaluateScript('algoritmul nostru compară ofertele de la toate băncile în 4 minute.');
assert(mechScore.d2cChecks.find(c => c.id === 'd2c_unique_mech').passed, 'Detects unique-mechanism mention in conjugated form ("compară", not just "compara")');

console.log('\n--- 2. Testing Step 2 -> Step 3 Dynamic Prompt Synthesis ---');

// Test 2.1: Apartment / Home purchase context synthesis
const homePost = {
  eyebrow: 'asimetria de atenție',
  title: 'cauți apartamentul 6 luni. alegi creditul în 20 de minute.',
  subtitle: 'de ce investim sute de ore în alegerea finisajelor dar lăsăm bani la prima bancă?'
};
const homePhotoPrompt = CopyEngine.generateAiPrompt(homePost, 'graphic_photo');
assert(homePhotoPrompt.includes('cauți apartamentul 6 luni'), 'Photo prompt contains exact user title from Step 2');
assert(homePhotoPrompt.includes('Scandinavian apartment interior'), 'Photo prompt parses apartment/home context into Scandinavian interior visual');

const homeVideoPrompt = CopyEngine.generateVideoPrompt(homePost, 'anim_video');
assert(homeVideoPrompt.includes('forward tracking shot through an airy sunlit Scandinavian room'), 'Video prompt generates architectural camera tracking for home topic');

// Test 2.2: Rate calculation / Financial context synthesis
const calcPost = {
  eyebrow: 'calcul exact',
  title: '7.90% vs 5.75% dobândă fixă',
  subtitle: 'economie de 2.880 lei pe an la aceeași sumă împrumutată'
};
const calcPhotoPrompt = CopyEngine.generateAiPrompt(calcPost, 'graphic_photo');
assert(calcPhotoPrompt.includes('7.90% vs 5.75%'), 'Photo prompt incorporates exact rate numbers from Step 2');
assert(calcPhotoPrompt.includes('financial_analysis') || calcPhotoPrompt.includes('numerical comparison charts'), 'Photo prompt recognizes financial analysis cues');

const calcVideoPrompt = CopyEngine.generateVideoPrompt(calcPost, 'anim_video');
assert(calcVideoPrompt.includes('rack focus') || calcVideoPrompt.includes('rate charts'), 'Video prompt directs camera rack focus on financial rates');

// Test 2.3: Broker / Florența Nistoroiu AVBS context synthesis
const brokerPost = {
  eyebrow: 'om + tehnologie',
  title: 'algoritmul compară piața, florența nistoroiu negociază la bancă',
  subtitle: 'broker autorizat avbs cu peste 10 ani experiență'
};
const brokerPhotoPrompt = CopyEngine.generateAiPrompt(brokerPost, 'graphic_photo');
assert(brokerPhotoPrompt.includes('florența nistoroiu negociază'), 'Photo prompt includes exact broker headline');
assert(brokerPhotoPrompt.includes('consultation desk') || brokerPhotoPrompt.includes('contract folder'), 'Photo prompt crafts authentic consultation scene');

console.log('\n--- 3. Testing CopyEngine Matrix & Presets ---');
assert(CopyEngine.ANGLES.length === 7, 'Has exactly 7 brand angles');
CopyEngine.PRESETS.forEach(preset => {
  const report = BrandValidator.validatePost(preset);
  assert(report.isValid, `Preset "${preset.id}" is 100% brand compliant (0 errors)`);
});

console.log('\n--- 3b. Testing MicroPersonas Content (TEEP + winning hooks) ---');
// Regression coverage: this file's copy (hooks that get fed straight into ScriptEngine
// briefs) was never run through BrandValidator before, and shipped with an unflagged
// "perfect" superlative and a hardcoded "3 bănci" — both silent because nothing tested it.
const personas = MicroPersonas.getPersonas();
assert(personas.length >= 6, 'Has at least the 6 documented micro-personas');
personas.forEach(p => {
  const fields = [p.title, p.TEEP.trigger, p.TEEP.emotion, p.TEEP.expectation, p.TEEP.painPoint, ...p.winningHooks];
  const errors = fields.flatMap(t => BrandValidator.validateText(t)).filter(i => i.rule.severity === 'error');
  assert(errors.length === 0, `Persona "${p.id}" TEEP + hooks are 100% brand compliant (0 errors)`);
});
assert(personas.some(p => p.defaultAngleId === '06_algoritm_om'), 'The "algoritm + om" angle has a dedicated micro-persona');

personas.forEach(p => {
  const brief = ScriptEngine.generateModularBrief(p);
  const briefErrors = BrandValidator.validateText(ScriptEngine.toJSONPrompt(brief)).filter(i => i.rule.severity === 'error');
  assert(briefErrors.length === 0, `Generated ScriptEngine brief for "${p.id}" is 100% brand compliant (0 errors)`);
});

console.log('\n--- 4. Testing MotionEngine & Video Modules ---');
assert(MotionEngine.PRESETS.length >= 5, 'MotionEngine has 5+ brand motion presets');
assert(typeof VideoRecorder.recordElement === 'function', 'VideoRecorder exposes recordElement');

console.log('\n--- 5. Testing TemplatesEngine Rendering ---');
const statementHtml = TemplatesEngine.render({
  templateType: 'statement',
  theme: 'plum',
  format: '1:1',
  title: 'test statement'
});
assert(statementHtml.includes('post-canvas-wrapper'), 'Renders canvas wrapper');

const storyHtml = TemplatesEngine.render({
  templateType: 'statement',
  format: '9:16',
  title: 'story test'
});
assert(storyHtml.includes('story-progress-container'), 'Renders story progress bar for 9:16 format');

console.log('\n--- 6. Summary ---');
console.log(`Total tests passed: ${passed}`);
console.log(`Total tests failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 ALL TESTS PASSED! Step 2 -> Step 3 Synthesis is 100% verified.');
  process.exit(0);
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
