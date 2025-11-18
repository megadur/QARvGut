# QARvGut MVP - Fachliche Abnahmetests - Testfallkatalog

## Dokument-Struktur

**Teil I: Fachliche Abnahmetests** - Isolierte Tests --- Case
- 🔹 Sprint 1: BUC-01, BUC-02, BUC-03 (Kritische Use Cases)
- 🔸 Sprint 2: BUC-04, BUC-05, BUC-10, BUC-12a, BUC-13 (Hohe Priorität Use Cases)  
- 🔷 Sprint 3: BUC-06, BUC-09, BUC-11 (Mittlere Priorität Use Cases)
- 🔺 Sprint 3+: BUC-07, BUC-08 (Niedrige Priorität Use Cases)

**Hinweis:** BUC-12b wurde entfernt und in BUC-13 konsolidiert (beide beschreiben DRV-Statusänderungen mit rvSMD-Synchronisation)

**Teil II: End-to-End Integration Tests** - Übergreifende Workflows
- E2E-01 bis E2E-05: Komplette Geschäftsprozess-Validierung

---

# Teil I: Fachliche Abnahmetests

## 🔹 Sprint 1 - Kritische Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **BUC-01** | **Gutachter-Onboarding-Prozess (US-RL.01, US-RL.04, US-RL.05)** | | | | | | |
| BUC-01.01 | Erfolgreiche Gutachter-Registrierung und -Aktivierung | TC-BUC01.1 | Positiver Test: Kompletter Admin-verwalteter Registrierungsprozess | eLogin/rvSMD verfügbar, DRV-Mitarbeiter verfügbar, E-Mail funktional | 1. DRV-Admin trägt Gutachter in rvSMD ein (EFN123456789)<br>2. Admin erstellt eLogin-Account für Max Mustermann<br>3. rvSMD überträgt Daten an rvGutachten<br>4. Admin sendet Aktivierungscode per Brief<br>5. Gutachter aktiviert Account mit Code<br>6. Passwort erstellen | Gutachter-Account ist aktiv, Login möglich, Weiterleitung zur Auftragsübersicht | Hoch |
| | | TC-BUC01.2 | Negativer Test: EFN bereits registriert | Max Mustermann bereits in rvSMD vorhanden | 1. DRV-Admin versucht EFN zu registrieren<br>2. System prüft gegen existierende Daten | Fehlermeldung: "EFN bereits vorhanden", Link zu bestehender Registrierung | Mittel |
| | | TC-BUC01.3 | Edge-Case: Admin-Registrierung bei eLogin/rvSMD-Ausfall | eLogin oder rvSMD temporär nicht verfügbar | 1. Admin-Registrierung während System-Ausfall versuchen | "Service temporär nicht verfügbar" Meldung, keine korrupten Daten | Mittel |
| | | TC-BUC01.4 | Negativer Test: Unberechtigter Gutachter | Gutachter ohne gültige Berechtigung | 1. Admin versucht nicht-berechtigten Gutachter zu registrieren<br>2. Interne Prüfung schlägt fehl<br>3. Admin erhält Ablehnungsgrund | Account-Erstellung wird verhindert, Admin wird über fehlende Berechtigung informiert | Mittel |
| **BUC-02** | **System-Authentifizierung (US-RL.07, US-RL.08)** | | | | | | |
| BUC-02.01 | Standard Login-Prozess | TC-BUC02.1 | Positiver Test: Erfolgreiche Anmeldung | Max Mustermann hat aktivierten Account | 1. Portal öffnen<br>2. E-Mail eingeben: max.mustermann@test-gutachter.de<br>3. Passwort eingeben: SecurePass123!<br>4. "Anmelden" klicken | Login erfolgreich, Weiterleitung zur Auftragsübersicht, Session aktiv | Hoch |
| | | TC-BUC02.2 | Negativer Test: Anmeldung mit falschen Daten | Korrekte E-Mail bekannt | 1. E-Mail eingeben: max.mustermann@test-gutachter.de<br>2. Falsches Passwort eingeben<br>3. "Anmelden" klicken | Fehlermeldung: "E-Mail oder Passwort falsch", Formular bleibt geöffnet | Mittel |
| | | TC-BUC02.3 | Edge-Case: Brute-Force-Schutz | Gültige E-Mail-Adresse bekannt | 1. 5 aufeinanderfolgende Fehlversuche<br>2. 6. Versuch | Nach 5. Versuch: Account für 30 Min gesperrt, Sperrung kommuniziert | Hoch |
| | | TC-BUC02.4 | Positiver Test: "Angemeldet bleiben" Funktion | Gültige Anmeldedaten | 1. Login mit aktivierter "Angemeldet bleiben" Checkbox<br>2. Browser schließen und erneut öffnen | Extended Session aktiv (7 Tage), Benutzer bleibt eingeloggt | Mittel |
| | | TC-BUC02.5 | Positiver Test: Passwort-Reset-Workflow | Registrierter Gutachter | 1. "Passwort vergessen" klicken<br>2. E-Mail eingeben<br>3. Reset-Link in E-Mail klicken<br>4. Neues Passwort eingeben | Reset-E-Mail versendet, neues Passwort gesetzt, Login möglich | Mittel |
| **BUC-03** | **DRV-Mitarbeiter-Zugriffsverwaltung (US-RL.06)** | | | | | | |
| BUC-03.01 | DRV-Mitarbeiter Support-Zugang | TC-BUC03.1 | Positiver Test: Admin-Berechtigungen validieren | TestAdmin hat gültige DRV-Berechtigung, rvGutachtenAdmin verfügbar | 1. Zugang über rvGutachtenAdmin beantragen<br>2. System validiert über eLogin<br>3. Admin-Account wird erstellt<br>4. Support-Funktionen testen | DRV-Mitarbeiter hat Zugriff auf Support-Dashboard und Admin-Funktionen | Hoch |
| | | TC-BUC03.2 | Positiver Test: Gutachter-Registrierungen verwalten | DRV-Mitarbeiter angemeldet, pending Registrierungen vorhanden | 1. Gutachter-Verwaltung öffnen<br>2. Pending Registrierung auswählen<br>3. Status auf "approved" ändern<br>4. Speichern | Statusänderung gespeichert, Aktivierungscode-Versand ausgelöst | Hoch |
| | | TC-BUC03.3 | Positiver Test: Auftragszuweisungen einsehen | Mehrere Aufträge verschiedenen Gutachtern zugewiesen | 1. Support-Dashboard öffnen<br>2. Nach VSNR "12345678901" suchen<br>3. Nach Gutachter "Max Mustermann" suchen<br>4. Auftragsdetails einsehen | Übersicht aller Zuweisungen, Such-/Filterfunktionen funktionieren, Details sichtbar | Mittel |
| | | TC-BUC03.4 | Negativer Test: Zugriff ohne gültige Berechtigung | Benutzer ohne DRV-Berechtigung | 1. Support-Zugang beantragen<br>2. eLogin-Validierung schlägt fehl | Zugriff verweigert, Fehlermeldung: "Keine gültige DRV-Berechtigung" | Hoch |

