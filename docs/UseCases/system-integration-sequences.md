# QARvGut System-Integration Sequenzdiagramme

**Dokument Version:** 1.0  
**Projekt:** QARvGut Enhanced User Management  
**Typ:** System-Integration Dokumentation  
**Erstellt:** 16. Oktober 2025  

---

## Übersicht

Diese Dokumentation zeigt die System-Integration zwischen rvGutachten, rvSMD und externen Systemen durch detaillierte Sequenzdiagramme.

## API-Integration Patterns

### Bidirektionale Kommunikation:
- **rvGutachten → rvSMD**: `rvsmd-openapi.yaml` (von rvSMD bereitgestellt)
- **rvSMD → rvGutachten**: `rvgutachten-openapi.yaml` (von rvGutachten bereitgestellt)

---

## UC-01a: Selbst-Registrierung Workflow

**Basierend auf**: UC-01.md (Modernisierter Ansatz)

```mermaid
sequenceDiagram
    participant G as Gutachter
    participant RVG as rvGutachten<br/>System
    participant EL as eLogin<br/>API
    participant RVS as rvSMD<br/>System
    participant DRV as DRV-Mitarbeiter
    participant EMAIL as E-Mail<br/>Service
    
    Note over G,EMAIL: Selbst-Registrierung Workflow (Zielzustand)
    
    G->>+RVG: Registrierungsseite aufrufen
    RVG-->>-G: Formular anzeigen
    
    G->>+RVG: Formular ausfüllen<br/>(Name, E-Mail, EFN)
    RVG->>RVG: Eingaben validieren
    
    Note over RVG,RVS: Externe Validierung
    RVG->>+EL: Identität prüfen
    EL-->>-RVG: Validierungsresultat
    
    RVG->>+RVS: GET /gutachter/{efn}/status
    RVS-->>-RVG: Status: nicht_vorhanden/aktiv/gesperrt
    
    alt Gutachter bereits registriert
        RVG-->>G: ❌ A2: Hinweis auf bestehenden Account
    else eLogin/rvSMD nicht erreichbar
        RVG-->>G: ❌ A3: Registrierung temporär gesperrt
    else Validierung erfolgreich
        RVG->>RVG: Account erstellen (Status: pending)
        RVG->>+EMAIL: DRV-Mitarbeiter benachrichtigen
        EMAIL-->>-RVG: Benachrichtigung versendet
        
        Note over DRV: Manuelle Prüfung
        DRV->>+RVG: Berechtigung prüfen<br/>in internen Systemen
        
        alt DRV lehnt ab
            RVG->>RVG: Account deaktivieren
            RVG->>+EMAIL: ❌ A4: Gutachter informieren
            EMAIL-->>-G: Ablehnungsmail
        else DRV genehmigt
            RVG->>+RVS: POST /gutachter<br/>(Gutachter-Daten)
            RVS-->>-RVG: 202 Accepted
            
            RVG->>RVG: Aktivierungscode generieren
            RVG->>+EMAIL: Code per E-Mail senden
            EMAIL-->>-G: Aktivierungscode
            
            G->>+RVG: Aktivierungscode eingeben
            
            alt Code falsch (max 3 Versuche)
                RVG-->>G: ❌ A5: Erneute Eingabe
            else Code korrekt
                RVG->>RVG: Account aktivieren
                RVG->>+RVS: POST /gutachter/{efn}/status<br/>(Status: aktiv)
                RVS-->>-RVG: 202 Accepted
                
                RVG->>RVG: Audit-Log erstellen
                RVG-->>-G: ✅ Account aktiv, Vollzugriff gewährt
            end
        end
    end
```

---

## UC-01b: Admin-verwalteter Workflow

**Basierend auf**: UC-01_sequence.md (Aktueller Zustand)

```mermaid
sequenceDiagram
    participant A as 8023<br/>(DRV-Admin)
    participant EL as eLogin<br/>System
    participant RVS as rvSMD<br/>System
    participant RVG as rvGutachten<br/>System
    participant POST as Post-<br/>service
    participant G as Gutachter
    
    Note over A,G: Admin-verwalteter Workflow (Aktueller Zustand)
    
    A->>+EL: 1. Gutachter in eLogin anlegen
    EL->>EL: 2. eLogin-ID generieren
    EL-->>-A: eLogin-ID erstellt
    
    A->>+RVS: 3. EFN beim Gutachter eintragen
    RVS-->>-A: EFN gespeichert
    
    A->>+RVG: 4. Neuen Gutachter mit<br/>Registrierungs-Daten anlegen
    RVG->>RVG: 5. Aktivierungscode erzeugen<br/>und mit EFN verknüpfen
    RVG-->>-A: Gutachter angelegt
    
    RVG->>+POST: 6. Aktivierungscode per Brief versenden
    POST-->>-G: 7. Brief mit Aktivierungscode
    
    Note over G,RVG: Gutachter-Aktivierung
    G->>+EL: 8. Gutachter loggt sich ein
    EL->>EL: Authentifizierung
    EL->>+RVG: 9. eLogin-Token übergeben
    
    G->>RVG: 10. Aktivierungscode und EFN eingeben<br/>(nach erstem Einloggen)
    RVG->>RVG: Code und EFN validieren
    RVG->>RVG: 11. EFN mit eLogin-ID verknüpfen
    
    RVG->>+RVS: 12. Status der Registrierung übergeben<br/>POST /gutachter/{efn}/status
    RVS-->>-RVG: Status aktualisiert
    
    Note over A,RVS: Abschluss
    A->>RVS: 13. Status der Registrierung eintragen
    RVG-->>-G: ✅ Gutachter erfolgreich aktiviert
```

