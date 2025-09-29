# QARvGut MVP - Fachliche Abnahmetests (Te## 🔴 MVP Fachliche Abnahmetests - Testfallkatalog

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **UC-01** | **Gutachter-Onboarding-Prozess (US-RL.01, US-RL.04, US-RL.05)** | | | | | | |
| UC-01.01 | Erfolgreiche Gutachter-Registrierung und -Aktivierung | TC-UC01.1 | Positiver Test: Kompletter Registrierungs- und Aktivierungsprozess | eLogin/rvSMD verfügbar, DRV-Mitarbeiter verfügbar, E-Mail funktional | 1. Portal öffnen, "Registrierung für Gutachter" klicken<br>2. Formular ausfüllen (Max Mustermann, EFN123456789)<br>3. Datenschutz akzeptieren, absenden<br>4. DRV-Mitarbeiter genehmigt Registrierung<br>5. Aktivierungscode eingeben<br>6. Passwort erstellen | Gutachter-Account ist aktiv, Login möglich, Weiterleitung zur Auftragsübersicht | Hoch |
| | | TC-UC01.2 | Negativer Test: Registrierung mit bereits vorhandener E-Mail | Max Mustermann bereits registriert | 1. Registrierungsformular öffnen<br>2. Bereits verwendete E-Mail eingeben<br>3. Formular absenden | Fehlermeldung: "E-Mail bereits registriert", Link zu "Passwort vergessen" | Mittel |
| | | TC-UC01.3 | Edge-Case: Registrierung bei eLogin/rvSMD-Ausfall | eLogin oder rvSMD temporär nicht verfügbar | 1. Registrierung während System-Ausfall versuchen | "Service temporär nicht verfügbar" Meldung, keine korrupten Daten | Mittel |
| | | TC-UC01.4 | Negativer Test: DRV-Mitarbeiter lehnt Registrierung ab | Gutachter ohne gültige Berechtigung | 1. Registrierung einreichen<br>2. DRV-Mitarbeiter prüft und lehnt ab<br>3. Begründung eingeben | Gutachter erhält E-Mail mit Ablehnungsgrund, Account wird deaktiviert | Mittel |
| **UC-02** | **System-Authentifizierung (US-RL.07, US-RL.08)** | | | | | | |
| UC-02.01 | Standard Login-Prozess | TC-UC02.1 | Positiver Test: Erfolgreiche Anmeldung | Max Mustermann hat aktivierten Account | 1. Portal öffnen<br>2. E-Mail eingeben: max.mustermann@test-gutachter.de<br>3. Passwort eingeben: SecurePass123!<br>4. "Anmelden" klicken | Login erfolgreich, Weiterleitung zur Auftragsübersicht, Session aktiv | Hoch |
| | | TC-UC02.2 | Negativer Test: Anmeldung mit falschen Daten | Korrekte E-Mail bekannt | 1. E-Mail eingeben: max.mustermann@test-gutachter.de<br>2. Falsches Passwort eingeben<br>3. "Anmelden" klicken | Fehlermeldung: "E-Mail oder Passwort falsch", Formular bleibt geöffnet | Mittel |
| | | TC-UC02.3 | Edge-Case: Brute-Force-Schutz | Gültige E-Mail-Adresse bekannt | 1. 5 aufeinanderfolgende Fehlversuche<br>2. 6. Versuch | Nach 5. Versuch: Account für 30 Min gesperrt, Sperrung kommuniziert | Hoch |
| | | TC-UC02.4 | Positiver Test: "Angemeldet bleiben" Funktion | Gültige Anmeldedaten | 1. Login mit aktivierter "Angemeldet bleiben" Checkbox<br>2. Browser schließen und erneut öffnen | Extended Session aktiv (7 Tage), Benutzer bleibt eingeloggt | Mittel |
| | | TC-UC02.5 | Positiver Test: Passwort-Reset-Workflow | Registrierter Gutachter | 1. "Passwort vergessen" klicken<br>2. E-Mail eingeben<br>3. Reset-Link in E-Mail klicken<br>4. Neues Passwort eingeben | Reset-E-Mail versendet, neues Passwort gesetzt, Login möglich | Mittel |
| **UC-03** | **DRV-Mitarbeiter-Zugriffsverwaltung (US-RL.06)** | | | | | | |
| UC-03.01 | DRV-Mitarbeiter Support-Zugang | TC-UC03.1 | Positiver Test: Admin-Berechtigungen validieren | TestAdmin hat gültige DRV-Berechtigung, rvGutachtenAdmin verfügbar | 1. Zugang über rvGutachtenAdmin beantragen<br>2. System validiert über eLogin<br>3. Admin-Account wird erstellt<br>4. Support-Funktionen testen | DRV-Mitarbeiter hat Zugriff auf Support-Dashboard und Admin-Funktionen | Hoch |
| | | TC-UC03.2 | Positiver Test: Gutachter-Registrierungen verwalten | DRV-Mitarbeiter angemeldet, pending Registrierungen vorhanden | 1. Gutachter-Verwaltung öffnen<br>2. Pending Registrierung auswählen<br>3. Status auf "approved" ändern<br>4. Speichern | Statusänderung gespeichert, Aktivierungscode-Versand ausgelöst | Hoch |
| | | TC-UC03.3 | Positiver Test: Auftragszuweisungen einsehen | Mehrere Aufträge verschiedenen Gutachtern zugewiesen | 1. Support-Dashboard öffnen<br>2. Nach VSNR "12345678901" suchen<br>3. Nach Gutachter "Max Mustermann" suchen<br>4. Auftragsdetails einsehen | Übersicht aller Zuweisungen, Such-/Filterfunktionen funktionieren, Details sichtbar | Mittel |
| | | TC-UC03.4 | Negativer Test: Zugriff ohne gültige Berechtigung | Benutzer ohne DRV-Berechtigung | 1. Support-Zugang beantragen<br>2. eLogin-Validierung schlägt fehl | Zugriff verweigert, Fehlermeldung: "Keine gültige DRV-Berechtigung" | Hoch |allkatalog)

