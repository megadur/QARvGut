# QARvGut MVP - Fehlende Elemente UC-10

## Dokumentzweck

Dieses Dokument identifiziert kritische fehlende Elemente für **UC-10 (Automatisches PDF-Caching)**, die für die vollständige Implementierung und Sprint-Planung notwendig sind.

**Erstellt:** 14. November 2025  
**Projekt:** QARvGut Enhanced User Management  
**Bezug:** UC-10_Automatisches_PDF_Caching.md, fachliche-abnahmetests-mvp.md

---

## ��� Kritische Fehlende Elemente

### 1. Sprint-Zuweisung für UC-10

**Problem:**  
UC-10 ist in `use-cases-mvp-development.md` als "Mittel/Hoch" Priorität markiert, aber keinem Sprint (1, 2 oder 3) explizit zugewiesen.

**Auswirkung:**  
- UC-05 (Auftragsdetails und Dokumenteneinsicht) **funktional abhängig** von UC-10
- Test-Fälle TC-UC05.1, TC-UC05.2, TC-UC05.7, TC-UC05.8 setzen UC-10 voraus
- Performance-Erwartungen (< 100ms) nur mit UC-10 erreichbar
- UC-05 kann ohne UC-10 nicht vollen Wert liefern

**Empfohlene Lösung:**  
**Option A:** UC-10 explizit zu **Sprint 2** hinzufügen (zusammen mit UC-04, UC-05, UC-13)  
**Option B:** UC-10 als **Infrastruktur-/Prerequisite-Task** markieren, die parallel zu Sprint 2 läuft

**Begründung:**  
- UC-05 Schritt 4: "Gutachter klickt auf ein Dokument **→ PDF wird aus lokalem Cache geladen**"
- TC-UC05.1 Voraussetzung: "**UC-10 Sync abgeschlossen**"
- TC-UC05.2: "gecachten PDF-Dokumenten **(UC-10)**", Erwartung: "< 100ms load time **from cache**"
- TC-UC05.8: "**UC-10 Integration**: PDF-Verfügbarkeit bei rvArchiv-Ausfall"

---

### 2. Dedizierte UC-10 Testfälle

**Problem:**  
UC-10 wird derzeit nur **implizit durch UC-05 Tests** validiert. Es gibt keine dedizierten Testfälle für den UC-10 Sync-Prozess selbst.

**Fehlende Testabdeckung:**

#### TC-UC10.1: Initialer PDF-Download und Caching
- **Voraussetzung:** Neuer Auftrag in rvSMD erstellt
- **Testschritte:**
  1. rvGutachten empfängt Auftragsbenachrichtigung
  2. System identifiziert zugehörige PDFs in rvArchiv
  3. Automatischer Download-Prozess startet
  4. PDFs werden in lokalem Cache gespeichert
  5. Sync-Status wird aktualisiert
- **Erwartet:** Alle PDFs erfolgreich gecacht, Sync-Status "abgeschlossen", < 10 Sek für durchschnittlichen Auftrag

#### TC-UC10.2: Cache-Speicherstrategie
- **Voraussetzung:** UC-10 Sync läuft
- **Testschritte:**
  1. Cache-Speicherort prüfen (DB vs. Dateisystem)
  2. Speicher-Effizienz messen
  3. Cache-Größe überwachen
- **Erwartet:** Konsistente Speicherstrategie, keine Duplikate, Cache-Größe innerhalb Limits

#### TC-UC10.3: Sync-Fehlerbehandlung
- **Voraussetzung:** rvArchiv temporär nicht verfügbar
- **Testschritte:**
  1. Sync-Prozess starten
  2. rvArchiv-Verbindung unterbrechen
  3. Retry-Mechanismus beobachten
  4. Fehler-Logging prüfen
- **Erwartet:** Retry nach exponential backoff, Admin-Benachrichtigung bei persistentem Fehler, keine Daten-Korruption

#### TC-UC10.4: Cache-Hit-Rate-Monitoring
- **Voraussetzung:** Mehrere Aufträge mit gecachten PDFs
- **Testschritte:**
  1. 100 PDF-Zugriffe simulieren (90 gecacht, 10 nicht gecacht)
  2. Cache-Hit-Rate messen
  3. Performance-Unterschied Cache vs. rvArchiv messen
- **Erwartet:** Cache-Hit-Rate > 90%, Cache-Zugriffe < 100ms, rvArchiv-Zugriffe 500-2000ms

#### TC-UC10.5: Cache-Invalidierung bei Auftragsstornierung
- **Voraussetzung:** Stornierter Auftrag mit gecachten PDFs
- **Testschritte:**
  1. Auftrag stornieren (UC-13)
  2. Cache-Cleanup beobachten
  3. Speicherplatz-Freigabe validieren
- **Erwartet:** Alle zugehörigen PDFs aus Cache entfernt, Speicher freigegeben, DSGVO-konform

**Empfehlung:**  
Ergänzen Sie `fachliche-abnahmetests-mvp.md` mit dediziertem Abschnitt "**UC-10 - Automatisches PDF-Caching**" nach Sprint 2 Tests.

