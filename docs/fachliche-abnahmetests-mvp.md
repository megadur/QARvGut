# QARvGut MVP - Fachliche Abnahmetests

**Dokument Version:** 1.0  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** Fachliche Abnahmetest-Spezifikation  
**Erstellt:** 29. September 2025  
**Product Owner:** Sarah  
**Basierend auf:** Use Cases MVP Development (use-cases-mvp-development.md)

---

## Dokumentzweck

Dieses Dokument definiert die fachlichen Abnahmetests für das QARvGut MVP basierend auf den Use Cases UC-01 bis UC-03. Diese Tests validieren die Geschäftslogik und Benutzeranforderungen aus fachlicher Sicht und stellen sicher, dass die implementierten Features den definierten Use Cases entsprechen.

## Beziehung zu bestehenden Dokumenten

- **Basis:** `docs/use-cases-mvp-development.md` (UC-01, UC-02, UC-03)
- **Quell-Stories:** `docs/UserStories.tsv` (MVP-markierte Stories)
- **Technische Tests:** Ergänzen Unit/Integration Tests
- **Architektur:** `docs/brownfield-architecture/`

---

## Test-Struktur und -Philosophie

### Fachliche Abnahmetests vs. Technische Tests

**Fachliche Abnahmetests:**
- Validieren Geschäftsprozesse und Benutzeranforderungen
- Werden von Product Owner und Fachexperten durchgeführt
- Fokus auf korrektes Verhalten aus Anwendersicht
- Verwenden realistische Testdaten und Szenarien

**Technische Tests:**
- Validieren Code-Funktionalität und System-Integration
- Werden von Entwicklern und QA durchgeführt
- Fokus auf technische Korrektheit und Performance

### Test-Kategorien

| Kategorie | Beschreibung | Verantwortlich |
|-----------|--------------|----------------|
| **Akzeptanztests** | Hauptszenarien der Use Cases | Product Owner |
| **Alternativszenario-Tests** | Fehlerbehandlung und Randfälle | Product Owner + QA |
| **Geschäftsprozess-Tests** | End-to-End Workflows | Fachexperten |
| **Benutzerfreundlichkeits-Tests** | UI/UX Validierung | Product Owner |

---

## ��� Sprint 1 - Kritische Use Cases Abnahmetests

## AT-UC-01: Gutachter-Onboarding-Prozess

**Use Case:** UC-01 - Gutachter-Registrierung und -Aktivierung  
**Priorität:** Kritisch  
**Quell-Stories:** US-RL.01, US-RL.04, US-RL.05  

### AT-UC-01.01: Erfolgreiche Gutachter-Registrierung

**Testziel:** Validierung des kompletten Registrierungs- und Aktivierungsprozesses

**Vorbedingungen:**
- eLogin-System ist erreichbar und funktional
- rvSMD-System ist erreichbar und funktional
- Testgutachter "Max Mustermann" ist in eLogin/rvSMD hinterlegt
- DRV-Mitarbeiter "TestAdmin" ist für Freischaltung verfügbar
- E-Mail-System ist funktional

**Testdaten:**
```
Gutachter: Max Mustermann
EFN: EFN123456789
E-Mail: max.mustermann@test-gutachter.de
Telefon: +49 123 456789
Fachgebiet: Orthopädie
```

**Testschritte:**
1. **Registrierung initiieren**
   - Gutachter öffnet rvGutachten-Portal
   - Klickt auf "Registrierung für Gutachter"
   - **Erwartung:** Registrierungsformular wird angezeigt

2. **Formular ausfüllen**
   - Eingabe: Name, Vorname, E-Mail, EFN
   - Akzeptierung der Datenschutzerklärung
   - Klick auf "Registrierung absenden"
   - **Erwartung:** "Registrierung eingereicht" Meldung

3. **System-Validierung prüfen**
   - System prüft Daten gegen eLogin/rvSMD
   - **Erwartung:** Validierung erfolgreich, Account Status "pending"

4. **DRV-Mitarbeiter-Benachrichtigung**
   - DRV-Mitarbeiter erhält E-Mail über neue Registrierung
   - **Erwartung:** E-Mail mit Gutachter-Daten und Freischaltungs-Link

5. **Berechtigung prüfen und freischalten**
   - DRV-Mitarbeiter öffnet Admin-Portal
   - Prüft Gutachter-Berechtigung in internen Systemen
   - Genehmigt Registrierung
   - **Erwartung:** Status ändert sich zu "approved"

6. **Aktivierungscode senden**
   - System generiert und sendet Aktivierungscode
   - **Erwartung:** Gutachter erhält E-Mail mit Aktivierungscode

