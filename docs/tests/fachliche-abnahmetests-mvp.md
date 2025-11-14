# QARvGut MVP - Fachliche Abnahmetests - Testfallkatalog

## Dokument-Struktur

**Teil I: Fachliche Abnahmetests** - Isolierte Tests --- Case
- 🔹 Sprint 1: UC-01, UC-02, UC-03 (Kritische Use Cases)
- 🔸 Sprint 2: UC-04, UC-05 (Hohe Priorität Use Cases)  
- 🔷 Sprint 3: UC-06, UC-09 (Mittlere Priorität Use Cases)
- 🔺 Sprint 3+: UC-07, UC-08 (Niedrige Priorität Use Cases)

**Teil II: End-to-End Integration Tests** - Übergreifende Workflows
- E2E-01 bis E2E-05: Komplette Geschäftsprozess-Validierung

---

# Teil I: Fachliche Abnahmetests

## 🔹 Sprint 1 - Kritische Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **UC-01** | **Gutachter-Onboarding-Prozess (US-RL.01, US-RL.04, US-RL.05)** | | | | | | |
| UC-01.01 | Erfolgreiche Gutachter-Registrierung und -Aktivierung | TC-UC01.1 | Positiver Test: Kompletter Admin-verwalteter Registrierungsprozess | eLogin/rvSMD verfügbar, DRV-Mitarbeiter verfügbar, E-Mail funktional | 1. DRV-Admin trägt Gutachter in rvSMD ein (EFN123456789)<br>2. Admin erstellt eLogin-Account für Max Mustermann<br>3. rvSMD überträgt Daten an rvGutachten<br>4. Admin sendet Aktivierungscode per Brief<br>5. Gutachter aktiviert Account mit Code<br>6. Passwort erstellen | Gutachter-Account ist aktiv, Login möglich, Weiterleitung zur Auftragsübersicht | Hoch |
| | | TC-UC01.2 | Negativer Test: EFN bereits registriert | Max Mustermann bereits in rvSMD vorhanden | 1. DRV-Admin versucht EFN zu registrieren<br>2. System prüft gegen existierende Daten | Fehlermeldung: "EFN bereits vorhanden", Link zu bestehender Registrierung | Mittel |
| | | TC-UC01.3 | Edge-Case: Admin-Registrierung bei eLogin/rvSMD-Ausfall | eLogin oder rvSMD temporär nicht verfügbar | 1. Admin-Registrierung während System-Ausfall versuchen | "Service temporär nicht verfügbar" Meldung, keine korrupten Daten | Mittel |
| | | TC-UC01.4 | Negativer Test: Unberechtigter Gutachter | Gutachter ohne gültige Berechtigung | 1. Admin versucht nicht-berechtigten Gutachter zu registrieren<br>2. Interne Prüfung schlägt fehl<br>3. Admin erhält Ablehnungsgrund | Account-Erstellung wird verhindert, Admin wird über fehlende Berechtigung informiert | Mittel |
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
| | | TC-UC03.4 | Negativer Test: Zugriff ohne gültige Berechtigung | Benutzer ohne DRV-Berechtigung | 1. Support-Zugang beantragen<br>2. eLogin-Validierung schlägt fehl | Zugriff verweigert, Fehlermeldung: "Keine gültige DRV-Berechtigung" | Hoch |

---

