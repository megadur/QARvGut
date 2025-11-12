# rvGutachten REST API Specification
## rvPuR Document Integration Endpoints

**API Version:** v1  
**Base URL:** `https://rvgutachten.drv.de/api/v1`  
**Date:** November 2025  
**Status:** Draft

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Response Codes](#common-response-codes)
4. [Endpoints](#endpoints)
   - [Document Retrieval](#document-retrieval)
   - [Document Content](#document-content)
   - [Document Sync](#document-sync)
   - [Cache Management](#cache-management)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)

---

## Overview

This API provides access to medical documents retrieved from rvPuR for Gutachtenaufträge (expert assessment orders). All endpoints implement caching, circuit breaker patterns, and graceful degradation for resilience.

**Key Features:**
- Document metadata retrieval from rvPuR
- PDF content streaming from rvArchiv
- Automatic caching (5-minute TTL)
- Circuit breaker for rvPuR failures
- Stale-while-revalidate fallback

---

## Authentication

All API requests require Bearer token authentication:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Claims:**
- `sub`: User ID
- `role`: User role (e.g., "gutachter", "sachbearbeiter")
- `exp`: Expiration timestamp

---

## Common Response Codes

| Status Code | Meaning |
|-------------|---------|
| `200 OK` | Request successful |
| `304 Not Modified` | Resource not modified (ETag match) |
| `400 Bad Request` | Invalid request parameters |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Insufficient permissions |
| `404 Not Found` | Resource not found |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Server error |
| `503 Service Unavailable` | rvPuR or rvArchiv unavailable |

---

## Endpoints

### Document Retrieval

#### GET /gutachtenauftraege/{auftragsId}/dokumente

Retrieves all medical documents for a specific Gutachtenauftrag from rvPuR.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `auftragsId` | UUID | Yes | Unique identifier of the Gutachtenauftrag |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeArbeitsakte` | boolean | No | `true` | Filter by Arbeitsakte (pension cases only) |
| `refresh` | boolean | No | `false` | Force cache refresh |
| `aktenart` | string | No | - | Filter by Aktenart (e.g., "04" for Sozialmedizin) |
| `fromDate` | date | No | - | Filter documents from date (ISO 8601) |
| `toDate` | date | No | - | Filter documents to date (ISO 8601) |

**Request Example:**

```http
GET /api/v1/gutachtenauftraege/123e4567-e89b-12d3-a456-426614174000/dokumente?includeArbeitsakte=true&aktenart=04 HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer eyJhbGc...
Accept: application/json
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Response 200 OK:**

```json
{
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "dokumente": [
    {
      "documentId": "doc-001",
      "purIOID": "8879b4a2a9b6491898f51b1f6001e74d",
      "purArchivPID": "93 3 ICM8 ENTEXXLS13 purRVDokument59 26 A3001001A23G20B90034I0493118",
      "purDocKlasse": "23",
      "docKlasseBezeichnung": "Reha-Entlassungsbericht",
      "aktenart": "04",
      "aktenartBezeichnung": "Sozialmedizin",
      "aktenteil": "18",
      "aktenteilBezeichnung": "Medizinische Leistungen zur Rehabilitation",
      "aktenteilNr": "01",
      "bezeichnung": null,
      "datum": "2023-07-20",
      "seiten": 4,
      "format": "application/pdf",
      "importDatum": "2023-07-20T10:13:54.910Z",
      "hasNotes": false,
      "hasAnnotations": false,
      "isDeleted": false,
      "producer": "KlinikDS",
      "modifier": "Dienst (PURBATCH-2742)",
      "modifierDate": "2023-07-20T00:00:00Z",
      "_links": {
        "self": {
          "href": "/api/v1/dokumente/doc-001"
        },
        "content": {
          "href": "/api/v1/dokumente/doc-001/content"
        }
      }
    }
  ],
  "metadata": {
    "rvPurVorgangsID": 116722,
    "rvPurVorgangKennung": "V220000039RV01",
    "rvPurAuftragsID": 134569,
    "rvPurAuftragsKennung": "A250000002RVX1",
    "arbeitsakte": {
      "id": "cc2adbb8-3eef-447d-a9bf-f82c17ad1a2a",
      "titel": "Test Arbeitsakte",
      "dokumenteAnzahl": 1
    },
    "lastSync": "2025-11-12T14:30:00Z",
    "source": "rvPuR",
    "cacheStatus": "hit"
  },
  "_pagination": {
    "total": 1,
    "offset": 0,
    "limit": 100
  }
}
```

**Response Headers:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: private, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699800000
```

**Response 304 Not Modified:**

```http
HTTP/1.1 304 Not Modified
Cache-Control: private, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Response 404 Not Found:**

```json
{
  "error": "ORDER_NOT_FOUND",
  "message": "Gutachtenauftrag nicht gefunden",
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-11-12T14:30:00Z",
  "path": "/api/v1/gutachtenauftraege/123e4567-e89b-12d3-a456-426614174000/dokumente"
}
```

**Response 503 Service Unavailable:**

```json
{
  "error": "RVPUR_UNAVAILABLE",
  "message": "rvPuR ist derzeit nicht erreichbar. Bitte versuchen Sie es später erneut.",
  "retryAfter": 300,
  "timestamp": "2025-11-12T14:30:00Z",
  "path": "/api/v1/gutachtenauftraege/123e4567-e89b-12d3-a456-426614174000/dokumente",
  "details": {
    "service": "rvPuR",
    "circuitBreaker": "OPEN",
    "lastFailure": "2025-11-12T14:29:45Z"
  }
}
```

**Business Logic:**

1. Load Auftrag from database → Extract VSNR
2. Check cache: `dokumente:{auftragsId}` (metadata only)
3. On cache miss:
   - Call `VorgangService.sucheVorgaenge(purAnkerID=VSNR)`
   - Identify relevant Vorgang (business logic: LEAT, date)
   - Call `VorgangService.getVorgangDokIdents(vorgangsId)`
   - For each IOID: Call `DokumentService.getDokumentMetainfo(IOID)`
   - Optional: Call `AkteService.sucheAkte(VSNR)` for Arbeitsakte filtering
4. Map to DocumentDto + write cache
5. Return response

**Note:** Per UC-10, all document PDFs are automatically downloaded and stored in rvGutachten database during initial sync for performance reasons. This endpoint returns metadata; actual PDFs are served from local storage.

---

#### GET /dokumente/{documentId}

Retrieves metadata for a specific document.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | UUID | Yes | Unique identifier of the document |

**Request Example:**

```http
GET /api/v1/dokumente/doc-001 HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer eyJhbGc...
Accept: application/json
```

**Response 200 OK:**

```json
{
  "documentId": "doc-001",
  "purIOID": "8879b4a2a9b6491898f51b1f6001e74d",
  "purArchivPID": "93 3 ICM8 ENTEXXLS13 purRVDokument59 26 A3001001A23G20B90034I0493118",
  "purDocKlasse": "23",
  "docKlasseBezeichnung": "Reha-Entlassungsbericht",
  "aktenart": "04",
  "aktenartBezeichnung": "Sozialmedizin",
  "aktenteil": "18",
  "aktenteilBezeichnung": "Medizinische Leistungen zur Rehabilitation",
  "aktenteilNr": "01",
  "bezeichnung": null,
  "datum": "2023-07-20",
  "seiten": 4,
  "format": "application/pdf",
  "importDatum": "2023-07-20T10:13:54.910Z",
  "hasNotes": false,
  "hasAnnotations": false,
  "isDeleted": false,
  "producer": "KlinikDS",
  "modifier": "Dienst (PURBATCH-2742)",
  "modifierDate": "2023-07-20T00:00:00Z",
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "_links": {
    "self": {
      "href": "/api/v1/dokumente/doc-001"
    },
    "content": {
      "href": "/api/v1/dokumente/doc-001/content"
    },
    "auftrag": {
      "href": "/api/v1/gutachtenauftraege/123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
```

---

### Document Content

#### GET /dokumente/{documentId}/content

Retrieves the PDF content of a document from rvArchiv.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | UUID | Yes | Unique identifier of the document |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `inline` | boolean | No | `true` | Display inline (`true`) or download (`false`) |

**Request Example:**

```http
GET /api/v1/dokumente/doc-001/content?inline=true HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer eyJhbGc...
Accept: application/pdf
```

**Response 200 OK:**

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 245678
Content-Disposition: inline; filename="Reha-Entlassungsbericht_2023-07-20.pdf"
Cache-Control: private, max-age=3600
ETag: "5d41402abc4b2a76b9719d911017c592"
Last-Modified: Thu, 20 Jul 2023 10:13:54 GMT
X-Document-ID: doc-001
X-PurIOID: 8879b4a2a9b6491898f51b1f6001e74d

%PDF-1.4
[Binary PDF Content]
```

**Response 404 Not Found:**

```json
{
  "error": "DOCUMENT_NOT_FOUND",
  "message": "Dokument nicht gefunden",
  "documentId": "doc-001",
  "timestamp": "2025-11-12T14:30:00Z",
  "path": "/api/v1/dokumente/doc-001/content"
}
```

**Response 503 Service Unavailable:**

```json
{
  "error": "RVARCHIV_UNAVAILABLE",
  "message": "rvArchiv ist derzeit nicht erreichbar",
  "retryAfter": 60,
  "timestamp": "2025-11-12T14:30:00Z",
  "path": "/api/v1/dokumente/doc-001/content",
  "details": {
    "service": "rvArchiv",
    "circuitBreaker": "OPEN"
  }
}
```

**Business Logic (Updated per UC-10):**

1. Load document metadata from database
2. Check if PDF is stored locally (per UC-10 automatic caching)
3. If PDF exists locally:
   - Stream PDF from local storage (database/file system)
4. If PDF not found locally (fallback):
   - Extract `purIOID`
   - Call `rvArchiv.getDokument(purIOID)`
   - Store PDF locally for future requests
   - Stream PDF with appropriate headers
5. Set cache headers (1 hour)

**Note:** Per UC-10, all document PDFs are automatically downloaded and stored in rvGutachten during initial sync. This ensures performance and availability even when rvArchiv is unavailable.

**Security:**
- Verify user has access to the parent Auftrag
- Log document access for audit trail

---

#### HEAD /dokumente/{documentId}/content

Retrieves metadata for document content without downloading.

**Request Example:**

```http
HEAD /api/v1/dokumente/doc-001/content HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer eyJhbGc...
```

**Response 200 OK:**

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 245678
Cache-Control: private, max-age=3600
ETag: "5d41402abc4b2a76b9719d911017c592"
Last-Modified: Thu, 20 Jul 2023 10:13:54 GMT
X-Document-ID: doc-001
X-PurIOID: 8879b4a2a9b6491898f51b1f6001e74d
```

---

### Document Sync

#### POST /rvsmd/sync/dokumente

**[INTERNAL]** Synchronizes document references when an Auftrag is created or updated from rvSMD.

**Authentication:** Internal service token (not user token)

**Request Body:**

```json
{
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "rvPurVorgangsID": 116722,
  "rvPurAuftragsID": "A250000002RVX1",
  "vsnr": "65100248X858",
  "syncType": "INITIAL"
}
```

**Request Example:**

```http
POST /api/v1/rvsmd/sync/dokumente HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer [service-token]
Content-Type: application/json

{
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "rvPurVorgangsID": 116722,
  "rvPurAuftragsID": "A250000002RVX1",
  "vsnr": "65100248X858",
  "syncType": "INITIAL"
}
```

**Response 200 OK:**

```json
{
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "dokumenteAnzahl": 5,
  "syncTimestamp": "2025-11-12T14:30:00Z",
  "status": "SUCCESS",
  "details": {
    "vorgangProcessed": true,
    "auftragProcessed": true,
    "arbeitsakteProcessed": false,
    "documentsCreated": 5,
    "documentsUpdated": 0,
    "errors": []
  }
}
```

**Response 207 Multi-Status:**

```json
{
  "auftragsId": "123e4567-e89b-12d3-a456-426614174000",
  "dokumenteAnzahl": 3,
  "syncTimestamp": "2025-11-12T14:30:00Z",
  "status": "PARTIAL_SUCCESS",
  "details": {
    "vorgangProcessed": true,
    "auftragProcessed": false,
    "arbeitsakteProcessed": false,
    "documentsCreated": 3,
    "documentsUpdated": 0,
    "errors": [
      {
        "code": "AUFTRAG_NOT_FOUND",
        "message": "Auftrag A250000002RVX1 not found in rvPuR",
        "severity": "WARNING"
      }
    ]
  }
}
```

**Business Logic (Updated per UC-10):**

1. Receive event from message queue
2. Store rvPuR metadata in Auftrag
3. Load document metadata from rvPuR (same as GET /dokumente)
4. Store document references in database
5. **Download all PDF files from rvArchiv** (UC-10 requirement)
   - For each document: Call `rvArchiv.getDokument(purIOID)`
   - Store PDF in local storage (database BLOB or file system)
   - Handle large files appropriately
6. Return sync status

**Note:** Per UC-10, this endpoint performs automatic document caching. All PDFs are downloaded and stored locally during initial sync to ensure performance and availability.

---

### Cache Management

#### DELETE /cache/dokumente/{auftragsId}

**[INTERNAL]** Invalidates the document cache for a specific Auftrag.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `auftragsId` | UUID | Yes | Unique identifier of the Gutachtenauftrag |

**Request Example:**

```http
DELETE /api/v1/cache/dokumente/123e4567-e89b-12d3-a456-426614174000 HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer [service-token]
```

**Response 204 No Content:**

```http
HTTP/1.1 204 No Content
```

**Use Cases:**
- Auftrag cancelled (UC-13)
- Manual cache invalidation by administrator
- Forced refresh after rvPuR update notification

---

#### GET /cache/status

**[ADMIN]** Retrieves cache statistics and health status.

**Request Example:**

```http
GET /api/v1/cache/status HTTP/1.1
Host: rvgutachten.drv.de
Authorization: Bearer eyJhbGc...
```

**Response 200 OK:**

```json
{
  "redis": {
    "status": "CONNECTED",
    "host": "redis-cluster.drv.local",
    "uptime": 86400,
    "memoryUsed": "512MB",
    "memoryMax": "2GB"
  },
  "cacheMetrics": {
    "hitRate": 0.85,
    "missRate": 0.15,
    "totalKeys": 1234,
    "totalHits": 45678,
    "totalMisses": 8901,
    "avgResponseTime": 12
  },
  "dokumenteCache": {
    "keyPattern": "dokumente:*",
    "totalKeys": 456,
    "ttl": 300,
    "evictionPolicy": "allkeys-lru"
  }
}
```

---

## Data Models

### DocumentDto

```typescript
interface DocumentDto {
  documentId: string;              // UUID - Internal identifier
  purIOID: string;                 // Stable IOID from rvPuR
  purArchivPID: string;            // Technical rvArchiv PID
  purDocKlasse: string;            // Document class code
  docKlasseBezeichnung: string;    // Document class description
  aktenart: string;                // Aktenart code (e.g., "04")
  aktenartBezeichnung: string;     // Aktenart description
  aktenteil: string;               // Aktenteil code
  aktenteilBezeichnung: string;    // Aktenteil description
  aktenteilNr: string;             // Aktenteil number
  bezeichnung: string | null;      // Document title
  datum: string;                   // Document date (ISO 8601)
  seiten: number;                  // Number of pages
  format: string;                  // MIME type (e.g., "application/pdf")
  importDatum: string;             // Import timestamp (ISO 8601)
  hasNotes: boolean;               // Has notes flag
  hasAnnotations: boolean;         // Has annotations flag
  isDeleted: boolean;              // Deletion request flag
  producer: string;                // Producer/Creator
  modifier: string;                // Last modifier
  modifierDate: string;            // Last modified timestamp (ISO 8601)
  auftragsId?: string;             // Parent Auftrag ID
  _links: HateoasLinks;            // HATEOAS links
}
```

### DokumenteResponseDto

```typescript
interface DokumenteResponseDto {
  auftragsId: string;
  dokumente: DocumentDto[];
  metadata: {
    rvPurVorgangsID: number;
    rvPurVorgangKennung: string;
    rvPurAuftragsID: number;
    rvPurAuftragsKennung: string;
    arbeitsakte?: {
      id: string;
      titel: string;
      dokumenteAnzahl: number;
    };
    lastSync: string;              // ISO 8601 timestamp
    source: "rvPuR" | "cache";
    cacheStatus: "hit" | "miss" | "stale";
  };
  _pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}
```

### ErrorResponseDto

```typescript
interface ErrorResponseDto {
  error: string;                   // Error code
  message: string;                 // Human-readable message
  timestamp: string;               // ISO 8601 timestamp
  path: string;                    // Request path
  details?: {
    [key: string]: any;            // Additional context
  };
  retryAfter?: number;             // Retry-After in seconds
}
```

### SyncRequestDto

```typescript
interface SyncRequestDto {
  auftragsId: string;              // UUID
  rvPurVorgangsID: number;         // Long
  rvPurAuftragsID: string;         // String kennung
  vsnr: string;                    // 12-digit VSNR
  syncType: "INITIAL" | "UPDATE" | "REFRESH";
}
```

### SyncResponseDto

```typescript
interface SyncResponseDto {
  auftragsId: string;
  dokumenteAnzahl: number;
  syncTimestamp: string;           // ISO 8601 timestamp
  status: "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED";
  details: {
    vorgangProcessed: boolean;
    auftragProcessed: boolean;
    arbeitsakteProcessed: boolean;
    documentsCreated: number;
    documentsUpdated: number;
    errors: SyncError[];
  };
}

interface SyncError {
  code: string;
  message: string;
  severity: "ERROR" | "WARNING" | "INFO";
}
```

---

## Error Handling

### Standard Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `ORDER_NOT_FOUND` | 404 | Gutachtenauftrag not found |
| `DOCUMENT_NOT_FOUND` | 404 | Document not found |
| `RVPUR_UNAVAILABLE` | 503 | rvPuR service unavailable |
| `RVARCHIV_UNAVAILABLE` | 503 | rvArchiv service unavailable |
| `INVALID_VSNR` | 400 | Invalid VSNR format |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `CIRCUIT_BREAKER_OPEN` | 503 | Circuit breaker open (too many failures) |
| `CACHE_ERROR` | 500 | Redis cache error |
| `DECODE_ERROR` | 500 | Failed to decode rvPuR response |

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "timestamp": "2025-11-12T14:30:00Z",
  "path": "/api/v1/...",
  "details": {
    "additionalContext": "..."
  }
}
```

### Circuit Breaker States

When rvPuR is unavailable, the circuit breaker protects the system:

```
CLOSED (Normal) → 3 failures → OPEN (Rejecting requests)
                                  ↓
                            30 seconds wait
                                  ↓
                         HALF_OPEN (Testing)
                                  ↓
                    Success → CLOSED | Failure → OPEN
```

**Response when circuit is OPEN:**

```json
{
  "error": "RVPUR_UNAVAILABLE",
  "message": "rvPuR ist derzeit nicht erreichbar",
  "retryAfter": 30,
  "details": {
    "circuitBreaker": "OPEN",
    "lastFailure": "2025-11-12T14:29:45Z",
    "failureCount": 3
  }
}
```

---

## Rate Limiting

**Limits per user:**
- 1000 requests per hour
- 100 requests per minute

**Rate limit headers:**

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699800000
```

**Response when limit exceeded:**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600

{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit überschritten. Bitte versuchen Sie es später erneut.",
  "retryAfter": 3600,
  "details": {
    "limit": 1000,
    "remaining": 0,
    "reset": 1699800000
  }
}
```

---

## Versioning

**API Version Strategy:** URL-based versioning (`/api/v1/...`)

**Current Version:** v1

**Breaking Changes:**
- New major version (v2) for breaking changes
- Both versions supported for 6 months during migration

**Non-Breaking Changes:**
- New optional query parameters
- New response fields
- New error codes

---

## Changelog

### v1.0.0 (2025-11-12)
- Initial API specification
- Document retrieval from rvPuR
- PDF content streaming from rvArchiv
- Cache management
- Circuit breaker implementation

---

## Related Documents

- **UC-06**: Data Flow Traceability Matrix
- **rvPuR-Systemuebersicht.md**: Comprehensive rvPuR system description
- **rvPuR-brief.md**: Original interface specification
- **ADR-001 to ADR-005**: Architecture Decision Records

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2025  
**Authors:** Development Team rvGutachten  
**Status:** Draft for Review
