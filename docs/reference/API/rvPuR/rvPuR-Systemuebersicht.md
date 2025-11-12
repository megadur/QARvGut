# rvPuR Systemübersicht
## Postkorb und Recherche - Umfassende Beschreibung

**Dokument:** rvPuR Systemübersicht  
**Datum:** November 2025  
**Zielgruppe:** Entwickler, Architekten, Fachbereichsmitarbeiter  
**Zweck:** Vollständige Dokumentation des rvPuR-Systems und seiner Integration in rvGutachten

---

## 1. Was ist rvPuR?

**rvPuR** steht für **"Postkorb und Recherche"** und ist eine zentrale Workflowanwendung der Deutschen Rentenversicherung (DRV) zur Verwaltung der digitalen Akten und Dokumente von Versicherten.

### 1.1 Hauptfunktionen

rvPuR erfüllt folgende zentrale Aufgaben:

1. **Postkorb-Verwaltung**: Digitaler Eingang und Bearbeitung von Aufgaben und Vorgängen
2. **Dokumentenverwaltung**: Zentrale Verwaltung aller Dokumente zu Versicherten
3. **Rechercheportal**: Suche und Zugriff auf historische Vorgänge und Dokumente
4. **rvArchiv-Schnittstelle**: Kontrollierter Zugriff auf das Dokumentenarchiv
5. **Scan-Integration**: Anbindung an das Scanverfahren für Papierdokumente

### 1.2 Architektonische Rolle

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRV System-Landschaft                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐      ┌──────────┐      ┌──────────────────┐    │
│  │  rvSMD   │      │  rvPuR   │      │  rvGutachten     │    │
│  │ (Sachb.) │─────▶│ (Doku.)  │◀─────│  (Gutachter)     │    │
│  └──────────┘      └─────┬────┘      └──────────────────┘    │
│                          │                                     │
│                          ▼                                     │
│                    ┌───────────┐                              │
│                    │ rvArchiv  │                              │
│                    │ (Storage) │                              │
│                    └───────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Wichtig:** rvPuR ist die **einzige autorisierte Schnittstelle** zum Dokumentenabruf. Direkter Zugriff auf rvArchiv ist nicht erlaubt.

---

## 2. Grundlegende Konzepte

### 2.1 Versichertennummer (VSNR)

Die **VSNR** (auch `purAnkerID` genannt) ist der zentrale Identifikator in rvPuR:

- **Format**: 12-stellige Nummer (z.B. "65100248X858")
- **Bestandteile**: 
  - Bereichsnummer (2 Stellen)
  - Geburtsdatum (6 Stellen: TTMMJJ)
  - Buchstabe (1 Stelle)
  - Seriennummer (2 Stellen)
  - Prüfziffer (1 Stelle)
- **Verwendung**: Suchschlüssel für alle rvPuR-Abfragen

**Beispiel:**
```
VSNR: 65 10 02 48 X 85 8
      │  └──┬──┘ │ └┬┘ │
      │     │    │  │  └── Prüfziffer
      │     │    │  └───── Seriennummer
      │     │    └──────── Buchstabe
      │     └───────────── Geburtsdatum (10.02.1948)
      └─────────────────── Bereichsnummer
```

---

### 2.2 Hierarchie: Vorgang, Auftrag, Dokument

rvPuR organisiert Daten in einer dreistufigen Hierarchie:

```
VSNR (Versicherter)
  │
  └─ Vorgang (langlebig)
       ├─ Auftrag 1 (temporär)
       │    ├─ Dokument A
       │    └─ Dokument B
       ├─ Auftrag 2 (temporär)
       │    └─ Dokument C
       └─ Dokumente (nach Auftragsabschluss)
            ├─ Dokument A
            ├─ Dokument B
            └─ Dokument C
```

#### 2.2.1 Vorgang

Ein **Vorgang** ist die langlebige "Hülle" für alle Aktivitäten eines Versicherten:

**Eigenschaften:**
- Wird geöffnet, wenn ein Antrag gestellt wird (z.B. Reha oder Rente)
- Überlebt alle Prozesse in der Gutachterbetreuung
- Wird **aktiv** durch einen Sachbearbeiter geschlossen
- Enthält alle Dokumente, Aufträge, Hinweise, Termine

**Lebenszyklus:**
```
[Antrag gestellt] → [Vorgang eröffnet] → [Bearbeitung] → [Manueller Abschluss]
                         │                     │
                         └─ Bleibt offen ──────┘
                            (Jahre möglich)
```

**Archivierung:**
- Nur möglich wenn:
  - ✓ Alle Aufträge geschlossen sind
  - ✓ Kein Wiedervorlagetermin gesetzt ist
  - ✓ Sachbearbeiter gibt Freigabe

**Beispiel:**
- **Vorgang-ID**: 116722
- **Kennung**: V220000039RV01
- **VSNR**: 65100248X858
- **Geschäftsvorgang**: Nicht differenzierter Vorgang Sozialmedizin
- **Status**: Offen in Bearbeitung

---

#### 2.2.2 Auftrag

Ein **Auftrag** ist eine temporäre Aufgabe innerhalb eines Vorgangs:

**Eigenschaften:**
- Kann manuell oder maschinell erstellt werden
- Ist **immer** genau einem Vorgang zugeordnet
- Technisch identisch mit Vorgängen (können auch Unteraufträge haben)
- Dient als Mittel, um Dokumente zum Vorgang hinzuzufügen

