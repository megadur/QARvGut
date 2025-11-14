# rvGutachten MVP - Glossar

**Version:** 1.0  
**Stand:** November 2025  
**Zweck:** Projektspezifisches Glossar für rvGutachten MVP-Entwicklung

**Hinweis:** Das offizielle Projektglossar wird im DRV-Wiki gepflegt: [https://rvwiki.drv.drv/x/FPpILg](https://rvwiki.drv.drv/x/FPpILg)

Dieses Glossar enthält MVP-spezifische Begriffe und technische Definitionen für die Entwicklung.

---

## Begriffe und Definitionen

| Begriff | Definition |
| :---- | :---- |
| **8023-Mitarbeiter** | Mitarbeiter der DRV Bund im Bereich 8023 (Gutachterbetreuung), zuständig für die Verwaltung und Unterstützung externer Gutachter |
| **Auftrag** | Ein von der DRV an einen Gutachter erteilter Begutachtungsauftrag, bestehend aus Auftragsnummer, Probandendaten und erforderlichen medizinischen Unterlagen |
| **Auftragsübersicht** | Zentrale Ansicht für Gutachter und DRV-Mitarbeiter zur Übersicht aller zugewiesenen bzw. verwalteten Gutachtenaufträge |
| **Audit-Log** | Protokollierung aller sicherheitsrelevanten Aktionen und Statusänderungen zur Nachvollziehbarkeit und Compliance |
| **Authentifizierung** | Prozess der Überprüfung der Identität eines Nutzers, erfolgt über eLogin-Integration |
| **Autorisierung** | Prozess der Überprüfung, ob ein authentifizierter Nutzer berechtigt ist, eine bestimmte Aktion auszuführen (rollenbasiert) |
| **Befundbericht** | Medizinischer Bericht über den Gesundheitszustand eines Probanden, wird von Ärzten erstellt und kann über das System übermittelt werden |
| **Business Use Case** | Fachliche Beschreibung eines Anwendungsfalls aus Sicht der Geschäftslogik, ohne technische Implementierungsdetails |
| **DSGVO-konform** | Einhaltung der Datenschutz-Grundverordnung, insbesondere bezüglich Datenaufbewahrung, Löschfristen und Zugriffsrechten |
| **Dokumenteneinsicht** | Funktion zur Online-Anzeige von Auftragsdokumenten (medizinische Unterlagen) für autorisierte Gutachter |
| **EFN** | Einrichtungsnummer - Eindeutige Identifikationsnummer für medizinische Einrichtungen und Gutachter |
| **Elektronische Signatur** | Digitale Signatur zur Authentifizierung und Integritätssicherung von Dokumenten (nicht Teil des MVP) |
| **E-Mail-Benachrichtigung** | Automatisierte E-Mail-Nachrichten an Gutachter über Auftragsänderungen, neue Aufträge oder Statusupdates |
| **Frontend** | Benutzeroberfläche der Webanwendung, mit der Gutachter und DRV-Mitarbeiter interagieren |
| **Gutachten** | Medizinisches Dokument, erstellt von einem externen Gutachter zur Beurteilung des Gesundheitszustands eines Probanden |
| **Gutachter** | Externe medizinische Fachkraft (Arzt), die von der DRV beauftragt wird, medizinische Gutachten zu erstellen |
| **Gutachtermitarbeiter** | Mitarbeiter eines Gutachters (z.B. Praxismitarbeiter), die im System zur Unterstützung berechtigt werden können |
| **LANR** | Lebenslange Arztnummer - Eindeutige Identifikationsnummer für Ärzte in Deutschland |
| **Löschfrist** | Zeitraum, nach dem personenbezogene Daten gemäß DSGVO gelöscht werden müssen |
| **MVP** | Minimum Viable Product - Erste funktionsfähige Version des Systems mit Kernfunktionen |
| **Onboarding** | Prozess der Registrierung und Freischaltung neuer Gutachter im System |
| **PDF-Upload** | Funktion zur digitalen Übermittlung fertiger Gutachten als PDF-Dokument |
| **Proband** | Person, die begutachtet wird (Patient/Versicherter) |
| **RESTful API** | Schnittstelle zur Kommunikation zwischen Frontend und Backend nach REST-Prinzipien |
| **Rolle** | Gruppierung von Berechtigungen zur Steuerung des Zugriffs auf Funktionen (z.B. Gutachter, DRV-Mitarbeiter, Administrator) |
| **Support-Dashboard** | Verwaltungsoberfläche für 8023-Mitarbeiter zur Verwaltung von Gutachtern und Aufträgen |
| **System Use Case** | Technische Beschreibung eines Anwendungsfalls inkl. Implementierungsdetails und API-Aufrufen |
| **VSNR** | Versicherungsnummer - Eindeutige Identifikationsnummer für Versicherte in der Sozialversicherung |

---

## Akronyme und Abkürzungen

| Akronym | Bedeutung | Erläuterung |
| :---- | :---- | :---- |
| **API** | Application Programming Interface | Schnittstelle zur programmatischen Kommunikation zwischen Systemkomponenten |
| **BPMN** | Business Process Model and Notation | Notation zur Modellierung von Geschäftsprozessen |
| **CSV** | Comma-Separated Values | Dateiformat zum Austausch tabellarischer Daten |
| **DSGVO** | Datenschutz-Grundverordnung | Europäische Verordnung zum Schutz personenbezogener Daten |
| **DRV** | Deutsche Rentenversicherung | Träger der gesetzlichen Rentenversicherung in Deutschland |
| **E2E** | End-to-End | Ganzheitlicher Test vom Anfang bis zum Ende eines Prozesses |
| **EFN** | Einrichtungsnummer | Identifikationsnummer für medizinische Einrichtungen |
| **eLogin** | Elektronisches Login-Verfahren | Zentrales Authentifizierungssystem der DRV |
| **FAQ** | Frequently Asked Questions | Häufig gestellte Fragen mit Antworten |
| **FGSMDAF** | Fachgremium Sozialmedizinischer Dienst Ärztlicher Fachdienst | Gremium für fachliche Abstimmungen |
| **GDPR** | General Data Protection Regulation | Englische Bezeichnung für DSGVO |
| **HTTPS** | Hypertext Transfer Protocol Secure | Verschlüsseltes Kommunikationsprotokoll im Internet |
| **JSON** | JavaScript Object Notation | Datenformat zum Austausch strukturierter Daten |
| **KI** | Künstliche Intelligenz | Technologie zur automatisierten Datenauswertung (nicht Teil des MVP) |
| **KPI** | Key Performance Indicator | Kennzahl zur Erfolgsmessung |
| **LANR** | Lebenslange Arztnummer | Eindeutige Identifikationsnummer für Ärzte |
| **MVP** | Minimum Viable Product | Erste funktionsfähige Version mit Kernfunktionen |
| **PDF** | Portable Document Format | Standardformat für elektronische Dokumente |
| **QS** | Qualitätssicherung | Maßnahmen zur Sicherstellung der Qualität |
| **REST** | Representational State Transfer | Architekturstil für Webschnittstellen |
| **rvArchiv** | Rentenversicherung Archiv | DRV-System zur Archivierung von Dokumenten |
| **rvEvolution** | Rentenversicherung Evolution | DRV-Verfahren für Verwaltungsprozesse |
| **rvGutachten** | Rentenversicherung Gutachten | Name des zu entwickelnden Systems (dieses Projekt) |
| **rvPUR** | Rentenversicherung Postkorb und Recherche | DRV-System zur Dokumentenverwaltung und -recherche |
| **rvSMD** | Rentenversicherung Stammdatenmanagementsystem | DRV-System zur Verwaltung von Stammdaten (Gutachter, Probanden) |
| **rvText** | Rentenversicherung Textverarbeitung | DRV-System zur Dokumentenerstellung |
| **SME** | Subject Matter Expert | Fachexperte mit spezifischem Domänenwissen |
| **SQL** | Structured Query Language | Datenbankabfragesprache |
| **SSL/TLS** | Secure Sockets Layer / Transport Layer Security | Verschlüsselungsprotokolle für sichere Datenübertragung |
| **UAT** | User Acceptance Test | Test durch Endanwender zur Abnahme des Systems |
| **UI/UX** | User Interface / User Experience | Benutzeroberfläche und Benutzererfahrung |
| **VSNR** | Versicherungsnummer | Eindeutige Identifikationsnummer für Versicherte |

---

## Fachbegriffe DRV-spezifisch

| Begriff | Bedeutung |
| :---- | :---- |
| **Abteilung 11** | Abteilung bei DRV Bund für Sozialmedizin |
| **Abteilung 80** | Abteilung bei DRV Bund für IT-Entwicklung |
| **Bereich 8023** | Bereich Gutachterbetreuung innerhalb der DRV Bund |
| **DRV Band 21** | DRV-Schriftenreihe zu sozialmedizinischen Begutachtungsthemen |
| **DRV Band 81** | DRV-Schriftenreihe mit Leitlinien zur Begutachtung |
| **DRV Bund** | Deutsche Rentenversicherung Bund (zentrale Trägerorganisation) |
| **Reha-Träger** | Träger der Rehabilitationsleistungen, hier: DRV |
| **Sozialmedizinischer Dienst** | Medizinischer Dienst der DRV zur Beurteilung von Leistungsfähigkeit |

---

## Technische Begriffe

| Begriff | Bedeutung |
| :---- | :---- |
| **Backend** | Serverseitige Anwendungslogik und Datenverwaltung |
| **CI/CD** | Continuous Integration / Continuous Deployment - Automatisierte Software-Bereitstellung |
| **Database Migration** | Versionierte Änderungen am Datenbankschema |
| **Docker** | Containerisierungstechnologie zur Anwendungsbereitstellung |
| **Encryption** | Verschlüsselung sensibler Daten für Sicherheit |
| **Git** | Versionskontrollsystem für Quellcode |
| **Load Balancing** | Verteilung von Anfragen auf mehrere Server zur Lastverteilung |
| **Logging** | Protokollierung von Systemereignissen zur Fehleranalyse |
| **Middleware** | Vermittlungsschicht zwischen verschiedenen Systemkomponenten |
| **Monitoring** | Überwachung von Systemzustand und Performance |
| **OAuth** | Protokoll zur sicheren Autorisierung |
| **ORM** | Object-Relational Mapping - Abbildung von Objekten auf Datenbanktabellen |
| **Repository** | Zentrale Codebasis in Versionskontrollsystem |
| **Responsive Design** | Anpassungsfähiges Layout für verschiedene Bildschirmgrößen |
| **Rollback** | Rückgängigmachen von Änderungen bei Fehlern |
| **SOAP** | Simple Object Access Protocol - älteres Webservice-Protokoll |
| **Web Service** | Netzwerkschnittstelle für Systemkommunikation |

---

## Siehe auch

- **Offizielle Projektdokumentation:** [DRV Wiki Glossar](https://rvwiki.drv.drv/x/FPpILg)
- **Referenz-Snapshot:** `docs/input/Glossar-v22-20251114_110319.md`
- **Use Cases:** `docs/UseCases/use-cases-mvp-development.md`

