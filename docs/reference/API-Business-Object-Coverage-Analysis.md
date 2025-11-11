# API zu Business Object Abdeckungsanalyse

## Übersicht
Dieses Dokument bildet die Attribute der rvGutachten internen APIs (UserService und GutachtenportalService) auf die definierten Business Objects in `business objects.csv` ab.

**Analysedatum:** November 2025  
**API-Versionen:**
- UserService: 0.0.9
- GutachtenportalService: 0.0.2

## Legende
- [OK] **Vollständig abgedeckt** - Attribut existiert in der API
- [WARN] **Teilweise abgedeckt** - Attribut existiert, aber mit Einschränkungen
- [NO] **Fehlt** - Attribut fehlt in der API
- [CRIT] **Kritisch** - Fehlt und ist als MVP=1 markiert

---

## UserService API Abdeckung

### NutzerDTO (Basis für alle Benutzertypen)
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| User | userid | NutzerDTO | userId | [OK] |
| User | created | NutzerDTO | created | [OK] |
| User | lastLogin | NutzerDTO | lastLogin | [OK] (via LastLoginDTO) |
| User | gesperrtSeit | NutzerDTO | gesperrtSeit | [OK] |
| User | rollen | NutzerDTO | rollen | [OK] |
| User | status | NutzerDTO | status | [OK] |
| User | settings | NutzerDTO | settings | [OK] (via PropertyMap) |
| User | avatar | NutzerDTO | - | [NO] |

**Anmerkung:** `avatar` ist im Business Model als optional markiert, fehlt aber komplett in der API.

### LastLoginDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| LastLogin | logintimestamp | LastLoginDTO | logintimestamp | [OK] |
| LastLogin | ip | LastLoginDTO | ip | [OK] |

### KontaktDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Kontakt | typ | KontaktDTO | typ | [OK] |
| Kontakt | wert | KontaktDTO | wert | [OK] |
| Kontakt | anmerkung | KontaktDTO | anmerkung | [OK] |

**API Enum-Werte:** `Email`, `Telefon`, `unbekannt`

### AdresseDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Adresse | strasse | AdresseDTO | strasse | [OK] |
| Adresse | hausnummer | AdresseDTO | hausnummer | [OK] |
| Adresse | plz | AdresseDTO | plz | [OK] |
| Adresse | ort | AdresseDTO | ort | [OK] |
| Adresse | adresszusatz | AdresseDTO | adresszusatz | [OK] |
| Adresse | postfach | AdresseDTO | postfach | [OK] |
| Adresse | land | AdresseDTO | land | [OK] |
| Adresse | typ | AdresseDTO | typ | [OK] |

### NameDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Gutachter/Mitarbeiter/Admin | anrede | NameDTO | anrede | [OK] |
| Gutachter/Mitarbeiter/Admin | titel | NameDTO | titel | [OK] |
| Gutachter/Mitarbeiter/Admin | nachname | NameDTO | nachname | [OK] |
| Gutachter/Mitarbeiter/Admin | vorname | NameDTO | vorname | [OK] |
| Gutachter/Mitarbeiter/Admin | namenszusatz | NameDTO | namenszusatz | [OK] |

**Anmerkung:** NameDTO ist ein separates Objekt, das von allen Benutzertypen verwendet wird.

### GutachterDTO
| Business Object | Attribut | API DTO | API Attribut | Status | Anmerkung |
|----------------|----------|---------|--------------|--------|-----------|
| Gutachter | userId | GutachterDTO | userId | [OK] | geerbt von NutzerDTO |
| Gutachter | created | GutachterDTO | created | [OK] | geerbt von NutzerDTO |
| Gutachter | lastLogin | GutachterDTO | lastLogin | [OK] | geerbt von NutzerDTO |
| Gutachter | gesperrtSeit | GutachterDTO | gesperrtSeit | [OK] | geerbt von NutzerDTO |
| Gutachter | rollen | GutachterDTO | rollen | [OK] | geerbt von NutzerDTO |
| Gutachter | status | GutachterDTO | status | [OK] | geerbt von NutzerDTO |
| Gutachter | settings | GutachterDTO | settings | [OK] | geerbt von NutzerDTO |
| Gutachter | avatar | GutachterDTO | - | [NO] | geerbt von NutzerDTO |
| Gutachter | mitarbeiter | GutachterDTO | mitarbeiterIDs | [WARN] | nur IDs, keine Objekte |
| Gutachter | anrede | GutachterDTO | name.anrede | [OK] | via NameDTO |
| Gutachter | titel | GutachterDTO | name.titel | [OK] | via NameDTO |
| Gutachter | nachname | GutachterDTO | name.nachname | [OK] | via NameDTO |
| Gutachter | vorname | GutachterDTO | name.vorname | [OK] | via NameDTO |
| Gutachter | namenszusatz | GutachterDTO | name.namenszusatz | [OK] | via NameDTO |
| Gutachter | kontakte | GutachterDTO | kontakte | [OK] | Array von KontaktDTO |
| Gutachter | fachrichtung | GutachterDTO | fachrichtung | [OK] | Array von Strings |
| Gutachter | geburtsdatum | GutachterDTO | - | [NO] | optional im Business Model |
| Gutachter | adresse | GutachterDTO | adressen | [OK] | Array von AdresseDTO |
| Gutachter | efn | GutachterDTO | efn | [OK] | |
| Gutachter | verfügbarkeit | GutachterDTO | verfuegbarkeit | [OK] | Array von VerfuegbarkeitDTO |
| Gutachter | zuordnung | GutachterDTO | traeger | [OK] | Array von TraegerDTO |