7. **Account aktivieren**
   - Gutachter gibt Aktivierungscode ein
   - Erstellt Passwort nach Sicherheitsrichtlinien
   - **Erwartung:** Account wird aktiviert, Weiterleitung zur Auftragsübersicht

**Erfolgskriterien:**
- [ ] Gutachter kann sich erfolgreich registrieren
- [ ] eLogin/rvSMD-Integration funktioniert korrekt
- [ ] DRV-Mitarbeiter wird über Neuregistrierung informiert
- [ ] Aktivierungsprozess läuft fehlerfrei durch
- [ ] Gutachter kann sich nach Aktivierung anmelden
- [ ] Audit-Log enthält alle Registrierungsschritte

### AT-UC-01.02: Registrierung mit bereits vorhandener E-Mail

**Testziel:** Behandlung von Duplicate-Registrierungen

**Vorbedingungen:**
- Gutachter "Max Mustermann" ist bereits registriert

**Testschritte:**
1. Neuer Registrierungsversuch mit bereits verwendeter E-Mail
2. **Erwartung:** Fehlermeldung "E-Mail bereits registriert"
3. Link zu "Passwort vergessen" wird angezeigt
4. **Erwartung:** Keine Duplicate-Accounts entstehen

**Erfolgskriterien:**
- [ ] Duplicate-Registrierung wird verhindert
- [ ] Benutzerfreundliche Fehlermeldung
- [ ] Recovery-Option wird angeboten

### AT-UC-01.03: Registrierung mit eLogin/rvSMD nicht erreichbar

**Testziel:** Verhalten bei System-Ausfällen

**Vorbedingungen:**
- eLogin oder rvSMD temporär nicht verfügbar

**Testschritte:**
1. Registrierungsversuch während System-Ausfall
2. **Erwartung:** "Service temporär nicht verfügbar" Meldung
3. Option "Später erneut versuchen" wird angeboten
4. **Erwartung:** Registrierung wird nicht in unvollständigem Zustand gespeichert

**Erfolgskriterien:**
- [ ] Graceful Degradation bei System-Ausfall
- [ ] Keine korrupten Daten in der Datenbank
- [ ] Klare Kommunikation an Benutzer

### AT-UC-01.04: DRV-Mitarbeiter lehnt Registrierung ab

**Testziel:** Behandlung von Ablehnungen

**Vorbedingungen:**
- Registrierung liegt zur Prüfung vor
- Gutachter hat keine gültige Berechtigung

**Testschritte:**
1. DRV-Mitarbeiter öffnet pending Registrierung
2. Prüfung ergibt: Keine gültige Gutachter-Berechtigung
3. Mitarbeiter lehnt mit Begründung ab
4. **Erwartung:** Gutachter erhält E-Mail mit Ablehnungsgrund
5. Account wird deaktiviert und nach 30 Tagen gelöscht

**Erfolgskriterien:**
- [ ] Ablehnungsprozess funktioniert korrekt
- [ ] Gutachter wird über Ablehnung informiert
- [ ] Account-Cleanup erfolgt automatisch

---

## AT-UC-02: System-Authentifizierung

**Use Case:** UC-02 - Benutzer-Anmeldung am System  
**Priorität:** Kritisch  
**Quell-Stories:** US-RL.07, US-RL.08  

### AT-UC-02.01: Erfolgreiche Anmeldung

**Testziel:** Standard Login-Prozess validieren

**Vorbedingungen:**
- Gutachter "Max Mustermann" hat aktivierten Account
- Korrekte Anmeldedaten sind bekannt

**Testdaten:**
```
E-Mail: max.mustermann@test-gutachter.de
Passwort: SecurePass123!
```

**Testschritte:**
1. **Login-Seite aufrufen**
   - Browser öffnet rvGutachten-Portal
   - **Erwartung:** Login-Formular wird angezeigt

2. **Anmeldedaten eingeben**
   - E-Mail-Adresse eingeben
   - Passwort eingeben
   - "Anmelden" klicken
   - **Erwartung:** Validierung läuft

3. **Authentifizierung prüfen**
   - System validiert gegen Datenbank
   - Account-Status wird geprüft (aktiv)
   - **Erwartung:** Authentifizierung erfolgreich

4. **Session erstellen**
   - Security-Token wird generiert
   - Session wird erstellt
   - **Erwartung:** Benutzer ist eingeloggt

5. **Weiterleitung**
   - Automatische Weiterleitung zur Auftragsübersicht
   - **Erwartung:** Hauptnavigation ist verfügbar

