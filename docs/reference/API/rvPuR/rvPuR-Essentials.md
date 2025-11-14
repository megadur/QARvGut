# rvPuR - Kurzreferenz für rvGutachten

**Stand:** November 2025  
**Zielgruppe:** Entwickler  
**Zweck:** Schnellreferenz für rvPuR-Integration

---

## Was ist rvPuR?

**rvPuR** = **Postkorb und Recherche**

Zentrale DRV-Anwendung zur Verwaltung von:
- Digitalen Akten von Versicherten
- Dokumenten und deren Metadaten
- Vorgängen und Aufträgen

**⚠️ WICHTIG:** rvPuR ist die **einzige** autorisierte Schnittstelle zu Dokumenten. Direkter rvArchiv-Zugriff ist verboten!

---

## Grundkonzepte

### Hierarchie

```
VSNR (Versichertennummer)
  └─ Vorgang (langlebig, Jahre)
       ├─ Auftrag 1 (temporär)
       │    ├─ Dokument A
       │    └─ Dokument B
       └─ Auftrag 2 (temporär)
            └─ Dokument C

Nach Auftragsabschluss:
  └─ Vorgang
       └─ Dokumente A, B, C (direkt am Vorgang)
```

### Wichtige Identifier

| ID | Verwendung | Stabilität |
|----|------------|-----------|
| **purIOID** | Dokument-Referenz | ✅ STABIL - verwenden! |
| purArchivPID | rvArchiv-Zugriff | ⚠️ Kann sich ändern |
| VSNR | Versicherter (12 Stellen) | ✅ STABIL |

**Regel:** Immer `purIOID` als Dokument-ID verwenden!

---

## API-Übersicht

### Verfügbare Services

1. **VorgangService** - Suche nach Vorgängen/Aufträgen
2. **DokumentService** - Dokument-Metadaten
3. **AkteService** - Akten-Struktur (für Renten-Fälle)

### Typischer Workflow

```
1. Vorgang suchen
   → VorgangService.sucheVorgaenge(purAnkerID = VSNR)
   → Ergebnis: Liste von Vorgängen

2. Dokument-IDs abrufen
   → VorgangService.getVorgangDokIdents(vorgangsId)
   → Ergebnis: Liste von IOIDs + PIDs

3. Metadaten laden (pro Dokument)
   → DokumentService.getDokumentMetainfo(IOID)
   → Ergebnis: Vollständige Metadaten

4. PDF abrufen
   → rvArchiv.getDokument(purIOID)
   → Ergebnis: PDF Binary
```

### Response-Encoding

**⚠️ KRITISCH:** Alle rvPuR-Responses sind encodiert!

```
Schema: XML → GZip → Base64 → Übertragung
```

**Dekodierung (Java):**
```java
import java.io.*;
import java.util.Base64;
import java.util.zip.GZIPInputStream;

// 1. Base64-Dekodierung
byte[] compressed = Base64.getDecoder().decode(response);

// 2. GZip-Dekomprimierung
try (ByteArrayInputStream bais = new ByteArrayInputStream(compressed);
     GZIPInputStream gzis = new GZIPInputStream(bais);
     InputStreamReader reader = new InputStreamReader(gzis, StandardCharsets.UTF_8);
     BufferedReader br = new BufferedReader(reader)) {
    
    // 3. XML lesen
    StringBuilder xml = new StringBuilder();
    String line;
    while ((line = br.readLine()) != null) {
        xml.append(line);
    }
    
    String xmlContent = xml.toString();
    // XML deserialisieren mit JAX-B oder Jackson...
}
```

---

## Best Practices

### ✅ DO

1. **Immer über rvPuR** auf Dokumente zugreifen
2. **purIOID verwenden** als Dokument-ID
3. **Responses dekodieren** (base64 + gzip)
4. **Caching implementieren** (TTL: 5 Min)
5. **Circuit Breaker** für Resilienz
6. **Vorgang UND Auftrag** abfragen beim Sync

### ❌ DON'T

1. **Niemals direkt** auf rvArchiv zugreifen
2. **Nicht purArchivPID** als Identifier verwenden
3. **Nicht ohne Dekodierung** parsen
4. **Nicht ohne Fehlerbehandlung** implementieren

---

## Integration in rvGutachten

### Dokumenten-Anzeige

**Scenario:** Gutachter öffnet Auftragsdetails

```
1. Auftrag aus DB laden → VSNR extrahieren
2. Cache prüfen: "dokumente:{auftragsId}"
3. Bei Cache-Miss:
   a) VorgangService.sucheVorgaenge(VSNR)
   b) Passenden Vorgang identifizieren
   c) getVorgangDokIdents(vorgangsId)
   d) Loop: getDokumentMetainfo(IOID)
   e) DocumentDto[] erstellen
   f) Cache schreiben (TTL: 5 Min)
4. Response ans Frontend
5. Frontend rendert Dokumentenliste
```

