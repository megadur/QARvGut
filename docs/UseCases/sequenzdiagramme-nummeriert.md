# QARvGut MVP - Nummerierte Sequenzdiagramme

**Dokument Version:** 1.0
**Projekt:** QARvGut Enhanced User Management
**Erstellt:** 21. Oktober 2025
**Zweck:** Detaillierte Sequenzdiagramme mit nummerierten Schritten für alle MVP Use Cases

---
 QARvGut Use Cases - Kurze Zusammenfassung

  🔴 Kritische Use Cases (Sprint 1)

  UC-01: Gutachter-Onboarding-Prozess
  - Admin-verwaltete Registrierung (beginnt mit rvSMD!)
  - DRV-Admin trägt Gutachter in rvSMD ein → eLogin-Account → Aktivierung per Brief
  - Integration: eLogin, rvSMD, E-Mail-System
  - Priorität: Kritisch (Blocker für alle anderen Features)

  UC-02: System-Authentifizierung
  - Login mit E-Mail/Passwort, Session-Management
  - Brute-Force-Schutz, Passwort-Reset-Funktionalität
  - Priorität: Kritisch (Grundlage für alle authentifizierten Features)

  UC-03: DRV-Mitarbeiter-Zugriffsverwaltung
  - Support-Zugang für DRV-Mitarbeiter über rvGutachtenAdmin
  - Erweiterte Berechtigungen für Administration und Support
  - Priorität: Kritisch (Notwendig für Betrieb)

  🟡 Hohe Priorität (Sprint 2)

  UC-04: Auftragsübersicht und -verwaltung
  - Tabellarische Auftragsanzeige mit Sortierung/Filterung
  - Echtzeitaktualisierung, Status-Management
  - Performance: < 3s Ladezeit für 500 Aufträge

  UC-05: Auftragsdetails und Dokumenteneinsicht
  - Detailansicht mit PDF-Viewer, Download, Druck
  - Notizen-Funktionalität, Audit-Trail
  - Sicherheit: Watermarking, Berechtigung

  🔵 Mittlere Priorität (Sprint 3)

  UC-06: E-Mail-Benachrichtigungssystem
  - Automatische Benachrichtigungen (neue Aufträge, Status, Mahnungen)
  - Konfigurierbare Templates mit Platzhaltern
  - SMTP-Integration mit Retry-Mechanismus

  UC-09: Datenaufbewahrung und Löschung (DSGVO)
  - Automatische Löschung nach definierten Regeln
  - Aufbewahrungszeiten: Abgeschlossen (90 Tage), Storniert (30 Tage)
  - Sichere, nicht-wiederherstellbare Löschung

  🔴 Niedrige Priorität (Sprint 3+)

  UC-07: Support-Dashboard und Überwachung
  - Auftragszuweisungen überwachen, Dokumentenübersicht
  - System-Gesundheit, Performance-Metriken
  - Support-Tools: Impersonation, Bulk-Operationen

  UC-08: Gutachtermitarbeiter-Verwaltung
  - Registrierung durch Gutachter → DRV-Genehmigung → Code-Aktivierung
  - Berechtigungen pro Mitarbeiter, Audit-Trail
  - Automatische Deaktivierung bei Gutachter-Sperrung

  Technische Integration

  - eLogin: Authentifizierung und Identitätsprüfung
  - rvSMD: Gutachter-Stammdaten und EFN-Verwaltung
  - E-Mail: Benachrichtigungen und Aktivierungscodes
  - DSGVO: Automatische Löschung und Compliance
  - 
## UC-01: Gutachter-Onboarding-Prozess

```mermaid
sequenceDiagram
    participant G as Gutachter
    participant RG as rvGutachten System
    participant EL as eLogin API
    participant SMD as rvSMD System
    participant DRV as DRV-Mitarbeiter
    participant ES as E-Mail System

    Note over G,ES: Gutachter-Registrierung und Aktivierung

    G->>RG: 1. Registrierungsseite aufrufen
    RG->>G: 2. Registrierungsformular anzeigen

    G->>RG: 3. Formular ausfüllen (Name, E-Mail, EFN)
    RG->>RG: 4. Eingaben validieren (Format, Pflichtfelder)

    alt Ungültige Eingaben
        RG->>G: 5a. Fehlermeldung anzeigen
        G->>RG: 5b. Korrekte Eingaben
    end

    RG->>EL: 6. Gutachter-Daten validieren
    EL->>RG: 7. Validierungsresultat

    alt eLogin nicht erreichbar
        RG->>G: 8a. Registrierung temporär gesperrt
    else Gutachter bereits registriert
        RG->>G: 8b. Hinweis auf bestehenden Account
    else Validation erfolgreich
        RG->>SMD: 9. Gutachter-Status prüfen (GET /gutachter/efn/status)
        SMD->>RG: 10. Status-Information

        RG->>RG: 11. Account erstellen (Status: "pending")
        RG->>DRV: 12. Neue Registrierung melden

        DRV->>DRV: 13. Gutachter-Berechtigung prüfen

        alt DRV lehnt ab
            DRV->>RG: 14a. Registrierung ablehnen
            RG->>G: 15a. Account deaktiviert, Benachrichtigung
        else DRV genehmigt
            DRV->>RG: 14b. Registrierung genehmigen
            RG->>SMD: 15b. Gutachter erstellen (POST /gutachter)
            SMD->>RG: 16. Erstellungsbestätigung

            RG->>RG: 17. Aktivierungscode generieren
            RG->>ES: 18. Aktivierungs-E-Mail senden
            ES->>G: 19. E-Mail mit Aktivierungscode

            G->>RG: 20. Aktivierungscode eingeben

            alt Code falsch (max. 3 Versuche)
                RG->>G: 21a. Erneute Eingabe erlauben
            else Code korrekt
                RG->>RG: 21b. Account aktivieren
                RG->>SMD: 22. Status aktualisieren (POST /gutachter/efn/status)
                RG->>RG: 23. Audit-Log erstellen
                RG->>G: 24. Erfolgreiche Aktivierung, Weiterleitung zum Login
            end
        end
    end
```