## � Sprint 2 - Hohe Priorität Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **UC-04** | **Auftragsübersicht und -verwaltung (US-AM.01, US-AM.04, US-AM.06, US-AM.08)** | | | | | | |
| UC-04.01 | Auftragsübersicht anzeigen und verwalten | TC-UC04.1 | Positiver Test: Vollständige Auftragsübersicht laden | Max Mustermann eingeloggt, mehrere Aufträge zugewiesen | 1. Zur Auftragsübersicht navigieren<br>2. System lädt alle zugewiesenen Aufträge<br>3. Tabellenansicht prüfen (Datum, VSNR, Proband, Status)<br>4. Sortieroptionen testen<br>5. Statusfilter verwenden | Alle Aufträge korrekt angezeigt, Sortierung/Filterung funktioniert, Performance < 3 Sek | Hoch |
| | | TC-UC04.2 | Positiver Test: Auftragsstatus ändern | Aktiver Auftrag vorhanden | 1. Auftrag in Übersicht auswählen<br>2. Status von "neu" auf "in Bearbeitung" ändern<br>3. Änderung speichern<br>4. Übersicht aktualisieren | Statusänderung sofort sichtbar, in Datenbank gespeichert, Audit-Log erstellt | Hoch |
| | | TC-UC04.3 | Edge-Case: Stornierte Aufträge anzeigen | Stornierte Aufträge vorhanden | 1. Filter auf "storniert" setzen<br>2. Stornierten Auftrag auswählen<br>3. Statusänderung versuchen | Stornierte Aufträge deutlich gekennzeichnet, Statusänderung gesperrt | Mittel |
| | | TC-UC04.4 | Positiver Test: Suchfunktion verwenden | Mehrere Aufträge verschiedener Probanden | 1. In Suchfeld VSNR "12345678901" eingeben<br>2. Enter drücken<br>3. Nach Probandenname "Schmidt" suchen | Suchergebnisse korrekt gefiltert, Such-Response < 1 Sek | Mittel |
| | | TC-UC04.5 | Edge-Case: Keine Aufträge vorhanden | Gutachter ohne zugewiesene Aufträge | 1. Auftragsübersicht öffnen | Informative Meldung: "Keine Aufträge vorhanden", Hilfetext angezeigt | Niedrig |
| | | TC-UC04.6 | Positiver Test: Mahnungen anzeigen | Auftrag mit Mahnung vorhanden | 1. Auftragsübersicht öffnen<br>2. Auftrag mit Mahnung identifizieren<br>3. Mahnstufe prüfen | Gemahnte Aufträge visuell hervorgehoben, Mahnstufe (1./2./3.) sichtbar | Mittel |
| **UC-05** | **Auftragsdetails und Dokumenteneinsicht (US-AM.02, US-AM.03, US-AM.05, US-NF.01)** | | | | | | |
| UC-05.01 | Auftragsdetails einsehen und Dokumente verwalten | TC-UC05.1 | Positiver Test: Auftragsdetails vollständig anzeigen | Auftrag mit mehreren Dokumenten vorhanden, UC-10 Sync abgeschlossen | 1. Auftrag in Übersicht anklicken<br>2. Detailansicht öffnet sich<br>3. Auftragsinformationen prüfen<br>4. Dokumentenliste laden<br>5. Navigation testen | Alle Auftragsdaten sichtbar, Dokumentenliste vollständig, Navigation funktioniert, Ladezeit < 200ms (lokaler Cache) | Hoch |
| | | TC-UC05.2 | Positiver Test: PDF-Dokument öffnen und drucken | Auftrag mit gecachten PDF-Dokumenten (UC-10) | 1. Dokument aus Liste auswählen<br>2. PDF-Viewer öffnet sich<br>3. Ladezeit prüfen (sollte < 100ms sein)<br>4. Druckfunktion testen<br>5. Download-Option prüfen | PDF korrekt angezeigt aus lokalem Cache, Druckdialog öffnet sich, Download möglich, schnelle Performance | Hoch |
| | | TC-UC05.3 | Positiver Test: Notizen zu Dokument erstellen | Auftragsdetail geöffnet | 1. Bei Dokument "Notiz hinzufügen" klicken<br>2. Notiztext eingeben: "Wichtiger Befund auf Seite 3"<br>3. Notiz speichern<br>4. Seite neu laden | Notiz sofort sichtbar, nach Neuladen weiterhin vorhanden | Mittel |
| | | TC-UC05.4 | Negativer Test: Dokument nicht verfügbar (Cache Miss) | Auftrag mit Dokument, das nicht gecacht wurde | 1. Defektes Dokument anklicken<br>2. Fallback zu rvArchiv beobachten | System versucht Fallback zu rvArchiv, bei Fehler: Fehlermeldung "Dokument nicht verfügbar", Kontaktmöglichkeit angezeigt | Mittel |
| | | TC-UC05.5 | Sicherheitstest: Unbefugter Zugriff auf fremden Auftrag | Gutachter A eingeloggt, Auftrag gehört Gutachter B | 1. URL zu fremdem Auftrag direkt aufrufen | Zugriff verweigert, Weiterleitung zur Übersicht, Security-Log Eintrag | Hoch |
| | | TC-UC05.6 | Edge-Case: Auftrag wurde storniert | Zuvor verfügbarer Auftrag wurde storniert | 1. Stornierten Auftrag öffnen<br>2. Funktionen testen | Eingeschränkte Funktionalität, keine neuen Aktionen möglich, Stornierungshinweis, gecachte PDFs werden gelöscht (UC-13) | Mittel |
| | | TC-UC05.7 | Performance-Test: Paralleler PDF-Zugriff | Mehrere Gutachter greifen gleichzeitig auf Dokumente zu | 1. 10 Gutachter öffnen gleichzeitig PDFs<br>2. Response-Zeiten messen<br>3. System-Last überwachen | Alle PDFs werden aus lokalem Cache geliefert, Response-Zeit < 200ms pro Request, keine rvArchiv-Aufrufe | Hoch |
| | | TC-UC05.8 | UC-10 Integration: PDF-Verfügbarkeit bei rvArchiv-Ausfall | rvArchiv temporär nicht erreichbar, PDFs bereits gecacht | 1. rvArchiv-Verbindung unterbrechen<br>2. Gutachter öffnet Auftragsdetails<br>3. PDF-Dokumente öffnen | Alle gecachten PDFs weiterhin verfügbar, normale Funktionalität trotz rvArchiv-Ausfall, Performance unbeeinträchtigt | Hoch |
| **UC-13** | **Auftragsstornierung (US-AM.06, US-BN.02)** | | | | | | |
| UC-13.01 | Auftragsstornierung durch DRV-Mitarbeiter | TC-UC13.1 | Positiver Test: Vollständiger Stornierungsprozess | Aktiver Auftrag in rvSMD und rvGutachten vorhanden | 1. 8023-Mitarbeiter storniert Auftrag in rvSMD<br>2. rvSMD stößt Synchronisation an<br>3. rvGutachten empfängt Statusänderung<br>4. Status wird auf "storniert" gesetzt<br>5. Auftragsdokumente werden gelöscht (UC-09)<br>6. E-Mail-Benachrichtigung wird versendet (UC-06) | Auftragsstatus "storniert", Dokumente gelöscht, relevante Parteien benachrichtigt, Audit-Log erstellt | Hoch |
| | | TC-UC13.2 | Positiver Test: Gutachter-Benachrichtigung bei Stornierung | Gutachter hat Auftrag in Bearbeitung | 1. Auftrag wird in rvSMD storniert<br>2. Synchronisation erfolgt<br>3. E-Mail-Benachrichtigung an Gutachter prüfen | Gutachter erhält E-Mail mit Stornierungsgrund, Auftrag in Übersicht als "storniert" markiert | Hoch |
| | | TC-UC13.3 | Negativer Test: Ungültiger Statusübergang | Bereits stornierter Auftrag | 1. Versuch, bereits stornierten Auftrag erneut zu stornieren | Fehlermeldung in rvSMD: "Ungültiger Statusübergang", keine Synchronisation | Mittel |
| | | TC-UC13.4 | Fehlerbehandlung: Synchronisationsfehler | rvGutachten temporär nicht erreichbar | 1. Auftrag in rvSMD stornieren<br>2. rvGutachten-Verbindung unterbrechen<br>3. Fehlerprotokoll prüfen | Fehler geloggt, Support-Benachrichtigung versendet, Retry-Mechanismus aktiv | Hoch |
| | | TC-UC13.5 | Sicherheitstest: Dokumentenlöschung verifizieren | Stornierter Auftrag mit mehreren Dokumenten | 1. Auftrag stornieren<br>2. Dokumentenlöschung überwachen<br>3. Datenbank und Cache prüfen | Alle Dokumente vollständig gelöscht, keine Reste in DB oder Cache, Cache invalidiert | Hoch |
| | | TC-UC13.6 | Edge-Case: Stornierung während Gutachter-Bearbeitung | Gutachter hat Auftragsdetails geöffnet | 1. Auftrag wird parallel storniert<br>2. Gutachter versucht, Änderungen zu speichern | Gutachter erhält Hinweis "Auftrag wurde storniert", Änderungen werden nicht gespeichert, automatische Weiterleitung | Mittel |

