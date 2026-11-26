(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const {bots,text} = JSON.parse($('experienceData').textContent);
  const cards = [...document.querySelectorAll('.solution')];
  const filters = [...document.querySelectorAll('.filter-chip')];
  const dialog = $('botDialog');
  let category = 'all', expanded = false, activeBot = null, opener = null;
  function renderCatalog(){
    const q = $('botSearch').value.trim().toLocaleLowerCase();
    const matches = cards.filter(card => {
      const b = bots[card.dataset.bot];
      return (category === 'all' || b.category === category) && (!q || `${b.name} ${b.title} ${b.description} ${b.features.join(' ')} ${b.scenario}`.toLocaleLowerCase().includes(q));
    });
    const limited = !expanded && category === 'all' && !q;
    const visible = new Set(limited ? matches.slice(0,6) : matches);
    cards.forEach(card => card.hidden = !visible.has(card));
    $('catalogCount').textContent = `${text.count}: ${visible.size} / ${matches.length}`;
    $('catalogEmpty').hidden = matches.length !== 0;
    $('catalogMore').hidden = category !== 'all' || !!q || matches.length <= 6;
    $('catalogMore').textContent = expanded ? `${text.less} −` : `${text.more} +`;
    filters.forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
  }
  function setCategory(c){category=c;expanded=false;$('botSearch').value='';renderCatalog();}
  filters.forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.filter)));
  document.querySelectorAll('.service-link[data-category]').forEach(a=>a.addEventListener('click',()=>setCategory(a.dataset.category)));
  $('botSearch').addEventListener('input',renderCatalog);
  $('catalogMore').addEventListener('click',()=>{expanded=!expanded;renderCatalog();if(!expanded)$('bots').scrollIntoView({block:'start'});});
  function openDetail(id,source){
    const b=bots[id];if(!b)return;
    opener=source || document.activeElement;activeBot=id;
    $('detailTitle').textContent=`${b.name} — ${b.title}`;
    $('detailDesc').textContent=b.description;
    $('detailArt').src=b.art;
    $('detailFeatures').replaceChildren(...b.features.map(f=>{const li=document.createElement('li');li.textContent=f;return li;}));
    $('detailScenario').textContent=b.scenario;$('shareStatus').textContent='';
    if(!dialog.open){dialog.showModal();document.body.classList.add('dialog-open');}
    $('closeDetail').focus();
  }
  document.querySelectorAll('[data-detail]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();openDetail(a.dataset.detail,a);}));
  $('closeDetail').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(location.hash.startsWith('#bot-'))history.replaceState(null,'',location.pathname+location.search+'#bots');if(opener?.isConnected)opener.focus({preventScroll:true});});
  function readHash(){if(location.hash.startsWith('#bot-'))openDetail(location.hash.slice(5));}
  window.addEventListener('hashchange',readHash);
  async function copy(value){if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(value);return true;}catch{}}const ta=document.createElement('textarea');ta.value=value;ta.style.cssText='position:fixed;left:-10000px;top:0';(dialog.open?dialog:document.body).append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch{}ta.remove();return ok;}
  $('shareBot').addEventListener('click',async()=>{const url=new URL(location.href);url.hash=`bot-${activeBot}`;$('shareStatus').textContent=await copy(url.href)?text.share_ok:text.copy_fail;});
  function brief(){const b=bots[$('botType').value];const extras=[...$('briefForm').querySelectorAll('input:checked')].map(x=>x.value);const notes=$('briefNotes').value.trim();$('briefOutput').textContent=`Kodumi TG Bots — ${text.summary}\n\n${text.pick}: ${b.name} / ${b.title}\n\n${text.features}:\n${b.features.map(x=>'• '+x).join('\n')}${extras.length?'\n\n'+text.extras+':\n'+extras.map(x=>'• '+x).join('\n'):''}${notes?'\n\n'+text.notes+':\n'+notes:''}`;$('copyStatus').textContent='';}
  $('briefForm').addEventListener('input',brief);$('briefForm').addEventListener('submit',e=>e.preventDefault());
  $('chooseBot').addEventListener('click',()=>{const id=activeBot;opener=null;dialog.close();$('botType').value=id;brief();$('builder').scrollIntoView({block:'start'});$('botType').focus({preventScroll:true});});
  $('copyBrief').addEventListener('click',async()=>{$('copyStatus').textContent=await copy($('briefOutput').textContent)?text.copied:text.copy_fail;});
  const progress=document.querySelector('.scroll-progress');const top=$('backTop');let queued=false;
  function scrollState(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;top.hidden=scrollY<650;queued=false;}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(scrollState);}},{passive:true});addEventListener('resize',scrollState);top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');if('IntersectionObserver' in window&&!motion.matches){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('arrived');io.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.process-step,.tech-strip,.builder-grid,.approach-card,.faq-item').forEach((el,i)=>{el.classList.add('enter');el.style.setProperty('--stagger',`${i%4*55}ms`);io.observe(el);});motion.addEventListener('change',()=>{if(motion.matches){io.disconnect();document.querySelectorAll('.enter').forEach(el=>el.classList.add('arrived'));}});}
  renderCatalog();brief();scrollState();readHash();
})();