---

## � Sprint 2 - Hohe Priorität Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **BUC-04** | **Auftragsübersicht und -verwaltung (US-AM.01, US-AM.04, US-AM.06, US-AM.08)** | | | | | | |
| BUC-04.01 | Auftragsübersicht anzeigen und verwalten | TC-BUC04.1 | Positiver Test: Vollständige Auftragsübersicht laden | Max Mustermann eingeloggt, mehrere Aufträge zugewiesen | 1. Zur Auftragsübersicht navigieren<br>2. System lädt alle zugewiesenen Aufträge<br>3. Tabellenansicht prüfen (Datum, VSNR, Proband, Status)<br>4. Sortieroptionen testen<br>5. Statusfilter verwenden | Alle Aufträge korrekt angezeigt, Sortierung/Filterung funktioniert, Performance < 3 Sek | Hoch |
| | | TC-BUC04.2 | Positiver Test: Auftragsstatus ändern | Aktiver Auftrag vorhanden | 1. Auftrag in Übersicht auswählen<br>2. Status von "neu" auf "in Bearbeitung" ändern<br>3. Änderung speichern<br>4. Übersicht aktualisieren | Statusänderung sofort sichtbar, in Datenbank gespeichert, Audit-Log erstellt | Hoch |
| | | TC-BUC04.3 | Edge-Case: Stornierte Aufträge anzeigen | Stornierte Aufträge vorhanden | 1. Filter auf "storniert" setzen<br>2. Stornierten Auftrag auswählen<br>3. Statusänderung versuchen | Stornierte Aufträge deutlich gekennzeichnet, Statusänderung gesperrt | Mittel |
| | | TC-BUC04.4 | Positiver Test: Suchfunktion verwenden | Mehrere Aufträge verschiedener Probanden | 1. In Suchfeld VSNR "12345678901" eingeben<br>2. Enter drücken<br>3. Nach Probandenname "Schmidt" suchen | Suchergebnisse korrekt gefiltert, Such-Response < 1 Sek | Mittel |
| | | TC-BUC04.5 | Edge-Case: Keine Aufträge vorhanden | Gutachter ohne zugewiesene Aufträge | 1. Auftragsübersicht öffnen | Informative Meldung: "Keine Aufträge vorhanden", Hilfetext angezeigt | Niedrig |
| | | TC-BUC04.6 | Positiver Test: Mahnungen anzeigen | Auftrag mit Mahnung vorhanden | 1. Auftragsübersicht öffnen<br>2. Auftrag mit Mahnung identifizieren<br>3. Mahnstufe prüfen | Gemahnte Aufträge visuell hervorgehoben, Mahnstufe (1./2./3.) sichtbar | Mittel |
| **BUC-05** | **Auftragsdetails und Dokumenteneinsicht (US-AM.02, US-AM.03, US-AM.05, US-NF.01)** | | | | | | |
| BUC-05.01 | Auftragsdetails einsehen und Dokumente verwalten | TC-BUC05.1 | Positiver Test: Auftragsdetails vollständig anzeigen | Auftrag mit mehreren Dokumenten vorhanden, BUC-10 Sync abgeschlossen | 1. Auftrag in Übersicht anklicken<br>2. Detailansicht öffnet sich<br>3. Auftragsinformationen prüfen<br>4. Dokumentenliste laden<br>5. Navigation testen | Alle Auftragsdaten sichtbar, Dokumentenliste vollständig, Navigation funktioniert, Ladezeit < 200ms (lokaler Cache) | Hoch |
| | | TC-BUC05.2 | Positiver Test: PDF-Dokument öffnen und drucken | Auftrag mit gecachten PDF-Dokumenten (BUC-10) | 1. Dokument aus Liste auswählen<br>2. PDF-Viewer öffnet sich<br>3. Ladezeit prüfen (sollte < 100ms sein)<br>4. Druckfunktion testen<br>5. Download-Option prüfen | PDF korrekt angezeigt aus lokalem Cache, Druckdialog öffnet sich, Download möglich, schnelle Performance | Hoch |
| | | TC-BUC05.3 | Positiver Test: Notizen zu Dokument erstellen | Auftragsdetail geöffnet | 1. Bei Dokument "Notiz hinzufügen" klicken<br>2. Notiztext eingeben: "Wichtiger Befund auf Seite 3"<br>3. Notiz speichern<br>4. Seite neu laden | Notiz sofort sichtbar, nach Neuladen weiterhin vorhanden | Mittel |
| | | TC-BUC05.4 | Negativer Test: Dokument nicht verfügbar (Cache Miss) | Auftrag mit Dokument, das nicht gecacht wurde | 1. Defektes Dokument anklicken<br>2. Fallback zu rvArchiv beobachten | System versucht Fallback zu rvArchiv, bei Fehler: Fehlermeldung "Dokument nicht verfügbar", Kontaktmöglichkeit angezeigt | Mittel |
| | | TC-BUC05.5 | Sicherheitstest: Unbefugter Zugriff auf fremden Auftrag | Gutachter A eingeloggt, Auftrag gehört Gutachter B | 1. URL zu fremdem Auftrag direkt aufrufen | Zugriff verweigert, Weiterleitung zur Übersicht, Security-Log Eintrag | Hoch |
| | | TC-BUC05.6 | Edge-Case: Auftrag wurde storniert | Zuvor verfügbarer Auftrag wurde storniert | 1. Stornierten Auftrag öffnen<br>2. Funktionen testen | Eingeschränkte Funktionalität, keine neuen Aktionen möglich, Stornierungshinweis, gecachte PDFs werden gelöscht (BUC-13) | Mittel |
| | | TC-BUC05.7 | Performance-Test: Paralleler PDF-Zugriff | Mehrere Gutachter greifen gleichzeitig auf Dokumente zu | 1. 10 Gutachter öffnen gleichzeitig PDFs<br>2. Response-Zeiten messen<br>3. System-Last überwachen | Alle PDFs werden aus lokalem Cache geliefert, Response-Zeit < 200ms pro Request, keine rvArchiv-Aufrufe | Hoch |
| | | TC-BUC05.8 | BUC-10 Integration: PDF-Verfügbarkeit bei rvArchiv-Ausfall | rvArchiv temporär nicht erreichbar, PDFs bereits gecacht | 1. rvArchiv-Verbindung unterbrechen<br>2. Gutachter öffnet Auftragsdetails<br>3. PDF-Dokumente öffnen | Alle gecachten PDFs weiterhin verfügbar, normale Funktionalität trotz rvArchiv-Ausfall, Performance unbeeinträchtigt | Hoch |
| **BUC-10** | **Automatische Dokumentenbereitstellung (US-AM.02, US-AM.03, US-AM.05, US-NF.01)** | | | | | | |
| BUC-10.01 | Automatische Dokumentenbeschaffung bei neuem Auftrag | TC-BUC10.1 | Positiver Test: Vollständige Dokumentenbereitstellung | Neuer Auftrag in rvSMD erstellt, rvPUR mit Dokumenten verfügbar | 1. rvSMD überträgt neuen Auftrag an rvGutachten<br>2. rvGutachten legt Auftrag an<br>3. System startet automatische Dokumentenbeschaffung aus rvPUR<br>4. Dokumente werden gecacht<br>5. Gutachter öffnet Auftrag<br>6. Dokumentenverfügbarkeit prüfen | Alle Dokumente automatisch bereitgestellt, Zugriff < 200ms, keine manuelle Nachforderung nötig | Hoch |
| | | TC-BUC10.2 | Positiver Test: Aktualisierung bei neuen Dokumenten | Auftrag mit Dokumenten vorhanden, neue Dokumente in rvPUR | 1. Neue Dokumente zu Auftrag in rvPUR ablegen<br>2. rvPUR benachrichtigt rvGutachten<br>3. System aktualisiert Cache automatisch<br>4. Gutachter öffnet Auftrag | Neue Dokumente automatisch verfügbar, bestehende Dokumente unverändert, Aktualisierung transparent | Hoch |
| | | TC-BUC10.3 | Negativer Test: rvPUR-Archiv nicht erreichbar | rvPUR temporär offline, neuer Auftrag wird angelegt | 1. rvPUR-Verbindung unterbrechen<br>2. Neuen Auftrag anlegen<br>3. Wiederholungsversuche beobachten<br>4. rvPUR wieder online bringen | Retry-Mechanismus aktiv (3 Versuche, exponentielles Backoff), Support-Benachrichtigung, Dokumente nach rvPUR-Wiederherstellung verfügbar | Hoch |
| | | TC-BUC10.4 | Edge-Case: Keine Dokumente im Archiv | Auftrag ohne zugehörige Dokumente in rvPUR | 1. Auftrag ohne Dokumente anlegen<br>2. Dokumentenbeschaffung durchführen<br>3. Gutachter öffnet Auftrag | Hinweis "Keine Dokumente verfügbar" angezeigt, Auftrag bleibt bearbeitbar, Vorgang protokolliert | Mittel |
| | | TC-BUC10.5 | Performance-Test: Große Dokumentenmengen | Auftrag mit 50+ Dokumenten (insgesamt >100MB) | 1. Auftrag mit großer Dokumentenmenge anlegen<br>2. Dokumentenbeschaffung starten<br>3. Zeit messen<br>4. Cache-Effizienz prüfen | Alle Dokumente innerhalb 30 Sekunden bereitgestellt, Cache effizient genutzt, keine Speicherlecks | Hoch |
| | | TC-BUC10.6 | Fehlerbehandlung: Teilweise fehlgeschlagene Beschaffung | 5 Dokumente, 2 davon beschädigt/nicht verfügbar | 1. Dokumentenbeschaffung mit teilweisen Fehlern<br>2. Verfügbare Dokumente prüfen<br>3. Fehlerprotokoll einsehen | Verfügbare Dokumente erfolgreich gecacht, fehlgeschlagene Dokumente protokolliert, Gutachter erhält Hinweis auf fehlende Dokumente | Mittel |
| | | TC-BUC10.7 | Sicherheitstest: Zugriffsberechtigung Dokumente | Gutachter A versucht auf Dokumente von Auftrag des Gutachter B zuzugreifen | 1. Direkter URL-Zugriff auf fremde Dokumente<br>2. API-Anfrage für fremde Dokumente | Zugriff verweigert, Security-Log Eintrag, keine Dokumenteninhalte preisgegeben | Hoch |
| **BUC-12a** | **Gutachter ändert Auftragsstatus (US-AM.04, US-BN.02)** | | | | | | |
| BUC-12a.01 | Statusänderung durch Gutachter mit Synchronisation | TC-BUC12a.1 | Positiver Test: Status "in Bearbeitung" setzen | Gutachter eingeloggt, Auftrag mit Status "neu" vorhanden | 1. Gutachter öffnet Auftragsübersicht<br>2. Auftrag auswählen<br>3. Status auf "in Bearbeitung" ändern<br>4. Synchronisation zu rvSMD beobachten | Status in rvGutachten geändert, Synchronisation zu rvSMD erfolgreich, Audit-Log erstellt, Statusänderung in beiden Systemen konsistent | Hoch |
| | | TC-BUC12a.2 | Positiver Test: Auftrag abschließen | Gutachter mit Auftrag "in Bearbeitung" | 1. Auftrag auf "abgeschlossen" setzen<br>2. Bestätigung abwarten<br>3. Status in beiden Systemen prüfen | Auftrag abgeschlossen, rvSMD synchronisiert, E-Mail-Benachrichtigung versendet (BUC-06), Audit-Trail vollständig | Hoch |
| | | TC-BUC12a.3 | Negativer Test: Ungültiger Statusübergang | Auftrag bereits abgeschlossen | 1. Versuch, abgeschlossenen Auftrag auf "neu" zu setzen | Fehlermeldung "Ungültiger Statusübergang", Status bleibt unverändert, keine Synchronisation | Mittel |
| | | TC-BUC12a.4 | Fehlerbehandlung: rvSMD Synchronisationsfehler | rvSMD temporär nicht erreichbar | 1. Status in rvGutachten ändern<br>2. rvSMD-Verbindung unterbrochen<br>3. Fehlerbehandlung beobachten | Statusänderung lokal gespeichert, Retry-Queue aktiv, Support benachrichtigt, Synchronisation bei Wiederherstellung | Hoch |
| | | TC-BUC12a.5 | Sicherheitstest: Unbefugte Statusänderung | Gutachter A versucht Status von Auftrag des Gutachter B zu ändern | 1. Direkter API-Call oder URL-Manipulation | Zugriff verweigert, keine Statusänderung, Security-Log Eintrag | Hoch |
| | | TC-BUC12a.6 | Edge-Case: Parallele Statusänderungen | Gutachter ändert Status in rvGutachten, zeitgleich 8023-Mitarbeiter in rvSMD | 1. Beide Änderungen simultan durchführen<br>2. Konfliktauflösung beobachten | Last-Write-Wins oder Konfliktmeldung, Konsistenz gewahrt, beide Änderungen protokolliert | Mittel |
| **BUC-13** | **Auftragsstornierung (US-AM.06, US-BN.02)** | | | | | | |
| BUC-13.01 | Auftragsstornierung durch DRV-Mitarbeiter | TC-BUC13.1 | Positiver Test: Vollständiger Stornierungsprozess | Aktiver Auftrag in rvSMD und rvGutachten vorhanden | 1. 8023-Mitarbeiter storniert Auftrag in rvSMD<br>2. rvSMD stößt Synchronisation an<br>3. rvGutachten empfängt Statusänderung<br>4. Status wird auf "storniert" gesetzt<br>5. Auftragsdokumente werden gelöscht (BUC-09)<br>6. E-Mail-Benachrichtigung wird versendet (BUC-06) | Auftragsstatus "storniert", Dokumente gelöscht, relevante Parteien benachrichtigt, Audit-Log erstellt | Hoch |
| | | TC-BUC13.2 | Positiver Test: Gutachter-Benachrichtigung bei Stornierung | Gutachter hat Auftrag in Bearbeitung | 1. Auftrag wird in rvSMD storniert<br>2. Synchronisation erfolgt<br>3. E-Mail-Benachrichtigung an Gutachter prüfen | Gutachter erhält E-Mail mit Stornierungsgrund, Auftrag in Übersicht als "storniert" markiert | Hoch |
| | | TC-BUC13.3 | Negativer Test: Ungültiger Statusübergang | Bereits stornierter Auftrag | 1. Versuch, bereits stornierten Auftrag erneut zu stornieren | Fehlermeldung in rvSMD: "Ungültiger Statusübergang", keine Synchronisation | Mittel |
| | | TC-BUC13.4 | Fehlerbehandlung: Synchronisationsfehler | rvGutachten temporär nicht erreichbar | 1. Auftrag in rvSMD stornieren<br>2. rvGutachten-Verbindung unterbrechen<br>3. Fehlerprotokoll prüfen | Fehler geloggt, Support-Benachrichtigung versendet, Retry-Mechanismus aktiv | Hoch |
| | | TC-BUC13.5 | Sicherheitstest: Dokumentenlöschung verifizieren | Stornierter Auftrag mit mehreren Dokumenten | 1. Auftrag stornieren<br>2. Dokumentenlöschung überwachen<br>3. Datenbank und Cache prüfen | Alle Dokumente vollständig gelöscht, keine Reste in DB oder Cache, Cache invalidiert | Hoch |
| | | TC-BUC13.6 | Edge-Case: Stornierung während Gutachter-Bearbeitung | Gutachter hat Auftragsdetails geöffnet | 1. Auftrag wird parallel storniert<br>2. Gutachter versucht, Änderungen zu speichern | Gutachter erhält Hinweis "Auftrag wurde storniert", Änderungen werden nicht gespeichert, automatische Weiterleitung | Mittel |

