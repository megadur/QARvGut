# UC-01: Datenfluss-Rückverfolgbarkeitsmatrix
## Gutachter-Onboarding-Prozess (Administrierte Registrierung)

**Use Case:** UC-01: Gutachter-Registrierung und -Aktivierung  
**Datum:** November 2025  
**Zweck:** Rückverfolgbarkeit des kompletten Onboarding-Workflows zwischen DRV, eLogin, rvSMD und rvGutachten

**WICHTIG:** Dies ist ein administrierter Prozess - DRV-Mitarbeiter legen Gutachter manuell an, nachdem postalische Formulare eingegangen sind. Der Gutachter selbst registriert sich nicht direkt im System.

---

## Legende

| Symbol | Bedeutung |
|--------|-----------|
| [R] | **Read** - Daten werden gelesen/abgefragt |
| [C] | **Create** - Daten werden erstellt |
| [U] | **Update** - Daten werden aktualisiert |
| [OK] | **Display** - Daten werden dem Benutzer angezeigt |
| [WARN] | **Validate** - Daten werden validiert/geprüft |
| [AUTH] | **Check** - Berechtigungsprüfung |
| [SYNC] | **Synchronize** - Daten werden zwischen Systemen synchronisiert |
| [SEND] | **Transmit** - Daten werden übertragen (E-Mail/Post) |
| - | Nicht beteiligt in diesem Schritt |

---
## Sequenzschritte zu API-Aufrufen Mapping

| Schritt | Aktor | Aktion | API Aufruf | Methode | System |
|---------|-------|--------|------------|---------|--------|
| 1 | Gutachter | Interesse an Teilnahme bekundet | - | Offline | DRV |
| 2 | DRV-MA | Brief zur Datenerhebung versenden | - | Postal | Postservice |
| 3 | Gutachter | Formular ausgefüllt (Name, EFN, E-Mail) | - | Offline | - |
| 4 | Gutachter | Formular per Brief versenden | - | Postal | Postservice |
| 5 | DRV-MA | Daten bei Gutachter in rvSMD ergänzen | `rvSMD Web UI` | Manual | rvSMD |
| 6 | rvSMD | Gutachter in rvGutachten anlegen | `POST /api/v1/gutachter` | POST | rvGutachten API |
| 7 | DRV-MA | Gutachter anlegen Dialog (Name, Vorname, Adresse, E-Mail) | `eLogin Web UI` | Manual | eLogin |
| 8 | eLogin | eLogin-ID + Registrierungscode generieren | Internal Process | - | eLogin |
| 9 | DRV-MA | eLogin-ID am Gutachter ergänzen (Liste+auswählen+eintragen) | `PUT /api/v1/gutachter/{id}/elogin` | PUT | rvGutachten API |
| 10a | eLogin | E-Mail mit Registrierungslink und Registrierungscode versenden | Email Service | - | E-Mail System |
| 10b | DRV-MA | Brief mit Registrierungslink und Registrierungscode versenden (Alt.) | - | Postal | Postservice |
| 12 | rvGutachten | Gutachter anhand Name, Vorname auswählen | `GET /api/v1/gutachter?search=name` | GET | rvGutachten API |
| 13 | rvGutachten | Auswahl der eLoginId anhand Name, Vorname | Internal Mapping | - | rvGutachten |
| 14 | rvGutachten | Verbinden von EFN und eLoginId | `PUT /api/v1/gutachter/{id}/link` | PUT | rvGutachten API |
| 15 | Gutachter | Registrierungslink öffnen | `GET https://elogin.drv.de/activate?code=...` | GET | eLogin |
| 15 | Gutachter | Registrierungscode eingeben | `POST /activate/verify` | POST | eLogin |
| 16 | eLogin | Passwordseite anzeigen | UI Rendering | - | eLogin Frontend |
| 16 | Gutachter | Password vergeben | `POST /activate/password` | POST | eLogin |
| 17 | eLogin | eLogin-Account aktiv | Database Update | - | eLogin DB |

---

## Datenfluss-Matrix: Business Objects × API-Schritte

### Gutachter Business Object

