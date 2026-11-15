/* Registers the service worker and powers the "Install app" card on the homepage. */
(function(){
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})});
  }
  var box=document.getElementById('installbox');
  if(!box)return;
  var btn=document.getElementById('installbtn'),msg=document.getElementById('installmsg'),prompt=null;
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
  if(standalone)return;
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function show(){box.hidden=false}
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();prompt=e;btn.hidden=false;msg.textContent='Add Hue Sudoku to your home screen. It opens full screen and works offline.';show()});
  window.addEventListener('appinstalled',function(){box.hidden=true;prompt=null});
  btn.addEventListener('click',function(){
    if(!prompt)return;
    prompt.prompt();
    prompt.userChoice.then(function(){prompt=null;box.hidden=true}).catch(function(){});
  });
  if(ios){
    btn.hidden=true;
    msg.innerHTML='Install on iPhone or iPad: tap the <b>Share</b> button, then <b>Add to Home Screen</b>.';
    show();
  }
})();