**Dokument Version:** 1.1  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** Fachliche Abnahmetest-Spezifikation (Tabellenformat)  
**Erstellt:** 29. September 2025  
**Aktualisiert:** 29. September 2025  
**Product Owner:** Sarah  
**Basierend auf:** Use Cases MVP Development (use-cases-mvp-development.md)  
**Format:** Strukturierter Testfallkatalog nach example_testfallkatalog.md

---

## Dokumentzweck

Dieses Dokument definiert die fachlichen Abnahmetests für das QARvGut MVP in strukturierter Tabellenform. Die Tests validieren die Geschäftslogik und Benutzeranforderungen basierend auf den Use Cases UC-01 bis UC-03 und stellen sicher, dass die implementierten Features den definierten Anforderungen entsprechen.

## Beziehung zu bestehenden Dokumenten

- **Basis:** `docs/use-cases-mvp-development.md` (UC-01, UC-02, UC-03)
- **Quell-Stories:** `docs/UserStories.tsv` (MVP-markierte Stories)
- **Format-Vorlage:** `docs/example_testfallkatalog.md`
- **Technische Tests:** Ergänzen Unit/Integration Tests
- **Architektur:** `docs/brownfield-architecture/`

---

## Testdaten für alle Tests

**Gutachter-Testdaten:**
```
Max Mustermann, EFN: EFN123456789, E-Mail: max.mustermann@test-gutachter.de
Anna Schmidt, EFN: EFN987654321, E-Mail: anna.schmidt@test-gutachter.de
```

**DRV-Mitarbeiter-Testdaten:**
```
TestAdmin, E-Mail: testadmin@drv-test.de, Rolle: Support-Mitarbeiter
```

---

---

## ��� Sprint 1 - Kritische Use Cases Abnahmetests

---