**Erfolgskriterien:**
- [ ] Login-Formular ist benutzerfreundlich
- [ ] Authentifizierung funktioniert korrekt
- [ ] Session-Management ist sicher
- [ ] Weiterleitung erfolgt automatisch
- [ ] Alle authentifizierten Features sind zugänglich

### AT-UC-02.02: Anmeldung mit falschen Daten

**Testziel:** Fehlerbehandlung bei falschen Anmeldedaten

**Testdaten:**
```
E-Mail: max.mustermann@test-gutachter.de
Passwort: FalschesPasswort
```

**Testschritte:**
1. Falsche Anmeldedaten eingeben
2. **Erwartung:** "E-Mail oder Passwort falsch" Fehlermeldung
3. Formular bleibt geöffnet für erneute Eingabe
4. **Erwartung:** E-Mail-Feld behält gültigen Wert

**Erfolgskriterien:**
- [ ] Klare, nicht zu spezifische Fehlermeldung
- [ ] Benutzerfreundliches Verhalten bei Fehlern
- [ ] Keine Information Disclosure über gültige E-Mails

### AT-UC-02.03: Brute-Force-Schutz

**Testziel:** Account-Schutz bei mehrfachen Fehlversuchen

**Testschritte:**
1. 5 aufeinanderfolgende Fehlversuche
2. **Erwartung:** Nach 5. Versuch wird Account für 30 Min gesperrt
3. Sperrung wird dem Benutzer kommuniziert
4. Nach Sperrzeit ist normale Anmeldung wieder möglich

**Erfolgskriterien:**
- [ ] Brute-Force-Schutz greift nach 5 Versuchen
- [ ] Temporäre Sperrung wird klar kommuniziert
- [ ] Automatische Entsperrung nach Timeout
- [ ] Security-Log dokumentiert Vorfälle

### AT-UC-02.04: "Angemeldet bleiben" Funktion

**Testziel:** Extended Session für Benutzerkomfort

**Testschritte:**
1. Login mit aktivierter "Angemeldet bleiben" Checkbox
2. **Erwartung:** Extended Session (7 Tage) wird erstellt
3. Browser schließen und erneut öffnen
4. **Erwartung:** Benutzer ist weiterhin eingeloggt
5. Nach 7 Tagen automatischer Logout

**Erfolgskriterien:**
- [ ] "Angemeldet bleiben" Option funktioniert
- [ ] Extended Session Handling korrekt
- [ ] Automatischer Logout nach Ablaufzeit
- [ ] Sicherheitsrelevante Aktionen erfordern Re-Authentifizierung

### AT-UC-02.05: Passwort vergessen Workflow

**Testziel:** Self-Service Passwort-Reset

**Testschritte:**
1. "Passwort vergessen" Link klicken
2. E-Mail-Adresse eingeben
3. **Erwartung:** Reset-E-Mail wird versendet
4. Reset-Link in E-Mail klicken
5. Neues Passwort eingeben (Sicherheitsrichtlinien beachten)
6. **Erwartung:** Passwort wird geändert, Login möglich

**Erfolgskriterien:**
- [ ] Reset-Link funktioniert korrekt
- [ ] Reset-Link läuft nach 24h ab
- [ ] Neue Passwort-Validierung greift
- [ ] Alter Reset-Link wird invalidiert nach Verwendung

---

## AT-UC-03: DRV-Mitarbeiter-Zugriffsverwaltung

**Use Case:** UC-03 - DRV-Mitarbeiter-Registrierung und Support-Zugang  
**Priorität:** Kritisch  
**Quell-Stories:** US-RL.06  

### AT-UC-03.01: DRV-Mitarbeiter Support-Zugang

**Testziel:** Admin-Berechtigungen für DRV-Mitarbeiter validieren

**Vorbedingungen:**
- DRV-Mitarbeiter "TestAdmin" hat gültige Berechtigung
- rvGutachtenAdmin-System ist verfügbar

**Testdaten:**
```
Mitarbeiter: TestAdmin
E-Mail: testadmin@drv-test.de
Rolle: Support-Mitarbeiter
Berechtigungen: Gutachter-Registrierungen, Auftragseinsicht
```

**Testschritte:**
1. **Zugang beantragen**
   - DRV-Mitarbeiter beantragt Zugang über rvGutachtenAdmin
   - **Erwartung:** Antrag wird im System erfasst

2. **Berechtigung validieren**
   - System prüft Mitarbeiter-Status über eLogin
   - **Erwartung:** Gültige DRV-Berechtigung wird bestätigt

3. **Admin-Account erstellen**
   - System erstellt Account mit erweiterten Rechten
   - **Erwartung:** Rollenbasierte Berechtigungen werden zugewiesen

