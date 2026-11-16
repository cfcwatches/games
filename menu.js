/* Adaptive header menu (see menu.css). Collapses the nav into a Menu button whenever the links do not fit on one row. */
(function(){
  var h=document.querySelector('header'),nav=h&&h.querySelector('nav');
  if(!nav)return;
  h.classList.add('mm');
  if(!nav.id)nav.id='sitenav';
  var b=document.createElement('button');
  b.type='button';b.className='mbtn';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',nav.id);
  b.innerHTML='<span class="bars" aria-hidden="true"></span><span>Menu</span>';
  h.insertBefore(b,nav);
  function set(o){h.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}
  function fits(){
    h.classList.remove('mm-on');
    var as=nav.querySelectorAll('a');if(!as.length)return true;
    var logo=h.querySelector('.logo'),t0=as[0].getBoundingClientRect().top;
    for(var i=1;i<as.length;i++)if(Math.abs(as[i].getBoundingClientRect().top-t0)>4)return false;   /* links wrap onto 2 lines */
    if(logo&&t0>logo.getBoundingClientRect().bottom-4)return false;                                  /* whole nav dropped below the logo */
    return h.scrollWidth<=h.clientWidth+1;
  }
  var raf=0;
  function update(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){var on=!fits();h.classList.toggle('mm-on',on);if(!on)set(false)});
  }
  /* run once straight away (no flash of a wrapped nav), then whenever sizes can change */
  (function(){var on=!fits();h.classList.toggle('mm-on',on)})();
  window.addEventListener('resize',update);
  window.addEventListener('load',update);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(update);
  b.addEventListener('click',function(e){e.stopPropagation();set(!h.classList.contains('open'))});
  document.addEventListener('click',function(e){if(!h.contains(e.target))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&h.classList.contains('open')){set(false);b.focus()}});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
})();
