# Design log

## 2026-10-05 — Shared footer (@dosxdos/ui `Footer`)
- REJECTED: one thin grey row, credit centred between signature and legal links. "a bit poor".
- REJECTED: dark berenjena band like the header, credit in a darker strip below. "disgusting", "blocky and dark".
- CURRENT: light, on the page ground. Full berenjena logo + © + legal links left; "Desarrollado por / GALAGA AGENCY" (display caps) right; a huge >d mark at ~4.5% opacity cropped at the bottom-right edge. Separated by space only.
- REVISED: watermarks liked, but swapped: >d behind the signature (left), Galaga G behind the credit (right). First sizes (26rem / 22rem) "both too big"; now ~h-52 / h-40. Full dos×dos logo removed from the footer: "already in the header".
- REJECTED: two small watermarks (>d left, G right) half behind the text: "too strange". Cropped at the edge: "out of screen". One whole G watermark h-48: "way too big".
- CURRENT: no watermark. © + legal links left; credit right as a lockup: small solid Galaga G (h-9) + "Desarrollado por / GALAGA AGENCY".
- Credit "too heavy" at /80 → lowered to G /35, "Desarrollado por" /40, GALAGA AGENCY /45 (full primary on hover): "better".

## 2026-10-05 — Shared apps menu (@dosxdos/ui `AppsMenu`)
- "too heavy, and it overflows": filled tiles with boxed white icon, shadow, 2-line description, 4 cols, no max height.
- NOW: light rows (small icon box, name, 1-line truncated description), no fill until hover, 3 cols, panel capped at 100dvh-9rem and scrolls inside.

## 2026-10-05 — «Mis gastos» (gastos app home)
- "a bit poor": title + one button + list. Reference: Continia Expense App (ticket scan + mileage with map).
- NOW: two actions (Subir ticket / Kilometraje), white summary card (this week large; month and km small beside, no divider), weeks with status line. Modal with Ticket/Kilómetros tabs; mileage shows the route on a MapLibre map and the km · € figure large.

## 2026-10-05 — Nuevo gasto modal, two columns on desktop
- Asked for: two columns on wide screens (one column wasted the width).
- Rejected ("fucking confusing"): km form with the km·€ result + "Ida y vuelta" under the map on the right and the submit on the left; the eye zig-zagged.
- Now: left column = everything filled in, top to bottom (places, Ida y vuelta beside "Añadir parada", fecha/OT, motivo), then the km·€ result right above "Subir kilometraje". Right = map only. Ticket: photo panel left, fields right. Modal size "xl" (max-w-5xl).
- Rejected again ("fucking disaster"): scrollbar inside the modal + empty space (tabs on their own row, big gaps, map column shorter than the form). His browser viewport is ~1190×605: ALWAYS measure there.
- Now: tabs beside the title in the modal header (Modal `headerExtra`), modal up to full height, km = [places | map] / [fecha | OT | motivo] full width / bottom bar [km·€ … Subir]. Ticket = [photo | fields] / bottom bar [hint … Subir]. No scroll at 1190×605 (measured).

## 2026-10-06 — Design pass on the whole app ("can be improved, including the modal")
- Diagnosis: flat — every element the same weight (grey pill, 20px corners, loud caps label), nothing leads. Dashed dropzone + circle icon = stock upload look. "Ida y vuelta" dark pill read as the CTA. Grey bottom box with a filler sentence. Map opened on sea. Big "0,00 €" as the loudest thing on an empty page.
- NOW: modal title IS the tabs (Ticket / Kilómetros in the display face, inactive at /30). Labels at /55. Solid soft photo panel with drag-and-drop on desktop. Round trip = real switch. No bottom box: figure left, button right. Map centred on Gran Canaria (zoom 9.4). Home: actions under the title, map icon for Kilometraje; empty week → send date leads, no big zero; one-line empty state. OSM attribution control removed (asked).
- REJECTED ("it was better before"): the whole pass. Restored: "Nuevo gasto" + boxed tabs, full-ink labels, grey bottom bar with hint + CTA, home actions right of the title, big weekly figure even at zero, two-line empty state. Kept (not taste): round-trip switch, chips on one row, drag-and-drop photo + desktop copy, map centred on the island, credit hidden, map icon on Kilometraje.

## 2026-10-06 — Accounting view («Equipo»)
- REJECTED: first version = one long white card, a block per person with small rows; no filters, arrows only. "too ugly, too poor, nowhere to filter", "no nice calendar picker", "logística has it much nicer, with the media viewer".
- NOW: header "Semana N" + WeekPicker (‹ pill with calendar ›; panel where one click picks a whole week row, ISO week numbers on the left). Summary card: total big, Personas/Tickets/Sin OT, stacked berenjena bar by type, type buttons that filter. Filters: search person, Todos/Oficina/Rutas, "Solo sin OT" switch, "Quitar filtros". Left: sticky people list. Right: per person heading + "Descargar tickets" (one PDF: cover list + one page per photo) + grid of photo cards (4:5, "Sin OT" tag). Viewer = logística's full-screen MediaViewer (counter in paper, not accent red).

## 2026-10-06 — «Mis gastos» ticket rows
- "can we improve the design of the items": rows were flat (small square thumb, grey text, amount at the end, "Retirar" as loose text).
- NOW: each ticket is a white card spaced from the next (no lines): tall photo (4:5) left, kind with its icon, day + OT pill ("Sin OT" muted), note on one line, amount in the display face right with "Retirar" (bin icon) under it. Withdrawn/rejected cards fade, say why, amount struck through.

