# QARvGut MVP - Business Use Cases

**Dokument Version:** 2.1  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** Business Use Case Spezifikation  
**Erstellt:** 29. September 2025  
**Aktualisiert:** 18. November 2025  
**Product Owner:** Sarah

**Änderungshistorie v2.1:**
- 🔄 Umbenennung: UC- → BUC- (Business Use Case) für alle Use Case IDs
- ✅ Entfernt: BUC-12b (konsolidiert in BUC-13)  

**Hinweis:** Dieses Dokument beschreibt Geschäftsprozesse aus Anwendersicht. Technische Implementierungsdetails finden sich in separaten System Design Dokumenten.  
### BUC-01: Gutachter-Onboarding-Prozess

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-01 |
| **Name** | Gutachter-Registrierung und -Aktivierung |
| **Akteur** | **Primär:** Neuer Gutachter<br>**Sekundär:** DRV-Mitarbeiter, eLogin (Identitätsverwaltung), rvSMD (Stammdatenverwaltung) |
| **Bemerkung** | Geschäftsregel: Nur Gutachter mit gültiger Zulassung können registriert werden. Freischaltung erfordert DRV-Mitarbeiter-Genehmigung. E-Mail-Adresse muss eindeutig sein. |
| **Auslöser** | Gutachter möchte Zugang zu rvGutachten |
| **Hauptablauf** | 1. Gutachter ruft Registrierungsseite auf<br>2. Gutachter füllt Registrierungsformular aus (Name, E-Mail, EFN)<br>3. System validiert Eingaben gegen eLogin/rvSMD<br>4. System erstellt Benutzer-Account mit Status "pending"<br>5. System benachrichtigt DRV-Mitarbeiter über neue Registrierung<br>6. DRV-Mitarbeiter prüft Gutachter-Berechtigung in internen Systemen<br>7. DRV-Mitarbeiter genehmigt Registrierung im System<br>8. System generiert und sendet Aktivierungscode per E-Mail<br>9. Gutachter gibt Aktivierungscode ein<br>10. System aktiviert Account und gewährt vollen Zugang |
| **Ausnahmeablauf** | **A1:** Ungültige E-Mail → Fehlermeldung, Eingabe wiederholen<br>**A2:** Gutachter bereits registriert → Hinweis auf bestehenden Account<br>**A3:** eLogin/rvSMD nicht erreichbar → Registrierung temporär gesperrt<br>**A4:** DRV-Mitarbeiter lehnt ab → Account wird deaktiviert, Gutachter informiert<br>**A5:** Aktivierungscode falsch → Erneute Eingabe erlauben (3 Versuche) |
| **Anfangsbedingung** | - Gutachter hat gültige Zulassung für Begutachtung<br>- eLogin-System ist verfügbar<br>- rvSMD-System ist verfügbar<br>- DRV-Mitarbeiter für Freischaltung verfügbar |
| **Abschlussbedingung** | - Gutachter-Account ist aktiv und einsatzbereit<br>- Gutachter kann sich anmelden und Aufträge einsehen<br>- Für jeden Auftrag sind alle relevanten Dokumente gemäß BUC-10 automatisch im System verfügbar<br>- Registrierungsvorgang ist dokumentiert |
| **Erweiterte Verwaltung** | - |
| **zugehörige User Stories** | US-RL.01, US-RL.04, US-RL.05 |
| **Priorität** | Kritisch - Blocker für alle anderen Features |  

---

