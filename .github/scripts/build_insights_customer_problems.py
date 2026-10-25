#!/usr/bin/env python3
"""Create buyer-problem Insights articles with distinct, licensed real photographs."""
import json, os, re, time, random, hashlib
from pathlib import Path
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen
from io import BytesIO
from PIL import Image, ImageOps
from html import escape
from collections import Counter

root=Path.cwd(); blog=root/"blog"; assets=root/"assets"/"insights"
items=json.loads((root/".github/content/insights_customer_problems_20261025.json").read_text())
assert len(items)==30 and len(set(x[1] for x in items))==30
template=(blog/"website-handover-checklist-small-business.html").read_text()
credits=json.loads((assets/"PHOTO_CREDITS.json").read_text())
existing_images=set(x.get("file","").split("/")[-1] for x in credits["photos"])
already=set()
def get_json(url):
  req=Request(url,headers={"User-Agent":"MohsinBuildsInsights/1.0 (contact: mohsinbuilds@gmail.com)","Accept":"application/json"})
  with urlopen(req,timeout=30) as r:return json.loads(r.read(6_000_000))
def get_image(url):
  req=Request(url,headers={"User-Agent":"Mozilla/5.0 (MohsinBuilds/1.0)","Accept":"image/jpeg,image/*"})
  with urlopen(req,timeout=30) as r:return r.read(9_000_000)
def licensed_photo(query,slug):
  api="https://commons.wikimedia.org/w/api.php"
  queries=[query+" photograph",query,"professional "+query]
  for q in queries:
    params={"action":"query","generator":"search","gsrsearch":q,"gsrnamespace":"6","gsrlimit":30,"prop":"imageinfo","iiprop":"url|extmetadata|size|mime","iiurlwidth":"1600","format":"json"}
    try:
      res=get_json(api+"?"+urlencode(params))
    except Exception as e:
      print("Commons search unavailable:",str(e)[:180],flush=True);continue
    pages=list(res.get("query",{}).get("pages",{}).values())
    pages.sort(key=lambda x:x.get("index",99))
    print("Commons query",q,"candidates",len(pages),flush=True)
    for p in pages:
      infos=p.get("imageinfo",[])
      if not infos:continue
      info=infos[0];mime=info.get("mime","")
      if p.get("index",99)<7: print("Candidate",str(p.get("title",""))[:80],"mime",mime,"license",info.get("extmetadata",{}).get("LicenseShortName",{}).get("value","?"),"size",info.get("width"),info.get("height"),flush=True)
      if mime not in ("image/jpeg","image/png","image/webp"):continue
      if info.get("width",0)<640 or info.get("height",0)<380:continue
      meta=info.get("extmetadata",{})
      lic=meta.get("LicenseShortName",{}).get("value","")
      if not any(x in lic.lower() for x in ["cc by","cc0","public domain"]):continue
      source=info.get("descriptionurl",info.get("url",""))
      if not source or source in already:continue
      uri=info.get("thumburl",info.get("url"))
      try:
        raw=get_image(uri)
        im=Image.open(BytesIO(raw)).convert("RGB")
        if im.width<640 or im.height<380:continue
        im=ImageOps.fit(im,(1200,630),method=Image.Resampling.LANCZOS)
        out=BytesIO();im.save(out,"JPEG",quality=81,optimize=True)
        blob=out.getvalue()
        if len(blob)<22000:continue
        filename=slug+"-cover.jpg"
        file=assets/filename;file.write_bytes(blob)
        author=re.sub(r"<[^>]*>","",meta.get("Artist",{}).get("value","Wikimedia Commons contributor"))[:150]
        already.add(source)
        return {"file":str(file),"source":source,"photographer":author,"source_license":meta.get("LicenseUrl",{}).get("value",lic),"description":q,"license_short":lic}
      except Exception as e: print("Image retry",slug,str(e)[:95],flush=True)
  raise RuntimeError("Could not verify distinct photograph with eligible license: "+slug)
