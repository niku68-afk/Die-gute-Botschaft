# Die Gute Botschaft — Website

Eine dunkle, scrollanimierte Website für die Kreativagentur Die Gute Botschaft. Im Zentrum steht eine technische Zeichnung eines Schlosses, die sich beim Scrollen aufbaut. Goldene Linien, ruhige Farben und der gezeichnete Briefcursor verbinden die Seiten. Klicks lösen einen goldenen Sternenfunken aus; beim Wechsel zwischen Unterseiten gleitet die aktuelle Seite nach links weg.

## Dateien

- `index.html` — Startseite mit animierter Schlosszeichnung und Arbeitsfeldern
- `hotels.html` — Hotels & Gastlichkeit
- `immobilien.html` — Gewerbe & Immobilien
- `stadtentwicklung.html` — Städte & Innenstädte
- `styles.css`, `script.js` — gemeinsame Gestaltung und Interaktionen
- `service-pages.css` — Layout der Leistungs-Unterseiten
- `assets/` — Agenturlogo und Bilddateien
- `impressum.html`, `datenschutz.html`, `bildnachweis.html` — ergänzende Seiten

Alle Leistungsseiten liegen als einzelne HTML-Dateien neben der Startseite. Die relativen Links funktionieren nach dem Hochladen in dasselbe GitHub-Repository und bei Veröffentlichung über GitHub Pages.

## Lokal ansehen

`index.html` im Browser öffnen oder den Ordner mit einem lokalen Webserver starten. Die Website lädt ihre Schriften von Google Fonts; offline werden System-Schriften verwendet.

## Vor der Veröffentlichung

1. Die Kontaktadresse in den Kontakt-Links ergänzen.
2. Impressum und Datenschutzhinweise mit den endgültigen Angaben der Agentur vervollständigen.
3. Rechtstexte prüfen lassen.
4. Alle Dateien und den Ordner `.github` zu GitHub hochladen und GitHub Pages aktivieren.

Scroll-, Klick- und Seitenwechsel-Animationen berücksichtigen `prefers-reduced-motion`; der Briefcursor wird auf Geräten mit Maus angezeigt. Auf Touchgeräten bleibt die Seite direkt bedienbar.

## Typografie

Fließtexte verwenden Raleway und die kleinen technischen Beschriftungen DM Mono. Überschriften verwenden Bodoni Moda, Fließtexte Raleway und technische Beschriftungen DM Mono. Alle drei Schriften werden kostenfrei über Google Fonts geladen; die CSS-Fallbacks greifen, falls die Schriften nicht geladen werden können.