### BUC-02: System-Authentifizierung

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-02 |
| **Name** | Benutzer-Anmeldung am System |
| **Akteur** | **Primär:** Registrierter Benutzer (Gutachter/Mitarbeiter) |
| **Bemerkung** | Sicherheitsanforderungen: Sichere Passwortverwaltung, Schutz vor unbefugten Zugriffsversuchen, sichere Datenübertragung, zeitlich begrenzte Anmeldung<br>**Status:** ⚠️ In Prüfung - Signaturkarte wird evaluiert |
| **Auslöser** | Benutzer möchte auf rvGutachten zugreifen |
| **Hauptablauf** | 1. Benutzer navigiert zur Login-Seite<br>2. Benutzer gibt E-Mail-Adresse ein<br>3. Benutzer gibt Passwort ein<br>4. System validiert Anmeldedaten<br>5. System prüft Account-Status (aktiv/gesperrt)<br>6. System meldet Benutzer an<br>7. System leitet zur Auftragsübersicht weiter |
| **Ausnahmeablauf** | **A1:** Falsche E-Mail/Passwort → Fehlermeldung, erneute Eingabe<br>**A2:** Account gesperrt → Informative Meldung, Kontakt-Information<br>**A3:** Zu viele Fehlversuche → Account temporär sperren (30 Min)<br>**A4:** Session-Timeout → Automatische Weiterleitung zur Login-Seite<br>**A5:** "Angemeldet bleiben" → Extended Session (7 Tage) |
| **Anfangsbedingung** | - Benutzer hat aktivierten Account<br>- System ist verfügbar<br>- Browser unterstützt erforderliche Standards |
| **Abschlussbedingung** | - Benutzer ist authentifiziert und autorisiert<br>- Anmeldung ist aktiv<br>- Navigation zu geschützten Bereichen möglich |
| **Erweiterte Verwaltung** | **E1:** Passwort vergessen → E-Mail mit Reset-Link senden<br>**E2:** Erster Login → Passwort-Änderung erzwingen<br>**E3:** Verdächtige Anmeldung → Zusätzliche Verifikation |
| **zugehörige User Stories** | US-RL.07, US-RL.08 |
| **Priorität** | Kritisch - Grundlage für alle authentifizierten Features |  

---

### BUC-03: DRV-Mitarbeiter-Zugriffsverwaltung

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-03 |
| **Name** | DRV-Mitarbeiter-Registrierung und Support-Zugang |
| **Akteur** | **Primär:** DRV-Mitarbeiter<br>**Sekundär:** rvGutachtenAdmin, eLogin (Identitätsverwaltung) |
| **Bemerkung** | - |
| **Auslöser** | DRV-Mitarbeiter benötigt Zugang für Support-Tätigkeiten |
| **Hauptablauf** | 1. DRV-Mitarbeiter beantragt Zugang über rvGutachtenAdmin<br>2. System validiert Mitarbeiter-Status über eLogin<br>3. System prüft erforderliche Berechtigungsstufe<br>4. Admin genehmigt Support-Zugang<br>5. System erstellt DRV-Mitarbeiter-Account mit erweiterten Rechten<br>6. System gewährt Zugriff auf Support-Funktionen |
| **Ausnahmeablauf** | - |
| **Anfangsbedingung** | - Mitarbeiter hat gültige DRV-Berechtigung<br>- rvGutachtenAdmin-System verfügbar<br>- eLogin-Integration funktional |
| **Abschlussbedingung** | - DRV-Mitarbeiter kann Support-Funktionen ausführen<br>- Audit-Trail für alle administrativen Aktionen aktiv |
| **Erweiterte Verwaltung** | - Auftragszuweisungen einsehen<br>- Dokumenten-Übersicht verwalten<br>- Gutachter-Registrierungen verwalten<br>- System-Konfiguration (je nach Rolle) |
| **zugehörige User Stories** | US-RL.06 |
| **Priorität** | Kritisch - Notwendig für Betrieb und Support |  

---

## 🟡 Hohe Priorität Use Cases (Sprint 2)

### BUC-04: Auftragsübersicht und -verwaltung

