/**
 * micro-personas.js — TEEP Micro-Persona Matrix for Credit Republic
 * Based on D2C Diaries methodology (Trigger, Emotion, Expectation, PainPoint).
 * 
 * 6 distinct psychological profiles mapped to the brand's core angles.
 */

const MicroPersonas = (function () {
  'use strict';

  const PERSONAS = [
    {
      id: 'pfa_dividende',
      title: 'IT / PFA / Dividende',
      defaultAngleId: '03_venitul_variabil',
      TEEP: {
        trigger: 'A fost refuzat sau ofertat prost pe baza veniturilor non-standard de către banca sa principală.',
        emotion: 'Frustrare, senzație de neîndreptățire.',
        expectation: 'Să îi fie luate în calcul veniturile reale (normă de venit, dividende, bonusuri).',
        painPoint: 'Algoritmii băncilor clasice nu înțeleg formele moderne de muncă.'
      },
      winningHooks: [
        'Dacă ai PFA sau încasezi dividende, oprește-te din scroll.',
        'De ce banca ta nu vrea să îți dea credit deși câștigi bine.',
        'Băncile au formule complet diferite pentru venituri non-standard.'
      ],
      forbiddenPhrases: [
        'Nu știi cum să aplici.',
        'Ai greșit banca.'
      ]
    },
    {
      id: 'inertia_refinantarii',
      title: 'Inerția Refinanțării',
      defaultAngleId: '02_refinantarea_amanata',
      TEEP: {
        trigger: 'Plătește o rată mare legată de ROBOR sau IRCC și amână refinanțarea de luni de zile.',
        emotion: 'Anxietate financiară, oboseală.',
        expectation: 'Un proces care să se întâmple "de la sine", fără să mai depună el efort.',
        painPoint: 'Costul invizibil al inerției (bani lăsați la bancă) vs teama de birocrația refinanțării.'
      },
      winningHooks: [
        'Fiecare lună în care amâni refinanțarea înseamnă bani lăsați la bancă.',
        'Cel mai mare cost al creditului tău nu e dobânda, e inerția.',
        'Cum să îți scazi rata fără să faci tu vreun drum la bancă.'
      ],
      forbiddenPhrases: [
        'Ai pierdut bani.',
        'Ai fost leneș.'
      ]
    },
    {
      id: 'asimetria_atentiei',
      title: 'Căutătorul de Apartament',
      defaultAngleId: '05_casa_vs_creditul',
      TEEP: {
        trigger: 'A găsit apartamentul visurilor și acum trebuie să semneze "rapid" pentru credit ca să nu-l piardă.',
        emotion: 'Entuziasm amestecat cu panică și presiune de timp.',
        expectation: 'Să rezolve creditul cât mai repede pentru a securiza tranzacția.',
        painPoint: 'Riscă să aleagă primul credit care îi iese în cale din disperare de timp.'
      },
      winningHooks: [
        'Ai căutat 6 luni apartamentul perfect, dar alegi primul credit care îți iese în cale.',
        'De ce decizia de 20 de minute te va costa mii de euro.',
        'Nu accepta prima ofertă doar ca să semnezi mai repede.'
      ],
      forbiddenPhrases: [
        'Ești disperat.',
        'Nu fi prost.'
      ]
    },
    {
      id: 'opacitatea_costurilor',
      title: 'Victima Reclamelor Opace',
      defaultAngleId: '04_designul_opac',
      TEEP: {
        trigger: 'A văzut o reclamă cu „dobândă de 5.9%” și a mers la bancă, doar pentru a afla că DAE este 8.5%.',
        emotion: 'Scepticism, senzație că a fost păcălit.',
        expectation: 'Să vadă costul total (asigurări, marje fixe) pus pe masă transparent, de la bun început.',
        painPoint: 'Designul opac al produselor financiare și costurile ascunse.'
      },
      winningHooks: [
        'Ofertele de credit par la fel la prima vedere. Până ajungi la ghișeu.',
        'Dincolo de reclama cu dobândă mică.',
        'Ce nu îți spune banca despre asigurarea de viață.'
      ],
      forbiddenPhrases: [
        'Te-ai lăsat păcălit.',
        'Nu știi să citești contractul.'
      ]
    },
    {
      id: 'frica_birocratie',
      title: 'Cuplul Copleșit de Birocrație',
      defaultAngleId: '07_birocratia',
      TEEP: {
        trigger: 'Au încercat să obțină oferte de la 3 bănci diferite și și-au epuizat zilele de concediu.',
        emotion: 'Epuizare, lipsă de timp.',
        expectation: 'Un sistem care face treaba în locul lor ("done for you").',
        painPoint: 'Dosare plimbate, documente expirate, program flexibil inexistent.'
      },
      winningHooks: [
        'Un singur dosar vs 5 drumuri la ghișeu.',
        'Cum să compari toate băncile fără să-ți iei o zi liberă de la muncă.',
        'Pentru noi, compararea ofertelor e o chestiune de algoritm.'
      ],
      forbiddenPhrases: [
        'Ai pierdut timpul.',
        'Nu știi să te organizezi.'
      ]
    },
    {
      id: 'scepticism_comision',
      title: 'Scepticul (Unde e șmecheria?)',
      defaultAngleId: '01_mecanismul',
      TEEP: {
        trigger: 'I se propune ajutorul unui broker autorizat (Florența Nistoroiu), dar îi este frică de costuri ascunse.',
        emotion: 'Prudență extremă, suspiciune.',
        expectation: 'O explicație logică și clară de ce serviciul este "gratuit" pentru el.',
        painPoint: 'Frica de a fi taxat pe ascuns prin comision.'
      },
      winningHooks: [
        'De ce credit republic e gratuit pentru tine.',
        'Cine plătește comisionul brokerului?',
        'Algoritmul compară. Florența negociază. Comisionul vine de la bancă.'
      ],
      forbiddenPhrases: [
        'Serviciu gratis.',
        'Mocăciune.'
      ]
    }
  ];

  return {
    getPersonas: function () {
      return PERSONAS;
    },
    getPersonaById: function (id) {
      return PERSONAS.find(p => p.id === id);
    }
  };
})();

// Export for browser or Node environment
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { MicroPersonas };
} else {
  window.MicroPersonas = MicroPersonas;
}
