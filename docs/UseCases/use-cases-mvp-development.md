# QARvGut MVP - Use Cases für die Entwicklung

**Dokument Version:** 1.0  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** MVP Use Case Spezifikation  
**Erstellt:** 29. September 2025  
**Product Owner:** Sarah  
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
- Für jeden Auftrag sind alle relevanten Dokumente gemäß UC-10 automatisch im System verfügbar
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
**Status:** ⚠️ In Prüfung - Signaturkarte wird evaluiert  

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

---

## 🟡 Hohe Priorität Use Cases (Sprint 2)

### UC-04: Auftragsübersicht und -verwaltung

**Use Case ID:** UC-04  
**Name:** Auftragsübersicht anzeigen und verwalten  
**Primärer Akteur:** Registrierter Gutachter/Gutachtermitarbeiter  
**Auslöser:** Benutzer möchte seine Aufträge einsehen und verwalten  

**Vorbedingungen:**
- Benutzer ist authentifiziert und autorisiert
- Aufträge sind dem Benutzer zugewiesen
- System ist verfügbar

**Erfolgsszenario:**
1. Benutzer navigiert zur Auftragsübersicht
2. System lädt alle dem Benutzer zugewiesenen Aufträge
3. System zeigt tabellarische Übersicht mit: Auftragsdatum, VSNR, Proband, Status
4. Benutzer kann Aufträge nach verschiedenen Kriterien sortieren
5. Benutzer kann Aufträge nach Status filtern
6. Benutzer kann über Suchfunktion spezifische Aufträge finden
7. System aktualisiert Daten in Echtzeit

**Erweiterte Funktionen:**
- **E1:** Auftragsstatus ändern → "in Bearbeitung", "abgeschlossen"
- **E2:** Auftragsdetails aufrufen → Detailansicht öffnen
- **E3:** Stornierte Aufträge → Deutliche Kennzeichnung mit Sperrung
- **E4:** Mahnungen → Visuelle Hervorhebung mit Mahnstufe

**Alternativszenarien:**
- **A1:** Keine Aufträge vorhanden → Informative Meldung mit Hilfetext
- **A2:** System-Timeout → Automatisches Neuladen der Daten
- **A3:** Netzwerkfehler → Offline-Indikator mit Retry-Option

**Nachbedingungen:**
- Benutzer hat vollständigen Überblick über seine Aufträge
- Aktuelle Daten sind geladen und angezeigt
- Filterungen und Sortierungen bleiben aktiv

**Performance-Anforderungen:**
- Ladezeit < 3 Sekunden für bis zu 500 Aufträge
- Such-Response < 1 Sekunde
- Auto-Refresh alle 5 Minuten

**Quell-Stories:** US-AM.01, US-AM.04, US-AM.06, US-AM.08  
**Priorität:** Hoch - Kernfunktionalität für täglichen Betrieb  

---

### UC-05: Auftragsdetails und Dokumenteneinsicht

**Use Case ID:** UC-05  
**Name:** Auftragsdetails einsehen und Dokumente verwalten  
**Primärer Akteur:** Registrierter Gutachter/Gutachtermitarbeiter  
**Auslöser:** Benutzer möchte Details zu einem spezifischen Auftrag einsehen  

**Vorbedingungen:**
- Benutzer ist authentifiziert
- Auftrag ist dem Benutzer zugewiesen
- Auftrag ist nicht gelöscht

**Erfolgsszenario:**
1. Benutzer klickt auf Auftrag in der Übersicht
2. System öffnet Auftragsdetail-Ansicht
3. System zeigt erweiterte Auftragsinformationen (VSNR, Proband, Geburtsdatum, etc.)
4. System lädt alle zugeordneten Dokumente
5. Benutzer kann Dokumente einzeln öffnen und einsehen
6. Benutzer kann druckbare Dokumente ausdrucken
7. Benutzer kann Notizen zu einzelnen Dokumenten erstellen

**Dokumentenmanagement:**
- **D1:** PDF-Viewer für direkte Anzeige
- **D2:** Downloadfunktion für lokale Speicherung
- **D3:** Druckfunktion mit Formaterhaltung
- **D4:** Notizen pro Dokument (US-NF.01)