| ID | BUC-04 |
| :---- | :---- |
| **Name** | Auftragsübersicht anzeigen und verwalten |
| **Akteur** | primärer Akteur: Gutachter/Gutachtermitarbeiter sekundär: rvGutachten-System |
| **Bemerkung** | keine |
| **Auslöser** | Gutachter/Gutachtermitarbeiter möchte zugewiesene Aufträge einsehen und verwalten |
| **Hauptablauf** | Gutachter/Gutachtermitarbeiter navigiert zur Auftragsübersicht
System lädt alle dem Gutachter zugewiesenen Aufträge 
System zeigt tabellarische Übersicht mit: Auftragsdatum, VSNR, Proband, Status 
Gutachter/Gutachtermitarbeiter kann Aufträge nach verschiedenen Kriterien sortieren 
Gutachter/Gutachtermitarbeiter kann Aufträge nach Status filtern 
Gutachter/Gutachtermitarbeiter kann über Suchfunktion spezifische Aufträge 
finden System aktualisiert Daten in Echtzeit |
| **Ausnahmeablauf** | **A1:** Keine Aufträge vorhanden → Informative Meldung mit Hilfetext 
**A2:** System-Timeout → Automatisches Neuladen der Daten 
**A3:** Netzwerkfehler → Offline-Indikator mit Retry-Option 
**A4**: Suche liefert keine Treffer → Hinweistext, dass es keine Treffer gibt 
**A5**: Statusfilterung liefert keine Treffer → Hinweistext, dass es keine Treffer gibt |
| **Anfangsbedingung** | Gutachter/Gutachtermitarbeiter ist registriert 
Gutachter/Gutachtermitarbeiter ist authentifiziert 
Gutachter/Gutachtermitarbeiter ist autorisiert 
Aufträge sind dem Gutachter zugewiesen System ist verfügbar |
| **Abschlussbedingung** | Gutachter/Gutachtermitarbeiter hat vollständigen Überblick über seine Aufträge 
Aktuelle Daten sind geladen und angezeigt Filterungen und Sortierungen bleiben aktiv |
| **Performance-Anforderungen** | Ladezeit \< 3 Sekunden für bis zu 500 Aufträge 
Such-Response \< 1 Sekunde Auto-Refresh alle 5 Minuten |
| **zugehörige User Stories** | US-AM.01, US-AM.04, US-AM.06, US-AM.08 |
| **Priorität** | Hoch \- Kernfunktionalität für täglichen Betrieb |

## **BUC-05: Auftragsdetails und Dokumenteneinsicht** {#uc-05:-auftragsdetails-und-dokumenteneinsicht}

| ID | BUC-05 |
| :---- | :---- |
| **Name** | Auftragsdetails einsehen und Dokumente verwalten |
| **Akteur** | primärer Akteur: Gutachter/Gutachtermitarbeiter sekundär: rvGutachten-System   |
| **Bemerkung** | keine |
| **Auslöser** | Gutachter/Gutachtermitarbeiter möchte Details zu einem spezifischen Auftrag einsehen |
| **Hauptablauf** | Gutachter/Gutachtermitarbeiter klickt auf Auftrag in der Übersicht 
System öffnet Auftragsdetail-Ansicht System zeigt erweiterte Auftragsinformationen (VSNR, Proband, Geburtsdatum, etc.) 
System lädt alle zugeordneten Dokumente 
Gutachter/Gutachtermitarbeiter kann über Suchfunktion spezifische Dokumente finden 
System aktualisiert Daten in Echtzeit 
Gutachter/Gutachtermitarbeiter kann den Status des Auftrags ändern (siehe UC-12) 
Gutachter/Gutachtermitarbeiter kann Dokumente einzeln öffnen und einsehen 
Gutachter/Gutachtermitarbeiter kann druckbare Dokumente ausdrucken 
Gutachter/Gutachtermitarbeiter kann Notizen zu einzelnen Dokumenten erstellen |
| **Ausnahmeablauf** | **A1:** Dokument nicht verfügbar → Fehlermeldung mit Kontaktmöglichkeit 
**A2:** Auftrag storniert → Eingeschränkte Funktionalität, keine neuen Aktionen 
**A3:** Berechtigung entzogen → Weiterleitung zur Übersicht mit Hinweis 
**A4**: Suche liefert keine Treffer → Hinweistext, dass es keine Treffer gibt |
| **Anfangsbedingung** | Gutachter/Gutachtermitarbeiter ist registriert 
Gutachter/Gutachtermitarbeiter ist authentifiziert 
Gutachter/Gutachtermitarbeiter ist autorisiert 
Auftrag ist dem Gutachter zugewiesen 
Auftrag ist nicht gelöscht Auftrag ist nicht storniert |
| **Abschlussbedingung** | Benutzer hat vollständige Auftragsinformationen erhalten 
Alle dem Auftrag zugeordneten Dokumente sind zugänglich 
Notizen zu einem Dokument sind gespeichert 
Navigation zurück zur Übersicht ist möglich |
| **Systemanforderungen** | **D1:** PDF-Viewer für direkte Anzeige 
**D2:** Druckfunktion mit Formaterhaltung 
**D3:** Notizen pro Dokument (US-NF.01) |
| **zugehörige User Stories** | US-AM.02, US-AM.03, US-AM.05, US-NF.01 |
| **Priorität** | Hoch \- Essentiell für Auftragsbearbeitung |

