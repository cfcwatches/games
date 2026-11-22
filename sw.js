/* Hue Sudoku service worker: lets the site install as an app and play offline.
   Bump VERSION whenever you add or rename files in PRECACHE. */
var VERSION='hue-v5';
var RUNTIME='hue-fonts-v1';
var PRECACHE=['/','/index.html','/sudoku.html','/kakuro.html','/word-guess.html','/memory-match.html','/hue-shift.html','/anagram.html','/snake.html','/maths-sprint.html','/quiz.html',
  '/games.html','/how-to-play.html','/strategies.html','/naked-pairs.html','/pointing-pairs.html','/x-wing.html','/history-of-sudoku.html','/about.html','/privacy.html','/404.html',
  '/style.css','/menu.css','/menu.js','/hub.js','/consent.js','/pwa.js','/words.js','/anagram-words.js','/kakuro-puzzles.js',
  '/favicon.svg','/favicon.ico','/apple-touch-icon.png','/icon-192.png','/icon-512.png','/manifest.webmanifest'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){
    /* add files one by one so a single missing file cannot block installation */
    return Promise.all(PRECACHE.map(function(u){return c.add(new Request(u,{cache:'reload'})).catch(function(){})}));
  }).then(function(){return self.skipWaiting()}));
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==VERSION&&k!==RUNTIME}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});

function networkFirst(req){
  return new Promise(function(resolve){
    var settled=false;
    function fromCache(){
      return caches.match(req,{ignoreSearch:true}).then(function(r){return r||(req.mode==='navigate'?caches.match('/index.html'):undefined)});
    }
    var timer=setTimeout(function(){fromCache().then(function(r){if(r&&!settled){settled=true;resolve(r)}})},4000);
    fetch(req).then(function(res){
      clearTimeout(timer);
      if(res&&res.ok){var copy=res.clone();caches.open(VERSION).then(function(c){c.put(req,copy)})}
      if(!settled){settled=true;resolve(res)}
    }).catch(function(){
      clearTimeout(timer);
      fromCache().then(function(r){if(!settled){settled=true;resolve(r||Response.error())}});
    });
  });
}

function staleWhileRevalidate(req){
  return caches.open(RUNTIME).then(function(c){
    return c.match(req).then(function(hit){
      var net=fetch(req).then(function(res){if(res&&(res.ok||res.type==='opaque'))c.put(req,res.clone());return res}).catch(function(){return hit});
      return hit||net;
    });
  });
}

self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin===self.location.origin){
    if(url.pathname==='/sw.js')return;
    e.respondWith(networkFirst(req));
  }else if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    e.respondWith(staleWhileRevalidate(req));
  }
  /* everything else (ads, analytics) goes straight to the network and is never cached */
});