**Dokumenten-Zuordnung:**

**Offener Auftrag:**
```
Vorgang
  └─ Auftrag (OFFEN)
       ├─ Dokument 1 ← Sichtbar am Auftrag
       └─ Dokument 2 ← Sichtbar am Auftrag
```

**Geschlossener Auftrag:**
```
Vorgang
  ├─ Auftrag (GESCHLOSSEN)
  │    └─ [Dokumente gewandert zum Vorgang]
  └─ Dokumente
       ├─ Dokument 1 ← Jetzt am Vorgang
       └─ Dokument 2 ← Jetzt am Vorgang
```

**Wichtig:** 
- Dokumente eines Auftrags werden erst dem Vorgang hinzugefügt, wenn der Auftrag abgeschlossen ist
- Technisch kann man auch auf geschlossene Aufträge zugreifen (solange Vorgang existiert)
- Bei Auftragsabschluss wird der zugehörige Vorgang "reaktiviert" und erscheint im Postfach

**Beispiel:**
- **Auftrags-ID**: 134569
- **Kennung**: A250000002RVX1
- **Vorgang-ID**: 116722 (Parent)
- **Art**: Ärztliche Stellungnahme
- **Status**: Offen

---

#### 2.2.3 Dokument

**Dokumente** in rvPuR sind keine physischen Dateien, sondern **Referenzen**:

**Wichtige Konzepte:**

1. **Dokumenten-Referenz statt Kopie**
   - Ein Dokument kann an mehreren Vorgängen existieren
   - Es ist nur eine Referenz auf das gleiche Original in rvArchiv
   - Original wird nur kopiert, wenn Bearbeitung nötig ist (z.B. Kommentare)

2. **Stabile Identifier**
   ```
   IOID (purIOID): "8879b4a2a9b6491898f51b1f6001e74d"
   ↓
   Stabile technisch-fachliche Referenz-ID
   Empfohlener Identifier für externe Systeme
   
   PID (purArchivPID): "93 3 ICM8 ENTEXXLS13 purRVDokument59 26..."
   ↓
   Technische rvArchiv-ID (kann sich ändern)
   Nur für internen rvArchiv-Zugriff
   ```

3. **Metadaten-reiche Beschreibung**
   - Aktenart (z.B. "04" = Sozialmedizin)
   - Aktenteil (z.B. "18" = Medizinische Leistungen zur Rehabilitation)
   - Dokumentenklasse (z.B. "23" = Reha-Entlassungsbericht)
   - Datum, Seitenanzahl, Format
   - Notizen, Anmerkungen, Signaturen

**Beispiel:**
```json
{
  "purIOID": "8879b4a2a9b6491898f51b1f6001e74d",
  "purArchivPID": "93 3 ICM8 ENTEXXLS13 purRVDokument59 26 A3001001A23G20B90034I0493118",
  "purDocKlasse": "23",
  "purDocKlasseBezeichnung": "Reha-Entlassungsbericht",
  "aktenart": "04",
  "aktenartBezeichnung": "Sozialmedizin",
  "aktenteil": "18",
  "aktenteilBezeichnung": "Medizinische Leistungen zur Rehabilitation",
  "datum": "2023-07-20",
  "seiten": 4,
  "format": "application/pdf"
}
```

---

### 2.3 Akte und Arbeitsakte

#### 2.3.1 Akte

**Akten** sind Postkorb-Objekte und entsprechen der ursprünglichen "Papier-Akte":

**Struktur:**
```
Akte: "Sozialmedizin"
  │
  ├─ Aktenteil: "Medizinische Leistungen zur Rehabilitation"
  │    ├─ Aktenteil-Nr: "01"
  │    │    ├─ Dokument 1
  │    │    ├─ Dokument 2
  │    │    └─ Dokument 3
  │    │
  │    └─ Aktenteil-Nr: "02"
  │         └─ Dokument 4
  │
  └─ Aktenteil: "Allgemeine medizinische Unterlagen"
       └─ Dokument 5
```

**Eigenschaften:**
- Enthalten Dokumentenreferenzen (keine Kopien)
- Sortiert nach: Aktenart → Aktenteil → Aktenteil-Nummer
- Alle Dokumente eines Versicherten in einer Akte
- Verschiedene Aktenarten möglich (z.B. "Rente", "Reha")

---

#### 2.3.2 Arbeitsakte

**Arbeitsakten** sind ein besonderes Konzept - eine Art "View" auf Dokumente:

**Eigenschaften:**
- **KEIN Postkorb-Objekt**, sondern Recherche-Objekt
- Vergleichbar mit einer Datenbank-View
- Bündelt Dokumentenreferenzen aus verschiedenen Vorgängen/Aufgaben
- Kann einer VSNR, einem Vorgang, einer Akte zugeordnet werden
- Kann bei Anlage beliebig benannt werden
- **Keine Unterakten möglich**

**Verwendung:**
- Hauptsächlich bei **Renten-Fällen**
- Enthält Unterteilung nach "med. Daten"
- Dort befinden sich alle für den Gutachter relevanten Dokumente
- Arbeitsakte kann aufgelöst werden (Dokumente bleiben im Vorgang)

**Wichtige Unterscheidung:**

