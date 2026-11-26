(function(){
  var MIN=60,MAX=160,bpm=80,state='clean',t=0,phase=0,last=0,noteT=0;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var meter=document.getElementById('meter'),el=document.getElementById('bpm'),fill=document.getElementById('fill'),
      msg=document.getElementById('msg'),st=document.getElementById('state'),notes=document.getElementById('notes'),arm=document.getElementById('arm');
  var DUR={clean:5,sloppy:3.5},RATE={clean:14,sloppy:-20};
  function addNote(){
    var good=Math.random()<(state==='clean'?0.92:0.15);
    var s=document.createElement('span');s.className=good?'g':'r';notes.appendChild(s);
    while(notes.children.length>12)notes.removeChild(notes.firstChild);
  }
  function setState(s){
    state=s;t=0;meter.dataset.state=s;
    st.textContent=s==='clean'?'Playing clean':'Playing sloppy';
    msg.textContent=s==='clean'?'Clean. Speeding up.':'Sloppy. Slowing down.';
  }
  function render(){
    el.textContent=Math.round(bpm);
    fill.style.width=((bpm-MIN)/(MAX-MIN)*100)+'%';
  }
  function frame(now){
    var dt=Math.min(0.1,(now-last)/1000||0);last=now;
    t+=dt;if(t>=DUR[state])setState(state==='clean'?'sloppy':'clean');
    bpm=Math.max(MIN,Math.min(MAX,bpm+RATE[state]*dt));
    phase+=dt*bpm/60*Math.PI; // one full swing per beat pair
    if(!reduce)arm.style.transform='rotate('+(Math.sin(phase)*28)+'deg)';
    noteT+=dt;if(noteT>0.3){noteT=0;addNote();}
    render();requestAnimationFrame(frame);
  }
  for(var i=0;i<12;i++)addNote();
  render();
  requestAnimationFrame(frame);
  document.getElementById('yr').textContent=new Date().getFullYear();

  var form=document.getElementById('form'),email=document.getElementById('email'),fm=document.getElementById('formmsg');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){fm.textContent='Please enter a valid email.';return;}
    // TODO: connect to a real waitlist backend. Nothing is stored yet.
    fm.textContent='Thanks! (Waitlist signup is not wired up yet.)';
    form.reset();
  });
})();