**Alternativszenarien:**
- **A1:** Dokument nicht verfügbar → Fehlermeldung mit Kontaktmöglichkeit
- **A2:** Auftrag storniert → Eingeschränkte Funktionalität, keine neuen Aktionen
- **A3:** Berechtigung entzogen → Weiterleitung zur Übersicht mit Hinweis

**Sicherheitsanforderungen:**
- Nur berechtigte Nutzer haben Dokumentenzugriff
- Audit-Log für alle Dokumentenzugriffe
- Watermarking für sensible Dokumente
- Schutz vor unbefugtem Download

**Nachbedingungen:**
- Benutzer hat vollständige Auftragsinformationen erhalten
- Alle relevanten Dokumente sind zugänglich
- Navigation zurück zur Übersicht ist möglich

**Quell-Stories:** US-AM.02, US-AM.03, US-AM.05, US-NF.01  
**Priorität:** Hoch - Essentiell für Auftragsbearbeitung  

---

## 🔵 Mittlere Priorität Use Cases (Sprint 3)

### UC-06: E-Mail-Benachrichtigungssystem

**Use Case ID:** UC-06  
**Name:** Automatische E-Mail-Benachrichtigungen verwalten  
**Primärer Akteur:** System (automatisch), Konfiguration durch DRV-Mitarbeiter  
**Sekundäre Akteure:** Gutachter/Gutachtermitarbeiter  
**Auslöser:** Relevante Ereignisse im System (neuer Auftrag, Statusänderung, etc.)  

**Vorbedingungen:**
- E-Mail-System ist verfügbar und konfiguriert
- Benutzer haben gültige E-Mail-Adressen hinterlegt
- Benachrichtigungsregeln sind definiert

**Automatische Benachrichtigungen:**
1. **Neuer Auftrag zugewiesen** → Sofortige E-Mail an Gutachter
2. **Auftragsstatus geändert** → Benachrichtigung an relevante Parteien
3. **Mahnung eingegangen** → Prioritäts-E-Mail mit Fristen
4. **Dokumente nachgereicht** → Information über neue Unterlagen
5. **System-Wartung geplant** → Vorankündigung an alle Benutzer

**Konfigurierbare Einstellungen:**
- **K1:** E-Mail-Templates mit Platzhaltern (Name, Auftragsnummer, etc.)
- **K2:** Benachrichtigungsfrequenz (sofort, täglich, wöchentlich)
- **K3:** Opt-out Möglichkeiten für nicht-kritische Nachrichten
- **K4:** Eskalations-E-Mails bei kritischen Ereignissen

**Template-Management:**
```
Platzhalter verfügbar:
{{gutachter_name}} - Name des Gutachters
{{auftrag_nummer}} - Auftragsnummer 
{{proband_name}} - Name des Probanden
{{frist_datum}} - Relevante Fristen
{{link_portal}} - Link zum Portal
```

**Nachbedingungen:**
- Relevante Parteien sind zeitnah informiert
- E-Mail-Versand ist in Audit-Log dokumentiert
- Fehlerhafte E-Mail-Adressen sind identifiziert

**Technische Anforderungen:**
- SMTP-Integration mit Fehlerbehandlung
- Template-Engine für personalisierte Nachrichten  
- Retry-Mechanismus bei Versandfehlern
- DSGVO-konforme E-Mail-Verarbeitung

**Quell-Stories:** US-BN.01, US-BN.02, US-BN.04, US-BN.05  
**Priorität:** Mittel - Verbessert Benutzerexperience erheblich  

---

### UC-09: Datenaufbewahrung und Löschung (DSGVO)

**Use Case ID:** UC-09  
**Name:** Automatische Datenaufbewahrung und -löschung  
**Primärer Akteur:** System (automatisch)  
**Sekundäre Akteure:** DRV-Mitarbeiter (Konfiguration)  
**Auslöser:** Zeitbasierte Trigger oder Auftragsstatusänderungen  