```
rvPuR-Auftrag:
  ├─ Dokument A (für Gutachter)
  ├─ Dokument B (für Gutachter)
  ├─ Dokument C (NICHT für Gutachter - intern)
  └─ Dokument D (NICHT für Gutachter - intern)

Arbeitsakte:
  ├─ Dokument A (für Gutachter) ← Referenz
  └─ Dokument B (für Gutachter) ← Referenz
```

**Warnung:** In einem rvPuR-Auftrag können auch Dokumente sein, die **nicht** für den Gutachter bestimmt sind. Die Arbeitsakte filtert diese heraus.

**Beispiel:**
- **Arbeitsakte-ID**: cc2adbb8-3eef-447d-a9bf-f82c17ad1a2a
- **Titel**: Test Arbeitsakte
- **Erstellt am**: 2025-02-07
- **Erstellt von**: -KN
- **Dokumentenanzahl**: 1

---

### 2.4 Postkorb

Ein **Postkorb** ist vergleichbar mit einem Stapel physischer Dokumente auf einem Schreibtisch:

**Funktionen:**
- Anzeige aktueller Aufgaben und Vorgänge
- Bearbeitung von Aufgaben
- Priorisierung und Sortierung
- Filterung nach verschiedenen Kriterien

**Postkorb-Typen:**
- Eingang (neue Aufgaben)
- In Bearbeitung
- Reaktiviert (nach Auftragsabschluss)
- Wiedervorlage (terminbasiert)

---

## 3. Zugriff auf Dokumente

### 3.1 Grundregel: NUR über rvPuR

**KRITISCH:** Der Zugriff auf Dokumente ist **ausschließlich** über rvPuR erlaubt!

```
❌ FALSCH:
App → rvArchiv (Direktzugriff verboten!)

✅ RICHTIG:
App → rvPuR → rvArchiv
```

**Begründung:**
- rvPuR implementiert Rechte- und Rollenkonzept
- Zugriffskontrolle wird durch rvPuR durchgesetzt
- Audit-Trail und Compliance-Anforderungen
- Versionierung bei versionierten Dokumenten

---

### 3.2 Dokumenten-Abruf Workflow

Der korrekte Weg zum Abrufen eines Dokuments:

```
┌─────────────────────────────────────────────────────────┐
│ Schritt 1: Vorgang suchen                               │
├─────────────────────────────────────────────────────────┤
│ VorgangService.sucheVorgaenge(purAnkerID = VSNR)      │
│ → Liste von Vorgängen                                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Schritt 2: Passenden Vorgang identifizieren            │
├─────────────────────────────────────────────────────────┤
│ Geschäftslogik: LEAT, Datum, Geschäftsvorgang         │
│ → Vorgang-ID                                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Schritt 3: Dokument-IDs abrufen                        │
├─────────────────────────────────────────────────────────┤
│ VorgangService.getVorgangDokIdents(vorgangsId)        │
│ → Liste von IOIDs und PIDs                             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Schritt 4: Metadaten für jedes Dokument laden          │
├─────────────────────────────────────────────────────────┤
│ DokumentService.getDokumentMetainfo(IOID)             │
│ → Vollständige Metadaten                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Schritt 5 (Optional): Arbeitsakte prüfen               │
├─────────────────────────────────────────────────────────┤
│ AkteService.sucheAkte(VSNR)                            │
│ → Gefilterte Dokumentenliste für Gutachter            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Schritt 6: PDF abrufen                                  │
├─────────────────────────────────────────────────────────┤
│ rvArchiv.getDokument(purIOID)                          │
│ → PDF Binary Stream                                     │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 Ermittlung medizinischer Unterlagen

Für Gutachten müssen alle medizinisch relevanten Unterlagen ermittelt werden:

**Quellen:**

1. **Vorgang**
   - Alle dem Vorgang zugeordneten Dokumente
   - Dokumente aus abgeschlossenen Aufträgen

2. **Offene Aufträge**
   - Dokumente, die noch am Auftrag hängen
   - Werden bei Abschluss zum Vorgang verschoben

3. **Arbeitsakte** (bei Renten-Fällen)
   - Enthält nur für Gutachter relevante Dokumente
   - Ist eine "View" - keine technische Referenz zum Auftrag

**Strategie:**
```python
def get_medical_documents(vsnr):
    # 1. Vorgang suchen
    vorgaenge = rvpur.suche_vorgaenge(vsnr)
    vorgang = identify_relevant_vorgang(vorgaenge)
    
    # 2. Dokumente vom Vorgang
    vorgang_docs = rvpur.get_vorgang_dokumente(vorgang.id)
    
    # 3. Optional: Arbeitsakte
    if is_pension_case():
        akte = rvpur.suche_arbeitsakte(vsnr)
        filtered_docs = filter_by_arbeitsakte(vorgang_docs, akte)
        return filtered_docs
    
    return vorgang_docs
```

---

### 3.4 Besonderheit: Dokumente aus rvSMD

**Problem:** Dokumente, die aus rvSMD generiert werden (Anschreiben, Mahnungen), existieren in zwei Varianten:

1. **"Original"**: Dokument für den Gutachter
2. **"Verfügung" / "Kopie für die Akte"**: Dokument für rvPuR/8023

**Beispiel:**

```
rvSMD generiert Anschreiben:
  ├─ anschreiben_gutachter.pdf → An Gutachter versandt
  └─ anschreiben_verfuegung.pdf → In rvPuR abgelegt