## 2026-10-06 — App logo and install drawer
- Logo, asked "like montadores" (>d with a truck): >d with a torn receipt slip over the d's bowl, knocked out with a white gap; berenjena on white. App icon = that mark on white (montadores style). Files: public/assets/icons/*, public/assets/img/logos/gastos-logo-{berenjena,blanco}.png.
- Install drawer ("proper drawer, animated and premium, not the browser's"): bottom sheet, grabber, tinted band with the app icon (pop-in) + "Gastos / Dos por Dos Grupo Imagen" like a store listing, display title "Tenla en tu pantalla de inicio", one line why. Android: "Instalar la app" fires the real prompt + "Ahora no". iPhone: two steps (Compartir → Añadir a pantalla de inicio) with icons + "Entendido". GSAP: scrim fade, sheet rises with slight overshoot, icon pops, items stagger. Phones only, after the loader, 14-day snooze.
- REJECTED ("confusing"): store-listing band + separate title + paragraph + two numbered steps. Too many parts saying the same thing.
- NOW: one row (icon + "Instala Gastos" / "Ábrela desde tu pantalla de inicio, como una app."), then the action. iPhone: one sentence with the share icon inline ("Pulsa [⇧] abajo en Safari y luego Añadir a pantalla de inicio.") + "Entendido". Android: "Instalar" + "Ahora no".

## 2026-10-21 — DosxIA sidebar ("more premium, polished; it's sad")
- Live version: white panel, "Conversaciones" display title, berenjena "Nueva conversación" button, plain text rows. "Sad", "not premium", "old shit".
- REJECTED: speech-bubble icons per row + "Recientes" label ("same, you just added an icon"); floating rounded white panel with bolt brand mark ("meh"); berenjena-filled sidebar continuing the header ("OH NOOOO", "NO BERENJENA", "AWFUL"); sidebar on the grey with the chat as a floating white rounded canvas ("AWFUL"); compact Claude-style list with round + button and date groups ("too basic, not pretty"); frosted glass panel with gradient button and search ("WTF IS THIS", "doesn't match anything of the portal apps"); white cards per conversation with answer snippet ("doesn't look like a sidebar anymore"); a static HTML page with three options ("I NEVER ASKED FOR HTMLS").
- Open: no direction accepted. Next attempt needs a reference he picks; do not guess again.
- REJECTED: white sidebar with the tab rail's sliding berenjena pill turned vertical, white "Nueva conversación" button, rows with title + "Hace 2 h · 3 preguntas": "boring, square, no refining".
- REJECTED: the portal's left white card (rounded-[28px], portal shadow) floating on the grey, "Acciones rápidas" rows with date tiles: "not impressed, very common".
- REJECTED: same panel, tiles drawing a mini bar chart of each conversation's data + headline figure under the title ("128.450 € · hace 2 h"): "and boring", "meh, no".
- REJECTED: the same panel with motion (sliding grey highlight, hover nudge, staggered rows): "same shit". Display-face conversation titles, house section title, house primary button, Galaga credit in the panel ("remove the Galaga shit"), legal links on the fine-print line under the composer ("horrible"), legal links under the panel on the grey ("worse than ever").

## 2026-10-23 — Clientes home (category wheel page): "needs a pimp, doesn't feel premium"
- Before: wheel left, rectangular cover photo right, name + count + "Ver proyectos" under it. "The wheel is super creative, the rest sure isn't."
- REJECTED: the lens — the photo inside a round lens at the wheel's centre, labels orbiting it, caption bottom-right ("half the screen is empty, very weird").
- REJECTED: same lens + "Últimos montajes" list of 3 white cards (thumb, title, tiendas · fotos · mes) and "Ver proyectos" on the right half: "it's not good at all".
- Kept: the wheel itself. Next attempt needs his reference or a picked direction, not another guess.
- "I like it kinda, but too academic, too symmetric, lacks fun" (lens + list of 3 white cards).
- REJECTED: the 3 latest as tilted, overlapping photo prints (polaroid-style, hover straightens) + an off-centre orbit ring: "the images look horrible in it". Back to the list of cards.
- Open: "even the wheel, as a plain wheel, doesn't convince me". Needs a direction from him.
- Drum (3D reel of names, no circles) + big photo with caption on it + 2 cards: "oh yeah not bad". He loves the drum.
- Asked: "Categorías" eyebrow above the wheel (done) and "right side less academic".
- REJECTED ("I hate what you are doing"): big photo bleeding off the right edge, the two earlier installations as loose photos laid over its corner, count + CTA bottom-right, vertical reel-wipe reveal. Back to the "not bad" right side.
- Asked: images keeping their original ratio, "like the portfolio page of our website".
- REJECTED ("hate it, I expected images"): the website's archive list (numbered big names, photo only on hover following the cursor). He wants photos VISIBLE.
- NOW: two-column masonry of the 6 latest projects' photos at natural ratio, name + tiendas·fotos·fecha under each; scrolls inside the right half.
- Right half, photos at their own ratio, all REJECTED in a row on 2026-10-23: two-column masonry wall ("not list"); random scatter, too big / too small / crooked / stacked / "half the space is empty", "not nice"; justified gallery filling the half ("meh, not very creative"); overlapping cascade big→small bottom-left→top-right ("weird").
- Constraints he gave: photos visible without hover, original ratio, square corners, OT data visible under each, nothing extra on hover, only 2–3 photos, must fit the viewport, may overflow sideways, no empty half.
- Stop guessing: next version needs a picture of what he likes.