---

## � Sprint 3 - Mittlere Priorität Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **BUC-06** | **E-Mail-Benachrichtigungssystem (US-BN.01, US-BN.02, US-BN.04, US-BN.05)** | | | | | | |
| BUC-06.01 | Automatische E-Mail-Benachrichtigungen verwalten | TC-BUC06.1 | Positiver Test: Benachrichtigung bei neuem Auftrag | E-Mail-System verfügbar, Gutachter registriert | 1. Neuen Auftrag zuweisen<br>2. E-Mail-Versand überwachen<br>3. E-Mail-Inhalt prüfen<br>4. Platzhalter-Ersetzung validieren | E-Mail mit korrekten Daten versendet, Platzhalter {{gutachter_name}} ersetzt | Hoch |
| | | TC-BUC06.2 | Positiver Test: Statusänderungs-Benachrichtigung | Auftrag mit Status "neu" vorhanden | 1. Auftragsstatus ändern auf "in Bearbeitung"<br>2. E-Mail-Benachrichtigung an DRV-Mitarbeiter prüfen | Statusänderungs-E-Mail versendet, korrekte Auftragsinformationen enthalten | Mittel |
| | | TC-BUC06.3 | Positiver Test: Wartungsbenachrichtigung | Geplante System-Wartung konfiguriert | 1. Wartungs-E-Mail 24h vorher senden<br>2. Alle registrierten Benutzer prüfen<br>3. E-Mail-Inhalt validieren | Alle Benutzer benachrichtigt, Wartungszeiten korrekt kommuniziert | Mittel |
| | | TC-BUC06.4 | Konfigurationstest: E-Mail-Template anpassen | DRV-Mitarbeiter mit Template-Rechten | 1. Admin-Panel öffnen<br>2. E-Mail-Template bearbeiten<br>3. Platzhalter {{proband_name}} hinzufügen<br>4. Template speichern und testen | Template-Änderungen wirksam, neue Platzhalter funktionieren | Niedrig |
| | | TC-BUC06.5 | Negativer Test: E-Mail-Versand Fehlerbehandlung | SMTP-Server temporär nicht verfügbar | 1. E-Mail-auslösendes Ereignis (neuer Auftrag)<br>2. SMTP-Fehler simulieren | Retry-Mechanismus aktiv, Fehlgeschlagene E-Mails in Queue, Admin benachrichtigt | Mittel |
| | | TC-BUC06.6 | Benutzerfreundlichkeitstest: Opt-out Funktionalität | Gutachter möchte weniger E-Mails | 1. Profil-Einstellungen öffnen<br>2. "Statusänderungs-E-Mails" deaktivieren<br>3. Auftragsstatus ändern | Keine E-Mail versendet für deaktivierte Kategorie, kritische E-Mails weiterhin aktiv | Niedrig |
| **BUC-09** | **Datenaufbewahrung und Löschung DSGVO (US-LA.01, US-LA.02, US-LA.03, US-AM.07)** | | | | | | |
| BUC-09.01 | Automatische Datenaufbewahrung und -löschung | TC-BUC09.1 | Positiver Test: Automatische Löschung abgeschlossener Aufträge | Auftrag seit 90 Tagen abgeschlossen | 1. Lösch-Job ausführen<br>2. Benachrichtigung 7 Tage vorher prüfen<br>3. Löschvorgang überwachen<br>4. Datenbank-Status validieren | Gutachter 7 Tage vorher benachrichtigt, Auftrag nach 90 Tagen gelöscht, Löschung dokumentiert | Hoch |
| | | TC-BUC09.2 | Positiver Test: Stornierte Aufträge sofort löschen | Auftrag wurde storniert | 1. Auftrag stornieren<br>2. Dokumente-Löschung prüfen<br>3. Auftragsinfo-Aufbewahrung (30 Tage) validieren | Dokumente sofort gelöscht, Auftragsinformationen 30 Tage aufbewahrt | Hoch |
| | | TC-BUC09.3 | Konfigurationstest: Aufbewahrungszeiten anpassen | Administrator-Rechte | 1. Admin-Panel öffnen<br>2. Aufbewahrungszeit für "abgeschlossen" auf 120 Tage ändern<br>3. Konfiguration speichern<br>4. Lösch-Job erneut ausführen | Neue Aufbewahrungszeiten wirksam, entsprechende Aufträge nicht gelöscht | Mittel |
| | | TC-BUC09.4 | Edge-Case: Löschung bei laufendem Verfahren | Auftrag mit rechtlichem Verfahren | 1. Ausnahmeregel für Auftrag setzen<br>2. Automatische Löschung ausführen<br>3. Status prüfen | Auftrag trotz Ablaufzeit nicht gelöscht, Ausnahme dokumentiert | Mittel |
| | | TC-BUC09.5 | Sicherheitstest: Sichere Löschung validieren | Gelöschte Aufträge vorhanden | 1. Datenbank-Forensik durchführen<br>2. Wiederherstellungsversuche<br>3. Backup-Systeme prüfen | Daten nicht wiederherstellbar, sichere Löschung bestätigt | Hoch |
| | | TC-BUC09.6 | Compliance-Test: Audit-Trail für Löschungen | Mehrere Löschvorgänge durchgeführt | 1. Audit-Log öffnen<br>2. Löschvorgänge der letzten 30 Tage anzeigen<br>3. Vollständigkeit prüfen | Alle Löschungen dokumentiert, Zeitstempel, Benutzer, Grund erfasst | Mittel |

