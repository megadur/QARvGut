sequenceDiagram
    participant G as Gutachter
    participant ADM as 8023<br/>(DRV-Admin)
    participant RVS as rvSMD<br/>System
    participant EL as eLogin<br/>System
    participant RVG as rvGutachten<br/>System
    participant POST as Postservice
    participant EMAIL as E-Mail<br/>Service
   
    Note over G,EMAIL: UC-01 Version 3: Vollständiger Admin-verwalteter Workflow
   
    %% Phase 1: Initiale Interessensbekundung
    G->>ADM: 01. Interesse an Teilnahme bekundet
    ADM->>POST: 02. Brief zur Datenerhebung versenden
    POST-->>G: Brief erhalten
   
    %% Phase 2: Datensammlung
    G->>POST: 03. Formular ausgefüllt per Brief<br/>(Name, Geburtsdatum, EFN)
    POST-->>ADM: Formular erhalten
   
    %% Phase 3: System-Setup durch Admin
    ADM->>RVS: 04. EFN beim Gutachter eintragen
    RVS->>RVG: 05. Datenübertragung<br/>(Name, Vorname, EFN, Adresse, Träger KTAN)
   
    %% Phase 4: eLogin Account Creation
    ADM->>EL: 06. Neuen Gutachter anlegen<br/>(E-Mail + EFN)
    EL->>EL: 06b. eLogin-ID + Aktivierungscode generieren
    EL-->>ADM: eLogin-ID erstellt
   
    %% Phase 5: Data Verification & Linking
    ADM->>RVS: 07. Daten aus eLogin abrufen
    ADM->>ADM: 08. Gutachter-Daten überprüfen
    ADM->>RVS: 09. Gutachter aus eLogin-Liste auswählen
    ADM->>RVS: 10. EFN mit eLogin-ID verknüpfen
   
    %% Phase 6: Postal Activation
    ADM->>POST: 11. Brief mit eLogin-Code versenden
    POST-->>G: 12. Brief mit Registrierungscode erhalten
   
    %% Phase 7: Initial eLogin Activation
    G->>EL: 13. Erstmaliges Einloggen
    G->>EL: 14. Mit Aktivierungscode registrieren
    EL->>EL: 15. Gutachter aktivieren
    EL-->>G: eLogin-Account aktiv
   
    %% Phase 8: rvGutachten Integration
    G->>EL: 16. Login bei rvGutachten über eLogin
    EL->>EL: 17. Gutachter authentifizieren
    EL->>EL: 18. eLogin-Token ausstellen
    EL->>RVG: 19. eLogin-Token übergeben
   
    %% Phase 9: rvGutachten Account Linking
    Note over RVG: Token-Verarbeitung
    RVG->>RVG: 20. OAuth2-Token erstellen
    RVG->>G: 21. Dialog öffnen: Token + EFN eingeben
   
    %% Phase 10: Final Activation
    alt EFN und Token passen zusammen
        RVG->>RVG: 22. Aktivierungscode erstellen
        RVG->>EMAIL: 23. Aktivierungscode per E-Mail
        EMAIL-->>G: E-Mail mit Aktivierungslink
       
        G->>RVG: 24. Link öffnen + Code eingeben
        RVG->>RVG: 25. Gutachter aktivieren
       
        %% Phase 11: Status Synchronization
        RVG->>RVS: 26. Statusänderung melden
        RVS->>RVS: 27. Registrierungsstatus aktualisieren
       
        RVG-->>G: Vollzugriff gewährt
    else EFN/Token Mismatch
        RVG-->>G: Validierungsfehler
    end