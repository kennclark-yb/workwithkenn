/* Optional editorial entrances. Visible HTML is the fallback; no scroll interception. */
(() => {
  'use strict';
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || typeof gsap.matchMedia !== 'function') return;
  const plans = [
    ['credibility-heading','#credibility .section-heading',0],
    ['credibility-proof','#credibility .credibility-proof',14],
    ['work-heading','#work > .section-heading',16],
    ['jihyo-heading','[data-work-id="jihyo"] .work-masthead',14],
    ['jihyo-story','[data-work-id="jihyo"] .interaction-story',12],
    ['yoink-heading','#yoink .yoink-heading > div',14],
    ['yoink-story','#yoink .yoink-story > p',12],
    ['supporting-heading','#supporting .sw-section-heading',16],
    ['supporting-entries','#supporting .sw-entry-heading',12],
    ['notion-evidence','#supporting .sw-authentic-evidence',0],
    ['experience-heading','#experience .pe-opening h2, #experience .pe-introduction',16],
    ['experience-cards','#experience .pe-pillar',14],
    ['capabilities-intro','#capabilities .sb-section-intro > *',16],
    ['building-intro','#building .sb-section-intro > *',16],
    ['building-story','#building .sb-lab-copy > *',12],
    ['building-interface','#building .sb-console',12],
    ['building-notes','#building .sb-development-note > div',12],
    ['creative-intro','#creative .cf-opening > *',14],
    ['about-heading','#about h2',14],
    ['about-portrait','#about .sp-about-home-media',12],
    ['contact-heading','#contact h2, #contact h2 + p',16],
    ['contact-action','#contact .sc-contact-main',0],
    ['contact-routes','#contact .sc-contact-routes',0]
  ];
  const completed = new Set(), owned = new Set(), records = new Map();
  let observer, media;
  const emit = (name,phase) => document.dispatchEvent(new CustomEvent('portfolio:entrance',{detail:{name,phase,at:performance.now()}}));
  function visible(elements) { gsap.set(elements,{clearProps:'opacity,transform'}); }
  function failVisible() {
    observer?.disconnect();
    media?.revert();
    records.forEach(r=>{r.trigger?.kill();r.tween?.kill();});
    visible([...owned]);
  }
  function initialize() {
    try {
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add({motion:'(prefers-reduced-motion: no-preference)',small:'(max-width: 600px)'},context=>{
        if (!context.conditions.motion) return;
        const small=context.conditions.small;
        function attach() {
          for (const [name,selector,travel] of plans) {
            const elements=Array.from(document.querySelectorAll(selector)).filter(el=>el.isConnected && el.getClientRects().length);
            if (!elements.length || completed.has(name)) continue;
            const previous=records.get(name);
            if (previous && previous.elements.length===elements.length && previous.elements.every((el,i)=>el===elements[i])) continue;
            previous?.trigger?.kill();previous?.tween?.kill();
            if(previous)visible(previous.elements.filter(el=>el.isConnected));
            const record={elements,trigger:null,tween:null,started:false};
            records.set(name,record);elements.forEach(el=>owned.add(el));
            const finish=()=>{
              completed.add(name);
              if(record.tween)record.tween.progress(1);
              visible(elements.filter(el=>el.isConnected));
            };
            const play=()=>{
              if(record.started || completed.has(name))return;
              record.started=true;completed.add(name);
              if(!elements.every(el=>el.isConnected)){visible(elements.filter(el=>el.isConnected));return;}
              if(elements.every(el=>el.getBoundingClientRect().bottom<0)){finish();return;}
              emit(name,'start');
              const from={opacity:.18}, to={opacity:1,duration:small?.56:.66,stagger:elements.length>1?.085:0,ease:'power2.out',overwrite:false,clearProps:'opacity',onComplete:()=>{visible(elements);emit(name,'complete');}};
              if(travel){from.y=small?Math.min(12,travel):travel;to.y=0;to.clearProps='opacity,transform';}
              record.tween=gsap.fromTo(elements,from,to);
            };
            record.trigger=ScrollTrigger.create({id:'editorial-'+name,trigger:elements[0],start:'top 88%',end:'bottom top',once:true,onEnter:play,onEnterBack:play,onLeave:()=>{if(record.started)finish();},onRefresh:self=>{if(self.progress===1)finish();}});
          }
        }
        attach();
        const target=document.querySelector('[data-featured-work]');
        if(target){observer=new MutationObserver(()=>{try{attach();ScrollTrigger.refresh();}catch(_){failVisible();}});observer.observe(target,{childList:true});}
        const focus=event=>{records.forEach(record=>{if(record.started && record.elements.some(el=>el.contains(event.target)))record.tween?.progress(1);});};
        document.addEventListener('focusin',focus);
        document.fonts?.ready.then(()=>ScrollTrigger.refresh());
        return ()=>{observer?.disconnect();document.removeEventListener('focusin',focus);records.forEach(r=>{r.trigger?.kill();r.tween?.kill();});records.clear();visible([...owned].filter(el=>el.isConnected));};
      });
    } catch (_) { failVisible(); }
  }
  function scheduleInitialization() {
    // ScrollTrigger refresh must not interrupt the browser's initial native anchor scroll.
    if (location.hash && !['#top','#home'].includes(location.hash)) {
      let pending=true, timer;
      const settled=()=>{if(!pending)return;pending=false;clearTimeout(timer);window.removeEventListener('scrollend',settled);initialize();};
      window.addEventListener('scrollend',settled,{once:true});
      timer=setTimeout(settled,2400);
    } else requestAnimationFrame(initialize);
  }
  if(document.readyState==='complete')scheduleInitialization();
  else window.addEventListener('load',scheduleInitialization,{once:true});
})();


