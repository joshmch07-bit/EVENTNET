// EventNet 2.2 - subtle interactive enhancement; no external dependencies.
(()=>{
const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!mq.matches && window.matchMedia('(pointer:fine)').matches){
  const halo=document.createElement('div'),dot=document.createElement('div');halo.className='en-trail';dot.className='en-trail-dot';document.body.append(halo,dot);
  let pos={x:-100,y:-100},dest={x:-100,y:-100},raf=false;
  function tick(){pos.x+=(dest.x-pos.x)*.2;pos.y+=(dest.y-pos.y)*.2;halo.style.transform=`translate3d(${pos.x-15}px,${pos.y-15}px,0)`;raf=false;if(Math.abs(pos.x-dest.x)>.4||Math.abs(pos.y-dest.y)>.4)request()}
  function request(){if(!raf){raf=true;requestAnimationFrame(tick)}}
  document.addEventListener('pointermove',e=>{dest.x=e.clientX;dest.y=e.clientY;dot.style.transform=`translate3d(${dest.x-2.5}px,${dest.y-2.5}px,0)`;request()},{passive:true});
  document.addEventListener('pointerover',e=>{halo.classList.toggle('active',!!e.target.closest('a,button,.card'))});
  document.addEventListener('pointerleave',()=>{halo.style.opacity='0';dot.style.opacity='0'});document.addEventListener('pointerenter',()=>{halo.style.opacity='1';dot.style.opacity='1'});
}
function initViews(){
 if('IntersectionObserver' in window&&!mq.matches){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{rootMargin:'0px 0px -35px 0px',threshold:.05});document.querySelectorAll('.section-head,.photo-mosaic,.ops-image,.service-proof,.calc-panel').forEach(x=>{x.classList.add('en-reveal');observer.observe(x)})}
 const get=(id)=>document.getElementById(id);
 const att=get('calc-attendees');if(att){let fn=()=>{const n=Math.max(1,+att.value||0),pct=+get('calc-share').value/100,u=+get('calc-profile').value,s=Math.max(0,+get('calc-streams').value||0);get('calc-share-v').textContent=Math.round(pct*100)+'%';get('calc-mbps').textContent=Math.ceil((n*pct*u+s*12)*1.3)};['calc-attendees','calc-share','calc-profile','calc-streams'].forEach(id=>get(id)?.addEventListener('input',fn));fn()}
 if(get('wifi-users')){let fn=()=>{const u=Math.max(1,+get('wifi-users').value||0),cap=Math.max(1,+get('wifi-density').value||0),zones=Math.max(1,+get('wifi-zones').value||0);get('calc-aps').textContent=Math.max(Math.ceil(u/cap),zones)};['wifi-users','wifi-density','wifi-zones'].forEach(id=>get(id)?.addEventListener('input',fn));fn()}
 const btn=get('run-speedtest');if(btn)btn.addEventListener('click',async()=>{
   const set=(id,v)=>{const x=get(id);if(x)x.textContent=v};btn.disabled=true;
   set('speed-status','EJECUTANDO');set('speed-message','Midiendo transferencia aproximada desde este navegador. Puede consumir algunos MB de datos.');
   set('metric-ping','—');set('metric-down','—');set('metric-up','—');set('speed-primary','…');
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),18000);
   const url='https://speed.cloudflare.com';const now=()=>performance.now();
   try{
     let st=now();let q=await fetch(url+'/__down?bytes=1000&cache='+Date.now(),{cache:'no-store',mode:'cors',signal:controller.signal});if(!q.ok)throw Error('Servidor de prueba no disponible');await q.arrayBuffer();set('metric-ping',(now()-st).toFixed(0));
     st=now();q=await fetch(url+'/__down?bytes=2000000&cache='+Date.now(),{cache:'no-store',mode:'cors',signal:controller.signal});if(!q.ok)throw Error('No fue posible medir descarga');let blob=await q.arrayBuffer();let down=8*blob.byteLength/((now()-st)/1000)/1e6;set('metric-down',down.toFixed(1));set('speed-primary',down.toFixed(1));
     set('speed-gauge-label','MBPS · DESCARGA');
     // Upload may be restricted by browser CORS; label as unavailable rather than fabricate.
     try{const payload=new Uint8Array(600000);st=now();q=await fetch(url+'/__up',{method:'POST',body:payload,mode:'cors',signal:controller.signal});if(!q.ok)throw Error('Upload endpoint unavailable');const up=8*payload.byteLength/((now()-st)/1000)/1e6;set('metric-up',up.toFixed(1));set('speed-status','PRUEBA FINALIZADA');set('speed-message','Medición indicativa completada. Confirma resultados con pruebas controladas, múltiples rutas y escenarios de carga.')}catch(e){set('metric-up','N/D');set('speed-status','PRUEBA PARCIAL');set('speed-message','Descarga y latencia medidas; la prueba de subida no estuvo disponible. Usa la medición alternativa para un resultado completo.');}
   }catch(e){set('speed-status','SIN RESULTADO');set('speed-primary','—');set('speed-message','El navegador no pudo acceder al servidor de medición (red, privacidad o CORS). Abre la prueba alternativa independiente.');}
   finally{clearTimeout(timeout);btn.disabled=false}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initViews);else initViews();
window.EventNetInitViews=initViews;
})();