```

**Regelung:**
- Bei Gutachtern im **neuen Verfahren**: Beide Varianten müssen in rvPuR sein
- Liste der Anlagen wird per rvText erstellt
- Siehe Dokument "4.5.4 Ausgabeverteiler" für Details

---

## 4. rvPuR Services und API

### 4.1 Verfügbare SOAP-Services

rvPuR bietet mehrere SOAP-Schnittstellen an:

1. **AkteService** (`http://ws.akte.pur.deutscherv.de`)
   - Suche nach Akten und Arbeitsakten
   - Zugriff auf Aktenstruktur

2. **DokumentService** (`http://v1_0.ws.dokument.pur.deutscherv.de`)
   - Abruf von Dokument-Metadaten
   - Zugriff auf Dokumenteninformationen

3. **VorgangService** (`http://v1_1.ws.vorgang.pur.deutscherv.de`)
   - Suche nach Vorgängen und Aufträgen
   - Abruf von Dokument-Identitäten

---

### 4.2 AkteService

#### 4.2.1 sucheAkte

**Zweck:** Sucht Akten für einen Versicherten (VSNR)

**Eingabe:**
- `pAkz` (String): VSNR des Versicherten

**Ausgabe:**
- `TreeRSDao` (base64 + gzip komprimiert)
- Hierarchische Struktur der Akten
- Enthält alle Dokumentenreferenzen

**Beispiel-Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:akte="http://ws.akte.pur.deutscherv.de">
   <soapenv:Body>
      <akte:sucheAkte>
         <akte:pAkz>65100248X858</akte:pAkz>
      </akte:sucheAkte>
   </soapenv:Body>
</soapenv:Envelope>
```

**Ausgabe-Struktur:**
```
TreeRSDao
  ├─ ARBEITSAKTE (falls vorhanden)
  │    └─ Dokumentenliste
  ├─ purNeueDokumenteKnoten
  │    └─ Neue Dokumente
  └─ purAnkerID (VSNR)
       └─ purAktenart (z.B. "04" Sozialmedizin)
            └─ purAktenteil
                 └─ purDocKlasse
                      └─ Dokumente
```

---

### 4.3 DokumentService

#### 4.3.1 getDokumentMetainfo

**Zweck:** Lädt vollständige Metadaten eines Dokuments

**Eingabe:**
- `DokIdentDao` mit IOID

**Ausgabe:**
- `FoDao` (base64 + gzip komprimiert)
- Alle Dokument-Metadaten

**Beispiel-Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:dok="http://v1_0.ws.dokument.pur.deutscherv.de">
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

**Wichtige Metadaten:**

| rvPuR-Feld | Bedeutung | Beispiel |
|------------|-----------|----------|
| `purAktenart` | Aktenart | "04" (Sozialmedizin) |
| `purAktenteil` | Aktenteil | "18" (Med. Leistungen Reha) |
| `purAktenteilNr` | Aktenteil-Nummer | "01" |
| `purDocKlasse` | Dokumentenklasse | "23" (Reha-Entlassungsbericht) |
| `purDocDatum` | Dokumentdatum | Timestamp |
| `purDocSeiten` | Seitenanzahl | 4 |
| `purInfotype` | Format | "application/pdf" |
| `purDocBezeichnung` | Bezeichnung | Freitext |
| `purHasNotes` | Hat Notizen | true/false |
| `purHasAnnotation` | Hat Anmerkungen | true/false |
| `purIsDeleteRq` | Löschantrag | true/false |
| `purProducer` | Ersteller | "KlinikDS" |
| `purModifier` | Bearbeiter | "Dienst (PURBATCH-2742)" |

---

### 4.4 VorgangService

#### 4.4.1 sucheVorgaenge

**Zweck:** Sucht Vorgänge anhand von Kriterien (typischerweise VSNR)

**Eingabe:**
- `QueryDao` mit Suchkriterien
- `maxResults`: Maximale Anzahl Ergebnisse
- `startIndex`: Start-Index für Paginierung

**Ausgabe:**
- `RSDao` (base64 + gzip komprimiert)
- Liste von Vorgängen und Aufträgen

**Beispiel-Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:vor="http://v1_1.ws.vorgang.pur.deutscherv.de">
   <soapenv:Body>
      <vor:sucheVorgaenge>
         <vor:queryDao>
            <criteria>
               <criterion type="equalto" casesensitiv="true">
                  <attrName>purAnkerID</attrName>
                  <attrValue>65100248X858</attrValue>
                  <javaType>java.lang.String</javaType>
               </criterion>
            </criteria>
         </vor:queryDao>
         <vor:maxResults>100</vor:maxResults>
         <vor:startIndex>0</vor:startIndex>
      </vor:sucheVorgaenge>
   </soapenv:Body>
</soapenv:Envelope>
```

**Wichtige Felder im Ergebnis:**

| Feld | Bedeutung | Beispiel |
|------|-----------|----------|
| `id` | Technische Vorgang-ID | 116722 |
| `kennung` | Vorgang-Kennung | "V220000039RV01" |
| `purAufgabeTyp` | Typ | "vorgang" oder "auftrag" |
| `purAnkerID` | VSNR | "65100248X858" |
| `versName` | Versicherter | "Mustermann, Max" |
| `geschaeftsVorgang` | Geschäftsvorgang | "nicht diff. Vorgang Sozialmedizin" |
| `status` | Status | "offen in Bearbeitung" |
| `sortierDatum` | Sortierdatum | Timestamp |

---

#### 4.4.2 getVorgangDokIdents

**Zweck:** Holt alle Dokument-Identitäten eines Vorgangs

