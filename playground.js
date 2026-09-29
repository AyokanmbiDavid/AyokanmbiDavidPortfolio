document.addEventListener('DOMContentLoaded',()=>{
  const dpr=()=>Math.min(window.devicePixelRatio||1,1.5);

  // Scratch reveal: redraw only when the user is actively scratching.
  const cover=document.querySelector('.scratch-cover');
  if(cover){
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d',{alpha:true});
    cover.replaceChildren(canvas);
    let scale=1;
    const resizeScratch=()=>{
      const r=cover.getBoundingClientRect();
      scale=dpr();
      canvas.width=Math.max(1,Math.round(r.width*scale));
      canvas.height=Math.max(1,Math.round(r.height*scale));
      canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px';
      ctx.setTransform(scale,0,0,scale,0,0);
      ctx.globalCompositeOperation='source-over';
      ctx.fillStyle='#77797d'; ctx.fillRect(0,0,r.width,r.height);
      ctx.fillStyle='#9b9da1';
      for(let x=-r.height;x<r.width+r.height;x+=22){
        ctx.save();ctx.translate(x,0);ctx.rotate(Math.PI/4);ctx.fillRect(0,0,6,r.height*2);ctx.restore();
      }
      ctx.globalCompositeOperation='destination-out';
    };
    resizeScratch();
    let down=false,lastX=0,lastY=0;
    const scratch=(e)=>{
      if(!down)return;
      const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      ctx.lineWidth=44;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(x,y);ctx.stroke();lastX=x;lastY=y;
    };
    canvas.addEventListener('pointerdown',e=>{down=true;canvas.setPointerCapture(e.pointerId);const r=canvas.getBoundingClientRect();lastX=e.clientX-r.left;lastY=e.clientY-r.top;scratch(e)});
    canvas.addEventListener('pointermove',scratch,{passive:true});
    const stop=()=>down=false;
    canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('lostpointercapture',stop);
    let resizeTimer;
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resizeScratch,120)},{passive:true});
  }

  // Lightweight Code Run canvas game.
  const canvas=document.getElementById('gameCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false});
  const game={w:900,h:300,dpr:1,player:null,blocks:[],score:0,running:false,last:0,spawn:0,raf:0,visible:true};

  const fit=()=>{
    game.dpr=dpr();
    game.w=Math.min(900,Math.max(280,canvas.clientWidth||900));
    game.h=300;
    canvas.width=Math.round(game.w*game.dpr);canvas.height=Math.round(game.h*game.dpr);
    ctx.setTransform(game.dpr,0,0,game.dpr,0,0);
  };
  const reset=()=>{game.player={x:60,y:240,w:28,h:28,vy:0,on:true};game.blocks.length=0;game.score=0;game.running=false;game.spawn=0;};
  fit();reset();

  // Cache the static grid so it isn't redrawn every frame.
  let gridCanvas=null,gridCtx=null;
  const buildGrid=()=>{
    gridCanvas=document.createElement('canvas');gridCanvas.width=Math.ceil(game.w);gridCanvas.height=game.h;
    gridCtx=gridCanvas.getContext('2d');gridCtx.fillStyle='#111216';gridCtx.fillRect(0,0,game.w,game.h);
    gridCtx.strokeStyle='rgba(255,255,255,.035)';gridCtx.lineWidth=1;
    for(let x=0;x<game.w;x+=45){gridCtx.beginPath();gridCtx.moveTo(x,0);gridCtx.lineTo(x,game.h);gridCtx.stroke();}
    gridCtx.fillStyle='#b7f397';gridCtx.fillRect(0,268,game.w,2);
  };
  buildGrid();

  const jump=()=>{if(!game.running)game.running=true;if(game.player.on){game.player.vy=-12;game.player.on=false}};
  canvas.addEventListener('pointerdown',jump,{passive:true});
  window.addEventListener('keydown',e=>{if((e.code==='Space'||e.code==='ArrowUp')&&document.visibilityState==='visible'){e.preventDefault();jump();}});

  const draw=()=>{
    ctx.drawImage(gridCanvas,0,0);
    const p=game.player;
    ctx.fillStyle='#b7f397';ctx.fillRect(p.x,p.y,p.w,p.h);
    ctx.fillStyle='#a8c7fa';for(const o of game.blocks)ctx.fillRect(o.x,o.y,o.w,o.h);
    ctx.fillStyle='#fff';ctx.font='700 13px Google Sans';ctx.fillText('CODE RUN  ·  '+Math.floor(game.score),20,30);
    ctx.fillStyle='#8c8d96';ctx.font='12px Google Sans';ctx.fillText('SPACE / TAP TO JUMP',20,50);
  };

  const loop=(t)=>{
    if(document.visibilityState==='hidden'||!game.visible){game.raf=requestAnimationFrame(loop);return;}
    const dt=Math.min(Math.max((t-game.last)/16.67,0),1.75);game.last=t;
    if(game.running){
      const p=game.player;p.vy+=.72*dt;p.y+=p.vy*dt;
      if(p.y>=240){p.y=240;p.vy=0;p.on=true;}
      game.spawn+=dt;
      if(game.spawn>72){game.blocks.push({x:game.w+20,y:242,w:18+Math.random()*30,h:26});game.spawn=0;}
      for(const o of game.blocks)o.x-=5.2*dt;
      game.blocks=game.blocks.filter(o=>o.x>-70);
      game.score+=.085*dt;
      for(const o of game.blocks){
        if(p.x<o.x+o.w&&p.x+p.w>o.x&&p.y<o.y+o.h&&p.y+p.h>o.y){reset();break;}
      }
    }
    draw();game.raf=requestAnimationFrame(loop);
  };

  document.addEventListener('visibilitychange',()=>{game.last=performance.now();});
  window.addEventListener('resize',()=>{clearTimeout(window.__gameResize);window.__gameResize=setTimeout(()=>{fit();buildGrid();draw();},120)},{passive:true});
  draw();game.raf=requestAnimationFrame(loop);
});