---

## � Sprint 3 - Mittlere Priorität Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **UC-06** | **E-Mail-Benachrichtigungssystem (US-BN.01, US-BN.02, US-BN.04, US-BN.05)** | | | | | | |
| UC-06.01 | Automatische E-Mail-Benachrichtigungen verwalten | TC-UC06.1 | Positiver Test: Benachrichtigung bei neuem Auftrag | E-Mail-System verfügbar, Gutachter registriert | 1. Neuen Auftrag zuweisen<br>2. E-Mail-Versand überwachen<br>3. E-Mail-Inhalt prüfen<br>4. Platzhalter-Ersetzung validieren | E-Mail mit korrekten Daten versendet, Platzhalter {{gutachter_name}} ersetzt | Hoch |
| | | TC-UC06.2 | Positiver Test: Statusänderungs-Benachrichtigung | Auftrag mit Status "neu" vorhanden | 1. Auftragsstatus ändern auf "in Bearbeitung"<br>2. E-Mail-Benachrichtigung an DRV-Mitarbeiter prüfen | Statusänderungs-E-Mail versendet, korrekte Auftragsinformationen enthalten | Mittel |
| | | TC-UC06.3 | Positiver Test: Wartungsbenachrichtigung | Geplante System-Wartung konfiguriert | 1. Wartungs-E-Mail 24h vorher senden<br>2. Alle registrierten Benutzer prüfen<br>3. E-Mail-Inhalt validieren | Alle Benutzer benachrichtigt, Wartungszeiten korrekt kommuniziert | Mittel |
| | | TC-UC06.4 | Konfigurationstest: E-Mail-Template anpassen | DRV-Mitarbeiter mit Template-Rechten | 1. Admin-Panel öffnen<br>2. E-Mail-Template bearbeiten<br>3. Platzhalter {{proband_name}} hinzufügen<br>4. Template speichern und testen | Template-Änderungen wirksam, neue Platzhalter funktionieren | Niedrig |
| | | TC-UC06.5 | Negativer Test: E-Mail-Versand Fehlerbehandlung | SMTP-Server temporär nicht verfügbar | 1. E-Mail-auslösendes Ereignis (neuer Auftrag)<br>2. SMTP-Fehler simulieren | Retry-Mechanismus aktiv, Fehlgeschlagene E-Mails in Queue, Admin benachrichtigt | Mittel |
| | | TC-UC06.6 | Benutzerfreundlichkeitstest: Opt-out Funktionalität | Gutachter möchte weniger E-Mails | 1. Profil-Einstellungen öffnen<br>2. "Statusänderungs-E-Mails" deaktivieren<br>3. Auftragsstatus ändern | Keine E-Mail versendet für deaktivierte Kategorie, kritische E-Mails weiterhin aktiv | Niedrig |
| **UC-09** | **Datenaufbewahrung und Löschung DSGVO (US-LA.01, US-LA.02, US-LA.03, US-AM.07)** | | | | | | |
| UC-09.01 | Automatische Datenaufbewahrung und -löschung | TC-UC09.1 | Positiver Test: Automatische Löschung abgeschlossener Aufträge | Auftrag seit 90 Tagen abgeschlossen | 1. Lösch-Job ausführen<br>2. Benachrichtigung 7 Tage vorher prüfen<br>3. Löschvorgang überwachen<br>4. Datenbank-Status validieren | Gutachter 7 Tage vorher benachrichtigt, Auftrag nach 90 Tagen gelöscht, Löschung dokumentiert | Hoch |
| | | TC-UC09.2 | Positiver Test: Stornierte Aufträge sofort löschen | Auftrag wurde storniert | 1. Auftrag stornieren<br>2. Dokumente-Löschung prüfen<br>3. Auftragsinfo-Aufbewahrung (30 Tage) validieren | Dokumente sofort gelöscht, Auftragsinformationen 30 Tage aufbewahrt | Hoch |
| | | TC-UC09.3 | Konfigurationstest: Aufbewahrungszeiten anpassen | Administrator-Rechte | 1. Admin-Panel öffnen<br>2. Aufbewahrungszeit für "abgeschlossen" auf 120 Tage ändern<br>3. Konfiguration speichern<br>4. Lösch-Job erneut ausführen | Neue Aufbewahrungszeiten wirksam, entsprechende Aufträge nicht gelöscht | Mittel |
| | | TC-UC09.4 | Edge-Case: Löschung bei laufendem Verfahren | Auftrag mit rechtlichem Verfahren | 1. Ausnahmeregel für Auftrag setzen<br>2. Automatische Löschung ausführen<br>3. Status prüfen | Auftrag trotz Ablaufzeit nicht gelöscht, Ausnahme dokumentiert | Mittel |
| | | TC-UC09.5 | Sicherheitstest: Sichere Löschung validieren | Gelöschte Aufträge vorhanden | 1. Datenbank-Forensik durchführen<br>2. Wiederherstellungsversuche<br>3. Backup-Systeme prüfen | Daten nicht wiederherstellbar, sichere Löschung bestätigt | Hoch |
| | | TC-UC09.6 | Compliance-Test: Audit-Trail für Löschungen | Mehrere Löschvorgänge durchgeführt | 1. Audit-Log öffnen<br>2. Löschvorgänge der letzten 30 Tage anzeigen<br>3. Vollständigkeit prüfen | Alle Löschungen dokumentiert, Zeitstempel, Benutzer, Grund erfasst | Mittel |