---

## � Sprint 3+ - Niedrige Priorität Use Cases Abnahmetests

| Anforderung ID | Anforderungsbeschreibung | Testfall-ID | Testfall-Beschreibung | Voraussetzungen | Testschritte | Erwartetes Ergebnis | Priorität |
|---------------|--------------------------|-------------|-----------------------|-----------------|--------------|---------------------|-----------|
| **BUC-07** | **Support-Dashboard und Überwachung (US-SL.01, US-SL.02, US-SL.03, US-SL.04)** | | | | | | |
| BUC-07.01 | DRV-Support Dashboard und Systemüberwachung | TC-BUC07.1 | Positiver Test: Support-Dashboard Vollansicht | DRV-Support-Mitarbeiter angemeldet | 1. Support-Dashboard öffnen<br>2. System-Gesundheit prüfen<br>3. Performance-Metriken anzeigen<br>4. Aktive Sessions überwachen | Dashboard zeigt alle relevanten Metriken, Response-Zeiten < 2 Sek, Echtzeit-Updates | Mittel |
| | | TC-BUC07.2 | Positiver Test: Benutzer-Impersonation für Support | Gutachter mit Problem identifiziert | 1. Benutzer in Dashboard suchen<br>2. "Als Benutzer anzeigen" aktivieren<br>3. Problem reproduzieren<br>4. Impersonation beenden | Erfolgreiche Impersonation, Problem reproduziert, Audit-Trail erstellt | Mittel |
| | | TC-BUC07.3 | Administrationstest: Bulk-Operation durchführen | Mehrere blockierte Accounts | 1. Blockierte Accounts filtern<br>2. Alle auswählen<br>3. Bulk-Entsperrung durchführen<br>4. Ergebnis validieren | Alle ausgewählten Accounts entsperrt, Batch-Operation dokumentiert | Niedrig |
| **BUC-08** | **Erweiterte Gutachtermitarbeiter-Verwaltung (US-RL.02, US-RL.03, US-RL.09, US-RL.10)** | | | | | | |
| BUC-08.01 | Gutachtermitarbeiter-Registrierung und -Verwaltung | TC-BUC08.1 | Positiver Test: Mitarbeiter-Anmeldung durch Gutachter | Max Mustermann als Gutachter eingeloggt | 1. Mitarbeiter-Verwaltung öffnen<br>2. "Neuer Mitarbeiter" klicken<br>3. Anna Schmidt als Mitarbeiterin anmelden<br>4. DRV-Genehmigung simulieren<br>5. Mitarbeiter-Aktivierung abschließen | Mitarbeiterin kann im Namen des Gutachters arbeiten, alle Aktivitäten zugeordnet | Niedrig |
| | | TC-BUC08.2 | Verwaltungstest: Mitarbeiter-Berechtigungen konfigurieren | Mitarbeiter bereits registriert | 1. Mitarbeiter-Einstellungen öffnen<br>2. Berechtigung "Aufträge einsehen" aktivieren<br>3. Berechtigung "Status ändern" deaktivieren<br>4. Mitarbeiter-Account testen | Berechtigungen korrekt angewendet, eingeschränkte Funktionen nicht verfügbar | Niedrig |
| | | TC-BUC08.3 | Edge-Case: Gutachter-Deaktivierung Auswirkung | Gutachter mit mehreren Mitarbeitern | 1. Gutachter-Account deaktivieren<br>2. Mitarbeiter-Accounts prüfen<br>3. Zugriff testen | Alle Mitarbeiter automatisch deaktiviert, keine Systemzugriffe möglich | Niedrig |
| **BUC-11** | **Statusänderungen Gutachter (US-RL.09, US-RL.10)** | | | | | | |
| BUC-11.01 | Gutachter-Status durch DRV-Mitarbeiter ändern | TC-BUC11.1 | Positiver Test: Gutachter aktivieren | Neuer Gutachter mit Status "pending" in rvSMD | 1. 8023-Mitarbeiter öffnet Gutachter-Verwaltung in rvSMD<br>2. Gutachter auswählen<br>3. Status auf "aktiv" setzen<br>4. Synchronisation zu rvGutachten beobachten<br>5. Gutachter-Login testen | Status in beiden Systemen "aktiv", Gutachter kann sich anmelden, E-Mail-Benachrichtigung versendet, Audit-Log erstellt | Hoch |
| | | TC-BUC11.2 | Positiver Test: Gutachter sperren | Aktiver Gutachter in beiden Systemen | 1. Status auf "gesperrt" setzen<br>2. Synchronisation abwarten<br>3. Login-Versuch des Gutachters | Status synchronisiert, Login blockiert mit Meldung "Account gesperrt", Kontaktinformationen angezeigt | Hoch |
| | | TC-BUC11.3 | Positiver Test: Gesperrten Gutachter reaktivieren | Gesperrter Gutachter vorhanden | 1. Status von "gesperrt" auf "aktiv" ändern<br>2. Synchronisation prüfen<br>3. Login-Funktionalität testen | Reaktivierung erfolgreich, Login wieder möglich, Benachrichtigung versendet | Mittel |
| | | TC-BUC11.4 | Negativer Test: Ungültiger Statusübergang | Gutachter mit Status "gelöscht" | 1. Versuch, gelöschten Gutachter zu aktivieren | Fehlermeldung in rvSMD "Ungültiger Statusübergang", keine Änderung, keine Synchronisation | Mittel |
| | | TC-BUC11.5 | Fehlerbehandlung: Synchronisationsfehler | rvGutachten temporär offline | 1. Statusänderung in rvSMD durchführen<br>2. Synchronisation fehlschlägt<br>3. Fehlerbehandlung prüfen | Statusänderung in rvSMD gespeichert, Retry-Mechanismus aktiv, Support benachrichtigt, Synchronisation nach Wiederherstellung | Hoch |
| | | TC-BUC11.6 | Edge-Case: Gutachter mit aktiven Aufträgen sperren | Gutachter hat 5 Aufträge "in Bearbeitung" | 1. Gutachter sperren<br>2. Auswirkungen auf Aufträge prüfen<br>3. Zugriff auf Aufträge testen | Gutachter gesperrt, bestehende Aufträge bleiben zugewiesen aber nicht bearbeitbar, DRV erhält Hinweis auf offene Aufträge | Mittel |
| | | TC-BUC11.7 | Sicherheitstest: Unbefugte Statusänderung | Benutzer ohne 8023-Berechtigung | 1. Versuch, Gutachter-Status zu ändern | Zugriff verweigert in rvSMD, keine Änderung, Security-Log Eintrag | Hoch |allkatalog)