---

## UC-02: System-Authentifizierung

```mermaid
sequenceDiagram
    participant U as Benutzer
    participant RG as rvGutachten System
    participant DB as Datenbank
    participant SM as Session Manager
    participant ES as E-Mail System

    Note over U,ES: Benutzer-Anmeldung am System

    U->>RG: 1. Login-Seite aufrufen
    RG->>U: 2. Login-Formular anzeigen

    U->>RG: 3. E-Mail und Passwort eingeben
    RG->>RG: 4. Eingaben validieren (Format, Pflichtfelder)

    alt Ungültige Eingaben
        RG->>U: 5a. Validierungsfehler anzeigen
    else Eingaben gültig
        RG->>DB: 5b. Benutzer-Authentifizierung (E-Mail, Passwort-Hash)
        DB->>RG: 6. Authentifizierungsresultat

        alt Falsche Anmeldedaten
            RG->>RG: 7a. Fehlversuch zählen
            alt Zu viele Fehlversuche (>3)
                RG->>DB: 8a. Account temporär sperren (30 Min)
                RG->>U: 9a. Account gesperrt - Wartezeit
            else Normale Fehlermeldung
                RG->>U: 8b. Anmeldedaten falsch
            end
        else Account gesperrt
            RG->>U: 7b. Account gesperrt - Kontakt Information
        else Authentifizierung erfolgreich
            RG->>DB: 7c. Account-Status prüfen (aktiv/gesperrt)
            DB->>RG: 8c. Status-Information

            alt Account nicht aktiv
                RG->>U: 9c. Account inaktiv - Kontakt Support
            else Account aktiv
                RG->>SM: 9d. Session erstellen
                SM->>RG: 10. Session-Token + Security-Token

                alt "Angemeldet bleiben" gewählt
                    RG->>SM: 11a. Extended Session (7 Tage)
                else Standard Session
                    RG->>SM: 11b. Standard Session (8 Stunden)
                end

                RG->>DB: 12. Login-Zeitstempel + IP-Adresse speichern
                RG->>RG: 13. Audit-Log erstellen

                alt Erster Login
                    RG->>U: 14a. Passwort-Änderung erforderlich
                else Verdächtige Anmeldung (neue IP/Gerät)
                    RG->>ES: 14b. Sicherheitsbenachrichtigung senden
                    ES->>U: 15. E-Mail über neue Anmeldung
                    RG->>U: 16. Zusätzliche Verifikation erforderlich
                else Normale Anmeldung
                    RG->>U: 14c. Weiterleitung zur Auftragsübersicht
                end
            end
        end
    end

    Note over U,ES: Passwort vergessen (Erweiterte Funktion)
    alt Passwort vergessen
        U->>RG: 17. "Passwort vergessen" klicken
        U->>RG: 18. E-Mail-Adresse eingeben
        RG->>DB: 19. E-Mail validieren
        alt E-Mail existiert
            RG->>RG: 20a. Reset-Token generieren
            RG->>ES: 21. Reset-E-Mail senden
            ES->>U: 22. E-Mail mit Reset-Link
        else E-Mail unbekannt
            RG->>U: 20b. Allgemeine Bestätigungsmeldung (Security)
        end
    end
```

---

## UC-03: DRV-Mitarbeiter-Zugriffsverwaltung