| Attribut | Typ | MVP | S1-4: Postal | S5: rvSMD Entry | S6: Create API | S7-8: eLogin | S9: Link eLogin | S12-14: Mapping & Link | S15-16: Activate | S17: Account Active |
|----------|-----|-----|-------------|----------------|----------------|--------------|----------------|----------------------|-----------------|-------------------|
| **gutachterId** | uuid | 1 | - | - | [C] | - | [R] | [R] | - | [R] |
| **efn** | string(15) | 1 | [OK] | [C] | [C] | - | - | [R] | - | - |
| **anrede** | enum | 1 | [OK] | [C] | [C] | [OK] | - | - | - | - |
| **titel** | string | ? | [OK] | [C] | [C] | [OK] | - | - | - | - |
| **vorname** | string | 1 | [OK] | [C] | [C] | [OK] | - | [R] | - | - |
| **nachname** | string | 1 | [OK] | [C] | [C] | [OK] | - | [R] | - | - |
| **namenszusatz** | string | ? | [OK] | [C] | [C] | - | - | - | - | - |
| **geburtsdatum** | date | ? | [OK] | [C] | [C] | - | - | - | - | - |
| **email** | string | 1 | [OK] | [C] | [C] | [OK] | - | - | - | - |
| **adresse** | object | 1 | [OK] | [C] | [C] | [OK] | - | - | - | - |
| **telefon** | string | ? | [OK] | [C] | [C] | - | - | - | - | - |
| **traegerKtan** | string | 1 | - | [C] | [C] | - | - | - | - | - |
| **eLoginId** | string | 1 | - | - | - | [C] | [R] | [U] | - | [R] |
| **eLoginRegistrierungscode** | string | 1 | - | - | - | [C] | - | - | - | - |
| **status** | enum | 1 | - | - | [C] | - | - | - | [U] | [U] |
| **aktiviertAm** | datetime | 1 | - | - | - | - | - | - | [C] | [C] |
| **angelegtVon** | uuid | 1 | - | - | - | [C] | - | - | - | - |
| **angelegtAm** | datetime | 1 | - | - | - | [C] | - | - | - | - |
| **gesperrtSeit** | datetime | ? | - | - | - | - | - | - | - | [WARN] |
| **gesperrtGrund** | string | ? | - | - | - | - | - | - | - | [WARN] |
| **letzterLogin** | datetime | ? | - | - | - | - | - | - | - | - |

**[CRIT] Kritische Erkenntnisse:**

1. **EFN ist der Primärschlüssel** für die Gutachter-Identifikation zwischen Systemen
   - In rvSMD bekannt
   - Wird von Gutachter im Formular angegeben
   - Muss in rvGutachten eindeutig sein

2. **Dreieck der Verknüpfung:** EFN ↔ eLoginId ↔ gutachterId
   - EFN: Identität in rvSMD
   - eLoginId: Identität in eLogin
   - gutachterId: Identität in rvGutachten
   - Mapping erfolgt in Schritten 12-14

3. **Zweistufiger Aktivierungsprozess:**
   - Phase 1: DRV-MA legt an (Status: "pending")
   - Phase 2: Gutachter aktiviert eLogin (Status: "aktiv" in Schritt 17)

4. **Status-Lifecycle:**
   ```
   [nicht vorhanden] 
        → [pending] (S6: Anlage in rvGutachten)
        → [elogin_pending] (S9: eLogin-ID verknüpft)
        → [aktiv] (S17: eLogin-Account aktiv)
        → [gesperrt] (optional, bei Problemen)
   ```

**WICHTIG:** Der Prozess endet mit Schritt 17 beim eLogin-Account-Aktivierung. Nachfolgende Login- und Session-Management-Schritte sind Teil von UC-02 (System-Authentifizierung).

---

## API-Spezifikationen

### 1. POST /api/v1/gutachter

**Zweck:** Legt neuen Gutachter in rvGutachten an

**Request:**
```json
{
  "efn": "123456789012345",
  "anrede": "Herr",
  "titel": "Dr. med.",
  "vorname": "Max",
  "nachname": "Mustermann",
  "email": "max.mustermann@example.com",
  "adresse": {
    "strasse": "Hauptstr. 1",
    "plz": "10115",
    "ort": "Berlin"
  },
  "telefon": "+49 30 12345678",
  "traegerKtan": "01"
}
```