**Dokument Version:** 1.3  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** Fachliche Abnahmetest-Spezifikation (Tabellenformat)  
**Erstellt:** 29. September 2025  
**Aktualisiert:** 18. November 2025  
**Product Owner:** Sarah  
**Basierend auf:** Use Cases MVP Development (use-cases-mvp-development.md)  
**Format:** Strukturierter Testfallkatalog nach example_testfallkatalog.md

---

## Dokumentzweck

Dieses Dokument definiert die fachlichen Abnahmetests für das QARvGut MVP in strukturierter Tabellenform. Die Tests validieren die Geschäftslogik und Benutzeranforderungen basierend auf allen Business Use Cases (BUC-01 bis BUC-13, ohne BUC-12b) und stellen sicher, dass die implementierten Features den definierten Anforderungen entsprechen.

## Änderungshistorie

**Version 1.3 (18. November 2025):**
- 🔄 Umbenennung: UC- → BUC- (Business Use Case) für alle Use Case Referenzen
- 📝 Konsistente Terminologie: Alle Testfall-IDs jetzt mit TC-BUC Präfix

**Version 1.2 (17. November 2025):**
- ✅ Hinzugefügt: BUC-10 (Automatische Dokumentenbereitstellung) - 7 Testfälle
- ✅ Hinzugefügt: BUC-11 (Statusänderungen Gutachter) - 7 Testfälle  
- ✅ Hinzugefügt: BUC-12a (Gutachter ändert Auftragsstatus) - 6 Testfälle
- ✅ Entfernt: BUC-12b (konsolidiert in BUC-13)
- 📊 Gesamt: 20 neue Testfälle hinzugefügt

