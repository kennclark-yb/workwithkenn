/* Six genuine scenes. Gallery, image comparison and modal lifecycle own separate state. */
(() => {
  'use strict';
  const section=document.querySelector('.cf-creative'),dialog=section?.querySelector('.cf-dialog');
  if(!section||!dialog||typeof dialog.showModal!=='function'||!CSS.supports('clip-path','inset(0 50% 0 0)'))return;
  const cards=[...section.querySelectorAll('[data-cf-scene]')],fan=section.querySelector('.cf-fan');
  const shell=dialog.querySelector('.cf-shell'),surface=dialog.querySelector('.cf-images'),range=dialog.querySelector('#cf-reveal');
  const original=dialog.querySelector('.cf-original'),graded=dialog.querySelector('.cf-graded'),close=dialog.querySelector('.cf-close');
  const modes=[...dialog.querySelectorAll('[data-cf-mode]')],back=dialog.querySelector('.cf-back'),hint=dialog.querySelector('.cf-hint');
  const divider=dialog.querySelector('.cf-divider'),status=dialog.querySelector('.cf-load-status');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let phase='closed',mode='comparison',invoker,previousOverflow='',tween,timer,generation=0,split=50,dragging=false,switchTimer;
  let pointer={x:0,y:0},locked=true,lockPointer={...pointer},keyboard=false;
  const setPhase=value=>{phase=value;dialog.dataset.phase=value;section.dataset.viewer=value;};
  function resetFan(){fan.dataset.expanded='false';locked=true;lockPointer={...pointer};}
  section.addEventListener('pointermove',event=>{pointer={x:event.clientX,y:event.clientY};if(phase!=='closed'||!fan.contains(event.target)||!fine.matches||motion.matches)return;if(locked&&Math.hypot(pointer.x-lockPointer.x,pointer.y-lockPointer.y)<4)return;locked=false;fan.dataset.expanded='true';},{passive:true});
  fan.addEventListener('pointerleave',()=>{fan.dataset.expanded='false';});
  document.addEventListener('keydown',event=>{if(event.key==='Tab')keyboard=true;});
  section.addEventListener('pointerdown',()=>{keyboard=false;},{passive:true});
  fan.addEventListener('focusin',()=>{if(keyboard&&!locked&&phase==='closed')fan.dataset.expanded='true';});
  fan.addEventListener('focusout',event=>{if(!fan.contains(event.relatedTarget))fan.dataset.expanded='false';});
  fan.addEventListener('keydown',event=>{
    if(phase!=='closed')return;
    const current=cards.indexOf(document.activeElement);if(current<0)return;
    if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();let index=event.key==='Home'?0:event.key==='End'?5:Math.max(0,Math.min(5,current+(event.key==='ArrowRight'?1:-1)));locked=false;keyboard=true;fan.dataset.expanded='true';cards[index].focus();}
    else if(event.key==='Tab'){locked=false;keyboard=true;}
  });
  function update(){split=Math.max(0,Math.min(100,Number(range.value)));surface.style.setProperty('--cf-split',split+'%');range.setAttribute('aria-valuetext',split+'% graded, '+(100-split)+'% original');}
  function setMode(value){if(phase==='closing'||phase==='closed')return;mode=value;dialog.dataset.mode=value;original.setAttribute('aria-hidden',String(value==='graded'));graded.setAttribute('aria-hidden',String(value==='original'));surface.dataset.switching='true';clearTimeout(switchTimer);switchTimer=setTimeout(()=>delete surface.dataset.switching,200);const compare=value==='comparison';range.hidden=!compare;range.disabled=!compare;divider.hidden=!compare;back.hidden=compare;hint.hidden=!compare;modes.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cfMode===value)));if(compare)update();}
  modes.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.cfMode)));
  back.addEventListener('click',()=>{setMode('comparison');range.focus({preventScroll:true});});
  range.addEventListener('input',update);
  function drag(event){const r=surface.getBoundingClientRect();range.value=String(Math.round(Math.max(0,Math.min(100,(event.clientX-r.left)/r.width*100))));update();}
  range.addEventListener('pointerdown',event=>{if(mode!=='comparison'||phase==='closing')return;event.preventDefault();clearTimeout(switchTimer);delete surface.dataset.switching;dragging=true;range.focus({preventScroll:true});range.setPointerCapture(event.pointerId);drag(event);});
  range.addEventListener('pointermove',event=>{if(dragging)drag(event);});
  range.addEventListener('pointerup',event=>{if(dragging){drag(event);dragging=false;if(range.hasPointerCapture(event.pointerId))range.releasePointerCapture(event.pointerId);}});
  range.addEventListener('pointercancel',()=>{dragging=false;});
  function settledOpen(id){if(id!==generation||phase!=='opening')return;clearTimeout(timer);setPhase('open');window.gsap?.set(shell,{clearProps:'opacity,transform'});}
  function finishClose(id){if(id!==generation||phase!=='closing')return;clearTimeout(timer);tween?.kill();resetFan();if(dialog.open)dialog.close();document.documentElement.style.overflow=previousOverflow;setPhase('closed');window.gsap?.set(shell,{clearProps:'opacity,transform'});close.disabled=false;if(invoker?.isConnected&&!invoker.hidden)invoker.focus({preventScroll:true});}
  function requestClose(){if(phase==='closed'||phase==='closing')return;const id=++generation;clearTimeout(timer);tween?.kill();setPhase('closing');resetFan();close.disabled=true;dragging=false;if(motion.matches||!window.gsap){finishClose(id);return;}try{tween=gsap.to(shell,{opacity:0,scale:.99,y:6,duration:.18,ease:'power1.in',onComplete:()=>finishClose(id)});timer=setTimeout(()=>finishClose(id),450);}catch(_){finishClose(id);}}
  cards.forEach(card=>{card.removeAttribute('target');card.removeAttribute('aria-description');card.setAttribute('aria-haspopup','dialog');card.setAttribute('role','button');card.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();if(phase!=='closed')return;
    invoker=card;const id=++generation;resetFan();setPhase('opening');previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';close.disabled=false;
    const file=card.dataset.cfScene,prefix='assets/projects/creative/photos-b-and-a/';
    dialog.querySelector('#cf-dialog-title').textContent=card.querySelector('strong').textContent+' — original and graded comparison';
    original.src=prefix+file+'-before.webp';graded.src=prefix+file+'.webp';original.alt='Original: '+card.querySelector('strong').textContent;graded.alt='Graded: '+card.querySelector('strong').textContent;original.setAttribute('aria-hidden','false');graded.setAttribute('aria-hidden','false');
    original.width=Number(card.dataset.width);original.height=Number(card.dataset.height);graded.width=original.width;graded.height=original.height;surface.style.setProperty('--cf-photo-ratio',original.width/original.height);
    range.value='50';mode='comparison';dialog.dataset.mode=mode;range.hidden=false;range.disabled=false;divider.hidden=false;back.hidden=true;hint.hidden=false;modes.forEach(button=>button.setAttribute('aria-pressed','false'));update();
    status.hidden=false;status.textContent='Loading photograph…';Promise.all([original.decode(),graded.decode()]).then(()=>{if(id===generation)status.hidden=true},()=>{if(id===generation)status.textContent='The photograph could not load. Close and try again.'});
    dialog.showModal();close.focus();if(motion.matches||!window.gsap){settledOpen(id);return;}try{tween=gsap.fromTo(shell,{opacity:0,scale:.985,y:8},{opacity:1,scale:1,y:0,duration:.26,ease:'power2.out',onComplete:()=>settledOpen(id)});timer=setTimeout(()=>settledOpen(id),500);}catch(_){settledOpen(id);}
  });card.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();card.click();}});});
  close.addEventListener('click',requestClose);dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=shell.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)requestClose();});
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();requestClose();return;}if(event.key!=='Tab')return;const controls=[...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex]')].filter(el=>el.tabIndex>=0&&!el.hidden&&el.getClientRects().length);if(!controls.length){event.preventDefault();return;}const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}});
  dialog.addEventListener('close',()=>{if(phase!=='closed'){tween?.kill();clearTimeout(timer);resetFan();document.documentElement.style.overflow=previousOverflow;setPhase('closed');close.disabled=false;invoker?.focus({preventScroll:true});}});
  motion.addEventListener('change',()=>{resetFan();if(motion.matches){tween?.kill();if(phase==='closing')finishClose(generation);else if(phase==='opening')settledOpen(generation);}});
  cards.forEach((card,i)=>{card.style.setProperty('--slot',i-2.5);card.style.setProperty('--z',i+1);});section.classList.add('cf-ready');resetFan();
})();
