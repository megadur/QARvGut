# QARvGut - UML Anwendungsfall-Diagramme (Deutsch)

**Dokumentversion:** 1.0  
**Projekt:** QARvGut Enhanced User Management  
**Erstellt:** 5. Januar 2026  
**Typ:** UML Use Case Diagrams  

---

## Übersicht

Dieses Dokument präsentiert UML-Anwendungsfall-Diagramme, organisiert nach Funktionsbereichen. Jedes Diagramm zeigt die relevanten Akteure, Anwendungsfälle und deren Beziehungen innerhalb einer Systemgrenze.

---

## 1. Benutzer-Verwaltung & Onboarding

### Mermaid-Diagramm (für Markdown-Vorschau)

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#d5e8d4','primaryTextColor':'#000','primaryBorderColor':'#82b366','lineColor':'#6c8ebf','secondaryColor':'#ffe6cc','tertiaryColor':'#fff'}}}%%
graph TB
    subgraph System["<b>rvGutachten System</b>"]
        direction TB
        BUC01["<b>BUC-01</b><br/>Gutachter-Onboarding<br/><i>(Registrierung & Aktivierung)</i><br/>🟢 Kritisch"]
        BUC02["<b>BUC-02</b><br/>System-Authentifizierung<br/><i>(Benutzer-Anmeldung)</i><br/>🟢 Kritisch"]
        BUC03["<b>BUC-03</b><br/>DRV-Mitarbeiter-<br/>Zugriffsverwaltung<br/>🟢 Kritisch"]
    end
    
    %% Primäre Akteure (Links)
    NG["<b>👤 Neuer<br/>Gutachter</b>"]
    RB["<b>👤 Registrierter<br/>Benutzer</b>"]
    DM["<b>👤 DRV-<br/>Mitarbeiter</b>"]
    
    %% Sekundäre System-Akteure (Rechts)
    eLogin["📦 eLogin<br/><i>(Identitätsverwaltung)</i>"]
    rvSMD["📦 rvSMD<br/><i>(Stammdaten)</i>"]
    rvGA["📦 rvGutachtenAdmin<br/><i>(Admin-Portal)</i>"]
    
    %% Primäre Assoziationen (durchgezogen, dick)
    NG ====|"<b>registriert sich</b>"| BUC01
    RB ====|"<b>meldet sich an</b>"| BUC02
    DM ====|"<b>verwaltet Zugriff</b>"| BUC03
    
    %% Sekundäre Assoziationen (gestrichelt)
    DM -.->|"genehmigt"| BUC01
    NG -.->|"nutzt nach Aktivierung"| BUC02
    DM -.->|"nutzt"| BUC02
    
    %% System-Abhängigkeiten (gepunktet)
    BUC01 -.->|"«validate»"| eLogin
    BUC01 -.->|"«validate»"| rvSMD
    BUC03 -.->|"«validate»"| eLogin
    BUC03 -.->|"«uses»"| rvGA
    
    %% Styling
    classDef ucCritical fill:#d5e8d4,stroke:#82b366,stroke-width:3px,color:#000
    classDef actorPrimary fill:#dae8fc,stroke:#6c8ebf,stroke-width:3px,color:#000
    classDef actorSecondary fill:#ffe6cc,stroke:#d79b00,stroke-width:3px,color:#000
    classDef systemActor fill:#e1d5e7,stroke:#9673a6,stroke-width:2px,color:#000
    
    class BUC01,BUC02,BUC03 ucCritical
    class NG,RB actorPrimary
    class DM actorSecondary
    class eLogin,rvSMD,rvGA systemActor
