# QARvGut MVP - Use Cases für die Entwicklung

**Dokument Version:** 1.0  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** MVP Use Case Spezifikation  
**Erstellt:** 29. September 2025  
**Product Owner:** Sarah  

---

## Dokumentzweck

Dieses Dokument definiert die Use Cases für das QARvGut MVP basierend auf der Analyse der 16 MVP User Stories aus UserStories.tsv. Es dient als Entwicklungsgrundlage für die Implementierung der Kernfunktionalitäten.

## Beziehung zu bestehenden Dokumenten

- **Quell-Stories:** `docs/UserStories.tsv` (MVP-markierte Stories)
- **Architektur:** `docs/brownfield-architecture/`
- **PRD:** `docs/prd/`
- **Technische Spezifikation:** `docs/architecture/brownfield-architecture-enhanced-user-management.md`

---

## Use Case Übersicht

### Prioritäts-Matrix

| Priorität | Use Cases | Implementierungs-Reihenfolge | Abhängigkeiten |
|-----------|-----------|------------------------------|----------------|
| **��� Kritisch** | UC-01, UC-02, UC-03 | Sprint 1 (Wochen 1-2) | eLogin, rvSMD, DSGVO |
| **��� Hoch** | UC-04, UC-05 | Sprint 2 (Wochen 3-4) | Authentifizierung |
| **�� Mittel** | UC-06, UC-09 | Sprint 3 (Wochen 5-6) | Kern-Workflow |
| **��� Niedrig** | UC-07, UC-08 | Sprint 3+ | Admin-System |

---

## ��� Kritische Use Cases (Sprint 1)

### UC-01: Gutachter-Onboarding-Prozess

**Use Case ID:** UC-01  
**Name:** Gutachter-Registrierung und -Aktivierung  
**Primärer Akteur:** Neuer Gutachter  
**Sekundäre Akteure:** DRV-Mitarbeiter, eLogin-System, rvSMD-System  
**Auslöser:** Gutachter möchte Zugang zu rvGutachten  

**Vorbedingungen:**
- Gutachter hat gültige Zulassung für Begutachtung
- eLogin-System ist verfügbar
- rvSMD-System ist verfügbar
- DRV-Mitarbeiter für Freischaltung verfügbar

**Erfolgsszenario:**
1. Gutachter ruft Registrierungsseite auf
2. Gutachter füllt Registrierungsformular aus (Name, E-Mail, EFN)
3. System validiert Eingaben gegen eLogin/rvSMD
4. System erstellt Benutzer-Account mit Status "pending"
5. System benachrichtigt DRV-Mitarbeiter über neue Registrierung
6. DRV-Mitarbeiter prüft Gutachter-Berechtigung in internen Systemen
7. DRV-Mitarbeiter genehmigt Registrierung im System
8. System generiert und sendet Aktivierungscode per E-Mail
9. Gutachter gibt Aktivierungscode ein
10. System aktiviert Account und gewährt vollen Zugang

**Alternativszenarien:**
- **A1:** Ungültige E-Mail → Fehlermeldung, Eingabe wiederholen
- **A2:** Gutachter bereits registriert → Hinweis auf bestehenden Account
- **A3:** eLogin/rvSMD nicht erreichbar → Registrierung temporär gesperrt
- **A4:** DRV-Mitarbeiter lehnt ab → Account wird deaktiviert, Gutachter informiert
- **A5:** Aktivierungscode falsch → Erneute Eingabe erlauben (3 Versuche)

**Nachbedingungen:**
- Gutachter-Account ist aktiv und einsatzbereit
- Gutachter kann sich anmelden und Aufträge einsehen
- Audit-Log der Registrierung ist erstellt

**Technische Anforderungen:**
- Integration mit eLogin-API
- Integration mit rvSMD-Datenabgleich
- E-Mail-Versand-Funktionalität
- DSGVO-konforme Datenspeicherung

