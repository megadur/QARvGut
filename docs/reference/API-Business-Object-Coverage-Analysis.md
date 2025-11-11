# API zu Business Object Abdeckungsanalyse

## Übersicht
Dieses Dokument bildet die Attribute der rvGutachten internen APIs (UserService und GutachtenportalService) auf die definierten Business Objects in `business objects.csv` ab.

**Analysedatum:** November 2025  
**API-Versionen:**
- UserService: 0.0.9
- GutachtenportalService: 0.0.2

## Legende
- ✅ **Vollständig abgedeckt** - Attribut existiert in der API
- ⚠️ **Teilweise abgedeckt** - Attribut existiert, aber mit Einschränkungen
- ❌ **Fehlt** - Attribut fehlt in der API
- ��� **Kritisch** - Fehlt und ist als MVP=1 markiert

---

## UserService API Abdeckung

### NutzerDTO (Basis für alle Benutzertypen)
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| User | userid | NutzerDTO | userId | ✅ |
| User | created | NutzerDTO | created | ✅ |
| User | lastLogin | NutzerDTO | lastLogin | ✅ (via LastLoginDTO) |
| User | gesperrtSeit | NutzerDTO | gesperrtSeit | ✅ |
| User | rollen | NutzerDTO | rollen | ✅ |
| User | status | NutzerDTO | status | ✅ |
| User | settings | NutzerDTO | settings | ✅ (via PropertyMap) |
| User | avatar | NutzerDTO | - | ❌ |

**Anmerkung:** `avatar` ist im Business Model als optional markiert, fehlt aber komplett in der API.

### LastLoginDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| LastLogin | logintimestamp | LastLoginDTO | logintimestamp | ✅ |
| LastLogin | ip | LastLoginDTO | ip | ✅ |

### KontaktDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Kontakt | typ | KontaktDTO | typ | ✅ |
| Kontakt | wert | KontaktDTO | wert | ✅ |
| Kontakt | anmerkung | KontaktDTO | anmerkung | ✅ |

**API Enum-Werte:** `Email`, `Telefon`, `unbekannt`

### AdresseDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Adresse | strasse | AdresseDTO | strasse | ✅ |
| Adresse | hausnummer | AdresseDTO | hausnummer | ✅ |
| Adresse | plz | AdresseDTO | plz | ✅ |
| Adresse | ort | AdresseDTO | ort | ✅ |
| Adresse | adresszusatz | AdresseDTO | adresszusatz | ✅ |
| Adresse | postfach | AdresseDTO | postfach | ✅ |
| Adresse | land | AdresseDTO | land | ✅ |
| Adresse | typ | AdresseDTO | typ | ✅ |

### NameDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Gutachter/Mitarbeiter/Admin | anrede | NameDTO | anrede | ✅ |
| Gutachter/Mitarbeiter/Admin | titel | NameDTO | titel | ✅ |
| Gutachter/Mitarbeiter/Admin | nachname | NameDTO | nachname | ✅ |
| Gutachter/Mitarbeiter/Admin | vorname | NameDTO | vorname | ✅ |
| Gutachter/Mitarbeiter/Admin | namenszusatz | NameDTO | namenszusatz | ✅ |

**Anmerkung:** NameDTO ist ein separates Objekt, das von allen Benutzertypen verwendet wird.

### GutachterDTO
| Business Object | Attribut | API DTO | API Attribut | Status | Anmerkung |
|----------------|----------|---------|--------------|--------|-----------|
| Gutachter | userId | GutachterDTO | userId | ✅ | geerbt von NutzerDTO |
| Gutachter | created | GutachterDTO | created | ✅ | geerbt von NutzerDTO |
| Gutachter | lastLogin | GutachterDTO | lastLogin | ✅ | geerbt von NutzerDTO |
| Gutachter | gesperrtSeit | GutachterDTO | gesperrtSeit | ✅ | geerbt von NutzerDTO |
| Gutachter | rollen | GutachterDTO | rollen | ✅ | geerbt von NutzerDTO |
| Gutachter | status | GutachterDTO | status | ✅ | geerbt von NutzerDTO |
| Gutachter | settings | GutachterDTO | settings | ✅ | geerbt von NutzerDTO |
| Gutachter | avatar | GutachterDTO | - | ❌ | geerbt von NutzerDTO |
| Gutachter | mitarbeiter | GutachterDTO | mitarbeiterIDs | ⚠️ | nur IDs, keine Objekte |
| Gutachter | anrede | GutachterDTO | name.anrede | ✅ | via NameDTO |
| Gutachter | titel | GutachterDTO | name.titel | ✅ | via NameDTO |
| Gutachter | nachname | GutachterDTO | name.nachname | ✅ | via NameDTO |
| Gutachter | vorname | GutachterDTO | name.vorname | ✅ | via NameDTO |
| Gutachter | namenszusatz | GutachterDTO | name.namenszusatz | ✅ | via NameDTO |
| Gutachter | kontakte | GutachterDTO | kontakte | ✅ | Array von KontaktDTO |
| Gutachter | fachrichtung | GutachterDTO | fachrichtung | ✅ | Array von Strings |
| Gutachter | geburtsdatum | GutachterDTO | - | ❌ | optional im Business Model |
| Gutachter | adresse | GutachterDTO | adressen | ✅ | Array von AdresseDTO |
| Gutachter | efn | GutachterDTO | efn | ✅ | |
| Gutachter | verfügbarkeit | GutachterDTO | verfuegbarkeit | ✅ | Array von VerfuegbarkeitDTO |
| Gutachter | zuordnung | GutachterDTO | traeger | ✅ | Array von TraegerDTO |