**Vorbedingungen:**
- Löschrichtlinien sind konfiguriert
- Aufträge haben definierte Statuswerte
- Backup-System ist verfügbar

**Aufbewahrungsregeln:**
1. **Abgeschlossene Aufträge:** Aufbewahrung 90 Tage nach Abschluss
2. **Stornierte Aufträge:** Auftragsinformationen 30 Tage, Dokumente sofort löschen
3. **Persönliche Notizen:** Mit Auftragslöschung entfernen
4. **Audit-Logs:** Separate Aufbewahrung nach gesetzlichen Vorgaben
5. **Inaktive Accounts:** Nach 2 Jahren ohne Login zur Überprüfung

**Löschprozess:**
1. System identifiziert löschbare Datensätze
2. Automatische Benachrichtigung an betroffene Gutachter (7 Tage vorher)
3. Daten-Export für Archivierung (falls erforderlich)
4. Sichere Löschung aus produktiver Datenbank
5. Bestätigung und Dokumentation der Löschung

**Ausnahmebehandlung:**
- **A1:** Laufende Verfahren → Löschung pausieren bis Abschluss
- **A2:** Rechtliche Aufbewahrungspflicht → Archivierung statt Löschung
- **A3:** Benutzer-Widerspruch → Manuelle Prüfung erforderlich

**Konfiguration durch Administrator:**
```
Konfigurierbare Parameter:
- Aufbewahrungszeiten pro Auftragstyp
- Benachrichtigungsvorlauf 
- Löschung-Batch-Größen
- Ausnahmeregeln für spezielle Fälle
```

**Nachbedingungen:**
- DSGVO-Compliance ist sichergestellt
- Speicherplatz wird optimiert
- Löschvorgänge sind vollständig dokumentiert

**Sicherheitsanforderungen:**
- Sichere, nicht-wiederherstellbare Löschung
- Verschlüsselte Archivierung bei Aufbewahrungspflicht
- Zwei-Faktor-Bestätigung für manuelle Löschvorgänge
- Regelmäßige Compliance-Audits

**Quell-Stories:** US-LA.01, US-LA.02, US-LA.03, US-AM.07  
**Priorität:** Mittel - Rechtliche Compliance erforderlich  

---

## 🔴 Niedrige Priorität Use Cases (Sprint 3+)

### UC-07: Support-Dashboard und Überwachung

**Use Case ID:** UC-07  
**Name:** DRV-Support Dashboard und Systemüberwachung  
**Primärer Akteur:** DRV-Mitarbeiter (Support-Rolle)  
**Auslöser:** Support-Mitarbeiter benötigt Systemüberblick oder Support-Information  

**Vorbedingungen:**
- DRV-Mitarbeiter hat Support-Berechtigung
- System-Monitoring ist aktiv
- Dashboard-Daten sind aktuell

**Dashboard-Funktionen:**
1. **Auftragszuweisungen überwachen** (US-SL.01)
   - Vollständige Liste aller Zuweisungen
   - Suchfunktion nach VSNR, Gutachter-Name, EFN
   - Filterung nach Status, Zeitraum, Region
   
2. **Dokumentenübersicht** (US-SL.02)
   - Prüfung der bereitgestellten Dokumente pro Auftrag
   - Identifikation fehlender oder problematischer Dokumente
   - Vollständigkeits-Check für Support-Fälle

3. **System-Gesundheit**
   - Aktive Benutzer-Sessions
   - Performance-Metriken (Response-Zeiten, Fehlerrate)
   - E-Mail-Versand Status
   - Integration-Status (eLogin, rvSMD)

**Support-Werkzeuge:**
- **S1:** Benutzer-Impersonation (mit Audit-Trail)
- **S2:** Manual-Override für blockierte Accounts
- **S3:** Bulk-Operationen für Massenereignisse
- **S4:** Eskalations-Workflows für kritische Probleme

**Nachbedingungen:**
- Support-Mitarbeiter haben vollständigen Systemüberblick
- Probleme können schnell identifiziert und behoben werden
- Alle Support-Aktionen sind auditiert