**Response 201 Created:**
```json
{
  "gutachterId": "550e8400-e29b-41d4-a716-446655440000",
  "efn": "123456789012345",
  "status": "pending",
  "angelegtAm": "2025-11-12T10:30:00Z",
  "angelegtVon": "drv-ma-001",
  "message": "Gutachter erfolgreich angelegt. eLogin-ID muss noch verknüpft werden."
}
```

**Response 409 Conflict:**
```json
{
  "error": "DUPLICATE_EFN",
  "message": "Gutachter mit dieser EFN existiert bereits",
  "existingGutachterId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 2. PUT /api/v1/gutachter/{id}/elogin

**Zweck:** Verknüpft eLogin-ID mit Gutachter-Account

**Request:**
```json
{
  "eLoginId": "EL-2025-123456",
  "eLoginRegistrierungscode": "ABC-DEF-GHI-JKL"
}
```

**Response 200 OK:**
```json
{
  "gutachterId": "550e8400-e29b-41d4-a716-446655440000",
  "efn": "123456789012345",
  "eLoginId": "EL-2025-123456",
  "status": "elogin_pending",
  "message": "eLogin-ID erfolgreich verknüpft. Warte auf Aktivierung durch Gutachter."
}
```

---

### 3. PUT /api/v1/gutachter/{id}/link

**Zweck:** Verknüpft EFN mit eLogin-ID (interne Mapping-Tabelle)

**Request:**
```json
{
  "efn": "123456789012345",
  "eLoginId": "EL-2025-123456"
}
```

**Response 200 OK:**
```json
{
  "gutachterId": "550e8400-e29b-41d4-a716-446655440000",
  "efn": "123456789012345",
  "eLoginId": "EL-2025-123456",
  "linked": true,
  "message": "EFN und eLogin-ID erfolgreich verknüpft"
}
```

---

## Zusätzliche API-Spezifikationen (außerhalb UC-01 Scope)

Die folgenden APIs sind Teil von UC-02 (System-Authentifizierung) und werden hier nur zur Referenz dokumentiert:

### POST /api/v1/webhooks/elogin/activation

**Zweck:** Webhook von eLogin bei erfolgreicher Account-Aktivierung (Optional für zukünftige Integration)

**Request (von eLogin):**
```json
{
  "eLoginId": "EL-2025-123456",
  "activatedAt": "2025-11-12T14:45:00Z",
  "activationType": "EMAIL",
  "verificationMethod": "CODE"
}
```

**Response 200 OK:**
```json
{
  "status": "SUCCESS",
  "gutachterId": "550e8400-e29b-41d4-a716-446655440000",
  "newStatus": "aktiv",
  "message": "Gutachter-Account erfolgreich aktiviert"
}
```

### POST /api/v1/auth/login

**Zweck:** Authentifizierung über eLogin (siehe UC-02)

**Request:**
```json
{
  "eLoginId": "EL-2025-123456",
  "password": "SecurePassword123!"
}
```

**Response 200 OK:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "gutachterId": "550e8400-e29b-41d4-a716-446655440000",
    "vorname": "Max",
    "nachname": "Mustermann",
    "efn": "123456789012345",
    "role": "GUTACHTER",
    "status": "aktiv"
  }
}
```

---

## Mermaid-Diagramme

### 1. Kompletter Onboarding-Flow