**Zusätzliches API-Attribut:** `eLoginId` (nicht im Business Model)

### GutachtermitarbeiterDTO
| Business Object | Attribut | API DTO | API Attribut | Status | Anmerkung |
|----------------|----------|---------|--------------|--------|-----------|
| Mitarbeiter | userid | GutachtermitarbeiterDTO | userId | [OK] | geerbt |
| Mitarbeiter | created | GutachtermitarbeiterDTO | created | [OK] | geerbt |
| Mitarbeiter | lastLogin | GutachtermitarbeiterDTO | lastLogin | [OK] | geerbt |
| Mitarbeiter | gesperrtSeit | GutachtermitarbeiterDTO | gesperrtSeit | [OK] | geerbt |
| Mitarbeiter | rollen | GutachtermitarbeiterDTO | rollen | [OK] | geerbt |
| Mitarbeiter | status | GutachtermitarbeiterDTO | status | [OK] | geerbt |
| Mitarbeiter | settings | GutachtermitarbeiterDTO | settings | [OK] | geerbt |
| Mitarbeiter | avatar | GutachtermitarbeiterDTO | - | [NO] | geerbt |
| Mitarbeiter | gutachter | GutachtermitarbeiterDTO | - | ��� | **Kritisch: Keine Referenz zum Gutachter!** |
| Mitarbeiter | anrede | GutachtermitarbeiterDTO | name.anrede | [OK] | via NameDTO |
| Mitarbeiter | titel | GutachtermitarbeiterDTO | name.titel | [OK] | via NameDTO |
| Mitarbeiter | nachname | GutachtermitarbeiterDTO | name.nachname | [OK] | via NameDTO |
| Mitarbeiter | vorname | GutachtermitarbeiterDTO | name.vorname | [OK] | via NameDTO |
| Mitarbeiter | namenszusatz | GutachtermitarbeiterDTO | name.namenszusatz | [OK] | via NameDTO |
| Mitarbeiter | adresse | GutachtermitarbeiterDTO | adressen | [OK] | Array von AdresseDTO |
| Mitarbeiter | kontakte | GutachtermitarbeiterDTO | kontakte | [OK] | Array von KontaktDTO |

**Kritisches Problem:** Im Business Model ist `Mitarbeiter.gutachter` als Kardinalität 1 (Pflichtfeld) definiert. Die API bietet keine Möglichkeit, diese Beziehung herzustellen. Nur der Gutachter hat `mitarbeiterIDs`, aber nicht umgekehrt.

### AdministratorDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Administrator | userid | AdministratorDTO | userId | [OK] |
| Administrator | created | AdministratorDTO | created | [OK] |
| Administrator | lastLogin | AdministratorDTO | lastLogin | [OK] |
| Administrator | gesperrtSeit | AdministratorDTO | gesperrtSeit | [OK] |
| Administrator | rollen | AdministratorDTO | rollen | [OK] |
| Administrator | status | AdministratorDTO | status | [OK] |
| Administrator | settings | AdministratorDTO | settings | [OK] |
| Administrator | avatar | AdministratorDTO | - | [NO] |
| Administrator | traeger | AdministratorDTO | traeger | [OK] |
| Administrator | anrede | AdministratorDTO | name.anrede | [OK] |
| Administrator | titel | AdministratorDTO | name.titel | [OK] |
| Administrator | nachname | AdministratorDTO | name.nachname | [OK] |
| Administrator | vorname | AdministratorDTO | name.vorname | [OK] |
| Administrator | namenszusatz | AdministratorDTO | name.namenszusatz | [OK] |
| Administrator | adresse | AdministratorDTO | adressen | [OK] |
| Administrator | kontakte | AdministratorDTO | kontakte | [OK] |

### VerfuegbarkeitDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Verfügbarkeit | typ | VerfuegbarkeitDTO | typ | [OK] |
| Verfügbarkeit | von | VerfuegbarkeitDTO | von | [OK] |
| Verfügbarkeit | bis | VerfuegbarkeitDTO | bis | [OK] |

**API Enum-Werte:** `Verfügbar`, `Abwesend`

### TraegerDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Träger | Kennung | TraegerDTO | ktan | [OK] |
| Träger | Name | TraegerDTO | name | [OK] |
| Träger | adresse | TraegerDTO | - | [NO] |

**Anmerkung:** Träger.adresse ist im Business Model als Kardinalität * definiert, fehlt aber komplett in der API.

---

## GutachtenportalService API Abdeckung

### GutachtenauftragDto
| Business Object | Attribut | API DTO | API Attribut | MVP | Status | Anmerkung |
|----------------|----------|---------|--------------|-----|--------|-----------|
| Auftrag | auftragsId | GutachtenauftragDto | auftragsId | 1 | [OK] | |
| Auftrag | rvPurAuftragsID | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt!** |
| Auftrag | proband | GutachtenauftragDto | proband | 1 | [OK] | via ProbandDto |
| Auftrag | gutachter | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt!** |
| Auftrag | kennzeichen1 | GutachtenauftragDto | kennzeichen1 | - | [OK] | |
| Auftrag | kennzeichen2 | GutachtenauftragDto | kennzeichen2 | - | [OK] | |
| Auftrag | gutachtenstatus | GutachtenauftragDto | gutachtenstatus | 1 | [OK] | via GutachtenstatusDto |
| Auftrag | anhang | GutachtenauftragDto | anhaenge | 1 | [OK] | Array von DokumentOhneDatenDto |
| Auftrag | gutachten | GutachtenauftragDto | gutachten | - | [OK] | via GutachtenDto |
| Auftrag | auftraggeber | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt! (Träger)** |
| Auftrag | auftragsDatum | GutachtenauftragDto | auftragsdatum | 1 | [OK] | format: date |
| Auftrag | eingangsDatum | GutachtenauftragDto | eingangsdatum | 1 | [OK] | format: date-time |
| Auftrag | stornierungsDatum | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt!** |
| Auftrag | bereitstellungsDatum | GutachtenauftragDto | bereitstellungsdatum | - | [OK] | format: date-time |
| Auftrag | einbestellDatum | GutachtenauftragDto | einbestelldatum | - | [OK] | format: date |
| Auftrag | dokumente | GutachtenauftragDto | - | 1 | [WARN] | nur `anhaenge`, unklar ob vollständig |
| Auftrag | mahnungen | GutachtenauftragDto | - | - | [NO] | |

**Kritisches Problem:** Vier MVP-Attribute fehlen komplett in der API!

### ProbandDto
*Schema muss noch geprüft werden - nicht vollständig in der Ausgabe sichtbar*

| Business Object | Attribut | Status | Anmerkung |
|----------------|----------|--------|-----------|
| Proband | vsnr | [WARN] | zu prüfen |
| Proband | gebdatum | [WARN] | zu prüfen |
| Proband | name | [WARN] | zu prüfen |
| Proband | vorname | [WARN] | zu prüfen |
| Proband | contacts | [WARN] | zu prüfen |
| Proband | adresse | [WARN] | zu prüfen |

### GutachtenDto
| Business Object | Attribut | API DTO | API Attribut | MVP | Status |
|----------------|----------|---------|--------------|-----|--------|
| Gutachten | auftragsId | GutachtenDto | auftragsId | - | [OK] |
| Gutachten | s0080 | GutachtenDto | s0080 | - | [OK] |
| Gutachten | anhang | GutachtenDto | anhaenge | - | [OK] |
| Gutachten | begonnenAm | GutachtenDto | - | - | [NO] |
| Gutachten | fertiggestelltAm | GutachtenDto | - | - | [NO] |

**Anmerkung:** Die Zeitstempel für Beginn und Fertigstellung fehlen - wichtig für Tracking und Auswertungen.

### GutachtenstatusDto
*Schema muss noch vollständig geprüft werden*

