# UC-10: Automatisches PDF-Caching - API Call Traceability Matrix

**Version:** 1.0  
**Datum:** 2025-11-13  
**Status:** Final  

---

## API Call Traceability

Diese Matrix zeigt alle API-Aufrufe und Kommunikationsflüsse zwischen den Teilnehmern in UC-10.

| Schritt | Richtung | Quelle | Ziel | API Call / Operation | Methode | Beschreibung |
|---------|----------|--------|------|---------------------|---------|--------------|
| 01 | RVS->>RVG | rvSMD | rvGutachten | Message Queue Event oder `POST /api/auftraege` | POST/MQ | Neuer Gutachtenauftrag (Auftragsdaten) |
| 02 | RVG->>RVG | rvGutachten | rvGutachten | Internal: `createAuftrag()` | Internal | Auftrag anlegen |
| 03 | RVG->>JOB | rvGutachten | Background Job | Internal: `schedulePdfCachingJob()` | Internal | Dokumentenabruf-Job starten |
| 04 | JOB->>PUR | Background Job | rvPuR | `POST /getVorgangDokIdents` (SOAP) | SOAP | DokumentIDs zu Auftrag abrufen |
| 05 | JOB->>PUR | Background Job | rvPuR | `POST /getDokumentMetainfo` (SOAP) | SOAP | Dokument-Metadaten zu DokumentID abrufen |
| 05 | PUR-->>JOB | rvPuR | Background Job | SOAP Response | Response | Dokument-Metadaten |
| 06 | JOB->>RVA | Background Job | rvArchiv | `POST /getDokument` (SOAP via rvPuR) | SOAP | Dokument-Dateien mit Metadaten-Link abrufen |
| 06 | RVA-->>JOB | rvArchiv | Background Job | SOAP Response (base64+gzip) | Response | Dokument-Datei |
| 07 | JOB->>RVG | Background Job | rvGutachten | Internal: `storePdfInCache()` | Internal | Dokumente im Cache speichern |
| 08 | RVS->>RVG | rvSMD | rvGutachten | `PATCH /api/auftraege/{id}/status` oder MQ Event | PATCH/MQ | Status setzen (aktiv) |

---

## API Spezifikationen

### 1. Neuer Auftrag (Schritt 01)

```typescript
// POST /api/auftraege (oder Message Queue Event)
interface NeuerAuftragRequest {
  auftragsId: string;
  vsnr: string;
  rvPurVorgangsID: string;
  gutachterId: string;
  auftragsDatum: string;
  // ... weitere Auftragsdaten
}

interface NeuerAuftragResponse {
  success: boolean;
  auftragsId: string;
  status: 'created' | 'pending_documents';
}

// Alternative: Message Queue Event
interface OrderCreatedEvent {
  eventId: string;
  eventType: 'ORDER_CREATED';
  timestamp: string;
  payload: NeuerAuftragRequest;
}
```

### 2. DokumentIDs abrufen (Schritt 04)

```typescript
// SOAP: getVorgangDokIdents
interface GetVorgangDokIdentsRequest {
  vorgangsId: string;  // rvPurVorgangsID
}

interface GetVorgangDokIdentsResponse {
  dokumentIDs: string[];  // Liste der IOID
}
```

### 3. Dokument-Metadaten abrufen (Schritt 05)

```typescript
// SOAP: getDokumentMetainfo
interface GetDokumentMetainfoRequest {
  ioid: string;  // Dokument-ID
}

interface GetDokumentMetainfoResponse {
  ioid: string;
  docKlasse: string;
  docKlasseBezeichnung: string;
  datum: string;
  ersteller: string;
  // Daten sind base64+gzip kodiert
}
```

### 4. Dokument-Datei abrufen (Schritt 06)

```typescript
// SOAP: getDokument (via rvPuR zu rvArchiv)
interface GetDokumentRequest {
  ioid: string;
}

interface GetDokumentResponse {
  content: string;  // PDF Binary (base64+gzip)
  contentType: string;  // "application/pdf"
  size: number;
}
```

### 5. PDF im Cache speichern (Schritt 07)

```typescript
// Internal: storePdfInCache
interface StorePdfRequest {
  auftragsId: string;
  dokumentId: string;
  ioid: string;
  content: Buffer;  // Dekodierte PDF-Daten
  metadata: {
    docKlasse: string;
    datum: string;
    size: number;
    hash: string;  // SHA-256
  };
}

interface StorePdfResponse {
  success: boolean;
  documentId: string;
  cachedAt: string;
  storageLocation: 'database' | 'filesystem';
}
```

### 6. Status-Update (Schritt 08)

```typescript
// PATCH /api/auftraege/{id}/status
interface StatusUpdateRequest {
  status: 'aktiv' | 'dokumente_geladen';
  documentsCount?: number;
}

interface StatusUpdateResponse {
  success: boolean;
  auftragsId: string;
  status: string;
  updatedAt: string;
}
```

