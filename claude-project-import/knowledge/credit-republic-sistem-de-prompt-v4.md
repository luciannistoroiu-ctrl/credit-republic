credit republic — sistem de prompt v4 (Nano Banana Pro)
Actualizare a celor trei tipare existente, aliniată la ghidul de brand v4 (valori, fotografie, TOV — recalibrate după cercetarea N26). Schema JSON urmează structura marketing_image / social_graphic / ui_builder din skill-ul json-prompting-for-nano-banana.


Ce s-a schimbat față de v3:


* Paleta de fundal nu mai e doar neutră — orice culoare din paletă (cream / plum / coral / sunshine / mint) poate fi fundal principal.
* Fotografia are acum două niveluri: hero de produs (obiect central, fundal color-block) și social candid (jurnal personal, cadru nedesaturat).
* Textul nu se mai generează suprapus în imagine de către model — se compune ulterior, în pastile rotunjite (HTML/CSS), peste fotografia curată livrată de Nano Banana Pro. Modelul primește instrucțiune explicită să NU includă text.
* Accentul albastru #2C86F6 rămâne neschimbat: exclusiv pe rezultat confirmat / buton activ.


________________


Reguli comune (se aplică la toate cele 3 tipare)
{


  "shared_rules": {


    "palette": {


      "cream": "#FFF8F0",


      "plum": "#2B2640",


      "coral": "#FF6B4A",


      "sunshine": "#FFD166",


      "mint": "#06D6A0",


      "accent_positive_only": "#2C86F6"


    },


    "typography": "Helvetica Neue (fallback sistem — Google/Adobe Fonts blocate în render)",


    "text_policy": "modelul NU randează text în imagine; textul se suprapune ulterior în pastile rotunjite (rounded pill) via compositing HTML/CSS",


    "tone_of_voice": "witty — umor de recunoaștere, nicio cifră inventată, nicio promisiune neverificabilă",


    "forbidden": ["poză stock cu zâmbet larg forțat spre cameră", "text randat de model", "accent albastru pe altceva decât CTA/rezultat pozitiv", "cifră de bănci vizibilă în UI, captură sau pastilă — se spune „toate băncile”", "mențiune de DAE sau exemplu reprezentativ"]


  }


}


________________


Tiparul 1 — social_graphic: afirmație + fundal (pastile)
Pentru postări de recunoaștere: linia master sau un insight, fără fotografie. Notă: pentru acest tipar, fundalul + pastilele se pot produce integral în HTML/CSS (fără Nano Banana Pro) — JSON-ul de mai jos e util doar dacă vrei o textură/gradient generat de model în spatele pastilelor.


{


  "social_graphic": {


    "meta": {


      "spec_version": "4.0.0",


      "title": "afirmație — refinanțare amânată",


      "campaign": "recunoastere_2026",


      "brand_name": "credit republic"


    },


    "platform": "instagram_post",


    "dimensions": { "width": 1080, "height": 1350, "unit": "px" },


    "background": {


      "type": "solid",


      "color": "#2B2640"


    },


    "text_layers": [


      {


        "id": "line_1",


        "content": "majoritatea creditelor",


        "position": "top_left",


        "style": {


          "shape": "pill",


          "font_family": "Helvetica Neue",


          "font_weight": "bold",


          "font_size": 58,


          "color": "#2B2640",


          "background_color": "#FFF8F0",


          "border_radius": 999,


          "padding": "20px 34px"


        }


      },


      {


        "id": "line_2",


        "content": "nu sunt alese.",


        "position": "center_left",


        "style": {


          "shape": "pill",


          "font_family": "Helvetica Neue",


          "font_weight": "bold",


          "font_size": 58,


          "color": "#FFF8F0",


          "background_color": "#FF6B4A",


          "border_radius": 999,


          "padding": "20px 34px",


          "rotation_deg": -2


        }


      }


    ],


    "brand": {


      "logo": { "asset": "credit_republic_wordmark_cream.png", "position": "bottom_left" },


      "primary_colors": ["#FFF8F0", "#2B2640", "#FF6B4A", "#FFD166", "#06D6A0"],


      "fonts": ["Helvetica Neue"]


    },


    "style": {


      "mood": "witty_confident",


      "keywords": ["warm", "playful", "direct", "rounded"]


    },


    "constraints": {


      "lock_text_content": true,


      "lock_brand_elements": true,


      "allow_color_variation": "palette_only"


    }


  }


}


________________


Tiparul 2 — marketing_image: fotografie, două niveluri
2a. hero_product — obiectul, nu decorul
Echivalentul cardului N26 în mână. La noi: telefonul cu simularea, sau dosarul aprobat.