```mermaid
sequenceDiagram
    participant DRV as DRV-Mitarbeiter
    participant RGA as rvGutachtenAdmin
    participant RG as rvGutachten System
    participant EL as eLogin API
    participant DB as Datenbank
    participant AM as Audit Manager

    Note over DRV,AM: DRV-Mitarbeiter Support-Zugang beantragen

    DRV->>RGA: 1. Support-Zugang beantragen
    RGA->>RGA: 2. Antrag validieren

    RGA->>EL: 3. Mitarbeiter-Status validieren
    EL->>RGA: 4. Validierungsresultat

    alt eLogin Validierung fehlgeschlagen
        RGA->>DRV: 5a. Berechtigung ungültig
    else Validierung erfolgreich
        RGA->>RGA: 5b. Berechtigungsstufe bestimmen

        RGA->>RG: 6. DRV-Account erstellen (Support-Rolle)
        RG->>DB: 7. Account mit erweiterten Rechten speichern
        DB->>RG: 8. Erstellungsbestätigung

        RG->>AM: 9. Account-Erstellung protokollieren

        alt Support Level 1 (Standard)
            RG->>DB: 10a. Basis-Support-Rechte zuweisen
            Note over RG: Auftragszuweisungen einsehen, Dokumentübersicht
        else Support Level 2 (Erweitert)
            RG->>DB: 10b. Erweiterte Support-Rechte zuweisen
            Note over RG: + System-Konfiguration, Benutzerverwaltung
        else Support Level 3 (Administrator)
            RG->>DB: 10c. Administrator-Rechte zuweisen
            Note over RG: + Vollzugriff auf alle Funktionen
        end

        RG->>DRV: 11. Account erstellt - Login-Daten senden
        RG->>AM: 12. Berechtigungserteilung protokollieren
    end

    Note over DRV,AM: DRV-Mitarbeiter nutzt Support-Funktionen

    DRV->>RG: 13. Bei Support-Dashboard anmelden
    RG->>DB: 14. Benutzer authentifizieren und Berechtigung prüfen
    DB->>RG: 15. Authentifizierung + Rollenberechtigung

    alt Zugriff auf Auftragszuweisungen
        DRV->>RG: 16a. Auftragszuweisungen einsehen
        RG->>DB: 17a. Aufträge laden (alle Gutachter)
        DB->>RG: 18a. Auftragsdaten
        RG->>DRV: 19a. Vollständige Auftragsliste anzeigen
        RG->>AM: 20a. Auftragszugriff protokollieren

        DRV->>RG: 21. Nach VSNR/Gutachter/EFN suchen
        RG->>DB: 22. Filterabfrage ausführen
        DB->>RG: 23. Gefilterte Ergebnisse
        RG->>DRV: 24. Suchergebnisse anzeigen
    end

    alt Zugriff auf Dokumentenübersicht
        DRV->>RG: 16b. Dokumentenstatus prüfen
        RG->>DB: 17b. Dokumentenvollständigkeit abfragen
        DB->>RG: 18b. Dokument-Status pro Auftrag
        RG->>DRV: 19b. Vollständigkeitsreport anzeigen
        RG->>AM: 20b. Dokumentenzugriff protokollieren
    end

    alt System-Konfiguration (Level 2+)
        DRV->>RG: 16c. Gutachter-Registrierungen verwalten
        RG->>DB: 17c. Pending-Registrierungen laden
        DB->>RG: 18c. Registrierungsliste
        RG->>DRV: 19c. Genehmigungsworkflow anzeigen

        DRV->>RG: 25. Registrierung genehmigen/ablehnen
        RG->>DB: 26. Status aktualisieren
        RG->>AM: 27. Admin-Entscheidung protokollieren
    end
```

---

## UC-04: Auftragsübersicht und -verwaltung

```mermaid
sequenceDiagram
    participant G as Gutachter
    participant RG as rvGutachten System
    participant DB as Datenbank
    participant SMD as rvSMD System
    participant RT as Real-Time Updates

    Note over G,RT: Auftragsübersicht anzeigen und verwalten

    G->>RG: 1. Zur Auftragsübersicht navigieren
    RG->>DB: 2. Benutzer-authentifizierte Aufträge laden
    DB->>RG: 3. Alle zugewiesenen Aufträge

    alt Keine Aufträge vorhanden
        RG->>G: 4a. Informative Meldung mit Hilfetext
    else Aufträge vorhanden
        RG->>G: 4b. Tabellarische Übersicht anzeigen
        Note over G,RG: Spalten: Auftragsdatum, VSNR, Proband, Status
    end

    par Real-Time Updates
        RT->>RG: 5a. Auto-Refresh Trigger (alle 5 Min)
        RG->>DB: 6a. Aktualisierte Daten abfragen
        DB->>RG: 7a. Neue/geänderte Aufträge
        RG->>G: 8a. Dashboard aktualisieren

    and Benutzer-Interaktionen
        alt Sortierung anwenden
            G->>RG: 5b. Nach Spalte sortieren (Datum/Status/Proband)
            RG->>RG: 6b. Client-seitige Sortierung
            RG->>G: 7b. Sortierte Darstellung

        else Filter anwenden
            G->>RG: 5c. Nach Status filtern (neu/in Bearbeitung/abgeschlossen)
            RG->>RG: 6c. Filter anwenden
            RG->>G: 7c. Gefilterte Aufträge anzeigen

        else Suchfunktion nutzen
            G->>RG: 5d. Suchbegriff eingeben (VSNR/Proband)
            RG->>RG: 6d. Lokale Suche durchführen (<1 Sek)
            RG->>G: 7d. Suchergebnisse anzeigen
        end
    end

    Note over G,RT: Auftragsstatus verwalten

    G->>RG: 9. Auftragsstatus ändern
    alt Status "In Bearbeitung"
        RG->>DB: 10a. Status aktualisieren + Zeitstempel
        DB->>RG: 11a. Update bestätigt
        RG->>SMD: 12a. Status-Sync (falls erforderlich)
        RG->>G: 13a. Visuelle Statusänderung

    else Status "Abgeschlossen"
        RG->>DB: 10b. Abschluss-Zeitstempel setzen
        DB->>RG: 11b. Update bestätigt
        RG->>G: 13b. Abgeschlossen-Kennzeichnung

    else Stornierter Auftrag
        RG->>RG: 10c. Auftrag sperren (keine Aktionen möglich)
        RG->>G: 13c. Deutliche Sperrung mit roter Kennzeichnung
    end

    Note over G,RT: Erweiterte Funktionen

    alt Auftrag mit Mahnung
        RG->>G: 14a. Mahnung visuell hervorheben (Warnsymbol)
        G->>RG: 15. Mahndetails anzeigen
        RG->>DB: 16. Mahnungsinformationen laden
        DB->>RG: 17. Mahnstufe + Fristdaten
        RG->>G: 18. Detaillierte Mahninformationen
    end

    alt Auftragsdetails aufrufen
        G->>RG: 14b. Auf Auftrag klicken
        RG->>G: 19. Weiterleitung zur Detailansicht (UC-05)
    end

    alt System-Timeout/Netzwerkfehler
        RG->>RG: 20. Verbindungsfehler erkennen
        RG->>G: 21. Offline-Indikator + Retry-Button
        G->>RG: 22. Manuelles Neuladen
        RG->>DB: 23. Daten neu laden
    end
```