---

## Datenfluss-Zusammenfassung

### Erfolgreicher PDF-Caching-Ablauf
1. **RVS → RVG**: Neuer Auftrag erstellt
2. **RVG → RVG**: Auftrag anlegen in Datenbank
3. **RVG → JOB**: Background-Job für PDF-Caching starten
4. **JOB → PUR**: Alle DokumentIDs für Vorgang abrufen
5. **Loop für jede DokumentID**:
   - **JOB → PUR**: Metadaten abrufen
   - **JOB → RVA**: PDF-Datei abrufen (via rvPuR)
   - **JOB → RVG**: PDF im Cache speichern
6. **RVS → RVG**: Status auf "aktiv" setzen

### Cache-Refresh bei Aktualisierung
1. **Background Job**: Neue/aktualisierte Dokumente erkennen
2. **JOB → PUR**: Aktualisierte Metadaten abrufen
3. **JOB → RVA**: Neue PDF-Version abrufen
4. **JOB → RVG**: Cache aktualisieren

---

## Business Objects

### Auftrag
- **auftragsId**: Eindeutige ID
- **vsnr**: Versichertennummer
- **rvPurVorgangsID**: Verknüpfung zu rvPuR
- **status**: neu → dokumente_laden → aktiv
- **documentsCount**: Anzahl gecachter PDFs
- **lastSync**: Zeitstempel letzter Sync

### CachedDocument
- **documentId**: Eindeutige ID
- **auftragsId**: Verknüpfung zum Auftrag
- **ioid**: rvPuR/rvArchiv Dokument-ID
- **content**: PDF Binary (BLOB oder File)
- **metadata**: docKlasse, datum, ersteller
- **size**: Dateigröße in Bytes
- **hash**: SHA-256 Prüfsumme
- **cachedAt**: Zeitstempel des Cachings
- **storageType**: 'database' oder 'filesystem'

---

## Systemkürzel

- **RVS**: rvSMD (Auftragsmanagement-System der DRV)
- **RVG**: rvGutachten (Gutachten-System)
- **JOB**: Background Job (Asynchroner Worker)
- **PUR**: rvPuR (Dokumentenmetadaten-Service, SOAP)
- **RVA**: rvArchiv (PDF-Storage-Backend)
- **GUT**: Gutachter (Endbenutzer)

---

## Architektur-Entscheidung: ADR-UC10-01

**Status:** Akzeptiert  
**Kontext:**  
PDF-Dokumente müssen performant und hochverfügbar für Gutachter bereitgestellt werden. Direkter Zugriff auf rvArchiv ist langsam (500-2000ms) und abhängig von Drittsystem-Verfügbarkeit.

**Entscheidung:**  
Alle PDFs werden während der initialen Auftragssynchronisation vollständig in rvGutachten gecacht (Database BLOB oder File System). Gutachter greifen primär auf den lokalen Cache zu.

**Konsequenzen:**  
- **Positiv**: 90-95% schnellere Dokumentenzugriffe (50-100ms), Verfügbarkeit bei rvArchiv-Ausfall
- **Negativ**: Erhöhter Speicherbedarf, längere initiale Sync-Zeit, Cache-Synchronisation erforderlich

---

## Performance-Metriken

| Metrik | Ziel | Messung |
|--------|------|---------|
| **Sync-Dauer pro Auftrag** | < 5 Minuten | Durchschnitt aller Jobs |
| **Cache-Hit-Rate** | > 95% | Lokale vs. rvArchiv-Zugriffe |
| **PDF-Abruf-Zeit (gecacht)** | < 100ms | Response-Time |
| **PDF-Abruf-Zeit (rvArchiv)** | < 2000ms | Fallback Response-Time |
| **Speicherverbrauch** | < 80% Kapazität | Storage Monitoring |
| **Sync-Fehlerrate** | < 5% | Failed Jobs / Total Jobs |

---

## Zusammenfassung

Diese Matrix dokumentiert den vereinfachten PDF-Caching-Workflow in UC-10. Der Prozess umfasst 8 Hauptschritte: Auftragserstellung, Job-Initiierung, Metadaten-Abruf, PDF-Download (Loop), Cache-Speicherung und Status-Update. Alle PDFs werden vollständig gecacht, um Performance und Verfügbarkeit zu garantieren. Das System verwendet SOAP-Schnittstellen zu rvPuR/rvArchiv und speichert PDFs lokal (Database oder Filesystem).

**Total Steps:** 8 (plus Loop für mehrere Dokumente)  
**External SOAP Calls:** 3 (getVorgangDokIdents, getDokumentMetainfo, getDokument)  
**Internal Operations:** 3 (Auftrag anlegen, Job starten, Cache speichern)  
**Status Transitions:** neu → dokumente_laden → aktiv  
**Cache Strategy:** Full PDF caching with 95%+ hit-rate target