{


  "marketing_image": {


    "meta": {


      "spec_version": "4.0.0",


      "title": "hero — simulare aprobată",


      "campaign": "dovada_2026",


      "brand_name": "credit republic",


      "usage_context": "instagram_feed"


    },


    "composition_tier": "hero_product",


    "subject": {


      "type": "phone_in_hand",


      "name": "aplicație credit republic — ecran de simulare",


      "physical_properties": {


        "finish": "matte, ecran aprins, fără reflexii dure"


      }


    },


    "props": {


      "foreground": [],


      "midground": [],


      "background": []


    },


    "environment": {


      "surface": "flat_color",


      "background_color": "#FF6B4A",


      "atmosphere": "curat, spațiu negativ generos în jurul telefonului"


    },


    "camera": {


      "angle": "front",


      "framing": "medium",


      "focal_length_mm": 50,


      "depth_of_field": "shallow"


    },


    "lighting": {


      "key_light": { "direction": "front", "intensity": "medium" },


      "color_temperature": "neutral_warm"


    },


    "brand": {


      "primary_colors": ["#FF6B4A", "#2B2640", "#FFF8F0"],


      "forbidden_changes": ["nu adăuga text sau UI fals în imagine — doar telefonul + fundalul"]


    },


    "controls": {


      "locked": ["environment.background_color", "composition_tier"],


      "iterable": ["camera.angle", "props"]


    }


  }


}
2b. social_candid — jurnal, nu reclamă
Cadru care pare făcut cu telefonul, nu regizat. Culoare vie, nedesaturată — regulă păstrată din v3.


{


  "marketing_image": {


    "meta": {


      "spec_version": "4.0.0",


      "title": "candid — verificare pe telefon acasă",


      "campaign": "recunoastere_2026",


      "brand_name": "credit republic",


      "usage_context": "instagram_feed"


    },


    "composition_tier": "social_candid",


    "subject": {


      "type": "person_hands_and_phone",


      "description": "mâini ținând telefonul, aspect tipic românesc, unghii/piele naturale",


      "action": "verifică o simulare de credit pe telefon",


      "emotion": "calm-încrezător, natural — nu zâmbet larg spre cameră"


    },


    "environment": {


      "location": "birou de-acasă sau bucătărie, mediu real",


      "atmosphere": "jurnal personal, moment cotidian surprins, nu regizat"


    },


    "camera": {


      "angle": "top_down",


      "framing": "close_up",


      "focal_length_mm": 35,


      "depth_of_field": "shallow"


    },


    "lighting": {


      "key_light": { "direction": "natural_window", "intensity": "medium" },


      "color_temperature": "warm_natural"


    },


    "style": {


      "keywords": ["documentary", "candid", "unposed", "vivid_color_not_desaturated"]


    },


    "constraints": {


      "lock_text_content": true,


      "forbidden": ["poză stock cu zâmbet larg artificial", "recuzită tip familie fericită/chei de casă"]


    }


  }


}


________________


Tiparul 3 — ui_builder: captură simulator + cifră (pastilă)
{


  "ui_builder": {


    "meta": {


      "spec_version": "4.0.0",


      "title": "simulator — rezultat aprobare",


      "brand_name": "credit republic"


    },


    "app": {


      "platform": "mobile",


      "fidelity": "hi-fi",


      "viewport": { "width": 390, "height": 844 },


      "theme": "light"


    },


    "tokens": {


      "colors": {


        "background": "#FFF8F0",


        "surface": "#FFFFFF",


        "primary_text": "#2B2640",


        "accent_positive": "#2C86F6",


        "accent_warm": "#FF6B4A",


        "accent_mint": "#06D6A0"


      },


      "typography": { "font_family": "Helvetica Neue" },


      "border_radius": { "sm": 8, "md": 16, "pill": 999 },


      "spacing_scale": [4, 8, 16, 24, 32]


    },


    "screens": [


      { "id": "rezultat_simulare", "name": "Rezultat simulare", "role": "results" }


    ],


    "components": [


      {


        "type": "stat_badge",


        "screen_id": "rezultat_simulare",


        "props": { "label": "economie estimată", "value": "<cifră>", "style": "pill", "color": "accent_positive" }


      },


      {


        "type": "cta_button",


        "screen_id": "rezultat_simulare",


        "props": { "label": "verifică gratuit", "style": "pill", "color": "accent_positive" }


      }


    ],


    "constraints": {


      "layout_lock": false,


      "theme_lock": true,


      "content_lock": false,


      "forbidden": ["numărătoare de bănci pe ecran", "DAE sau exemplu reprezentativ"]


    }


  }


}


________________


Notă de workflow
1. Foto (Tiparul 2) → Nano Banana Pro generează doar fotografia curată, fără text.
2. Text (toate tiparele) → se suprapune ulterior în pastile rotunjite via HTML/CSS (wkhtmltoimage), în culorile din paletă v4.
3. UI (Tiparul 3) → poate fi randat direct de Nano Banana Pro sau construit ca mockup HTML, după fidelitatea dorită.


Surse cercetare: dbaddad.com/N26-Brand-Guidelines · dokument.studio/work/n26