"""Bouwt products.js uit de WooCommerce-export van schippercompactwonen.nl
en de chairs-database van staopstoelen.nl."""
import json,re,html,os
here=os.path.dirname(os.path.abspath(__file__))
W=json.load(open(f'{here}/schipper-products.json'))
D=json.load(open(f'{here}/staopstoelen-chairs.json'))['staopstoelen']
CATS={'sta-op-stoelen':'zitcomfort_sta-op-stoelen','seniorenstoelen':'zitcomfort_seniorenstoelen','senioren-ledikanten':'ligcomfort_senioren-ledikanten','hooglaag-bedden':'ligcomfort_hooglaag-bedden','bed-toebehoren':'ligcomfort_bed-toebehoren','loophulpmiddelen':'zorgcomfort_loophulpmiddelen','trapliften':'zorgcomfort_trapliften'}
STOP=set('sta op stoel stoelen seniorenstoel senioren hk hjort knudsen farstrup mecam dfm doge fitform voorraad occasion reco demo iii ii mini draaibaar'.split())
def key(n):
    t=re.findall(r'[a-z0-9]+',n.lower());return frozenset(x for x in t if x not in STOP)
def clean(h):
    if not h: return ''
    h=re.sub(r'<(script|style)[\s\S]*?</\1>','',h)
    h=re.sub(r'\s(style|class|id|data-[\w-]+)="[^"]*"','',h)
    h=re.sub(r'</?(span|div|font|a)[^>]*>','',h)
    h=re.sub(r'<(/?)h[1-6]>',r'<\1h3>',h)
    h=re.sub(r'<p>\s*(&nbsp;)?\s*</p>','',h)
    t=re.sub(r'<[^>]+>','',h).strip().lower()
    if t in('','tekst','tekst.'): return ''
    return h.strip()
def img(u): return u if u.startswith('http') else 'https://staopstoelen.nl/'+u
def slug(n): return re.sub(r'-+','-',re.sub(r'[^a-z0-9]+','-',n.lower())).strip('-')
Dk={}
for c in D: Dk.setdefault(key(c['name']),[]).append(c)
used=set();items=[]
for p in W:
    sub=next((CATS[c['slug']] for c in p['categories'] if c['slug'] in CATS),None)
    if not sub: continue
    price=int(p['prices']['price'])/100;reg=int(p['prices']['regular_price'])/100
    it=dict(slug=p['slug'],name=html.unescape(p['name']),cat=sub,price=price or 0,old=reg if (p.get('on_sale') and reg>price) else 0,
      images=[i['src'] for i in p['images']],short=clean(p['short_description']),desc=clean(p['description']),
      specs={html.unescape(a['name']):', '.join(html.unescape(t['name']) for t in a['terms']) for a in p['attributes'] if a['terms']},
      features=[],condition='nieuw',brand='',source='schippercompactwonen.nl')
    if 'RECO' in it['name'] or 'reco' in it['name'].lower().split(): it['condition']='gereviseerd'
    if sub.startswith('zitcomfort'):
        m=[c for c in Dk.get(key(it['name']),[]) if c['condition']==('occasion' if it['condition']!='nieuw' else 'nieuw')] or Dk.get(key(it['name']),[])
        if m:
            c=m[0];used.add(c['id'])
            it['brand']=c['brand'];it['features']=c['features'] or []
            for k,v in (c['specifications'] or {}).items(): it['specs'].setdefault(k,v)
            cd=clean(c['description'])
            if len(cd)>len(it['desc']): it['desc']=cd
            seen=set(it['images'])
            for g in ([c['image']]+(c['gallery'] or [])+[c['ambientImage']]):
                if g and img(g) not in seen: it['images'].append(img(g));seen.add(img(g))
            it['source']='schippercompactwonen.nl + staopstoelen.nl'
    items.append(it)
for c in D:
    if c['id'] in used or c['status']!='beschikbaar': continue
    sub=CATS['seniorenstoelen'] if re.search(r'senioren',c['name'],re.I) and c['type']=='relax' else CATS['sta-op-stoelen']
    imgs=[]
    for g in ([c['image']]+(c['gallery'] or [])+[c['ambientImage']]):
        if g and img(g) not in imgs: imgs.append(img(g))
    items.append(dict(slug=slug(c['name']),name=c['name'],cat=sub,price=c['price'] or 0,old=c['old_price'] or 0,images=imgs,short='',desc=clean(c['description']),
      specs=c['specifications'] or {},features=c['features'] or [],condition={'nieuw':'nieuw','occasion':'occasion'}.get(c['condition'],c['condition']),brand=c['brand'],source='staopstoelen.nl'))
