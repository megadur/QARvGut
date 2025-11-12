#!/bin/bash
# Standardize participant abbreviations and add leading zeros

for file in UC-*.mmd UC-*.md; do
  [ -f "$file" ] || continue
  echo "Processing: $file"
  
  # Standardize participants (order matters!)
  sed -i 's/participant G as Gutachter$/participant GUT as Gutachter/g' "$file"
  sed -i 's/participant M as 8023-Mitarbeiter$/participant DRV as 8023-Mitarbeiter/g' "$file"
  sed -i 's/participant M as DRV-Mitarbeiter$/participant DRV as DRV-Mitarbeiter/g' "$file"
  sed -i 's/participant SMD as rvSMD System$/participant SMD as rvSMD System/g' "$file"
  sed -i 's/participant RG as rvGutachten System$/participant RVG as rvGutachten System/g' "$file"
  sed -i 's/participant GUT as rvGutachten-System$/participant RVG as rvGutachten-System/g' "$file"
  sed -i 's/participant S as rvGutachten-System$/participant RVG as rvGutachten-System/g' "$file"
  sed -i 's/participant EL as eLogin/participant ELG as eLogin/g' "$file"
  sed -i 's/participant EMAIL as E-Mail/participant EML as E-Mail/g' "$file"
  sed -i 's/participant ES as E-Mail System$/participant EML as E-Mail System/g' "$file"
  sed -i 's/participant AM as Audit Manager$/participant AUD as Audit Manager/g' "$file"
  sed -i 's/participant NM as Notification Manager$/participant NTF as Notification Manager/g' "$file"
  sed -i 's/participant TM as Template Manager$/participant TPL as Template Manager/g' "$file"
  sed -i 's/participant PUR as rvPuR/participant PUR as rvPuR/g' "$file"
  sed -i 's/participant SM as Session Manager$/participant SSN as Session Manager/g' "$file"
  sed -i 's/participant RT as Real-Time Updates$/participant RTU as Real-Time Updates/g' "$file"
  sed -i 's/participant U as Benutzer$/participant USR as Benutzer/g' "$file"
  sed -i 's/participant ADM as Administrator$/participant ADM as Administrator/g' "$file"
  
  # Fix actor declarations
  sed -i 's/actor G as Gutachter$/actor GUT as Gutachter/g' "$file"
  sed -i 's/actor ADM as 8023/actor DRV as 8023/g' "$file"
  sed -i 's/participant RVS as rvSMD/participant SMD as rvSMD/g' "$file"
  
  # Add leading zeros to step numbers (1-9 become 01-09)
  sed -i 's/\([>:-]\) \([1-9]\)\. /\1 0\2. /g' "$file"
  
done

echo "Done!"
