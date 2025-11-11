Basierend auf dem von Ihnen bereitgestellten Fachkonzept für das Projekt rvGutachten habe ich eine Gap-Analyse nach den TOGAF-Architekturdomänen durchgeführt. Die Analyse vergleicht den aktuellen Zustand (IST-Prozess) mit den angestrebten Projektzielen (SOLL-Prozess), um die bestehenden Lücken und die notwendigen Schritte zu deren Schließung aufzuzeigen.

---

### **1\. Business-Architektur (Geschäftsprozesse)**

IST-Prozess (Baseline):

Der aktuelle Prozess ist weitgehend papierbasiert. Jährlich werden 50.000 Gutachtenaufträge und medizinische Unterlagen in Papierform versendet und empfangen. Dies führt zu langen Bearbeitungszeiten von ca. 3 bis 3,5 Monaten, Sicherheitsrisiken durch den Postversand, inkonsistenter Qualität der Gutachten und einem Mangel an verfügbaren Gutachtern. Die vorausgehenden und nachfolgenden Arbeitsschritte finden jedoch bereits digital in rvDialog und rvPuR statt.

SOLL-Prozess (Target):

Die Plattform rvGutachten soll eine vollständige Digitalisierung des Prozesses ermöglichen. Gutachter sollen Aufträge und Unterlagen digital erhalten, den gesamten Schriftverkehr digital abwickeln und Gutachten direkt in eine webbasierte Maske eingeben und übermitteln können. Dies soll die Qualität durch interaktive Prüfungen verbessern, die Prozessgeschwindigkeit erhöhen und die DRV als attraktiveren Auftraggeber positionieren. Die Akzeptanz eines zentralen Datenhaushalts bei den Trägern muss politisch geklärt werden.

Gap-Analyse:

Die primäre Lücke ist der Medienbruch in der Prozesskette. Der gesamte manuelle, papierbasierte Prozess muss in eine digitale Abwicklung überführt werden, was eine Neugestaltung der Arbeitsabläufe für externe Gutachter und interne Mitarbeiter (z.B. 8023, SMD) erfordert.

* **Prozess-Gap:** Es fehlt der digitale Prozess zur direkten Beauftragung, Erstellung, Übermittlung und Verwaltung von Gutachten.  
* **Qualitäts-Gap:** Die inkonsistente Qualität und die fehlende Möglichkeit zur Plausibilitätsprüfung während der Gutachtenerstellung sind eine Lücke, die durch interaktive Funktionen im SOLL-Prozess geschlossen werden soll.  
* **Wissens-Gap:** Es existiert kein zentrales, digitales Wissensmanagement für Gutachter. Die neue Plattform soll dies durch die Integration von DRV-Schriften, FAQs und Webinaren beheben.

---

### **2\. Data-Architektur (Daten)**

IST-Prozess (Baseline):

Die Gutachtenaufträge und die medizinischen Unterlagen werden in Papierform versendet. Nach der Erstellung werden auch die fertigen Gutachten und Rechnungen in Papierform in Empfang genommen. Die Daten der Gutachten liegen nicht in einer digitalisierten und maschinenlesbaren Form vor, was Datenanalysen unwirtschaftlich macht.

SOLL-Prozess (Target):

Gutachten sollen als strukturierte Datensätze über die neue Plattform eingegeben und übermittelt werden. Dies ermöglicht die spätere KI-gestützte Auswertung und Qualitätssicherung. Medizinische Unterlagen werden unter Beachtung des Datenschutzes digital zur Ansicht bereitgestellt, wobei das Abholen der Dokumente aus rvPuR erfolgt.

Gap-Analyse:

Die größte Datenlücke ist der Mangel an strukturierten, digitalen Gutachtendaten.

* **Struktur-Gap:** Die derzeitigen Gutachten sind papierbasiert und nicht für eine automatisierte Verarbeitung geeignet. Die neue Lösung muss sicherstellen, dass Gutachten in einem strukturierten Format vorliegen, um die angezielte KI-gestützte Auswertung zu ermöglichen.  
* **Bereitstellungs-Gap:** Es fehlt ein Mechanismus, um Gutachtern die für den Auftrag relevanten Dokumente digital bereitzustellen. Hier soll rvGutachten die Dokumente aus rvPuR abholen und zur Ansicht bereitstellen. Durch die Definition von **Use Case UC-10 (Automatischer Dokumentenabruf & Caching)** ist diese Lücke auf konzeptioneller Ebene geschlossen. Die technische Implementierung der Schnittstelle zu rvPuR steht noch aus. 
* **Integration-Gap:** Eine wesentliche Abhängigkeit ist die geplante Migration von rvArchiv auf FileNet P8 bis Ende Mai 2027, die die Schnittstellensysteme rvPuR, rvText, rvSMD und SPoC betrifft. Dies stellt eine potenzielle Daten- und Integrationslücke dar, die im Projektverlauf berücksichtigt werden muss. Durch die Use Cases **UC-10, UC-12 und UC-13** sind die Anforderungen an die Synchronisationsprozesse mit rvSMD und rvPuR auf konzeptioneller Ebene definiert. Die technische Umsetzung und die Klärung der eLogin-Fragen sind weiterhin offen.