```

### Draw.io-Diagramm

📎 **Vollständiges UML-Diagramm:** [UML-01-Benutzer-Verwaltung-Onboarding.drawio](UML-01-Benutzer-Verwaltung-Onboarding.drawio)

> 💡 **Hinweis:** Das Draw.io-Diagramm kann mit [diagrams.net](https://app.diagrams.net/) oder der VS Code Draw.io-Extension geöffnet und bearbeitet werden.

### Beschreibung: Benutzer-Verwaltung & Onboarding

**Primäre Akteure:**
- **Neuer Gutachter:** Registriert sich im System
- **Registrierter Benutzer:** Meldet sich an
- **DRV-Mitarbeiter:** Genehmigt neue Registrierungen

**Anwendungsfälle:**
- **BUC-01** (Kritisch 🟢): Neuer Gutachter durchläuft Registrierungs- und Aktivierungsprozess mit DRV-Genehmigung
- **BUC-02** (Kritisch 🟢): Jeder registrierte Benutzer authentifiziert sich

**Systemintegration:**
- eLogin validiert Gutachter-Identität
- rvSMD prüft Stammdaten
- rvGutachtenAdmin unterstützt Admin-Funktionen

---

## 2. Auftrags-Verwaltung - Gutachter-Perspektive

```mermaid
graph TB
    subgraph "rvGutachten System"
        BUC04["BUC-04: Auftragsübersicht<br/>& -verwaltung"]
        BUC05["BUC-05: Auftragsdetails<br/>& Dokumenteneinsicht"]
        BUC10["BUC-10: Automatische<br/>Dokumentenbereitstellung"]
        BUC12["BUC-12a: Gutachter ändert<br/>Auftragsstatus"]
    end
    
    subgraph Systeme
        rvSMD["rvSMD<br/>(Stammdatenverwaltung)"]
        rvPUR["rvPUR<br/>(Dokumentenarchiv)"]
    end
    
    %% Akteure
    GA["👤 Gutachter"]
    GM["👤 Gutachtermitarbeiter"]
    
    %% Beziehungen
    GA -->|nutzt| BUC04
    GA -->|nutzt| BUC05
    GA -->|nutzt| BUC10
    GA -->|nutzt| BUC12
    
    GM -->|nutzt| BUC04
    GM -->|nutzt| BUC05
    GM -->|nutzt| BUC12
    
    %% Use Case Abhängigkeiten
    BUC04 -->|führt zu| BUC05
    BUC05 -->|verwaltet| BUC10
    BUC05 -->|ermöglicht| BUC12
    
    %% System-Integrationen
    BUC04 -.->|lädt Daten| rvSMD
    BUC10 -.->|ruft ab| rvPUR
    BUC12 -.->|synchronisiert mit| rvSMD
    
    style BUC04 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC05 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC10 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC12 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style GA fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style GM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
```

### Beschreibung: Auftrags-Verwaltung - Gutachter-Perspektive

**Primäre Akteure:**
- **Gutachter:** Verwaltet Aufträge und Dokumente
- **Gutachtermitarbeiter:** Unterstützt Gutachter bei der Auftragsbearbeitung

**Anwendungsfälle:**
- **BUC-04** (Hoch 🟡): Zeigt Übersicht aller zugewiesenen Aufträge
- **BUC-05** (Hoch 🟡): Zeigt Auftragsdetails und verwaltet Dokumente
- **BUC-10** (Hoch 🟡): Automatische Bereitstellung von Dokumenten beim Auftrag
- **BUC-12a** (Mittel 🟡): Änderung des Auftragsstatus durch Gutachter

**Use Case Abhängigkeiten:**
- BUC-04 → BUC-05: Auftragsdetails werden von der Übersicht aus aufgerufen
- BUC-05 → BUC-10: Dokumente sind innerhalb der Auftragsdetails verfügbar
- BUC-05 → BUC-12a: Statusänderung erfolgt im Detail-View

---

## 3. Auftrags-Verwaltung - DRV-Perspektive

```mermaid
graph TB
    subgraph "rvGutachten System"
        BUC11["BUC-11: Statusänderungen<br/>Gutachter"]
        BUC13["BUC-13: Auftragsstornierung"]
    end
    
    subgraph Systeme
        rvSMD["rvSMD<br/>(Stammdatenverwaltung)"]
        rvGutachten["rvGutachten<br/>(Kern-System)"]
    end
    
    %% Akteure
    SM["👤 8023-Mitarbeiter<br/>(rvSMD-Betreiber)"]
    
    %% Beziehungen
    SM -->|verwaltet| BUC11
    SM -->|führt durch| BUC13
    
    %% Use Case Abhängigkeiten
    BUC11 -->|aktualisiert| BUC13
    
    %% System-Integrationen
    BUC11 -.->|ändert Status in| rvSMD
    BUC11 -.->|synchronisiert zu| rvGutachten
    
    BUC13 -.->|initiiert in| rvSMD
    BUC13 -.->|synchronisiert zu| rvGutachten
    
    style BUC11 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC13 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style SM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
