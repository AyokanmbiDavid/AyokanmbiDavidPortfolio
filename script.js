document.addEventListener('DOMContentLoaded',()=>{
  const hasGSAP=typeof gsap!=='undefined';
  const hasST=hasGSAP && typeof ScrollTrigger!=='undefined';
  if(hasST) gsap.registerPlugin(ScrollTrigger);
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));

  // Keep the page usable even if an animation fails.
  const loader=$('.page-loader'), progress=$('.loader-progress');
  if(hasGSAP && progress && loader){
    const intro=gsap.timeline();
    intro.to(progress,{width:'100%',duration:.7,ease:'power2.out'})
      .to(loader,{yPercent:-100,duration:.6,ease:'power3.inOut'},'+=.05');
  }else if(loader){
    loader.style.display='none';
  }

  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  $$('[data-page]').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(href===current) a.classList.add('active');
  });

  // Mobile drawer.
  const drawer=$('.mobile-drawer'), backdrop=$('.drawer-backdrop');
  const setDrawer=(open)=>{
    if(!drawer) return;
    document.body.classList.toggle('nav-open',open);
    if(hasGSAP){
      gsap.to(drawer,{x:open?'0%':'105%',duration:.35,ease:'power2.out',overwrite:true});
      if(backdrop) gsap.to(backdrop,{opacity:open?1:0,duration:.2,pointerEvents:open?'auto':'none',overwrite:true});
    }else{
      drawer.style.transform=open?'translateX(0)':'translateX(105%)';
      if(backdrop){backdrop.style.opacity=open?'1':'0';backdrop.style.pointerEvents=open?'auto':'none';}
    }
  };
  $('.mobile-menu-btn')?.addEventListener('click',()=>setDrawer(true));
  $('.close-drawer')?.addEventListener('click',()=>setDrawer(false));
  backdrop?.addEventListener('click',()=>setDrawer(false));
  $$('.mobile-drawer a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));

  // Reveal animations. Elements remain visible if JS/GSAP is unavailable.
  if(hasST){
    $$('.reveal').forEach((el,i)=>{
      gsap.fromTo(el,{opacity:0,y:24},{opacity:1,y:0,duration:.65,delay:Math.min(i*.018,.18),ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
    });
  }

  if(hasST){
    $$('[data-parallax]').forEach(el=>gsap.to(el,{yPercent:-12,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
  }

  const marquee=$('.marquee-track');
  if(hasGSAP && marquee){
    if(!marquee.dataset.cloned){ marquee.innerHTML+=marquee.innerHTML; marquee.dataset.cloned='1'; }
    gsap.to(marquee,{xPercent:-50,duration:26,repeat:-1,ease:'none'});
  }

  if(hasGSAP && hasST){
    $$('[data-count]').forEach(el=>{
      const target=Number(el.dataset.count)||0,obj={v:0};
      gsap.to(obj,{v:target,duration:1.2,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true},onUpdate:()=>el.textContent=Math.floor(obj.v)});
    });
  }

  // Lightweight cursor: use quickTo instead of creating a tween for every pointer event.
  const cursor=$('.cursor');
  if(cursor && matchMedia('(pointer:fine)').matches){
    if(hasGSAP){
      const moveX=gsap.quickTo(cursor,'x',{duration:.12,ease:'power2.out'});
      const moveY=gsap.quickTo(cursor,'y',{duration:.12,ease:'power2.out'});
      window.addEventListener('pointermove',e=>{moveX(e.clientX);moveY(e.clientY)},{passive:true});
      $$('.side-link,a,button,.card,.project-card,.small-project').forEach(el=>{
        el.addEventListener('mouseenter',()=>gsap.to(cursor,{scale:1.9,duration:.15,overwrite:true}));
        el.addEventListener('mouseleave',()=>gsap.to(cursor,{scale:1,duration:.15,overwrite:true}));
      });
    }
  }

  // Magnetic buttons only on fine pointers.
  if(hasGSAP && matchMedia('(pointer:fine)').matches){
    $$('.magnetic').forEach(btn=>{
      const xTo=gsap.quickTo(btn,'x',{duration:.2,ease:'power2.out'});
      const yTo=gsap.quickTo(btn,'y',{duration:.2,ease:'power2.out'});
      btn.addEventListener('pointermove',e=>{
        const r=btn.getBoundingClientRect();
        xTo((e.clientX-r.left-r.width/2)*.10); yTo((e.clientY-r.top-r.height/2)*.10);
      },{passive:true});
      btn.addEventListener('pointerleave',()=>gsap.to(btn,{x:0,y:0,duration:.35,ease:'power2.out',overwrite:true}));
    });
  }

  // Tilt is disabled on touch devices to reduce CPU/GPU work.
  if(hasGSAP && matchMedia('(pointer:fine)').matches){
    $$('.tilt').forEach(card=>{
      const rX=gsap.quickTo(card,'rotateX',{duration:.2,ease:'power2.out'});
      const rY=gsap.quickTo(card,'rotateY',{duration:.2,ease:'power2.out'});
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        rY(x*4.5); rX(-y*4.5);
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        gsap.to(card,{rotateX:0,rotateY:0,duration:.4,ease:'power2.out',overwrite:true});
      });
    });
  }

  $$('.icon-btn').forEach(btn=>btn.addEventListener('click',()=>{
    if(hasGSAP) gsap.fromTo(btn,{scale:.92},{scale:1,duration:.35,ease:'back.out(2)',overwrite:true});
  }));
});
