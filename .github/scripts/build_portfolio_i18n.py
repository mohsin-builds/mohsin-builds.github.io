#!/usr/bin/env python3
"""Generate static Italian portfolio pages and install a universal language selector.
Uses the free offline Argos EN→IT model once; no production translation API.
"""
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from bs4 import BeautifulSoup, NavigableString, Comment
from argostranslate import package, translate
import json, re, html, os

ROOT=Path(__file__).resolve().parents[2]
ORIGIN="https://mohsinbuilds.com"
PAGES=[
    "index.html","about.html","architecture.html","projects.html","labs.html",
    "contact.html","case-studies.html","mohsin-labs-os.html",
    "mohsin-labs-case-study.html","mohsin-tools-case-study.html",
    "product-opportunity-engine-case-study.html","website-cost-calculator-case-study.html",
]
STABLE={"Mohsin Builds","Mohsin Labs","Mohsin Labs OS","Product Opportunity Engine",
        "Website Cost Calculator","GitHub","GitHub Pages","WordPress","Shopify",
        "Stripe","Supabase","Render","Vercel","Python","TypeScript","JavaScript",
        "Next.js","React","Figma","WhatsApp","Google","AWS","HTML","CSS","API",
        "Developer OS","Mohsin Iqbal","SEO","CRM","SaaS","AI","C1"}
MANUAL={
"Home":"Inizio","Projects":"Progetti","About":"Chi sono","Contact":"Contatti",
"Case Studies":"Casi studio","Architecture":"Architettura","Labs":"Laboratorio",
"All Projects":"Tutti i progetti","More":"Altro","Search":"Cerca",
"Portfolio":"Portfolio","Portfolio home":"Homepage portfolio",
"Explore Projects":"Scopri i progetti","See Projects":"Scopri i progetti",
"View Project":"Visualizza il progetto","Learn More":"Scopri di più",
"Get in touch":"Contattami","Start a project":"Avvia un progetto",
"Start a project ↗":"Parliamo del tuo progetto ↗",
"Discuss a project →":"Parliamo di un progetto →",
"Contact Me":"Contattami","Download CV":"Scarica il CV",
"Read case study →":"Leggi il caso studio →",
"Learn more →":"Scopri di più →","View details →":"Visualizza i dettagli →",
"Search projects, apps, ideas...":"Cerca progetti, applicazioni, idee...",
"Search projects...":"Cerca progetti...",
"Search profile, skills, experience...":"Cerca profilo, competenze, esperienze...",
"Let's build something useful.":"Realizziamo qualcosa di utile.",
"Tell me what you need.":"Raccontami di cosa hai bisogno.",
"I design and build digital products that solve real problems.":"Progetto e realizzo prodotti digitali che risolvono problemi reali.",
"Building useful products from real problems.":"Creo prodotti utili partendo da problemi reali.",
"Behind the build. Beyond the interface.":"Dietro lo sviluppo, oltre l'interfaccia.",
"Selected case studies.":"Casi studio selezionati.",
"From idea to impact.":"Dall'idea all'impatto.",
"One connected workflow.":"Un unico flusso di lavoro.",
"Useful first. Premium always.":"Prima l'utilità. Sempre con cura.",
"What I can build.":"Cosa posso realizzare.",
"Experience shaped by doing.":"Esperienza costruita sul campo.",
"How ideas become products.":"Come le idee diventano prodotti.",
"Have a real problem worth solving?":"Hai un problema concreto da risolvere?",
"Build, share, learn":"Creare, condividere, imparare",
"Explore the work. See what I'm building.":"Esplora i progetti e scopri cosa sto realizzando.",
"Business Systems":"Sistemi aziendali","Development":"Sviluppo",
"Automation":"Automazione","Design":"Design",
"Currently Building":"Progetti in corso","Contact":"Contatti",
"Email":"Email","Phone":"Telefono","Message":"Messaggio","Name":"Nome",
"Send Message":"Invia messaggio","Submit":"Invia","Required":"Obbligatorio",
"Success":"Operazione riuscita","Failed":"Operazione non riuscita",
"Digital Products":"Prodotti digitali","Live demo":"Demo online",
"View demo":"Visualizza la demo","Read More":"Continua a leggere",
"Visit website":"Visita il sito","Let's Talk":"Parliamone",
"OPEN":"APRI","AVAILABLE":"DISPONIBILE","PORTFOLIO ONLINE":"PORTFOLIO ONLINE",
"DESKTOP":"SCRIVANIA","Desktop":"Scrivania",
"All rights reserved":"Tutti i diritti riservati",
}
MANUAL.update({
"From scattered tools to one business operating system.":"Da strumenti separati a un unico sistema operativo aziendale.",
"I needed a system that could help me operate, not just organize.":"Mi serviva un sistema per lavorare davvero, non soltanto per organizzarmi.",
"A connected home for the work that runs a business.":"Uno spazio connesso per le attività che fanno funzionare un'azienda.",
"Real infrastructure, with clear trust boundaries.":"Infrastruttura reale, con confini di sicurezza chiari.",
"Useful automation is controlled automation.":"Un'automazione utile è un'automazione controllata.",
"The biggest result: a repeatable way of working.":"Il risultato più importante: un metodo di lavoro ripetibile.",
"Website Cost Calculator. Turn an unclear brief into a practical estimate.":"Calcolatore dei costi di un sito web: trasforma un brief vago in una stima pratica.",
"Product Opportunity Engine. Test product economics before risking capital.":"Product Opportunity Engine: valuta l'economia di un prodotto prima di investire.",
"Utility Platform. 57 tool pages. One useful destination.":"Utility Platform: 57 strumenti in un unico punto.",
})
def setup_translation():
    print("Installing free Argos EN→IT language model...",flush=True)
    package.update_package_index()
    found=[x for x in package.get_available_packages()
           if x.from_code=="en" and x.to_code=="it"]
    if not found: raise RuntimeError("No official English-to-Italian model available")
    selected=found[0]
    package.install_from_path(selected.download())
    t=translate.get_translation_from_codes("en","it")
    if not t: raise RuntimeError("Model not installed")
    print("Model ready.",flush=True)
    return t