```

### Beschreibung: Auftrags-Verwaltung - DRV-Perspektive

**Primäre Akteure:**
- **8023-Mitarbeiter:** Führt Statusänderungen in rvSMD durch, die mit rvGutachten synchronisiert werden

**Anwendungsfälle:**
- **BUC-11** (Mittel 🟡): Ändert Gutachter-Status (aktiv, gesperrt, reaktiviert, gelöscht)
- **BUC-13** (Mittel 🟡): Storniert Aufträge mit automatischer Synchronisation

**System-Integrationen:**
- Statusänderungen in rvSMD werden automatisch zu rvGutachten synchronisiert
- Bidirektionale Datensynchronisation zwischen Systemen

---

## 4. Support & Betriebsüberwachung

```mermaid
graph TB
    subgraph "rvGutachten System"
        BUC06["BUC-06: E-Mail-<br/>Benachrichtigungssystem"]
        BUC07["BUC-07: Support-Dashboard<br/>& Systemüberwachung"]
        BUC09["BUC-09: Datenaufbewahrung<br/>& -löschung (DSGVO)"]
    end
    
    %% Akteure
    DM["👤 DRV-Mitarbeiter"]
    SYS["⚙️ System<br/>(Automatisiert)"]
    GA["👤 Gutachter"]
    GM["👤 Gutachtermitarbeiter"]
    
    %% Beziehungen
    SYS -->|sendet| BUC06
    DM -->|nutzt| BUC07
    DM -->|konfiguriert| BUC09
    SYS -->|führt aus| BUC09
    
    GA -->|empfängt| BUC06
    GM -->|empfängt| BUC06
    DM -->|empfängt| BUC06
    
    %% Use Case Abhängigkeiten
    BUC07 -->|unterstützt| BUC09
    BUC09 -->|triggert| BUC06
    
    style BUC06 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC07 fill:#FFB6C1,stroke:#FF1493,stroke-width:2px
    style BUC09 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style DM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style SYS fill:#F0F8FF,stroke:#696969,stroke-width:2px
    style GA fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style GM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
```

### Beschreibung: Support & Betriebsüberwachung

**Primäre Akteure:**
- **DRV-Mitarbeiter:** Überwacht System und konfiguriert Richtlinien
- **System (Automatisiert):** Führt Benachrichtigungen und Löschungen durch

**Sekundäre Akteure:**
- **Gutachter & Gutachtermitarbeiter:** Empfangen Benachrichtigungen

**Anwendungsfälle:**
- **BUC-06** (Mittel 🟡): Automatische E-Mail-Benachrichtigungen bei Ereignissen
- **BUC-07** (Niedrig 🔴): DRV-Support-Dashboard mit Systemübersicht und Auftragsverwaltung
- **BUC-09** (Mittel 🟡): Automatische Datenlöschung gemäß DSGVO und Richtlinien

**Automatisierungsprozesse:**
- BUC-06 wird automatisch bei Statusänderungen, neuen Aufträgen usw. ausgelöst
- BUC-09 läuft nach zeitbasierten Triggern

---

## 5. Erweiterte Funktionalität - Mitarbeiter-Verwaltung

```mermaid
graph TB
    subgraph "rvGutachten System"
        BUC08["BUC-08: Erweiterte<br/>Gutachtermitarbeiter-Verwaltung"]
    end
    
    subgraph Systeme
        eLogin["eLogin<br/>(Identitätsverwaltung)"]
    end
    
    %% Akteure
    GA["👤 Gutachter"]
    GM["👤 Gutachtermitarbeiter"]
    DM["👤 DRV-Mitarbeiter"]
    
    %% Beziehungen
    GA -->|nutzt| BUC08
    DM -->|genehmigt| BUC08
    
    %% Direkte Implikation
    BUC08 -->|registriert| GM
    
    %% System-Integrationen
    BUC08 -.->|validiert gegen| eLogin
    
    style BUC08 fill:#FFB6C1,stroke:#FF1493,stroke-width:2px
    style GA fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style GM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style DM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
