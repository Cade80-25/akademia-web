import os
from pathlib import Path

base = Path(r'C:\Users\USUARIO\Projects\akademia-web2')
html_files = list(base.rglob('*.html'))

print(f"Encontrados {len(html_files)} archivos HTML")

for f in html_files:
    content = f.read_text(encoding='utf-8')
    original = content
    
    # Inyectar auth.js antes de main.js si no está ya
    if '../js/auth.js' not in content:
        content = content.replace(
            '<script defer src="../js/main.js"></script>',
            '<script defer src="../js/auth.js"></script>\n  <script defer src="../js/main.js"></script>'
        )
    
    if content != original:
        f.write_text(content, encoding='utf-8')
        print(f"  + auth.js inyectado en {f.name}")
    else:
        print(f"  - {f.name} sin cambios")

print("Done.")