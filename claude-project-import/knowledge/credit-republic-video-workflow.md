credit republic — workflow tehnic video
referință pentru Project Knowledge. regulile de brand sunt în credit-republic-video-instructiuni.md. aici e doar execuția.


________________


matricea de tool-uri
tool
	ce face
	limitări cunoscute
	ffmpeg (6.1.1, în container)
	tăiere, viteză, crop, blur, overlay, concat, export
	fără generativ. tot ce iese e determinist
	Playwright / Chromium
	HTML/CSS → PNG la 2× retina, cadru cu cadru
	Google Fonts blocate → fallback pe Helvetica Neue, ceea ce e corect pentru brand
	wkhtmltoimage
	HTML → PNG rapid, pentru pastile statice
	fără control de timeline; nu îl folosi pentru secvențe
	Nano Banana Pro
	fotografie curată, fără text
	stills only — nu produce video
	Adobe video_metadata
	width, height, fps, durată
	necesită asset în Creative Cloud (urn:aaid:sc:EU:[uuid])
	Adobe video_resize
	reformatare pe rapoarte
	idem
	Adobe video_render
	asamblare din timeline JSON + Walnut asset IDs
	mai lent decât ffmpeg local; util doar când asset-ul e deja la Adobe
	Adobe video_create_quick_cut
	highlight reel AI dintr-o captură lungă
	selecția e a modelului — verifică fiecare tăietură
	Adobe animate_design
	preset-uri de mișcare pe un design Express
	scrierile Adobe cer plan activ; contul guest eșuează tăcut
	HyperFrames (HeyGen)
	design/HTML → proiect video, compose → render_video
	fără narațiune cu avatar. doar compoziție de mișcare
	Adobe Stock / Shutterstock
	licențiere footage
	URL-urile S3 semnate nu se pot descărca prin curl/web_fetch aici — soluție: base64 din răspunsul de licențiere
	

default: ffmpeg local. connectorii intră în joc doar când asset-ul e deja în cloud sau când e nevoie de licențiere.


________________


calea 01 — captură de produs
ordinea operațiilor (contează)
1. taie segmentele brute
2. abia apoi aplică setpts (accelerare)
3. blur pe date personale
4. crop la format
5. overlay pastile
6. export


setpts înainte de tăiere strică sincronizarea și dă tăieturi impredictibile.


# 1. taie un segment, fără recodare agresivă


ffmpeg -i raw.mov -ss 00:00:04.0 -to 00:00:09.5 -c:v libx264 -crf 16 -an seg1.mp4


# 2. accelerează segmentul deja tăiat (0.5 = de două ori mai rapid)


ffmpeg -i seg1.mp4 -filter:v "setpts=0.5*PTS" -an seg1_fast.mp4


# 3. concat (aceleași codec/rezoluție)


printf "file 'seg1_fast.mp4'\nfile 'seg2.mp4'\n" > list.txt


ffmpeg -f concat -safe 0 -i list.txt -c copy cut.mp4
blur pe date personale
zonă fixă, pe toată durata:


ffmpeg -i cut.mp4 -filter_complex \


"[0:v]split=2[base][tmp];[tmp]crop=520:96:96:512,boxblur=24:3[bl];[base][bl]overlay=96:512" \


-c:v libx264 -crf 18 -pix_fmt yuv420p blur.mp4


zonă activă doar într-un interval — adaugă :enable='between(t,1.2,4.0)' la overlay.


pentru conținut care se derulează: blurează cardul întreg, nu linia. la scroll, un blur pe coordonate fixe lasă date descoperite între cadre.
crop la format
# 4:5


ffmpeg -i blur.mp4 -vf "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)',scale=1080:1350:flags=lanczos" \


-c:v libx264 -crf 18 -pix_fmt yuv420p out_4x5.mp4


# 1:1


-vf "crop='min(iw,ih)':'min(iw,ih)',scale=1080:1080:flags=lanczos"


# 9:16


-vf "crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=1080:1920:flags=lanczos"


crop-ul e centrat implicit. pentru un cadru ancorat sus (tipic la capturi de telefon), adaugă offset explicit: crop=1080:1350:0:0.


________________


calea 02 — animație construită (HTML → cadre → video)
controlul determinist se obține prin Web Animations API: pauzează toate animațiile și setează currentTime manual pentru fiecare cadru.


from playwright.sync_api import sync_playwright


import pathlib


FPS, DUR = 30, 6            # 6 secunde


pathlib.Path("frames").mkdir(exist_ok=True)


with sync_playwright() as p:


    b = p.chromium.launch()


    page = b.new_page(viewport={"width": 540, "height": 675},


                      device_scale_factor=2)      # → 1080×1350


    page.goto("file:///home/claude/scene.html")


    page.wait_for_timeout(300)                     # lasă fonturile să se așeze


    for i in range(FPS * DUR):


        t = i * 1000 / FPS


        page.evaluate(


            "ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; })",


            t)


        page.screenshot(path=f"frames/f_{i:04d}.png")


    b.close()


ffmpeg -framerate 30 -i frames/f_%04d.png \


-c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart built.mp4


note: fundal transparent → omit_background=True pe screenshot plus background: transparent pe body; apoi export în .mov cu -c:v qtrle dacă alpha trebuie păstrat pentru compositing ulterior.


________________


calea 03 — still cu mișcare
zoompan direct pe o imagine la dimensiune finală tremură. scalează întâi ×4, apoi aplică mișcarea:


ffmpeg -loop 1 -t 6 -i still.png -vf \