4. **Support-Funktionen testen**
   - Zugriff auf Gutachter-Registrierungsübersicht
   - Zugriff auf Auftragszuweisungen
   - **Erwartung:** Nur berechtigte Funktionen sind zugänglich

**Erfolgskriterien:**
- [ ] DRV-Mitarbeiter-Authentifizierung funktioniert
- [ ] Rollenbasierte Zugriffskontrolle greift
- [ ] Support-Dashboard ist zugänglich
- [ ] Audit-Trail für alle Admin-Aktionen

### AT-UC-03.02: Gutachter-Registrierungen verwalten

**Testziel:** Admin kann Gutachter-Registrierungen bearbeiten

**Vorbedingungen:**
- DRV-Mitarbeiter ist angemeldet
- Mehrere Gutachter-Registrierungen liegen vor

**Testschritte:**
1. **Registrierungsübersicht öffnen**
   - Admin öffnet Gutachter-Verwaltung
   - **Erwartung:** Liste aller pending/aktiven Registrierungen

2. **Registrierung bearbeiten**
   - Specific Gutachter auswählen
   - Status von "pending" auf "approved" ändern
   - **Erwartung:** Statusänderung wird gespeichert

3. **Benachrichtigung triggern**
   - Genehmigung löst Aktivierungscode-Versand aus
   - **Erwartung:** Gutachter erhält Aktivierungsmail

**Erfolgskriterien:**
- [ ] Admin kann Registrierungsstatus verwalten
- [ ] Statusänderungen triggern korrekte Workflows
- [ ] Alle Änderungen werden auditiert

### AT-UC-03.03: Auftragszuweisungen einsehen

**Testziel:** Support kann Auftragszuweisungen überwachen

**Vorbedingungen:**
- Mehrere Aufträge sind verschiedenen Gutachtern zugewiesen

**Testschritte:**
1. **Support-Dashboard öffnen**
   - Admin navigiert zu Auftragszuweisungen
   - **Erwartung:** Übersicht aller aktiven Zuweisungen

2. **Suchfunktion testen**
   - Suche nach VSNR: "12345678901"
   - Suche nach Gutachter: "Max Mustermann"
   - **Erwartung:** Gefilterte Ergebnisse werden angezeigt

3. **Auftragsdetails einsehen**
   - Spezifischen Auftrag auswählen
   - **Erwartung:** Details zu Gutachter, Proband, Status sichtbar

**Erfolgskriterien:**
- [ ] Support-Dashboard ist vollständig und aktuell
- [ ] Such- und Filterfunktionen arbeiten korrekt
- [ ] Sensible Daten sind angemessen geschützt

---

## Geschäftsprozess-Tests (End-to-End)

### GPT-01: Kompletter Gutachter-Onboarding bis Auftragsbearbeitung

**Testziel:** Validierung des gesamten Workflows von Registrierung bis Arbeitsaufnahme

**Workflow:**
1. Gutachter registriert sich (AT-UC-01.01)
2. DRV-Mitarbeiter genehmigt Registrierung (AT-UC-03.02)  
3. Gutachter aktiviert Account (AT-UC-01.01)
4. Gutachter meldet sich erstmalig an (AT-UC-02.01)
5. Gutachter sieht leere Auftragsübersicht (UC-05 - zukünftig)

**Erfolgskriterien:**
- [ ] Kompletter Workflow läuft ohne manuelle Eingriffe
- [ ] Alle Systemkomponenten arbeiten zusammen
- [ ] Benutzerführung ist intuitiv und vollständig
- [ ] Performance ist für Produktiv-Einsatz geeignet

### GPT-02: DRV-Support-Workflow

**Testziel:** Support-Mitarbeiter kann effektiv arbeiten

**Workflow:**
1. DRV-Mitarbeiter beantragt und erhält Support-Zugang (AT-UC-03.01)
2. Neue Gutachter-Registrierung kommt herein (AT-UC-01.01)
3. Support-Mitarbeiter prüft und genehmigt (AT-UC-03.02)
4. Support überwacht laufende Auftragszuweisungen (AT-UC-03.03)

**Erfolgskriterien:**
- [ ] Support-Workflows sind effizient
- [ ] Benachrichtigungen funktionieren zuverlässig
- [ ] Admin-Interface ist benutzerfreundlich
- [ ] Alle Support-Aufgaben sind abdeckt

---

## Test-Datenmanagement

### Testdaten-Sets

**Gutachter-Testdaten:**
```
Gutachter 1: Max Mustermann (EFN123456789) - Orthopädie
Gutachter 2: Anna Schmidt (EFN987654321) - Neurologie  
Gutachter 3: Dr. Hans Müller (EFN555666777) - Kardiologie
```

