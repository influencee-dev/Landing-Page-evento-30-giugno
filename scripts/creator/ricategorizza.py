"""Ricategorizzazione dei creator su influencee.it via REST di WordPress.
Uso: python3 applica.py [--scrivi]   (senza --scrivi fa solo la prova e stampa le modifiche)
Credenziale: variabile d'ambiente INFLUENCEE_WP_AUTH = il valore di «Crea accesso per Claude» (mai nel codice).
Regole sicure: le etichette doppie diventano quella principale, si aggiunge la famiglia quando manca;
nessun creator resta senza categoria. Una richiesta alla volta, con pausa, per non appesantire il sito."""
import json, os, sys, time, base64, urllib.request
SITE = 'https://influencee.it/wp-json/wp/v2'
DIR = os.path.dirname(os.path.abspath(__file__))
SCRIVI = '--scrivi' in sys.argv
UNISCI = {'photograph': 'photography', 'gym': 'fitness', 'fit': 'fitness', 'mum': 'mom', 'comedian': 'comedy', 'journalism': 'journalist'}
AGGIUNGI = {'stylist': 'fashion', 'writer': 'cultura', 'youtuber': 'content-creator', 'actor': 'comic', 'chef': 'food', 'athlete': 'sport'}

def req(method, url, body=None):
    h = {'Content-Type': 'application/json', 'User-Agent': 'influencee-ricategorizza'}
    if SCRIVI:
        auth = os.environ['INFLUENCEE_WP_AUTH'].strip()
        # il valore di «Crea accesso per Claude» è già codificato; «utente:password» si codifica qui
        h['Authorization'] = 'Basic ' + (base64.b64encode(auth.encode()).decode() if ':' in auth else auth)
    r = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    with urllib.request.urlopen(r, timeout=120) as res:
        return json.load(res)

def leggi(url):
    r = urllib.request.Request(url, headers={'User-Agent': 'influencee-ricategorizza'})
    with urllib.request.urlopen(r, timeout=120) as res:
        return json.load(res)

# dati pubblici dal sito, una richiesta alla volta con pausa
cats = {c['id']: c['slug'] for c in leggi(f'{SITE}/creator_category?per_page=100&_fields=id,slug')}
ids = {s: i for i, s in cats.items()}
creators = []
for pg in range(1, 10):
    blocco = leggi(f'{SITE}/creator?per_page=100&page={pg}&_fields=id,slug,creator_category')
    creators += blocco
    if len(blocco) < 100:
        break
    time.sleep(4)
mod = []
for c in creators:
    old = [cats[i] for i in c.get('creator_category', []) if i in cats]
    new = []
    for s in old:
        s2 = UNISCI.get(s, s)
        for t in (s2, AGGIUNGI.get(s2)):
            if t and t not in new:
                new.append(t)
    if not new or set(new) == set(old):
        continue
    mod.append((c['id'], c['slug'], old, new))
print(f'creator da modificare: {len(mod)} su {len(creators)}')
for m in mod:
    print(f'  {m[1]}: {", ".join(m[2])}  ->  {", ".join(m[3])}')
if not SCRIVI:
    sys.exit(0)
log = open(os.path.join(DIR, 'log-scrittura.txt'), 'a')  # registro locale (non va nel repository)
for cid, slug, old, new in mod:
    term_ids = [ids[s] for s in new if s in ids]
    if not term_ids:
        continue  # mai lasciare un creator senza categoria
    res = req('POST', f'{SITE}/creator/{cid}', {'creator_category': term_ids})
    ok = sorted(res.get('creator_category', [])) == sorted(term_ids)
    log.write(f'{slug}\t{",".join(old)}\t{",".join(new)}\t{"ok" if ok else "DIVERSO"}\n'); log.flush()
    print(slug, 'ok' if ok else 'DIVERSO')
    time.sleep(3)