"scale=4320:-1,zoompan=z='min(zoom+0.0006,1.12)':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1350:fps=30,format=yuv420p" \


-c:v libx264 -crf 18 -movflags +faststart kenburns.mp4


d=180 = durata în cadre (6 s × 30 fps). zoom maxim 1,12 — peste asta se vede mișcarea și iese din registrul „lent și intenționat”.


________________


calea 04 — film generat prin AI (text-to-video)
pentru mecanisme cinematice pe care motion-engine.js (CSS determinist, în social-creator) nu le poate produce — morph continuu, parallax 3D, tranziții de lume, resurse care nu există ca footage real — promptul se scrie cu skill-ul Claude Code `minimax-n3-motion-design` (`.claude/skills/minimax-n3-motion-design/`), care încarcă automat referința de brand `references/credit-republic.md` (paletă v4, regula albastrului o singură dată — la rezultat confirmat, „toate băncile" fără cifră, fără DAE, fără avatar AI care vorbește).

output-ul generat (MiniMax N3, Veo, sau alt model text-to-video) nu ocolește QA-ul doar pentru că a fost generat de AI — intră în calea 01 ca orice captură: tăiere, crop la format, overlay pastile, export. verifică separat, pe cadrele randate: #2C86F6 nu a apărut mai devreme decât beat-ul de confirmare, nicio cifră de bănci n-a apărut spontan într-un UI generat, wordmark-ul „credit republic" e minusculă — dacă modelul l-a randat cu majusculă sau deloc curat, îl suprapui tu în pastilă, nu-l lași pe al modelului.

segmentare: majoritatea modelelor text-to-video nu produc 15s dintr-o bucată (Veo ~8s per generare, MiniMax N3 variază) — skill-ul oferă un plan de segmentare pe 2-3 tăieturi naturale, fiecare segment reluând paleta și ancora de identitate; le concatenezi cu calea 01, pasul 3 (concat).


________________


compositing pastile
pastila ca PNG cu alpha
wkhtmltoimage --transparent --width 900 --disable-smart-width pill.html pill.png


sau Playwright cu omit_background=True pentru control mai bun al fonturilor.
overlay cu timing corect
tiparul care funcționează: -loop 1 -t [durată] pe imagine, fade în timebase-ul propriu al pastilei, apoi setpts=PTS+START/TB, apoi enable.


ffmpeg -i base.mp4 -loop 1 -t 3 -i pill.png -filter_complex \


"[1:v]format=rgba,\


fade=t=in:st=0:d=0.25:alpha=1,\


fade=t=out:st=2.75:d=0.25:alpha=1,\


setpts=PTS+2.0/TB[p];\


[0:v][p]overlay=x=72:y=880:enable='between(t,2.0,5.0)'" \


-c:v libx264 -crf 18 -pix_fmt yuv420p out.mp4


fără setpts, fade-ul se consumă la t=0 al output-ului, cât timp pastila e încă ascunsă de enable — și pastila apare brusc. e cea mai frecventă greșeală aici.
intrare cu deplasare 30 px
înlocuiește x=72 cu:


x='72-30*(1-min(1,max(0,(t-2.0)/0.3)))'
mai multe pastile
lanț de overlay, câte un [pN] per pastilă. respectă regula: intervalele enable nu se suprapun decât dacă a doua pastilă e o cifră complementară.


________________


export
ffmpeg -i final.mp4 \


-c:v libx264 -profile:v high -crf 19 -pix_fmt yuv420p -r 30 \


-movflags +faststart \


-c:a aac -b:a 128k -ar 44100 \


cr_mecanismul_4x5_v1.mp4


* fără audio: -an
* CRF 18–20. sub 18 crește fișierul fără câștig vizibil pe feed
* +faststart obligatoriu — altfel primul cadru se încarcă lent la autoplay
* denumire: cr_[unghi]_[format]_v[n].mp4
* livrare în /mnt/user-data/outputs/, apoi present_files


________________


QA vizual
# metadate


ffprobe -v error -select_streams v:0 \


-show_entries stream=width,height,r_frame_rate,nb_frames \


-show_entries format=duration -of default=nw=1 out.mp4


# eșantionare de cadre pentru inspecție


mkdir -p qa && ffmpeg -i out.mp4 -vf fps=1 -q:v 2 qa/qa_%03d.png


# cadre dese exact în intervalul unde apare o pastilă sau un blur


ffmpeg -ss 1.8 -to 5.2 -i out.mp4 -vf fps=6 -q:v 2 qa/pill_%03d.png


inspectează cadrele înainte de livrare. lista de verificare e în fișierul de instrucțiuni.


________________


capcane cunoscute
* setpts aplicat înainte de tăiere → tăieturi impredictibile. taie întâi.
* overlay fără -loop 1 -t pe imagine → durată impredictibilă a pastilei.
* fade pe overlay fără setpts=PTS+START/TB → pastila apare brusc.
* blur pe coordonate fixe peste conținut care se derulează → date descoperite între cadre. blurează cardul întreg.
* yuv420p lipsă → video care nu redă în unele playere și pe unele telefoane.
* fonturi web în Playwright: rețeaua e blocată, fallback tăcut pe Helvetica Neue. nu e o problemă — e chiar tipografia brandului — dar nu aștepta Acumin.
* Adobe: operațiile de scriere eșuează tăcut pe cont guest. verifică get_account_type înainte de a construi un flux pe connector.
* URL-uri S3 semnate (Adobe Stock): nu se descarcă prin curl/web_fetch aici. base64 din răspunsul de licențiere.