## Beziehung zu bestehenden Dokumenten

- **Basis:** `docs/use-cases-mvp-development.md` (BUC-01, BUC-02, BUC-03)
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
| E2E-01.01 | End-to-End Workflow: Registrierung bis Arbeitsbereitschaft | TC-E2E01.1 | Positiver Test: Gesamter Workflow von Registrierung bis erste Anmeldung | Alle Systeme (eLogin, rvSMD, E-Mail) verfügbar, DRV-Mitarbeiter verfügbar | 1. Gutachter registriert sich (TC-BUC01.1)<br>2. DRV-Mitarbeiter genehmigt (TC-BUC03.2)<br>3. Gutachter aktiviert Account<br>4. Gutachter meldet sich erstmalig an (TC-BUC02.1)<br>5. Auftragsübersicht wird angezeigt | Kompletter Workflow läuft ohne manuelle Eingriffe, Gutachter ist arbeitsbereit | Hoch |
| **E2E-02** | **DRV-Support-Workflow Komplettvalidierung** | | | | | | |
| E2E-02.01 | Support-Mitarbeiter kompletter Arbeitszyklus | TC-E2E02.1 | Positiver Test: DRV-Mitarbeiter kann alle Support-Aufgaben durchführen | TestAdmin hat gültige Berechtigung | 1. DRV-Mitarbeiter erhält Support-Zugang (TC-BUC03.1)<br>2. Neue Gutachter-Registrierung wird bearbeitet (TC-BUC03.2)<br>3. Auftragszuweisungen werden überwacht (TC-BUC03.3)<br>4. Support-Aufgaben werden erfüllt | Support-Workflows sind effizient, alle Admin-Funktionen arbeiten korrekt | Hoch |
| **E2E-03** | **Kompletter Auftragsbearbeitungs-Workflow Sprint 2** | | | | | | |
| E2E-03.01 | Gutachter Arbeitsalltag: Auftragsübersicht bis Dokumentbearbeitung | TC-E2E03.1 | Positiver Test: Vollständiger Tagesworkflow eines Gutachters | Max Mustermann eingeloggt, mehrere neue Aufträge zugewiesen | 1. Anmeldung (TC-BUC02.1)<br>2. Auftragsübersicht einsehen (TC-BUC04.1)<br>3. Neuen Auftrag auswählen und öffnen (TC-BUC05.1)<br>4. Dokumente einsehen und Notizen erstellen (TC-BUC05.3)<br>5. Auftragsstatus auf "in Bearbeitung" setzen (TC-BUC04.2)<br>6. E-Mail-Benachrichtigung erhalten (TC-BUC06.2) | Kompletter Arbeitsablauf reibungslos, alle Funktionen integriert, Performance akzeptabel | Hoch |
| **E2E-04** | **DSGVO-Compliance End-to-End Sprint 3** | | | | | | |
| E2E-04.01 | Vollständiger Datenlebenszyklus mit automatischer Löschung | TC-E2E04.1 | Positiver Test: Auftrag von Erstellung bis automatischer Löschung | Auftrag über gesamten Lifecycle verfolgen | 1. Neuer Auftrag wird zugewiesen<br>2. Gutachter bearbeitet Auftrag (TC-BUC04.2)<br>3. Auftrag wird abgeschlossen<br>4. 83 Tage warten (7 Tage vor Löschung)<br>5. Löschbenachrichtigung prüfen (TC-BUC09.1)<br>6. Automatische Löschung nach 90 Tagen<br>7. DSGVO-Compliance validieren | Kompletter Datenlebenszyklus DSGVO-konform, Benachrichtigungen funktionieren, sichere Löschung | Mittel |
| **E2E-05** | **Multi-User Support-Szenario Sprint 3+** | | | | | | |
| E2E-05.01 | Gutachter mit Mitarbeitern: Komplette Praxisabbildung | TC-E2E05.1 | Positiver Test: Große Gutachterpraxis mit mehreren Mitarbeitern | Gutachter Dr. Müller mit 3 Mitarbeitern | 1. Gutachter meldet Mitarbeiter an (TC-BUC08.1)<br>2. DRV genehmigt alle Mitarbeiter<br>3. Mitarbeiter erhalten verschiedene Berechtigungen (TC-BUC08.2)<br>4. Aufträge werden auf Team verteilt<br>5. Parallel-Bearbeitung verschiedener Aufträge<br>6. Support überwacht alle Aktivitäten (TC-BUC07.1) | Mehrbenutzer-Umgebung stabil, Berechtigungen korrekt, Audit-Trail vollständig | Niedrig |

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
| **Smoke Tests** | TC-BUC01.1, TC-BUC02.1, TC-BUC03.1, TC-BUC04.1, TC-BUC05.1 | Bei jedem Build | Hoch |
| **Regression Tests** | Alle TC-BUC01-BUC09 | Vor Release | Mittel |
| **End-to-End Tests** | TC-E2E01-E2E05 | Wöchentlich | Niedrig |
| **Performance Tests** | TC-BUC04.*, TC-BUC06.*, TC-BUC07.* | Bei größeren Änderungen | Mittel |
| **Security Tests** | TC-BUC02.3, TC-BUC05.5, TC-BUC09.5 | Vor jedem Release | Niedrig |
| **DSGVO-Compliance Tests** | TC-BUC09.* | Monatlich | Niedrig |
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
**Letzte Aktualisierung:** 18. November 2025 - Alle MVP Business Use Cases vollständig (BUC-01 bis BUC-13)  
**Status:** ✅ Vollständig - Alle Business Use Cases haben Abnahmetests, bereit für Implementierung

**Testabdeckung:**
- Sprint 1: 3 Use Cases, 13 Testfälle
- Sprint 2: 5 Use Cases, 43 Testfälle (inkl. BUC-10, BUC-12a, BUC-13)
- Sprint 3: 3 Use Cases, 23 Testfälle (inkl. BUC-11)
- Sprint 3+: 2 Use Cases, 6 Testfälle
- E2E: 5 Workflows
- **Gesamt: 13 Use Cases, 85+ Testfälle**  

---

**Verwendung:**
1. Tests vor Produktiv-Deployment durchführen
2. Bei kritischen Änderungen Regression-Tests laufen lassen  
3. Regelmäßige Smoke-Tests in Produktions-ähnlicher Umgebung
4. Dokumentation für Audit- und Compliance-Zwecke