## **BUC-13: Auftragsstornierung** {#uc-13:-auftragsstornierung}

| ID | BUC-13 |
| :---- | :---- |
| **Name** | Auftragsstornierung |
| **Akteur** | 8023-Mitarbeiter (in rvSMD)
sekundär: rvSMD-System, rvGutachten-System   |
| **Bemerkung** |  keine |
| **Auslöser** | 8023-Mitarbeiter storniert Gutachtenauftrag wird in rvSMD |
| **Hauptablauf** | 1\. rvSMD stößt Synchronisation nach rvGutachten an
2\. rvGutachten übernimmt Statusänderung automatisch und setzt den Auftragsstatus auf "storniert"
3\. rvGutachten löscht Auftragsdokumente (includes UC-09)
4\. System informiert relevante Parteien (z.B. per E-Mail) (includes UC-06) |
| **Ausnahmeablauf** | A1: Ungültiger Statusübergang in rvSMD → Fehlermeldung
A2: Synchronisationsfehler → Logging, Support-Benachrichtigung |
| **Anfangsbedingung** | Auftrag ist in rvSMD vorhanden und es erfolgte die digitale Beauftragung über rvGutachten Akteur ist berechtigt (in rvSMD) den Auftrag zu stornieren |
| **Abschlussbedingung** | Status des Auftrags ist in rvGutachten aktualisiert und hat den Status "Storniert" Audit-Log der Statusänderung ist erstellt |
| **zugehörige User Stories** | US-AM.06, US-BN.02 |
| **Priorität** | Mittel \- Wichtig für Auftragsverwaltung |


---

## 🔵 Mittlere Priorität Use Cases (Sprint 3)

