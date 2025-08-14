# User Story: Client-Code Migration

**Story ID:** STORY-MONO-002  
**Epic:** EPIC-MONOREPO-001  
**Story Titel:** Als Entwickler möchte ich bestehenden Client-Code zu gutachter-app migriert  
**Story Besitzer:** Product Owner (Sarah)  
**Erstellt:** 13. August 2025  
**Status:** Bereit für Entwicklung  
**Priorität:** Hoch  
**Story Points:** 8  

## User Story

**Als** Frontend-Entwickler  
**möchte ich** den bestehenden QARvGut.client-Code zur neuen gutachter-app-Struktur migriert  
**damit** aktuelle Funktionalität bewahrt wird und gleichzeitig die neue Monorepo-Architektur ermöglicht wird  

## Abnahmekriterien

### AC1: Code-Migration

- [ ] Aller Quellcode von `QARvGut.client/src` nach `apps/gutachter-app/src` verschoben
- [ ] Angular-Konfigurationsdateien ordnungsgemäß migriert
- [ ] Package.json-Abhängigkeiten in Workspace integriert
- [ ] Umgebungs-Konfigurationen bewahrt

### AC2: Funktionalitäts-Bewahrung

- [ ] Alle bestehenden Routen funktionieren identisch
- [ ] Benutzer-Authentifizierungs-Flows bleiben unverändert
- [ ] Profilverwaltungs-Features funktionieren wie zuvor
- [ ] Dokumenten-Ansichts-Fähigkeiten bewahrt

### AC3: Build und Serve

- [ ] `nx serve gutachter-app` startet die Anwendung erfolgreich
- [ ] HTTPS-Konfiguration mit ASP.NET Core-Zertifikaten funktioniert
- [ ] Proxy-Konfiguration für Backend-API-Aufrufe beibehalten
- [ ] Produktions-Build erzeugt identische Ausgabe-Struktur

### AC4: Testing-Migration

- [ ] Alle bestehenden Unit-Tests migriert und bestehen
- [ ] Jest-Konfiguration für Nx Workspace aktualisiert
- [ ] Testing-Skripte funktionieren mit `nx test gutachter-app`
- [ ] Code-Coverage-Reports werden korrekt generiert

## Technische Implementierungsdetails

### Migrations-Checkliste

1. **Dateistruktur-Migration**
   ```
   QARvGut.client/src/ → frontend/apps/gutachter-app/src/
   ├── app/ → app/
   ├── environments/ → environments/
   ├── assets/ → assets/
   └── styles.scss → styles.scss
   ```

2. **Konfigurations-Updates**
   - `angular.json` Projektreferenzen aktualisieren
   - `tsconfig.json` Einstellungen migrieren
   - Import-Pfade bei Bedarf aktualisieren
   - Nx project.json konfigurieren

3. **Abhängigkeits-Management**
   - Package.json-Abhängigkeiten in Workspace zusammenführen
   - Versions-Kompatibilität sicherstellen
   - Import-Anweisungen für geteilte Bibliotheken aktualisieren

### Kritische Abhängigkeiten zu bewahren

- `@angular/animations: ^19.0.1`
- `@ng-bootstrap/ng-bootstrap: ^17.0.1`
- `@ngx-translate/core: ^16.0.3`
- `bootstrap: ^5.3.3`
- `font-awesome: ^4.7.0`

## Testing-Strategie

### Funktionales Testing

- [ ] Login/Logout-Workflows
- [ ] Benutzerprofil-Verwaltung
- [ ] Dokumenten-Ansicht und -Interaktion
- [ ] Navigation und Routing
- [ ] Formular-Übermittlungen und Validierungen

### Technisches Testing

- [ ] API-Integration mit Backend
- [ ] HTTPS-Zertifikat-Handling
- [ ] Umgebungsvariablen-Verwendung
- [ ] Build-Optimierung und Bundling

## Definition of Done

- [ ] Alle bestehende Funktionalität funktioniert identisch
- [ ] Keine Regression in der Benutzererfahrung
- [ ] Alle Tests bestehen
- [ ] Build- und Deployment-Skripte aktualisiert
- [ ] Performance-Benchmarks beibehalten
- [ ] Code-Review abgeschlossen

## Risiken und Gegenmaßnahmen

- **Risiko:** Import-Pfad-Änderungen brechen Funktionalität
  - **Gegenmaßnahme:** Systematisches Testing aller Features
- **Risiko:** Konfigurations-Probleme mit Nx Workspace
  - **Gegenmaßnahme:** Schrittweise Migration mit Rollback-Plan
- **Risiko:** HTTPS-Setup-Komplikationen
  - **Gegenmaßnahme:** Zertifikat-Konfiguration dokumentieren und testen

## Notizen

- Rückwärtskompatibilität mit bestehenden Backend-APIs beibehalten
- Alle bestehenden Benutzer-Einstellungen und -Präferenzen bewahren
- Sicherstellen, dass keine Breaking Changes für aktuelle Benutzer
- Alle Konfigurations-Änderungen für Deployment dokumentieren
