# rvGutachten Dokument-Anzeige & Interaktions-UI/UX-Spezifikation

**Dokumentversion:** 1.0  
**Letzte Aktualisierung:** 4. August 2025  
**UX-Expertin:** Sally  
**Projektfokus:** Dokumentanzeige und Interaktionserfahrung für Gutachter  

## Einführung

Dieses Dokument definiert die Benutzererfahrungsziele, Informationsarchitektur, Benutzerflüsse und visuellen Designspezifikationen für rvGutachtens Dokumentanzeige- und Interaktionsschnittstelle. Es dient als Grundlage für das visuelle Design und die Frontend-Entwicklung und gewährleistet eine kohärente und benutzerzentrierte Erfahrung, die sich spezifisch darauf konzentriert, wie Gutachter mit PDF-Dokumenten in ihrem Bewertungsworkflow interagieren.

## Übergeordnete UX-Ziele & Prinzipien

### Zielgruppen-Personas

- **Bewertungsprüfer:** Professionelle Gutachter, die mehrere PDF-Dokumente pro Auftrag effizient lesen, annotieren und bearbeiten müssen
- **Detailorientierter Auditor:** Benutzer, die präzise Navigation, Suchfunktionen und Referenztools innerhalb von Dokumenten benötigen  
- **Multitasking-Gutachter:** Benutzer, die mehrere Aufträge gleichzeitig bearbeiten und schnellen Kontextwechsel sowie Fortschrittsverfolgung benötigen

### Benutzerfreundlichkeitsziele

- **Schneller Dokumentzugriff:** Gutachter können jedes PDF innerhalb von 2 Sekunden öffnen und nahtlos zwischen Dokumenten navigieren
- **Effiziente Leseerfahrung:** Unterstützung verschiedener Lesevorlieben (Zoomstufen, Layoutmodi, Annotationstools)
- **Kontextbewahrung:** Benutzer verlieren nie ihre Position beim Wechseln zwischen Dokumenten oder Aufträgen
- **Multi-Dokument-Workflow:** Einfacher Vergleich und Referenzierung zwischen verwandten Dokumenten

### Designprinzipien

1. **Lesen steht an erster Stelle** - Dokumentinhalt ist der primäre Fokus; UI-Ablenkungen beim Lesen minimieren
2. **Kontextuelle Tools** - Relevante Aktionen (Annotieren, Suchen, Navigieren) nur bei Bedarf anzeigen
3. **Nahtlose Übergänge** - Bewegung zwischen Dokumenten, Aufträgen und verwandten Aufgaben fühlt sich flüssig an
4. **Fortschrittstransparenz** - Benutzer wissen immer über ihren Lesefortschritt und Vollendungsstatus Bescheid
5. **Flexible Layouts** - Unterstützung verschiedener Bildschirmgrößen und Lesevorlieben

## Informationsarchitektur

### Dokumentzentrierte Sitemap

```mermaid
graph TD
    A[Dashboard] --> B[Auftragsliste]
    B --> C[Auftragsdetails]
    C --> D[Dokumentbetrachter]
    D --> D1[Dokumentnavigations-Panel]
    D --> D2[Haupt-Dokumentansicht]
    D --> D3[Dokument-Tools-Panel]
    
    D1 --> D1a[Dokumentliste]
    D1 --> D1b[Fortschrittstracker]
    D1 --> D1c[Auftragskontext]
    
    D2 --> D2a[PDF-Reader]
    D2 --> D2b[Seitennavigation]
    D2 --> D2c[Zoom-Steuerung]
    
    D3 --> D3a[Annotations-Tools]
    D3 --> D3b[Suchen & Finden]
    D3 --> D3c[Nachrichten-Panel]
    D3 --> D3d[Notizen & Kommentare]
    
    C --> E[Nachrichtenzentrale]
    A --> F[Benachrichtigungen]
    
    style D fill:#e1f5fe
    style D2 fill:#f3e5f5
```

### Navigationsstruktur

**Primäre Navigation:** Auftragsfokussierte Breadcrumb-Navigation (Dashboard > Auftrag > Dokument)

**Sekundäre Navigation:** Dokumentspezifisches Tools-Panel (einklappbare Seitenleiste)

**Kontextuelle Navigation:** Dokumentinterne Navigation (Seitensprünge, Lesezeichen, Suchergebnisse)

**Schnellaktionen:** Schwebende Action-Buttons für häufige Aufgaben (Annotieren, Nachricht, Als erledigt markieren)

### Dokumentbetrachter-Layoutmodi