### BUC-06: E-Mail-Benachrichtigungssystem

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-06 |
| **Name** | Automatische E-Mail-Benachrichtigungen verwalten |
| **Akteur** | **Primär:** System (automatisch), Konfiguration durch DRV-Mitarbeiter<br>**Sekundär:** Gutachter/Gutachtermitarbeiter |
| **Bemerkung** | E-Mails müssen zuverlässig zugestellt werden; Personalisierte Nachrichten mit relevanten Fallinformationen; Wiederholungsversuche bei Zustellproblemen; DSGVO-konforme E-Mail-Verarbeitung |
| **Auslöser** | Relevante Ereignisse im System (neuer Auftrag, Statusänderung, etc.) |
| **Hauptablauf** | 1. **Neuer Auftrag zugewiesen** → Sofortige E-Mail an Gutachter<br>2. **Auftragsstatus geändert** → Benachrichtigung an relevante Parteien<br>3. **Mahnung eingegangen** → Prioritäts-E-Mail mit Fristen<br>4. **Dokumente nachgereicht** → Information über neue Unterlagen<br>5. **System-Wartung geplant** → Vorankündigung an alle Benutzer |
| **Ausnahmeablauf** | - |
| **Anfangsbedingung** | - E-Mail-System ist verfügbar und konfiguriert<br>- Benutzer haben gültige E-Mail-Adressen hinterlegt<br>- Benachrichtigungsregeln sind definiert |
| **Abschlussbedingung** | - Relevante Parteien sind zeitnah informiert<br>- E-Mail-Versand ist dokumentiert<br>- Fehlerhafte E-Mail-Adressen sind identifiziert |
| **Erweiterte Verwaltung** | **K1:** E-Mail-Templates mit Platzhaltern (Name, Auftragsnummer, etc.)<br>**K2:** Benachrichtigungsfrequenz (sofort, täglich, wöchentlich)<br>**K3:** Opt-out Möglichkeiten für nicht-kritische Nachrichten<br>**K4:** Eskalations-E-Mails bei kritischen Ereignissen<br>**Template-Platzhalter:** {{gutachter_name}}, {{auftrag_nummer}}, {{proband_name}}, {{frist_datum}}, {{link_portal}} |
| **zugehörige User Stories** | US-BN.01, US-BN.02, US-BN.04, US-BN.05 |
| **Priorität** | Mittel - Verbessert Benutzerexperience erheblich |  

---

### BUC-09: Datenaufbewahrung und Löschung (DSGVO)

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-09 |
| **Name** | Automatische Datenaufbewahrung und -löschung |
| **Akteur** | **Primär:** System (automatisch)<br>**Sekundär:** DRV-Mitarbeiter (Konfiguration) |
| **Bemerkung** | Sichere, nicht-wiederherstellbare Löschung; Verschlüsselte Archivierung bei Aufbewahrungspflicht; Zwei-Faktor-Bestätigung für manuelle Löschvorgänge; Regelmäßige Compliance-Audits |
| **Auslöser** | Zeitbasierte Trigger oder Auftragsstatusänderungen |
| **Hauptablauf** | **Aufbewahrungsregeln:**<br>1. **Abgeschlossene Aufträge:** Aufbewahrung 90 Tage nach Abschluss<br>2. **Stornierte Aufträge:** Auftragsinformationen 30 Tage, Dokumente sofort löschen<br>3. **Persönliche Notizen:** Mit Auftragslöschung entfernen<br>4. **Audit-Logs:** Separate Aufbewahrung nach gesetzlichen Vorgaben<br>5. **Inaktive Accounts:** Nach 2 Jahren ohne Login zur Überprüfung<br>**Löschprozess:**<br>1. System identifiziert löschbare Datensätze<br>2. Automatische Benachrichtigung an betroffene Gutachter (7 Tage vorher)<br>3. Daten-Export für Archivierung (falls erforderlich)<br>4. Sichere Löschung aus produktiver Datenbank<br>5. Bestätigung und Dokumentation der Löschung |
| **Ausnahmeablauf** | **A1:** Laufende Verfahren → Löschung pausieren bis Abschluss<br>**A2:** Rechtliche Aufbewahrungspflicht → Archivierung statt Löschung<br>**A3:** Benutzer-Widerspruch → Manuelle Prüfung erforderlich |
| **Anfangsbedingung** | - Löschrichtlinien sind konfiguriert<br>- Aufträge haben definierte Statuswerte<br>- Backup-System ist verfügbar |
| **Abschlussbedingung** | - DSGVO-Compliance ist sichergestellt<br>- Speicherplatz wird optimiert<br>- Löschvorgänge sind vollständig dokumentiert |
| **Erweiterte Verwaltung** | Konfigurierbare Parameter: Aufbewahrungszeiten pro Auftragstyp, Benachrichtigungsvorlauf, Löschung-Batch-Größen, Ausnahmeregeln für spezielle Fälle |
| **zugehörige User Stories** | US-LA.01, US-LA.02, US-LA.03, US-AM.07 |
| **Priorität** | Mittel - Rechtliche Compliance erforderlich |  

