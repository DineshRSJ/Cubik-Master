// Keeps the game working offline. Pages load fresh when online (so updates show right away),
// and fall back to the saved copy when there is no internet.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||e.request.url.includes('/rest/v1/'))return;
  const page=e.request.mode==='navigate';
  e.respondWith(caches.open('cubik-v2').then(async c=>{
    const hit=await c.match(e.request);
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>hit);
    return page?net:(hit||net);
  }));
});