**Eingabe:**
- `vorgangsId` (long): Technische Vorgang-ID

**Ausgabe:**
- `DokIdentListDao` (base64 + gzip komprimiert)
- Liste von IOID/PID-Paaren

**Beispiel-Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:vor="http://v1_1.ws.vorgang.pur.deutscherv.de">
   <soapenv:Body>
      <vor:getVorgangDokIdents>
         <vor:vorgangsId>116722</vor:vorgangsId>
      </vor:getVorgangDokIdents>
   </soapenv:Body>
</soapenv:Envelope>
```

**Ausgabe-Struktur:**
```xml
<dok_ident_list_dao>
   <dok_ident_dao>
      <identifiers>
         <rvarchivpid>93 3 ICM8 ENTEXXLS13...</rvarchivpid>
         <rvarchivdoktype>purRVDokument</rvarchivdoktype>
         <divaioid>8879b4a2a9b6491898f51b1f6001e74d</divaioid>
      </identifiers>
   </dok_ident_dao>
   <!-- Weitere Dokumente -->
</dok_ident_list_dao>
```

---

### 4.5 Response-Encoding

**KRITISCH:** Alle rvPuR-Responses sind speziell encodiert!

**Encoding-Schema:**
1. XML-Daten
2. → GZip-Komprimierung
3. → Base64-Encoding
4. → Übertragung

**Dekodierung (C#-Beispiel):**
```csharp
// 1. Base64-Dekodierung
byte[] compressedBytes = Convert.FromBase64String(response);

// 2. GZip-Dekomprimierung
using (var gzipStream = new GZipStream(
    new MemoryStream(compressedBytes), 
    CompressionMode.Decompress))
using (var reader = new StreamReader(gzipStream, Encoding.UTF8))
{
    // 3. XML lesen
    string xmlContent = reader.ReadToEnd();
    
    // 4. XML deserialisieren
    var serializer = new XmlSerializer(typeof(RSDao));
    var dao = (RSDao)serializer.Deserialize(
        new StringReader(xmlContent));
}
```

**Dekodierung (Python-Beispiel):**
```python
import base64
import gzip
import xml.etree.ElementTree as ET

# 1. Base64-Dekodierung
compressed_data = base64.b64decode(response)

# 2. GZip-Dekomprimierung
xml_data = gzip.decompress(compressed_data)

# 3. XML parsen
xml_string = xml_data.decode('utf-8')
root = ET.fromstring(xml_string)
```

**Wichtig:** Dieses Encoding gilt für **alle** rvPuR-SOAP-Responses!

---

## 5. Integration in rvGutachten

### 5.1 Anwendungsfall: Dokumenten-Anzeige

**Szenario:** Ein Gutachter öffnet einen Auftrag und möchte die medizinischen Unterlagen sehen.

**Workflow:**

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Gutachter öffnet Auftragsdetails                         │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. rvGutachten lädt Auftrag aus lokaler DB                  │
│    → Extrahiert VSNR: "65100248X858"                        │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Cache-Prüfung: Sind Dokumente gecacht?                   │
│    Key: "dokumente:{auftragsId}"                            │
└──────────────────────────────────────────────────────────────┘
         ↓ Cache Miss                    ↓ Cache Hit
┌──────────────────────┐      ┌──────────────────────┐
│ 4a. rvPuR-Abfrage    │      │ 4b. Cache-Rückgabe   │
│                      │      │                      │
│ VorgangService       │      │ Cached DocumentDto[] │
│ .sucheVorgaenge()    │      └──────────────────────┘
│                      │                 ↓
│ → Decode Response    │      ┌──────────────────────┐
│ → Find Vorgang       │      │ 9. Frontend-Anzeige  │
│                      │      │                      │
│ getVorgangDokIdents()│      │ Liste von Dokumenten │
│                      │      └──────────────────────┘
│ → Decode Response    │
│ → Loop IOIDs:        │
│                      │
│   getDokumentMeta()  │
│   → Decode           │
│   → Map to DTO       │
│                      │
│ Optional:            │
│ sucheAkte() filter   │
└──────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. DocumentDto[] erstellen                                   │
│    - documentId: UUID (lokal)                                │
│    - purIOID: IOID (von rvPuR)                              │
│    - purArchivPID: PID (von rvPuR)                          │
│    - Metadaten: Alle Felder mapping                         │
└──────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. Cache Write                                               │
│    Key: "dokumente:{auftragsId}"                            │
│    TTL: 5 Minuten                                           │
└──────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. Response zurück ans Frontend                              │
└──────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. Frontend rendert Dokumentenliste                          │
│    - Datum, Bezeichnung, Aktenart, Seiten                   │
│    - Sortier- und Filterfunktionen                          │
└──────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 9. Gutachter klickt auf Dokument                            │
└──────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 10. PDF-Abruf                                                │
│     GET /dokumente/{documentId}/content                     │
│     → Load purIOID from DB                                   │
│     → rvArchiv.getDokument(purIOID)                         │
│     → Stream PDF zurück                                      │
└──────────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────────┐
│ 11. Frontend zeigt PDF im Viewer                            │
│     (PDF.js oder nativer Browser-Viewer)                    │
└──────────────────────────────────────────────────────────────┘
```

---

### 5.2 Anwendungsfall: Initialer Sync

**Szenario:** rvSMD erstellt einen neuen Gutachtenauftrag, der an rvGutachten synchronisiert wird.