```

### Beschreibung: Erweiterte Funktionalität - Mitarbeiter-Verwaltung

**Primäre Akteure:**
- **Gutachter:** Registriert Mitarbeiter in seinem Praxisteam
- **DRV-Mitarbeiter:** Genehmigt Mitarbeiter-Registrierungen

**Betroffene Akteure:**
- **Gutachtermitarbeiter:** Werden durch diesen Prozess aktiviert

**Anwendungsfälle:**
- **BUC-08** (Niedrig 🔴): Erlaubt Gutachtern, Mitarbeiter zu registrieren und zu verwalten

**Systemintegration:**
- eLogin validiert Mitarbeiter-Identität
- DRV-Genehmigung erforderlich für Aktivierung

---

## 6. Komplette System-Übersicht

```mermaid
graph TB
    subgraph RG["rvGutachten System"]
        direction TB
        
        subgraph Critical["🟢 KRITISCHE ANWENDUNGSFÄLLE"]
            BUC01["BUC-01: Gutachter-<br/>Onboarding"]
            BUC02["BUC-02: System-<br/>Authentifizierung"]
            BUC03["BUC-03: DRV-Mitarbeiter-<br/>Zugriffsverwaltung"]
        end
        
        subgraph HighMed["🟡 HOHE/MITTLERE PRIORITÄT"]
            BUC04["BUC-04: Auftrags-<br/>übersicht"]
            BUC05["BUC-05: Auftrags-<br/>details"]
            BUC06["BUC-06: E-Mail-<br/>Benachrichtigungen"]
            BUC09["BUC-09: Daten-<br/>aufbewahrung"]
            BUC10["BUC-10: Auto-<br/>Dokumente"]
            BUC11["BUC-11: Gutachter-<br/>Status"]
            BUC12["BUC-12a: Auftrags-<br/>status"]
            BUC13["BUC-13: Auftrags-<br/>stornierung"]
        end
        
        subgraph Low["🔴 NIEDRIGE PRIORITÄT"]
            BUC07["BUC-07: Support-<br/>Dashboard"]
            BUC08["BUC-08: Mitarbeiter-<br/>Verwaltung"]
        end
    end
    
    %% Menschliche Akteure
    NG["👤 Neuer Gutachter"]
    RB["👤 Registrierter<br/>Benutzer"]
    GA["👤 Gutachter"]
    GM["👤 Gutachter-<br/>mitarbeiter"]
    DM["👤 DRV-<br/>Mitarbeiter"]
    SM["👤 8023-<br/>Mitarbeiter"]
    
    %% System-Akteure
    SYS["⚙️ System<br/>(Automatisiert)"]
    
    %% Beziehungen
    NG -->|primary| BUC01
    RB -->|primary| BUC02
    DM -->|primary| BUC03
    
    GA -->|primary| BUC04
    GA -->|primary| BUC05
    GA -->|primary| BUC08
    GA -->|primary| BUC12
    
    GM -->|primary| BUC04
    GM -->|primary| BUC05
    GM -->|primary| BUC12
    
    SYS -->|primary| BUC06
    SYS -->|primary| BUC09
    SYS -->|primary| BUC10
    
    DM -->|primary| BUC07
    SM -->|primary| BUC11
    SM -->|primary| BUC13
    
    style BUC01 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style BUC02 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style BUC03 fill:#90EE90,stroke:#228B22,stroke-width:2px
    
    style BUC04 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC05 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC06 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC09 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC10 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC11 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC12 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BUC13 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    
    style BUC07 fill:#FFB6C1,stroke:#FF1493,stroke-width:2px
    style BUC08 fill:#FFB6C1,stroke:#FF1493,stroke-width:2px
    
    style NG fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style RB fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style GA fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style GM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style DM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style SM fill:#E8F4F8,stroke:#4A90E2,stroke-width:2px
    style SYS fill:#F0F8FF,stroke:#696969,stroke-width:2px
```

---

## Legende

### Farben nach Priorität

| Farbe | Priorität | Bedeutung |
|---|---|---|
| 🟢 Grün | Kritisch | Must-Have für MVP - Blocker für andere Features |
| 🟡 Gold | Hoch/Mittel | Wichtig für Kernfunktionalität oder Betrieb |
| 🔴 Rosa | Niedrig | Erweiterte Features, später in Sprint entwickeln |

### Symbol-Erklärung

| Symbol | Bedeutung |
|---|---|
| 👤 | Menschlicher Akteur (Benutzerrolle) |
| ⚙️ | System-Akteur (Automatisiert) |
| → | Nutzt/Führt aus (Primary Actor) |
| -.-> | Systemintegration/Abhängigkeit |

---

## Implementierungs-Roadmap basierend auf Diagrammen

### Phase 1: Fundament (Critical - Sprint 1)
1. BUC-01: Gutachter-Onboarding
2. BUC-02: System-Authentifizierung
3. BUC-03: DRV-Mitarbeiter-Zugriffsverwaltung

### Phase 2: Kernfunktionalität (High - Sprint 2)
1. BUC-04: Auftragsübersicht
2. BUC-05: Auftragsdetails & Dokumenteneinsicht
3. BUC-10: Automatische Dokumentenbereitstellung
4. BUC-12a: Auftragsstatus-Änderung

### Phase 3: Integration & Betrieb (Medium - Sprint 3)
1. BUC-11: Gutachter-Statusänderungen
2. BUC-13: Auftragsstornierung
3. BUC-06: E-Mail-Benachrichtigungen
4. BUC-09: DSGVO-Datenverwaltung

### Phase 4: Support & Erweiterung (Low - Sprint 4+)
1. BUC-07: Support-Dashboard
2. BUC-08: Mitarbeiter-Verwaltung

---

## Notizen für den Kunden

Diese UML-Anwendungsfall-Diagramme bieten:
- ✅ Klare Visualisierung aller Akteure und deren Aufgaben
- ✅ Verständlichkeit für nicht-technische Stakeholder
- ✅ Priorisierung zur Implementierungsplanung
- ✅ Systemintegrationspunkte
- ✅ Deutsche Beschriftung für Kundenverständnis

Die Diagramme können als Basis für:
- Requirements Engineering
- Testing-Strategie (Testfälle pro Use Case)
- User Training & Dokumentation
- Systemarchitektur-Planung

verwendet werden.

---

**Dokumentkontrolle:**
- Version 1.0 - Initialisierung
- Erstellt: 5. Januar 2026
- Betreuer: Product Owner Sarah
- Nächste Überprüfung: Bei neuen Anwendungsfällen