---

## UC-04: Auftragsverwaltung Integration

**Neue Aufträge von rvSMD zu rvGutachten**

```mermaid
sequenceDiagram
    participant RVS as rvSMD<br/>System
    participant RVG as rvGutachten<br/>System
    participant G as Gutachter
    participant EMAIL as E-Mail<br/>Service
    
    Note over RVS,EMAIL: Neuer Auftrag Workflow
    
    RVS->>RVS: Neuer Gutachtenauftrag erstellt
    
    RVS->>+RVG: POST /gutachtenauftraege<br/>(Auftragsdaten)
    Note over RVS,RVG: API: rvgutachten-openapi.yaml
    RVG->>RVG: Auftrag validieren und speichern
    RVG-->>-RVS: 202 Accepted
    
    RVG->>RVG: Gutachter ermitteln (EFN)
    RVG->>+EMAIL: Benachrichtigung senden<br/>"Neuer Auftrag zugewiesen"
    EMAIL-->>-G: E-Mail Benachrichtigung
    
    Note over G,RVG: Gutachter arbeitet mit Auftrag
    G->>+RVG: Auftragsübersicht aufrufen
    RVG-->>-G: Auftragsliste anzeigen
    
    G->>+RVG: Auftragsstatus ändern<br/>("in_bearbeitung")
    RVG->>RVG: Status aktualisieren
    
    opt Status-Synchronisation
        RVG->>+RVS: POST /gutachtenauftraege/{fcId}/status<br/>(Status Update)
        Note over RVG,RVS: API: rvsmd-openapi.yaml  
        RVS-->>-RVG: 202 Accepted
    end
    
    RVG-->>-G: Status aktualisiert
```

---

## UC-06: E-Mail-Benachrichtigungssystem

**Event-driven Notification Workflow**

```mermaid
sequenceDiagram
    participant SYS as System<br/>Events
    participant RVG as rvGutachten<br/>E-Mail Service
    participant SMTP as SMTP<br/>Server
    participant G as Gutachter
    participant DRV as DRV-<br/>Mitarbeiter
    
    Note over SYS,DRV: Automatische E-Mail Workflows
    
    par Neuer Auftrag Event
        SYS->>+RVG: Event: Neuer Auftrag zugewiesen
        RVG->>RVG: Template laden<br/>"Neuer Auftrag"
        RVG->>RVG: Platzhalter ersetzen<br/>{{gutachter_name}}, {{auftrag_nummer}}
        RVG->>+SMTP: E-Mail senden
        SMTP-->>-G: "Neuer Auftrag zugewiesen"
        RVG->>RVG: Versand protokollieren
        RVG-->>-SYS: Event verarbeitet
    and Status-Änderung Event  
        SYS->>+RVG: Event: Auftragsstatus geändert
        RVG->>RVG: Template laden<br/>"Status geändert"
        RVG->>+SMTP: E-Mail senden
        SMTP-->>-G: "Status aktualisiert"
        RVG-->>-SYS: Event verarbeitet
    and Mahnung Event
        SYS->>+RVG: Event: Mahnung eingegangen
        RVG->>RVG: Template laden<br/>"Prioritäts-Mahnung"
        RVG->>+SMTP: Prioritäts-E-Mail
        SMTP-->>-G: "Mahnung - Dringend"
        RVG-->>-SYS: Event verarbeitet
    end
    
    Note over RVG: Konfigurierbare Einstellungen
    DRV->>+RVG: Template-Konfiguration
    RVG->>RVG: E-Mail Templates aktualisieren
    RVG-->>-DRV: Konfiguration gespeichert
    
    alt Versand-Fehler
        RVG->>+SMTP: E-Mail senden
        SMTP-->>-RVG: ❌ Fehler (ungültige Adresse)
        RVG->>RVG: Retry-Mechanismus (3x)
        RVG->>RVG: Fehlerhafte Adresse markieren
        RVG->>+DRV: Fehler-Report senden
        DRV-->>-RVG: Report erhalten
    end
```

---

## Error Handling Patterns

**Typische Fehlerbehandlung bei API-Integration**