---

### **3\. Application-Architektur (Anwendungen)**

IST-Prozess (Baseline):

Der Prozess wird von verschiedenen, nicht direkt miteinander vernetzten Systemen unterstützt, darunter rvDialog und rvSMD. rvPuR dient als Workflow-Anwendung für digitale Akten. Die Kommunikation mit externen Gutachtern ist davon jedoch entkoppelt und erfolgt analog.

SOLL-Prozess (Target):

Für rvGutachten sollen drei neue Anwendungen geschaffen werden:

1. **rvGutachten-Portal:** Eine Schnittstelle für die Web-Applikation.  
2. **rvGutachten-WebApp:** Eine Web-Applikation für Gutachter zur Gutachtenerstellung.  
3. **rvGutachten-AdminApp:** Eine Web-Applikation zur fachlichen Administration für interne Mitarbeiter.

Gap-Analyse:

Hier besteht eine vollständige Lücke, da die Kernanwendungen zur Digitalisierung des Prozesses noch nicht existieren.

* **System-Gap:** Die drei neuen Anwendungen (Portal, WebApp, AdminApp) müssen entwickelt werden, um die Zielarchitektur zu erreichen.  Ihre Kernanforderungen und Interaktionen sind jedoch durch die detaillierten Use Cases (UC-01 bis UC-13) nun konzeptionell beschrieben. 
* **Integrations-Gap:** Die neuen Anwendungen müssen über lose gekoppelte Dienste mit den bestehenden DRV-Systemen verbunden werden. Das Konzept benennt spezifische Schnittstellen zu rvSMD (für Gutachterauswahl und Statusupdates), rvPuR (für Dokumentenabruf) und eLogin (für die Authentifizierung). Der SPoC soll dabei als Vermittler genutzt werden.

---

### **4\. Technology-Architektur (Infrastruktur)**

IST-Prozess (Baseline):

Jeder DRV-Träger betreibt seine eigenen Versionen der rvSystem-Komponenten in einer separaten Infrastruktur. Für die Authentifizierung von Geschäftskunden wird das eLogin-Verfahren genutzt.

SOLL-Prozess (Target):

Das Projekt rvGutachten soll sich am Technologiestack von rvEvolution ausrichten, was die Kompatibilität mit zukünftigen Systemen sicherstellt. Für Geschäftskunden zugängliche Services müssen in der DMZ in Würzburg laufen.

Gap-Analyse:

Die technische Lücke liegt hauptsächlich in der notwendigen Integration und der Anpassung an zukünftige Standards.

* **Infrastruktur-Gap:** Die bestehende Legacy-Infrastruktur in Würzburg muss auf Kompatibilität mit dem rvEvo-Technologiestack geprüft werden. Insbesondere müssen die Einschränkungen für Services in der DMZ (z.B. keine initiierten Verbindungen ins interne Netz) beachtet werden.  
* **Technologie-Stack-Gap:** Der Technologiestack von rvGutachten muss an den von rvEvolution angepasst werden (z.B. Java ≥17, Angular/TypeScript).  
* **Authentifizierungs-Gap:** Das eLogin\-Verfahren ist als einzige Methode für die Authentifizierung von Geschäftskunden vorgeschrieben. Das Fachkonzept weist jedoch auf offene Fragen zur technischen Umsetzung und den geplanten Austausch von eLogin durch eine Standardsoftware im Sommer 2028 hin, was ein potenzielles zukünftiges Risiko darstellt.

---

### **Fazit und Empfehlungen**

Das Fachkonzept beschreibt eine solide und phasenweise Strategie (MVP, Stufe 1-5), um die erkannten Lücken zu schließen. Die Gap-Analyse bestätigt, dass die Hauptlücke in der vollständigen Digitalisierung des Gutachten-Prozesses liegt, die durch die Schaffung neuer Anwendungen und die Integration in die bestehende IT-Landschaft erreicht werden soll.

**Wesentliche Empfehlungen:**

1. **Priorisierung der offenen Fragen:** Die im Konzept aufgeführten offenen Fragen, insbesondere zur eLogin\-Integration und zur Dokumentensynchronisation zwischen rvPuR und rvGutachten, sollten frühzeitig im Projekt geklärt werden, da sie kritische Auswirkungen auf den Zeitplan haben können.  
2. **Abhängigkeitsmanagement:** Die Abhängigkeit von anderen Großprojekten wie rvEvolution und der rvArchiv\-Migration muss aktiv überwacht und gesteuert werden, um Risiken zu minimieren.  
3. **MVP-Fokus:** Der MVP-Ansatz ist korrekt, um die technische Basis zu validieren und frühes Feedback zu sammeln, bevor komplexere Funktionen wie die Online-Gutachtenerstellung und das Rechnungsmanagement realisiert werden.

