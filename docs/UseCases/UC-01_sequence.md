# Das sind Rollen:
- 8023
- Gutachter

# Das sind Systeme:
- eLogin
- rvGutachten
- rvSMD

# Das ist der Ablauf: 
01. eLogin: 8023 legt Gutachter in eLogin an
02. eLogin: eLogin-ID wird erzeugt
03. rvSMD: 8023 Trägt EFN beim Gutachter ein
04. rvGutachten: 8023 legt neuen Gutachter mit Registrierungs-Daten an
05. rvGutachten: erzeugt Aktivierungscode und verknüpft mit EFN
06. rvGutachten: versendet Aktivierungscode per Brief
07. Gutachter: erhält Brief mit Aktivierungscode
08. eLogin: Gutachter logt sich ein
09. eLogin: übergibt eLogin-Token an rvGutachten
10. rvGutachten: Gutachter gibt nach erstem Einloggen Aktivierungscode und EFN ein
11. rvGutachten: verknüpft EFN mit eLogin-ID
12. rvGutachten: übergibt Status der Registrierung an rvSMD
13. rvSMD: 8023 trägt Status der Registrierung ein