---

## 🔴 Niedrige Priorität Use Cases (Sprint 3+)

### BUC-07: Support-Dashboard und Überwachung

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-07 |
| **Name** | DRV-Support Dashboard und Systemüberwachung |
| **Akteur** | **Primär:** DRV-Mitarbeiter (Support-Rolle) |
| **Bemerkung** | Alle Support-Aktionen sind auditiert |
| **Auslöser** | Support-Mitarbeiter benötigt Systemüberblick oder Support-Information |
| **Hauptablauf** | 1. **Auftragszuweisungen überwachen** (US-SL.01) - Vollständige Liste aller Zuweisungen, Suchfunktion nach VSNR/Gutachter-Name/EFN, Filterung nach Status/Zeitraum/Region<br>2. **Dokumentenübersicht** (US-SL.02) - Prüfung der bereitgestellten Dokumente pro Auftrag, Identifikation fehlender oder problematischer Dokumente, Vollständigkeits-Check für Support-Fälle<br>3. **System-Gesundheit** - Aktive Benutzer-Sessions, Performance-Metriken (Response-Zeiten, Fehlerrate), E-Mail-Versand Status, Integration-Status (eLogin, rvSMD) |
| **Ausnahmeablauf** | - |
| **Anfangsbedingung** | - DRV-Mitarbeiter hat Support-Berechtigung<br>- System-Monitoring ist aktiv<br>- Dashboard-Daten sind aktuell |
| **Abschlussbedingung** | - Support-Mitarbeiter haben vollständigen Systemüberblick<br>- Probleme können schnell identifiziert und behoben werden<br>- Alle Support-Aktionen sind auditiert |
| **Erweiterte Verwaltung** | **S1:** Benutzer-Impersonation (mit Audit-Trail)<br>**S2:** Manual-Override für blockierte Accounts<br>**S3:** Bulk-Operationen für Massenereignisse<br>**S4:** Eskalations-Workflows für kritische Probleme |
| **zugehörige User Stories** | US-SL.01, US-SL.02 |
| **Priorität** | Niedrig |

**Quell-Stories:** US-SL.01, US-SL.02, US-SL.03, US-SL.04  
**Priorität:** Niedrig - Wichtig für operative Exzellenz  

---

### BUC-08: Erweiterte Gutachtermitarbeiter-Verwaltung

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-08 |
| **Name** | Gutachtermitarbeiter-Registrierung und -Verwaltung |
| **Akteur** | **Primär:** Gutachter<br>**Sekundär:** Gutachtermitarbeiter, DRV-Mitarbeiter |
| **Bemerkung** | Erweiterte Funktionalität für größere Praxen; Alle Aktivitäten sind dem verantwortlichen Gutachter zugeordnet |
| **Auslöser** | Gutachter möchte Mitarbeiter für das System anmelden |
| **Hauptablauf** | 1. Gutachter öffnet Mitarbeiter-Verwaltung<br>2. Gutachter füllt Anmeldeformular für Mitarbeiter aus<br>3. System validiert Mitarbeiterdaten gegen eLogin<br>4. Anmeldung wird zur Genehmigung an DRV weitergeleitet<br>5. DRV-Mitarbeiter prüft und genehmigt Anmeldung<br>6. Mitarbeiter erhält Aktivierungscode<br>7. Mitarbeiter aktiviert sich mit dem erhaltenen Code |
| **Ausnahmeablauf** | **A1:** Mitarbeiter bereits in anderem Kontext registriert → Zuordnung prüfen<br>**A2:** Gutachter-Account wird deaktiviert → Alle Mitarbeiter automatisch deaktivieren<br>**A3:** Mitarbeiter verlässt Praxis → Formeller Abmeldeprozess |
| **Anfangsbedingung** | - Gutachter ist registriert und aktiviert<br>- Mitarbeiter hat gültige eLogin-Berechtigung<br>- DRV-Genehmigungsprozess ist verfügbar |
| **Abschlussbedingung** | - Mitarbeiter können im Namen des Gutachters arbeiten<br>- Alle Aktivitäten sind dem verantwortlichen Gutachter zugeordnet<br>- Audit-Trail ist vollständig |
| **Erweiterte Verwaltung** | **V1:** Mitarbeiter-Status einsehen und verwalten<br>**V2:** Berechtigungen pro Mitarbeiter konfigurieren<br>**V3:** Mitarbeiter-Deaktivierung durch Gutachter<br>**V4:** Audit-Trail aller Mitarbeiter-Aktivitäten |
| **zugehörige User Stories** | US-RL.02, US-RL.03, US-RL.09, US-RL.10 |
| **Priorität** | Niedrig - Erweiterte Funktionalität für größere Praxen |