---

## UC-05: Auftragsdetails und Dokumenteneinsicht

```mermaid
sequenceDiagram
    participant G as Gutachter
    participant RG as rvGutachten System
    participant DB as Datenbank
    participant PUR as rvPuR/rvArchiv
    participant PDF as PDF-Viewer
    participant AM as Audit Manager

    Note over G,AM: Auftragsdetails einsehen und Dokumente verwalten

    G->>RG: 1. Auf Auftrag in Übersicht klicken
    RG->>DB: 2. Auftragsberechtigung prüfen
    DB->>RG: 3. Berechtigung bestätigt

    alt Berechtigung entzogen
        RG->>G: 4a. Weiterleitung zur Übersicht + Hinweis
    else Berechtigung OK
        RG->>DB: 4b. Erweiterte Auftragsinformationen laden
        DB->>RG: 5. VSNR, Proband, Geburtsdatum, Status, etc.

        par Auftragsdaten anzeigen
            RG->>G: 6a. Detailansicht mit erweiterten Informationen

        and Dokumente laden
            RG->>PUR: 6b. Zugeordnete Dokumente abfragen
            PUR->>RG: 7. Dokumentenliste + Metadaten
            RG->>G: 8. Dokumentenübersicht anzeigen
        end
    end

    Note over G,AM: Dokumentenmanagement

    G->>RG: 9. Dokument zum Öffnen auswählen

    alt Stornierter Auftrag
        RG->>G: 10a. Eingeschränkte Funktionalität - nur Einsicht
    else Aktiver Auftrag
        RG->>DB: 10b. Dokumentenzugriff protokollieren
        DB->>AM: 11. Audit-Log erstellen

        RG->>PUR: 12. Dokument anfordern
        alt Dokument nicht verfügbar
            PUR->>RG: 13a. Fehler - Dokument nicht gefunden
            RG->>G: 14a. Fehlermeldung + Kontaktmöglichkeit
        else Dokument verfügbar
            PUR->>RG: 13b. Dokument-Stream + Metadaten

            alt PDF-Direktanzeige
                RG->>PDF: 14b. PDF-Viewer initialisieren
                PDF->>G: 15a. Dokument in Viewer anzeigen
                Note over G,PDF: Zoom, Pan, Navigation verfügbar

            else Download-Funktion
                G->>RG: 15b. Download-Button klicken
                RG->>RG: 16a. Watermark hinzufügen (falls erforderlich)
                RG->>G: 17a. Sicherer Download starten
                RG->>AM: 18a. Download protokollieren

            else Druck-Funktion
                G->>RG: 15c. Drucken-Button klicken
                RG->>RG: 16b. Druckbare Version erstellen
                RG->>G: 17b. Druckdialog öffnen (Formaterhaltung)
                RG->>AM: 18b. Druckvorgang protokollieren
            end
        end
    end

    Note over G,AM: Notizenfunktion

    G->>RG: 19. Notiz zu Dokument erstellen/bearbeiten
    RG->>DB: 20. Notiz speichern (dokumentenbezogen)
    DB->>RG: 21. Speicherung bestätigt
    RG->>G: 22. Notiz in Dokument-Kontext anzeigen
    RG->>AM: 23. Notizen-Aktivität protokollieren

    Note over G,AM: Navigation und Sicherheit

    alt Zurück zur Übersicht
        G->>RG: 24. Zurück-Button/Navigation
        RG->>G: 25. Rückkehr zur Auftragsübersicht
    end

    Note over RG,AM: Kontinuierliche Sicherheitsüberwachung
    RG->>AM: 26. Alle Dokumentenzugriffe auditieren
    RG->>RG: 27. Schutz vor unbefugtem Zugriff
    RG->>RG: 28. Session-Timeout überwachen
```

---

## UC-06: E-Mail-Benachrichtigungssystem