**Quell-Stories:** US-SL.01, US-SL.02, US-SL.03, US-SL.04  
**Priorität:** Niedrig - Wichtig für operative Exzellenz  

---

### UC-08: Erweiterte Gutachtermitarbeiter-Verwaltung

**Use Case ID:** UC-08  
**Name:** Gutachtermitarbeiter-Registrierung und -Verwaltung  
**Primärer Akteur:** Gutachter  
**Sekundäre Akteure:** Gutachtermitarbeiter, DRV-Mitarbeiter  
**Auslöser:** Gutachter möchte Mitarbeiter für das System anmelden  

**Vorbedingungen:**
- Gutachter ist registriert und aktiviert
- Mitarbeiter hat gültige eLogin-Berechtigung
- DRV-Genehmigungsprozess ist verfügbar

**Anmeldeprozess:**
1. Gutachter öffnet Mitarbeiter-Verwaltung
2. Gutachter füllt Anmeldeformular für Mitarbeiter aus
3. System validiert Mitarbeiterdaten gegen eLogin
4. Anmeldung wird zur Genehmigung an DRV weitergeleitet
5. DRV-Mitarbeiter prüft und genehmigt Anmeldung
6. Mitarbeiter erhält Aktivierungscode
7. Mitarbeiter aktiviert sich mit dem erhaltenen Code

**Erweiterte Verwaltung:**
- **V1:** Mitarbeiter-Status einsehen und verwalten
- **V2:** Berechtigungen pro Mitarbeiter konfigurieren  
- **V3:** Mitarbeiter-Deaktivierung durch Gutachter
- **V4:** Audit-Trail aller Mitarbeiter-Aktivitäten

**Alternativszenarien:**
- **A1:** Mitarbeiter bereits in anderem Kontext registriert → Zuordnung prüfen
- **A2:** Gutachter-Account wird deaktiviert → Alle Mitarbeiter automatisch deaktivieren
- **A3:** Mitarbeiter verlässt Praxis → Formeller Abmeldeprozess

**Nachbedingungen:**
- Mitarbeiter können im Namen des Gutachters arbeiten
- Alle Aktivitäten sind dem verantwortlichen Gutachter zugeordnet
- Audit-Trail ist vollständig

**Quell-Stories:** US-RL.02, US-RL.03, US-RL.09, US-RL.10  
**Priorität:** Niedrig - Erweiterte Funktionalität für größere Praxen

---

### UC-10: Automatischer Dokumentenabruf und Caching (rvPUR → rvGutachten)

**Use Case ID:** UC-10  
**Name:** Automatischer Dokumentenabruf und Zwischenspeicherung bei neuem Auftrag  
**Primärer Akteur:** System (rvGutachten, Hintergrundprozess)  
**Sekundäre Akteure:** Gutachter, rvSMD, rvPUR  
**Auslöser:** Neuer Gutachtenauftrag wird erstellt/übertragen

**Vorbedingungen:**
- Auftrag ist in rvGutachten angelegt
- Dokumente zu diesem Auftrag sind in rvPUR vorhanden
- System hat Zugriff auf rvPUR-API

**Erfolgsszenario:**
1. rvSMD überträgt neuen Gutachtenauftrag an rvGutachten
2. rvGutachten legt Auftrag an und stößt Hintergrundprozess an
3. Hintergrundprozess fragt alle relevanten Dokumente zu diesem Auftrag aus rvPUR ab
4. Dokumente werden in rvGutachten zwischengespeichert (Cache)
5. Gutachter kann Dokumente direkt in rvGutachten einsehen und bearbeiten
6. Bei neuen/aktualisierten Dokumenten wird der Cache aktualisiert

**Alternativszenarien:**
- **A1:** rvPUR nicht erreichbar → Wiederholungsversuch, Fehlerbenachrichtigung an Support
- **A2:** Keine Dokumente vorhanden → Hinweis an Gutachter
- **A3:** Fehler beim Caching → Logging, Retry, ggf. manuelle Nachbearbeitung

