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
  if('IntersectionObserver' in window){const links=[...menu.querySelectorAll('a')];const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}},{rootMargin:'-20% 0px -60% 0px'});document.querySelectorAll('main > section').forEach(s=>observer.observe(s));}
})();
