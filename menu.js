/* Adds a "Menu" button to the header on narrow screens (see menu.css). Safe to load with no nav present. */
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
  b.addEventListener('click',function(e){e.stopPropagation();set(!h.classList.contains('open'))});
  document.addEventListener('click',function(e){if(!h.contains(e.target))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&h.classList.contains('open')){set(false);b.focus()}});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  var mq=window.matchMedia('(min-width:701px)');
  (mq.addEventListener?mq.addEventListener.bind(mq,'change'):mq.addListener.bind(mq))(function(){set(false)});
})();