**Workflow:**

```
rvSMD
  │
  │ 1. Auftrag erstellt
  │    - VSNR: 65100248X858
  │    - rvPurVorgangsID: 116722
  │    - rvPurAuftragsID: A250000002RVX1
  │
  └──▶ Message Queue
         │
         │ Event: ORDER_CREATED
         │ {
         │   auftragsId: "...",
         │   vsnr: "65100248X858",
         │   rvPurVorgangsID: 116722,
         │   rvPurAuftragsID: "A250000002RVX1"
         │ }
         │
         └──▶ rvGutachten
                │
                │ 2. Event Handler
                │    - Auftrag in DB speichern
                │    - rvPuR-IDs speichern
                │
                └──▶ rvPuR Integration
                       │
                       │ 3. Dokumente laden
                       │    - sucheVorgaenge(VSNR)
                       │    - getVorgangDokIdents()
                       │    - getDokumentMetainfo() (Loop)
                       │
                       └──▶ Dokument-Referenzen
                              │
                              │ 4. In DB speichern
                              │    - documentId (UUID)
                              │    - purIOID
                              │    - purArchivPID
                              │    - Metadaten
                              │
                              └──▶ Sync Complete
                                     │
                                     │ Event: DOCUMENTS_SYNCED
                                     │
                                     └──▶ Message Queue
```

**Vorteil:**
- Dokumente sofort für Gutachter verfügbar
- Keine Verzögerung beim ersten Zugriff
- Offline-Fähigkeit (Metadaten lokal gecacht)

---

### 5.3 Cache-Strategie

**Problem:** rvPuR-Abfragen sind aufwendig (mehrere SOAP-Calls, Encoding/Decoding)

**Lösung:** Intelligentes Caching mit Redis

**Parameter:**
```
Cache Key: "dokumente:{auftragsId}"
TTL: 5 Minuten
Stale-While-Revalidate: 1 Stunde (bei Fehler)
```

**Workflow:**

```
Request → Cache?
            │
            ├─ HIT → Return cached data (schnell)
            │
            └─ MISS → rvPuR-Abfrage
                       │
                       ├─ SUCCESS → Cache + Return
                       │
                       └─ ERROR → Stale cache?
                                   │
                                   ├─ YES → Return stale + Warning
                                   │
                                   └─ NO → Error 503
```

**Cache-Invalidierung:**
- Automatisch nach TTL (5 Minuten)
- Manuell bei Auftragsstornierung (UC-13)
- Bei expliziter Aktualisierung durch Sachbearbeiter

**Vorteile:**
- 95% weniger rvPuR-Last
- Schnelle Antwortzeiten
- Fehlertoleranz bei rvPuR-Ausfall

---

### 5.4 Fehlerbehandlung

**Circuit Breaker Pattern** für Resilienz:

**Konfiguration:**
```
Threshold: 3 Fehler in 60 Sekunden
Open-Duration: 30 Sekunden
Half-Open: 1 Test-Request
```

**Status-Übergänge:**

```
[CLOSED]
   │
   │ 3 Fehler in 60s
   ▼
[OPEN] ────────────────────► [Requests rejected: 503]
   │                                    │
   │ 30 Sekunden vergangen             │
   ▼                                    │
[HALF-OPEN]                            │
   │                                    │
   ├─ 1 Request OK ──▶ [CLOSED]       │
   │                                    │
   └─ Request FAIL ───────────────────┘
```

**Retry-Strategie:**

```
Exponential Backoff:
  Versuch 1: Sofort
  Versuch 2: nach 1 Sekunde
  Versuch 3: nach 2 Sekunden
  Versuch 4: nach 4 Sekunden
  Abbruch: Nach 4 Versuchen
```

---

## 6. Wichtige Erkenntnisse und Best Practices

### 6.1 IOID als stabiler Identifier

**Problem:** Dokumente müssen über Systemgrenzen hinweg identifiziert werden.

**Lösung:** Verwenden Sie **immer** die IOID (purIOID) als Identifier!

**Warum?**

| Identifier | Stabilität | Verwendung |
|------------|-----------|------------|
| **purIOID** | ✅ STABIL | Empfohlen für externe Systeme |
| purArchivPID | ⚠️ INSTABIL | Nur für rvArchiv-Zugriff intern |
| purDocBezeichnung | ❌ SEHR INSTABIL | Kann sich jederzeit ändern |
| purGRVSDRNR (Drucknummer) | ❌ SEHR INSTABIL | Kann sich jederzeit ändern |

**Best Practice:**
```csharp
// In rvGutachten DB speichern:
public class Document
{
    public Guid DocumentId { get; set; }       // Interne UUID
    public string PurIOID { get; set; }        // Stabile IOID
    public string PurArchivPID { get; set; }   // Für rvArchiv-Zugriff
    public Guid AuftragsId { get; set; }       // Zuordnung
    // ... weitere Metadaten
}
```

---

### 6.2 Vorgang-Lifecycle verstehen

**Kritisches Wissen:**

```
Tag 1: Auftrag erstellt (OFFEN)
  └─ Dokumente am Auftrag

Tag 30: Auftrag abgeschlossen (GESCHLOSSEN)
  └─ Dokumente wandern zum Vorgang

Tag 365: Vorgang noch offen
  └─ Dokumente am Vorgang
  └─ Technisch: Zugriff auf geschlossenen Auftrag noch möglich

Jahr 5: Vorgang manuell geschlossen
  └─ Archivierung
```