### Cache-Strategie

```
Key: "dokumente:{auftragsId}"
TTL: 5 Minuten
Stale-While-Revalidate: 1 Stunde (Fallback)
```

**Cache-Invalidierung:**
- Automatisch nach TTL
- Bei Auftragsstornierung (UC-13)
- Bei expliziter Aktualisierung

### Fehlerbehandlung

**Circuit Breaker:**
```
Threshold: 3 Fehler in 60s
Open-Duration: 30s
Half-Open: 1 Test-Request
```

**Retry-Strategie:**
```
Exponential Backoff:
  Versuch 1: Sofort
  Versuch 2: nach 1s
  Versuch 3: nach 2s
  Versuch 4: nach 4s
  Abbruch: Nach 4 Versuchen
```

---

## Wichtige Metadaten-Felder

| Feld | Bedeutung | Beispiel |
|------|-----------|----------|
| purIOID | Dokument-ID | "8879b4a2..." |
| purArchivPID | rvArchiv-ID | "93 3 ICM8..." |
| purDocKlasse | Dokumentenklasse | "23" (Reha-Entlassungsbericht) |
| purAktenart | Aktenart | "04" (Sozialmedizin) |
| purAktenteil | Aktenteil | "18" (Med. Leistungen Reha) |
| purDocDatum | Datum | Timestamp |
| purDocSeiten | Seitenanzahl | 4 |
| purInfotype | Format | "application/pdf" |

---

## Arbeitsakte (nur Renten-Fälle)

**Was ist es?**
- "View" auf Gutachter-relevante Dokumente
- Filtert interne DRV-Dokumente heraus
- Nur bei Renten-Fällen relevant

**Verwendung:**
```java
public List<Document> getGutachterDocuments(String vsnr, AuftragsTyp auftragTyp) {
    List<Document> allDocs = getVorgangDocuments(vsnr);
    
    if (auftragTyp == AuftragsTyp.RENTE) {
        Arbeitsakte arbeitsakte = getArbeitsakte(vsnr);
        if (arbeitsakte != null) {
            // Als Filter verwenden
            Set<String> akteIoids = arbeitsakte.getIoids();
            return allDocs.stream()
                .filter(d -> akteIoids.contains(d.getPurIOID()))
                .collect(Collectors.toList());
        }
    }
    
    return allDocs;
}
```

---

## Schnellreferenz: SOAP-Requests

### Vorgang suchen

```xml
<soapenv:Envelope xmlns:vor="http://v1_1.ws.vorgang.pur.deutscherv.de">
   <soapenv:Body>
      <vor:sucheVorgaenge>
         <vor:queryDao>
            <criteria>
               <criterion type="equalto">
                  <attrName>purAnkerID</attrName>
                  <attrValue>65100248X858</attrValue>
               </criterion>
            </criteria>
         </vor:queryDao>
      </vor:sucheVorgaenge>
   </soapenv:Body>
</soapenv:Envelope>
```

### Dokument-IDs abrufen

```xml
<soapenv:Envelope xmlns:vor="http://v1_1.ws.vorgang.pur.deutscherv.de">
   <soapenv:Body>
      <vor:getVorgangDokIdents>
         <vor:vorgangsId>116722</vor:vorgangsId>
      </vor:getVorgangDokIdents>
   </soapenv:Body>
</soapenv:Envelope>
```

### Dokument-Metadaten

```xml
<soapenv:Envelope xmlns:dok="http://v1_0.ws.dokument.pur.deutscherv.de">
   <soapenv:Body>
      <dok:getDokumentMetainfo>
         <dok:dokIdentDao>
            <identifiers>
               <divaioid>8879b4a2a9b6491898f51b1f6001e74d</divaioid>
            </identifiers>
         </dok:dokIdentDao>
      </dok:getDokumentMetainfo>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Glossar

| Begriff | Bedeutung |
|---------|-----------|
| **VSNR** | Versichertennummer (12 Stellen) |
| **purAnkerID** | Technischer Name für VSNR |
| **Vorgang** | Langlebige Hülle (Jahre) |
| **Auftrag** | Temporäre Aufgabe (Wochen/Monate) |
| **IOID/purIOID** | Stabile Dokument-ID |
| **PID/purArchivPID** | Instabile rvArchiv-ID |
| **Arbeitsakte** | View für Gutachter (nur Renten) |

---

## Verwandte Dokumente

- **rvPuR-Systemuebersicht.md** - Vollständige Dokumentation
- **UC-06** - Data Flow Traceability Matrix
- **UC-05** - Auftragsdetails und Dokumentenanzeige

---

**Version:** 1.0  
**Autor:** Entwicklungsteam rvGutachten
