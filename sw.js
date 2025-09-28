const CACHE='energy-v2';
const ASSETS=['manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('index.html') || url.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;}).catch(()=>caches.match(e.request)));
  }else if(ASSETS.some(a=>url.pathname.endsWith(a))){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});