model=setup_translation()
CACHE=dict(MANUAL)
STAT={"translated":0,"manual":0,"skipped":0}

def translate_text(text):
    if not text or not text.strip(): return text
    original=text.strip()
    if original in STABLE or len(original)<2 or re.fullmatch(r'[-–—\d.%/+:|,!?()\[\]#•· ]+',original):
        STAT["skipped"]+=1;return text
    if original.startswith(("http://","https://","mailto:","@")):
        STAT["skipped"]+=1;return text
    if original in MANUAL: STAT["manual"]+=1
    if original not in CACHE:
        # Preserve link-free editorial source text. Avoid "translating" technical identifiers.
        if re.fullmatch(r'[A-Z][A-Z0-9 _./\-]{2,}',original) and not re.search(r'[AEIOU]{2}',original):
            translated=original
        else:
            translated=model.translate(original)
            if not translated.strip():translated=original
        CACHE[original]=translated
        STAT["translated"]+=1
    result=CACHE[original]
    # Preserve indentation and significant surrounding spaces.
    pos=text.index(original)
    return text[:pos]+result+text[pos+len(original):]

def is_human_text(node):
    if isinstance(node,Comment):return False
    parent=node.parent
    if not parent or parent.name in ("script","style","code","pre","noscript","svg","math","textarea","kbd","time"):return False
    if parent.find_parent(["script","style","code","pre","noscript","svg","math"]):return False
    val=str(node).strip()
    if len(val)<2:return False
    if re.fullmatch(r'[-+.:,\d/%→↗←•\s]+',val):return False
    if val in STABLE:return False
    return True

def localize_href(url,source_page):
    if not url or url.startswith(("#","mailto:","tel:","javascript:","data:","blob:","//")):
        return url
    parsed=urlparse(url)
    if parsed.netloc and parsed.netloc not in ("mohsinbuilds.com","www.mohsinbuilds.com"):return url
    full=urljoin(ORIGIN+"/"+source_page,url)
    dst=urlparse(full)
    if dst.netloc not in ("mohsinbuilds.com","www.mohsinbuilds.com"):return url
    path=dst.path
    if path=="/": path="/it/"
    elif path in ("/blog","/blog/"):path="/blog/it/"
    else:
        leaf=path.lstrip("/")
        if leaf in PAGES:path="/it/"+leaf
        # Existing articles: use Italian edition where one exists.
        elif leaf.startswith("blog/") and leaf.endswith(".html"):
            name=leaf[len("blog/"):]
            if "/" not in name:
                orig_it=name.startswith(("sito-web-","seo-locale-","rifacimento-","prenotazioni-online-"))
                path="/blog/"+name if orig_it else "/blog/it/"+name
    return urlunparse(("","",path,dst.params,dst.query,dst.fragment))