## 2026-10-26 — Clientes Inicio (dashboard)
- REJECTED ("absolutely not creative, horrible"): list "Ahora mismo" with progress bars + "Próximas semanas" bar chart + "Mes a mes" dot grid. Also: blue and green state colours ("nothing to do with our branding"), bars that say nothing on hover.
- REJECTED ("very busy, poor visually, overwhelming, can't click anything"): agenda board of 8 week columns with every project listed in display caps + meta line.
- REJECTED ("overwhelming", "I'd say fuck it and leave", "empty, missing visual stuff"): calmer week columns with big numbers + one-line names; drawer per project (kept: the drawer).
- REJECTED ("my fucking god, wtf is this design"): grey full-bleed band with huge number + project rows + MapLibre map (blue sea) of the islands, then a boxed grid of 7 week tiles, then 4 cropped photos.
- NEXT: only his approved language (the category archive page: white, big display type rows, hairlines, no boxes, no extra hues). No map on Inicio (blue sea = off-brand; the map belongs in a Tiendas tab, restyled).
- REJECTED: "WTF are you doing" when I removed the map, totals and intro instead of designing (removing is not a design fix).
- KEPT (no complaint): 4 white stat cards (Esta semana / En curso / Próximas semanas / Terminados) with big display figures; map recoloured white land + house-grey sea, pulsing rings for planned shops; map credit removed (his call: private app).
- REJECTED: day calendar (visits all land on Mondays: the office plans by week) — "confusing", "starts on the 26, switches month in the middle", dot sizes by count ("why various dot sizes"), today as a ringed box ("css").
- REJECTED ("horrible choice of design"): weeks as stacks of small squares ("each square a shop", skyline).
- NOW: weeks as a row of small white cards in the stat-card language.
- REJECTED ("wtf is this design"): week projects as one run of huge display names with slashes and superscripts under a facts strip. Too much big text.
- NOW: brand index (magazine contents): brand in display caps + its week projects in small text, in columns.

## 2026-10-26 — Ajustes (ex Perfil)
- Rejected: grey blocks (original); white cards side by side ("the two blocks look horrible", twice); open sections with a 1/3 label column ("???"); a giant "AJUSTES" hero after the website's Contacto ("don't want ajustes huge", "not like the web nor the app").
- Wanted: the profile image + name as the header.
- Current: centred single column (max 56rem): logo + name header, then Tu cuenta / Correos (Gastos Switch) / Contraseña separated by fine lines, no boxes.

## 2026-10-26 — Contacto
- Rejected: plain dl list + chip ("horrible"); website-style "¿Hablamos?" with icon tiles and a boxed panel ("overloaded, noisy, not balanced"); stripped version without boxes ("you stripped everything", "look at how we built other pages").
- Current: Inicio's language — title row with a line beside it, the form in a white square card (2/3), three square info cards (email, phone, hours) stacked on the right like the stat cards. Fits one laptop screen.

## 2026-10-26 — OT timeline («Cómo va»)
- Rejected: four dots with labels and dates in a row ("full crappy shit, not even well designed").
- Accepted ("much better"): status sentence in the display face + shops figure (3/18) on the right, then one bar cut in four (full / half / faint) with step name and date under each, in a white card.
- 2026-10-27 Contacto: two-column (form card + right column of contact rows) rejected again ("absolutely horrible"): the right column ended short and unbalanced; the chosen OT as a grey row with a check icon read as a checkbox. Now: header like Inicio, the contact details as a three-part strip across the page, the form in one full-width card, the chosen OT shown as the filled search field with ×.

