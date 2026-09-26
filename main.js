
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Loader
  const progress = document.querySelector(".loader-progress");
  const loader = document.querySelector(".page-loader");
  if (progress && loader) {
    gsap.to(progress,{width:"100%",duration:1.1,ease:"power2.inOut"});
    gsap.to(loader,{yPercent:-100,duration:.8,delay:1.15,ease:"power4.inOut"});
  }

  // Mobile navigation
  const menuBtn = document.querySelector(".menu");
  const mobile = document.querySelector(".mobile-menu");
  if(menuBtn && mobile){
    menuBtn.addEventListener("click",()=>mobile.classList.toggle("open"));
  }

  // Current page
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-page]").forEach(a=>{
    if(a.getAttribute("href") === page) a.classList.add("active");
  });

  // Page reveal
  gsap.utils.toArray(".reveal").forEach(el=>{
    gsap.from(el,{y:55,opacity:0,duration:1,ease:"power3.out",
      scrollTrigger:{trigger:el,start:"top 86%"}});
  });

  // Image/card parallax
  gsap.utils.toArray("[data-parallax]").forEach(el=>{
    gsap.to(el,{yPercent:-12,ease:"none",scrollTrigger:{
      trigger:el,start:"top bottom",end:"bottom top",scrub:true
    }});
  });

  // Horizontal marquee
  gsap.utils.toArray(".marquee-track").forEach(track=>{
    gsap.to(track,{xPercent:-35,duration:18,repeat:-1,ease:"none"});
  });

  // Magnetic buttons
  document.querySelectorAll(".magnetic").forEach(btn=>{
    btn.addEventListener("mousemove",e=>{
      const r=btn.getBoundingClientRect();
      gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.18,duration:.25});
    });
    btn.addEventListener("mouseleave",()=>gsap.to(btn,{x:0,y:0,duration:.5,ease:"elastic.out(1,.4)"}));
  });

  // Counters
  document.querySelectorAll("[data-count]").forEach(el=>{
    const target=Number(el.dataset.count);
    const obj={v:0};
    gsap.to(obj,{v:target,duration:1.8,ease:"power2.out",scrollTrigger:{
      trigger:el,start:"top 90%",once:true
    },onUpdate:()=>el.textContent=Math.floor(obj.v)});
  });

  // Custom cursor for desktop
  const cursor=document.querySelector(".cursor-dot");
  if(cursor && matchMedia("(pointer:fine)").matches){
    cursor.style.display="block";
    window.addEventListener("mousemove",e=>gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.12}));
  }

  // Soft 3D tilt
  document.querySelectorAll("[data-tilt]").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      gsap.to(card,{rotateY:x*8,rotateX:-y*8,transformPerspective:900,duration:.35});
    });
    card.addEventListener("mouseleave",()=>gsap.to(card,{rotateY:0,rotateX:0,duration:.5}));
  });
});