**Implikation für rvGutachten:**

1. **Beim initialen Sync:**
   - Auftrag kann bereits geschlossen sein
   - Dokumente können schon am Vorgang sein
   - Strategie: Immer Vorgang UND Auftrag abfragen, dann mergen

2. **Bei Dokumenten-Refresh:**
   - Immer über Vorgang gehen (nicht über Auftrag)
   - Vorgang hat langfristig alle Dokumente

3. **Bei Archivabfragen:**
   - Solange Vorgang existiert, sind Dokumente verfügbar
   - Nach Vorgangsabschluss: Dokumente im Archiv, aber nicht mehr über rvPuR auffindbar

---

### 6.3 Arbeitsakte richtig nutzen

**Verwendung:**

```python
def get_gutachter_documents(vsnr, auftrag_typ):
    # 1. Alle Dokumente vom Vorgang
    all_docs = get_vorgang_documents(vsnr)
    
    # 2. Wenn Renten-Fall:
    if auftrag_typ == "RENTE":
        arbeitsakte = get_arbeitsakte(vsnr)
        
        if arbeitsakte:
            # Arbeitsakte als Filter verwenden
            filtered = [d for d in all_docs 
                       if d.purIOID in arbeitsakte.ioids]
            return filtered
    
    # 3. Fallback: Alle Dokumente (mit Warnung)
    return all_docs
```

**Wichtig:**
- Arbeitsakte ist ein **Hint**, keine Garantie
- Arbeitsakte kann fehlen oder aufgelöst sein
- Dokumente bleiben im Vorgang, auch wenn Arbeitsakte weg ist

---

### 6.4 Response-Encoding nicht vergessen

**Häufiger Fehler:**

```csharp
// ❌ FALSCH - Vergisst Encoding
string xml = soapClient.SucheVorgaenge(queryDao);
var dao = XmlSerializer.Deserialize<RSDao>(xml);
// → Exception: Invalid XML!
```

**Richtig:**

```csharp
// ✅ RICHTIG - Mit Encoding
string response = soapClient.SucheVorgaenge(queryDao);
byte[] base64Bytes = Convert.FromBase64String(response);
using (var gzip = new GZipStream(new MemoryStream(base64Bytes), 
                                  CompressionMode.Decompress))
using (var reader = new StreamReader(gzip, Encoding.UTF8))
{
    string xml = reader.ReadToEnd();
    var dao = XmlSerializer.Deserialize<RSDao>(xml);
}
```

---

### 6.5 Niemals direkt auf rvArchiv

**Kritische Regel:** Der Zugriff auf rvArchiv ist **ausschließlich** über rvPuR erlaubt!

**Gründe:**

1. **Zugriffskontrolle**
   - rvPuR implementiert Rechte- und Rollenkonzept
   - Nicht jeder darf jedes Dokument sehen

2. **Audit-Trail**
   - Alle Zugriffe werden durch rvPuR protokolliert
   - Compliance-Anforderungen (DSGVO)

3. **Versionierung**
   - Bei versionierten Dateien verwaltet rvPuR die Versionen
   - Direkter rvArchiv-Zugriff würde falsche Version liefern

4. **Metadata-Konsistenz**
   - rvPuR hält Metadaten aktuell
   - Direkter Zugriff umgeht Metadaten-Updates

**Implementierung:**

```csharp
// ❌ VERBOTEN
public byte[] GetDocument(string archivPID)
{
    return rvArchiv.GetDocument(archivPID); // Direktzugriff!
}

// ✅ ERLAUBT
public byte[] GetDocument(string purIOID)
{
    // 1. Metadaten über rvPuR holen
    var metainfo = rvPuR.GetDokumentMetainfo(purIOID);
    
    // 2. Mit validierter PID auf rvArchiv
    return rvArchiv.GetDocument(metainfo.rvArchivPID);
}
```

---

## 7. Systemverfügbarkeit

### 7.1 Geplante Ausfallzeiten

**rvPuR / rvArchiv:**
- ✅ **Keine regelmäßigen Downtimes** für Batch-Zugriffe
- Ungeplante Downtimes werden kommuniziert
- Check-Endpoint verfügbar zur Statusprüfung

**rvDialog:**
- ⚠️ **Hat regelmäßige Downtimes**
- Nur für GUI-Zugriffe relevant
- Batch-Zugriffe auf rvPuR nicht betroffen

**Für Dokumentenreferenzen:**
- Ermitteln der Referenzen aus rvPuR: **Downtimes beachten**
- Abruf von Dokumenten aus rvArchiv: **Keine Downtimes**

---

### 7.2 Resilience-Strategien

**1. Circuit Breaker**
```
rvGutachten → [Circuit Breaker] → rvPuR
```

**2. Retry mit Exponential Backoff**
```
Versuch 1 → Fehler → Warte 1s
Versuch 2 → Fehler → Warte 2s
Versuch 3 → Fehler → Warte 4s
Versuch 4 → Fehler → Abbruch
```

**3. Cache als Fallback**
```
rvPuR nicht erreichbar?
  ├─ Stale Cache vorhanden? → Zurückgeben mit Warnung
  └─ Kein Cache → Error 503
```

**4. Graceful Degradation**
```
rvGutachten funktioniert auch wenn rvPuR down ist:
  ├─ Aufträge anzeigen: ✅ OK (lokale DB)
  ├─ Dokumente anzeigen: ⚠️ Cached/Stale
  └─ PDF-Viewer: ⚠️ Nur gecachte Dokumente
```

