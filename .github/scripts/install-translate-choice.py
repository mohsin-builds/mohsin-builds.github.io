from pathlib import Path
import re
root=Path('.')
pages=[p for p in root.glob('*.html') if 'google' not in p.name]
pages+=list((root/'blog').glob('*.html'))
assert len(pages)>=20, len(pages)
for p in pages:
 s=p.read_text(encoding='utf-8')
 if 'google-translate-choice.js' in s:continue
 s,n=re.subn(r'</head>',r'<link rel="stylesheet" href="/css/google-translate-choice.css?v=1"></head>',s,count=1,flags=re.I)
 assert n==1,p
 s,n=re.subn(r'</body>',r'<script defer src="/js/google-translate-choice.js?v=1"></script></body>',s,count=1,flags=re.I)
 assert n==1,p
 p.write_text(s,encoding='utf-8')
print('Updated:',len(pages),'original pages')
