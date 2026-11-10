/* Lightweight English site behavior without changing the Spanish visitor journey. */
(()=>{
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));}
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const params=new URLSearchParams(location.search),service=params.get('service'),select=document.querySelector('#solution');
if(service&&select&&[...select.options].some(o=>o.value===service))select.value=service;
const link=document.createElement('a');link.className='en-urgent-whatsapp';link.href='https://wa.me/525572036146?text='+encodeURIComponent('Hello EventNet, I need event connectivity in Mexico.');link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Contact EventNet on WhatsApp');link.innerHTML='<span class="en-urgent-wa-icon" aria-hidden="true">✦</span><span class="en-urgent-wa-label"><b>Need event internet?</b><small>WhatsApp our team</small></span>';document.body.appendChild(link);
})();