**Nachbedingungen:**
- Alle relevanten Dokumente sind im Auftrag in rvGutachten verfügbar
- Dokumentenzugriff ist performant und ausfallsicher
- Audit-Log für alle Dokumentenzugriffe vorhanden

**Technische Anforderungen:**
- Integration mit rvPUR-API (Dokumentenabruf)
- Caching-Mechanismus in rvGutachten
- Fehler- und Retry-Handling für Hintergrundprozess
- Rechteprüfung bei jedem Dokumentenzugriff

**Quell-Stories:** US-AM.02, US-AM.03, US-AM.05, US-NF.01  
**Priorität:** Mittel/Hoch – Voraussetzung für effiziente Auftragsbearbeitung


---

### UC-11: Statusänderungen Gutachter

**Use Case ID:** UC-11  
**Name:** Statusänderungen Gutachter  
**Primärer Akteur:** 8023-Mitarbeiter (in rvSMD)  
**Sekundäre Akteure:** rvSMD-System, rvGutachten-System  
**Auslöser:** Status eines Gutachters wird in rvSMD geändert (z.B. Aktivierung, Sperrung, Reaktivierung)

**Vorbedingungen:**

- 8023-Mitarbeiter ist authentifiziert und autorisiert
- Gutachter ist in rvSMD vorhanden

**Erfolgsszenario:**

1. 8023-Mitarbeiter öffnet Gutachter-Verwaltung in rvSMD
2. Auswahl eines Gutachters
3. Auswahl gewünschter Statusänderung (aktiv, gesperrt, reaktiviert, gelöscht)
4. rvSMD prüft Berechtigungen und Statusübergänge
5. rvSMD setzt neuen Status und dokumentiert Änderung
6. rvSMD stößt Synchronisation nach rvGutachten an
7. rvGutachten übernimmt Statusänderung automatisch
8. System informiert Gutachter (z.B. per E-Mail)

**Alternativszenarien:**

- **A1:** Ungültiger Statusübergang in rvSMD → Fehlermeldung
- **A2:** Synchronisationsfehler → Logging, Support-Benachrichtigung

**Nachbedingungen:**

- Status des Gutachters ist aktualisiert
- Audit-Log der Statusänderung ist erstellt

**Quell-Stories:** US-RL.09, US-RL.10  
**Priorität:** Mittel - Wichtig für Gutachter-Verwaltung

---

### UC-12: Statusänderungen Gutachtenauftrag

**Use Case ID:** UC-12  
**Name:** Statusänderungen Gutachtenauftrag  
**Primärer Akteur:** Gutachter, 8023-Mitarbeiter (in rvSMD)  
**Sekundäre Akteure:** rvSMD-System, rvGutachten-System  
**Auslöser:** Status eines Gutachtenauftrags wird in rvSMD geändert (z.B. angenommen, in Bearbeitung, abgeschlossen, storniert) und nach rvGutachten synchronisiert

**Vorbedingungen:**

- Auftrag ist in rvSMD vorhanden
- Akteur ist berechtigt (in rvSMD)

**Erfolgsszenario:**

1. Akteur (Gutachter oder 8023-Mitarbeiter) öffnet Auftragsübersicht in rvSMD
2. Auswahl eines Auftrags
3. Auswahl gewünschter Statusänderung (angenommen, in Bearbeitung, abgeschlossen, storniert)
4. rvSMD prüft Berechtigungen und Statusübergänge
5. rvSMD setzt neuen Status und dokumentiert Änderung
6. rvSMD stößt Synchronisation nach rvGutachten an
7. rvGutachten übernimmt Statusänderung automatisch
8. System informiert relevante Parteien (z.B. per E-Mail)

**Alternativszenarien:**

- **A1:** Ungültiger Statusübergang in rvSMD → Fehlermeldung
- **A2:** Synchronisationsfehler → Logging, Support-Benachrichtigung

**Nachbedingungen:**

- Status des Auftrags ist aktualisiert
- Audit-Log der Statusänderung ist erstellt

**Quell-Stories:** US-AM.04, US-AM.06, US-BN.02  
**Priorität:** Mittel - Wichtig für Auftrags-Verwaltung

---