def generate_italian(source):
    p=ROOT/source
    markup=p.read_text(encoding="utf-8")
    soup=BeautifulSoup(markup,"lxml")
    document=soup.html
    if not document:raise ValueError(source)
    document["lang"]="it"
    # Translate visible DOM strings, preserving interactive markup, SVG and scripts.
    for node in list(soup.find_all(string=True)):
        if is_human_text(node):
            node.replace_with(NavigableString(translate_text(str(node))))
    for tag in soup.find_all(True):
        if tag.name in ("script","style"):continue
        for att in ("alt","title","aria-label","placeholder","aria-description"):
            if tag.has_attr(att) and isinstance(tag[att],str):
                tag[att]=translate_text(tag[att])
        if tag.name=="input" and tag.get("type","").lower() in ("submit","button","reset") and tag.has_attr("value"):
            tag["value"]=translate_text(tag["value"])
        for att in ("href","src","poster","action"):
            if not tag.has_attr(att):continue
            if att=="href":tag[att]=localize_href(tag[att],source)
            else:
                val=tag[att]
                if not val or val.startswith(("https:","http:","mailto:","data:","#","//")):continue
                resolved=urlparse(urljoin(ORIGIN+"/"+source,val))
                if resolved.netloc=="mohsinbuilds.com":
                    tag[att]=resolved.path+("?" + resolved.query if resolved.query else "")
        if tag.has_attr("srcset"):
            parts=[]
            for part in tag["srcset"].split(","):
                fields=part.strip().split(" ",1)
                url=fields[0]
                if url and not url.startswith(("http","/","data:")):
                    url=urlparse(urljoin(ORIGIN+"/"+source,url)).path
                parts.append(url+(" "+fields[1] if len(fields)>1 else ""))
            tag["srcset"]=", ".join(parts)
    # Canonical / OpenGraph and alternate language annotations.
    english=ORIGIN+("/" if source=="index.html" else "/"+source)
    italian=ORIGIN+("/it/" if source=="index.html" else "/it/"+source)
    oldcanon=soup.select_one('link[rel="canonical"]')
    if oldcanon:oldcanon["href"]=italian
    else:
        new=soup.new_tag("link",rel="canonical",href=italian);soup.head.append(new)
    for tag in soup.find_all("link",attrs={"rel":"alternate"}):
        if tag.get("hreflang") in ("it","en","x-default"):tag.decompose()
    for code,href in (("en",english),("it",italian),("x-default",english)):
        link=soup.new_tag("link",rel="alternate",hreflang=code,href=href);soup.head.append(link)
    for tag in soup.select('meta[property="og:url"]'):tag["content"]=italian
    for tag in soup.find_all("meta"):
        key=tag.get("name",tag.get("property",""))
        if key in ("description","og:title","og:description","twitter:title","twitter:description") and tag.get("content"):
            tag["content"]=translate_text(tag["content"])
    for tag in soup.select('script[type="application/ld+json"]'):
        if not tag.string:continue
        try:obj=json.loads(tag.string)
        except Exception:continue
        def walk(o):
            if isinstance(o,list):return [walk(x) for x in o]
            if not isinstance(o,dict):return o
            for k,v in list(o.items()):
                if k in ("headline","description","name") and isinstance(v,str):
                    if v not in STABLE: o[k]=translate_text(v)
                elif k in ("url","mainEntityOfPage","@id") and v==english:o[k]=italian
                elif k=="inLanguage":o[k]="it-IT"
                else:o[k]=walk(v)
            return o
        tag.string=json.dumps(walk(obj),ensure_ascii=False).replace("<","\\u003c")
    # Italian pages should never submit forms to a different path by accidental relative routing.
    # Add locale-aware universal navigation, using root-relative assets.
    inject_assets(soup)
    target=ROOT/"it"/source
    target.parent.mkdir(parents=True,exist_ok=True)
    output=str(soup)
    if '<html lang="it"' not in output:raise AssertionError(source+": lang missing")
    if italian not in output:raise AssertionError(source+": canonical missing")
    target.write_text(output,encoding="utf-8")
    print("Translated",source,"→",target.relative_to(ROOT),"bytes",len(output),flush=True)

def inject_assets(soup):
    # One reusable selector CSS/JS across all pages, including blog.
    if not soup.select_one('link[href*="site-language.css"]'):
        tag=soup.new_tag("link",rel="stylesheet",href="/css/site-language.css?v=20261024")
        soup.head.append(tag)
    if not soup.select_one('script[src*="site-language.js"]'):
        tag=soup.new_tag("script",src="/js/site-language.js?v=20261024",defer="")
        soup.body.append(tag)

def install_shared_switch_on_originals():
    # Preserve every original English URL, all existing blog translations and images.
    pages=[ROOT/n for n in PAGES]+list((ROOT/"blog").rglob("*.html"))
    for page in pages:
        orig=page.read_text(encoding="utf-8")
        if "site-language.js" in orig:continue
        # Avoid touching CSS/JS driven by existing HTML; insert dependencies only.
        new=orig
        if "</head>" not in new.lower() or "</body>" not in new.lower():raise AssertionError(str(page))
        new=re.sub(r'</head>',r'<link rel="stylesheet" href="/css/site-language.css?v=20261024"></head>',new,count=1,flags=re.I)
        new=re.sub(r'</body>',r'<script src="/js/site-language.js?v=20261024" defer></script></body>',new,count=1,flags=re.I)
        page.write_text(new,encoding="utf-8")
    print("Installed shared language switch on",len(pages),"existing pages",flush=True)

def update_sitemap():
    file=ROOT/"sitemap.xml"
    data=file.read_text(encoding="utf-8")
    count=0
    for p in PAGES:
        url=ORIGIN+("/it/" if p=="index.html" else "/it/"+p)
        if f"<loc>{url}</loc>" not in data:
            data=data.replace("</urlset>",f'<url><loc>{url}</loc><lastmod>2026-10-24</lastmod></url>\n</urlset>')
            count+=1
    file.write_text(data,encoding="utf-8")
    print("New sitemap locations:",count,flush=True)

if __name__=="__main__":
    for page in PAGES:generate_italian(page)
    install_shared_switch_on_originals()
    update_sitemap()
    print("Translation stats",STAT,flush=True)
    print("DETECTED HTML COUNT:",len(list(ROOT.glob("it/*.html"))),flush=True)
