
document.addEventListener("DOMContentLoaded",()=>{
  // Scratch achievement card — no money, betting, or prizes.
  const scratch=document.querySelector(".scratch-cover");
  if(scratch){
    const reveal=(x,y)=>{
      const r=scratch.getBoundingClientRect();
      const hole=document.createElement("div");
      hole.style.cssText=`position:absolute;width:85px;height:85px;border-radius:50%;left:${x-r.left-42}px;top:${y-r.top-42}px;background:transparent;box-shadow:0 0 0 9999px rgba(0,0,0,0);`;
      scratch.style.clipPath=`circle(0 at 0 0)`;
      scratch.style.opacity=Math.max(0,parseFloat(scratch.style.opacity||1)-.035);
      if(parseFloat(scratch.style.opacity)<.12){
        gsap.to(scratch,{opacity:0,duration:.4,onComplete:()=>scratch.remove()});
      }
    };
    let down=false;
    scratch.addEventListener("pointerdown",e=>{down=true;reveal(e.clientX,e.clientY)});
    scratch.addEventListener("pointermove",e=>{if(down)reveal(e.clientX,e.clientY)});
    window.addEventListener("pointerup",()=>down=false);
  }

  // Tiny keyboard/tap runner game
  const canvas=document.getElementById("gameCanvas");
  if(!canvas)return;
  const ctx=canvas.getContext("2d");
  const dpr=devicePixelRatio||1;
  const resize=()=>{
    const w=Math.min(600,canvas.clientWidth||600),h=260;
    canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  resize();window.addEventListener("resize",resize);

  let player={x:55,y:205,w:26,h:26,vy:0,on:true};
  let blocks=[],score=0,running=false,last=0,spawn=0;
  const jump=()=>{if(!running)running=true;if(player.on){player.vy=-11;player.on=false}};
  canvas.addEventListener("pointerdown",jump);
  window.addEventListener("keydown",e=>{if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();jump()}});

  function reset(){player={x:55,y:205,w:26,h:26,vy:0,on:true};blocks=[];score=0;running=false}
  function loop(t){
    const dt=Math.min((t-last)/16.67,2);last=t;
    const w=canvas.clientWidth,h=260;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle="#0b0c10";ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="rgba(255,255,255,.08)";
    for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    ctx.fillStyle="#a3ff12";ctx.fillRect(0,231,w,2);

    if(running){
      player.vy+=.65*dt;player.y+=player.vy*dt;
      if(player.y>=205){player.y=205;player.vy=0;player.on=true}
      spawn+=dt;
      if(spawn>75){blocks.push({x:w+20,y:207,w:20+Math.random()*22,h:24});spawn=0}
      blocks.forEach(b=>b.x-=5.2*dt);
      blocks=blocks.filter(b=>b.x>-60);
      score+=.08*dt;
      for(const b of blocks){
        if(player.x<b.x+b.w&&player.x+player.w>b.x&&player.y<b.y+b.h&&player.y+player.h>b.y){
          reset();break;
        }
      }
    }
    ctx.fillStyle="#a3ff12";ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.fillStyle="#5ee7ff";blocks.forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));
    ctx.fillStyle="#fff";ctx.font="700 13px Poppins";ctx.fillText(`CODE RUN: ${Math.floor(score)}`,18,28);
    ctx.fillStyle="#888";ctx.font="11px Poppins";ctx.fillText("SPACE / TAP TO JUMP",18,48);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