```mermaid
sequenceDiagram
    participant RVG as rvGutachten
    participant RVS as rvSMD<br/>API
    participant RETRY as Retry<br/>Service
    participant LOG as Error<br/>Logging
    participant ADMIN as System<br/>Admin
    
    Note over RVG,ADMIN: API-Fehlerbehandlung Patterns
    
    RVG->>+RVS: POST /gutachter/{efn}/status
    
    alt Erfolgreiche Antwort
        RVS-->>-RVG: 202 Accepted
        RVG->>LOG: Success Log schreiben
    else Temporärer Fehler (5xx)
        RVS-->>RVG: 503 Service Unavailable
        RVG->>+RETRY: In Retry-Queue einreihen
        RETRY->>RETRY: Exponential Backoff<br/>(1s, 2s, 4s, 8s)
        
        loop Max 3 Versuche
            RETRY->>+RVS: Retry Request
            alt Erfolg
                RVS-->>-RETRY: 202 Accepted
                RETRY-->>RVG: ✅ Erfolg nach Retry
            else Weiterhin Fehler
                RVS-->>-RETRY: 503 Service Unavailable
                RETRY->>RETRY: Nächster Versuch warten
            end
        end
        
        opt Alle Versuche fehlgeschlagen
            RETRY->>LOG: ❌ Permanent Error Log
            RETRY->>+ADMIN: Alert: API nicht erreichbar
            ADMIN-->>-RETRY: Alert empfangen
        end
        
        RETRY-->>-RVG: Final Status
    else Client Fehler (4xx)
        RVS-->>-RVG: 400 Bad Request
        RVG->>LOG: ❌ Client Error (keine Retry)
        RVG->>+ADMIN: Sofortiger Alert<br/>Daten-Validierungsfehler
        ADMIN-->>-RVG: Alert empfangen
    end
```

---

## Performance und Monitoring

**System-Performance Überwachung**

```mermaid
sequenceDiagram
    participant MON as Monitoring<br/>Service
    participant RVG as rvGutachten<br/>System
    participant RVS as rvSMD<br/>System
    participant DASH as Support<br/>Dashboard
    participant ALERT as Alert<br/>System
    
    Note over MON,ALERT: Performance Monitoring
    
    loop Alle 30 Sekunden
        MON->>+RVG: Health Check
        RVG->>RVG: Interne Systeme prüfen
        RVG-->>-MON: Status + Metriken
        
        MON->>+RVS: API Health Check
        RVS-->>-MON: API Status
        
        MON->>MON: Metriken aggregieren
        
        alt Performance OK
            MON->>DASH: ✅ Status Update (grün)
        else Warnung (Response Time > 3s)
            MON->>DASH: ⚠️ Warning (gelb)
            MON->>+ALERT: Performance Warning
            ALERT-->>-MON: Warning versendet
        else Kritisch (System nicht erreichbar)
            MON->>DASH: ❌ Critical (rot)
            MON->>+ALERT: Critical Alert
            ALERT->>ALERT: Sofort-Benachrichtigung<br/>an Bereitschaft
            ALERT-->>-MON: Alert versendet
        end
    end
    
    Note over DASH: Support Dashboard Metriken
    DASH->>DASH: Anzeige aktualisieren:<br/>- Response Zeiten<br/>- API Verfügbarkeit<br/>- Aktive Sessions<br/>- Fehlerrate<br/>- Integration Status
```

---

## Datenfluss Übersicht

**Zusammenfassung der System-Integrationen**

| Integration | API Endpoint | Zweck | Fehlerbehandlung |
|-------------|--------------|-------|------------------|
| **rvGutachten → rvSMD** | `POST /gutachter/{efn}/status` | Status-Updates | Retry mit Backoff |
| **rvGutachten → rvSMD** | `POST /gutachtenauftraege/{fcId}/gutachten/eingang` | Gutachten-Eingang | Retry mit Backoff |
| **rvSMD → rvGutachten** | `POST /gutachter` | Gutachter erstellen | Validierung + Alert |
| **rvSMD → rvGutachten** | `GET /gutachter/{efn}/status` | Status abfragen | Cache + Timeout |
| **rvSMD → rvGutachten** | `POST /gutachtenauftraege` | Neue Aufträge | Queue + Retry |

---

## Implementierung Empfehlungen

### 1. **API Client Konfiguration**
```yaml
retry:
  max_attempts: 3
  backoff: exponential
  initial_delay: 1s
  max_delay: 30s

timeout:
  connect: 5s
  read: 30s
  
circuit_breaker:
  failure_threshold: 5
  recovery_timeout: 60s
```

### 2. **Monitoring Alerts**
- Response Time > 3s → Warning
- Error Rate > 5% → Warning  
- API Unavailable → Critical
- Circuit Breaker Open → Critical

### 3. **Audit Logging**
- Alle API Calls protokollieren
- Request/Response IDs für Tracing
- Performance Metriken sammeln
- Fehler mit Context loggen

---

**Dokumentation erstellt:** 16. Oktober 2025  
**Nächste Überprüfung:** Bei API-Änderungen oder System-Updates