def tx(h): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>','',html.unescape(h))).strip()
for it in items:
    if it['short'] and tx(it['short'])[:60] in tx(it['desc']): it['short']=''
seen=set()
for it in items:
    s=it['slug'];n=2
    while s in seen: s=f"{it['slug']}-{n}";n+=1
    it['slug']=s;seen.add(s)
    if not it['images']: it['images']=[]
open(f'{here}/../products.js','w').write('export const all = '+json.dumps(items,ensure_ascii=False,indent=1)+';\n'
 'export const products = {};\nfor (const p of all) (products[p.cat] ||= []).push({name:p.name,slug:p.slug,img:p.images[0]||"",price:p.price?p.price.toFixed(2):"",old:p.old?p.old.toFixed(2):"",condition:p.condition});\n'
 'export const bySlug = Object.fromEntries(all.map(p=>[p.slug,p]));\n')
print(len(items),len(used),'matched of',len(D))
from collections import Counter;print(Counter(i['cat'] for i in items))

# --- afbeeldingen lokaal opslaan (assets/products) en URLs herschrijven ---
import hashlib,subprocess,urllib.parse
root=os.path.abspath(f'{here}/..');dest=f'{root}/assets/products';os.makedirs(dest,exist_ok=True)
urls=set()
for it in items:
    urls.update(it['images'])
    urls.update(re.findall(r'src="(https?://[^"]+)"',it['desc']+it['short']))
def local(u):
    ext=os.path.splitext(urllib.parse.urlparse(u).path)[1].lower() or '.jpg'
    return 'assets/products/'+hashlib.md5(u.encode()).hexdigest()[:12]+ext
def valid(p):
    try:
        h=open(p,'rb').read(16)
    except OSError: return False
    return h[:3]==b'\xff\xd8\xff' or h[:4]==b'\x89PNG' or h[:4]==b'RIFF' or h[:3]==b'GIF' or h[:5]==b'<?xml' or h[:4]==b'<svg'
for u in urls:
    p=f'{root}/{local(u)}'
    if os.path.exists(p) and not valid(p): os.remove(p)
todo=[] if os.environ.get('SKIP_DL') else [u for u in urls if not os.path.exists(f'{root}/{local(u)}')]
import time
# Rustig downloaden: één foto per keer, pauze ertussen, stoppen bij herhaalde fouten
PAUSE=float(os.environ.get('DL_PAUSE','1.5'));MAX_FAILS=3;fails={};stop=set()
for u in todo:
    host=urllib.parse.urlparse(u).netloc
    if host in stop: continue
    r=subprocess.run(['curl','-sfL','--connect-timeout','8','--max-time','40','-o',f'{root}/{local(u)}',u])
    def _is_img(p):
        h=open(p,'rb').read(16);return h[:3]==b'\xff\xd8\xff' or h[:4]==b'\x89PNG' or h[:4]==b'RIFF' or h[:3]==b'GIF' or h[:5]==b'<?xml' or h[:4]==b'<svg'
    if r.returncode==0 and os.path.exists(f'{root}/{local(u)}') and _is_img(f'{root}/{local(u)}'): fails[host]=0
    else:
        if os.path.exists(f'{root}/{local(u)}'): os.remove(f'{root}/{local(u)}')
        fails[host]=fails.get(host,0)+1
        if fails[host]>=MAX_FAILS:
            stop.add(host);print(f'{host} reageert niet, overgeslagen (probeer later opnieuw)')
    time.sleep(PAUSE)
ok={u for u in urls if os.path.exists(f'{root}/{local(u)}') and os.path.getsize(f'{root}/{local(u)}')>0}
print('images',len(ok),'/',len(urls))
for it in items:
    it['images']=[local(u) if u in ok else u for u in it['images']]
    for k in('desc','short'): it[k]=re.sub(r'src="(https?://[^"]+)"',lambda m:f'src="{local(m.group(1))}"' if m.group(1) in ok else m.group(0),it[k])
src=open(f'{root}/products.js').read()
open(f'{root}/products.js','w').write(src.split('export const products')[0].split('export const all = ')[0]+'export const all = '+json.dumps(items,ensure_ascii=False,indent=1)+';\n'+'export const products'+src.split('export const products',1)[1])