| Business Object | Attribut | Status |
|----------------|----------|--------|
| Gutachtenstatus | status | [WARN] |
| Gutachtenstatus | changedOn | [WARN] |

### DokumentDto / DocumentMetadata
*Vollständige Schema-Analyse steht noch aus*

Zu prüfende Attribute:
- documentId
- metadata (name, filesize, erstelltAm, erstelltVon, eingestelltAm, filename, filetype, changedOn, changedBy, properties, tags)
- acl (DocumentAccess)
- data

---

## Zusammenfassung

### Kritisch fehlende MVP-Attribute

#### UserService API
1. [NO] **`Mitarbeiter.gutachter`** (Kardinalität 1) - Keine Möglichkeit, Mitarbeiter einem Gutachter zuzuordnen

#### GutachtenportalService API
1. ��� **`Auftrag.rvPurAuftragsID`** (MVP=1) - Identifikation für Dokumente aus rvPuR/rvArchiv
2. ��� **`Auftrag.gutachter`** (MVP=1) - Referenz auf den zuständigen Gutachter
3. ��� **`Auftrag.auftraggeber`** (MVP=1) - Träger, der beauftragt hat
4. ��� **`Auftrag.stornierungsDatum`** (MVP=1) - Wichtig für Löschfristen

### Weitere fehlende Attribute

#### UserService
- `avatar` (binary) - bei allen Benutzertypen
- `geburtsdatum` - bei GutachterDTO
- `traeger.adresse` - bei TraegerDTO

#### GutachtenportalService
- `Gutachten.begonnenAm`
- `Gutachten.fertiggestelltAm`
- `Auftrag.mahnungen`

### Teilweise abgedeckte Bereiche

1. **Mitarbeiter-Beziehung:** Nur einseitig navigierbar (Gutachter → Mitarbeiter via IDs)
2. **Dokumente:** Unklar, ob `anhaenge` alle Dokumente abdeckt oder nur Anhänge
3. **Proband/DokumentDto:** Schema-Details müssen noch vollständig geprüft werden

---

## Empfehlungen

### Sofortmaßnahmen (MVP-kritisch)

1. **GutachtenauftragDto erweitern:**
   - `rvPurAuftragsID: string` hinzufügen
   - `gutachterId: uuid` hinzufügen
   - `auftraggeber: TraegerDTO` hinzufügen
   - `stornierungsDatum: date-time` hinzufügen

2. **GutachtermitarbeiterDTO erweitern:**
   - `gutachterId: uuid` hinzufügen

### Mittelfristige Verbesserungen

1. **Audit-Zeitstempel ergänzen:**
   - `begonnenAm` und `fertiggestelltAm` in GutachtenDto

2. **Vollständige Objekte statt nur IDs:**
   - Optional: `mitarbeiter: GutachtermitarbeiterDTO[]` statt nur `mitarbeiterIDs`
   - Ermöglicht vollständige Daten in einer Anfrage

3. **Träger-Adresse:**
   - `adressen: AdresseDTO[]` zu TraegerDTO hinzufügen

4. **Avatar-Support:**
   - Entweder in NutzerDTO aufnehmen oder separaten Endpoint erstellen

### Zu klärende Punkte

1. **Dokumente vs. Anhänge:**
   - Ist `anhaenge` nur für Gutachten-Anhänge oder alle Dokumente?
   - Sollte es ein separates `dokumente` Array geben?

2. **Mahnungen:**
   - Sollen Mahnungen im GutachtenauftragDto enthalten sein?
   - Oder gibt es einen separaten Mahnung-Service?

3. **ProbandDto und vollständige DokumentDto Struktur:**
   - Vollständige Schema-Prüfung durchführen
   - Mapping gegen Business Objects vervollständigen

---

## Nächste Schritte

1. [OK] Initiale Mapping-Analyse erstellt
2. [TODO] ProbandDto Schema vollständig prüfen
3. [TODO] DokumentDto/DocumentMetadata Schema vollständig prüfen
4. [TODO] Tickets für kritische MVP-Lücken erstellen
5. [TODO] Abstimmung mit Entwicklungsteam bezüglich fehlender Attribute
6. [TODO] OpenAPI-Spezifikationen aktualisieren ODER
7. [TODO] Business Object Model anpassen (falls Attribute nicht benötigt werden)

---

**Letzte Aktualisierung:** November 2025  
**Status:** In Bearbeitung - ProbandDto und DokumentDto Schemas müssen noch vollständig analysiert werden