## 2026-10-28 — Hola Cracovia tourist app, prototype v2 (prototype/app-v2.html)
- v1 (app.html): warm-paper ground, white cards, bottom tabs, gold gift box. Thomas: "genius", but asked for a second, more creative version "not a basic app template".
- v2 signature: the logo's folded map. Welcome unfolds in 3D with the dotted route drawing itself; explore is a route of dots with tilted postcard cards; visited venues get a double-ring ink stamp; the box is a lime envelope with a wax seal that lifts; the open gift is the ONLY gold screen, a tear-off ticket with a sheen. Forest ground + bone panels, lime accent only. Bottom bar is a folded forest strip.
- Premium layer added on request: staggered entrances, stamp slam, ticket sheen, hero zoom-out, breathing next envelope, seal ripple, urgent red countdown under 10 min.
- Not yet reviewed by Thomas.
- REJECTED (v2): "not polished, not better", "a lot of bugs", "only darker, greener and heavier, not the premium feel I expected". Forest ground + lime diagonal cuts + tilted cards + stamps + envelope = too many ideas, heavy chrome. Premium for Thomas = light, airy, photography-led, precise type, few elements; NOT more colour or more devices.
- v3 (app-v3.html): white ground, photography-led. Welcome = big photo with text below it, not over it. Explore = full-height 4:5 photo cards in horizontal snap rails per category; the gift state is a frosted pill ON the photo. Venue page = tall photo + sheet. Activate = a dark gift box whose lid springs open. The open gift = the ONLY dark screen, a gold card with sheen, countdown + ring. Nav = floating glass pill. Both v2 and v3 class clashes (.scan / .gift screen vs element) were real bugs; every screen now probed in Playwright with zero console errors.
- v3 feedback: "nice, but looks like any other app". Added the SIGNATURE: the guides. Each venue is a named guide's pick with a one-line personal tip (data.js HC.guides / HC.tips). Explore opens on an editorial cover ("La elección de hoy": the tip as a big quote, the guide's name and year); cards carry the guide's monogram; the venue page has the tip as a pull quote with the guide signature; hero parallax on scroll. Not yet reviewed.
- "Why black? Did you even check the website?" — I had taken the palette from the logo. holacracovia.com is lime #75d200 (nav bar, headings) on white, navy #0b132b / #0f1747 dark panels, teal #13a589 accent, grey #f0f0f0, slanted section edges, faint map outline. No black, no forest green. v3 re-tokened to the site: lime fills with navy text, navy for the dark gift screen and the ES/IT toggle, teal for "open" states and links.
- Landing: Thomas: "the best version so far was the first; the next two are crap". REJECTED: full-photo + rising sheet with guide avatars; then the reduced sheet with city selector. RESTORED: the first v3 landing (photo top fading to white, tag, "¡Hola! Bienvenido a Cracovia", subtitle, how-it-works chips, two city cards, button), keeping only the later fixes (bigger logo with halo, site palette, sliding toggle). Do not redesign the landing again unless asked.
- Ranking from Thomas: first v3 landing best; the full-photo + sheet with guide avatars (version two) is "defo the worst"; the reduced city-selector sheet also rejected.

- 2026-10-29 — Landing: headline no longer names the city ("¡Hola! Bienvenido"); city cards now sit under "¿En qué ciudad estás?" so the choice reads as a question. Layout unchanged.
- 2026-10-29 — Bottom bar: big glowing lime ball rejected as "kids toy", navy bar rejected. Now a compact white frosted floating pill with a small navy scan capsule and lime icon, no glow, ring or halo. Venue CTA moved into the flow (no green-on-green), map pins framed above the card, doubled venue photo fixed.
- 2026-10-29 — Bottom bar: a SINGLE solid white floating pill (the frosted one was hard to see) with labelled tabs and the active tab in a grey capsule. Scan stays CENTRED as a navy circle with a lime icon inside the bar. The split bar was rejected because scan must be centred; the glowing lime ball and the small capsule were rejected as toy-like/cheap.
- 2026-10-29 — Gift box opening rebuilt: the box shakes, then squashes, the lid lifts and hovers tilted (it no longer flips or fades), warm light rises from inside with sparks, then the gift screen opens. The bow is built in CSS (the Phosphor ribbon icon did not render).
- 2026-10-29 — Admin panel rebuilt in the site palette (the old forest green and boxed logo are gone): white sidebar, navy active pill with a lime icon, cool grey ground. Signature: the navy "Cierre de octubre" band with the amount to invoice and one chip per partner showing its report status. Added for the MVP: categories, report workflow (draft, reviewed, sent), featured toggle, drawers for create forms, empty states, permissions, A5 QR poster.
- 2026-10-29 — Admin panel rebuilt in the site palette (the old forest green and boxed logo are gone): white sidebar, navy active pill with a lime icon, cool grey ground. Signature: the navy "Cierre de octubre" band with the amount to invoice and one chip per partner showing its report status. Added for the MVP: categories, report workflow (draft, reviewed, sent), featured toggle, drawers for create forms, empty states, permissions, A5 QR poster.
- 2026-11-01 — Prototype v1 (app.html) and v2 (app-v2.html) deleted at Thomas's request; app-v3.html is the only tourist app. index.html rebuilt as the client-facing demo page (site palette, v3 only) for the 2 Nov call.

## 2026-11-10 — Scoreboard: staff login (/acceso, /acceso/contrasena, /acceso/confirmar)
- Design read: private staff tool for council pitch-side staff, municipal-trust language, council burgundy + Barlow.
- Signature: the scoreboard itself idle before kick-off ("00:00", "Marcador en espera") in a burgundy panel (5/12) beside the form; on phones a band above it. Form flush-left, max 26rem, field lines, one primary button, secondary actions as underlined text links.
- Fixed: `text-body-sm` carries its own muted colour and beat `text-on-primary` (dark text on burgundy) — on primary use `text-label`. Logo too small to read ("logo is too small") → 64px mobile / 96px desktop; navbar logo 40 → 48px.
- Not yet reviewed beyond the logo remark.
- REJECTED v1 ("very basic", "lacks the premium touch"): flat burgundy panel with 00:00 beside a bare form.
- REJECTED v2/v3 ("is it really design and polished?", "I still don't get it with this big black marcador"): a dark LED scoreboard object (housing, dot matrix, amber digits) floating on a burgundy pitch, form on a white card; then the same board mounted over a pitch plan. The black board reads as a foreign object on a login. Do NOT put the LED board on the login again.
- NOW v4: light ground, form set straight on it (no card), crest 80px; right 5/11 a burgundy panel with the WHOLE pitch drawn upright, precisely, faint lines; "Videomarcador" + "CENTRO DEPORTIVO EL MOLINO" at its foot. Phones: a burgundy band with the name above the form.

