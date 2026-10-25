from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
from PIL import Image, ImageOps
from io import BytesIO
import json, re, hashlib, time

root=Path('.')
assets=root/'assets/insights'
blog=root/'blog'
entries=[
("menu-digitale-ristorante-sito-o-pdf","FO1cBVKu90o","Marielle Ursua","Customer using a smartphone to scan a restaurant QR code"),
("modulo-preventivo-sito-artigiano-esempi","iPheGw7_UaI","Vitaly Gariev","People reviewing business paperwork at a table"),
("promemoria-appuntamenti-centro-estetico-no-show","211NmLyOzYU","Yaqing Wei","Desktop appointment calendar and books"),
("google-business-profile-website-local-service-checklist","OsEuCtV1yss","Nicholas Ng","Independent local bakery storefront"),
("website-handover-checklist-small-business","GvEK_mHiH4g","Unsplash contributor","Laptop user working through a digital project"),
("sito-web-bb-prenotazioni-dirette-guida","UvVHCAz9mFY","Clay Banks","Real guest bedroom with made bed"),
("sito-web-officina-auto-prenotazioni-preventivi","s4d_ESS0ylA","Unsplash contributor","Mechanic working on a car engine"),
("sito-web-palestra-corsi-prova-iscrizioni","Il9YbhIBiOA","Jakub Żerdzicki","Gym equipment prepared for a workout"),
("sito-web-impresa-edile-foto-lavori-sopralluoghi","E5S7Aks1fFY","shraga kopstein","Construction worker at a building site"),
("negozio-fisico-catalogo-online-o-ecommerce","qnKhZJPKFD8","Clark Street Mercantile","Real clothing boutique with merchandise racks"),
("small-business-website-speed-audit-priorities","k27hkqXuveo","Eric Stoynov","Computer server racks and electronics"),
("business-website-accessibility-practical-checklist","hqaeIsK3S2w","Unsplash contributor","Wheelchair user working on a computer"),
("multilingual-small-business-website-seo-guide","F6_mI0aGdZU","Fiona Murray-deGraaff","Laptop and notebook on a working desk"),
("online-booking-software-vs-simple-form-small-business","8PfM1CFFiRc","Unsplash contributor","Calendar on an office desk"),
("website-migration-seo-checklist-small-business","klWUhr-wPJ8","Unsplash contributor","Computer data center server racks"),
("small-business-domain-professional-email-setup","FO1cBVKu90o","Marielle Ursua","Person using a connected laptop and phone"),
("sito-web-agenzia-immobiliare-schede-immobili-visite","uZQGEo9DGe8","Brian Wangenheim","Residential property exterior"),
("landing-page-vs-full-website-small-business","ekUGdwVwfgU","Unsplash contributor","Planner and keyboard for web project preparation"),
]
assert len(entries)==18
def photo(slug,id):
    # Unsplash's public photograph download endpoint; never publish a fake/empty image.
    link=f'https://unsplash.com/photos/{quote(id)}/download?force=true&w=1600'
    req=Request(link,headers={"User-Agent":"Mozilla/5.0","Accept":"image/jpeg,image/*"})
    with urlopen(req, timeout=35) as response:
        data=response.read(9000000)
    im=Image.open(BytesIO(data)).convert('RGB')
    assert im.width>=640 and im.height>=400, (slug,im.size)
    im=ImageOps.fit(im,(1200,630),method=Image.Resampling.LANCZOS)
    dest=assets/(slug+'-cover.jpg')
    im.save(dest,'JPEG',quality=82,optimize=True)
    assert dest.stat().st_size>18000
    return str(dest)
home=(blog/'index.html').read_text()
credits=json.loads((assets/'PHOTO_CREDITS.json').read_text())
hashes=set()
for slug,id,author,alt in entries:
    path=photo(slug,id)
    digest=hashlib.sha256(Path(path).read_bytes()).hexdigest()
    assert digest not in hashes, 'duplicate cover '+slug
    hashes.add(digest)
    source='https://unsplash.com/photos/'+id
    credit={'article':'https://mohsinbuilds.com/blog/'+slug+'.html','file':path,
        'photographer':author,'source':source,'source_license':'https://unsplash.com/license',
        'usage':'Editorial photograph, not client work','description':alt}
    credits['photos']=[x for x in credits['photos'] if x.get('article')!=credit['article']]
    credits['photos'].append(credit)
    f=blog/(slug+'.html')
    content=f.read_text()
    content,count=re.subn(r'(src="../assets/insights/)[^"]+(-cover.jpg\?v=[^"]+)"',lambda m:m.group(1)+slug+'-cover.jpg?v=20261025-unique"',content,count=1)
    assert count==1,slug+' article image'
    content=re.sub(r'(<meta property="og:image" content=")[^"]+(")',lambda m:m.group(1)+'https://mohsinbuilds.com/assets/insights/'+slug+'-cover.jpg'+m.group(2),content,count=1)
    content=re.sub(r'(<meta name="twitter:image" content=")[^"]+(")',lambda m:m.group(1)+'https://mohsinbuilds.com/assets/insights/'+slug+'-cover.jpg'+m.group(2),content,count=1)
    content=re.sub(r'(<meta property="og:image:alt" content=")[^"]+(")',lambda m:m.group(1)+alt+m.group(2),content,count=1)
    content=re.sub(r'(<img\s+src="../assets/insights/[^"]+"\s+width="1200"\s+height="630"\s+alt=")[^"]+(")',lambda m:m.group(1)+alt+m.group(2),content,count=1)
    content=re.sub(r'<figcaption>[\s\S]*?</figcaption>',lambda _:f'<figcaption>Editorial photograph: {author} via <a href="{source}" target="_blank" rel="noopener noreferrer">Unsplash</a>. Not a Mohsin Builds client project.</figcaption>',content,count=1)
    content=re.sub(r'("image":\[")[^"]+("\])',lambda m:m.group(1)+'https://mohsinbuilds.com/assets/insights/'+slug+'-cover.jpg'+m.group(2),content,count=1)
    f.write_text(content)
    # Find the card linking to exactly this article.
    pattern=r'(<article class="case-panel insights-entry">(?:(?!</article>).)*?href="'+re.escape(slug)+r'\.html"(?:(?!</article>).)*?</article>)'
    def change_card(m):
        card=m.group(1)
        card,n=re.subn(r'(<img src="../assets/insights/)[^"]+(" alt="")',lambda x:x.group(1)+slug+'-cover.jpg?v=20261025-unique'+x.group(2),card,count=1)
        assert n==1,(slug,'card photo')
        return card
    home,count=re.subn(pattern,change_card,home,flags=re.S)
    assert count==1,(slug,'index card')
    print('Prepared distinct photograph:',slug,Path(path).stat().st_size,flush=True)
(blog/'index.html').write_text(home)
(assets/'PHOTO_CREDITS.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
# Final check: no two articles may reference the same cover.
from collections import Counter
refs=[]
for f in blog.glob('*.html'):
    if f.name=='index.html':continue
    m=re.search(r'<figure class="insights-featured"><img src="../assets/insights/([^"?]+)',f.read_text())
    assert m,f
    refs.append(m.group(1))
assert len(refs)==30,(len(refs),refs)
assert len(set(refs))==30,Counter(refs)
assert all((assets/x).is_file() for x in refs)
assert len(re.findall('class="case-panel insights-entry"',home))==30
print('ALL 30 distinct covers and article page references verified')
