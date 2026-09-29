document.addEventListener('DOMContentLoaded',()=>{
  const tl=gsap.timeline({delay:1.05,defaults:{ease:'power4.out'}});
  tl.from('.hero .eyebrow',{y:20,opacity:0,duration:.55}).from('.hero h1 .line',{yPercent:120,opacity:0,stagger:.09,duration:1.05},'-=.2').from('.hero-copy,.hero .actions,.hero .chips',{y:22,opacity:0,stagger:.1,duration:.7},'-=.45').from('.hero-panel',{scale:.92,opacity:0,rotate:2,duration:1},'-=.8');
  gsap.to('.orb',{y:28,rotation:360,duration:12,repeat:-1,ease:'none'});
  gsap.to('.floating-card.one',{y:-12,x:5,duration:2.7,repeat:-1,yoyo:true,ease:'sine.inOut'});
  gsap.to('.floating-card.two',{y:12,x:-6,duration:3.2,repeat:-1,yoyo:true,ease:'sine.inOut'});
  gsap.to('.hero-panel',{yPercent:-7,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.hero h1',{yPercent:-12,opacity:.7,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
});