def article_html(item,idx,credit):
  lang,slug,title,pain,scenario,diagnosis,fix,warning,photoquery=item
  it=lang=="it";base="https://mohsinbuilds.com/blog/";url=base+slug+".html";image="https://mohsinbuilds.com/assets/insights/"+slug+"-cover.jpg"
  desc=(title+": "+scenario).replace('"',"'")[:158]
  lead=scenario
  sections=[
    ((("Il problema che il cliente vive davvero" if it else "Why this problem feels urgent")), [scenario, pain+". "+("Non significa necessariamente che serva un sito completamente nuovo: serve capire dove il percorso del cliente si interrompe." if it else "It does not automatically mean the whole website must be rebuilt: first identify the point where the customer journey breaks.")]),
    ((("Controlli iniziali prima di spendere" if it else "Diagnose before buying another tool")), [diagnosis,("Annota pagina, dispositivo, messaggio visualizzato e chi deve rispondere. Non basarti soltanto sull'aspetto grafico." if it else "Record the relevant page, device, message and person responsible. A visual impression alone is not a diagnosis.")]),
    ((("Una soluzione semplice e verificabile" if it else "A low-cost, testable improvement")), [fix,("Assegna la responsabilità e fai un test reale da smartphone con una persona esterna all'attività." if it else "Assign an owner and run a real mobile test with someone unfamiliar with the business.")]),
    ((("Cosa evitare" if it else "What not to promise")), [warning,("Se ci sono aspetti legali, fiscali o di privacy, verifica gli obblighi applicabili con un professionista competente; questa guida non sostituisce una consulenza." if it else "Where legal, privacy or financial rules apply, verify your obligations with a qualified professional rather than treating a blog post as specialist advice.")]),
    ((("Come capire se serve un intervento professionale" if it else "When professional help is worth considering")), [
      ("Scrivi l'obiettivo concreto: meno richieste perse, informazioni più chiare oppure appuntamenti confermati in modo affidabile. Se non riesci a riprodurre il problema, raccogli prima prove semplici." if it else "Write down a concrete outcome: fewer lost inquiries, more accurate information, or a booking process that reflects real availability. Collect basic evidence before approving a rebuild."),
      ("Chiedi al fornitore quali pagine cambierà, come verificherà il risultato e chi manterrà il sistema. Conserva URL funzionanti e contenuti validi; non pagare funzioni prive di un responsabile operativo." if it else "Ask exactly what pages will change, how the improvement will be tested and who will operate it afterward. Preserve useful URLs and working features; do not pay for an unowned process.")])
  ]
  block="".join(f'<section aria-labelledby="sec-{i+1}"><h2 id="sec-{i+1}">{escape(h)}</h2>'+''.join(f'<p>{escape(p)}</p>' for p in paras)+'</section>' for i,(h,paras) in enumerate(sections))
  toc="".join(f'<a href="#sec-{i+1}">{escape(h)}</a>' for i,(h,_) in enumerate(sections))
  metadata=f'<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><meta name="theme-color" content="#030a13"><title>{escape(title)} | Mohsin Builds</title><meta name="description" content="{escape(desc,quote=True)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:url" content="{url}"><meta property="og:type" content="article"><meta property="og:image" content="{image}"><meta property="og:image:type" content="image/jpeg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{image}"><link rel="stylesheet" href="../css/home.css"><link rel="stylesheet" href="../css/case-studies.css?v=20261023"><link rel="stylesheet" href="../css/blog.css?v=20261023-os"><link rel="stylesheet" href="/css/google-translate-choice.css?v=1"><link rel="icon" href="../favicon.ico"><script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"BlogPosting","headline":title,"description":desc,"inLanguage":lang,"datePublished":"2026-10-25","dateModified":"2026-10-25","author":{"@type":"Organization","name":"Mohsin Builds","url":"https://mohsinbuilds.com/about.html"},"publisher":{"@type":"Organization","name":"Mohsin Builds","url":"https://mohsinbuilds.com/"},"mainEntityOfPage":{"@type":"WebPage","@id":url},"image":[image]},ensure_ascii=False).replace("<","\\u003c")+'</script></head>'
  credit_url=escape(credit["source"],quote=True)
  photo=f'<figure class="insights-featured"><img src="../assets/insights/{slug}-cover.jpg?v=20261025-empathy" width="1200" height="630" alt="{escape(photoquery,quote=True)}" decoding="async" fetchpriority="high"><figcaption>{"Fotografia" if it else "Photograph"}: {escape(credit["photographer"])} <a href="{credit_url}" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>. {"Immagine editoriale, non un caso cliente." if it else "Editorial image, not a Mohsin Builds client project."}</figcaption></figure>'
  pitch=f'<div class="pitch"><span class="eyebrow">{"PARLIAMO DEL PROGETTO" if it else "DISCUSS THE PRACTICAL NEXT STEP"}</span><h2>{"Vuoi risolvere questo problema senza complicare il sito?" if it else "Want to fix this without an unnecessary rebuild?"}</h2><p>{"Descrivi la situazione reale, il sito e il prossimo passo che un cliente dovrebbe riuscire a fare." if it else "Share the actual problem, your website and the action a customer should be able to complete."}</p><a class="button primary" href="../contact.html">{"Contattaci ↗" if it else "Discuss a project ↗"}</a></div>'
  article=f'<article class="insights-article"><span class="eyebrow">{"PROBLEMI REALI / GUIDA PRATICA" if it else "CUSTOMER FRICTION / PRACTICAL GUIDE"}</span><h1>{escape(title)}</h1><p class="lead">{escape(lead)}</p><div class="metadata"><span>MOHSIN BUILDS</span><time datetime="2026-10-25">{"25 OTTOBRE 2026" if it else "25 OCTOBER 2026"}</time></div>{photo}<section class="case-panel insights-reading-window"><div class="window-strip"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>{idx:02} / {slug}.md</span><span>INSIGHTS / 2026</span></div><div class="reading"><div class="copy"><p>{escape(lead)}</p>{block}{pitch}<section class="post-related"><h2>{"Leggi anche" if it else "Explore related guidance"}</h2><p><a href="./">{"Tutte le guide Insights" if it else "All Insights guides"}</a> · <a href="../case-studies.html">{"Progetti e casi studio" if it else "Case studies"}</a></p></section></div><aside><nav class="toc" aria-label="{"In questa guida" if it else "In this guide"}"><strong>{"IN QUESTA GUIDA" if it else "IN THIS GUIDE"}</strong>{toc}</nav></aside></div></section></article>'
  html=template.replace('<html lang="en">','<html lang="'+lang+'">')
  html=re.sub(r'<head>[\s\S]*?</head>',lambda _:metadata,html,count=1)
  html=re.sub(r'<article class="insights-article">[\s\S]*?</article>',lambda _:article,html,count=1)
  assert '<h1>'+escape(title)+'</h1>' in html
  return html