## 2026-11-10 — Scoreboard: match control (/)
- Design read: pitch-side tablet tool, same burgundy + Barlow language as the login; the amber LED board (shared LedScoreboard) is the one rich object, one per match on screen, so the operator sees exactly what the screen shows.
- Structure: header with h1 + Campo completo / Campo dividido toggle; one white panel per screen slot (A badge in split mode, reference as heading, dropdown to change the match); big -1 / +1 (64px) per team, Iniciar/Pausar/Reanudar + Reiniciar, Finalizar encuentro (Modal confirm for finish and reset). Below: prepare match + teams (admins only add) in two open columns, then results as a plain grid of reference/date/score, no rows or hairlines. Split slots stack below 1280 so the LED never crowds.
- Not yet reviewed by Thomas.

## 2026-11-10 — Scoreboard: error pages
- Idea (one): "Partido interrumpido". The pitch's centre circle drawn as a clock face, run round to five sixths and stopped, the ball resting where the whistle caught it (burgundy hairline on the light ground, no LED board). Route error draws it in once (GSAP); the crash page ("Partido suspendido") shows it static, CSS only, with the crest.
- Copy: kicker "Tiempo detenido", plain cause + what to do, Reintentar (reload) + underlined link back to the marcador; error.message never shown.
- /pantalla gets its own ScreenError: dark board-coloured screen, no staff text, reports, reloads itself every 30 s.
- Gotcha: `vector-effect: non-scaling-stroke` breaks `pathLength` dash units; leave it off the arc.
- Not yet reviewed by Thomas.

## 2026-11-10 — Scoreboard: 404
- Idea: the ball has gone out of play. A corner of El Molino drawn at scale in hairlines on the light ground (penalty and goal areas, spot, arc, goal, corner flag in burgundy), faded toward the far edges; the ball lies just over the touchline. Copy: "Error 404 / Esta página se ha salido del campo", one button back to the match. No LED board, no dark ground.
- Motion: the ball rolls over the line spinning with a thin trail drawn behind it, then the flag snaps open; text rises in. Reduced motion shows the final picture.
- Not yet reviewed by Thomas.
- 2026-11-10 (later) — LOADER accepted ("okay fine"): light ground, crest, a burgundy dot-matrix counting 0–100 % (plain digits + % sign, quiet dots). Rejected on the way: curtain wipe ("boring"), 90:00 match clock, aerial pitch photo ("horrible green, fucks my design"), 3D score drums (99/00/50 "strange"). PageLoading = the pitch plan drawing itself in burgundy hairlines (he liked that drawing).
- LOGIN rejected after v4: burgundy panel + pitch drawing ("not creative, most basic login", "tons of noise": pill tag, tagline, footer line, double bezel), dotted LED clock ("never said to put dotted shit again"), acta paper + council stamp ("don't understand what it is", "cramped"), full-page kick-off pitch with the form in the centre circle ("horrible"). Never reuse anything from his other projects' logins.
- LOGIN NOW: the goal seen from behind its net (canvas spring mesh, burgundy hairlines, left post + crossbar running off the page). On arrival a shot comes in and billows the net, the ball drops and rolls to rest; the pointer then presses the net. Left: crest + form only, no tags/taglines/footers. Not yet reviewed.
- LOGIN rejected again: goal net with spring physics ("too wavy", "just don't like it"); crest + form + pitch plan drawing on the light ground ("boring, feels like a WordPress template", "the whole stuff isn't creative"). Lesson: the form-left / ornament-right SKELETON is the template, whatever sits on the right.
- LOGIN NOW: no split. A split-flap board (white flaps, burgundy Barlow letters, 12 × 3) the width of the page IS the interface: flips to "ACCESO / AL PANEL / MOLINO 16:06" on arrival, echoes the email letter by letter as it is typed, shows only asterisks for the password, flips to errors / "REVISA TU CORREO". The form is one slim console row under it (stacked on phones). Not yet reviewed.
- 404 v2 (after the pitch-corner v1, text left + drawing right = the rejected split skeleton): "Fuera de juego". The whole page is a broadcast VAR freeze-frame: warm-grey mowing stripes leaning with the camera, the offside line (2px burgundy) with a faint burgundy onside zone behind it, the site host on the onside side and the path the visitor typed set huge in burgundy Barlow beyond the line. Verdict, copy and one button follow beyond the line. Motion: the path runs in, the line is dragged across from the touchline and lands behind it, then the verdict rises. Not yet reviewed.

## 2026-11-10 — Scoreboard: what's on air (screen program)
- LED screen: goal takeover per board (matrix pulses once, never strobes; GOL lights row by row with steps(); team name flickers on; the other board in split mode never moves). Content lists play full-bleed, undistorted, with an LED score strip under them at half time and at the end. Idle = institutional screen: crest on a bone disc, "Centro deportivo / EL MOLINO" in LED amber, local time.
- Panel: "En pantalla" card under the header. Left a small LED monitor of the program on air (same amber as the screen) + "Mostrar contenidos" kill switch. Right a program bus like a vision mixer: Marcador / Previo / Descanso / Final keys, the one on air lit burgundy; while content is on air the Marcador key becomes "Volver al partido" (burgundy 2px edge). Momento específico = dropdown + Lanzar. Split mode asks for confirmation before full-screen content (R03).
- Not yet reviewed by Thomas.

