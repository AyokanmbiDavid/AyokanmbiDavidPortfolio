
document.addEventListener("DOMContentLoaded",()=>{
  gsap.registerPlugin(ScrollTrigger);

  const title=document.querySelector(".hero-title");
  if(title){
    gsap.from(title.querySelectorAll(".hero-line"),{
      yPercent:120,opacity:0,stagger:.12,duration:1.25,ease:"power4.out",delay:1.15
    });
  }

  const orb=document.querySelector(".orb");
  if(orb){
    gsap.to(orb,{y:70,x:35,rotation:25,ease:"none",scrollTrigger:{
      trigger:".hero",start:"top top",end:"bottom top",scrub:1
    }});
  }

  gsap.to(".hero-copy",{y:-80,opacity:.35,ease:"none",scrollTrigger:{
    trigger:".hero",start:"top top",end:"bottom top",scrub:true
  }});

  // Stack cards
  gsap.utils.toArray(".stack-card").forEach((card,i)=>{
    gsap.from(card,{scale:.88,opacity:0,y:70,duration:1,delay:i*.08,ease:"power3.out",
      scrollTrigger:{trigger:card,start:"top 88%"}});
  });
});
