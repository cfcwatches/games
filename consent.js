/* Hue Sudoku consent manager.
   - Google's ad script (AdSense) is NOT loaded until the visitor presses Accept.
   - Reject = no ads script at all, and the empty ad slots are hidden.
   - The choice is stored in this browser (localStorage 'hue-consent'); a "Cookie settings" link in the footer reopens it.
   - Game progress, streaks and preferences are stored locally for the game to work and do not need consent.

   IMPORTANT: for visitors in the UK / EEA, Google requires ads to be served with a Google-certified consent
   platform. If you switch on Google's free "Privacy & messaging" consent message in your AdSense account,
   set USE_GOOGLE_CMP to true below. This banner then stands down and ads load as normal, so visitors don't see two banners. */
(function(){
  var USE_GOOGLE_CMP=false;
  var CLIENT='ca-pub-7925282448688414',KEY='hue-consent',root=document.documentElement;

  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function write(ads){try{localStorage.setItem(KEY,JSON.stringify({ads:ads,ts:Date.now()}))}catch(e){}}
  function slots(){return document.querySelectorAll('ins.adsbygoogle')}

  function loadAds(){
    root.classList.remove('noads');
    if(window.__hueAdsLoaded)return;window.__hueAdsLoaded=true;
    var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
    s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+CLIENT;
    (document.head||root).appendChild(s);
  }
  function fillSlots(){
    /* slots that were hidden when the page first ran have not been requested yet */
    [].forEach.call(slots(),function(el){
      if(el.getAttribute('data-adsbygoogle-status')||el.offsetParent===null)return;
      try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}
    });
  }

  var st=read();
  if(USE_GOOGLE_CMP){loadAds();return}
  if(st&&st.ads===true)loadAds();else root.classList.add('noads');

  /* ---------- banner ---------- */
  var css='.noads .adwrap{display:none!important}'
  +'.hcb{position:fixed;left:0;right:0;bottom:0;z-index:200;padding:12px 12px calc(12px + env(safe-area-inset-bottom,0px));pointer-events:none;font:15px/1.5 system-ui,-apple-system,sans-serif}'
  +'.hcb[hidden]{display:none}'
  +'.hcb-in{pointer-events:auto;max-width:720px;margin:0 auto;background:var(--panel,#fff);color:var(--ink,#241f3d);border:1px solid var(--line,#d6cdee);border-radius:18px;padding:16px 18px;box-shadow:0 18px 50px -12px rgba(30,20,90,.5)}'
  +'.hcb-in b{display:block;font:800 18px "Bricolage Grotesque",system-ui,sans-serif;margin-bottom:2px}'
  +'.hcb-in p{margin:0 0 12px;color:var(--mute,#5e5683)}.hcb-in p a{color:var(--accent,#6c4cf1);font-weight:600}'
  +'.hcb-btns{display:flex;gap:10px}'
  +'.hcb-btns button{flex:1;border:2px solid var(--accent,#6c4cf1);background:var(--panel,#fff);color:var(--accent,#6c4cf1);border-radius:12px;padding:11px 16px;font:800 16px system-ui,sans-serif;cursor:pointer;touch-action:manipulation}'
  +'.hcb-btns button[data-a="yes"]{background:var(--accent,#6c4cf1);color:#fff}'
  +'.hcb-btns button:focus-visible,.cslink:focus-visible{outline:3px solid var(--accent,#6c4cf1);outline-offset:2px}'
  +'.cslink{background:none;border:0;padding:0;margin:0 0 0 8px;font:inherit;color:inherit;text-decoration:underline;cursor:pointer;opacity:.9}';
  var style=document.createElement('style');style.textContent=css;(document.head||root).appendChild(style);

  var bar=null;
  function build(){
    bar=document.createElement('div');bar.className='hcb';bar.hidden=true;
    bar.setAttribute('role','dialog');bar.setAttribute('aria-labelledby','hcb-t');
    bar.innerHTML='<div class="hcb-in"><b id="hcb-t">Ads and your privacy</b>'
      +'<p>Ads keep these games free. If you accept, Google and its partners may use cookies to show ads. If you reject, no ads load. Your scores and progress stay on your device either way. <a href="privacy.html">Privacy policy</a></p>'
      +'<div class="hcb-btns"><button type="button" data-a="no">Reject</button><button type="button" data-a="yes">Accept</button></div></div>';
    bar.addEventListener('click',function(e){
      var b=e.target.closest('button[data-a]');if(!b)return;
      var yes=b.getAttribute('data-a')==='yes',had=!!window.__hueAdsLoaded;
      write(yes);bar.hidden=true;
      if(yes){loadAds();setTimeout(fillSlots,50)}
      else{root.classList.add('noads');if(had)location.reload()}
    });
    document.body.appendChild(bar);
  }
  function open(){if(!bar)build();bar.hidden=false;var c=bar.querySelector('.hcb-in');c.tabIndex=-1;c.style.outline='none';c.focus({preventScroll:true})}

  function ready(){
    /* footer link to change the choice later */
    var f=document.querySelector('footer');
    if(f&&!f.querySelector('.cslink')){
      var b=document.createElement('button');b.type='button';b.className='cslink';b.textContent='Cookie settings';b.addEventListener('click',open);
      f.appendChild(document.createTextNode(' '));f.appendChild(b);
    }
    if(!st||typeof st.ads!=='boolean')open();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