## 2026-11-11 — Scoreboard: opening loader + panel restructure
- LOADER accepted ("perfect"): the 90-minute match clock. 90 ticks lighting burgundy with the load, pointer at the sweep's edge, minute counting in the centre ("63′ MINUTO"), crest + "Videomarcador" + venue low-left; runs to 90′, holds, lifts. Calm version (crest + name + slim bar) was "far too basic". Note: a 90:00 clock was rejected on 2026-11-10 in a louder form; this quiet dial is what landed.
- PANEL split by job (Thomas: "landed on such a shit I don't know where to start"): En directo = match day only (one console per match on screen, then "En pantalla"); Encuentros = agenda by day (date leaf left, fixture rows with monograms, "Llevar a la pantalla A/B") + results list (winner in ink, loser stepped back) + "Nuevo encuentro" modal with format and kick-off; Equipos = add row + monogram tiles with record.
- Console: team rows (monogram, name, big score, small −, big +), stage track Sin empezar → 1ª parte → Descanso → 2ª parte → Final, big clock, added-time stepper, one primary key (Empezar / Pausar / Reanudar / Empezar la 2ª parte) + the step that closes the half (Descanso / Finalizar, filled once regulation time is up), operator lock line.
- Empty states: the scoreboard waiting, a large mark in the border tone ("– : –", "0 – 0", "A") next to the title, what to do and one action.
- Not yet reviewed by Thomas.

