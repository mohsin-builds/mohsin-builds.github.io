#!/usr/bin/env python3
"""One-time migration from diagram SVGs to licensed real editorial photographs."""
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
import io
import json
import re

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "blog"
ASSETS = ROOT / "assets" / "insights"
LICENSE = "https://unsplash.com/license"
PHOTOS = [
    ("small-business-website-cost-italy", "1709880945165-d2208c6ad2ec", "https://unsplash.com/photos/a-calculator-sitting-on-top-of-a-table-next-to-a-laptop-8wLZi9OhsWU", "Jakub Żerdzicki", "Calculator and financial documents beside a laptop on an office desk", "Calcolatrice e documenti di budget accanto a un computer portatile"),
    ("restaurant-website-booking-checklist", "1641924676490-cd948c956b7e", "https://unsplash.com/photos/a-table-set-for-two-in-a-restaurant-1fswMDt_JNs", "Cory Bjork", "Restaurant table set for two guests in Florence, Italy", "Tavolo apparecchiato in un ristorante a Firenze"),
    ("sito-web-impresa-pulizie-preventivi", "1781637590564-01c65dbf2039", "https://unsplash.com/photos/a-man-in-yellow-gloves-vacuums-a-carpeted-office-floor-CVcIMnH_7so", "web seo", "Professional cleaner vacuuming the floor of a modern office", "Addetto alle pulizie professionali mentre aspira il pavimento di un ufficio"),
    ("sito-web-artigiani-richieste-preventivo", "1769353086138-19ee65291a04", "https://unsplash.com/photos/carpenter-working-with-wood-in-a-workshop-oW4mPEcgdEc", "qyy qyyy", "Carpenter shaping timber by hand at a workshop bench", "Artigiano falegname al lavoro sul legno in laboratorio"),
    ("seo-locale-piccole-imprese-checklist", "1758384075573-b2b107085b35", "https://unsplash.com/photos/a-white-storefront-with-flowers-and-a-chalkboard-sign-v1sEpu48OHc", "Bundo Kim", "Local bakery storefront with shop windows and street-facing signage", "Facciata di un'attività locale con vetrine e insegna"),
    ("rifacimento-sito-aziendale-quando-conviene", "1587355760421-b9de3226a046", "https://unsplash.com/photos/man-designing-wireframes-at-desk-with-laptop-pqzRfBhd9r0", "UX Indonesia", "Designers evaluating paper website wireframes beside a laptop", "Designer mentre valuta bozze cartacee di pagine web e un computer"),
    ("prenotazioni-online-centro-estetico-guida", "1632345031435-8727f6897d53", "https://unsplash.com/photos/a-woman-getting-her-nails-done-at-a-nail-salon-gb6gtiTZKB8", "Giorgio Trovato", "Beauty technician performing a manicure for a salon customer", "Professionista del centro estetico mentre esegue una manicure"),
    ("website-redesign-checklist-small-business", "1680016661694-1cd3faf31c3a", "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-table-FvpVY7TpwNY", "Amper", "Laptop showing draft website wireframes during a redesign project", "Computer che mostra bozze di un sito web durante un restyling"),
    ("wordpress-vs-custom-website-small-business", "1579403124614-197f69d8187b", "https://unsplash.com/photos/a-computer-monitor-sitting-on-top-of-a-wooden-desk-QUHuwyNgSA0", "Karl Pawlowicz", "Computer monitor displaying software code on a developer's desk", "Schermo con codice di programmazione su una scrivania"),
    ("small-business-website-maintenance-checklist", "1680992045535-95919d4971a9", "https://unsplash.com/photos/a-close-up-of-a-computer-with-green-lights-ekF932HpB4M", "Tyler", "Server equipment with green status lights in a data room", "Apparecchiature server con indicatori luminosi verdi"),
    ("automate-client-inquiries-small-business", "1753162657634-454a046ea091", "https://unsplash.com/photos/fashion-designer-works-on-laptop-while-talking-on-phone-LiemRwKUtS0", "Vitaly Gariev", "Small business owner handling a customer phone call while using a laptop", "Titolare di un'attività mentre risponde al telefono e usa un computer"),
    ("local-service-business-website-leads", "1752650732081-8f61e81813ed", "https://unsplash.com/photos/two-women-are-having-a-friendly-discussion-r-W9R70iY5c", "Vitaly Gariev", "Small business owner discussing a potential project with a customer", "Titolare di impresa mentre parla con una potenziale cliente"),
]