---

### BUC-10: Automatische Dokumentenbereitstellung (rvPUR → rvGutachten)

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-10 |
| **Name** | Automatische Dokumentenbereitstellung bei neuem Auftrag |
| **Akteur** | **Primär:** Systemautomatik<br>**Sekundär:** Gutachter, rvSMD (Auftragsverwaltung), rvPUR (Dokumentenarchiv) |
| **Bemerkung** | Geschäftswert: Gutachter haben sofortigen Zugriff auf alle Unterlagen; Keine Wartezeiten beim Dokumentenabruf; Arbeiten ist auch bei temporären Archivstörungen möglich; Effiziente Fallbearbeitung |
| **Auslöser** | Neuer Gutachtenauftrag wird erstellt/übertragen |
| **Hauptablauf** | 1. rvSMD überträgt neuen Gutachtenauftrag an rvGutachten<br>2. rvGutachten legt Auftrag an und startet Dokumentenbeschaffung<br>3. System fordert alle relevanten Dokumente zu diesem Auftrag aus rvPUR-Archiv an<br>4. Dokumente werden für schnellen Zugriff in rvGutachten bereitgestellt<br>5. Gutachter kann Dokumente sofort einsehen und bearbeiten<br>6. Bei neuen/aktualisierten Dokumenten wird die Bereitstellung aktualisiert |
| **Ausnahmeablauf** | **A1:** rvPUR-Archiv nicht erreichbar → Wiederholungsversuch, Benachrichtigung an Support<br>**A2:** Keine Dokumente vorhanden → Hinweis an Gutachter<br>**A3:** Fehler bei Dokumentenbeschaffung → Protokollierung, erneuter Versuch, ggf. manuelle Nachbearbeitung |
| **Anfangsbedingung** | - Auftrag ist in rvGutachten angelegt<br>- Dokumente zu diesem Auftrag sind im rvPUR-Archiv vorhanden<br>- Zugriff auf rvPUR-Dokumentenarchiv ist verfügbar |
| **Abschlussbedingung** | - Alle relevanten Dokumente sind im Auftrag verfügbar<br>- Dokumentenzugriff ist schnell und zuverlässig auch bei Archivausfall<br>- Alle Dokumentenzugriffe sind protokolliert |
| **Erweiterte Verwaltung** | - |
| **zugehörige User Stories** | US-AM.02, US-AM.03, US-AM.05, US-NF.01 |
| **Priorität** | Mittel/Hoch – Voraussetzung für effiziente Auftragsbearbeitung |


---

