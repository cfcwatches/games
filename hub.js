/* Hue daily hub: records which daily puzzles were finished each day and works out a combined streak.
   A day counts towards the streak when at least one daily (Sudoku, Kakuro or Hue Word) is finished.
   Everything stays in this browser's localStorage. */
(function(){
  var K='hue-hub';
  var GAMES=[
    {id:'sudoku',name:'Sudoku',href:'sudoku.html?daily=1'},
    {id:'kakuro',name:'Kakuro',href:'kakuro.html'},
    {id:'word',name:'Hue Word',href:'word-guess.html'},
    {id:'shift',name:'Hue Shift',href:'hue-shift.html'}
  ];
  function get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function ds(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function today(){return ds(new Date())}
  function snapshot(){
    var hub=get(K)||{},sd=get('hue-daily')||{},kd=get('hue-kakuro-daily'),wd=get('hue-word-daily'),hd=get('hue-shift-daily');
    return {hub:hub,days:hub.days||{},sudoku:sd.done||{},kakuroDay:kd&&kd.date,wordDay:wd&&wd.done?wd.date:null,shiftDay:hd&&hd.date};
  }
  function doneOn(s,day){
    var a=(s.days[day]||[]).slice();
    function add(g){if(a.indexOf(g)<0)a.push(g)}
    if(s.sudoku[day])add('sudoku');
    if(s.kakuroDay===day)add('kakuro');
    if(s.wordDay===day)add('word');
    if(s.shiftDay===day)add('shift');
    return a;
  }
  function streakFrom(s){
    var d=new Date();
    if(!doneOn(s,ds(d)).length)d.setDate(d.getDate()-1);
    var n=0;
    while(n<3650&&doneOn(s,ds(d)).length){n++;d.setDate(d.getDate()-1)}
    return n;
  }
  function stats(){
    var s=snapshot(),t=today(),done=doneOn(s,t),st=streakFrom(s);
    return {done:done,count:done.length,total:GAMES.length,streak:st,best:Math.max(s.hub.best||0,st)};
  }
  /* Call when a daily puzzle is finished: HueHub.done('sudoku'|'kakuro'|'word') */
  function done(game){
    try{
      var o=get(K)||{};o.days=o.days||{};var t=today(),a=o.days[t]||[];
      if(a.indexOf(game)<0)a.push(game);o.days[t]=a;
      var ks=Object.keys(o.days).sort();while(ks.length>400)delete o.days[ks.shift()];
      localStorage.setItem(K,JSON.stringify(o));
      o.best=Math.max(o.best||0,streakFrom(snapshot()));
      localStorage.setItem(K,JSON.stringify(o));
    }catch(e){}
  }
  function next(current){
    var s=stats();
    for(var i=0;i<GAMES.length;i++){if(GAMES[i].id!==current&&s.done.indexOf(GAMES[i].id)<0)return GAMES[i]}
    return null;
  }
  /* Fills an element with a short "what's next" line for the end-of-game screens. */
  function render(el,current){
    if(!el)return;
    var s=stats(),n=next(current),h;
    if(s.count>=s.total)h='All '+s.total+' dailies done today. <b>🔥 '+s.streak+'-day streak</b>';
    else{
      h='Dailies today: <b>'+s.count+'/'+s.total+'</b>'+(s.streak?' · 🔥 '+s.streak+'-day streak':'');
      if(n)h+='<br>Next up: <a href="'+n.href+'">'+n.name+'</a>';
    }
    el.innerHTML=h;el.hidden=false;
  }
  window.HueHub={games:GAMES,stats:stats,done:done,next:next,render:render,today:today,ds:ds};
})();