## 2026-11-11 — Scoreboard: navbar, menu, footer, En directo calmed down
- Verdict on the previous state: "this design is a freaking joke… awful, noisy and overwhelming" (white bar with caps links + burgundy pill + outlined sign-out; match cards with team marks, giant score, three button colours, a burgundy "siguiente paso" box, links everywhere; "Qué ve el público" with the dark LED monitor and four big keys).
- NAVBAR NOW (PanelNavbar): no bar and no line. Crest left, the pages on one white capsule track in the centre, "Pantalla ↗" and sign-out as quiet text on the right, all straight on the page ground; frosted ground only once the page scrolls under it; hide on the way down as before. A burgundy lens rests on the current page and slides to the link pointed at: it is a white-on-burgundy copy of the row cut with clip-path, so the letters invert at its edge. Labels in Barlow, sentence case (`text-nav`).
- MENU NOW (PanelNavSheet, on <dialog>): a full sheet of the page ground (30rem panel on tablets) sliding in from the right; pages set large at thumb height, the current one under the same burgundy lens, Pantalla with its arrow, sign-out below; lines rise in one after another.
- FOOTER NOW (PanelFooter): the Dos x Dos footer in council colours. On the page ground, set apart by air: "© year Ayuntamiento…" + "Reducir animaciones" as a text line (tick when on) left, Galaga G + "Desarrollado por / GALAGA AGENCY" right, the name opening its tracking on hover.
- EN DIRECTO NOW (LiveSheet): one quiet white sheet per match. The score is the only object: two warm tiles with burgundy numerals that ARE the goal keys (press the tile, the numeral rolls; a small round − in its corner), the clock between them. Under it the "siguiente paso" sentence as plain text and exactly ONE filled key (liveKeys: claim / take over / clock key / closing the half once time is up), at most one quiet key beside it. Everything else (who holds it, Dejarlo, Reiniciar reloj, Quitar de la pantalla) is one line of small print. No team marks, no boxes inside the sheet. Tiles offer "+ Gol" only to whoever holds the scoreboard.
- "Qué ve el público" NOW (LiveOnAir): no panel and no LED monitor. One selector in the mode switch's language (sand track, white thumb): Marcador / Anuncios previos / del descanso / finales, what is on air named in burgundy beside the title, then the one-off piece (only when there is one) and the incident switch. Uses useScreenView() so it says what /pantalla shows.
- Empty slot (LiveVacant): the same sheet with its two tiles waiting in the border tone, the next matches with "Poner aquí" (first one filled), or "Preparar en Encuentros" as the filled key when nothing is prepared.
- Old files kept, unused: Navbar, NavLinks, MobileMenu, Footer, LiveHeader, LiveMatchCard, LiveEmpty, MatchOnAir (+ monitor, keys).
- Not yet reviewed by Thomas.
- 2026-11-11 (later) — En directo, second pass. Thomas on the sheet version: "I am still not super happy with the design on the live page", and "even the modal to switch view isn't nice". Read: it looked like a form (beige score tiles = empty inputs, names under them, clock a small line on top, two full-width uppercase bars like a checkout), noise for people not holding the match, "Qué ve el público" floating apart as a settings strip, header too big. Navbar, menu and footer were fine: untouched.
- NOW (LiveScreen / LiveMatch): the page is ONE white surface, the LED screen. On its face each match is a scoreboard: home and away either side of the match clock, a ring of 90 ticks lit in burgundy as far as the match has run (the loader's accepted dial language, live), time and half read in its centre; bare burgundy numerals with the team name right above them. Whoever holds the match gets a tonal "+ Gol" pill and a round − under each number; nobody else sees keys, "Tiempo cumplido" or added time. Under the board: ONE filled pill in sentence case (Pausar / Empezar la 2ª parte / Llevar este marcador…), at most one quiet key beside it, the next-step sentence as its small caption, then one line of small print. Split pitch = two halves side by side in the same surface (stacked under 1280).
- The screen's state is the surface's FOOT (tinted band, no line): "En pantalla ahora: Marcador" + Marcador / Previo / Descanso / Final as one selector (the one on air tinted burgundy) + the incident switch. Header is one slim line: small title, help, mode switch.
- Confirmations (LiveConfirm, on <dialog>; MatchConfirm/Modal untouched): bottom sheet on phones, rounded card on computers, burgundy-tinted backdrop. They show what is at stake as a scoreline panel (mode switch and remove: the match that leaves, its score, "El marcador y el reloj se conservan" with a tick; finish: "Resultado final"; reset: "El reloj pasa de 63:14 a 00:00"), one filled pill, a quiet Cancelar.
- New primitive: ui/PillButton (sentence case, display face; filled / tonal / quiet). Previous pass kept unused: LiveSheet*, LiveVacant, LiveTopline, LiveOnAir*.
- Not yet reviewed by Thomas.

## 2026-11-11 — Scoreboard: the LED screen (/pantalla)
- REJECTED (Thomas: "the pantalla looks terrible. I don't even understand the choice of design."): three-letter codes, amber glowing digits, time and "EN JUEGO" on a dotted dark housing; idle = crest on a bone disc + "CENTRO DEPORTIVO EL MOLINO" in amber + local time. Never again on this screen: amber LED digits, glow, dot matrix, codes instead of club names.
- Design read: a public scoreboard for a municipal ground, read from 20 to 80 m; municipal burgundy + Barlow Semi Condensed black; the centre circle is the one object.
- NOW: unlit near-black ground. Each club is a burgundy panel mown in broad bands (a half of the pitch): crest (or a bone shield carrying the club's code when it has none) + FULL name, goals in white Barlow 900 as tall as the panel allows, set against the centre. Between them the centre circle, cut into both panels: the dial. Clock inside, the half above it ("2ª PARTE"), a thick white ring lighting with the period, a bone "+3" pill for added time. Half time: "DESCANSO" + the break counting down, the result untouched beside it (M03). End: "FINAL", ring full. Not started: "INICIO 17:00" when a kick-off time is set.
- The sign: a bone plate over the board with the council's full logo (it needs a light ground) and "CENTRO DEPORTIVO EL MOLINO"; on a long, low screen (from 5:2) it stands at the left end with the crest alone.
- Shared pitch (R03): two boards side by side; a narrow board stands its two panels one over the other with the dial between them. An empty slot shows the venue panel, never a 0-0.
- Goal: the board floods burgundy, GOL rises letter by letter (power4), the scorer's bone plate comes up, the word swells slowly, everything fades back to the score. No strobe, no flicker. Only that board moves.
- Idle: one burgundy mown panel, "CENTRO DEPORTIVO / EL MOLINO" huge, the council's logo on its bone plate, the same dial keeping the time of day (ring = the hour).
- Content: the piece whole on the dark ground; at half time and at the end a result strip under it (bone "DESCANSO"/"FINAL" plate + a burgundy panel per match; names step to two lines, then to crests only, as room runs out).
- No size is assumed (T01): every length is a container unit of ScreenCanvas, every layout change a container query on shape (sign 5:2; board 13:10; panel 3:2; venue 5:2 and 3:2). Checked at 1920×1080, 1920×960, 1920×640, 1024×768.
- Old components kept, unused: ScreenBoard, ScreenGoal, ScreenIdle, ScreenInstitutional, ScreenScoreStrip, led-power-on, goal-takeover.
- Not yet reviewed by Thomas.
- 2026-11-11 (later still) — En directo, refinement. Thomas on the scoreboard-and-dial version: "super nice, but it needs slightly more breathing space between blocks, and make it easier for the eye to identify what is what: a lot of information with little visual hierarchy and contrast." Concept kept.
- NOW (LiveStage*): the screen is a frame in the warm sand tone; each match is its OWN white card on it (A and B no longer share a surface), with a filled burgundy A/B badge. Order of strength: score (burgundy numerals) > clock in the dial > team names > reference, format, caption and small print in the muted/subtle tones. Groups are spaced apart and tight inside: header / scoreboard / action + caption / small print. "+ Gol" is an outlined burgundy pill and the − a ringed circle (the pale pink ones were too faint). Small print in two voices: left "✓ Llevas tú este partido · Liberarlo", right the rare actions in the subtle tone.
- "Qué ve el público" sits on the frame under the cards with its own heading and "En pantalla ahora: X" beside it, the selector on one row, then the one-off ad (pieces as pills to pick + "Poner ahora", sentence case, no uppercase dropdown label) beside the incident switch.
- Previous pass kept unused: LiveScreen, LiveScreenFoot, LiveMatch, LiveMatchSide, LiveMatchFoot, LiveMatchVacant.
- Not yet reviewed by Thomas.
- 2026-11-11 — En directo accepted so far: "much better" on the separate match cards + hierarchy pass. "Qué ve el público" was "super confusing, we don't know what it refers to or what it does."
- NOW (LiveAirPanel): left, the pitch screen itself in miniature, live, drawn with the real /pantalla components (ScreenMatch, ScreenPlaylist, ScreenResultStrip, ScreenStandby) in a box of the physical screen's shape, fed by useScreenView, captioned "Así se ve ahora la pantalla del campo". Right, the keys named as actions: "Mostrar el marcador", "Poner anuncios del previo / del descanso / finales" with their count, the one on air filled burgundy and marked "✓ Se ve ahora"; one quiet line "Los goles y el reloj siguen contando aunque pongas anuncios."; "Poner un anuncio suelto" (the shared Dropdown with its new opt-in sentence-case label `plainLabel`, then "Poner ahora"; pills were rejected: "there can be many ads"); the incident switch reworded "Quitar todos los anuncios (solo marcador)" (on = ads off). Stacked on phones. LiveStageOnAir kept unused.
- Not yet reviewed by Thomas.
- 2026-11-11 — "Qué ve el público", follow-ups from Thomas ("nothing explains it anywhere"): a quiet line under the keys states the automation (minutes built from PRE_MATCH_LEAD_MS); a "?" beside the heading opens the drawer "Cómo cambia la pantalla" (what changes on its own, what each key does, when to turn ads off); the incident switch left the main view for a small link "¿Problemas con un anuncio? Desactivar anuncios" with a LiveConfirm, and while ads are off a burgundy banner at the top of the block says so with "Volver a activarlos".

## 2026-11-12 — Mi fotocall: chrome (PageLoader, Navbar, primitives)
- Direction: ceremonial, light, unhurried. World = a First Communion (white dress, gilt
  recordatorio, the Host). Moments = the guests' photos; chrome stays ivory + sepia, gold for actions.
- Signature: one thin gold ring = the Host and a camera lens. PageLoader draws it, then the
  wordmark "Mi fotocall" (Cormorant) slides in beside it with a hairline gold progress bar under
  the word: a horizontal lockup, not a lone centred mark. Exit: bar fills, lockup fades and
  shrinks 3%, ground fades. Navbar: ring + wordmark left, two text links right, current page in a
  surface-2 pill; frosted surface only after 60px; hides on scroll down.
- Known risk: design-frontend flags cream + gold + serif as a default AI cluster. Chosen anyway
  because white and gold ARE the liturgical colours of a communion; awaiting Thomas's verdict.

## 2026-11-12 — Mi fotocall: home (photocall)
- Built without a mock-up review (Thomas: "dont show it to me build it").
- Split on desktop: intro left (serif title, lead, name as a field-line form → "Firmas como" +
  name in serif), 3:4 viewfinder right with a soft shadow. Under the intro, "Lo último del álbum":
  the 3 newest photos as tilted overlapping prints (ivory print border), linking to the gallery.
  Phone: stacked, camera scrolls into view when opened.
- Signature: the brand ring IS the shutter (gilt ring around a solid gold disc). Library upload
  left, camera switch right. Shot → preview with Repetir / Añadir al álbum; ivory flash on capture.
- Camera never asked on load: a tap on "Abrir la cámara" inside the viewfinder placeholder.

## 2026-11-12 — Mi fotocall: whole look REJECTED
- Thomas, on chrome + home: "a disaster", "the logo is a shit, be a bit more creative", "the whole
  stuff looks very boring", "everything is brownish", "not very impressive". KEEPS: the font
  (Cormorant display + Figtree).
- Rejected therefore: ivory + antique gold + sepia palette (the cream/gold/serif AI default I had
  flagged as a risk), the thin ring logo, quiet low-contrast chrome. Next version must differ on
  palette, logo, composition and energy, not be a re-tune.

## 2026-11-12 — Mi fotocall: redesign, first palette REJECTED
- Thomas, on seeing the tokens in his dev server: "what the fucking fuck is this choice of
  colours". Rejected: blush pink ground + ultramarine + mandarin + sun yellow + rose. It reads
  as a candy clash. Never again here: a pink ground, or four saturated hues at once.
- Colour work stopped; the new palette is set by Thomas with the main conversation. Layout,
  logo shape and motion carry on with the semantic tokens only.

## 2026-11-12 — Mi fotocall: 2nd palette REJECTED, 3rd decided
- Blush pink ground + ultramarine + mandarin + sun + rose: "what the fucking fuck is this choice
  of colours". Candy clash, too many hues.
- Decided (Thomas refuses to pick: "you are the designer"): white ground, zinc neutrals, ink
  #18181B, ONE coral accent for what you press, a soft sky fill, a solid ink panel behind the camera.
  The photos carry the colour.

## 2026-11-12 — Mi fotocall: 3 more rejections, then the communion direction
- Coral/white "Mf" prints (agent): "the logo is horrible as shit, the colors horrible, nothing was
  even designed". Black + flash yellow (mine): "this black app with horrible yellow, a joke".
  Celeste sky + royal blue + big gold rays: "too far in the celeste shit, too childish, not smooth
  and pro", "everything is very cramped and stuck together". "its a fucking communion".
- CURRENT: warm-white paper, midnight navy ink and buttons, fine gold only in ornaments. Logo = a
  church window in one fine line with the Host as a gold dot. The camera lives in an arched
  window (white mat), faint hairline rays behind, two small olive branches at its foot; album peek
  as three arched prints; gallery = album leaves with gold photo corners. Generous spacing.
- Never again here: pink, bright blue, yellow, black ground, celeste washes, thick rays, tight gaps.
- Arch REJECTED everywhere: logo ("looks like a grave"), album peek prints, then the camera frame
  itself ("the photocall is in shape of a grave"). Chalice logo and "M." monogram rejected too
  ("jesus related shit? its a photocall app", "who is M.?"). KEPT ("now its perfect"): the navy /
  warm white / fine gold palette, the hairline rays, the olive branches, the spacing.
- CURRENT: camera frame = large rounded photo print (white mat, signature margin); logo = small
  navy camera with a gold lens; peek = three big rectangular prints. No arch anywhere.
