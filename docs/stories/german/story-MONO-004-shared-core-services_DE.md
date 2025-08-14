# User Story: Geteilte Core-Services-Bibliothek

**Story ID:** STORY-MONO-004  
**Epic:** EPIC-MONOREPO-001  
**Story Titel:** Als Entwickler möchte ich eine geteilte Core-Services-Bibliothek  
**Story Besitzer:** Product Owner (Sarah)  
**Erstellt:** 13. August 2025  
**Status:** Bereit für Entwicklung  
**Priorität:** Hoch  
**Story Points:** 6  

## User Story

**Als** Frontend-Entwickler  
**möchte ich** eine geteilte Core-Services-Bibliothek mit gemeinsamer Geschäftslogik und Utilities  
**damit** ich Authentifizierung, API-Services und Utilities über beide Anwendungen hinweg konsistent wiederverwenden kann  

## Abnahmekriterien

### AC1: Bibliotheks-Setup

- [ ] `shared-core` Bibliothek im `/libs` Verzeichnis erstellt
- [ ] Injectable Services mit ordnungsgemäßer Dependency Injection
- [ ] TypeScript-Interfaces und -Modelle exportiert
- [ ] Build-Konfiguration für Bibliotheks-Kompilierung

### AC2: Authentifizierungs-Services

- [ ] AuthenticationService mit Login/Logout/Token-Management
- [ ] AuthGuard für Routen-Schutz
- [ ] JWT-Token-Interceptor für API-Aufrufe
- [ ] Benutzer-Session-State-Management

### AC3: API-Services

- [ ] Basis-HttpService mit gemeinsamer Funktionalität
- [ ] Error-Handling-Interceptor
- [ ] API-Endpoint-Konfiguration
- [ ] Response-Caching-Mechanismen

### AC4: Utility-Services

- [ ] LocalStorageService für clientseitige Speicherung
- [ ] NotificationService für Benutzer-Messaging
- [ ] ValidationService für Formular-Validierung
- [ ] DateService für Datum-Formatierung und -Manipulation

## Technische Implementierungsdetails

### Bibliotheks-Struktur

```
libs/shared-core/
├── src/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── storage/
│   │   │   └── utils/
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── auth.model.ts
│   │   │   └── api.model.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── constants/
│   │       ├── api.constants.ts
│   │       └── app.constants.ts
│   ├── public-api.ts
│   └── index.ts
├── ng-package.json
├── package.json
└── project.json
```

### Core-Services-Anforderungen

#### AuthenticationService

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  login(credentials: LoginRequest): Observable<AuthResponse>;
  logout(): void;
  getCurrentUser(): Observable<User | null>;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
  refreshToken(): Observable<AuthResponse>;
}
```

#### ApiService

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  get<T>(endpoint: string, params?: any): Observable<T>;
  post<T>(endpoint: string, data: any): Observable<T>;
  put<T>(endpoint: string, data: any): Observable<T>;
  delete<T>(endpoint: string): Observable<T>;
  uploadFile(endpoint: string, file: File): Observable<any>;
}
```

### Datenmodelle

- **User Model:** Benutzerprofil- und Authentifizierungsdaten
- **Auth Models:** Login Request/Response, Token-Daten
- **API Models:** Gemeinsame Request/Response-Interfaces
- **Error Models:** Standardisierte Fehlerbehandlung

## Integrations-Anforderungen

### Authentifizierungs-Flow

- [ ] Nahtloser Login über beide Anwendungen
- [ ] Geteilter Benutzer-Session-State
- [ ] Konsistente rollenbasierte Zugriffskontrolle
- [ ] Token-Refresh-Handling

### API-Integration

- [ ] Einheitliche Backend-API-Kommunikation
- [ ] Konsistente Fehlerbehandlung und -Messaging
- [ ] Request/Response-Logging für Debugging
- [ ] Loading-State-Management

## Definition of Done

- [ ] Alle Core-Services implementiert und getestet
- [ ] Services erfolgreich in beiden Apps importiert
- [ ] Authentifizierungs-Flows funktionieren konsistent
- [ ] API-Integration mit Backend getestet
- [ ] Unit-Tests mit >80% Coverage
- [ ] Dokumentation mit Verwendungsbeispielen

## Sicherheits-Überlegungen

- [ ] Sichere Token-Speicher-Mechanismen
- [ ] XSS und CSRF Schutz
- [ ] Input-Validierung und Sanitization
- [ ] Sichere HTTP-Interceptors

## Notizen

- Kompatibilität mit bestehender Backend-Authentifizierung sicherstellen
- Aktuelles Benutzer-Session-Verhalten beibehalten
- Offline-Fähigkeiten für Core-Services berücksichtigen
- Multi-Language-Support für Fehlermeldungen planen
