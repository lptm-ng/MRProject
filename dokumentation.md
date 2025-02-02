# **MR Projekt Dokumentation**
## Victor Knesebeck-Milendonck, Kseniia Kukushkina, Lisa Nguyen
## *WiSe 2024/25*
Projekt läuft auf den Meta-Quests vollständig. Auf Smartphones/PCs/Laptops kann man die Streckenauswahl und Hittest machen, Fahren geht nicht (da kein Controller).
________
# **Verwendete Materialien von:**
- Materialien vom MR Moodle Kurs
## 1. GUI
- Basis für Code: https://github.com/felixmariotto/three-mesh-ui/blob/b9c19e542e5234bc964a44c1e7aa4eeb16676757/examples/interactive_button.js
- der Code der GUI befindet sich in index.js  
## 2. Car-Controls
- Car-Controls und HitTest befinden sich in car_test.html
- Controller Implementation: https://aframe.io/docs/1.6.0/introduction/interactions-and-controllers.html
- Button Events: https://aframe.io/docs/0.7.0/components/tracked-controls.html
- mehr zu Events: https://www.youtube.com/watch?v=NN0-cg2_k-4
- Car Model: https://sketchfab.com/3d-models/bmw-326-7706159dcc6442d5a91a9127f8b9d983
## 3. Streckengenerierung
- Streckenteile: selfmade mit Phythonscript für Zufallsgenerierung der Strecken 
## 4. HitTest
- Orientierungsscript: https://glitch.com/~launch-aframe-hit-test-simple
- Erstellung AR-Scene und hittest: https://aframe.io/docs/1.6.0/components/ar-hit-test.html
_________
# **Hürden im Projekt**
## 1. GUI
- initialer Plan der GUI war, schon bei der Strecken auswahl in AR oder VR zu wechseln und im Anschluss die HTML in dem jeweiligen Modus aufzurufen. Das ging leider aufgrund Limitationen bei Meta und WebXR nicht, da es wohl beim Start einer weiteren AR oder VR Session eine User-Eingabe bedarf (Sicherheitsgründe)
- der Versuch das Script für die UI in die HTML zu inegrieren schlug ebenso fehl, da es Probleme zwischen threemashUi und aframe gab
- ganz am anfang war es auch schwer Beispiele von der threemashUI github-page zu laufen zu kriegen, da man zunächst die Ordner-Struktur des Repos nachbilden musste 
## 2. Car-Controls
- Car Model musste manuell in einem 3D-Modellierungsprogramm (Blender) bearbeitet werden, damit es richtig ausgerichtet ist --> davor ist das Auto seitlich gefahren
- anfangs Probleme mit Oculus Quest Controller Erkennung
- einige Probleme wenn Button gedrückt, dann mache das
## 3. Streckengenerierung
- Einbindung der Streckengenerierung in das Projekt (verwendet aktuell nur ein paar vorgenerierte Strecken) 
## 4. HitTest
- Finden von Beispielen mit denen man arbeiten kann (wenig Vorerfahrung)
- manchmal funktionierte das ganze HTML Script nicht mehr

**für weitere Informationen (weitere Funktionalitäten, wie man fährt, etc.): README.md**