```mermaid
sequenceDiagram
    actor GUT as Gutachter
    actor DRV as DRV-Mitarbeiter (8023)
    participant SMD as rvSMD System
    participant ELG as eLogin System
    participant RVG as rvGutachten System
    participant POST as Postservice
    participant EML as E-Mail Service
    
    Note over GUT,EML: UC-01 Version 4: administrierte Registrierung kompakt
    
    %% Phase 1: Initiale Interessensbekundung
    GUT->>DRV: 01. Interesse an Teilnahme bekundet
    DRV->>POST: 02. Brief zur Datenerhebung versenden
    POST-->>GUT: Brief erhalten
    
    %% Phase 2: Datensammlung
    GUT->>GUT: 03. Formular ausgefüllt<br/>(Name, EFN, E-Mail)
    GUT->>POST: 04. Formular per Brief versenden
    POST-->>DRV: Formular erhalten
    
    %% Phase 3: System-Setup durch Admin
    DRV->>SMD: 05. Daten bei Gutachter ergänzen
    SMD->>RVG: 06. Gutachter anlegen API<br/>(Name, Vorname, EFN, Träger KTAN)
    
    %% Phase 4: eLogin Account Creation
    DRV->>ELG: 07. Gutachter anlegen Dialog<br/>(Name, Vorname, Adresse, E-Mail)
    ELG->>ELG: 08. eLogin-ID + Registrierungscode generieren
    ELG-->>DRV: eLogin-ID + Registrierungscode erstellt
    DRV->>RVG: 09. eLogin-ID am Gutachter ergänzen<br/>(Liste+auswählen+eintragen)
    
    %% Phase 5: Data Verification & Linking
    alt Versand per E-Mail
        ELG->>EML: 10. E-Mail mit Registrierungslink und Registrierungscode
        EML-->>GUT: E-Mail erhalten
    else Versand per Brief
        DRV->>POST: 11. Brief mit Registrierungslink und Registrierungscode
        POST-->>GUT: Brief erhalten
    end
    
    RVG->>RVG: 12. Gutachter anhand Name, Vorname auswählen
    RVG->>RVG: 13. Auswahl der eLoginId anhand Name, Vorname
    RVG->>RVG: 14. Verbinden von EFN und eLoginId
    
    %% Phase 6: Initial eLogin Activation
    GUT->>ELG: 15. Registrierungslink öffnen
    GUT->>ELG: Registrierungscode eingeben
    ELG->>GUT: 16. Passwordseite anzeigen
    GUT->>ELG: Password vergeben
    ELG->>ELG: 17. eLogin-Account aktiv
    
    Note over GUT,EML: Prozess endet hier. Login ist UC-02
```


---

## Zusätzliche API-Spezifikationen (außerhalb UC-01 Scope)

Die folgenden APIs sind Teil von UC-02 (System-Authentifizierung) und werden hier nur zur Referenz dokumentiert:

### POST /api/v1/webhooks/elogin/activation

**Zweck:** Webhook von eLogin bei erfolgreicher Account-Aktivierung (Optional für zukünftige Integration)

**Request (von eLogin):**
```json
{
  "eLoginId": "EL-2025-123456",
  "activatedAt": "2025-11-12T14:45:00Z",
  "activationType": "EMAIL",
  "verificationMethod": "CODE"
}
```

### POST /api/v1/auth/login
```json

**Zweck:** Authentifizierung über eLogin (siehe UC-02)
```

---

## Architecture Decision Records (ADRs)

### ADR-001: Administrierter Onboarding-Prozess

**Status:** Accepted  
**Kontext:** Gutachter können sich nicht selbst im System registrieren.

**Entscheidung:**  
- Postalischer Prozess für initiale Datenerhebung
- DRV-Mitarbeiter legen Gutachter in rvSMD und rvGutachten an
- eLogin-Account wird manuell durch DRV-MA erstellt
- Verknüpfung EFN ↔ eLoginId erfolgt manuell

**Konsequenzen:**
- ➕ Hohe Datenqualität durch manuelle Prüfung
- ➕ DSGVO-konform (explizite Einwilligung)
- ➖ Zeitaufwändig (5-10 Werktage pro Gutachter)
- ➖ Anfällig für manuelle Fehler

**Mitigation:**
- Dubletten-Prüfung bei EFN und E-Mail
- UI-Validierung in rvSMD/rvGutachten
- Automatische Benachrichtigungen bei jedem Schritt

---

### ADR-002: EFN als Primärschlüssel für System-Verknüpfung

**Status:** Accepted  
**Kontext:** Drei Systeme (rvSMD, eLogin, rvGutachten) müssen denselben Gutachter identifizieren.