home=(blog/"index.html").read_text(); oldschema=re.search(r'<script type="application/ld\+json">([\s\S]*?)</script>',home)
schema=json.loads(oldschema.group(1)); sitemap=(root/"sitemap.xml").read_text()
for i,item in enumerate(items):
  lang,slug,title,pain,scenario,diagnosis,fix,warning,photoquery=item
  credit=licensed_photo(photoquery,slug)
  credit["article"]="https://mohsinbuilds.com/blog/"+slug+".html"
  credits["photos"].append(credit)
  (blog/(slug+".html")).write_text(article_html(item,31+i,credit),encoding="utf-8")
  schema["blogPost"].append({"@type":"BlogPosting","headline":title,"url":credit["article"],"inLanguage":lang})
  card=f'<article class="case-panel insights-entry"><div class="window-strip"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>{31+i} / GUIDE / {lang.upper()}</span><span>{31+i} / 60</span></div><a class="insights-cover-link" href="{slug}.html" tabindex="-1" aria-hidden="true"><img src="../assets/insights/{slug}-cover.jpg?v=20261025-empathy" alt="" width="1200" height="630" loading="lazy" decoding="async"></a><div class="insights-card-copy"><span class="eyebrow">{"FRUSTRAZIONI / SOLUZIONI" if lang=="it" else "PROBLEMS / SOLUTIONS"}</span><h3>{escape(title)}</h3><p>{escape(pain)}</p><div class="insights-tags"><span>{"Italiano" if lang=="it" else "English"}</span><span>Practical guide</span></div><a class="button primary" href="{slug}.html" lang="{lang}">{"Leggi la guida →" if lang=="it" else "Read the guide →"}</a></div></article>'
  home=home.replace('</div></section>\n<section class="insights-cta"',card+'</div></section>\n<section class="insights-cta"')
  sitemap=sitemap.replace("</urlset>",f'<url><loc>{credit["article"]}</loc><lastmod>2026-10-25</lastmod></url>\n</urlset>')
  print("Prepared",i+1,slug,credit["source"],flush=True)
home=home.replace(oldschema.group(0),'<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace("<","\\u003c")+'</script>')
home=home.replace('30 PUBLISHED GUIDES','60 PUBLISHED GUIDES').replace('Thirty practical guides','Sixty practical guides').replace('Explore 30 practical guides','Explore 60 practical guides')
assert home.count('class="case-panel insights-entry"')==60,home.count('class="case-panel insights-entry"')
assert len(schema["blogPost"])==60
assert len(list(blog.glob("*.html")))==61
allcovers=[]
for f in blog.glob("*.html"):
  if f.name=="index.html":continue
  x=re.search(r'<figure class="insights-featured"><img src="../assets/insights/([^?"]+)',f.read_text())
  assert x,f.name
  assert (assets/x.group(1)).exists(),x.group(1)
  allcovers.append(x.group(1))
assert len(set(allcovers))==60,Counter(allcovers)
(blog/"index.html").write_text(home,encoding="utf-8")
(root/"sitemap.xml").write_text(sitemap,encoding="utf-8")
(assets/"PHOTO_CREDITS.json").write_text(json.dumps(credits,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("VALIDATED: 60 article pages, 60 separate photo files, 60 cards, sitemap, BlogPosting index",flush=True)
