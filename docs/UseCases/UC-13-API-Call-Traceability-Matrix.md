# UC-13: Auftragsstornierung durch DRV - API Call Traceability Matrix

**Version:** 1.0  
**Datum:** 2025-11-13  
**Status:** Final  

---

## API Call Traceability

Diese Matrix zeigt alle API-Aufrufe und Kommunikationsflüsse zwischen den Teilnehmern in UC-13.

| Schritt | Richtung | Quelle | Ziel | API Call / Operation | Methode | Beschreibung |
|---------|----------|--------|------|---------------------|---------|--------------|
| 01 | M->>SMD | 8023-MA | rvSMD | `GET /auftraege` oder UI Navigation | GET | Öffnet Auftragsverwaltung |
| 02 | M->>SMD | 8023-MA | rvSMD | `POST /auftraege/{id}/status` | POST | Wählt Auftrag & neuen Status (z.B. storniert) |
| 03 | SMD->>SMD | rvSMD | rvSMD | Internal: `validateStatusTransition()` | Internal | Prüft Berechtigung & Statusübergang |
| 04 | SMD->>SMD | rvSMD | rvSMD | Internal: `updateStatus()` + `auditLog.create()` | Internal | Setzt neuen Status & Audit-Log |
| 05 | SMD->>RVG | rvSMD | rvGutachten | `POST /api/sync/auftrag-status` oder Message Queue Event | POST/MQ | Synchronisiere Statusänderung |
| 06 | SMD-->>M | rvSMD | 8023-MA | `HTTP 500` oder Error Response | Response | Fehlermeldung Synchronisationsfehler |
| 07 | SMD->>AM | rvSMD | Audit Manager | `POST /audit/log` Event: SYNC_ERROR | POST | Protokollierung Synchronisationsfehler |
| 08 | RVG->>RVG | rvGutachten | rvGutachten | Internal: `applyStatusUpdate()` | Internal | Übernimmt Status automatisch |
| 09 | SMD-->>M | rvSMD | 8023-MA | `HTTP 200` Success Response | Response | Bestätigung |
| 10 | SMD->>ES | rvSMD | E-Mail System | `POST /email/send` | POST | Benachrichtigung erzeugen |
| 12 | ES-->>G | E-Mail System | Gutachter | SMTP E-Mail Delivery | SMTP | Benachrichtigung empfangen |
| 13 | SMD-->>M | rvSMD | 8023-MA | `HTTP 400` Bad Request | Response | Fehlermeldung Ungültiger Übergang |
| 14 | SMD->>AM | rvSMD | Audit Manager | `POST /audit/log` Event: INVALID_TRANSITION | POST | Protokollierung Ungültiger Übergang |

---

## API Spezifikationen

### 1. Status-Update Request (Schritt 02)

```typescript
// POST /auftraege/{auftragsId}/status
interface StatusUpdateRequest {
  neuerStatus: 'storniert' | 'abgeschlossen' | 'in_bearbeitung' | 'zugewiesen';
  grund?: string;  // Optional: Begründung für Statusänderung
  geaendertVon: string;  // User ID des 8023-Mitarbeiters
}

interface StatusUpdateResponse {
  success: boolean;
  auftragsId: string;
  alterStatus: string;
  neuerStatus: string;
  timestamp: string;
  syncStatus: 'pending' | 'synced' | 'failed';
}
```

### 2. Synchronisation zu rvGutachten (Schritt 05)

```typescript
// POST /api/sync/auftrag-status
interface AuftragStatusSyncRequest {
  auftragsId: string;
  vsnr: string;
  alterStatus: string;
  neuerStatus: string;
  geaendertAm: string;
  geaendertVon: string;
  grund?: string;
}

interface AuftragStatusSyncResponse {
  success: boolean;
  auftragsId: string;
  rvGutachtenAuftragsId: string;
  syncedAt: string;
}

// Alternative: Message Queue Event
interface AuftragStatusChangedEvent {
  eventId: string;
  eventType: 'AUFTRAG_STATUS_CHANGED';
  timestamp: string;
  payload: {
    auftragsId: string;
    vsnr: string;
    alterStatus: string;
    neuerStatus: string;
    geaendertVon: string;
    grund?: string;
  };
}
```

### 3. E-Mail-Benachrichtigung (Schritt 10)

```typescript
// POST /email/send
interface EmailNotificationRequest {
  to: string;  // Gutachter E-Mail
  subject: string;
  templateId: 'auftrag-storniert';
  data: {
    gutachterName: string;
    auftragsId: string;
    vsnr: string;
    storniertAm: string;
    grund?: string;
  };
}

interface EmailNotificationResponse {
  success: boolean;
  messageId: string;
  sentAt: string;
}
```

### 4. Audit-Log (Schritte 07, 14)

```typescript
// POST /audit/log
interface AuditLogRequest {
  eventType: 'SYNC_ERROR' | 'INVALID_TRANSITION' | 'STATUS_CHANGED';
  severity: 'error' | 'warning' | 'info';
  userId: string;
  action: string;
  resource: {
    type: 'auftrag';
    id: string;
  };
  metadata: {
    alterStatus?: string;
    neuerStatus?: string;
    errorMessage?: string;
    [key: string]: any;
  };
  timestamp: string;
}

interface AuditLogResponse {
  logId: string;
  recorded: boolean;
}
```

---

## Datenfluss-Zusammenfassung

### Erfolgreicher Stornierungsablauf
1. **M → SMD**: POST Status-Update Request
2. **SMD → SMD**: Validierung & Speicherung
3. **SMD → RVG**: Synchronisation
4. **RVG → RVG**: Status-Update übernehmen
5. **SMD → M**: Success Response
6. **SMD → ES**: E-Mail-Trigger
7. **ES → G**: E-Mail-Zustellung

### Fehlerfall: Synchronisationsfehler
1. **M → SMD**: POST Status-Update Request
2. **SMD → SMD**: Validierung & Speicherung
3. **SMD → RVG**: Synchronisation (fehlgeschlagen)
4. **SMD → M**: Error Response (500)
5. **SMD → AM**: Audit-Log SYNC_ERROR

### Fehlerfall: Ungültiger Statusübergang
1. **M → SMD**: POST Status-Update Request
2. **SMD → SMD**: Validierung (fehlgeschlagen)
3. **SMD → M**: Error Response (400)
4. **SMD → AM**: Audit-Log INVALID_TRANSITION

---

## Systemkürzel

- **M**: 8023-Mitarbeiter (DRV-Mitarbeiter mit Auftragsverwaltung)
- **G**: Gutachter
- **SMD**: rvSMD-System (Auftragsmanagement-System der DRV)
- **RVG**: rvGutachten-System
- **ES**: E-Mail System
- **AM**: Audit Manager

---

## Zusammenfassung

Diese Matrix dokumentiert alle 14 API-Aufrufe und Kommunikationsflüsse in UC-13 (Auftragsstornierung durch DRV). Der Hauptablauf umfasst 7 API-Calls im Erfolgsfall, mit zusätzlichen Fehlerbehandlungs-Pfaden für Synchronisationsfehler und ungültige Statusübergänge. Alle kritischen Operationen werden im Audit-Log protokolliert, und Gutachter werden asynchron per E-Mail über Statusänderungen benachrichtigt.

**Total API Calls:** 14  
**Success Path:** 7 Calls  
**Error Paths:** 2 alternative Fehlerszenarien  
**API Specifications:** 4 (Status-Update, Sync, E-Mail, Audit)