```mermaid
sequenceDiagram
    participant SYS as System Event
    participant RG as rvGutachten System
    participant NM as Notification Manager
    participant TM as Template Manager
    participant DB as Datenbank
    participant ES as E-Mail System
    participant G as Gutachter/Benutzer

    Note over SYS,G: Automatische E-Mail-Benachrichtigungen

    SYS->>RG: 1. Triggering Event (Neuer Auftrag/Status/Mahnung)
    RG->>NM: 2. Event zur Verarbeitung weiterleiten

    NM->>DB: 3. Betroffene Benutzer ermitteln
    DB->>NM: 4. Benutzerliste + E-Mail-Präferenzen

    alt Benutzer hat Benachrichtigungen deaktiviert
        NM->>RG: 5a. Event ignorieren (Opt-out respektieren)
    else Benachrichtigungen aktiv
        NM->>TM: 5b. Geeignetes E-Mail-Template bestimmen

        alt Neuer Auftrag zugewiesen
            TM->>TM: 6a. Template "Neuer Auftrag" laden
            TM->>DB: 7a. Auftragsdaten für Platzhalter abrufen
            DB->>TM: 8a. {{auftrag_nummer}}, {{proband_name}}, {{frist_datum}}

        else Auftragsstatus geändert
            TM->>TM: 6b. Template "Statusänderung" laden
            TM->>DB: 7b. Statusdaten abrufen
            DB->>TM: 8b. Alter/Neuer Status, Zeitstempel

        else Mahnung eingegangen
            TM->>TM: 6c. Template "Mahnung" (Priorität) laden
            TM->>DB: 7c. Mahnungsdaten abrufen
            DB->>TM: 8c. Mahnstufe, Fristdaten, Eskalationsstufe

        else System-Wartung
            TM->>TM: 6d. Template "System-Info" laden
            TM->>DB: 7d. Wartungsdetails abrufen
            DB->>TM: 8d. Wartungsfenster, betroffene Services
        end

        TM->>TM: 9. Platzhalter ersetzen ({{gutachter_name}}, {{link_portal}})
        TM->>NM: 10. Personalisierte Nachricht erstellen

        NM->>ES: 11. E-Mail versenden
        alt SMTP-Fehler
            ES->>NM: 12a. Versandfehler
            NM->>NM: 13a. Retry-Mechanismus (3 Versuche)
            alt Max. Versuche erreicht
                NM->>DB: 14a. Fehlerhafte E-Mail-Adresse markieren
                NM->>RG: 15a. Admin über Versandfehler informieren
            else Retry erfolgreich
                ES->>G: 14b. E-Mail zugestellt
                NM->>DB: 15b. Erfolgreichen Versand protokollieren
            end
        else Versand erfolgreich
            ES->>G: 12b. E-Mail zugestellt
            NM->>DB: 13b. Versand im Audit-Log protokollieren
        end
    end

    Note over SYS,G: Konfigurierbare Einstellungen

    alt Administrator konfiguriert Templates
        participant ADM as Administrator
        ADM->>TM: 16. Template bearbeiten
        TM->>DB: 17. Neue Template-Version speichern
        TM->>ADM: 18. Änderungen bestätigt

    else Benutzer ändert Präferenzen
        G->>RG: 19. Benachrichtigungseinstellungen öffnen
        RG->>DB: 20. Aktuelle Präferenzen laden
        DB->>RG: 21. Einstellungen (Frequenz, Opt-outs)
        RG->>G: 22. Einstellungsformular anzeigen

        G->>RG: 23. Präferenzen ändern (täglich/sofort/wöchentlich)
        RG->>DB: 24. Neue Präferenzen speichern
        RG->>G: 25. Änderungen bestätigt
    end
```

---

## UC-07: Support-Dashboard und Überwachung

```mermaid
sequenceDiagram
    participant DRV as DRV-Mitarbeiter
    participant RG as rvGutachten System
    participant DB as Datenbank
    participant SMD as rvSMD System
    participant MON as System Monitor
    participant IMP as Impersonation Service
    participant AM as Audit Manager

    Note over DRV,AM: Support-Dashboard und Systemüberwachung

    DRV->>RG: 1. Support-Dashboard aufrufen
    RG->>DB: 2. Support-Berechtigung validieren
    DB->>RG: 3. Berechtigung bestätigt

    par Dashboard-Initialisierung
        RG->>DB: 4a. Auftragszuweisungen laden (alle Gutachter)
        DB->>RG: 5a. Vollständige Auftragsliste

    and System-Metriken laden
        RG->>MON: 4b. Aktuelle System-Gesundheit abfragen
        MON->>RG: 5b. Performance-Metriken, Fehlerrate, Sessions

    and Integration-Status prüfen
        RG->>SMD: 4c. rvSMD-Verbindung testen
        SMD->>RG: 5c. Verbindungsstatus
        par
            RG->>RG: 6a. eLogin-Status prüfen
        and
            RG->>RG: 6b. E-Mail-System-Status prüfen
        end
    end

    RG->>DRV: 7. Vollständiges Dashboard anzeigen

    Note over DRV,AM: Auftragszuweisungen überwachen

    DRV->>RG: 8. Auftragszuweisungen durchsuchen
    alt Suche nach VSNR
        DRV->>RG: 9a. VSNR eingeben
        RG->>DB: 10a. VSNR-basierte Suche
        DB->>RG: 11a. Zugehörige Aufträge + Gutachter-Info

    else Suche nach Gutachter-Name
        DRV->>RG: 9b. Gutachter-Name eingeben
        RG->>DB: 10b. Gutachter-basierte Auftragssuche
        DB->>RG: 11b. Alle Aufträge des Gutachters

    else Suche nach EFN
        DRV->>RG: 9c. EFN eingeben
        RG->>DB: 10c. EFN-Zuordnung auflösen
        DB->>RG: 11c. Gutachter + alle Aufträge
    end

    RG->>DRV: 12. Gefilterte Ergebnisse anzeigen
    RG->>AM: 13. Support-Suche protokollieren

    Note over DRV,AM: Dokumentenübersicht verwalten

    DRV->>RG: 14. Dokumentenstatus für Auftrag prüfen
    RG->>DB: 15. Auftragsdokumente laden
    DB->>RG: 16. Dokumentenliste + Status
    RG->>RG: 17. Vollständigkeits-Check durchführen

    alt Dokumente vollständig
        RG->>DRV: 18a. Vollständigkeits-Bestätigung (grün)
    else Dokumente fehlen
        RG->>DRV: 18b. Fehlende Dokumente hervorheben (rot)
        DRV->>RG: 19. Problematische Dokumente zur Nachverfolgung markieren
    end

    RG->>AM: 20. Dokumentenprüfung protokollieren

    Note over DRV,AM: Support-Werkzeuge nutzen

    alt Benutzer-Impersonation (kritische Funktion)
        DRV->>RG: 21a. Gutachter-Account impersonieren
        RG->>IMP: 22a. Impersonation-Session starten
        IMP->>AM: 23a. Kritische Aktion protokollieren (Wer, Wen, Wann)
        IMP->>RG: 24a. Temporäre Gutachter-Berechtigung gewähren
        RG->>DRV: 25a. Als Gutachter agieren (mit Watermark)

        DRV->>RG: 26. Support-Problem lösen
        DRV->>RG: 27. Impersonation beenden
        RG->>IMP: 28. Session beenden
        IMP->>AM: 29. Impersonation-Ende protokollieren

    else Account-Override für gesperrte Accounts
        DRV->>RG: 21b. Gesperrten Account entsperren
        RG->>DB: 22b. Account-Status auf aktiv setzen
        RG->>AM: 23b. Manual-Override protokollieren
        RG->>DRV: 24b. Account-Entsperrung bestätigt

    else Bulk-Operationen für Massenereignisse
        DRV->>RG: 21c. Bulk-Operation definieren (z.B. Status-Updates)
        RG->>DB: 22c. Batch-Update durchführen
        DB->>RG: 23c. Anzahl betroffener Datensätze
        RG->>AM: 24c. Bulk-Operation protokollieren
        RG->>DRV: 25c. Operation erfolgreich (Anzahl verarbeitet)
    end

    Note over DRV,AM: Eskalations-Workflows

    alt Kritisches Problem identifiziert
        DRV->>RG: 30. Eskalation initiieren
        RG->>RG: 31. Eskalations-Workflow starten
        RG->>AM: 32. Eskalation protokollieren
        RG->>RG: 33. Benachrichtigung an höhere Support-Level
        RG->>DRV: 34. Eskalation bestätigt + Ticket-Nummer
    end
```