---

## � Sprint 3+ - Niedrige Priorität Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **UC-07** | **Support-Dashboard und Überwachung (US-SL.01, US-SL.02, US-SL.03, US-SL.04)** | | | | | | |
| UC-07.01 | DRV-Support Dashboard und Systemüberwachung | TC-UC07.1 | Positiver Test: Support-Dashboard Vollansicht | DRV-Support-Mitarbeiter angemeldet | 1. Support-Dashboard öffnen<br>2. System-Gesundheit prüfen<br>3. Performance-Metriken anzeigen<br>4. Aktive Sessions überwachen | Dashboard zeigt alle relevanten Metriken, Response-Zeiten < 2 Sek, Echtzeit-Updates | Mittel |
| | | TC-UC07.2 | Positiver Test: Benutzer-Impersonation für Support | Gutachter mit Problem identifiziert | 1. Benutzer in Dashboard suchen<br>2. "Als Benutzer anzeigen" aktivieren<br>3. Problem reproduzieren<br>4. Impersonation beenden | Erfolgreiche Impersonation, Problem reproduziert, Audit-Trail erstellt | Mittel |
| | | TC-UC07.3 | Administrationstest: Bulk-Operation durchführen | Mehrere blockierte Accounts | 1. Blockierte Accounts filtern<br>2. Alle auswählen<br>3. Bulk-Entsperrung durchführen<br>4. Ergebnis validieren | Alle ausgewählten Accounts entsperrt, Batch-Operation dokumentiert | Niedrig |
| **UC-08** | **Erweiterte Gutachtermitarbeiter-Verwaltung (US-RL.02, US-RL.03, US-RL.09, US-RL.10)** | | | | | | |
| UC-08.01 | Gutachtermitarbeiter-Registrierung und -Verwaltung | TC-UC08.1 | Positiver Test: Mitarbeiter-Anmeldung durch Gutachter | Max Mustermann als Gutachter eingeloggt | 1. Mitarbeiter-Verwaltung öffnen<br>2. "Neuer Mitarbeiter" klicken<br>3. Anna Schmidt als Mitarbeiterin anmelden<br>4. DRV-Genehmigung simulieren<br>5. Mitarbeiter-Aktivierung abschließen | Mitarbeiterin kann im Namen des Gutachters arbeiten, alle Aktivitäten zugeordnet | Niedrig |
| | | TC-UC08.2 | Verwaltungstest: Mitarbeiter-Berechtigungen konfigurieren | Mitarbeiter bereits registriert | 1. Mitarbeiter-Einstellungen öffnen<br>2. Berechtigung "Aufträge einsehen" aktivieren<br>3. Berechtigung "Status ändern" deaktivieren<br>4. Mitarbeiter-Account testen | Berechtigungen korrekt angewendet, eingeschränkte Funktionen nicht verfügbar | Niedrig |
| | | TC-UC08.3 | Edge-Case: Gutachter-Deaktivierung Auswirkung | Gutachter mit mehreren Mitarbeitern | 1. Gutachter-Account deaktivieren<br>2. Mitarbeiter-Accounts prüfen<br>3. Zugriff testen | Alle Mitarbeiter automatisch deaktiviert, keine Systemzugriffe möglich | Niedrig |allkatalog)

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