---

### 3. UC-10 Abhängigkeits-Dokumentation

**Problem:**  
Die funktionale Abhängigkeit UC-05 → UC-10 ist in Tests ersichtlich, aber nicht explizit in `use-cases-mvp-development.md` dokumentiert.

**Empfohlene Ergänzung in UC-05:**

```markdown
**Abhängigkeiten:**
- **UC-10 (Automatisches PDF-Caching):** KRITISCH
  - Schritt 4 setzt voraus, dass PDFs bereits gecacht sind
  - Performance-Ziele (< 100ms) nur mit lokalem Cache erreichbar
  - Resilience-Vorteil (rvArchiv-Ausfall) erfordert UC-10
```

**Empfohlene Ergänzung in UC-10:**

```markdown
**Abhängige Use Cases:**
- **UC-05 (Auftragsdetails und Dokumenteneinsicht):** Nutzt gecachte PDFs für schnellen Zugriff
- **UC-13 (Auftragsstornierung):** Triggert Cache-Cleanup bei Stornierung
```

---

### 4. UC-13/UC-09 Cache-Cleanup Detaillierung

**Problem:**  
TC-UC13.5 testet Dokumentenlöschung, aber Interaktion mit UC-10 Cache ist nicht detailliert spezifiziert.

**Offene Fragen:**
- Werden PDFs **sofort** aus UC-10 Cache gelöscht bei Stornierung?
- Gibt es eine **Aufbewahrungsfrist** für gecachte PDFs (z.B. 7 Tage für Audit-Zwecke)?
- Wie interagiert UC-13 Cache-Cleanup mit UC-09 DSGVO-Löschfristen?

**Empfohlene Klärung:**

```markdown
**UC-13 Cache-Cleanup-Strategie:**
- **Sofortige Löschung:** PDFs aus UC-10 Cache entfernen innerhalb 24h nach Stornierung
- **DSGVO-Konformität:** Auftragsinformationen 30 Tage aufbewahren (UC-09), aber PDFs sofort löschen
- **Audit-Trail:** Cache-Löschung dokumentieren für Compliance-Zwecke
```

---

### 5. UC-10 Technische Implementierungsdetails

**Noch zu klären:**

#### Cache-Storage-Technologie
- **Option A:** Dateisystem-basiert (z.B. `/var/cache/rvgutachten/pdfs/`)
- **Option B:** Datenbank-BLOB-Storage (PostgreSQL, SQL Server)
- **Option C:** Hybrid (Metadaten in DB, Binärdaten im Dateisystem)

**Empfehlung:** Klären Sie in `UC-10_Automatisches_PDF_Caching.md` ab Zeile 80 (Performance-Überlegungen).

#### Sync-Trigger-Mechanismus
- **Option A:** Event-basiert (rvSMD sendet Webhook bei neuem Auftrag)
- **Option B:** Polling (rvGutachten prüft rvSMD alle X Minuten)
- **Option C:** Hybrid (Event-driven mit Fallback-Polling)

**Empfehlung:** Event-basiert für Echtzeit-Performance, Polling als Fallback.

#### Cache-Größe und Retention
- **Maximale Cache-Größe:** Z.B. 100 GB oder 10.000 PDFs
- **LRU-Eviction:** Least Recently Used PDFs zuerst entfernen bei Kapazitätsgrenze
- **Automatische Bereinigung:** Täglich Cleanup-Job für alte/stornierte Aufträge

---

## ��� Priorisierte Handlungsempfehlungen

### Priorität 1 (KRITISCH - vor Sprint 2)
1. **UC-10 Sprint-Zuweisung klären** → Zu Sprint 2 hinzufügen oder als Infrastruktur-Task markieren
2. **Abhängigkeiten dokumentieren** → UC-05 ↔ UC-10 Relationship in use-cases-mvp-development.md

### Priorität 2 (HOCH - während Sprint 2)
3. **Dedizierte UC-10 Testfälle erstellen** → 5 neue Testfälle in fachliche-abnahmetests-mvp.md
4. **Cache-Storage-Strategie finalisieren** → Technische Entscheidung in UC-10 Dokumentation

### Priorität 3 (MITTEL - nach Sprint 2)
5. **UC-13/UC-09 Cache-Cleanup detaillieren** → Spezifische Löschfristen und Prozesse
6. **Monitoring und Alerting definieren** → Cache-Hit-Rate, Speichernutzung, Sync-Fehler

---

## ��� Änderungsverfolgung

| Datum | Änderung | Autor |
|-------|----------|-------|
| 14.11.2025 | Initiale Erstellung basierend auf Test-Analyse | GitHub Copilot |

---

**Nächste Schritte:**
1. Product Owner Entscheidung zu UC-10 Sprint-Zuweisung
2. Technisches Team klärt Cache-Storage-Technologie
3. QA Team erstellt dedizierte UC-10 Testfälle
4. Dokumentation wird entsprechend aktualisiert