---

## UC-08: Erweiterte Gutachtermitarbeiter-Verwaltung

```mermaid
sequenceDiagram
    participant G as Gutachter
    participant RG as rvGutachten System
    participant DB as Datenbank
    participant EL as eLogin System
    participant DRV as DRV-Mitarbeiter
    participant GM as Gutachtermitarbeiter
    participant ES as E-Mail System
    participant AM as Audit Manager

    Note over G,AM: Gutachtermitarbeiter-Registrierung und Verwaltung

    G->>RG: 1. Mitarbeiter-Verwaltung öffnen
    RG->>DB: 2. Gutachter-Status und Berechtigung prüfen
    DB->>RG: 3. Berechtigung bestätigt

    RG->>DB: 4. Aktuelle Mitarbeiter laden
    DB->>RG: 5. Liste der zugeordneten Mitarbeiter
    RG->>G: 6. Mitarbeiter-Dashboard anzeigen

    Note over G,AM: Neuen Mitarbeiter anmelden

    G->>RG: 7. Neuen Mitarbeiter hinzufügen
    RG->>G: 8. Mitarbeiter-Anmeldeformular anzeigen

    G->>RG: 9. Mitarbeiterdaten eingeben (Name, E-Mail, etc.)
    RG->>RG: 10. Eingaben validieren

    alt Ungültige Eingaben
        RG->>G: 11a. Validierungsfehler anzeigen
    else Eingaben gültig
        RG->>EL: 11b. Mitarbeiterdaten gegen eLogin validieren
        EL->>RG: 12. Validierungsresultat

        alt eLogin-Validierung fehlgeschlagen
            RG->>G: 13a. Mitarbeiter-Berechtigung ungültig
        else Mitarbeiter bereits registriert
            RG->>RG: 13b. Zuordnung zu anderem Gutachter prüfen
            alt Zuordnung konfliktfrei
                RG->>RG: 14a. Zuordnung aktualisieren
            else Zuordnungskonflikt
                RG->>G: 14b. Konflikt-Meldung + manuelle Klärung erforderlich
            end
        else Validierung erfolgreich
            RG->>DB: 13c. Anmeldung mit Status "pending" erstellen
            RG->>RG: 15. Genehmigungsantrag für DRV generieren

            RG->>DRV: 16. Mitarbeiter-Anmeldung zur Genehmigung weiterleiten

            DRV->>DRV: 17. Mitarbeiter-Anmeldung prüfen
            alt DRV lehnt ab
                DRV->>RG: 18a. Anmeldung ablehnen + Grund
                RG->>DB: 19a. Anmeldung als abgelehnt markieren
                RG->>G: 20a. Ablehnungsgrund mitteilen
                RG->>AM: 21a. Ablehnungsvorgang protokollieren

            else DRV genehmigt
                DRV->>RG: 18b. Anmeldung genehmigen
                RG->>DB: 19b. Mitarbeiter-Account erstellen (Status: "activation_pending")
                RG->>RG: 20b. Aktivierungscode generieren
                RG->>ES: 21b. Aktivierungs-E-Mail an Mitarbeiter senden
                ES->>GM: 22. E-Mail mit Aktivierungscode

                GM->>RG: 23. Aktivierung mit Code durchführen
                RG->>RG: 24. Code validieren
                alt Code ungültig
                    RG->>GM: 25a. Code falsch - erneute Eingabe
                else Code gültig
                    RG->>DB: 25b. Mitarbeiter aktivieren
                    RG->>G: 26. Mitarbeiter erfolgreich hinzugefügt
                    RG->>AM: 27. Mitarbeiter-Aktivierung protokollieren
                end
            end
        end
    end

    Note over G,AM: Mitarbeiter-Verwaltung

    alt Mitarbeiter-Status einsehen
        G->>RG: 28a. Mitarbeiterliste aktualisieren
        RG->>DB: 29a. Aktuelle Mitarbeiter-Status laden
        DB->>RG: 30a. Status-Information (aktiv/inaktiv/pending)
        RG->>G: 31a. Status-Übersicht anzeigen

    else Berechtigungen konfigurieren
        G->>RG: 28b. Mitarbeiter-Berechtigungen ändern
        RG->>G: 29b. Berechtigungsformular anzeigen
        G->>RG: 30b. Neue Berechtigungen definieren
        RG->>DB: 31b. Berechtigungen aktualisieren
        RG->>AM: 32a. Berechtigungsänderung protokollieren
        RG->>G: 33a. Änderungen bestätigt

    else Mitarbeiter deaktivieren
        G->>RG: 28c. Mitarbeiter deaktivieren
        RG->>RG: 29c. Bestätigungsdialog anzeigen
        G->>RG: 30c. Deaktivierung bestätigen
        RG->>DB: 31c. Mitarbeiter-Status auf "inaktiv" setzen
        RG->>AM: 32b. Deaktivierung protokollieren
        RG->>G: 33b. Mitarbeiter deaktiviert
    end

    Note over G,AM: Spezielle Szenarien

    alt Gutachter-Account wird deaktiviert
        RG->>RG: 34a. Gutachter-Deaktivierung erkannt
        RG->>DB: 35a. Alle zugeordneten Mitarbeiter laden
        DB->>RG: 36a. Mitarbeiterliste
        loop Für jeden Mitarbeiter
            RG->>DB: 37a. Mitarbeiter automatisch deaktivieren
            RG->>AM: 38a. Auto-Deaktivierung protokollieren
        end
        RG->>RG: 39a. Benachrichtigungen an Mitarbeiter senden

    else Mitarbeiter verlässt Praxis
        G->>RG: 34b. Formellen Abmeldeprozess starten
        RG->>G: 35b. Abmeldeformular mit Grund
        G->>RG: 36b. Abmeldung bestätigen + Grund angeben
        RG->>DB: 37b. Mitarbeiter formal abmelden
        RG->>RG: 38b. DSGVO-konforme Datenlöschung einleiten
        RG->>AM: 39b. Formelle Abmeldung protokollieren
    end

    Note over G,AM: Audit-Trail für alle Aktivitäten

    RG->>AM: 40. Kontinuierliche Protokollierung aller Mitarbeiter-Aktivitäten
    AM->>DB: 41. Audit-Logs mit Gutachter-Zuordnung speichern

    Note over G,AM: Alle Mitarbeiter-Aktivitäten sind dem verantwortlichen Gutachter zugeordnet
```

