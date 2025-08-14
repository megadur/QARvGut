# User Story: Geteilte UI-Komponenten-Bibliothek

**Story ID:** STORY-MONO-003  
**Epic:** EPIC-MONOREPO-001  
**Story Titel:** Als Entwickler möchte ich eine geteilte UI-Komponenten-Bibliothek  
**Story Besitzer:** Product Owner (Sarah)  
**Erstellt:** 13. August 2025  
**Status:** Bereit für Entwicklung  
**Priorität:** Mittel  
**Story Points:** 5  

## User Story

**Als** Frontend-Entwickler  
**möchte ich** eine geteilte UI-Komponenten-Bibliothek  
**damit** ich gemeinsame UI-Komponenten über gutachter-app und management-app hinweg für Konsistenz und Effizienz wiederverwenden kann  

## Abnahmekriterien

### AC1: Bibliotheks-Setup

- [ ] `shared-ui` Bibliothek im `/libs` Verzeichnis erstellt
- [ ] Angular-Bibliotheks-Struktur mit ordnungsgemäßen Exporten
- [ ] Build-Konfiguration für Bibliotheks-Kompilierung
- [ ] TypeScript-Deklarationen und Barrel-Exporte

### AC2: Kern-Komponenten-Migration

- [ ] Button-Komponenten mit konsistentem Styling
- [ ] Formular-Steuerelemente (input, select, checkbox, radio)
- [ ] Modal/Dialog-Komponenten
- [ ] Loading-Spinner und Fortschritts-Indikatoren
- [ ] Alert- und Benachrichtigungs-Komponenten

### AC3: Layout-Komponenten

- [ ] Header/Navigations-Komponenten
- [ ] Sidebar/Menü-Komponenten  
- [ ] Card/Panel-Komponenten
- [ ] Grid/Tabellen-Komponenten
- [ ] Paginierungs-Komponenten

### AC4: Integration und Verwendung

- [ ] Komponenten können in beiden Anwendungen importiert werden
- [ ] Konsistentes Theming über alle Komponenten
- [ ] Komponenten-Dokumentation mit Beispielen
- [ ] Unit-Tests für alle geteilten Komponenten

## Technische Implementierungsdetails

### Bibliotheks-Struktur

```
libs/shared-ui/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── buttons/
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   ├── modals/
│   │   │   └── feedback/
│   │   ├── directives/
│   │   └── pipes/
│   ├── public-api.ts
│   └── index.ts
├── ng-package.json
├── package.json
├── project.json
└── README.md
```

### Komponenten-Standards

- **Naming Convention:** `qrv-*` Präfix für alle Komponenten
- **Styling:** SCSS mit Bootstrap 5 Integration
- **Barrierefreiheit:** WCAG 2.1 AA Konformität
- **Testing:** Jest Unit-Tests mit >80% Coverage

### Prioritäts-Komponenten-Liste

1. **QrvButton** - Primary, secondary, danger Varianten
2. **QrvFormField** - Konsistenter Formular-Input-Wrapper
3. **QrvModal** - Wiederverwendbarer Modal-Dialog
4. **QrvSpinner** - Lade-Indikator
5. **QrvAlert** - Success, warning, error Benachrichtigungen

## Komponenten-Design-Anforderungen

### QrvButton Komponente

```typescript
@Component({
  selector: 'qrv-button',
  template: `...`,
  styleUrls: ['./button.component.scss']
})
export class QrvButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<void>();
}
```

### QrvFormField Komponente

- Bootstrap form-group Wrapper
- Konsistente Label- und Validierungs-Styling
- Fehlermeldungs-Anzeige
- Pflichtfeld-Indikatoren

## Definition of Done

- [ ] Alle Prioritäts-Komponenten implementiert und getestet
- [ ] Komponenten erfolgreich in beiden Apps importiert
- [ ] Dokumentation mit Verwendungsbeispielen erstellt
- [ ] Build-Pipeline enthält Bibliotheks-Kompilierung
- [ ] Storybook-Dokumentation (falls anwendbar)
- [ ] Code-Review abgeschlossen

## Zukünftige Überlegungen

- **Erweiterte Komponenten:** Date Picker, Rich-Text-Editoren
- **Barrierefreiheits-Verbesserungen:** Screen Reader Optimierungen
- **Theming-System:** Dynamischer Theme-Wechsel
- **Icon-Bibliothek:** Standardisierte Icon-Komponenten

## Notizen

- Sicherstellen, dass Komponenten mit bestehendem Bootstrap 5 Styling funktionieren
- Konsistenz mit aktueller QARvGut Design-Sprache beibehalten
- Mobile Responsiveness für alle Komponenten berücksichtigen
- Internationalisierung (i18n) Support planen
