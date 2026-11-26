(() => {
  'use strict';
  const menu = document.querySelector('.menu');
  const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => {menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
  toggle.addEventListener('click', () => {const open = menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  menu.addEventListener('click', e => {if(e.target.closest('a')) closeMenu();});
  document.addEventListener('keydown', e => {if(e.key==='Escape') closeMenu();});
  document.addEventListener('click', e => {if(!e.target.closest('header')) closeMenu();});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.getElementById('blogTrack');
  const arrows = [...document.querySelectorAll('.blog-arrow')];
  function updateArrows(){arrows[0].disabled=track.scrollLeft<=2;arrows[1].disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}
  arrows.forEach(arrow => arrow.addEventListener('click',()=>{const card=track.querySelector('.article'); const gap=parseFloat(getComputedStyle(track).gap)||0;track.scrollBy({left:Number(arrow.dataset.direction)*(card.getBoundingClientRect().width+gap),behavior:reduced.matches?'instant':'smooth'});}));
  track.addEventListener('scroll',updateArrows,{passive:true});window.addEventListener('resize',updateArrows);updateArrows();
  track.addEventListener('click',e=>{const btn=e.target.closest('button.read-more');if(!btn)return;const content=document.getElementById(btn.getAttribute('aria-controls'));if(!content)return;const open=content.hidden;content.hidden=!open;btn.setAttribute('aria-expanded',String(open));btn.textContent=open?btn.dataset.less:btn.dataset.more;});
  const demoButtons=[...document.querySelectorAll('.chat-options button')];
  demoButtons.forEach(btn=>btn.addEventListener('click',()=>{demoButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));document.getElementById('demoRequest').textContent=btn.textContent;const answer=document.getElementById('demoAnswer');answer.textContent=btn.dataset.answer;answer.hidden=false;}));
  if('IntersectionObserver' in window && !reduced.matches){
    const blocks=[...document.querySelectorAll('.section-title,.service,.cards .card,.about-box,.stat,.review,.blog-slider,.contact .container')];
    const reveal=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}}},{threshold:0.08});
    blocks.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${(i%3)*70}ms`);reveal.observe(el);});
    document.body.classList.add('reveal-ready');
    reduced.addEventListener('change',e=>{if(e.matches){document.body.classList.remove('reveal-ready');reveal.disconnect();}});
  }
  // Keep navigation synchronized even for sections without their own menu entry.
  const links=[...menu.querySelectorAll('a')], sections=[...document.querySelectorAll('main > section')];
  const aliases={process:'bots',reviews:'about',faq:'contacts'};
  let queued=false;
  function updateNav(){let current=sections[0]?.id;const marker=Math.min(innerHeight*.34,220);for(const section of sections){if(section.getBoundingClientRect().top<=marker)current=section.id;}if(scrollY+innerHeight>=document.documentElement.scrollHeight-5)current='contacts';current=aliases[current]||current;links.forEach(a=>{const active=a.hash==='#'+current;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});queued=false;}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateNav);}},{passive:true});addEventListener('resize',updateNav);updateNav();
})();
