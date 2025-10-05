// ===== PRTLY App JS =====
const $ = (s, sc=document) => sc.querySelector(s);

// Mobile menu
const menuToggle = $('.menu-toggle');
const mobileMenu = $('#mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.classList.contains('btn')) {
      mobileMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Wallet modal placeholder
const walletModal = $('#walletModal');
document.querySelectorAll('[data-open="wallet"]').forEach(btn => {
  btn.addEventListener('click', () => walletModal && walletModal.showModal());
});
const saveBtn = $('#saveContract');
if (saveBtn) {
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = $('#contractInput');
    document.querySelectorAll('#contract,#contractAddr').forEach(el=>{
      el.textContent = (input && input.value) ? input.value : 'COMING_SOON';
    });
    walletModal && walletModal.close();
  });
}

// Hero mesh animation (lightweight)
(function(){
  const cvs = document.getElementById('mesh'); if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let w,h,dpr=Math.max(1,window.devicePixelRatio||1);
  const N=44, MAX=140, SPEED=.18; let pts=[];
  function size(){ const r=cvs.getBoundingClientRect(); w=r.width; h=r.height;
    cvs.width=Math.floor(w*dpr); cvs.height=Math.floor(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }
  const rnd=(a,b)=>Math.random()*(b-a)+a;
  function init(){ size(); pts=Array.from({length:N},()=>({x:rnd(0,w),y:rnd(0,h),vx:rnd(-SPEED,SPEED),vy:rnd(-SPEED,SPEED)})); raf=requestAnimationFrame(loop); }
  function step(p){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i], b=pts[j], d=Math.hypot(a.x-b.x, a.y-b.y);
        if(d<MAX){
          const o=1-d/MAX;
          const g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
          g.addColorStop(0, `rgba(0,194,255,${0.45*o})`);
          g.addColorStop(1, `rgba(122,60,255,${0.45*o})`);
          ctx.strokeStyle=g; ctx.lineWidth=1.15;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
  }
  let raf; function loop(){ pts.forEach(step); draw(); raf=requestAnimationFrame(loop); }
  const io=new IntersectionObserver((en)=>{ if(en[0].isIntersecting){ if(!raf) init(); } else { cancelAnimationFrame(raf); raf=null; } },{threshold:.1});
  io.observe(cvs);
  window.addEventListener('resize', ()=>{ cancelAnimationFrame(raf); raf=null; setTimeout(()=>io.observe(cvs),200) }, {passive:true});
})();

// Fake blog cards on blog page
(function(){
  const grid = $('#blogGrid'); if(!grid) return;
  const posts = [
    { t:'Introducing PRTLY', d:'Oct 2025', x:'Our mission to fight deepfakes with AI + blockchain.', u:'#' },
    { t:'How Proofs Work', d:'Oct 2025', x:'Fingerprinting, on-chain proofs, and privacy-first design.', u:'#' },
    { t:'Roadmap 2025–2028', d:'Oct 2025', x:'Launch, prototype, marketplace, global scale.', u:'#' }
  ];
  grid.innerHTML = posts.map(p => `
    <article class="card">
      <h3>${p.t}</h3>
      <p><small>${p.d}</small></p>
      <p>${p.x}</p>
      <p><a class="btn btn-small btn-ghost" href="${p.u}">Read</a></p>
    </article>
  `).join('');
})();
