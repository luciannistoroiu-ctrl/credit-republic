/**
 * copy-engine.js — Credit Republic 7 Brand Angles & Social Copy Matrix
 * Codifies the 7 angles and 3 registers from brand/cr_brief_claude_design.md
 */

const CopyEngine = (function () {
  'use strict';

  const ANGLES = [
    {
      id: '01_mecanismul',
      num: '01',
      title: 'mecanismul',
      subtitle: 'cum funcționează neobrokerul',
      desc: 'Florența Nistoroiu — broker autorizat AVBS — negociază și duce dosarul la semnare, cu un AI care compară piața. 0 lei pentru client, comisionul vine de la bancă.',
      defaultRegister: 'exact'
    },
    {
      id: '02_refinantarea_amanata',
      num: '02',
      title: 'refinanțarea amânată',
      subtitle: 'costul invizibil al inerției',
      desc: 'Banca ta nu are niciun motiv să te sune când apare o ofertă mai bună — fiecare lună de amânare înseamnă bani lăsați la banca inițială.',
      defaultRegister: 'exact'
    },
    {
      id: '03_venitul_variabil',
      num: '03',
      title: 'venitul variabil',
      subtitle: 'pfa, dividende, bonusuri, it',
      desc: 'Băncile au formule complet diferite de calcul al gradului de îndatorare pentru veniturile non-standard.',
      defaultRegister: 'uman'
    },
    {
      id: '04_designul_opac',
      num: '04',
      title: 'designul opac',
      subtitle: 'dincolo de reclama cu dobândă mică',
      desc: 'Ofertele par la fel la prima vedere, dar diferențele reale stau în comisioane lunare, costul asigurării și marja fixă.',
      defaultRegister: 'observational'
    },
    {
      id: '05_casa_vs_creditul',
      num: '05',
      title: 'casa vs creditul',
      subtitle: 'asimetria de atenție',
      desc: 'Cumpărătorii caută 6 luni apartamentul potrivit, dar acceptă prima ofertă de credit în 20 de minute.',
      defaultRegister: 'observational'
    },
    {
      id: '06_algoritm_om',
      num: '06',
      title: 'algoritm + om',
      subtitle: 'tehnologie rapidă + broker cu experiență',
      desc: 'Algoritmul filtrează opțiunile în 4 minute, iar Florența Nistoroiu negociază condițiile la bancă.',
      defaultRegister: 'uman'
    },
    {
      id: '07_birocratia',
      num: '07',
      title: 'birocrația',
      subtitle: 'un singur dosar vs 5 drumuri la ghișeu',
      desc: 'O singură aplicare online compară toate băncile fără drumuri inutile și fără dosare plimbate.',
      defaultRegister: 'exact'
    }
  ];

  const REGISTERS = [
    {
      id: 'exact',
      name: 'Exact',
      badge: 'Cifre & Calcule',
      desc: 'Lângă orice cifră, simulator, precalificare sau CTA. Zero umor. Fapte verificate.'
    },
    {
      id: 'observational',
      name: 'Observațional',
      badge: 'Awareness & Mentalitate',
      desc: 'Awareness și conștientizare. Singurul registru cu umor fin. Fără buton în cadru.'
    },
    {
      id: 'uman',
      name: 'Uman',
      badge: 'Brokeraj & Ghidare',
      desc: 'Negociere, explicații calde, follow-up și asistență directă cu Florența Nistoroiu.'
    }
  ];

  // Comprehensive Preset Catalog
  const PRESETS = [
    // --- 01. MECANISMUL ---
    {
      id: 'p_01_master_statement',
      angleId: '01_mecanismul',
      registerId: 'observational',
      templateType: 'statement',
      theme: 'plum',
      format: '1:1',
      eyebrow: 'obiceiul din piață',
      title: 'nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.',
      subtitle: 'inerția este cel mai scump comision pe care îl plătești când cumperi o casă.',
      footerNote: 'credit republic · neobroker de credite',
      ctaText: '',
      hasSignalBlue: false,
      caption: `nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.\n\nCând cumperi un apartament, petreci luni întregi căutând compartimentarea potrivită, etajul, orientarea spre soare și cartierul.\n\nDar când vine vorba de credit, majoritatea oamenilor intră în prima sucursală care le iese în drum sau rămân la banca unde primesc salariul.\n\ncredit republic există pentru mecanismul din spatele acestei propoziții: Florența Nistoroiu, broker autorizat AVBS, duce dosarul la capăt cu numele ei — sprijinită de un algoritm care compară toate băncile. Serviciul este 0 lei pentru tine — comisionul vine de la bancă.\n\ncine vrea cifra reală, o verifică în 4 minute. gratuit.\n\n#creditrepublic #creditipotecar #educatiefinanciara #neobroker #crediteromania #refinantare`,
      slides: [
        {
          eyebrow: 'obiceiul din piață',
          title: 'nimeni nu alege cel mai bun credit.',
          body: 'aleg primul care le iese în cale. inerția este motivul pentru care creditele rămân scumpe.'
        },
        {
          eyebrow: 'cum arată realitatea',
          title: '6 luni pentru apartament. 20 de minute pentru credit.',
          body: 'O diferență de doar 0.5% la dobândă înseamnă zeci de mii de lei plătiți în plus pe durata contractului.'
        },
        {
          eyebrow: 'mecanismul simplu',
          title: 'o singură aplicare. toate băncile comparate.',
          body: 'AI-ul filtrează piața în 4 minute, iar Florența Nistoroiu (broker autorizat AVBS) duce dosarul la semnare.'
        }
      ]
    },
    {
      id: 'p_01_cum_functioneaza',
      angleId: '01_mecanismul',
      registerId: 'exact',
      templateType: 'steps',
      theme: 'cream',
      format: '1:1',
      eyebrow: 'procesul de lucru',
      title: 'cum funcționează de la aplicare la semnare',
      subtitle: 'Florența Nistoroiu, broker autorizat AVBS, răspunde cu numele ei de fiecare dosar',
      point1: '1. algoritmul compară ofertele de la toate băncile în 4 minute',
      point2: '2. Florența Nistoroiu (broker AVBS) negociază dosarul direct cu banca',
      point3: '3. semnezi oferta optimă. comisionul nostru este 0 lei pentru tine',
      footerNote: 'broker autorizat AVBS · credit republic',
      ctaText: 'verifică poziția ta',
      hasSignalBlue: true,
      caption: `cum funcționează credit republic de la prima simulare până la semnarea la bancă:\n\n1. Algoritmul compară opțiunile de creditare de la toate băncile în 4 minute.\n2. Florența Nistoroiu, broker autorizat AVBS, analizează dosarul și negociază direct condițiile optime.\n3. Semnezi la bancă. Serviciul este complet gratuit pentru tine (comisionul este achitat de bancă).\n\nFără interogare la biroul de credit, fără dosare plimbate la 5 sucursale — și fără nicio bancă necomparată.\n\nverifică poziția ta acum: 4 minute, 0 lei.\n\n#creditrepublic #brokercredite #avbs #creditipotecar #transparentafinanciara`,
      slides: [
        {
          eyebrow: 'pasul 01',
          title: 'precalificare online în 4 minute',
          body: 'Introduci datele de bază. Algoritmul scanează ofertele disponibile la toate băncile.'
        },
        {
          eyebrow: 'pasul 02',
          title: 'analiză dedicată cu broker AVBS',
          body: 'Florența Nistoroiu verifică criteriile specifice băncii și pregătește dosarul complet.'
        },
        {
          eyebrow: 'pasul 03',
          title: 'negociere și semnare la bancă',
          body: 'Mergi la bancă doar pentru semnare. Costul serviciului pentru tine este 0 lei.'
        }
      ]
    },

    // --- 02. REFINANȚAREA AMÂNATĂ ---
    {
      id: 'p_02_costul_amanarii',
      angleId: '02_refinantarea_amanata',
      registerId: 'exact',
      templateType: 'calc_impact',
      theme: 'plum',
      format: '4:5',
      eyebrow: 'impact financiar',
      title: 'banca ta nu te sună când apare o ofertă mai bună.',
      subtitle: 'pentru un credit ipotecar mediu de 350.000 lei pe 25 ani, o marjă renegociată poate însemna aproape 500 lei economisiți pe lună',
      point1: 'dobândă veche: 7.90% · rată lunară: ~2.680 lei',
      point2: 'dobândă negociată: 5.75% · rată nouă: ~2.200 lei',
      point3: 'economie ratată în 6 luni de amânare: 2.880 lei',
      footerNote: 'calcul estimativ orientativ · credit republic',
      ctaText: 'calculează refinanțarea',
      hasSignalBlue: true,
      caption: `banca ta nu te sună când apare o ofertă mai bună.\n\nNu e rea-voință. e pur și simplu că nimeni nu e plătit să-ți spună — de asta există un pas de comparare între tine și următoarea rată.\n\nDacă ai un credit ipotecar semnat în perioada dobânzilor ridicate, o scădere de doar 1.5-2% la marjă înseamnă o economie lunară de aproape 500 lei.\n\nPentru un credit de 350.000 lei pe 25 de ani: dobândă veche 7.90% (rată ~2.680 lei) vs dobândă renegociată 5.75% (rată ~2.200 lei). Amânarea cu 6 luni înseamnă aproape 3.000 lei rămași la banca inițială.\n\nAlgoritmul credit republic compară oferta ta cu toate băncile, iar Florența Nistoroiu (broker autorizat AVBS) preia negocierea și transferul dosarului. 0 lei pentru tine.\n\ncalculează refinanțarea ta acum — 4 minute.\n\n#refinantare #creditipotecar #economii #bugetpersonal #creditrepublic`,
      slides: [
        {
          eyebrow: 'realitatea pieței',
          title: 'dobânzile se schimbă. creditul tău a rămas același?',
          body: 'Mulți români plătesc încă marje din anii trecuți, deși piața oferă condiții mai bune.'
        },
        {
          eyebrow: 'cifrele reale',
          title: 'diferența de 480 lei pe lună',
          body: 'La 350.000 lei rămași de plată, refinanțarea reduce costul lunar cu aproape 500 lei.'
        },
        {
          eyebrow: 'fără costuri',
          title: '0 lei comision pentru tine',
          body: 'credit republic și Florența Nistoroiu (AVBS) se ocupă de întreg transferul dosarului.'
        }
      ]
    },

    // --- 03. VENITUL VARIABIL ---
    {
      id: 'p_03_pfa_dividende',
      angleId: '03_venitul_variabil',
      registerId: 'uman',
      templateType: 'checklist',
      theme: 'cream',
      format: '1:1',
      eyebrow: 'profil financiar',
      title: 'o bancă ți-a spus nu. nu înseamnă că piața a spus nu.',
      subtitle: 'fiecare bancă are propriul calcul pentru venituri din pfa, dividende sau it — un refuz nu e un verdict',
      point1: 'unele bănci iau în calcul 100% din dividende, altele doar 50%',
      point2: 'vechimea minimă pe PFA variază între 1 an și 2 ani fiscali încheiați',
      point3: 'norma de venit și contractele B2B au încadrări speciale',
      footerNote: 'analiză personalizată · broker autorizat AVBS',
      ctaText: 'vezi unde te califici',
      hasSignalBlue: false,
      caption: `o bancă ți-a spus nu. nu înseamnă că piața a spus nu.\n\nDacă ai venituri din dividende, PFA sau contracte din IT, un refuz nu e un refuz din partea pieței — e doar o singură metodologie de risc, dintre multe.\n\nFiecare bancă din România are propriul algoritm intern de calcul pentru gradul de îndatorare al veniturilor non-salariale. O bancă poate lua în considerare 100% din dividendele distribuite, în timp ce alta acceptă doar 50% sau cere 2 ani fiscali consecutivi.\n\nFlorența Nistoroiu, broker autorizat AVBS, verifică manual unde se încadrează exact profilul tău, înainte să depui vreun dosar. Serviciul e 0 lei pentru tine.\n\nvezi unde te califici — verificarea e gratuită.\n\n#pfa #dividende #antreprenoriat #creditipotecar #creditrepublic #avbs`,
      slides: [
        {
          eyebrow: 'provocarea',
          title: 'venit bun, dosar respins la prima bancă?',
          body: 'Veniturile din dividende sau PFA nu sunt evaluate la fel de toate instituțiile.'
        },
        {
          eyebrow: 'criterii diferite',
          title: 'ponderi de la 30% la 100%',
          body: 'În funcție de domeniu și istoricul financiar, băncile au metodologii diferite de calcul.'
        },
        {
          eyebrow: 'soluția',
          title: 'direcționăm dosarul exact unde ești eligibil',
          body: 'Florența Nistoroiu verifică manual politicile de risc înainte de a depune documentele.'
        }
      ]
    },

    // --- 04. DESIGNUL OPAC ---
    {
      id: 'p_04_mit_vs_realitate',
      angleId: '04_designul_opac',
      registerId: 'observational',
      templateType: 'myth_reality',
      theme: 'plum',
      format: '1:1',
      eyebrow: 'mit vs realitate',
      title: 'ce vezi în reclamă vs ce plătești lunar',
      subtitle: 'cum este structurat costul real al unui credit',
      point1: 'mitul: „merg la banca mea pentru că primesc salariul acolo și am reducere”',
      point2: 'realitatea: reducerea de virare salariu poate fi anulată de asigurări sau comisioane lunare de administrare',
      point3: 'concluzia: compară mereu costul total, nu doar primul procent din afiș',
      footerNote: 'transparență totală · credit republic',
      ctaText: '',
      hasSignalBlue: false,
      caption: `mit vs realitate în alegerea unui credit:\n\nMit: „Merg direct la banca unde am contul de salariu pentru că acolo primesc automat o reducere la dobândă.”\n\nRealitate: reducerea pentru virarea salariului este deseori depășită de costul polițelor de asigurare sau de comisioanele anuale de administrare a contului — costul total contează, nu primul procent din afiș.\n\ncredit republic compară costul total la toate băncile, cu un broker autorizat AVBS care verifică fiecare condiție din contract. 0 lei pentru tine.\n\ndacă vrei să vezi costul real, verificarea durează 4 minute.\n\n#mitvsrealitate #credite #educatiefinanciara #creditrepublic #costtotal`,
      slides: [
        {
          eyebrow: 'mitul clasic',
          title: '„banca mea îmi dă automat o reducere la dobândă”',
          body: 'Fidelitatea bancară nu spune nimic despre costul total din contract — asigurări și comisioane pot cântări mai mult decât reducerea.'
        },
        {
          eyebrow: 'realitatea din contract',
          title: 'atenție la comisioane ascunse și asigurări',
          body: 'O dobândă nominală scăzută poate avea asigurări de viață obligatorii la preț dublu.'
        },
        {
          eyebrow: 'decizia corectă',
          title: 'compară înainte să semnezi',
          body: 'Verifică toate băncile în 4 minute prin credit republic. 0 lei pentru tine.'
        }
      ]
    },

    // --- 05. CASA VS CREDITUL ---
    {
      id: 'p_05_asimetria_de_atentie',
      angleId: '05_casa_vs_creditul',
      registerId: 'observational',
      templateType: 'statement',
      theme: 'coral',
      format: '1:1',
      eyebrow: 'asimetria de atenție',
      title: 'cauți apartamentul 6 luni. alegi creditul în 20 de minute.',
      subtitle: 'cu costurile de azi, fiecare procent din dobândă cântărește mai mult — motiv în plus să nu grăbești tocmai partea asta.',
      footerNote: 'credit republic · neobroker de credite',
      ctaText: '',
      hasSignalBlue: false,
      caption: `cauți apartamentul 6 luni. alegi creditul în 20 de minute.\n\nVerifici izolația termică, locul de parcare, vecinii și finisajele.\n\nDar când vine vorba de împrumutul pe 30 de ani care finanțează acea locuință, mulți acceptă prima ofertă primită.\n\nCu costul unei locuințe noi mai mare ca acum un an, diferența dintre o dobândă comparată și una acceptată din grabă contează mai mult ca oricând — nu mai puțin.\n\nO oră alocată comparării ofertelor la toate băncile îți poate salva echivalentul unei mașini noi pe durata creditului. Florența Nistoroiu, broker autorizat AVBS, verifică fiecare condiție — credit republic, 0 lei pentru tine.\n\ndacă vrei cifra ta, verificarea durează 4 minute.\n\n#imobiliare #creditipotecar #primacasa #apartamentnou #creditrepublic`,
      slides: [
        {
          eyebrow: 'paradoxul cumpărătorului',
          title: '6 luni pentru apartament.',
          body: 'Verifici instalațiile, orientarea, lumina și parchetul până în cel mai mic detaliu.'
        },
        {
          eyebrow: 'momentul creditului',
          title: '20 de minute la prima bancă.',
          body: 'Acceptarea primei oferte este cel mai frecvent obicei din piața creditelor ipotecare.'
        },
        {
          eyebrow: 'soluția inteligentă',
          title: 'compară toate băncile înainte de semnare.',
          body: 'credit republic scanează piața gratuit și independent pentru tine.'
        }
      ]
    },

    // --- 06. ALGORITM + OM ---
    {
      id: 'p_06_florenta_si_ai',
      angleId: '06_algoritm_om',
      registerId: 'uman',
      templateType: 'broker_ai',
      theme: 'plum',
      format: '1:1',
      eyebrow: 'tehnologie + experiență',
      title: 'algoritmul compară piața. Florența Nistoroiu negociază la bancă.',
      subtitle: 'viteza unui neobroker AI unită cu experiența unui broker autorizat AVBS',
      point1: 'algoritmul scanează toate opțiunile de la toate băncile în 4 minute',
      point2: 'Florența Nistoroiu verifică dosarul, explică nuanțele și optimizează marjele',
      point3: 'comisionul tău: 0 lei (plătit integral de bancă la semnare)',
      footerNote: 'Florența Nistoroiu · Broker autorizat AVBS · credit republic',
      ctaText: 'discută cu florența',
      hasSignalBlue: true,
      caption: `algoritm + om: de ce alegem această combinație pentru dosarul tău de credit.\n\nTehnologia compară zeci de condiții de eligibilitate de la toate băncile în doar câteva minute — dar un dosar de credit ipotecar are nuanțe umane: evaluarea imobilului, derogări de marjă, structura veniturilor și comunicarea directă cu ofițerul bancar.\n\nFără negociere umană, un dosar poate pierde timp în comitetele de risc ale băncii, cu întrebări la care nimeni nu răspunde imediat. Aici intervine Florența Nistoroiu, broker autorizat AVBS, care preia tot efortul de negociere.\n\nServiciul este 100% gratuit pentru tine — comisionul vine de la bancă la semnare.\n\ndiscută cu Florența, fără cost și fără obligație — află ce se schimbă pentru dosarul tău.\n\n#brokercredite #avbs #florentanistoroiu #creditrepublic #ipotecar`,
      slides: [
        {
          eyebrow: 'rolul tehnologiei',
          title: 'filtrare instantanee a pieței',
          body: 'AI-ul analizează eligibilitatea la toate băncile în 4 minute, fără interogare la biroul de credit.'
        },
        {
          eyebrow: 'rolul uman',
          title: 'Florența Nistoroiu · Broker AVBS',
          body: 'Negociere directă, verificarea actelor de proprietate și susținerea dosarului în comitetul de credite.'
        },
        {
          eyebrow: 'rezultatul',
          title: 'dosar aprobat fără stres',
          body: 'Costul pentru tine: 0 lei. Comisionul vine direct de la bancă.'
        }
      ]
    },

    // --- 07. BIROCRAȚIA ---
    {
      id: 'p_07_un_singur_dosar',
      angleId: '07_birocratia',
      registerId: 'exact',
      templateType: 'comparison',
      theme: 'cream',
      format: '1:1',
      eyebrow: 'timp economisit',
      title: 'un singur dosar online vs 5 drumuri la 5 sucursale',
      subtitle: 'cum se schimbă experiența când aplici prin neobroker',
      point1: 'pe cont propriu: 5 formulare diferite, zeci de foi printate, cozi la ghișeu',
      point2: 'prin credit republic: o singură aplicare digitală, toate băncile comparate',
      point3: 'asistență pas cu pas până la primirea banilor sau semnarea contractului',
      footerNote: 'simplu · digital · gratuit',
      ctaText: 'precalifică-te, fără drumuri',
      hasSignalBlue: true,
      caption: `cât timp pierzi dacă mergi pe cont propriu la bănci vs o singură aplicare online prin credit republic:\n\nPe cont propriu:\n- 4-5 drumuri la sucursale diferite\n- formulare re-completate de la zero\n- săptămâni de așteptare pentru răspunsuri parțiale\n\nPrin credit republic:\n- o singură aplicare online de 4 minute\n- toate băncile comparate simultan\n- broker autorizat AVBS care se ocupă de acte\n- 0 lei comision\n\n#birocratie #creditipotecar #economisestetimp #neobroker #creditrepublic`,
      slides: [
        {
          eyebrow: 'vechea metodă',
          title: 'bănci diferite = dosare diferite',
          body: 'Zile întregi pierdute în trafic și la ghișee pentru a afla dacă ești eligibil.'
        },
        {
          eyebrow: 'noua metodă',
          title: 'o singură aplicare online',
          body: 'Toate băncile comparate într-un singur loc, transparent și fără costuri.'
        },
        {
          eyebrow: 'pasul următor',
          title: 'economisește timp și bani',
          body: 'Florența Nistoroiu (broker AVBS) se ocupă de relația cu banca pentru tine.'
        }
      ]
    }
  ];

  // The 5 Post Types for Step 1
  const POST_TYPES = [
    {
      id: 'graphic_text',
      name: 'Grafică Text',
      icon: '📝',
      desc: 'Culoare solidă de brand, typography bold, pastile de accent.',
      recommendedTheme: 'plum',
      recommendedFormat: '1:1',
      hasPhoto: false,
      hasMotion: false
    },
    {
      id: 'graphic_photo',
      name: 'Grafică cu Foto',
      icon: '🖼️',
      desc: 'Fotografie editorială candid de fundal + carduri de conținut.',
      recommendedTheme: 'cream',
      recommendedFormat: '1:1',
      hasPhoto: true,
      defaultPhoto: 'assets/photo_phone_desk.jpg',
      hasMotion: false
    },
    {
      id: 'anim_text',
      name: 'Animație cu Text',
      icon: '⚡',
      desc: 'Kinetic typography (cuvânt cu cuvânt) sau plutire pe fundal solid.',
      recommendedTheme: 'plum',
      recommendedFormat: '1:1',
      hasPhoto: false,
      hasMotion: true,
      motionPreset: 'motion_kinetic_type'
    },
    {
      id: 'anim_photo',
      name: 'Animație cu Foto',
      icon: '🌊',
      desc: 'Fotografie de fundal cu mișcare continuă + carduri animate.',
      recommendedTheme: 'plum',
      recommendedFormat: '4:5',
      hasPhoto: true,
      defaultPhoto: 'assets/photo_modern_interior.jpg',
      hasMotion: true,
      motionPreset: 'motion_rate_counter'
    },
    {
      id: 'anim_video',
      name: 'Animație Video / Reel',
      icon: '🎬',
      desc: 'Format 9:16 vertical, Story progress bar, 60 FPS & export MP4.',
      recommendedTheme: 'plum',
      recommendedFormat: '9:16',
      hasPhoto: false,
      hasMotion: true,
      motionPreset: 'motion_story_progress'
    }
  ];

  /**
   * Deep Semantic Analyzer for Step 2 User Content
   */
  function analyzeContentSemantics(postData) {
    const fullText = [
      postData.eyebrow,
      postData.title,
      postData.subtitle,
      postData.point1,
      postData.point2,
      postData.point3,
      postData.caption
    ].filter(Boolean).join(' ').toLowerCase();

    let themeType = 'lifestyle_desk'; // default
    let visualCues = '';

    if (/floren[tț]a|broker|avbs|negoci|consultan[tț]|dosar de credit/i.test(fullText)) {
      themeType = 'broker_negotiation';
      visualCues = 'elegant organized consultation desk with an understated contract folder, quality fountain pen, laptop and ceramic coffee cup, warm natural side-lighting, authentic professional editorial aesthetic, calm and confident atmosphere';
    } else if (/apartament|cas[aă]|imobil|locuin[tț][aă]|finisaj|etaj|vecini|cump[aă]r/i.test(fullText)) {
      themeType = 'home_architecture';
      visualCues = 'airy contemporary Scandinavian apartment interior, large architectural window with soft golden morning sunbeams, minimalist plaster wall, natural light oak floor, clean modern lines, aspirational and calm living atmosphere, no people';
    } else if (/pfa|dividend|it|antreprenor|venit/i.test(fullText)) {
      themeType = 'independent_work';
      visualCues = 'creative contemporary home office workspace, clean wooden desk with laptop and notebook, gentle natural daylight, authentic and thoughtful atmosphere of an independent professional';
    } else if (/birocra[tț]|drumur|ghi[sș]eu|online|aplicar|dosare/i.test(fullText)) {
      themeType = 'digital_simplicity';
      visualCues = 'minimalist top-down composition of a single sleek smartphone next to a neat thin document folder on a solid natural wood surface, embodying order, digital simplicity and peace of mind';
    } else if (/dob[aâ]nd[aă]|rat[aă]|economi|calcul|procent|lei|refinan[tț]|bani|comision|banc/i.test(fullText)) {
      themeType = 'financial_analysis';
      visualCues = 'candid close-up of focused hands holding a modern smartphone on an organic oak desk, reviewing minimalist numerical comparison charts, ceramic espresso cup nearby, warm morning sunlight with soft geometric window shadows, realistic 35mm film grain';
    } else {
      visualCues = 'candid close-up editorial photo of hands holding a smartphone on a clean minimalist desk with warm natural sunlight, ceramic cup, soft shadows, warm cream and wood tones, realistic lifestyle photography';
    }

    return { themeType, visualCues, fullText };
  }

  /**
   * Generate dynamic context-aware AI image prompt based on EXACT Step 2 content
   */
  function generateAiPrompt(postData, postTypeId = 'graphic_photo') {
    const semantics = analyzeContentSemantics(postData);
    const titleClean = (postData.title || '').replace(/[„”"']/g, '').trim();
    const subtitleClean = (postData.subtitle || '').replace(/[„”"']/g, '').trim();
    const eyebrowClean = (postData.eyebrow || '').replace(/[„”"']/g, '').trim();

    let titlePart = titleClean ? `Core Message: "${titleClean}". ` : '';
    let subtitlePart = subtitleClean ? `Contextual Subtitle: "${subtitleClean}". ` : '';
    let topicPart = eyebrowClean ? `Topic: [${eyebrowClean}]. ` : '';

    const prompt = `[credit republic Editorial Visual Concept] ${topicPart}${titlePart}${subtitlePart}Scene Description: ${semantics.visualCues}. Color Palette: warm cream (#FFF8F0), plum accents (#2B2640), subtle coral highlights (#FF6B4A). Composition: Asymmetric, natural soft lighting, warm morning shadows. Style: Authentic 35mm editorial photography, 8k resolution, cinematic color grading, calm and thoughtful mood. (Strict negative: no cheesy house keys in air, no fake forced smiles, no corporate cliches, no artificial oversaturation).`;

    return prompt;
  }

  /**
   * Generate dynamic context-aware AI video/motion prompt based on EXACT Step 2 content
   * (Runway Gen-3, Luma Dream Machine, Sora, Kling, Pika, Veo)
   */
  function generateVideoPrompt(postData, postTypeId = 'anim_video') {
    const semantics = analyzeContentSemantics(postData);
    const titleClean = (postData.title || '').replace(/[„”"']/g, '').trim();
    const subtitleClean = (postData.subtitle || '').replace(/[„”"']/g, '').trim();

    let cameraMotion = 'Slow continuous cinematic camera push-in in one direction, buttery smooth 60fps, no jump cuts, steady motion.';
    
    if (semantics.themeType === 'home_architecture') {
      cameraMotion = 'Slow continuous forward tracking shot through an airy sunlit Scandinavian room, gentle golden sunbeams shifting softly on the cream wall, steady 60fps.';
    } else if (semantics.themeType === 'financial_analysis') {
      cameraMotion = 'Subtle cinematic rack focus from a wooden desk calendar or notebook to a modern smartphone screen showing clean rate charts, slow steady lateral tracking in one direction.';
    } else if (semantics.themeType === 'broker_negotiation') {
      cameraMotion = 'Slow smooth lateral camera pan across a designer consultation table with a contract folder and smartphone, warm morning side-lighting, 60fps.';
    } else if (semantics.themeType === 'digital_simplicity') {
      cameraMotion = 'Slow top-down continuous camera glide over a clean oak desk with a phone and minimal notes, calm rhythmic pacing.';
    }

    const prompt = `[AI Video Directive]: ${cameraMotion} [Content Context]: Message: "${titleClean}". Details: "${subtitleClean}". [Visual Details]: ${semantics.visualCues}. [Aesthetics & Color]: 4k 60fps cinematic look, authentic documentary color grading, warm cream (#FFF8F0), plum (#2B2640), coral accents (#FF6B4A), calm and serene pacing, continuous slow motion in one direction.`;

    return prompt;
  }

  // Pre-configured Video Prompts library for B-Roll & Social Ads
  const VIDEO_PROMPTS = [
    {
      id: 'vid_prompt_phone_desk',
      title: '01. Mâini + Telefon & Cafea (Reel B-Roll)',
      prompt: 'Cinematic slow-motion shot (60fps), slow subtle camera push-in on focused hands using a sleek smartphone on a warm wooden table. Natural morning sunlight casting soft geometric window shadows, steam gently rising from ceramic cup, serene mood, 4k 24fps film look, warm cream and plum color grade.'
    },
    {
      id: 'vid_prompt_scandinavian_home',
      title: '02. Living Minimalist & Lumină Caldă (Imobiliar)',
      prompt: 'Smooth continuous gimbal forward tracking shot through an airy contemporary Scandinavian living room, large architectural window, soft golden hour sunbeams illuminating cream walls and light oak floors, peaceful and aspirational, no people, 4k 60fps cinematic.'
    },
    {
      id: 'vid_prompt_signing_desk',
      title: '03. Dosar & Negociere (Algoritm + Om)',
      prompt: 'Slow smooth lateral pan over a tidy designer desk with a contract folder, elegant pen, and laptop with clean graphs. Natural warm side-lighting, subtle depth of field, authentic business editorial aesthetic, 4k cinematic.'
    },
    {
      id: 'vid_prompt_urban_facade',
      title: '04. Fațadă Rezidențială Modernă',
      prompt: 'Slow upward tilt shot of modern urban residential architecture, clean geometric glass balconies reflecting soft sunset clouds, warm ambient street light, cinematic documentary quality.'
    }
  ];

  /**
   * Get all presets for a specific angle
   */
  function getPresetsByAngle(angleId) {
    return PRESETS.filter(p => p.angleId === angleId);
  }

  /**
   * Get preset by ID
   */
  function getPresetById(presetId) {
    return PRESETS.find(p => p.id === presetId) || PRESETS[0];
  }

  /**
   * Format caption with proper spacing and hashtags
   */
  function formatCaption(captionText, angleId, hashtags = []) {
    let text = captionText.trim();
    if (hashtags && hashtags.length > 0) {
      text += '\n\n' + hashtags.map(h => h.startsWith('#') ? h : '#' + h).join(' ');
    }
    return text;
  }

  return {
    ANGLES,
    REGISTERS,
    PRESETS,
    POST_TYPES,
    VIDEO_PROMPTS,
    generateAiPrompt,
    generateVideoPrompt,
    getPresetsByAngle,
    getPresetById,
    formatCaption
  };
})();

if (typeof window !== 'undefined') {
  window.CopyEngine = CopyEngine;
}