**Zusätzliches API-Attribut:** `eLoginId` (nicht im Business Model)

### GutachtermitarbeiterDTO
| Business Object | Attribut | API DTO | API Attribut | Status | Anmerkung |
|----------------|----------|---------|--------------|--------|-----------|
| Mitarbeiter | userid | GutachtermitarbeiterDTO | userId | ✅ | geerbt |
| Mitarbeiter | created | GutachtermitarbeiterDTO | created | ✅ | geerbt |
| Mitarbeiter | lastLogin | GutachtermitarbeiterDTO | lastLogin | ✅ | geerbt |
| Mitarbeiter | gesperrtSeit | GutachtermitarbeiterDTO | gesperrtSeit | ✅ | geerbt |
| Mitarbeiter | rollen | GutachtermitarbeiterDTO | rollen | ✅ | geerbt |
| Mitarbeiter | status | GutachtermitarbeiterDTO | status | ✅ | geerbt |
| Mitarbeiter | settings | GutachtermitarbeiterDTO | settings | ✅ | geerbt |
| Mitarbeiter | avatar | GutachtermitarbeiterDTO | - | ❌ | geerbt |
| Mitarbeiter | gutachter | GutachtermitarbeiterDTO | - | ��� | **Kritisch: Keine Referenz zum Gutachter!** |
| Mitarbeiter | anrede | GutachtermitarbeiterDTO | name.anrede | ✅ | via NameDTO |
| Mitarbeiter | titel | GutachtermitarbeiterDTO | name.titel | ✅ | via NameDTO |
| Mitarbeiter | nachname | GutachtermitarbeiterDTO | name.nachname | ✅ | via NameDTO |
| Mitarbeiter | vorname | GutachtermitarbeiterDTO | name.vorname | ✅ | via NameDTO |
| Mitarbeiter | namenszusatz | GutachtermitarbeiterDTO | name.namenszusatz | ✅ | via NameDTO |
| Mitarbeiter | adresse | GutachtermitarbeiterDTO | adressen | ✅ | Array von AdresseDTO |
| Mitarbeiter | kontakte | GutachtermitarbeiterDTO | kontakte | ✅ | Array von KontaktDTO |

**Kritisches Problem:** Im Business Model ist `Mitarbeiter.gutachter` als Kardinalität 1 (Pflichtfeld) definiert. Die API bietet keine Möglichkeit, diese Beziehung herzustellen. Nur der Gutachter hat `mitarbeiterIDs`, aber nicht umgekehrt.

### AdministratorDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Administrator | userid | AdministratorDTO | userId | ✅ |
| Administrator | created | AdministratorDTO | created | ✅ |
| Administrator | lastLogin | AdministratorDTO | lastLogin | ✅ |
| Administrator | gesperrtSeit | AdministratorDTO | gesperrtSeit | ✅ |
| Administrator | rollen | AdministratorDTO | rollen | ✅ |
| Administrator | status | AdministratorDTO | status | ✅ |
| Administrator | settings | AdministratorDTO | settings | ✅ |
| Administrator | avatar | AdministratorDTO | - | ❌ |
| Administrator | traeger | AdministratorDTO | traeger | ✅ |
| Administrator | anrede | AdministratorDTO | name.anrede | ✅ |
| Administrator | titel | AdministratorDTO | name.titel | ✅ |
| Administrator | nachname | AdministratorDTO | name.nachname | ✅ |
| Administrator | vorname | AdministratorDTO | name.vorname | ✅ |
| Administrator | namenszusatz | AdministratorDTO | name.namenszusatz | ✅ |
| Administrator | adresse | AdministratorDTO | adressen | ✅ |
| Administrator | kontakte | AdministratorDTO | kontakte | ✅ |

### VerfuegbarkeitDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Verfügbarkeit | typ | VerfuegbarkeitDTO | typ | ✅ |
| Verfügbarkeit | von | VerfuegbarkeitDTO | von | ✅ |
| Verfügbarkeit | bis | VerfuegbarkeitDTO | bis | ✅ |

**API Enum-Werte:** `Verfügbar`, `Abwesend`