**Quell-Stories:** US-RL.01, US-RL.04, US-RL.05  
**Priorität:** Kritisch - Blocker für alle anderen Features  

---

### UC-02: System-Authentifizierung

**Use Case ID:** UC-02  
**Name:** Benutzer-Anmeldung am System  
**Primärer Akteur:** Registrierter Benutzer (Gutachter/Mitarbeiter)  
**Auslöser:** Benutzer möchte auf rvGutachten zugreifen  

**Vorbedingungen:**
- Benutzer hat aktivierten Account
- System ist verfügbar
- Browser unterstützt erforderliche Standards

**Erfolgsszenario:**
1. Benutzer navigiert zur Login-Seite
2. Benutzer gibt E-Mail-Adresse ein
3. Benutzer gibt Passwort ein
4. System validiert Anmeldedaten gegen Datenbank
5. System prüft Account-Status (aktiv/gesperrt)
6. System erstellt Session und Security-Token
7. System leitet zur Auftragsübersicht weiter

**Alternativszenarien:**
- **A1:** Falsche E-Mail/Passwort → Fehlermeldung, erneute Eingabe
- **A2:** Account gesperrt → Informative Meldung, Kontakt-Information
- **A3:** Zu viele Fehlversuche → Account temporär sperren (30 Min)
- **A4:** Session-Timeout → Automatische Weiterleitung zur Login-Seite
- **A5:** "Angemeldet bleiben" → Extended Session (7 Tage)

**Erweiterte Funktionen:**
- **E1:** Passwort vergessen → E-Mail mit Reset-Link senden
- **E2:** Erster Login → Passwort-Änderung erzwingen
- **E3:** Verdächtige Anmeldung → Zusätzliche Verifikation

**Nachbedingungen:**
- Benutzer ist authentifiziert und autorisiert
- Session ist aktiv und gültig
- Navigation zu geschützten Bereichen möglich

**Sicherheitsanforderungen:**
- Passwort-Hashing (bcrypt/Argon2)
- Brute-Force-Schutz
- Sichere Session-Management
- HTTPS-Verschlüsselung

**Quell-Stories:** US-RL.07, US-RL.08  
**Priorität:** Kritisch - Grundlage für alle authentifizierten Features  
**Status:** ��� In Prüfung - Signaturkarte wird evaluiert  

---

### UC-03: DRV-Mitarbeiter-Zugriffsverwaltung

**Use Case ID:** UC-03  
**Name:** DRV-Mitarbeiter-Registrierung und Support-Zugang  
**Primärer Akteur:** DRV-Mitarbeiter  
**Sekundäre Akteure:** rvGutachtenAdmin, eLogin-System  
**Auslöser:** DRV-Mitarbeiter benötigt Zugang für Support-Tätigkeiten  

**Vorbedingungen:**
- Mitarbeiter hat gültige DRV-Berechtigung
- rvGutachtenAdmin-System verfügbar
- eLogin-Integration funktional

**Erfolgsszenario:**
1. DRV-Mitarbeiter beantragt Zugang über rvGutachtenAdmin
2. System validiert Mitarbeiter-Status über eLogin
3. System prüft erforderliche Berechtigungsstufe
4. Admin genehmigt Support-Zugang
5. System erstellt DRV-Mitarbeiter-Account mit erweiterten Rechten
6. System gewährt Zugriff auf Support-Funktionen

**Erweiterte Berechtigungen:**
- Auftragszuweisungen einsehen
- Dokumenten-Übersicht verwalten
- Gutachter-Registrierungen verwalten
- System-Konfiguration (je nach Rolle)

**Nachbedingungen:**
- DRV-Mitarbeiter kann Support-Funktionen ausführen
- Audit-Trail für alle administrativen Aktionen aktiv

**Quell-Stories:** US-RL.06  
**Priorität:** Kritisch - Notwendig für Betrieb und Support  