---

## 8. Offene Fragen und Klärungsbedarf

### 8.1 An rvPuR-Team zu klären

1. **Stammdaten-Abfrage**
   - Können Versicherten-Stammdaten über rvPuR abgefragt werden?
   - Wenn ja: Synchron oder asynchron? Gecached?
   - **Implikation:** Proband-Daten in rvGutachten aktuell halten

2. **Inkrementelle Synchronisation**
   - Gibt es Timestamp-basierte Queries?
   - Beispiel: "Alle Dokumente die seit 2025-11-12 14:00 geändert wurden"
   - **Implikation:** Effizienter als Full-Sync bei jedem Request

3. **VSNR eines Angehörigen**
   - Gibt es Fälle, wo ein Patient die VSNR eines Angehörigen benutzt?
   - **Implikation:** Stammdaten passen nicht zum tatsächlichen Patienten
   - Validierung nötig?

4. **Originaldokumente vs Verfügungen**
   - rvSMD generiert zwei Varianten: "Original" und "Verfügung"
   - Frage: Müssen beide Varianten in rvPuR abgelegt sein?
   - Siehe Dokument "4.5.4 Ausgabeverteiler" für Details

5. **Postkorb-Abfrage**
   - Gibt es Möglichkeit, nur aktualisierte Dokumente/Vorgänge abzurufen?
   - Timestamp-Filter für Postkorb?
   - **Implikation:** Polling-Effizienz

---

## 9. Zusammenfassung

### 9.1 rvPuR in drei Sätzen

1. **rvPuR ist die zentrale Dokumentenverwaltung** der DRV und die einzige autorisierte Schnittstelle für Dokumentenzugriffe.

2. **Dokumente sind Referenzen**, organisiert in einer Hierarchie von VSNR → Vorgang → Auftrag → Dokument.

3. **Alle Responses sind base64+gzip encodiert** und müssen vor der Verarbeitung dekodiert werden.

---

### 9.2 Wichtigste Regeln für rvGutachten

1. ✅ **IMMER über rvPuR** auf Dokumente zugreifen
2. ✅ **purIOID als Identifier** verwenden
3. ✅ **Responses dekodieren** (base64 + gzip)
4. ✅ **Caching implementieren** (5 Min TTL)
5. ✅ **Circuit Breaker** für Resilienz
6. ✅ **Vorgang + Auftrag** beide abfragen beim Sync
7. ✅ **Arbeitsakte als Hint** nutzen (bei Renten)
8. ❌ **NIEMALS direkt** auf rvArchiv zugreifen

---

### 9.3 Schnellreferenz: Typischer Workflow

```
1. Suche Vorgang für VSNR
   → VorgangService.sucheVorgaenge(purAnkerID)

2. Hole Dokument-IDs
   → VorgangService.getVorgangDokIdents(vorgangsId)

3. Für jedes Dokument: Hole Metadaten
   → DokumentService.getDokumentMetainfo(IOID)

4. Optional: Prüfe Arbeitsakte (Renten-Fälle)
   → AkteService.sucheAkte(VSNR)

5. PDF abrufen
   → rvArchiv.getDokument(purIOID)

WICHTIG: Alle Responses dekodieren (base64 + gzip)!
```

---

## Anhang

### A. Glossar

| Begriff | Erklärung |
|---------|-----------|
| **VSNR** | Versichertennummer, 12-stellig, zentraler Identifier |
| **purAnkerID** | Technischer Name für VSNR in rvPuR |
| **Vorgang** | Langlebige "Hülle" für alle Aktivitäten eines Versicherten |
| **Auftrag** | Temporäre Aufgabe innerhalb eines Vorgangs |
| **IOID / purIOID** | Stabile technisch-fachliche Dokument-Referenz-ID |
| **PID / purArchivPID** | Technische rvArchiv-ID (kann sich ändern) |
| **Arbeitsakte** | "View" auf Gutachter-relevante Dokumente (nur Renten) |
| **Akte** | Strukturierte Sammlung von Dokumentenreferenzen |
| **Postkorb** | Digitaler "Stapel" von zu bearbeitenden Aufgaben |
| **rvArchiv** | Dokumentenspeicher (Zugriff nur über rvPuR!) |

---

### B. API-Übersicht

| Service | Methode | Zweck |
|---------|---------|-------|
| **AkteService** | sucheAkte | Sucht Akten für VSNR |
| **DokumentService** | getDokumentMetainfo | Lädt Dokument-Metadaten |
| **VorgangService** | sucheVorgaenge | Sucht Vorgänge für VSNR |
| **VorgangService** | getVorgangDokIdents | Holt Dokument-IDs eines Vorgangs |
| **VorgangService** | getVersion | Gibt API-Version zurück |

---

### C. Verwandte Dokumente

- **UC-06**: Data Flow Traceability Matrix für rvPuR-Integration
- **rvPuR-Brief.md**: Original-Spezifikation der Schnittstelle
- **UC-04**: Auftragsübersicht und -verwaltung
- **UC-05**: Auftragsdetails und Dokumentenanzeige
- **UC-13**: Auftragsstornierung (Cache Invalidation)

---

**Dokumentversion:** 1.0  
**Stand:** November 2025  
**Autor:** Entwicklungsteam rvGutachten  
**Status:** Finale Version