- **Immersiver Modus:** Vollbild-Dokumentlesen mit minimaler UI
- **Workflow-Modus:** Dokumentbetrachter mit Auftragskontext-Panel und Tools
- **Vergleichsmodus:** Nebeneinander-Dokumentanzeige für verwandte Dateien
- **Mobiler Modus:** Optimiertes einspaltige Layout mit Wischnavigation

## Benutzerflüsse

### Primärer Dokumentinteraktionsfluss

**Benutzerziel:** PDF-Dokumente innerhalb eines Auftrags effizient überprüfen und bearbeiten

**Einstiegspunkte:**

- Auftragsdetailseite → "Dokumente anzeigen"-Button
- Dashboard-Benachrichtigung → Direkter Dokumentlink
- Dokumentliste innerhalb des Auftrags → Individuelle Dokumentauswahl

**Erfolgskriterien:**

- Benutzer können nahtlos zwischen allen Auftragsdokumenten navigieren
- Lesefortschritt wird verfolgt und bewahrt
- Benutzer können Bewertungsaufgaben erledigen, ohne den Dokumentkontext zu verlassen

```mermaid
graph TD
    A[Auftrag Ausgewählt] --> B[Dokumentlistenansicht]
    B --> C{Mehrere Dokumente?}
    C -->|Ja| D[Erstes/Prioritätsdokument Auswählen]
    C -->|Nein| E[Einzeldokument Öffnen]
    D --> F[Dokumentbetrachter Öffnet]
    E --> F
    F --> G[Lesemodus Aktiv]
    G --> H{Tools Benötigt?}
    H -->|Nein| I[Weiterlesen]
    H -->|Ja| J[Tool-Panel Einblenden]
    J --> K{Tool-Typ?}
    K -->|Annotieren| L[Annotationsmodus]
    K -->|Suchen| M[Such-Panel]
    K -->|Nachricht| N[Nachrichten-Seitenleiste]
    K -->|Navigieren| O[Dokumentnavigation]
    L --> P[Annotation Speichern]
    M --> Q[Zu Ergebnissen Springen]
    N --> R[Nachrichten Senden/Empfangen]
    O --> S[Zu Abschnitt/Seite Springen]
    P --> I
    Q --> I
    R --> I
    S --> I
    I --> T{Dokument Vollständig?}
    T -->|Nein| H
    T -->|Ja| U[Dokument Als Erledigt Markieren]
    U --> V{Weitere Dokumente?}
    V -->|Ja| W[Nächstes Dokument]
    V -->|Nein| X[Auftrag Abgeschlossen]
    W --> F
```

### Dokumentvergleichsfluss

**Benutzerziel:** Informationen über mehrere verwandte Dokumente hinweg vergleichen

**Einstiegspunkte:**

- Dokumentbetrachter → "Vergleichen"-Button
- Auftragsübersicht → "Dokumente Vergleichen"-Aktion

**Erfolgskriterien:**

- Nebeneinander-Anzeige verwandter Dokumente
- Synchronisierte Scrolling-Option verfügbar
- Einfacher Wechsel zwischen Vergleichs- und Einzeldokumentmodi

```mermaid
graph TD
    A[Vergleich Initiiert] --> B[Zu Vergleichende Dokumente Auswählen]
    B --> C[Geteilte Bildschirm-Layout]
    C --> D[Dokument A Linkes Panel]
    C --> E[Dokument B Rechtes Panel]
    D --> F{Sync-Scrolling?}
    E --> F
    F -->|Ja| G[Synchronisierte Navigation]
    F -->|Nein| H[Unabhängige Navigation]
    G --> I[Querverweislesen]
    H --> I
    I --> J{Dokumente Wechseln?}
    J -->|Ja| K[Dokumentauswahl-Menü]
    J -->|Nein| L[Vergleich Fortsetzen]
    K --> M[Panel-Dokument Ersetzen]
    M --> I
    L --> N{Annotation Hinzufügen?}
    N -->|Ja| O[Dokumentübergreifende Notiz]
    N -->|Nein| P[Weiterlesen]
    O --> Q[Dokumente in Notiz Verknüpfen]
    Q --> P
    P --> R{Vergleich Abgeschlossen?}
    R -->|Nein| I
    R -->|Ja| S[Zurück zur Einzelansicht]
```

### Grenzfälle & Fehlerbehandlung

- **Dokumentladefehler** → Wiederholungsmechanismus mit Offline-Anzeige
- **Große Dokumentleistung** → Progressives Laden mit Seitenstückelung
- **Session-Timeout** → Automatisches Speichern der Leseposition und Annotationen
- **Netzwerkunterbrechung** → Offline-Lesemodus mit Synchronisation bei Wiederverbindung
- **Annotationskonflikte** → Versionskontrolle mit Merge-Optionen