### TraegerDTO
| Business Object | Attribut | API DTO | API Attribut | Status |
|----------------|----------|---------|--------------|--------|
| Träger | Kennung | TraegerDTO | ktan | ✅ |
| Träger | Name | TraegerDTO | name | ✅ |
| Träger | adresse | TraegerDTO | - | ❌ |

**Anmerkung:** Träger.adresse ist im Business Model als Kardinalität * definiert, fehlt aber komplett in der API.

---

## GutachtenportalService API Abdeckung

### GutachtenauftragDto
| Business Object | Attribut | API DTO | API Attribut | MVP | Status | Anmerkung |
|----------------|----------|---------|--------------|-----|--------|-----------|
| Auftrag | auftragsId | GutachtenauftragDto | auftragsId | 1 | ✅ | |
| Auftrag | rvPurAuftragsID | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt!** |
| Auftrag | proband | GutachtenauftragDto | proband | 1 | ✅ | via ProbandDto |
| Auftrag | gutachter | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt!** |
| Auftrag | kennzeichen1 | GutachtenauftragDto | kennzeichen1 | - | ✅ | |
| Auftrag | kennzeichen2 | GutachtenauftragDto | kennzeichen2 | - | ✅ | |
| Auftrag | gutachtenstatus | GutachtenauftragDto | gutachtenstatus | 1 | ✅ | via GutachtenstatusDto |
| Auftrag | anhang | GutachtenauftragDto | anhaenge | 1 | ✅ | Array von DokumentOhneDatenDto |
| Auftrag | gutachten | GutachtenauftragDto | gutachten | - | ✅ | via GutachtenDto |
| Auftrag | auftraggeber | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt! (Träger)** |
| Auftrag | auftragsDatum | GutachtenauftragDto | auftragsdatum | 1 | ✅ | format: date |
| Auftrag | eingangsDatum | GutachtenauftragDto | eingangsdatum | 1 | ✅ | format: date-time |
| Auftrag | stornierungsDatum | GutachtenauftragDto | - | 1 | ��� | **Kritisch fehlt!** |
| Auftrag | bereitstellungsDatum | GutachtenauftragDto | bereitstellungsdatum | - | ✅ | format: date-time |
| Auftrag | einbestellDatum | GutachtenauftragDto | einbestelldatum | - | ✅ | format: date |
| Auftrag | dokumente | GutachtenauftragDto | - | 1 | ⚠️ | nur `anhaenge`, unklar ob vollständig |
| Auftrag | mahnungen | GutachtenauftragDto | - | - | ❌ | |

**Kritisches Problem:** Vier MVP-Attribute fehlen komplett in der API!

### ProbandDto
*Schema muss noch geprüft werden - nicht vollständig in der Ausgabe sichtbar*

| Business Object | Attribut | Status | Anmerkung |
|----------------|----------|--------|-----------|
| Proband | vsnr | ⚠️ | zu prüfen |
| Proband | gebdatum | ⚠️ | zu prüfen |
| Proband | name | ⚠️ | zu prüfen |
| Proband | vorname | ⚠️ | zu prüfen |
| Proband | contacts | ⚠️ | zu prüfen |
| Proband | adresse | ⚠️ | zu prüfen |

### GutachtenDto
| Business Object | Attribut | API DTO | API Attribut | MVP | Status |
|----------------|----------|---------|--------------|-----|--------|
| Gutachten | auftragsId | GutachtenDto | auftragsId | - | ✅ |
| Gutachten | s0080 | GutachtenDto | s0080 | - | ✅ |
| Gutachten | anhang | GutachtenDto | anhaenge | - | ✅ |
| Gutachten | begonnenAm | GutachtenDto | - | - | ❌ |
| Gutachten | fertiggestelltAm | GutachtenDto | - | - | ❌ |

**Anmerkung:** Die Zeitstempel für Beginn und Fertigstellung fehlen - wichtig für Tracking und Auswertungen.

### GutachtenstatusDto
*Schema muss noch vollständig geprüft werden*

| Business Object | Attribut | Status |
|----------------|----------|--------|
| Gutachtenstatus | status | ⚠️ |
| Gutachtenstatus | changedOn | ⚠️ |

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
1. ❌ **`Mitarbeiter.gutachter`** (Kardinalität 1) - Keine Möglichkeit, Mitarbeiter einem Gutachter zuzuordnen

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

1. ✅ Initiale Mapping-Analyse erstellt
2. ⏳ ProbandDto Schema vollständig prüfen
3. ⏳ DokumentDto/DocumentMetadata Schema vollständig prüfen
4. ⏳ Tickets für kritische MVP-Lücken erstellen
5. ⏳ Abstimmung mit Entwicklungsteam bezüglich fehlender Attribute
6. ⏳ OpenAPI-Spezifikationen aktualisieren ODER
7. ⏳ Business Object Model anpassen (falls Attribute nicht benötigt werden)

---

**Letzte Aktualisierung:** November 2025  
**Status:** In Bearbeitung - ProbandDto und DokumentDto Schemas müssen noch vollständig analysiert werden