## 📊 End-to-End Geschäftsprozess-Tests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **E2E-01** | **Kompletter Gutachter-Onboarding bis erste Anmeldung** | | | | | | |
| E2E-01.01 | End-to-End Workflow: Registrierung bis Arbeitsbereitschaft | TC-E2E01.1 | Positiver Test: Gesamter Workflow von Registrierung bis erste Anmeldung | Alle Systeme (eLogin, rvSMD, E-Mail) verfügbar, DRV-Mitarbeiter verfügbar | 1. Gutachter registriert sich (TC-UC01.1)<br>2. DRV-Mitarbeiter genehmigt (TC-UC03.2)<br>3. Gutachter aktiviert Account<br>4. Gutachter meldet sich erstmalig an (TC-UC02.1)<br>5. Auftragsübersicht wird angezeigt | Kompletter Workflow läuft ohne manuelle Eingriffe, Gutachter ist arbeitsbereit | Hoch |
| **E2E-02** | **DRV-Support-Workflow Komplettvalidierung** | | | | | | |
| E2E-02.01 | Support-Mitarbeiter kompletter Arbeitszyklus | TC-E2E02.1 | Positiver Test: DRV-Mitarbeiter kann alle Support-Aufgaben durchführen | TestAdmin hat gültige Berechtigung | 1. DRV-Mitarbeiter erhält Support-Zugang (TC-UC03.1)<br>2. Neue Gutachter-Registrierung wird bearbeitet (TC-UC03.2)<br>3. Auftragszuweisungen werden überwacht (TC-UC03.3)<br>4. Support-Aufgaben werden erfüllt | Support-Workflows sind effizient, alle Admin-Funktionen arbeiten korrekt | Hoch |

---

## 🛠️ Test-Durchführung und -Management

### Test-Ausführung Checkliste

**Vor der Testausführung:**
- [ ] Testumgebung ist verfügbar und konfiguriert
- [ ] Alle Testdaten sind geladen und validiert
- [ ] Systeme (eLogin, rvSMD, E-Mail) sind erreichbar
- [ ] Test-Browser sind vorbereitet (Chrome, Firefox, Edge)
- [ ] Testprotokoll-Vorlagen sind bereitgestellt

**Während der Testausführung:**
- [ ] Jeden Testfall einzeln durchführen
- [ ] Screenshots bei kritischen Schritten erstellen
- [ ] Abweichungen sofort dokumentieren
- [ ] Testdauer für Performance-Bewertung messen

**Nach der Testausführung:**
- [ ] Testprotokolle vollständig ausfüllen
- [ ] Defekte im Tracking-System erfassen
- [ ] Test-Artefakte archivieren
- [ ] Testumgebung für nächsten Lauf vorbereiten

### Testdaten-Management

**Primäre Testdaten-Sets:**
```
SET 1: Standard-Szenarien
- Max Mustermann (EFN123456789, max.mustermann@test-gutachter.de)
- TestAdmin (testadmin@drv-test.de, Support-Rolle)

SET 2: Edge-Cases
- Anna Schmidt (EFN987654321, anna.schmidt@test-gutachter.de)
- TestManager (testmanager@drv-test.de, Admin-Rolle)

SET 3: Fehlerszenarien
- Invalid User (invalid@test.com, keine Berechtigung)
- Blocked User (blocked@test-gutachter.de, gesperrter Account)
```

**Testdaten-Lifecycle:**
- Reset vor jeder Testsuite
- Konsistente Ausgangslage für alle Tests
- Automatische Bereinigung nach Testende

### Test-Kategorien und -Prioritäten

| Kategorie | Testfälle | Ausführungsfrequenz | Automatisierung |
|-----------|-----------|-------------------|------------------|
| **Smoke Tests** | TC-UC01.1, TC-UC02.1, TC-UC03.1 | Bei jedem Build | Hoch |
| **Regression Tests** | Alle TC-UC** | Vor Release | Mittel |
| **End-to-End Tests** | TC-E2E**.* | Wöchentlich | Niedrig |
| **Explorative Tests** | Manual Testing | Bei Bedarf | Keine |

### Defekt-Management

**Defekt-Klassifizierung:**
- **Kritisch:** System nicht benutzbar, Datenverlust
- **Hoch:** Hauptfunktion nicht verfügbar
- **Mittel:** Nebenfunktion beeinträchtigt
- **Niedrig:** Kosmetische Probleme, Verbesserungsvorschläge

**Defekt-Workflow:**
1. Defekt identifizieren und reproduzieren
2. Screenshot/Video als Beweismaterial
3. Defekt im Tracking-System erfassen
4. Entwicklungsteam benachrichtigen
5. Fix verifizieren nach Implementierung

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