def download(slug, photo_id):
    # Crop to the exact existing aspect ratio for zero layout changes.
    url = ("https://images.unsplash.com/photo-" + photo_id +
           "?w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=78")
    req = Request(url, headers={"User-Agent": "MohsinBuildsEditorial/1.0", "Accept": "image/jpeg"})
    with urlopen(req, timeout=35) as response:
        data = response.read(3_500_000)
    assert data[:3] == b"\xff\xd8\xff" and len(data) > 20000, (slug, "Not a valid JPEG")
    with Image.open(io.BytesIO(data)) as im:
        im.verify()
    with Image.open(io.BytesIO(data)) as im:
        assert im.size == (1200, 630), (slug, im.size)
    (ASSETS / (slug + "-cover.jpg")).write_bytes(data)
    print("Photo:", slug, len(data), "bytes")
    return url

def replace_img_in_html(html, slug, alt):
    # The blog index has decorative alt="" because the whole card is already labelled.
    old = slug + "-cover.svg?v=20261023-fixed"
    new = slug + "-cover.jpg?v=20261023-photo1"
    assert html.count(old) == 1, (slug, "expected one old in-page image")
    html = html.replace(old, new)
    if '<article class="insights-article">' in html:
        pattern = r'(<img\b[^>]*' + re.escape(new) + r'[^>]*\balt=")[^"]*(")'
        html, count = re.subn(pattern, lambda m: m.group(1) + alt + m.group(2), html)
        assert count == 1, (slug, "article alt")
    return html

def main():
    homepage = (BLOG / "index.html").read_text(encoding="utf-8")
    credits = []
    for slug, photo_id, source, creator, en_alt, it_alt in PHOTOS:
        remote = download(slug, photo_id)
        credits.append({
            "article": "https://mohsinbuilds.com/blog/" + slug + ".html",
            "file": "assets/insights/" + slug + "-cover.jpg",
            "photographer": creator,
            "source": source,
            "source_license": LICENSE,
            "downloaded_from": remote,
            "usage": "Editorial illustrative photograph. Not a Mohsin Builds client project or case study.",
        })
        homepage = replace_img_in_html(homepage, slug, en_alt)
        path = BLOG / (slug + ".html")
        html = path.read_text(encoding="utf-8")
        html = replace_img_in_html(html, slug, it_alt if slug.startswith(("sito-web-", "seo-locale", "rifacimento", "prenotazioni")) else en_alt)
        old_og = "https://mohsinbuilds.com/assets/insights/" + slug + "-cover.svg"
        new_og = "https://mohsinbuilds.com/assets/insights/" + slug + "-cover.jpg"
        assert html.count(old_og) == 1, (slug, "expected one OG image")
        html = html.replace(old_og, new_og)
        new_tag = '<meta property="og:image" content="' + new_og + '">'
        assert new_tag in html
        html = html.replace(new_tag, new_tag + '<meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:image" content="' + new_og + '">')
        og_alt_pattern = r'(<meta property="og:image:alt" content=")[^"]*(")'
        html, n = re.subn(og_alt_pattern, lambda m: m.group(1) + (it_alt if slug.startswith(("sito-web-", "seo-locale", "rifacimento", "prenotazioni")) else en_alt) + m.group(2), html)
        assert n == 1, (slug, "og alt")
        photo_link = '<a href="' + source + '" rel="noopener noreferrer">Unsplash</a>'
        if '<html lang="it">' in html:
            caption = '<figcaption>Fotografia di ' + creator + ' su ' + photo_link + '. Immagine editoriale, non un progetto cliente di Mohsin Builds.</figcaption>'
        else:
            caption = '<figcaption>Photograph by ' + creator + ' on ' + photo_link + '. Editorial context, not a Mohsin Builds client project.</figcaption>'
        html, n = re.subn(r'<figcaption>[^<]*</figcaption>', lambda _: caption, html, count=1)
        assert n == 1, (slug, "expected an article photo caption")
        assert (slug + "-cover.svg") not in html, (slug, "old svg still referenced")
        path.write_text(html, encoding="utf-8")
    assert "-cover.svg" not in homepage
    (BLOG / "index.html").write_text(homepage, encoding="utf-8")
    (ASSETS / "PHOTO_CREDITS.json").write_text(json.dumps({"license": LICENSE, "photos": credits}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("All 12 real photographs downloaded and all 13 blog pages updated.")

if __name__ == "__main__":
    main()
