# User Story: Schnelle Client-Code Migration (MVP)

**Story ID:** STORY-MONO-002-MVP  
**Epic:** EPIC-MONOREPO-001  
**Story Titel:** Als Entwickler möchte ich bestehenden Client-Code schnell migriert  
**Story Besitzer:** Product Owner (Sarah)  
**Erstellt:** 13. August 2025  
**Status:** Bereit für Entwicklung  
**Priorität:** Hoch  
**Story Points:** 3 (1.5 Tage)

## User Story

**Als** Frontend-Entwickler  
**möchte ich** den bestehenden Client-Code schnell zur gutachter-app migrieren  
**damit** die aktuelle Funktionalität in der neuen Struktur verfügbar ist  

## Abnahmekriterien (MVP)

### AC1: Basis Code-Migration

- [ ] Quellcode von `QARvGut.client/src` nach `apps/gutachter-app/src` kopiert
- [ ] Angular.json Basis-Konfiguration angepasst
- [ ] Package.json Abhängigkeiten zusammengeführt

### AC2: Funktionalitäts-Verifikation

- [ ] Anwendung startet ohne kritische Fehler
- [ ] Login-Flow funktioniert grundlegend
- [ ] Hauptnavigation erreichbar
- [ ] Keine Compile-Fehler

### AC3: Build-Funktionalität

- [ ] `nx serve gutachter-app` startet erfolgreich
- [ ] HTTPS-Konfiguration funktioniert grundlegend
- [ ] Produktions-Build läuft durch

## Technische Implementierung (Vereinfacht)

### Migrations-Approach

1. **Schnelle Datei-Migration**
   - Kopiere alle src-Dateien 1:1
   - Minimale Pfad-Anpassungen
   - Erst Migration, dann Optimierung

2. **Basis-Konfiguration**
   - Angular.json für Nx anpassen
   - Tsconfig.json Basis-Update
   - Package.json merge

### Kritische Abhängigkeiten (Must-Have)

- `@angular/core: ^19.0.1`
- `@ng-bootstrap/ng-bootstrap: ^17.0.1`
- `bootstrap: ^5.3.3`

## Definition of Done

- [ ] Gutachter-App läuft in Nx-Umgebung
- [ ] Benutzer können sich einloggen
- [ ] Hauptfunktionen zugänglich (keine Detailprüfung)
- [ ] Build-Pipeline funktioniert

## Bewusst Ausgeschlossen (Speed over Perfection)

- Detailliertes Testing aller Features
- Performance-Optimierungen
- Code-Qualitäts-Verbesserungen
- Umfassende Fehlerbehandlung

## Risiken & Schnelle Lösungen

- **Risiko:** Import-Fehler
  - **Lösung:** Quick-Fix mit relativen Pfaden
- **Risiko:** Konfigurationsprobleme
  - **Lösung:** Minimale Konfiguration, Details später