# Teil II: End-to-End Integration Tests

## 📊 End-to-End Geschäftsprozess-Tests

**Zweck:** Diese Tests validieren komplette Geschäftsprozesse über mehrere Use Cases hinweg und stellen sicher, dass alle Systemkomponenten korrekt zusammenarbeiten.

**Unterschied zu Teil I:**
- **Fachliche Abnahmetests (Teil I):** Testen einzelne Use Cases isoliert
- **End-to-End Tests (Teil II):** Testen übergreifende Workflows und Systemintegration

**Ausführungsreihenfolge:** Diese Tests werden erst nach erfolgreicher Abnahme der entsprechenden Einzeltests aus Teil I durchgeführt.

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **E2E-01** | **Kompletter Gutachter-Onboarding bis erste Anmeldung** | | | | | | |
| E2E-01.01 | End-to-End Workflow: Registrierung bis Arbeitsbereitschaft | TC-E2E01.1 | Positiver Test: Gesamter Workflow von Registrierung bis erste Anmeldung | Alle Systeme (eLogin, rvSMD, E-Mail) verfügbar, DRV-Mitarbeiter verfügbar | 1. Gutachter registriert sich (TC-UC01.1)<br>2. DRV-Mitarbeiter genehmigt (TC-UC03.2)<br>3. Gutachter aktiviert Account<br>4. Gutachter meldet sich erstmalig an (TC-UC02.1)<br>5. Auftragsübersicht wird angezeigt | Kompletter Workflow läuft ohne manuelle Eingriffe, Gutachter ist arbeitsbereit | Hoch |
| **E2E-02** | **DRV-Support-Workflow Komplettvalidierung** | | | | | | |
| E2E-02.01 | Support-Mitarbeiter kompletter Arbeitszyklus | TC-E2E02.1 | Positiver Test: DRV-Mitarbeiter kann alle Support-Aufgaben durchführen | TestAdmin hat gültige Berechtigung | 1. DRV-Mitarbeiter erhält Support-Zugang (TC-UC03.1)<br>2. Neue Gutachter-Registrierung wird bearbeitet (TC-UC03.2)<br>3. Auftragszuweisungen werden überwacht (TC-UC03.3)<br>4. Support-Aufgaben werden erfüllt | Support-Workflows sind effizient, alle Admin-Funktionen arbeiten korrekt | Hoch |
| **E2E-03** | **Kompletter Auftragsbearbeitungs-Workflow Sprint 2** | | | | | | |
| E2E-03.01 | Gutachter Arbeitsalltag: Auftragsübersicht bis Dokumentbearbeitung | TC-E2E03.1 | Positiver Test: Vollständiger Tagesworkflow eines Gutachters | Max Mustermann eingeloggt, mehrere neue Aufträge zugewiesen | 1. Anmeldung (TC-UC02.1)<br>2. Auftragsübersicht einsehen (TC-UC04.1)<br>3. Neuen Auftrag auswählen und öffnen (TC-UC05.1)<br>4. Dokumente einsehen und Notizen erstellen (TC-UC05.3)<br>5. Auftragsstatus auf "in Bearbeitung" setzen (TC-UC04.2)<br>6. E-Mail-Benachrichtigung erhalten (TC-UC06.2) | Kompletter Arbeitsablauf reibungslos, alle Funktionen integriert, Performance akzeptabel | Hoch |
| **E2E-04** | **DSGVO-Compliance End-to-End Sprint 3** | | | | | | |
| E2E-04.01 | Vollständiger Datenlebenszyklus mit automatischer Löschung | TC-E2E04.1 | Positiver Test: Auftrag von Erstellung bis automatischer Löschung | Auftrag über gesamten Lifecycle verfolgen | 1. Neuer Auftrag wird zugewiesen<br>2. Gutachter bearbeitet Auftrag (TC-UC04.2)<br>3. Auftrag wird abgeschlossen<br>4. 83 Tage warten (7 Tage vor Löschung)<br>5. Löschbenachrichtigung prüfen (TC-UC09.1)<br>6. Automatische Löschung nach 90 Tagen<br>7. DSGVO-Compliance validieren | Kompletter Datenlebenszyklus DSGVO-konform, Benachrichtigungen funktionieren, sichere Löschung | Mittel |
| **E2E-05** | **Multi-User Support-Szenario Sprint 3+** | | | | | | |
| E2E-05.01 | Gutachter mit Mitarbeitern: Komplette Praxisabbildung | TC-E2E05.1 | Positiver Test: Große Gutachterpraxis mit mehreren Mitarbeitern | Gutachter Dr. Müller mit 3 Mitarbeitern | 1. Gutachter meldet Mitarbeiter an (TC-UC08.1)<br>2. DRV genehmigt alle Mitarbeiter<br>3. Mitarbeiter erhalten verschiedene Berechtigungen (TC-UC08.2)<br>4. Aufträge werden auf Team verteilt<br>5. Parallel-Bearbeitung verschiedener Aufträge<br>6. Support überwacht alle Aktivitäten (TC-UC07.1) | Mehrbenutzer-Umgebung stabil, Berechtigungen korrekt, Audit-Trail vollständig | Niedrig |

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
| **Smoke Tests** | TC-UC01.1, TC-UC02.1, TC-UC03.1, TC-UC04.1, TC-UC05.1 | Bei jedem Build | Hoch |
| **Regression Tests** | Alle TC-UC01-UC09 | Vor Release | Mittel |
| **End-to-End Tests** | TC-E2E01-E2E05 | Wöchentlich | Niedrig |
| **Performance Tests** | TC-UC04.*, TC-UC06.*, TC-UC07.* | Bei größeren Änderungen | Mittel |
| **Security Tests** | TC-UC02.3, TC-UC05.5, TC-UC09.5 | Vor jedem Release | Niedrig |
| **DSGVO-Compliance Tests** | TC-UC09.* | Monatlich | Niedrig |
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
**Letzte Aktualisierung:** Sprint 2 & 3 Use Cases ergänzt (UC-04 bis UC-09)  
**Status:** Vollständig für MVP Sprints 1-3, bereit für Implementierung  

---

**Verwendung:**
1. Tests vor Produktiv-Deployment durchführen
2. Bei kritischen Änderungen Regression-Tests laufen lassen  
3. Regelmäßige Smoke-Tests in Produktions-ähnlicher Umgebung
4. Dokumentation für Audit- und Compliance-Zwecke
