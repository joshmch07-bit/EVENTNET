/* No polling or animation frame loops. All data stays in this browser. */
(()=>{'use strict';
 const cards=[...document.querySelectorAll('.arch-card')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 const buttons=[...document.querySelectorAll('.motion-toggle')];
 function sync(){document.documentElement.classList.toggle('en-motion-paused',paused);buttons.forEach(b=>{b.hidden=false;b.disabled=reduced.matches;b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label','Pausar animaciones');b.textContent=reduced.matches?'Movimiento reducido del sistema':paused?'Activar animaciones':'Pausar animaciones';});}
 buttons.forEach(b=>b.addEventListener('click',()=>{paused=!paused;sync();}));
 reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});sync();
 const visibility=()=>document.documentElement.classList.toggle('en-page-hidden',document.hidden);
 document.addEventListener('visibilitychange',visibility);visibility();
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-visible',e.isIntersecting)),{threshold:.08});cards.forEach(c=>observer.observe(c));}
 // Local diagnostics: approximate LCP, CLS and Event Timing interaction latency (not field INP).
 const metrics={lcpMs:null,cls:0,interactionMs:null,longTasks:0};window.EventNetPerformance=metrics;
 if('PerformanceObserver' in window){function observe(type,fn){try{new PerformanceObserver(list=>list.getEntries().forEach(fn)).observe({type,buffered:true});}catch{}}
 observe('largest-contentful-paint',e=>metrics.lcpMs=Math.round(e.startTime));
 observe('layout-shift',e=>{if(!e.hadRecentInput)metrics.cls+=e.value;});
 observe('event',e=>{if(e.interactionId)metrics.interactionMs=Math.max(metrics.interactionMs||0,e.duration);});
 observe('longtask',()=>metrics.longTasks++);
 }
})();
// Console-only diagnostics in local preview; no telemetry request is sent.
if(['127.0.0.1','localhost'].includes(location.hostname)){
 addEventListener('load',()=>setTimeout(()=>console.info('EventNet local metrics',JSON.stringify(window.EventNetPerformance)),1200),{once:true});
}