**Entscheidung:**  
- EFN (Einheitliche Fortbildungsnummer) ist der natürliche Schlüssel
- Jedes System hat eigenen technischen Schlüssel (UUID, eLoginId)
- Mapping-Tabelle in rvGutachten verknüpft alle Identifier

**Konsequenzen:**
- ➕ EFN ist stabil und unveränderlich
- ➕ Eindeutige Identifikation über Systemgrenzen
- ➖ EFN kann sensibles Datum sein (DSGVO-relevant)
- ➖ Manuelle Verknüpfung erforderlich

---

### ADR-003: Fokus auf Account-Aktivierung (UC-01 Scope)

**Status:** Accepted  
**Kontext:** UC-01 deckt nur die Registrierung und Account-Aktivierung ab. Login-Prozesse gehören zu UC-02.

**Entscheidung:**  
- UC-01 endet mit eLogin-Account-Aktivierung (Schritt 17)
- Webhook-Integration für Statusänderungen ist optional (zukünftige Erweiterung)
- Login und Session-Management sind Teil von UC-02
- EFN↔eLoginId Mapping erfolgt in Schritten 12-14

**Konsequenzen:**
- ➕ Klare Abgrenzung zwischen UC-01 und UC-02
- ➕ Einfacherer MVP-Scope für UC-01
- ➕ Webhook-Integration kann später nachgerüstet werden
- ➖ Status-Synchronisation zwischen eLogin und rvGutachten muss anderweitig gelöst werden

---

### ADR-004: JWT-basierte Authentifizierung (UC-02)

**Status:** Accepted  
**Kontext:** Login-Prozess ist nicht Teil von UC-01, wird in UC-02 behandelt.

**Verweis:** Siehe UC-02 (System-Authentifizierung)

---

## Performance-Anforderungen

| Operation | Target | Max | Begründung |
|-----------|--------|-----|------------|
| POST /gutachter | < 500ms | 1s | Häufigkeit: ~20/Tag, unkritisch |
| PUT /elogin | < 300ms | 500ms | DB Update only |
| PUT /link | < 200ms | 300ms | Mapping-Tabelle Update |
| GET /gutachter?search | < 500ms | 1s | Inkl. LIKE-Query (optimiert mit Index) |

---

## MVP-Abdeckung

| Anforderung | Abgedeckt | Bemerkung |
|-------------|-----------|-----------|
| EFN-basierte Identifikation | ✅ | ADR-002 |
| Administrierte Registrierung | ✅ | ADR-001 |
| eLogin-Integration | ✅ | Schritte 7-9, 15-17 |
| EFN↔eLoginId Mapping | ✅ | Schritte 12-14 |
| Status-Tracking | ✅ | pending → elogin_pending → aktiv (S17) |
| DSGVO-Konformität | ✅ | Verschlüsselung sensibler Daten |
| Dubletten-Prüfung | ✅ | EFN + E-Mail Unique Constraints |
| Audit-Trail | ✅ | Alle kritischen Operationen |
| Postal/Email Kommunikation | ✅ | Schritte 2, 4, 10a/10b |
| eLogin Account Aktivierung | ✅ | Schritte 15-17 |

**Status:** 10/10 MVP-Anforderungen erfüllt ✅

**Hinweis:** Login- und Session-Management (frühere Schritte 19-27) sind jetzt Teil von UC-02

---

## Quellverweise

**User Stories:**
- US-RL.01: Registrierung Gutachter (Hauptstory)
- US-RL.04: Registrierung Gutachter beantragen (DRV-MA-Perspektive)
- US-RL.05: Registrierung Gutachter prüfen (DRV-MA-Perspektive)

**Verwandte Use Cases:**
- UC-02: System-Authentifizierung (Login-Flow)
- UC-03: DRV-Mitarbeiter-Zugriffsverwaltung (Admin-Prozesse)

**Architektur:**
- `/docs/architecture/domain-model.drawio` (Gutachter Entity)
- `/docs/architecture/brownfield-architecture-enhanced-user-management.md` (API Design)

**Externe Systeme:**
- eLogin: Authentifizierungsservice der DRV
- rvSMD: Stammdatenverwaltung

---

**Dokument-Ende**