---

## UC-09: DSGVO-Datenaufbewahrung und -löschung

```mermaid
sequenceDiagram
    participant SCHED as Scheduler
    participant RG as rvGutachten System
    participant DB as Datenbank
    participant DM as Data Manager
    participant ES as E-Mail System
    participant ADM as Administrator
    participant ARC as Archive System
    participant AM as Audit Manager

    Note over SCHED,AM: Automatische Datenaufbewahrung und -löschung

    SCHED->>RG: 1. Täglicher DSGVO-Check Trigger
    RG->>DM: 2. Löschkandidaten identifizieren

    DM->>DB: 3. Abgeschlossene Aufträge analysieren (>90 Tage)
    DB->>DM: 4. Liste abgeschlossener Aufträge

    par Verschiedene Aufbewahrungsregeln prüfen
        DM->>DB: 5a. Stornierte Aufträge analysieren (>30 Tage)
        DB->>DM: 6a. Liste stornierter Aufträge

    and
        DM->>DB: 5b. Inaktive Accounts analysieren (>2 Jahre ohne Login)
        DB->>DM: 6b. Liste inaktiver Accounts

    and
        DM->>DB: 5c. Verwaiste Notizen identifizieren
        DB->>DM: 6c. Notizen ohne zugehörige Aufträge
    end

    DM->>DM: 7. Lösch-Batch zusammenstellen

    alt Keine Löschkandidaten vorhanden
        DM->>RG: 8a. Keine Aktion erforderlich
        RG->>AM: 9a. Routine-Check protokollieren

    else Löschkandidaten identifiziert
        DM->>DM: 8b. Ausnahmeregeln prüfen

        alt Laufende Verfahren erkannt
            DM->>DB: 9b. Betroffene Aufträge von Löschung ausschließen
            DM->>AM: 10a. Löschung pausiert - laufende Verfahren

        else Rechtliche Aufbewahrungspflicht
            DM->>ARC: 9c. Daten zur Archivierung vorbereiten
            ARC->>ARC: 10b. Verschlüsselte Archivierung
            DM->>AM: 11a. Archivierung statt Löschung

        else Normale Löschung möglich
            DM->>DB: 9d. Betroffene Benutzer ermitteln
            DB->>DM: 10c. Benutzerliste für Benachrichtigung

            DM->>ES: 11b. Vorwarnung senden (7 Tage vorher)
            ES->>ES: 12a. Template "Datenlöschung" verwenden
            ES->>RG: 13a. Benachrichtigung versendet

            Note over SCHED,AM: 7-Tage-Wartezeit

            SCHED->>RG: 14. Löschfrist abgelaufen - finaler Check
            RG->>DM: 15. Endgültige Löschung durchführen

            alt Benutzer-Widerspruch eingegangen
                DM->>ADM: 16a. Manuelle Prüfung anfordern
                ADM->>DM: 17a. Prüfungsergebnis (löschen/behalten)
                alt Widerspruch berechtigt
                    DM->>AM: 18a. Löschung abgebrochen - Widerspruch
                else Widerspruch unberechtigt
                    DM->>DM: 18b. Löschung fortsetzen
                end

            else Keine Widersprüche
                par Sichere Löschung durchführen
                    DM->>DB: 16b. Auftragsdaten sicher löschen
                    DB->>DM: 19a. Löschung bestätigt (nicht wiederherstellbar)

                and
                    DM->>DB: 17b. Persönliche Notizen entfernen
                    DB->>DM: 19b. Notizen gelöscht

                and
                    DM->>DB: 18c. Verknüpfte Dokumente bewerten
                    alt Dokumente nur zu gelöschtem Auftrag gehörig
                        DM->>DB: 20a. Dokumente sicher löschen
                    else Dokumente in anderen Kontexten verwendet
                        DM->>DB: 20b. Nur Verknüpfungen entfernen
                    end
                end

                DM->>AM: 21. Vollständige Löschung protokollieren
                DM->>RG: 22. Löschbestätigung + Statistiken
            end
        end
    end

    Note over SCHED,AM: Administrator-Konfiguration

    alt Administrator ändert Aufbewahrungszeiten
        ADM->>RG: 23a. DSGVO-Konfiguration öffnen
        RG->>DB: 24a. Aktuelle Parameter laden
        DB->>RG: 25a. Aufbewahrungszeiten pro Typ
        RG->>ADM: 26a. Konfigurationsformular anzeigen

        ADM->>RG: 27a. Parameter ändern (z.B. 90 -> 120 Tage)
        RG->>DB: 28a. Neue Konfiguration speichern
        RG->>AM: 29a. Konfigurationsänderung protokollieren
        RG->>ADM: 30a. Änderungen bestätigt

    else Zwei-Faktor-Bestätigung für manuelle Löschung
        ADM->>RG: 23b. Manuelle Löschung beantragen
        RG->>RG: 24b. Zwei-Faktor-Challenge generieren
        RG->>ADM: 25b. 2FA-Code erforderlich
        ADM->>RG: 26b. 2FA-Code eingeben
        RG->>RG: 27b. Code validieren
        alt Code ungültig
            RG->>ADM: 28b. Zugriff verweigert
        else Code gültig
            RG->>DM: 29b. Manuelle Löschung autorisiert
            DM->>AM: 30b. Manuelle Löschung mit Admin-ID protokollieren
        end
    end

    Note over SCHED,AM: Regelmäßige Compliance-Audits

    SCHED->>RG: 31. Wöchentlicher Compliance-Bericht
    RG->>AM: 32. Löschstatistiken zusammenstellen
    AM->>AM: 33. Compliance-Report generieren
    AM->>ADM: 34. Automatischen Compliance-Bericht senden

    Note over SCHED,AM: Speicherplatz-Optimierung überwacht
    RG->>RG: 35. Speicherplatz nach Löschvorgängen messen
    RG->>AM: 36. Speicher-Optimierungsstatistiken protokollieren
```