**DRV-Mitarbeiter-Testdaten:**
```
TestAdmin1: Support-Mitarbeiter (Basis-Rechte)
TestAdmin2: Senior-Admin (Erweiterte Rechte)
TestManager: Fachbereichsleiter (Vollzugriff)
```

**E-Mail-Testkonten:**
- Alle Test-E-Mails gehen an lokale Test-SMTP oder Mailhog
- Produktive E-Mail-Adressen werden nicht verwendet
- Test-Domains: @test-gutachter.de, @drv-test.de

### Testdaten-Lifecycle

**Vor jedem Testlauf:**
- [ ] Datenbank auf definierten Ausgangszustand zurücksetzen
- [ ] Test-E-Mail-Queue leeren
- [ ] Cache und Sessions löschen

**Nach jedem Testlauf:**
- [ ] Test-Logs archivieren
- [ ] Testdaten dokumentieren
- [ ] Cleanup von temporären Dateien

---

## Automatisierung und CI/CD Integration

### Automatisierbare Tests

**Geeignet für Automatisierung:**
- Login/Logout Workflows (AT-UC-02.01, AT-UC-02.02)
- Registrierungs-API Calls (Teil von AT-UC-01.01)
- Admin-Berechtigungen (AT-UC-03.01)

**Manuelle Tests erforderlich:**
- E-Mail-Inhalte und -Formatierung
- UI/UX Bewertung
- Cross-Browser Kompatibilität
- Barrierefreiheit

### Test-Pipeline Integration

```yaml
# Beispiel: CI/CD Pipeline Integration
stages:
  - unit_tests
  - integration_tests
  - acceptance_tests  # Diese fachlichen Tests
  - deployment

acceptance_tests:
  stage: acceptance_tests
  script:
    - npm run test:acceptance:uc01
    - npm run test:acceptance:uc02  
    - npm run test:acceptance:uc03
  artifacts:
    reports:
      junit: test-results/acceptance/*.xml
```

---

## Test-Reporting und Dokumentation

### Test-Protokoll Template

```markdown
# Fachlicher Abnahmetest Protokoll

**Test:** AT-UC-XX.XX
**Datum:** DD.MM.YYYY
**Tester:** [Name]
**Umgebung:** [Test/Staging/Prod]

## Testergebnis
- [ ] ✅ BESTANDEN
- [ ] ❌ FEHLGESCHLAGEN  
- [ ] ⚠️ TEILWEISE BESTANDEN

## Befunde
[Detaillierte Beschreibung]

## Abweichungen
[Dokumentierte Abweichungen von erwarteten Verhalten]

## Screenshots/Logs
[Anhänge mit Beweismaterial]

## Freigabe-Empfehlung
[Go/No-Go Empfehlung mit Begründung]
```

### Reporting Dashboard

**Metriken zu verfolgen:**
- Test-Abdeckung pro Use Case
- Pass/Fail Rate über Zeit
- Durchschnittliche Testausführungszeit
- Kritische vs. nicht-kritische Fehlschläge

---

## Definition of Done für Abnahmetests

Ein Use Case gilt als fachlich abgenommen wenn:

### Funktionale Kriterien
- [ ] Alle Hauptszenarien sind erfolgreich getestet
- [ ] Mindestens 80% der Alternativszenarien funktionieren korrekt
- [ ] Geschäftsprozess-Tests laufen vollständig durch
- [ ] Alle kritischen Sicherheitsanforderungen sind erfüllt

### Qualitäts-Kriterien  
- [ ] UI ist benutzerfreundlich und intuitiv
- [ ] Fehlermeldungen sind verständlich und hilfreich
- [ ] Performance entspricht definierten Anforderungen
- [ ] Cross-Browser Kompatibilität ist gegeben

### Dokumentations-Kriterien
- [ ] Test-Protokolle sind vollständig ausgefüllt
- [ ] Alle Befunde sind dokumentiert
- [ ] Screenshots/Videos für kritische Workflows vorhanden
- [ ] Product Owner hat explizit abgenommen

---

**Erstellt von:** Sarah (Product Owner)  
**Review durch:** [Fachexperten, QA Team]  
**Nächste Aktualisierung:** Nach Implementierung von UC-04 bis UC-09  

---

**Verwendung:**
1. Tests vor Produktiv-Deployment durchführen
2. Bei kritischen Änderungen Regression-Tests laufen lassen  
3. Regelmäßige Smoke-Tests in Produktions-ähnlicher Umgebung
4. Dokumentation für Audit- und Compliance-Zwecke