### BUC-11: Statusänderungen Gutachter

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-11 |
| **Name** | Statusänderungen Gutachter |
| **Akteur** | **Primär:** 8023-Mitarbeiter (in rvSMD)<br>**Sekundär:** rvSMD-System, rvGutachten-System |
| **Bemerkung** | - |
| **Auslöser** | Status eines Gutachters wird in rvSMD geändert (z.B. Aktivierung, Sperrung, Reaktivierung) |
| **Hauptablauf** | 1. 8023-Mitarbeiter öffnet Gutachter-Verwaltung in rvSMD<br>2. Auswahl eines Gutachters<br>3. Auswahl gewünschter Statusänderung (aktiv, gesperrt, reaktiviert, gelöscht)<br>4. rvSMD prüft Berechtigungen und Statusübergänge<br>5. rvSMD setzt neuen Status und dokumentiert Änderung<br>6. rvSMD stößt Synchronisation nach rvGutachten an<br>7. rvGutachten übernimmt Statusänderung automatisch<br>8. System informiert Gutachter (z.B. per E-Mail) |
| **Ausnahmeablauf** | **A1:** Ungültiger Statusübergang in rvSMD → Fehlermeldung<br>**A2:** Synchronisationsfehler → Logging, Support-Benachrichtigung |
| **Anfangsbedingung** | - 8023-Mitarbeiter ist authentifiziert und autorisiert<br>- Gutachter ist in rvSMD vorhanden |
| **Abschlussbedingung** | - Status des Gutachters ist aktualisiert<br>- Audit-Log der Statusänderung ist erstellt |
| **Erweiterte Verwaltung** | - |
| **zugehörige User Stories** | US-RL.09, US-RL.10 |
| **Priorität** | Mittel - Wichtig für Gutachter-Verwaltung |

---

### BUC-12a: Gutachter ändert Auftragsstatus

| **Attribut** | **Beschreibung** |
|--------------|------------------|
| **ID** | BUC-12a |
| **Name** | Gutachter ändert Auftragsstatus in rvGutachten |
| **Akteur** | **Primär:** Gutachter<br>**Sekundär:** rvGutachten-System, rvSMD-System |
| **Bemerkung** | - |
| **Auslöser** | Der Gutachter ändert den Status eines Auftrags in der rvGutachten-Anwendung |
| **Hauptablauf** | 1. Gutachter öffnet die Auftragsübersicht in rvGutachten<br>2. Er wählt einen Auftrag aus<br>3. Er wählt einen neuen Status (z.B. "in Bearbeitung", "abgeschlossen")<br>4. rvGutachten prüft die Berechtigung für die Statusänderung<br>5. rvGutachten setzt den neuen Status und erstellt einen Audit-Log-Eintrag<br>6. rvGutachten stößt eine Synchronisation der Statusänderung nach rvSMD an<br>7. rvSMD übernimmt den neuen Status |
| **Ausnahmeablauf** | **A1:** Ungültiger Statusübergang → Fehlermeldung in rvGutachten<br>**A2:** Synchronisationsfehler nach rvSMD → Logging und Benachrichtigung des Supports |
| **Anfangsbedingung** | - Der Gutachter ist in rvGutachten authentifiziert<br>- Der Auftrag ist dem Gutachter zugewiesen |
| **Abschlussbedingung** | - Der Status des Auftrags ist in beiden Systemen (rvGutachten und rvSMD) aktualisiert<br>- Die Statusänderung ist im Audit-Log dokumentiert |
| **Erweiterte Verwaltung** | - |
| **zugehörige User Stories** | US-AM.04, US-BN.02 |
| **Priorität** | Mittel - Wichtig für die Auftrags-Verwaltung |

---

**Note:** BUC-12b (DRV-Mitarbeiter ändert Auftragsstatus) has been consolidated into UC-13 (Auftragsstornierung) as they describe the same process - DRV staff initiating status changes in rvSMD that synchronize to rvGutachten. UC-13 provides the specific, most common case (cancellation) while covering the general pattern.

---