---

# Zusammenfassung

## Übersicht der nummerierten Sequenzdiagramme

Diese Markdown-Datei enthält alle 9 Use Case Sequenzdiagramme für das QARvGut MVP mit vollständig nummerierten Schritten:

### **🚨 Kritische Use Cases (Sprint 1)**
1. **UC-01**: Gutachter-Onboarding-Prozess (24 Schritte)
2. **UC-02**: System-Authentifizierung (22 Schritte + Passwort-Reset)
3. **UC-03**: DRV-Mitarbeiter-Zugriffsverwaltung (27 Schritte)

### **🟡 Hohe Priorität (Sprint 2)**
4. **UC-04**: Auftragsübersicht und -verwaltung (23 Schritte)
5. **UC-05**: Auftragsdetails und Dokumenteneinsicht (28 Schritte)

### **🔵 Mittlere Priorität (Sprint 3)**
6. **UC-06**: E-Mail-Benachrichtigungssystem (25 Schritte)
7. **UC-09**: DSGVO-Datenaufbewahrung und -löschung (36 Schritte)

### **🔴 Niedrige Priorität (Sprint 3+)**
8. **UC-07**: Support-Dashboard und Überwachung (34 Schritte)
9. **UC-08**: Erweiterte Gutachtermitarbeiter-Verwaltung (41 Schritte)

## Technische Details

**Externe Systemintegrationen:**
- eLogin API für Authentifizierung
- rvSMD System für Gutachter-Registry
- rvPuR/rvArchiv für Dokumentenverwaltung
- SMTP für E-Mail-Kommunikation

**Sicherheits- und Compliance-Features:**
- Vollständige Audit-Trail-Protokollierung
- DSGVO-konforme Datenverarbeitung
- Berechtigungsbasierte Zugriffskontrolle
- Sichere Session-Verwaltung

Die nummerierten Schritte ermöglichen eine eindeutige Referenzierung für die technische Implementierung und Testfallentwicklung.