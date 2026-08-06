/* NEXT Freight – design mockup generator.
   Writes self-contained HTML files + a render manifest. Rendered to PNG by render.sh */
const fs = require('fs');
const path = require('path');
const NMARK = require('./nmark'); // real NEXT "N" logo mark (black + orange), data URI

const OUT = path.resolve(__dirname, '..');
const manifest = [];

/* ---------- design system ---------- */
const C = {
  ink: '#151210', primary: '#EA5B0C', primaryD: '#B4470A', primaryL: '#FDECDF',
  accent: '#F59E0B', accentD: '#B9770C', danger: '#EF4444', warn: '#F59E0B',
  bg: '#F6F4F1', card: '#FFFFFF', line: '#EAE6E1', text: '#1A1510',
  muted: '#6E655D', sky: '#38BDF8', slate: '#0B1220'
};

const base = `
*{box-sizing:border-box;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
html,body{margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Inter,system-ui,sans-serif;color:${C.text};background:${C.bg}}
:root{--p:${C.primary};--pd:${C.primaryD};--ac:${C.accent};--muted:${C.muted};--line:${C.line}}
.mono{font-variant-numeric:tabular-nums}
`;

/* device frames */
function phone(inner, {dark=false, bg=null}={}) {
  const background = bg || (dark ? `linear-gradient(160deg,#0F0C09 0%,#1C1712 55%,#C0480A 130%)` : C.bg);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  .scr{width:430px;height:932px;overflow:hidden;position:relative;background:${background};display:flex;flex-direction:column}
  .sb{height:54px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 28px 8px;font-weight:600;font-size:16px;color:${dark?'#fff':C.text}}
  .sb .ic{display:flex;gap:6px;align-items:center}
  .home{position:absolute;bottom:9px;left:50%;transform:translateX(-50%);width:140px;height:5px;border-radius:5px;background:${dark?'rgba(255,255,255,.55)':'rgba(15,23,42,.35)'}}
  .body{flex:1;display:flex;flex-direction:column;min-height:0}
  </style></head><body><div class="scr">
    <div class="sb"><div>9:41</div><div class="ic">${signalSvg(dark)}${wifiSvg(dark)}${battSvg(dark)}</div></div>
    <div class="body">${inner}</div>
    <div class="home"></div>
  </div></body></html>`;
}
function desktop(inner) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  .win{width:1440px;height:900px;overflow:hidden;background:${C.bg};display:flex}
  </style></head><body><div class="win">${inner}</div></body></html>`;
}

/* tiny svg helpers */
const signalSvg=(d)=>`<svg width="20" height="14" viewBox="0 0 20 14"><g fill="${d?'#fff':C.text}"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="14" rx="1"/></g></svg>`;
const wifiSvg=(d)=>`<svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M9 12.5l0 0M2 6.5a10 10 0 0114 0M4.6 9a6.2 6.2 0 018.8 0" stroke="${d?'#fff':C.text}" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="12.2" r="1.2" fill="${d?'#fff':C.text}"/></svg>`;
const battSvg=(d)=>`<svg width="26" height="14" viewBox="0 0 26 14"><rect x="1" y="1" width="21" height="12" rx="3.5" fill="none" stroke="${d?'rgba(255,255,255,.5)':'rgba(15,23,42,.4)'}"/><rect x="3" y="3" width="15" height="8" rx="1.6" fill="${d?'#fff':C.text}"/><rect x="23.5" y="4.5" width="2" height="5" rx="1" fill="${d?'rgba(255,255,255,.5)':'rgba(15,23,42,.4)'}"/></svg>`;

function ic(name,color=C.text,size=24){
  const s=`width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"`;
  const P={
    truck:`<path d="M3 6h11v9H3zM14 9h3.5L21 12v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>`,
    pin:`<path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>`,
    home:`<path d="M4 11l8-6 8 6v9H4z"/><path d="M10 20v-6h4v6"/>`,
    box:`<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>`,
    wallet:`<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M16 12h3"/>`,
    user:`<circle cx="12" cy="8" r="3.4"/><path d="M5 20c1.5-4 12-4 14 0"/>`,
    bell:`<path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/>`,
    chat:`<path d="M4 5h16v11H9l-4 3z"/>`,
    star:`<path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.3l1-5.9L3.5 9.2l5.9-.8z" fill="${color}" stroke="none"/>`,
    clock:`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`,
    check:`<path d="M4 12.5l5 5 11-11"/>`,
    arrow:`<path d="M5 12h14M13 6l6 6-6 6"/>`,
    weight:`<circle cx="12" cy="6" r="2.2"/><path d="M8 8h8l2.5 11H5.5z"/>`,
    route:`<circle cx="6" cy="6" r="2.3"/><circle cx="18" cy="18" r="2.3"/><path d="M6 9v3a4 4 0 004 4h4"/>`,
    nav:`<path d="M3 11l18-7-7 18-2-8z"/>`,
    shield:`<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>`,
    grid:`<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
    map:`<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>`,
    money:`<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9.5 9.5c0-1 1.1-1.6 2.5-1.6s2.5.6 2.5 1.7c0 2.6-5 1.4-5 4 0 1.1 1.1 1.7 2.5 1.7s2.5-.6 2.5-1.6"/>`,
    gauge:`<path d="M4 15a8 8 0 1116 0"/><path d="M12 15l4-4"/>`,
    doc:`<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h6M10 16h6"/>`,
    camera:`<path d="M4 8h4l2-2h4l2 2h4v11H4z"/><circle cx="12" cy="13" r="3.3"/>`,
    power:`<path d="M12 4v7"/><path d="M7 7a7 7 0 1010 0"/>`,
    plus:`<path d="M12 5v14M5 12h14"/>`,
    filter:`<path d="M4 6h16M7 12h10M10 18h4"/>`,
    search:`<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>`,
    phone:`<path d="M5 4h3.5l1.8 4.5-2.2 1.4a11 11 0 004.9 4.9l1.4-2.2L18.9 15.5V19a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>`,
    building:`<rect x="5" y="3" width="14" height="18" rx="1.6"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h6"/>`,
    edit:`<path d="M4 20h4L18.5 9.5l-4-4L4 16z"/><path d="M13 5.5l4 4"/>`,
    globe:`<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17"/>`,
  };
  return `<svg ${s}>${P[name]||''}</svg>`;
}

/* stylised map */
function mapSvg(w,h,{dark=false,route=true}={}) {
  const land=dark?'#241608':'#EEEBE7', road=dark?'#2A2016':'#FFFFFF', road2=dark?'#241C12':'#E0DAD2';
  let streets='';
  for(let i=1;i<7;i++){const y=h*i/7; streets+=`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${road2}" stroke-width="10"/>`;}
  for(let i=1;i<5;i++){const x=w*i/5; streets+=`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${road2}" stroke-width="10"/>`;}
  const rx1=w*.18,ry1=h*.24,rx2=w*.7,ry2=h*.72;
  const routeP=route?`
    <path d="M${rx1} ${ry1} C ${w*.5} ${h*.2}, ${w*.45} ${h*.55}, ${rx2} ${ry2}" stroke="${C.primary}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="${rx1}" cy="${ry1}" r="10" fill="#fff" stroke="${C.primary}" stroke-width="4"/>
    <g transform="translate(${rx2-13},${ry2-30})">${pinShape(C.accent)}</g>`:'';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="display:block">
    <rect width="${w}" height="${h}" fill="${land}"/>
    <rect x="${w*.55}" y="${h*.05}" width="${w*.5}" height="${h*.3}" rx="20" fill="${dark?'#221A10':'#EAE4DC'}"/>
    ${streets}
    <line x1="0" y1="${h*.5}" x2="${w}" y2="${h*.42}" stroke="${road}" stroke-width="16"/>
    <line x1="${w*.32}" y1="0" x2="${w*.4}" y2="${h}" stroke="${road}" stroke-width="16"/>
    ${routeP}
  </svg>`;
}
const pinShape=(f)=>`<svg width="26" height="34" viewBox="0 0 26 34"><path d="M13 0C6 0 .5 5.4.5 12.2.5 21 13 34 13 34s12.5-13 12.5-21.8C25.5 5.4 20 0 13 0z" fill="${f}"/><circle cx="13" cy="12" r="5" fill="#fff"/></svg>`;

/* ui atoms */
const chip=(t,{bg=C.primaryL,c=C.primaryD}={})=>`<span style="display:inline-flex;align-items:center;gap:6px;background:${bg};color:${c};font-weight:700;font-size:13px;padding:6px 12px;border-radius:999px">${t}</span>`;
const card=(inner,extra='')=>`<div style="background:${C.card};border:1px solid ${C.line};border-radius:20px;box-shadow:0 8px 24px rgba(21,18,16,.05);${extra}">${inner}</div>`;
const money=(v,cur='IQD')=>`<span class="mono">${v.toLocaleString('en-US')}</span> <span style="font-size:.62em;color:${C.muted};font-weight:700">${cur}</span>`;

/* language selector pill for auth / onboarding headers */
const langPill=(dark=false)=>`<div style="display:inline-flex;align-items:center;gap:7px;padding:8px 13px;border-radius:999px;background:${dark?'rgba(255,255,255,.14)':'#fff'};border:1.5px solid ${dark?'rgba(255,255,255,.28)':C.line};font-weight:800;font-size:13.5px;color:${dark?'#fff':C.text}">${ic('globe',dark?'#fff':C.primary,18)} AR <span style="opacity:.55;font-size:11px">▾</span></div>`;

/* brand mark — the real NEXT "N" logo (black stroke + orange diagonal) */
function brandMark(size=30){
  return `<img src="${NMARK}" alt="NEXT" style="height:${Math.round(size*0.92)}px;width:auto;display:block"/>`;
}

function tabbar(active){
  const items=[['home','Home'],['box','Orders'],['chat','Chat'],['wallet','Wallet'],['user','Profile']];
  return `<div style="display:flex;justify-content:space-around;align-items:center;padding:12px 8px 26px;background:#fff;border-top:1px solid ${C.line}">
    ${items.map(([k,l])=>{const on=k===active;return `<div style="display:flex;flex-direction:column;align-items:center;gap:5px">${ic(k,on?C.primary:'#9AA6A0',24)}<span style="font-size:11px;font-weight:${on?800:600};color:${on?C.primary:'#9AA6A0'}">${l}</span></div>`;}).join('')}
  </div>`;
}
function add(name,w,h,scale,html){
  const file=path.join(OUT,name+'.html');
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,html);
  manifest.push({file:file.replace(OUT+'/',''),w,h,scale,out:name+'.png'});
}

/* ============================================================= CLIENT */

// 01 Onboarding hero
add('client/01-onboarding',430,932,3, phone(`
  <div style="flex:1;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:0 30px 40px">
    <div style="position:absolute;top:-40px;right:-80px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#F7902E 0,rgba(234,91,12,0) 70%);opacity:.5"></div>
    <div style="position:absolute;top:70px;left:30px;display:flex;align-items:center;gap:12px">
      <div style="width:52px;height:52px;border-radius:15px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(32)}</div>
      <div style="color:#fff;font-weight:800;font-size:22px;letter-spacing:.5px">NEXT<span style="color:${C.accent}"> Freight</span></div>
    </div>
    <div style="position:absolute;top:76px;right:30px">${langPill(true)}</div>
    <div style="position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);width:280px;height:280px">
      <div style="width:100%;height:100%;border-radius:56px;background:#fff;box-shadow:0 30px 60px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center">${brandMark(190)}</div>
    </div>
    <h1 style="color:#fff;font-size:38px;line-height:1.12;font-weight:800;margin:0 0 14px">Move anything,<br>across any border.</h1>
    <p style="color:rgba(255,255,255,.72);font-size:17px;line-height:1.5;margin:0 0 30px">Request a truck in seconds. Transparent pricing, live tracking, and secure payments — from Baghdad to anywhere.</p>
    <button style="border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:18px;padding:19px;border-radius:16px;box-shadow:0 12px 26px rgba(245,165,36,.4)">Get started &nbsp;→</button>
    <div style="text-align:center;color:rgba(255,255,255,.7);font-size:15px;margin-top:18px;font-weight:600">I already have an account</div>
  </div>`, {dark:true}));

// 01a Auth – phone entry
add('client/01a-auth-phone',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px"><div style="font-size:26px;color:${C.text}">‹</div>${langPill()}</div>
    <div style="margin-top:26px;width:60px;height:60px;border-radius:18px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('phone',C.primary,30)}</div>
    <h1 style="font-size:29px;font-weight:800;line-height:1.2;margin:22px 0 10px">Enter your phone number</h1>
    <p style="color:${C.muted};font-size:16px;line-height:1.5;margin:0 0 26px">We'll send you a one-time code by SMS to verify it's you.</p>
    <div style="display:flex;gap:10px">
      <div style="display:flex;align-items:center;gap:8px;padding:0 14px;height:60px;border:1.5px solid ${C.line};border-radius:16px;background:#fff;font-weight:700;font-size:16px">🇮🇶 +964 <span style="color:${C.muted};font-size:13px">▾</span></div>
      <div style="flex:1;display:flex;align-items:center;padding:0 16px;height:60px;border:1.5px solid ${C.primary};border-radius:16px;background:#fff;font-weight:700;font-size:18px;letter-spacing:.5px">770 123 4567</div>
    </div>
    <div style="color:${C.muted};font-size:13px;margin-top:10px">Iraqi mobile numbers start with 7 · 10 digits</div>
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Send code &nbsp;→</button>
    <p style="text-align:center;color:${C.muted};font-size:12.5px;line-height:1.5;margin:16px 4px 0">By continuing you agree to the <b style="color:${C.text}">Terms of Service</b> and <b style="color:${C.text}">Privacy Policy</b>.</p>
  </div>`));

// 01b Auth – OTP verify
add('client/01b-auth-otp',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <h1 style="font-size:29px;font-weight:800;line-height:1.2;margin:26px 0 10px">Verify your number</h1>
    <p style="color:${C.muted};font-size:16px;line-height:1.5;margin:0 0 30px">Enter the 6-digit code sent to<br><b style="color:${C.text}">+964 770 ••• 4567</b> &nbsp;<span style="color:${C.primary};font-weight:700">Change</span></p>
    <div style="display:flex;gap:10px;justify-content:space-between">
      ${['4','1','9','','',''].map((d,i)=>`<div style="flex:1;aspect-ratio:1;max-width:52px;display:flex;align-items:center;justify-content:center;border:1.5px solid ${d?C.primary:(i===3?C.ink:C.line)};border-radius:14px;background:#fff;font-weight:800;font-size:26px;color:${C.text}">${d||(i===3?'<span style=\"width:2px;height:26px;background:'+C.ink+'\"></span>':'')}</div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:24px;color:${C.muted};font-size:15px">${ic('clock',C.muted,18)} Resend code in <b style="color:${C.text}">1:52</b></div>
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Verify</button>
  </div>`));

// 01c Auth – account type + profile
add('client/01c-auth-account',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <h1 style="font-size:29px;font-weight:800;line-height:1.2;margin:22px 0 8px">Set up your account</h1>
    <p style="color:${C.muted};font-size:16px;line-height:1.5;margin:0 0 22px">Tell us who you're shipping as.</p>
    <div style="font-weight:800;font-size:15px;margin-bottom:12px">Account type</div>
    <div style="display:flex;gap:12px;margin-bottom:24px">
      <div style="flex:1;padding:18px;border-radius:18px;border:1.5px solid ${C.primary};background:${C.primaryL}">
        ${ic('user',C.primaryD,28)}<div style="font-weight:800;font-size:16px;margin-top:10px;color:${C.primaryD}">Individual</div><div style="font-size:12.5px;color:${C.primaryD};opacity:.8">Personal shipments</div>
      </div>
      <div style="flex:1;padding:18px;border-radius:18px;border:1.5px solid ${C.line};background:#fff">
        ${ic('building',C.text,28)}<div style="font-weight:800;font-size:16px;margin-top:10px">Company</div><div style="font-size:12.5px;color:${C.muted}">Business & invoicing</div>
      </div>
    </div>
    <div style="font-weight:800;font-size:15px;margin-bottom:10px">Full name</div>
    <div style="display:flex;align-items:center;padding:0 16px;height:58px;border:1.5px solid ${C.line};border-radius:16px;background:#fff;font-weight:700;font-size:17px">Yousef Al-Rawi</div>
    <div style="margin-top:20px;padding:16px;border-radius:16px;background:${C.primaryL};display:flex;gap:12px;align-items:center">
      ${ic('shield',C.primaryD,24)}<div style="font-size:13.5px;color:${C.primaryD};line-height:1.45"><b>Free plan</b> to start. Upgrade to Plus or Business anytime for discounts and priority dispatch.</div>
    </div>
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Create account</button>
  </div>`));

// 01d Plan selection
add('client/01d-plan',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 22px 30px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <h1 style="font-size:27px;font-weight:800;line-height:1.2;margin:16px 0 6px">Pick a plan</h1>
    <p style="color:${C.muted};font-size:15px;line-height:1.5;margin:0 0 18px">Start free. Upgrade anytime for discounts and priority dispatch.</p>
    <div style="flex:1;overflow:hidden">
      ${[
        ['Free','0','Pay-as-you-go',['Standard dispatch','Live tracking & chat','Card, wallet payments'],false,'#fff',C.line],
        ['Plus','120,000','Best for regular shippers',['5% off every shipment','Priority dispatch','Saved addresses & templates'],true,C.ink,C.ink],
        ['Business','390,000','Teams & companies',['10% off + volume rates','Sub-users & invoicing','Dedicated support'],false,'#fff',C.line],
      ].map(([n,p,d,feats,on,bg,bd])=>`
        <div style="padding:18px;border-radius:20px;margin-bottom:12px;background:${bg};border:1.5px solid ${bd};position:relative">
          ${on?`<div style="position:absolute;top:-1px;right:16px;transform:translateY(-50%);background:${C.accent};color:#20160a;font-weight:800;font-size:11px;padding:4px 10px;border-radius:999px">POPULAR</div>`:''}
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <div style="font-weight:800;font-size:19px;color:${on?'#fff':C.text}">${n}</div>
            <div style="font-weight:800;font-size:18px;color:${on?'#fff':C.text}">${p==='0'?'Free':`<span class="mono">${p}</span> <span style="font-size:.6em;color:${on?'rgba(255,255,255,.6)':C.muted}">IQD/mo</span>`}</div>
          </div>
          <div style="color:${on?'rgba(255,255,255,.65)':C.muted};font-size:13px;font-weight:600;margin:2px 0 12px">${d}</div>
          ${feats.map(f=>`<div style="display:flex;gap:9px;align-items:center;padding:4px 0"><div style="width:20px;height:20px;border-radius:50%;background:${on?'rgba(234,91,12,.25)':C.primaryL};display:flex;align-items:center;justify-content:center">${ic('check',on?C.accent:C.primary,14)}</div><span style="font-size:13.5px;font-weight:600;color:${on?'#fff':C.text}">${f}</span></div>`).join('')}
        </div>`).join('')}
    </div>
    <button style="border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:18px;padding:18px;border-radius:15px">Continue with Plus</button>
    <div style="text-align:center;color:${C.muted};font-size:14px;margin-top:12px;font-weight:700">Skip — stay on Free</div>
  </div>`));

// 01e Company registration
add('client/01e-company',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 22px 30px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <h1 style="font-size:27px;font-weight:800;line-height:1.2;margin:16px 0 6px">Company details</h1>
    <p style="color:${C.muted};font-size:15px;line-height:1.5;margin:0 0 20px">Used for invoicing and tax on your shipments.</p>
    <div style="flex:1;overflow:hidden">
      ${[['Company name','Al-Rafidain Trading Co.'],['Tax / VAT number','IQ-4402188'],['Business address','Al-Mansour, Baghdad'],['Billing email','billing@rafidain.iq']].map(([l,v])=>`
        <div style="margin-bottom:16px">
          <div style="font-weight:800;font-size:13.5px;color:${C.muted};margin-bottom:7px">${l.toUpperCase()}</div>
          <div style="display:flex;align-items:center;padding:0 16px;height:54px;border:1.5px solid ${C.line};border-radius:14px;background:#fff;font-weight:700;font-size:16px">${v}</div>
        </div>`).join('')}
      <div style="padding:15px;border-radius:14px;background:${C.primaryL};display:flex;gap:11px;align-items:center">
        ${ic('user',C.primaryD,22)}<div style="font-size:13px;color:${C.primaryD};line-height:1.4;font-weight:600">You'll be the <b>Company Admin</b>. Add requesters and manage billing later in Profile.</div>
      </div>
    </div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:18px;border-radius:15px">Save & continue</button>
  </div>`));

// 02 Home
add('client/02-home',430,932,3, phone(`
  <div style="flex:1;overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:6px 22px 18px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="color:${C.muted};font-size:14px;font-weight:600">Good morning</div><div style="font-size:22px;font-weight:800">Yousef 👋</div></div>
      <div style="position:relative;width:46px;height:46px;border-radius:14px;background:#fff;border:1px solid ${C.line};display:flex;align-items:center;justify-content:center">${ic('bell',C.text,22)}<span style="position:absolute;top:9px;right:11px;width:9px;height:9px;background:${C.danger};border-radius:50%;border:2px solid #fff"></span></div>
    </div>
    <div style="padding:0 22px 20px">
      ${card(`<div style="padding:22px;background:linear-gradient(135deg,#C0480A,#F7902E);border:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="color:rgba(255,255,255,.8);font-size:14px;font-weight:600">Need a truck?</div><div style="color:#fff;font-size:23px;font-weight:800;margin-top:2px">Request a shipment</div></div>
          <div style="width:56px;height:56px;border-radius:16px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center">${ic('plus','#fff',30)}</div>
        </div></div>`,'overflow:hidden')}
    </div>
    <div style="padding:0 22px 12px;display:flex;justify-content:space-between;align-items:baseline"><div style="font-weight:800;font-size:18px">Choose a vehicle</div><div style="color:${C.primary};font-weight:700;font-size:14px">See all</div></div>
    <div style="display:flex;gap:12px;padding:0 22px 22px;overflow:hidden">
      ${[['Box truck','3.5 t',true],['Flatbed','10 t',false],['Reefer','5 t',false]].map(([n,c,on])=>`
        <div style="min-width:120px;flex:1;padding:16px;border-radius:18px;background:${on?C.ink:'#fff'};border:1px solid ${on?C.ink:C.line}">
          ${ic('truck',on?C.accent:C.primary,30)}
          <div style="font-weight:800;font-size:15px;margin-top:12px;color:${on?'#fff':C.text}">${n}</div>
          <div style="font-size:13px;color:${on?'rgba(255,255,255,.6)':C.muted};font-weight:600">up to ${c}</div>
        </div>`).join('')}
    </div>
    <div style="padding:0 22px 10px;font-weight:800;font-size:18px">Active shipment</div>
    <div style="padding:0 22px">
      ${card(`<div style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-weight:800;font-size:15px">Order #NF-20418</div>${chip('● In transit',{bg:'#FFF4E0',c:C.accentD})}
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start">
          <div style="display:flex;flex-direction:column;align-items:center;padding-top:4px">
            <div style="width:11px;height:11px;border-radius:50%;background:${C.primary}"></div>
            <div style="width:2px;height:34px;background:${C.line}"></div>
            <div style="width:11px;height:11px;border-radius:50%;border:2px solid ${C.accent}"></div>
          </div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:15px">Al-Karrada, Baghdad</div>
            <div style="color:${C.muted};font-size:13px;margin-bottom:12px">Pickup · 09:20</div>
            <div style="font-weight:700;font-size:15px">Erbil Industrial Zone</div>
            <div style="color:${C.muted};font-size:13px">Drop-off · ETA 14:10</div>
          </div>
          <div style="text-align:right"><div style="font-weight:800;font-size:16px">${money(485000)}</div><div style="color:${C.primary};font-weight:700;font-size:13px;margin-top:24px">Track →</div></div>
        </div></div>`)}
    </div>
    <div style="flex:1"></div>
    ${tabbar('home')}
  </div>`));

// 03 Order wizard – capacity guard
add('client/03-order-wizard',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 8px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">New shipment</div></div>
    <div style="padding:6px 22px 20px"><div style="display:flex;gap:6px">${[1,2,3,4,5,6,7].map(i=>`<div style="flex:1;height:6px;border-radius:6px;background:${i<=5?C.primary:C.line}"></div>`).join('')}</div><div style="color:${C.muted};font-size:13px;font-weight:600;margin-top:8px">Step 5 of 7 · Cargo details</div></div>
    <div style="padding:0 22px;flex:1;overflow:hidden">
      <div style="font-weight:800;font-size:16px;margin-bottom:10px">Cargo type</div>
      <div style="display:flex;gap:10px;margin-bottom:18px">
        ${['General','Palletised','Fragile'].map((t,i)=>`<div style="flex:1;text-align:center;padding:13px 0;border-radius:14px;font-weight:700;font-size:14px;background:${i==1?C.primaryL:'#fff'};color:${i==1?C.primaryD:C.text};border:1px solid ${i==1?C.primary:C.line}">${t}</div>`).join('')}
      </div>
      <div style="font-weight:800;font-size:16px;margin-bottom:10px">Weight</div>
      ${card(`<div style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:34px;font-weight:800">12,400 <span style="font-size:18px;color:${C.muted}">kg</span></div>${ic('weight',C.danger,28)}</div>
        <div style="margin-top:14px;height:8px;border-radius:8px;background:#F1E1E1;overflow:hidden"><div style="width:100%;height:100%;background:${C.danger}"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:${C.muted};font-weight:600;margin-top:8px"><span>0</span><span>Box truck capacity · 3,500 kg</span></div>
      </div>`,'border-color:'+C.danger)}
      <div style="margin-top:16px;padding:16px;border-radius:16px;background:#FEECEC;border:1px solid #F7C7C7;display:flex;gap:12px">
        <div style="flex-shrink:0">${ic('weight',C.danger,24)}</div>
        <div><div style="font-weight:800;font-size:15px;color:#B42318">Exceeds vehicle capacity</div><div style="font-size:13.5px;color:#8a3a34;line-height:1.45;margin-top:2px">Your cargo is 8,900 kg over the selected truck. Choose a larger vehicle to continue.</div></div>
      </div>
      <button style="width:100%;margin-top:16px;border:0;background:${C.ink};color:#fff;font-weight:800;font-size:16px;padding:16px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:10px">${ic('truck',C.accent,22)} Choose a bigger truck</button>
    </div>
    <div style="padding:16px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <button style="width:100%;border:0;background:#E7EAE8;color:#9AA6A0;font-weight:800;font-size:17px;padding:18px;border-radius:15px">Continue</button>
    </div>
  </div>`));

// 04 Quote / price breakdown
add('client/04-quote',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 10px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">Price summary</div></div>
    <div style="padding:0 22px 14px">
      ${card(`<div style="padding:20px;background:linear-gradient(135deg,#C0480A,#F7902E);border:0;color:#fff">
        <div style="font-size:14px;opacity:.85;font-weight:600">Total (settlement in IQD)</div>
        <div style="font-size:42px;font-weight:800;margin:2px 0 6px">485,000 <span style="font-size:20px;opacity:.8">IQD</span></div>
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.18);padding:7px 12px;border-radius:999px;font-weight:700;font-size:13px">${ic('clock','#fff',16)} Quote locked · 14:22 left</div>
      </div>`,'overflow:hidden')}
    </div>
    <div style="padding:0 22px;flex:1;overflow:hidden">
      ${card(`<div style="padding:6px 18px">
        ${[['Base fare','120,000'],['Distance · 355 km','232,000'],['Box-truck multiplier','×1.15'],['Night surcharge','18,000'],['1 extra stop','15,000'],['Cargo insurance 0.5%','9,000']].map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;padding:13px 0;${i?'border-top:1px solid '+C.line:''}"><span style="color:${C.text};font-size:14.5px">${a}</span><span class="mono" style="font-weight:700;font-size:14.5px">${b}</span></div>`).join('')}
        <div style="display:flex;justify-content:space-between;padding:13px 0;border-top:1px solid ${C.line}"><span style="color:${C.primary};font-weight:700;font-size:14.5px">Plus plan discount</span><span class="mono" style="font-weight:700;font-size:14.5px;color:${C.primary}">−24,000</span></div>
        <div style="display:flex;justify-content:space-between;padding:13px 0;border-top:1px solid ${C.line}"><span style="color:${C.muted};font-size:14.5px">VAT (0%)</span><span class="mono" style="font-weight:700;font-size:14.5px;color:${C.muted}">0</span></div>
      </div>`)}
      <div style="display:flex;gap:10px;margin-top:14px">
        <div style="flex:1;padding:14px;border-radius:14px;background:#fff;border:1px solid ${C.line};text-align:center"><div style="color:${C.muted};font-size:12px;font-weight:600">Distance</div><div style="font-weight:800;font-size:16px">355 km</div></div>
        <div style="flex:1;padding:14px;border-radius:14px;background:#fff;border:1px solid ${C.line};text-align:center"><div style="color:${C.muted};font-size:12px;font-weight:600">Est. time</div><div style="font-weight:800;font-size:16px">4h 50m</div></div>
        <div style="flex:1;padding:14px;border-radius:14px;background:#fff;border:1px solid ${C.line};text-align:center"><div style="color:${C.muted};font-size:12px;font-weight:600">Stops</div><div style="font-weight:800;font-size:16px">2</div></div>
      </div>
    </div>
    <div style="padding:16px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <button style="width:100%;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:18px;padding:18px;border-radius:15px">Continue to payment →</button>
    </div>
  </div>`));

// 05 Live tracking
add('client/05-tracking',430,932,3, phone(`
  <div style="flex:1;position:relative;display:flex;flex-direction:column">
    <div style="position:absolute;inset:0">${mapSvg(430,560,{route:true})}</div>
    <div style="position:relative;padding:6px 22px;display:flex;justify-content:space-between;align-items:center">
      <div style="width:44px;height:44px;border-radius:13px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;font-size:24px">‹</div>
      ${chip('● Live · In transit',{bg:'#fff',c:C.accentD})}
      <div style="width:44px;height:44px;border-radius:13px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center">${ic('nav',C.primary,22)}</div>
    </div>
    <div style="flex:1"></div>
    <div style="position:relative;background:#fff;border-radius:28px 28px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.08);padding:10px 22px 28px">
      <div style="width:44px;height:5px;border-radius:5px;background:${C.line};margin:0 auto 16px"></div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
        <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#C0480A,#F7902E);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:20px">KA</div>
        <div style="flex:1"><div style="font-weight:800;font-size:17px">Karim A.</div><div style="display:flex;align-items:center;gap:6px;color:${C.muted};font-size:13px;font-weight:600">${ic('star',C.accent,14)} 4.9 · Volvo FH · <span class="mono">21 A 4482</span></div></div>
        <div style="width:48px;height:48px;border-radius:14px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('chat',C.primaryD,22)}</div>
        <div style="width:48px;height:48px;border-radius:14px;background:${C.ink};display:flex;align-items:center;justify-content:center">${ic('bell','#fff',22)}</div>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:16px">
        <div style="flex:1;padding:12px;border-radius:14px;background:${C.bg};text-align:center"><div style="color:${C.muted};font-size:12px;font-weight:600">ETA</div><div style="font-weight:800;font-size:17px">14:10</div></div>
        <div style="flex:1;padding:12px;border-radius:14px;background:${C.bg};text-align:center"><div style="color:${C.muted};font-size:12px;font-weight:600">Remaining</div><div style="font-weight:800;font-size:17px">148 km</div></div>
        <div style="flex:1;padding:12px;border-radius:14px;background:${C.bg};text-align:center"><div style="color:${C.muted};font-size:12px;font-weight:600">Status</div><div style="font-weight:800;font-size:17px;color:${C.primary}">On time</div></div>
      </div>
      <button style="width:100%;border:1px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:15px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:10px">${ic('route',C.primary,20)} Share tracking link</button>
    </div>
  </div>`));

// 06 Payment methods
add('client/06-payment',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 14px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">Payment</div></div>
    <div style="padding:0 22px;flex:1;overflow:hidden">
      <div style="font-weight:800;font-size:16px;margin-bottom:12px">Choose how to pay</div>
      ${[['wallet','NEXT Wallet','Balance 620,000 IQD',true],['money','Credit / debit card','HyperPay secure checkout',false],['box','Cash on delivery','Unavailable in Iraq',false]].map(([k,t,s,on])=>`
        <div style="display:flex;align-items:center;gap:14px;padding:16px;border-radius:16px;margin-bottom:12px;background:${on?C.primaryL:'#fff'};border:1.5px solid ${on?C.primary:C.line};${k==='box'?'opacity:.5':''}">
          <div style="width:46px;height:46px;border-radius:12px;background:#fff;border:1px solid ${C.line};display:flex;align-items:center;justify-content:center">${ic(k,C.primaryD,24)}</div>
          <div style="flex:1"><div style="font-weight:800;font-size:15px">${t}</div><div style="color:${C.muted};font-size:13px;font-weight:600">${s}</div></div>
          <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${on?C.primary:C.line};display:flex;align-items:center;justify-content:center">${on?`<div style="width:12px;height:12px;border-radius:50%;background:${C.primary}"></div>`:''}</div>
        </div>`).join('')}
      <div style="margin-top:8px;padding:16px;border-radius:16px;background:${C.bg};display:flex;gap:12px">
        <div>${ic('shield',C.primary,24)}</div>
        <div style="font-size:13px;color:${C.muted};line-height:1.45;font-weight:600">Your payment is held in escrow and released to the carrier only after delivery is confirmed.</div>
      </div>
      <label style="display:flex;gap:12px;margin-top:16px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:7px;background:${C.primary};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('check','#fff',16)}</div><span style="font-size:13.5px;color:${C.text};line-height:1.45">I agree to the cancellation policy. A fee may apply after a driver is assigned.</span></label>
    </div>
    <div style="padding:16px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:${C.muted};font-weight:600">Total</span><span style="font-weight:800;font-size:18px">${money(485000)}</span></div>
      <button style="width:100%;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:18px;padding:18px;border-radius:15px">Pay & find a truck</button>
    </div>
  </div>`));

// 07 Orders list (active / history)
add('client/07-orders',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:6px 22px 12px"><div style="font-size:22px;font-weight:800">My orders</div></div>
    <div style="padding:0 22px 14px;display:flex;gap:8px">${['Active','History'].map((t,i)=>`<div style="flex:1;text-align:center;padding:11px 0;border-radius:12px;font-weight:800;font-size:14px;background:${i==0?C.ink:'#fff'};color:${i==0?'#fff':C.muted};border:1px solid ${i==0?C.ink:C.line}">${t}</div>`).join('')}</div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      ${[
        ['#NF-20418','In transit','#FFF4E0',C.accentD,'Baghdad → Erbil','Today · ETA 14:10','485,000'],
        ['#NF-20390','Driver assigned','#E6F7F0',C.primaryD,'Basra → Baghdad','Tomorrow · 08:00','612,000'],
        ['#NF-20355','Searching','#EEF2FF','#4F46E5','Najaf → Karbala','Today · ASAP','198,000'],
      ].map(([id,st,bg,c,route,when,amt])=>`
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:16px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="font-weight:800;font-size:15px">${id}</div>${chip('● '+st,{bg,c})}</div>
          <div style="display:flex;align-items:center;gap:8px;color:${C.text};font-weight:700;font-size:15px;margin-bottom:4px">${ic('route',C.primary,18)} ${route}</div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="color:${C.muted};font-size:13px;font-weight:600">${when}</span><span style="font-weight:800;font-size:15px">${money(parseInt(amt.replace(/,/g,'')))}</span></div>
        </div>`).join('')}
    </div>
    ${tabbar('box')}
  </div>`));

// 08 Order detail + receipt
add('client/08-order-detail',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:18px">Order #NF-20301</div></div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">${chip('✓ Delivered',{bg:C.primaryL,c:C.primaryD})}<span style="color:${C.muted};font-size:13px;font-weight:600">28 Jul · 15:42</span></div>
      ${card(`<div style="padding:16px">
        ${[['Order placed','09:02',true],['Driver assigned · Omar K.','09:14',true],['Picked up · Baghdad','09:50',true],['Delivered · Erbil','15:42',true]].map(([a,b],i,arr)=>`
          <div style="display:flex;gap:12px">
            <div style="display:flex;flex-direction:column;align-items:center"><div style="width:12px;height:12px;border-radius:50%;background:${C.primary}"></div>${i<arr.length-1?`<div style="width:2px;flex:1;background:${C.primary}"></div>`:''}</div>
            <div style="padding-bottom:${i<arr.length-1?'16px':'0'}"><div style="font-weight:700;font-size:14.5px">${a}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${b}</div></div>
          </div>`).join('')}
      </div>`)}
      <div style="font-weight:800;font-size:15px;margin:18px 0 10px">Proof of delivery</div>
      <div style="display:flex;gap:10px;margin-bottom:18px">${[1,2,3].map(()=>`<div style="flex:1;aspect-ratio:1;border-radius:12px;background:${C.bg};border:1px solid ${C.line};display:flex;align-items:center;justify-content:center">${ic('camera',C.muted,26)}</div>`).join('')}</div>
      <div style="font-weight:800;font-size:15px;margin-bottom:8px">Receipt</div>
      ${card(`<div style="padding:16px">${[['Subtotal','470,000'],['Insurance 0.5%','9,000'],['VAT (0%)','0'],['Total paid','479,000']].map(([a,b],i,arr)=>`<div style="display:flex;justify-content:space-between;padding:9px 0;${i?'border-top:1px solid '+C.line:''}"><span style="font-size:14px;color:${i==arr.length-1?C.text:C.muted};font-weight:${i==arr.length-1?800:600}">${a}</span><span class="mono" style="font-weight:${i==arr.length-1?800:700};font-size:14px">${b}</span></div>`).join('')}</div>`)}
    </div>
    <div style="padding:14px 22px 30px;border-top:1px solid ${C.line};background:#fff;display:flex;gap:12px">
      <button style="flex:1;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:15px;border-radius:14px">Download PDF</button>
      <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:15px;border-radius:14px">Reorder</button>
    </div>
  </div>`));

// 09 Chat
add('client/09-chat',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 20px 12px;display:flex;align-items:center;gap:12px;border-bottom:1px solid ${C.line}">
      <div style="font-size:26px">‹</div>
      <div style="width:42px;height:42px;border-radius:50%;background:${C.primaryL};display:flex;align-items:center;justify-content:center;font-weight:800;color:${C.primaryD}">O</div>
      <div style="flex:1"><div style="font-weight:800;font-size:16px">Omar K.</div><div style="color:${C.primary};font-size:12.5px;font-weight:700">● Online · #NF-20418</div></div>
      <div style="width:42px;height:42px;border-radius:12px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('phone',C.primaryD,20)}</div>
    </div>
    <div style="flex:1;overflow:hidden;padding:18px 20px;display:flex;flex-direction:column;gap:12px;background:${C.bg}">
      <div style="text-align:center;color:${C.muted};font-size:12px;font-weight:700">TODAY</div>
      <div style="align-self:flex-start;max-width:76%;background:#fff;border:1px solid ${C.line};border-radius:16px 16px 16px 4px;padding:11px 14px;font-size:14.5px">I'm at the pickup gate. Which dock?</div>
      <div style="align-self:flex-end;max-width:76%;background:${C.primary};color:#fff;border-radius:16px 16px 4px 16px;padding:11px 14px;font-size:14.5px">Dock 3, ask for Yousef 👍 <span style="font-size:11px;opacity:.8">✓✓ 09:41</span></div>
      <div style="align-self:flex-start;max-width:76%;background:#fff;border:1px solid ${C.line};border-radius:16px 16px 16px 4px;padding:0;overflow:hidden">
        <div style="width:210px;height:120px">${mapSvg(210,120,{route:false})}</div>
        <div style="padding:9px 12px;font-size:13px;color:${C.muted};font-weight:600">📍 Shared live location</div>
      </div>
      <div style="align-self:flex-start;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid ${C.line};border-radius:16px;padding:11px 14px;font-size:14px;font-weight:700">${ic('chat',C.primary,18)} Voice note · 0:08 ▶</div>
    </div>
    <div style="padding:12px 18px 28px;background:#fff;border-top:1px solid ${C.line};display:flex;align-items:center;gap:10px">
      <div style="width:42px;height:42px;border-radius:50%;background:${C.bg};display:flex;align-items:center;justify-content:center">${ic('camera',C.muted,22)}</div>
      <div style="flex:1;height:46px;border-radius:23px;background:${C.bg};display:flex;align-items:center;padding:0 18px;color:${C.muted};font-size:14.5px">Message…</div>
      <div style="width:46px;height:46px;border-radius:50%;background:${C.primary};display:flex;align-items:center;justify-content:center">${ic('nav','#fff',22)}</div>
    </div>
  </div>`));

// 10 Wallet
add('client/10-wallet',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:6px 22px 14px"><div style="font-size:22px;font-weight:800">Wallet</div></div>
    <div style="padding:0 22px 18px">
      ${card(`<div style="padding:22px;background:linear-gradient(135deg,#C0480A,#F7902E);border:0">
        <div style="color:rgba(255,255,255,.8);font-size:14px;font-weight:600">Available balance</div>
        <div style="color:#fff;font-size:34px;font-weight:800;margin:4px 0 16px"><span class="mono">620,000</span> <span style="font-size:.45em;opacity:.8">IQD</span></div>
        <div style="display:flex;gap:10px"><div style="flex:1;background:${C.accent};color:#20160a;text-align:center;font-weight:800;padding:13px;border-radius:12px;font-size:14.5px">Top up</div><div style="flex:1;background:rgba(255,255,255,.18);color:#fff;text-align:center;font-weight:800;padding:13px;border-radius:12px;font-size:14.5px">Withdraw</div></div>
      </div>`,'overflow:hidden')}
    </div>
    <div style="padding:0 22px 10px;font-weight:800;font-size:16px">Transactions</div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      ${[['Top-up · ZainCash','+200,000',C.primary,'2 Aug'],['Order #NF-20418','-485,000',C.text,'2 Aug'],['Refund · #NF-20301','+35,000',C.primary,'28 Jul'],['Order #NF-20290','-198,000',C.text,'27 Jul']].map(([a,b,c,d])=>`
        <div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid ${C.line}">
          <div style="width:40px;height:40px;border-radius:12px;background:${C.bg};display:flex;align-items:center;justify-content:center">${ic(b[0]==='+'?'wallet':'box',C.muted,20)}</div>
          <div style="flex:1"><div style="font-weight:700;font-size:14.5px">${a}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${d}</div></div>
          <div class="mono" style="font-weight:800;font-size:15px;color:${c}">${b}</div>
        </div>`).join('')}
    </div>
    ${tabbar('wallet')}
  </div>`));

// 11 Subscription
add('client/11-subscription',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">Subscription</div></div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      ${card(`<div style="padding:20px;background:${C.ink};border:0">
        <div style="display:flex;justify-content:space-between;align-items:center"><div><div style="color:rgba(255,255,255,.6);font-size:13px;font-weight:600">Current plan</div><div style="color:#fff;font-size:24px;font-weight:800">Plus</div></div>${chip('Active',{bg:'rgba(234,91,12,.25)',c:'#5EEAD4'})}</div>
        <div style="color:rgba(255,255,255,.6);font-size:13px;font-weight:600;margin-top:12px">Renews 1 Sep · <span class="mono">120,000</span> IQD/mo</div>
      </div>`,'overflow:hidden')}
      <div style="font-weight:800;font-size:15px;margin:18px 0 10px">Your benefits</div>
      ${[['5% off every shipment','Applied automatically'],['Priority dispatch','Faster driver matching'],['Saved templates','Reorder in one tap']].map(([a,b])=>`
        <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid ${C.line}"><div style="width:28px;height:28px;border-radius:50%;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('check',C.primary,18)}</div><div style="flex:1"><div style="font-weight:700;font-size:14.5px">${a}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${b}</div></div></div>`).join('')}
      <div style="font-weight:800;font-size:15px;margin:18px 0 8px">Invoices</div>
      ${[['Aug 2026','120,000'],['Jul 2026','120,000']].map(([a,b])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid ${C.line}"><span style="font-weight:700;font-size:14px">${a}</span><span style="display:flex;gap:12px;align-items:center"><span class="mono" style="font-weight:700;font-size:14px">${b}</span><span style="color:${C.primary};font-weight:700;font-size:13px">PDF</span></span></div>`).join('')}
    </div>
    <div style="padding:14px 22px 30px;border-top:1px solid ${C.line};background:#fff"><button style="width:100%;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:17px;padding:17px;border-radius:14px">Upgrade to Business</button></div>
  </div>`));

// 12 Addresses
add('client/12-addresses',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">Saved addresses</div></div>
    <div style="height:180px;margin:0 22px 16px;border-radius:18px;overflow:hidden;position:relative">${mapSvg(386,180,{route:false})}<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-100%)">${pinShape(C.accent)}</div></div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      ${[['home','Home','Al-Karrada, Baghdad',true],['box','Warehouse','Industrial Zone, Erbil',false],['user','Client site','Al-Mansour, Baghdad',false]].map(([k,t,a,def])=>`
        <div style="display:flex;align-items:center;gap:13px;padding:15px;border-radius:16px;margin-bottom:11px;background:#fff;border:1px solid ${C.line}">
          <div style="width:44px;height:44px;border-radius:12px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic(k,C.primaryD,22)}</div>
          <div style="flex:1"><div style="display:flex;gap:8px;align-items:center"><span style="font-weight:800;font-size:15px">${t}</span>${def?chip('Default',{bg:C.primaryL,c:C.primaryD}):''}</div><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div></div>
          ${ic('edit',C.muted,20)}
        </div>`).join('')}
    </div>
    <div style="padding:14px 22px 30px"><button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:17px;padding:17px;border-radius:14px">+ Add address</button></div>
  </div>`));

// 13 Profile
add('client/13-profile',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:6px 22px 8px"><div style="font-size:22px;font-weight:800">Profile</div></div>
    <div style="padding:16px 22px;display:flex;align-items:center;gap:14px">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#F7902E,#C0480A);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:26px">Y</div>
      <div style="flex:1"><div style="font-weight:800;font-size:19px">Yousef Al-Rawi</div><div style="color:${C.muted};font-size:14px;font-weight:600">+964 770 ••• 4567</div></div>
      ${chip('Plus',{bg:C.primaryL,c:C.primaryD})}
    </div>
    <div style="flex:1;overflow:hidden;padding:6px 22px">
      ${[['user','Personal & company info'],['wallet','Display currency · IQD'],['chat','Language · العربية'],['bell','Notification preferences'],['shield','Active sessions'],['clock','Support & help'],['doc','Legal & privacy']].map(([k,t],i,arr)=>`
        <div style="display:flex;align-items:center;gap:14px;padding:15px 0;${i<arr.length-1?'border-bottom:1px solid '+C.line:''}">${ic(k,C.primary,22)}<span style="flex:1;font-weight:700;font-size:15px">${t}</span><span style="color:${C.muted};font-size:22px">›</span></div>`).join('')}
      <div style="margin-top:14px;text-align:center;color:${C.danger};font-weight:800;font-size:15px">Sign out</div>
    </div>
    ${tabbar('user')}
  </div>`));

// 13a Language (opened from Profile → settings sub-screen)
add('client/13a-language',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:14px 26px 34px">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px"><div style="font-size:28px;color:${C.text}">‹</div><div style="font-weight:800;font-size:20px">Language</div></div>
    <p style="color:${C.muted};font-size:15px;line-height:1.5;margin:4px 0 22px">Choose the language for the app. You can change this anytime from your profile.</p>
    ${[['العربية','Arabic',true,true],['English','English',false,true],['کوردی','Kurdish',false,false],['Türkçe','Turkish',false,false],['فارسی','Persian',false,false]].map(([nat,en,on,active])=>`
      <div style="display:flex;align-items:center;gap:14px;padding:16px;border-radius:16px;margin-bottom:11px;background:${on?C.primaryL:'#fff'};border:1.5px solid ${on?C.primary:C.line};${active?'':'opacity:.5'}">
        <div style="flex:1"><div style="font-weight:800;font-size:17px">${nat}</div><div style="color:${C.muted};font-size:13px;font-weight:600">${en}${active?'':' · coming soon'}</div></div>
        <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${on?C.primary:C.line};display:flex;align-items:center;justify-content:center">${on?`<div style="width:12px;height:12px;border-radius:50%;background:${C.primary}"></div>`:''}</div>
      </div>`).join('')}
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Save changes</button>
  </div>`));

// 14 Rate driver
add('client/14-rate',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:14px 26px 30px">
    <div style="display:flex;justify-content:flex-end"><span style="font-size:24px;color:${C.muted}">✕</span></div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:12px">
      <div style="width:96px;height:96px;border-radius:50%;background:${C.primaryL};display:flex;align-items:center;justify-content:center;color:${C.primaryD};font-weight:800;font-size:38px">O</div>
      <h1 style="font-size:24px;font-weight:800;margin:18px 0 4px">Rate your delivery</h1>
      <p style="color:${C.muted};font-size:15px;margin:0 0 20px">Omar K. · Order #NF-20301</p>
      <div style="display:flex;gap:10px;margin-bottom:22px">${[1,2,3,4,5].map(i=>`<div style="font-size:40px;color:${i<=4?C.accent:C.line}">★</div>`).join('')}</div>
      <div style="display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-bottom:22px">${['On time','Careful handling','Polite','Clean truck'].map((t,i)=>`<span style="padding:9px 15px;border-radius:999px;font-weight:700;font-size:13.5px;background:${i<2?C.primaryL:'#fff'};color:${i<2?C.primaryD:C.muted};border:1.5px solid ${i<2?C.primary:C.line}">${t}</span>`).join('')}</div>
      <div style="width:100%;min-height:80px;border:1.5px solid ${C.line};border-radius:14px;background:#fff;padding:14px;text-align:left;color:${C.muted};font-size:14.5px">Add a comment (optional)…</div>
    </div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:18px;border-radius:15px;margin-top:18px">Submit rating</button>
  </div>`));

// 15 Notifications
add('client/15-notifications',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">Notifications</div></div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      ${[
        ['truck',C.primary,'Driver assigned','Omar K. is on the way to pickup · #NF-20418','2m',true],
        ['pin',C.accent,'Driver arrived at pickup','Please hand over the cargo','18m',true],
        ['check',C.primary,'Delivered','#NF-20301 completed. Rate your driver','1h',false],
        ['wallet',C.primaryD,'Top-up successful','+200,000 IQD via ZainCash','3h',false],
        ['star',C.accent,'Plus benefit applied','You saved 24,000 IQD on #NF-20418','5h',false],
      ].map(([k,c,t,b,when,unread])=>`
        <div style="display:flex;gap:13px;padding:15px 0;border-bottom:1px solid ${C.line};${unread?'':'opacity:.7'}">
          <div style="width:44px;height:44px;border-radius:12px;background:${C.primaryL};display:flex;align-items:center;justify-content:center;position:relative">${ic(k,c,22)}${unread?`<span style="position:absolute;top:-2px;right:-2px;width:11px;height:11px;background:${C.danger};border-radius:50%;border:2px solid #fff"></span>`:''}</div>
          <div style="flex:1"><div style="font-weight:800;font-size:14.5px">${t}</div><div style="color:${C.muted};font-size:13px;font-weight:600;line-height:1.4">${b}</div></div>
          <div style="color:${C.muted};font-size:12px;font-weight:600">${when}</div>
        </div>`).join('')}
    </div>
    ${tabbar('home')}
  </div>`));

// 03a International shipment documents (cross-border)
add('client/03a-documents',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div><div style="font-weight:800;font-size:19px">Shipment documents</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">Required for cross-border · Jordan → Iraq</div></div></div>
    <div style="padding:0 22px 6px"><div style="display:flex;align-items:center;gap:10px;padding:13px 15px;border-radius:14px;background:${C.primaryL}">${ic('shield',C.primaryD,20)}<span style="font-size:13px;color:${C.primaryD};font-weight:700;line-height:1.35">Upload all customs documents before the truck reaches the border.</span></div></div>
    <div style="padding:14px 22px 0;flex:1;overflow:hidden">
      ${[['Commercial invoice','PDF · 240 KB','done'],['Packing list','PDF · 180 KB','done'],['Certificate of origin','JPG · 1.1 MB','done'],['Customs declaration','Required','todo'],['Driver & vehicle licence','Auto-attached','done']].map(([t,s,st])=>`
        <div style="display:flex;align-items:center;gap:13px;padding:15px;border-radius:15px;margin-bottom:11px;background:#fff;border:1.5px solid ${st==='done'?C.line:C.accent}">
          <div style="width:44px;height:44px;border-radius:12px;background:${st==='done'?C.primaryL:'#FFF6E0'};display:flex;align-items:center;justify-content:center">${ic('doc',st==='done'?C.primaryD:C.accentD,22)}</div>
          <div style="flex:1"><div style="font-weight:800;font-size:14.5px">${t}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${s}</div></div>
          ${st==='done'?`<div style="width:28px;height:28px;border-radius:50%;background:${C.primary};display:flex;align-items:center;justify-content:center">${ic('check','#fff',17)}</div>`:`<span style="color:${C.accentD};font-weight:800;font-size:13px">Upload</span>`}
        </div>`).join('')}
      <div style="padding:15px;border-radius:15px;border:2px dashed ${C.line};text-align:center;background:#fff">${ic('doc',C.muted,26)}<div style="font-weight:800;font-size:13.5px;margin-top:4px">Add another document</div><div style="font-size:12px;color:${C.muted};font-weight:600">PDF, JPG, PNG · up to 10 MB</div></div>
    </div>
    <div style="padding:16px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:${C.muted};font-weight:600;font-size:13.5px">4 of 5 uploaded</span><span style="font-weight:800;font-size:13.5px;color:${C.accentD}">Customs declaration pending</span></div>
      <button style="width:100%;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:17px;padding:17px;border-radius:15px">Submit & continue</button>
    </div>
  </div>`));

// 05a Cross-border tracking (customs timeline)
add('client/05a-tracking-crossborder',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="position:relative;height:300px">
      <div style="position:absolute;inset:0">${mapSvg(430,300,{dark:true,route:true})}</div>
      <div style="position:absolute;top:6px;left:0;right:0;padding:6px 22px;display:flex;justify-content:space-between;align-items:center">
        <div style="width:44px;height:44px;border-radius:13px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-size:24px">‹</div>
        ${chip('● At border · Trebil',{bg:'#fff',c:C.accentD})}
        <div style="width:44px;height:44px;border-radius:13px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center">${ic('nav',C.primary,22)}</div>
      </div>
    </div>
    <div style="flex:1;background:#fff;border-radius:28px 28px 0 0;margin-top:-24px;position:relative;padding:16px 22px 10px;overflow:hidden">
      <div style="width:44px;height:5px;border-radius:5px;background:${C.line};margin:0 auto 14px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-weight:800;font-size:17px">Amman → Baghdad</div>
        <div style="display:flex;align-items:center;gap:6px;color:${C.muted};font-size:13px;font-weight:700">${ic('clock',C.accentD,16)} ETA 28 May · 22:30</div>
      </div>
      ${[['Loaded · Amman warehouse','27 May · 08:00','done'],['Karama crossing (JO exit)','27 May · 11:20','done'],['Trebil crossing (IQ entry)','In progress · customs','active'],['Customs clearance','Awaiting inspection','todo'],['In transit to Baghdad','Pending','todo'],['Delivered · Baghdad','Pending','todo']].map(([t,s,st],i,a)=>`
        <div style="display:flex;gap:13px">
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:22px;height:22px;border-radius:50%;background:${st==='done'?C.primary:st==='active'?'#fff':'#fff'};border:${st==='done'?'0':'2.5px solid '+(st==='active'?C.accent:C.line)};display:flex;align-items:center;justify-content:center">${st==='done'?ic('check','#fff',14):st==='active'?`<div style="width:9px;height:9px;border-radius:50%;background:${C.accent}"></div>`:''}</div>
            ${i<a.length-1?`<div style="width:2.5px;flex:1;min-height:26px;background:${st==='done'?C.primary:C.line}"></div>`:''}
          </div>
          <div style="padding-bottom:16px"><div style="font-weight:800;font-size:14.5px;color:${st==='todo'?C.muted:C.text}">${t}</div><div style="color:${st==='active'?C.accentD:C.muted};font-size:12.5px;font-weight:${st==='active'?800:600}">${s}</div></div>
        </div>`).join('')}
    </div>
    <div style="padding:12px 22px 30px;border-top:1px solid ${C.line};background:#fff;display:flex;gap:11px">
      <button style="flex:1;border:1px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14.5px;padding:14px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('doc',C.primary,19)} Customs docs</button>
      <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:14.5px;padding:14px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('chat','#fff',19)} Message driver</button>
    </div>
  </div>`));

/* ============================================================= DRIVER */

// 00a Auth – phone entry (driver)
add('driver/00a-auth-phone',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
      <div style="width:40px;height:40px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(26)}</div>
      <div style="font-weight:800;font-size:17px;flex:1">NEXT<span style="color:${C.accent}"> Freight</span> · Carrier</div>
      ${langPill()}
    </div>
    <h1 style="font-size:29px;font-weight:800;line-height:1.2;margin:30px 0 10px">Drive with NEXT Freight</h1>
    <p style="color:${C.muted};font-size:16px;line-height:1.5;margin:0 0 26px">Enter your phone number to start. Carriers are verified before going online.</p>
    <div style="display:flex;gap:10px">
      <div style="display:flex;align-items:center;gap:8px;padding:0 14px;height:60px;border:1.5px solid ${C.line};border-radius:16px;background:#fff;font-weight:700;font-size:16px">🇮🇶 +964 <span style="color:${C.muted};font-size:13px">▾</span></div>
      <div style="flex:1;display:flex;align-items:center;padding:0 16px;height:60px;border:1.5px solid ${C.primary};border-radius:16px;background:#fff;font-weight:700;font-size:18px;letter-spacing:.5px">781 445 9032</div>
    </div>
    <div style="color:${C.muted};font-size:13px;margin-top:10px">Iraqi mobile numbers start with 7 · 10 digits</div>
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Send code &nbsp;→</button>
    <p style="text-align:center;color:${C.muted};font-size:12.5px;line-height:1.5;margin:16px 4px 0">By continuing you agree to the <b style="color:${C.text}">Carrier Terms</b> and <b style="color:${C.text}">Privacy Policy</b>.</p>
  </div>`));

// 00b Auth – OTP verify (driver)
add('driver/00b-auth-otp',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <h1 style="font-size:29px;font-weight:800;line-height:1.2;margin:26px 0 10px">Verify your number</h1>
    <p style="color:${C.muted};font-size:16px;line-height:1.5;margin:0 0 30px">Enter the 6-digit code sent to<br><b style="color:${C.text}">+964 781 ••• 9032</b> &nbsp;<span style="color:${C.primary};font-weight:700">Change</span></p>
    <div style="display:flex;gap:10px;justify-content:space-between">
      ${['2','7','','','',''].map((d,i)=>`<div style="flex:1;aspect-ratio:1;max-width:52px;display:flex;align-items:center;justify-content:center;border:1.5px solid ${d?C.primary:(i===2?C.ink:C.line)};border-radius:14px;background:#fff;font-weight:800;font-size:26px;color:${C.text}">${d||(i===2?'<span style=\"width:2px;height:26px;background:'+C.ink+'\"></span>':'')}</div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:24px;color:${C.muted};font-size:15px">${ic('clock',C.muted,18)} Resend code in <b style="color:${C.text}">1:44</b></div>
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Verify</button>
  </div>`));

// 00c Choose driver type
add('driver/00c-driver-type',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <h1 style="font-size:28px;font-weight:800;line-height:1.2;margin:22px 0 8px">How do you drive?</h1>
    <p style="color:${C.muted};font-size:16px;line-height:1.5;margin:0 0 26px">This sets up the right onboarding for you.</p>
    <div style="padding:20px;border-radius:20px;border:1.5px solid ${C.primary};background:${C.primaryL};margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:13px">
        <div style="width:52px;height:52px;border-radius:14px;background:#fff;display:flex;align-items:center;justify-content:center">${ic('truck',C.primaryD,28)}</div>
        <div style="flex:1"><div style="font-weight:800;font-size:17px;color:${C.primaryD}">Owner-operator</div><div style="font-size:13px;color:${C.primaryD};opacity:.8">I own my truck(s)</div></div>
        <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${C.primary};display:flex;align-items:center;justify-content:center"><div style="width:12px;height:12px;border-radius:50%;background:${C.primary}"></div></div>
      </div>
      <div style="margin-top:12px;font-size:13px;color:${C.primaryD};line-height:1.45">Submit your documents and get verified. You'll manage your own jobs, earnings, and payouts.</div>
    </div>
    <div style="padding:20px;border-radius:20px;border:1.5px solid ${C.line};background:#fff">
      <div style="display:flex;align-items:center;gap:13px">
        <div style="width:52px;height:52px;border-radius:14px;background:${C.bg};display:flex;align-items:center;justify-content:center">${ic('building',C.text,28)}</div>
        <div style="flex:1"><div style="font-weight:800;font-size:17px">Fleet driver</div><div style="font-size:13px;color:${C.muted}">I was invited by a company</div></div>
        <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${C.line}"></div>
      </div>
      <div style="margin-top:12px;font-size:13px;color:${C.muted};line-height:1.45">Your company added you and assigned your vehicle. Just confirm the invite — no documents needed here.</div>
    </div>
    <div style="flex:1"></div>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:19px;border-radius:16px">Continue &nbsp;→</button>
  </div>`));

// 00d Carrier application – documents (individual owner-operator)
add('driver/00d-application',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 8px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:18px">Carrier application</div><div style="flex:1"></div>${chip('Autosaved',{bg:C.primaryL,c:C.primaryD})}</div>
    <div style="padding:6px 22px 16px"><div style="display:flex;gap:6px">${[1,2,3].map(i=>`<div style="flex:1;height:6px;border-radius:6px;background:${i<=3?C.primary:C.line}"></div>`).join('')}</div><div style="color:${C.muted};font-size:13px;font-weight:600;margin-top:8px">Step 3 of 3 · Documents</div></div>
    <div style="flex:1;overflow:hidden;padding:0 22px">
      <p style="color:${C.muted};font-size:14px;line-height:1.5;margin:0 0 16px">Clear photos, no glare. Reviewed within 24–48h.</p>
      ${[
        ['National ID','Front & back','done'],
        ['Driving license','Valid, not expired','done'],
        ['Vehicle registration','Matches your plate','todo'],
        ['Vehicle photos','4 angles · 2 uploaded','progress'],
        ['Selfie with ID','For identity match','todo'],
        ['Bank / IBAN for payouts','Where you get paid','done'],
      ].map(([t,s,st])=>{
        const done=st==='done', prog=st==='progress';
        return `<div style="display:flex;align-items:center;gap:13px;padding:14px;border-radius:15px;margin-bottom:11px;background:#fff;border:1.5px solid ${done?C.primary:(prog?C.accent:C.line)}">
          <div style="width:44px;height:44px;border-radius:12px;background:${done?C.primaryL:C.bg};display:flex;align-items:center;justify-content:center">${done?ic('check',C.primary,24):ic('camera',prog?C.accentD:C.muted,22)}</div>
          <div style="flex:1"><div style="font-weight:800;font-size:14.5px">${t}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${s}</div></div>
          <span style="font-weight:800;font-size:13px;color:${done?C.primary:(prog?C.accentD:C.primary)}">${done?'Uploaded':(prog?'2/4':'Upload')}</span>
        </div>`;}).join('')}
    </div>
    <div style="padding:14px 22px 30px;border-top:1px solid ${C.line};background:#fff"><button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:17px;padding:17px;border-radius:14px">Submit application</button></div>
  </div>`));

// 00e Application under review
add('driver/00e-review',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
      <div style="width:96px;height:96px;border-radius:50%;background:#FFF4E0;display:flex;align-items:center;justify-content:center">${ic('clock',C.accentD,52)}</div>
      <h1 style="font-size:27px;font-weight:800;margin:24px 0 10px">Application under review</h1>
      <p style="color:${C.muted};font-size:16px;line-height:1.55;margin:0 22px">We're verifying your documents. This usually takes <b style="color:${C.text}">24–48 hours</b>. We'll notify you once you're approved to go online.</p>
    </div>
    <div style="width:100%">
      ${card(`<div style="padding:18px">
        <div style="font-weight:800;font-size:14px;color:${C.muted};margin-bottom:6px">SUBMITTED</div>
        ${[['National ID'],['Driving license'],['Vehicle registration'],['Vehicle photos']].map(([a],i)=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;${i?'border-top:1px solid '+C.line:''}"><div style="width:26px;height:26px;border-radius:50%;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('check',C.primary,16)}</div><span style="flex:1;font-weight:700;font-size:15px">${a}</span><span style="color:${C.primary};font-weight:700;font-size:13px">Received</span></div>`).join('')}
      </div>`)}
    </div>
    <div style="display:flex;gap:12px;margin-top:16px">
      <button style="flex:1;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:16px;padding:16px;border-radius:16px">Edit application</button>
      <button style="flex:1;border:0;background:${C.ink};color:#fff;font-weight:800;font-size:16px;padding:16px;border-radius:16px">Contact support</button>
    </div>
  </div>`));

// 00f Fleet driver – confirm company invite
add('driver/00f-fleet-join',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 26px 34px">
    <div style="font-size:26px;color:${C.text}">‹</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <div style="text-align:center">
        <div style="width:84px;height:84px;border-radius:22px;background:${C.primaryL};display:flex;align-items:center;justify-content:center;margin:0 auto">${ic('building',C.primaryD,42)}</div>
        <h1 style="font-size:25px;font-weight:800;margin:20px 0 6px">Join your company</h1>
        <p style="color:${C.muted};font-size:15px;line-height:1.5;margin:0 20px 22px">You were invited to drive for this fleet. Confirm to start receiving their jobs.</p>
      </div>
      ${card(`<div style="padding:18px">
        <div style="display:flex;align-items:center;gap:13px;padding-bottom:14px;border-bottom:1px solid ${C.line}">
          <div style="width:48px;height:48px;border-radius:12px;background:${C.ink};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px">RF</div>
          <div style="flex:1"><div style="font-weight:800;font-size:16px">Al-Rafidain Fleet Co.</div><div style="color:${C.muted};font-size:13px;font-weight:600">Baghdad · 24 vehicles</div></div>
          ${chip('Verified',{bg:C.primaryL,c:C.primaryD})}
        </div>
        ${[['user','Role','Fleet driver'],['truck','Assigned vehicle','Box · 3.5t · 21 A 4482'],['shield','Documents','Managed by company']].map(([k,a,b])=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid ${C.line}">${ic(k,C.primary,20)}<span style="flex:1;font-weight:600;font-size:14px;color:${C.muted}">${a}</span><span style="font-weight:800;font-size:14px">${b}</span></div>`).join('')}
        <div style="padding-top:12px;font-size:12.5px;color:${C.muted};line-height:1.45">You won't manage payouts or documents — your company handles those.</div>
      </div>`)}
    </div>
    <div style="display:flex;gap:12px">
      <button style="flex:1;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:16px;padding:17px;border-radius:15px">Decline</button>
      <button style="flex:1.4;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:16px;padding:17px;border-radius:15px">Join Al-Rafidain</button>
    </div>
  </div>`));

// 01 Go online / dashboard
add('driver/01-online',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:6px 22px 16px;display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:12px"><div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#C0480A,#F7902E);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800">KA</div><div><div style="font-weight:800;font-size:17px">Karim A.</div><div style="color:${C.muted};font-size:13px;font-weight:600">Volvo FH · Platinum tier</div></div></div>
      <div style="width:46px;height:46px;border-radius:14px;background:#fff;border:1px solid ${C.line};display:flex;align-items:center;justify-content:center">${ic('bell',C.text,22)}</div>
    </div>
    <div style="padding:0 22px 18px">
      ${card(`<div style="padding:22px;background:linear-gradient(135deg,#C0480A,#F7902E);border:0;text-align:center;color:#fff">
        <div style="width:96px;height:96px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;border:3px solid rgba(255,255,255,.35)">${ic('power','#fff',44)}</div>
        <div style="font-weight:800;font-size:22px">You're Online</div>
        <div style="opacity:.82;font-size:14px;font-weight:600;margin-top:2px">Receiving offers near Baghdad</div>
      </div>`,'overflow:hidden')}
    </div>
    <div style="padding:0 22px 8px;display:flex;gap:12px">
      <div style="flex:1;padding:16px;border-radius:16px;background:#fff;border:1px solid ${C.line}"><div style="color:${C.muted};font-size:13px;font-weight:600">Today's earnings</div><div style="font-weight:800;font-size:22px;margin-top:4px">312,000</div><div style="color:${C.primary};font-size:12px;font-weight:700">IQD · 4 trips</div></div>
      <div style="flex:1;padding:16px;border-radius:16px;background:#fff;border:1px solid ${C.line}"><div style="color:${C.muted};font-size:13px;font-weight:600">Acceptance</div><div style="font-weight:800;font-size:22px;margin-top:4px">96%</div><div style="color:${C.primary};font-size:12px;font-weight:700">Last 30 days</div></div>
    </div>
    <div style="padding:16px 22px 8px;font-weight:800;font-size:17px">Your stats</div>
    <div style="padding:0 22px">${card(`<div style="padding:6px 18px">
      ${[['star','Rating','4.9 / 5.0'],['gauge','On-time rate','98%'],['shield','Violations','0 active']].map(([k,a,b],i)=>`<div style="display:flex;align-items:center;gap:12px;padding:14px 0;${i?'border-top:1px solid '+C.line:''}">${ic(k,C.primary,22)}<span style="flex:1;font-weight:600;font-size:15px">${a}</span><span style="font-weight:800;font-size:15px">${b}</span></div>`).join('')}
    </div>`)}</div>
    <div style="flex:1"></div>
    ${tabbar('home')}
  </div>`));

// 02 Job offer w/ timer
add('driver/02-offer',430,932,3, phone(`
  <div style="flex:1;position:relative;display:flex;flex-direction:column;justify-content:flex-end">
    <div style="position:absolute;inset:0">${mapSvg(430,600,{dark:true,route:true})}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,18,13,.5) 0%,rgba(6,18,13,0) 30%)"></div>
    <div style="position:relative;flex:none;background:#fff;border-radius:28px 28px 0 0;box-shadow:0 -12px 34px rgba(0,0,0,.18);padding:16px 20px 34px;line-height:1.25">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:inline-flex;align-items:center;gap:9px;background:#FFF4E0;color:${C.accentD};font-weight:800;padding:9px 14px;border-radius:999px;font-size:14px">${ic('clock',C.accentD,17)} New offer</div>
        <div style="font-weight:800;font-size:20px;color:${C.accentD}" class="mono">0:27</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div><div style="font-weight:800;font-size:16px">Order #NF-20418</div><div style="color:${C.muted};font-size:13px;font-weight:600">Box truck · General cargo · 3.2 t</div></div>
        <div style="text-align:right"><div style="color:${C.muted};font-size:12px;font-weight:600">You earn</div><div style="font-weight:800;font-size:22px;color:${C.primary}">412,000</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">
        <div style="display:flex;flex-direction:column;align-items:center;padding-top:4px"><div style="width:11px;height:11px;border-radius:50%;background:${C.primary}"></div><div style="width:2px;height:26px;background:${C.line}"></div><div style="width:11px;height:11px;border-radius:50%;border:2px solid ${C.accent}"></div></div>
        <div style="flex:1"><div style="font-weight:700;font-size:15px">Al-Karrada, Baghdad <span style="color:${C.muted};font-weight:600">· 3.1 km away</span></div><div style="color:${C.muted};font-size:13px;margin-bottom:8px">Pickup</div><div style="font-weight:700;font-size:15px">Erbil Industrial Zone</div><div style="color:${C.muted};font-size:13px">Drop-off · 355 km</div></div>
      </div>
      <div style="display:flex;gap:10px">
        <button style="flex:1;border:1px solid ${C.line};background:#fff;color:${C.muted};font-weight:800;font-size:15px;padding:13px;border-radius:14px">Decline</button>
        <button style="flex:2;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:13px;border-radius:14px">Accept offer</button>
      </div>
    </div>
  </div>`));

// 02b Assigned job (fleet driver — pushed by dispatcher, not a competitive offer)
add('driver/02b-assigned',430,932,3, phone(`
  <div style="flex:1;position:relative;display:flex;flex-direction:column;justify-content:flex-end">
    <div style="position:absolute;inset:0">${mapSvg(430,600,{dark:true,route:true})}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,18,13,.5) 0%,rgba(6,18,13,0) 30%)"></div>
    <div style="position:relative;flex:none;background:#fff;border-radius:28px 28px 0 0;box-shadow:0 -12px 34px rgba(0,0,0,.18);padding:16px 20px 34px;line-height:1.25">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:inline-flex;align-items:center;gap:9px;background:${C.primaryL};color:${C.primaryD};font-weight:800;padding:9px 14px;border-radius:999px;font-size:14px">${ic('truck',C.primaryD,17)} Assigned by your fleet</div>
        ${chip('New',{bg:'#FFF4E0',c:C.accentD})}
      </div>
      <div style="display:flex;align-items:center;gap:11px;padding:12px 14px;border-radius:14px;background:${C.bg};margin-bottom:14px">
        <div style="width:40px;height:40px;border-radius:10px;background:${C.ink};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">RF</div>
        <div style="flex:1"><div style="font-weight:800;font-size:14px">Al-Rafidain Fleet Co.</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">Dispatched by Zaid H.</div></div>
        ${ic('chat',C.primary,22)}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div><div style="font-weight:800;font-size:16px">Order #NF-20421</div><div style="color:${C.muted};font-size:13px;font-weight:600">Flatbed · Construction · 8 t</div></div>
        <div style="text-align:right"><div style="color:${C.muted};font-size:12px;font-weight:600">Distance</div><div style="font-weight:800;font-size:20px">355 km</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <div style="display:flex;flex-direction:column;align-items:center;padding-top:4px"><div style="width:11px;height:11px;border-radius:50%;background:${C.primary}"></div><div style="width:2px;height:26px;background:${C.line}"></div><div style="width:11px;height:11px;border-radius:50%;border:2px solid ${C.accent}"></div></div>
        <div style="flex:1"><div style="font-weight:700;font-size:15px">Al-Karrada, Baghdad</div><div style="color:${C.muted};font-size:13px;margin-bottom:8px">Pickup</div><div style="font-weight:700;font-size:15px">Mosul Industrial Zone</div><div style="color:${C.muted};font-size:13px">Drop-off</div></div>
      </div>
      <button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:16px;padding:15px;border-radius:14px">Start job &nbsp;→</button>
      <div style="text-align:center;color:${C.muted};font-size:13px;font-weight:700;margin-top:12px">Can't take it? Message your dispatcher</div>
    </div>
  </div>`));

// 03 Proof of pickup
add('driver/03-proof',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 14px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div style="font-weight:800;font-size:19px">Confirm pickup</div></div>
    <div style="padding:0 22px;flex:1;overflow:hidden">
      <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:14px;background:${C.primaryL};margin-bottom:18px">${ic('pin',C.primaryD,22)}<span style="font-weight:700;color:${C.primaryD};font-size:14px">Inside pickup geofence · Al-Karrada</span>${ic('check',C.primaryD,20)}</div>
      <div style="font-weight:800;font-size:16px;margin-bottom:10px">Sender's 4-digit code</div>
      <div style="display:flex;gap:12px;margin-bottom:22px">${['4','1','9','2'].map(d=>`<div style="flex:1;height:66px;border-radius:16px;background:#fff;border:2px solid ${C.primary};display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800">${d}</div>`).join('')}</div>
      <div style="font-weight:800;font-size:16px;margin-bottom:10px">Loading photos <span style="color:${C.muted};font-weight:600;font-size:14px">(min 1)</span></div>
      <div style="display:flex;gap:12px">
        <div style="width:96px;height:96px;border-radius:16px;background:linear-gradient(135deg,#241608,#F7902E);position:relative;overflow:hidden">${ic('box','rgba(255,255,255,.5)',40)}<div style="position:absolute;bottom:6px;right:6px;background:${C.primary};border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center">${ic('check','#fff',14)}</div></div>
        <div style="width:96px;height:96px;border-radius:16px;background:#fff;border:2px dashed ${C.line};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">${ic('camera',C.muted,28)}<span style="font-size:11px;color:${C.muted};font-weight:700">Add</span></div>
      </div>
      <div style="margin-top:22px;padding:16px;border-radius:16px;background:${C.bg};display:flex;justify-content:space-between"><span style="color:${C.muted};font-weight:600;font-size:14px">GPS captured</span><span style="font-weight:700;font-size:14px" class="mono">33.3152° N, 44.3661° E</span></div>
    </div>
    <div style="padding:16px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:18px;padding:18px;border-radius:15px">Confirm & mark loaded</button>
    </div>
  </div>`));

// 04 Earnings
add('driver/04-earnings',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 14px;font-weight:800;font-size:22px">Earnings</div>
    <div style="padding:0 22px 16px">
      ${card(`<div style="padding:20px;background:${C.ink};border:0;color:#fff">
        <div style="opacity:.7;font-size:14px;font-weight:600">Available to withdraw</div>
        <div style="font-size:40px;font-weight:800;margin:2px 0 14px">1,845,000 <span style="font-size:18px;opacity:.7">IQD</span></div>
        <button style="border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:16px;padding:14px 22px;border-radius:13px">Request payout →</button>
      </div>`,'overflow:hidden')}
    </div>
    <div style="padding:0 22px 8px;display:flex;gap:8px">${['Week','Month','Year'].map((t,i)=>`<div style="padding:9px 18px;border-radius:999px;font-weight:700;font-size:14px;background:${i==1?C.ink:'#fff'};color:${i==1?'#fff':C.muted};border:1px solid ${i==1?C.ink:C.line}">${t}</div>`).join('')}</div>
    <div style="padding:14px 22px 4px">${card(`<div style="padding:20px 18px 8px">
      <div style="display:flex;align-items:flex-end;gap:10px;height:150px">
        ${[60,90,45,120,80,140,100].map((h,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px"><div style="width:100%;height:${h}px;border-radius:8px 8px 0 0;background:${i==5?C.primary:'#FCE3CE'}"></div><span style="font-size:11px;color:${C.muted};font-weight:700">${['M','T','W','T','F','S','S'][i]}</span></div>`).join('')}
      </div></div>`)}</div>
    <div style="padding:16px 22px 8px;font-weight:800;font-size:16px">Recent trips</div>
    <div style="padding:0 22px">${card(`<div style="padding:4px 18px">
      ${[['#NF-20418','Baghdad → Erbil','+412,000'],['#NF-20390','Baghdad → Basra','+528,000'],['#NF-20361','Karbala → Najaf','+96,000']].map(([a,b,c],i)=>`<div style="display:flex;align-items:center;gap:12px;padding:14px 0;${i?'border-top:1px solid '+C.line:''}"><div style="width:40px;height:40px;border-radius:12px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('truck',C.primaryD,20)}</div><div style="flex:1"><div style="font-weight:800;font-size:14px">${a}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${b}</div></div><div style="font-weight:800;color:${C.primary};font-size:15px" class="mono">${c}</div></div>`).join('')}
    </div>`)}</div>
    <div style="flex:1"></div>
    ${tabbar('wallet')}
  </div>`));

// 02c Loading proof (pickup checklist + before/after + client signature)
add('driver/02c-loading',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div><div style="font-weight:800;font-size:19px">Loading & handover</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">#NF-20461 · Amman warehouse</div></div></div>
    <div style="padding:0 22px 6px"><div style="display:flex;align-items:center;gap:10px;padding:13px 15px;border-radius:14px;background:${C.primaryL}">${ic('pin',C.primaryD,20)}<span style="font-size:13px;color:${C.primaryD};font-weight:700">Inside pickup geofence</span>${ic('check',C.primaryD,19)}</div></div>
    <div style="padding:14px 22px 0;flex:1;overflow:hidden">
      <div style="font-weight:800;font-size:15px;margin-bottom:10px">Loading checklist</div>
      ${[['Inspect goods','done'],['Match declared weight · 10,500 kg','done'],['Client signed handover','done'],['Upload shipment docs','todo']].map(([t,st])=>`
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:13px;margin-bottom:9px;background:#fff;border:1px solid ${C.line}">
          <div style="width:26px;height:26px;border-radius:8px;background:${st==='done'?C.primary:'#fff'};border:1.5px solid ${st==='done'?C.primary:C.line};display:flex;align-items:center;justify-content:center">${st==='done'?ic('check','#fff',16):''}</div>
          <span style="flex:1;font-weight:700;font-size:14px;color:${st==='done'?C.text:C.muted}">${t}</span>
        </div>`).join('')}
      <div style="font-weight:800;font-size:15px;margin:16px 0 10px">Before / after photos</div>
      <div style="display:flex;gap:12px;margin-bottom:16px">
        ${[['Before','before'],['After','after']].map(([lbl])=>`<div style="flex:1"><div style="height:92px;border-radius:14px;background:linear-gradient(135deg,#241608,#F7902E);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center">${ic('box','rgba(255,255,255,.55)',36)}<div style="position:absolute;bottom:6px;right:6px;background:${C.primary};border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center">${ic('check','#fff',13)}</div></div><div style="text-align:center;font-size:12px;font-weight:700;color:${C.muted};margin-top:6px">${lbl}</div></div>`).join('')}
      </div>
      <div style="font-weight:800;font-size:15px;margin-bottom:10px">Client signature</div>
      <div style="height:88px;border-radius:14px;background:${C.bg};border:1.5px solid ${C.line};display:flex;align-items:center;justify-content:center">
        <svg width="180" height="52" viewBox="0 0 180 52" fill="none"><path d="M6 40 C24 8, 40 8, 46 30 S64 50, 78 24 92 6, 104 32 118 46, 132 22 150 10, 174 28" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/></svg>
      </div>
    </div>
    <div style="padding:16px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:17px;padding:17px;border-radius:15px">Confirm loaded & start trip</button>
    </div>
  </div>`));

// 02d Border crossing (customs status + update)
add('driver/02d-border',430,932,3, phone(`
  <div style="flex:1;display:flex;flex-direction:column">
    <div style="padding:4px 22px 12px;display:flex;align-items:center;gap:14px"><div style="font-size:26px">‹</div><div><div style="font-weight:800;font-size:19px">Border crossing</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">#NF-20461 · Jordan → Iraq</div></div></div>
    <div style="padding:0 22px 6px">
      <div style="padding:16px;border-radius:16px;background:${C.ink};color:#fff">
        <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:800;font-size:16px">Trebil crossing</div>${chip('Customs clearance',{bg:'rgba(245,165,36,.18)',c:C.accent})}</div>
        <div style="opacity:.7;font-size:13px;font-weight:600;margin-top:6px">Present shipment documents to the customs officer.</div>
      </div>
    </div>
    <div style="padding:16px 22px 0;flex:1;overflow:hidden">
      ${[['Left Amman warehouse','27 May · 08:00','done'],['Karama crossing (JO exit)','27 May · 11:20','done'],['Exit procedures completed','27 May · 11:45','done'],['Trebil crossing (IQ entry)','27 May · 13:30','done'],['Customs clearance','In progress','active'],['Cleared · continue to Baghdad','Pending','todo']].map(([t,s,st],i,a)=>`
        <div style="display:flex;gap:13px">
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:22px;height:22px;border-radius:50%;background:${st==='done'?C.primary:'#fff'};border:${st==='done'?'0':'2.5px solid '+(st==='active'?C.accent:C.line)};display:flex;align-items:center;justify-content:center">${st==='done'?ic('check','#fff',14):st==='active'?`<div style="width:9px;height:9px;border-radius:50%;background:${C.accent}"></div>`:''}</div>
            ${i<a.length-1?`<div style="width:2.5px;flex:1;min-height:22px;background:${st==='done'?C.primary:C.line}"></div>`:''}
          </div>
          <div style="padding-bottom:14px"><div style="font-weight:800;font-size:14px;color:${st==='todo'?C.muted:C.text}">${t}</div><div style="color:${st==='active'?C.accentD:C.muted};font-size:12.5px;font-weight:${st==='active'?800:600}">${s}</div></div>
        </div>`).join('')}
    </div>
    <div style="padding:12px 22px 30px;border-top:1px solid ${C.line};background:#fff">
      <div style="display:flex;gap:11px;margin-bottom:11px">
        <button style="flex:1;border:1px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px;border-radius:13px;display:flex;align-items:center;justify-content:center;gap:7px">${ic('doc',C.primary,18)} Docs</button>
        <button style="flex:1;border:1px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px;border-radius:13px;display:flex;align-items:center;justify-content:center;gap:7px">${ic('phone',C.text,18)} Support</button>
      </div>
      <button style="width:100%;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:16px;padding:16px;border-radius:15px;display:flex;align-items:center;justify-content:center;gap:9px">${ic('arrow','#20160a',20)} Update crossing status</button>
    </div>
  </div>`));

/* ============================================================= CONTROL PANEL */
function cpSidebar(active){
  const items=[['grid','Overview'],['route','Dispatch board'],['box','Orders'],['map','Live map'],['user','Applications'],['truck','Carriers'],['money','Finance'],['shield','Compliance'],['gauge','Pricing'],['doc','Catalog'],['star','Plans & Tiers'],['chat','Localization'],['filter','Reports']];
  return `<div style="width:250px;background:${C.ink};color:#fff;display:flex;flex-direction:column;flex-shrink:0;padding:22px 14px">
    <div style="display:flex;align-items:center;gap:11px;padding:6px 10px 22px">
      <div style="width:40px;height:40px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(26)}</div>
      <div style="font-weight:800;font-size:17px">NEXT <span style="color:${C.accent}">Freight</span></div>
    </div>
    ${items.map(([k,l])=>{const on=l===active;return `<div style="display:flex;align-items:center;gap:12px;padding:12px 12px;border-radius:11px;margin-bottom:3px;background:${on?'rgba(234,91,12,.16)':'transparent'};color:${on?'#fff':'rgba(255,255,255,.62)'};font-weight:${on?800:600};font-size:14.5px;${on?'box-shadow:inset 3px 0 0 '+C.accent:''}">${ic(k,on?C.accent:'rgba(255,255,255,.6)',20)} ${l}</div>`;}).join('')}
    <div style="flex:1"></div>
    <div style="display:flex;align-items:center;gap:11px;padding:12px;border-radius:12px;background:rgba(255,255,255,.06)"><div style="width:36px;height:36px;border-radius:50%;background:${C.accent};color:#20160a;font-weight:800;display:flex;align-items:center;justify-content:center">A</div><div><div style="font-weight:700;font-size:13.5px">Admin</div><div style="font-size:12px;color:rgba(255,255,255,.5)">Baghdad ops</div></div></div>
  </div>`;
}
function cpTopbar(title,sub){
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 30px;border-bottom:1px solid ${C.line};background:#fff">
    <div><div style="font-weight:800;font-size:22px">${title}</div><div style="color:${C.muted};font-size:13.5px;font-weight:600">${sub}</div></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="display:flex;align-items:center;gap:10px;background:${C.bg};border:1px solid ${C.line};border-radius:11px;padding:10px 14px;width:280px">${ic('search',C.muted,18)}<span style="color:${C.muted};font-size:14px">Search orders, carriers…</span></div>
      <div style="width:44px;height:44px;border-radius:12px;background:${C.bg};border:1px solid ${C.line};display:flex;align-items:center;justify-content:center;position:relative">${ic('bell',C.text,20)}<span style="position:absolute;top:9px;right:11px;width:8px;height:8px;background:${C.danger};border-radius:50%"></span></div>
    </div>
  </div>`;
}

function portalSidebar(active,{broker=false}={}){
  const name = broker?'Zagros Broker':'Al-Rafidain Fleet';
  const sub  = broker?'Broker portal':'Fleet portal';
  const initials = broker?'ZB':'RF';
  const items = broker
    ? [['grid','Overview'],['route','Claim board'],['box','My Orders'],['truck','Carriers'],['money','Wallet & Payouts'],['shield','Violations'],['filter','Reports'],['gauge','Settings']]
    : [['grid','Overview'],['box','My Orders'],['user','My Drivers'],['truck','My Vehicles'],['map','Live map'],['money','Wallet & Payouts'],['shield','Violations'],['filter','Reports'],['gauge','Settings']];
  return `<div style="width:250px;background:${C.ink};color:#fff;display:flex;flex-direction:column;flex-shrink:0;padding:22px 14px">
    <div style="display:flex;align-items:center;gap:11px;padding:6px 10px 10px">
      <div style="width:40px;height:40px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(26)}</div>
      <div style="font-weight:800;font-size:16px">NEXT <span style="color:${C.accent}">Freight</span></div>
    </div>
    <div style="margin:0 6px 16px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.06);display:flex;align-items:center;gap:10px">
      <div style="width:34px;height:34px;border-radius:9px;background:${broker?'#4F46E5':C.primary};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">${initials}</div>
      <div><div style="font-weight:800;font-size:13.5px">${name}</div><div style="font-size:11.5px;color:rgba(255,255,255,.55)">${sub}</div></div>
    </div>
    ${items.map(([k,l])=>{const on=l===active;return `<div style="display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:11px;margin-bottom:2px;background:${on?'rgba(234,91,12,.16)':'transparent'};color:${on?'#fff':'rgba(255,255,255,.62)'};font-weight:${on?800:600};font-size:14px;${on?'box-shadow:inset 3px 0 0 '+C.accent:''}">${ic(k,on?C.accent:'rgba(255,255,255,.6)',19)} ${l}</div>`;}).join('')}
    <div style="flex:1"></div>
    <div style="display:flex;align-items:center;gap:11px;padding:12px;border-radius:12px;background:rgba(255,255,255,.06)"><div style="width:36px;height:36px;border-radius:50%;background:${C.accent};color:#20160a;font-weight:800;display:flex;align-items:center;justify-content:center">${broker?'S':'K'}</div><div><div style="font-weight:700;font-size:13.5px">${broker?'Sami (Owner)':'Karim (Owner)'}</div><div style="font-size:12px;color:rgba(255,255,255,.5)">${broker?'Broker admin':'Fleet admin'}</div></div></div>
  </div>`;
}
function portalTop(title,sub){
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 30px;border-bottom:1px solid ${C.line};background:#fff">
    <div><div style="font-weight:800;font-size:22px">${title}</div><div style="color:${C.muted};font-size:13.5px;font-weight:600">${sub}</div></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="display:flex;align-items:center;gap:10px;background:${C.bg};border:1px solid ${C.line};border-radius:11px;padding:10px 14px;width:240px">${ic('search',C.muted,18)}<span style="color:${C.muted};font-size:14px">Search…</span></div>
      <div style="width:44px;height:44px;border-radius:12px;background:${C.bg};border:1px solid ${C.line};display:flex;align-items:center;justify-content:center;position:relative">${ic('bell',C.text,20)}<span style="position:absolute;top:9px;right:11px;width:8px;height:8px;background:${C.danger};border-radius:50%"></span></div>
    </div>
  </div>`;
}

// CP 01 Overview
add('control-panel/01-overview',1440,900,2, desktop(`
  ${cpSidebar('Overview')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Overview','Live operations · '+new Date().toDateString())}
    <div style="flex:1;padding:26px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:22px">
        ${[['Orders today','1,284','+8.2%','box'],['Active shipments','342','live','truck'],['Revenue (IQD)','48.2M','+12%','money'],['Avg rating','4.86','↑0.03','star']].map(([a,b,c,k])=>`
          <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:20px">
            <div style="display:flex;justify-content:space-between;align-items:center"><div style="width:42px;height:42px;border-radius:12px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic(k,C.primaryD,22)}</div><span style="font-weight:700;font-size:12.5px;color:${C.primary};background:${C.primaryL};padding:4px 9px;border-radius:999px">${c}</span></div>
            <div style="font-weight:800;font-size:30px;margin-top:14px">${b}</div><div style="color:${C.muted};font-size:13.5px;font-weight:600">${a}</div>
          </div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div style="font-weight:800;font-size:17px">Orders & revenue</div><div style="display:flex;gap:8px">${['Day','Week','Month'].map((t,i)=>`<span style="font-size:13px;font-weight:700;padding:6px 12px;border-radius:8px;background:${i==1?C.ink:C.bg};color:${i==1?'#fff':C.muted}">${t}</span>`).join('')}</div></div>
          <svg width="100%" height="230" viewBox="0 0 780 230" preserveAspectRatio="none">
            ${[0,1,2,3,4].map(i=>`<line x1="0" y1="${30+i*45}" x2="780" y2="${30+i*45}" stroke="${C.line}"/>`).join('')}
            ${[40,120,90,160,140,110,180,150,200,170,230,210].map((h,i,a)=>{const bw=780/a.length;return `<rect x="${i*bw+10}" y="${210-h}" width="${bw-20}" height="${h}" rx="5" fill="#FCE3CE"/>`;}).join('')}
            <path d="M50 150 C140 120,180 90,270 100 S430 60,520 70 640 40,730 35" fill="none" stroke="${C.primary}" stroke-width="3.5"/>
          </svg>
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px">
          <div style="font-weight:800;font-size:17px;margin-bottom:16px">Alerts</div>
          ${[['danger','2 drivers unreachable','Baghdad · 8m ago'],['warn','5 documents expiring','Within 7 days'],['warn','3 COD unsettled','Over grace period'],['primary','12 applications pending','Awaiting review']].map(([lv,a,b])=>`
            <div style="display:flex;gap:12px;padding:13px 0;border-bottom:1px solid ${C.line}">
              <div style="width:10px;height:10px;border-radius:50%;margin-top:5px;background:${lv==='danger'?C.danger:lv==='warn'?C.warn:C.primary}"></div>
              <div><div style="font-weight:700;font-size:14px">${a}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${b}</div></div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`));

// CP 02 Dispatch board
add('control-panel/02-dispatch',1440,900,2, desktop(`
  ${cpSidebar('Dispatch board')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Dispatch board','Unassigned & escalated orders')}
    <div style="flex:1;padding:24px 30px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:18px">
      ${[['Searching','8',C.warn],['Escalated · manual','3',C.danger],['Recently assigned','—',C.primary]].map(([t,n,col],col_i)=>`
        <div style="background:${C.bg};border:1px solid ${C.line};border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 6px"><span style="font-weight:800;font-size:15px">${t}</span><span style="background:${col};color:#fff;font-weight:800;font-size:12px;padding:3px 10px;border-radius:999px">${n}</span></div>
          ${[0,1,2].map(k=>`
            <div style="background:#fff;border:1px solid ${C.line};border-radius:14px;padding:15px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-weight:800;font-size:14px">#NF-204${18+col_i*3+k}</span><span style="font-size:12px;font-weight:700;color:${col};background:${col}1a;padding:3px 9px;border-radius:999px">SLA 0${col_i?1:2}:${(45-k*7).toString().padStart(2,'0')}</span></div>
              <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:${C.text};font-weight:600;margin-bottom:4px">${ic('pin',C.primary,15)} Baghdad → ${['Erbil','Basra','Mosul'][k]}</div>
              <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:${C.muted};font-weight:600">${ic('truck',C.muted,15)} Box · 3.${k+1} t · ${485-k*40}k IQD</div>
              ${col_i==1?`<button style="width:100%;margin-top:12px;border:0;background:${C.ink};color:#fff;font-weight:800;font-size:13px;padding:11px;border-radius:10px">Force-assign driver</button>`:col_i==0?`<div style="margin-top:10px;font-size:12px;color:${C.muted};font-weight:600">Round ${k+1}/3 · ${3+k} candidates</div>`:`<div style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12.5px;font-weight:700;color:${C.primary}">${ic('check',C.primary,15)} Karim A. · Platinum</div>`}
            </div>`).join('')}
        </div>`).join('')}
    </div>
  </div>`));

// CP 03 Orders table
add('control-panel/03-orders',1440,900,2, desktop(`
  ${cpSidebar('Orders')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Orders','1,284 total · 342 active')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;gap:10px;margin-bottom:16px">
        ${['All','Searching','In transit','At border','Delivered','Disputed'].map((t,i)=>`<span style="font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:10px;background:${i==0?C.ink:'#fff'};color:${i==0?'#fff':C.muted};border:1px solid ${i==0?C.ink:C.line}">${t}</span>`).join('')}
        <div style="flex:1"></div>
        <span style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:10px;background:#fff;border:1px solid ${C.line};color:${C.text}">${ic('filter',C.text,17)} Filters</span>
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:130px 1.4fr 1fr 120px 120px 130px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12.5px;color:${C.muted};letter-spacing:.4px">
          <div>ORDER</div><div>ROUTE</div><div>CARRIER</div><div>PAYMENT</div><div>TOTAL</div><div>STATUS</div>
        </div>
        ${[['#NF-20418','Baghdad → Erbil','Karim A.','Wallet','485,000','In transit',C.accentD,'#FFF4E0'],
           ['#NF-20417','Basra → Kuwait City','Al-Rafidain Fleet','Card','1,240,000','At border','#2563EB','#E5EDFF'],
           ['#NF-20416','Mosul → Baghdad','Ahmed S.','COD','312,000','Searching',C.warn,'#FFF6E0'],
           ['#NF-20415','Baghdad → Najaf','Karim A.','Wallet','96,000','Delivered',C.primaryD,C.primaryL],
           ['#NF-20414','Erbil → Habur (TR)','Zagros Broker','Card','2,180,000','Customs',C.accentD,'#FFF4E0'],
           ['#NF-20413','Baghdad → Basra','Ali M.','Wallet','528,000','Delivered',C.primaryD,C.primaryL],
           ['#NF-20412','Karbala → Baghdad','—','Card','204,000','Disputed',C.danger,'#FEECEC']].map((r,i)=>`
          <div style="display:grid;grid-template-columns:130px 1.4fr 1fr 120px 120px 130px;padding:16px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="font-weight:800">${r[0]}</div>
            <div style="display:flex;align-items:center;gap:8px;font-weight:600">${ic('route',C.primary,16)} ${r[1]}</div>
            <div style="color:${C.text};font-weight:600">${r[2]}</div>
            <div style="color:${C.muted};font-weight:600">${r[3]}</div>
            <div style="font-weight:800" class="mono">${r[4]}</div>
            <div><span style="font-weight:800;font-size:12px;padding:5px 11px;border-radius:999px;background:${r[7]};color:${r[6]}">${r[5]}</span></div>
          </div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;color:${C.muted};font-size:13.5px;font-weight:600"><span>Showing 1–7 of 1,284</span><div style="display:flex;gap:6px">${['‹','1','2','3','…','184','›'].map((p,i)=>`<span style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-weight:700;background:${p==='1'?C.ink:'#fff'};color:${p==='1'?'#fff':C.text};border:1px solid ${C.line}">${p}</span>`).join('')}</div></div>
    </div>
  </div>`));

// CP 04 Pricing / rate card
add('control-panel/04-pricing',1440,900,2, desktop(`
  ${cpSidebar('Pricing')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Pricing · Iraq rate card','Version 7 · effective 2026-07-01 · IQD')}
    <div style="flex:1;padding:24px 30px;overflow:hidden;display:grid;grid-template-columns:1.5fr 1fr;gap:20px">
      <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div style="font-weight:800;font-size:17px">Factors</div><span style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:13px;color:#fff;background:${C.primary};padding:8px 14px;border-radius:10px">${ic('plus','#fff',16)} Add factor</span></div>
        ${[['Base','base_fare','fixed','120,000'],['Base','min_fare','fixed','90,000'],['Distance','rate_per_km','per_km · tiered','650'],['Weight','rate_per_ton','per_ton','18,000'],['Vehicle','box_truck','multiplier','×1.15'],['Time','night_surcharge','multiplier','×1.10'],['Stops','stop_fee','per_stop','15,000'],['Commercial','commission','percent','15%']].map((r,i)=>`
          <div style="display:grid;grid-template-columns:110px 1fr 130px 110px;padding:13px 0;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div>${chip(r[0],{bg:C.bg,c:C.muted})}</div>
            <div style="font-weight:800;font-family:ui-monospace,monospace">${r[1]}</div>
            <div style="color:${C.muted};font-weight:600">${r[2]}</div>
            <div style="font-weight:800;text-align:right" class="mono">${r[3]}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;flex-direction:column;gap:20px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px">
          <div style="font-weight:800;font-size:17px;margin-bottom:6px">Price simulator</div>
          <div style="color:${C.muted};font-size:13px;font-weight:600;margin-bottom:16px">Baghdad → Erbil · Box · 3.2 t · night</div>
          <div style="background:linear-gradient(135deg,#C0480A,#F7902E);border-radius:14px;padding:18px;color:#fff;margin-bottom:14px">
            <div style="opacity:.8;font-size:13px;font-weight:600">Computed total</div><div style="font-size:32px;font-weight:800">485,000 <span style="font-size:16px;opacity:.8">IQD</span></div>
          </div>
          ${[['Base + distance','352,000'],['Multipliers','+95,000'],['Surcharges','+38,000']].map(([a,b])=>`<div style="display:flex;justify-content:space-between;padding:9px 0;font-size:13.5px;font-weight:600"><span style="color:${C.muted}">${a}</span><span class="mono" style="font-weight:800">${b}</span></div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px">
          <div style="font-weight:800;font-size:16px;margin-bottom:6px">Publish diff</div>
          <div style="color:${C.muted};font-size:13px;font-weight:600;margin-bottom:14px">vs last 1,000 orders</div>
          <div style="display:flex;align-items:center;gap:12px"><div style="font-size:30px;font-weight:800;color:${C.primary}">+4.2%</div><div style="font-size:13px;color:${C.muted};font-weight:600">avg price change</div></div>
          <button style="width:100%;margin-top:16px;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Publish version 8</button>
        </div>
      </div>
    </div>
  </div>`));

// CP 05 Live map
add('control-panel/05-livemap',1440,900,2, desktop(`
  ${cpSidebar('Live map')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Live map','342 active drivers · Iraq')}
    <div style="flex:1;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0">${mapSvg(1190,780,{route:false})}</div>
      ${[[0.28,0.34,C.primary],[0.52,0.5,C.accent],[0.4,0.66,C.primary],[0.68,0.4,C.primary],[0.6,0.72,C.danger],[0.22,0.6,C.primary],[0.75,0.6,C.accent]].map(([x,y,c])=>`<div style="position:absolute;left:${x*100}%;top:${y*100}%;transform:translate(-50%,-100%)">${pinShape(c)}</div>`).join('')}
      <div style="position:absolute;top:22px;left:22px;background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px;width:240px;box-shadow:0 10px 30px rgba(0,0,0,.1)">
        <div style="font-weight:800;font-size:15px;margin-bottom:14px">Fleet status</div>
        ${[['On trip','218',C.primary],['Available','96',C.accent],['SOS / alert','1',C.danger]].map(([a,b,c])=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0"><div style="width:11px;height:11px;border-radius:50%;background:${c}"></div><span style="flex:1;font-weight:600;font-size:14px">${a}</span><span style="font-weight:800;font-size:14px">${b}</span></div>`).join('')}
      </div>
      <div style="position:absolute;bottom:24px;left:22px;background:${C.ink};color:#fff;border-radius:16px;padding:16px 18px;width:280px;box-shadow:0 10px 30px rgba(0,0,0,.2)">
        <div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px;color:${C.danger};margin-bottom:8px">${ic('shield',C.danger,18)} SOS · Driver Ali M.</div>
        <div style="font-size:13px;opacity:.8;font-weight:600;line-height:1.4">Order #NF-20399 · near Fallujah highway. Emergency contacts notified.</div>
        <button style="width:100%;margin-top:12px;border:0;background:${C.danger};color:#fff;font-weight:800;font-size:13px;padding:11px;border-radius:10px">Open incident</button>
      </div>
    </div>
  </div>`));

// CP 00 Staff login (email + password + TOTP)
add('control-panel/00-login',1440,900,2, desktop(`
  <div style="flex:1;display:flex">
    <div style="flex:1.1;background:linear-gradient(160deg,#0F0C09,#1C1712 55%,#C0480A);position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:48px 52px;color:#fff">
      <div style="display:flex;align-items:center;gap:12px"><div style="width:46px;height:46px;border-radius:13px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(30)}</div><div style="font-weight:800;font-size:20px">NEXT <span style="color:${C.accent}">Freight</span></div></div>
      <div><h1 style="font-size:38px;font-weight:800;line-height:1.15;margin:0 0 14px">Control Panel</h1><p style="font-size:16px;opacity:.7;line-height:1.5;max-width:420px">Operations, dispatch, finance and compliance for the NEXT Freight platform.</p></div>
      <div style="font-size:13px;opacity:.5">Staff access only · all actions are audited</div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#fff">
      <div style="width:400px">
        <h2 style="font-size:24px;font-weight:800;margin:0 0 4px">Sign in</h2>
        <p style="color:${C.muted};font-size:14px;margin:0 0 24px">Use your staff account with two-factor.</p>
        ${[['EMAIL','admin@nextfreight.iq',false],['PASSWORD','••••••••••••',true]].map(([l,v,pw])=>`<div style="margin-bottom:16px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">${l}</div><div style="height:52px;border:1.5px solid ${pw?C.line:C.primary};border-radius:12px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-weight:700;font-size:15px">${v}${pw?`<span style="color:${C.muted};font-size:13px">Show</span>`:''}</div></div>`).join('')}
        <div style="margin-bottom:18px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">2FA CODE (TOTP)</div>
          <div style="display:flex;gap:9px">${['4','8','1','','',''].map((d,i)=>`<div style="flex:1;height:52px;display:flex;align-items:center;justify-content:center;border:1.5px solid ${d?C.primary:(i===3?C.ink:C.line)};border-radius:11px;font-weight:800;font-size:20px">${d}</div>`).join('')}</div>
        </div>
        <button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:16px;padding:16px;border-radius:13px">Sign in</button>
        <div style="text-align:center;color:${C.muted};font-size:13.5px;font-weight:700;margin-top:16px">Forgot password?</div>
      </div>
    </div>
  </div>`));

// CP 06 Applications (approval inbox + review)
add('control-panel/06-applications',1440,900,2, desktop(`
  ${cpSidebar('Applications')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Applications','14 pending review · carriers, fleets & brokers')}
    <div style="flex:1;overflow:hidden;display:grid;grid-template-columns:300px 1fr">
      <div style="border-right:1px solid ${C.line};background:#fff;overflow:hidden;padding:14px">
        ${[['Al-Rafidain Fleet Co.','Fleet · 24 vehicles',true],['Karim Aziz','Individual driver',false],['Zagros Broker','Broker company',false],['Tigris Transport','Fleet · 12 vehicles',false],['Nabil Rashid','Individual driver',false]].map(([n,t,on])=>`
          <div style="display:flex;align-items:center;gap:11px;padding:13px;border-radius:12px;margin-bottom:8px;background:${on?C.primaryL:'#fff'};border:1.5px solid ${on?C.primary:C.line}">
            <div style="width:38px;height:38px;border-radius:10px;background:${on?C.primary:C.ink};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center">${n[0]}</div>
            <div style="flex:1"><div style="font-weight:800;font-size:13.5px">${n}</div><div style="color:${C.muted};font-size:12px;font-weight:600">${t}</div></div></div>`).join('')}
      </div>
      <div style="padding:22px 26px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
          <div><div style="font-weight:800;font-size:20px">Al-Rafidain Fleet Co.</div><div style="color:${C.muted};font-size:13.5px;font-weight:600">Fleet application · submitted 2 Aug · Baghdad</div></div>
          <div style="display:flex;align-items:center;gap:8px;background:#FEECEC;color:${C.danger};font-weight:800;font-size:12.5px;padding:8px 13px;border-radius:999px">${ic('shield',C.danger,16)} Similar phone on file — review</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
          <div style="background:#fff;border:1px solid ${C.line};border-radius:14px;padding:18px">
            <div style="font-weight:800;font-size:14px;margin-bottom:12px">Company details</div>
            ${[['Commercial reg.','IQ-CR-88214'],['Country','Iraq'],['Fleet size','24 vehicles'],['Owner','Karim Aziz'],['Owner phone','+964 781 ••• 9032']].map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;padding:9px 0;${i?'border-top:1px solid '+C.line:''}"><span style="color:${C.muted};font-weight:600;font-size:13px">${a}</span><span style="font-weight:800;font-size:13px">${b}</span></div>`).join('')}
          </div>
          <div style="background:#fff;border:1px solid ${C.line};border-radius:14px;padding:18px">
            <div style="font-weight:800;font-size:14px;margin-bottom:12px">Documents</div>
            ${[['Commercial registration','check',C.primary],['Owner ID','check',C.primary],['Tax card','check',C.primary],['Operating permit','clock',C.warn]].map(([t,k,c],i)=>`<div style="display:flex;align-items:center;gap:11px;padding:10px 0;${i?'border-top:1px solid '+C.line:''}"><div style="width:34px;height:34px;border-radius:9px;background:${C.bg};display:flex;align-items:center;justify-content:center">${ic('doc',C.muted,18)}</div><span style="flex:1;font-weight:700;font-size:13px">${t}</span>${ic(k,c,18)}<span style="color:${C.primary};font-weight:800;font-size:12.5px">View</span></div>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:22px">
          <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px 22px;border-radius:12px">Request changes</button>
          <button style="border:1.5px solid ${C.danger};background:#fff;color:${C.danger};font-weight:800;font-size:14px;padding:13px 22px;border-radius:12px">Reject</button>
          <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:13px;border-radius:12px">Approve & activate</button>
        </div>
      </div>
    </div>
  </div>`));

// CP 07 Carriers
add('control-panel/07-carriers',1440,900,2, desktop(`
  ${cpSidebar('Carriers')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Carriers','1,204 carriers · drivers, fleets & brokers')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;margin-bottom:16px">
        <div style="display:flex;gap:9px">${['All','Individual drivers','Fleets','Brokers','Suspended'].map((t,i)=>`<span style="font-weight:700;font-size:13px;padding:9px 15px;border-radius:10px;background:${i==0?C.ink:'#fff'};color:${i==0?'#fff':C.muted};border:1px solid ${i==0?C.ink:C.line}">${t}</span>`).join('')}</div>
        <div style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid ${C.line};border-radius:10px;padding:9px 14px;width:240px">${ic('search',C.muted,17)}<span style="color:${C.muted};font-size:13.5px">Search carriers…</span></div>
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1.4fr 1fr .8fr .8fr 1fr 1fr 130px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12px;color:${C.muted}"><div>CARRIER</div><div>TYPE</div><div>TIER</div><div>RATING</div><div>DOCS</div><div>WALLET (IQD)</div><div>ACTIONS</div></div>
        ${[['Al-Rafidain Fleet','Fleet · 24','Gold','4.8','Valid',C.primary,'4,120,000','Active',C.primary],
           ['Karim Aziz','Individual','Platinum','4.9','Valid',C.primary,'880,000','Active',C.primary],
           ['Tigris Transport','Fleet · 12','Silver','4.6','2 expiring',C.warn,'1,340,000','Active',C.primary],
           ['Omar Khalil','Individual','Bronze','4.4','Expired',C.danger,'120,000','Suspended',C.danger],
           ['Zagros Broker','Broker','Silver','4.7','Valid',C.primary,'2,010,000','Active',C.primary]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.4fr 1fr .8fr .8fr 1fr 1fr 130px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="display:flex;align-items:center;gap:11px"><div style="width:36px;height:36px;border-radius:9px;background:${C.primaryL};color:${C.primaryD};font-weight:800;display:flex;align-items:center;justify-content:center">${r[0][0]}</div><div style="font-weight:800">${r[0]}</div></div>
            <div style="color:${C.muted};font-weight:600">${r[1]}</div><div>${chip(r[2],{bg:C.bg,c:C.text})}</div><div style="font-weight:800">★ ${r[3]}</div>
            <div style="font-weight:700;color:${r[5]}">${r[4]}</div><div class="mono" style="font-weight:700">${r[6]}</div>
            <div><span style="font-weight:800;font-size:12px;color:${r[8]}">● ${r[7]}</span></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// CP 08 Finance
add('control-panel/08-finance',1440,900,2, desktop(`
  ${cpSidebar('Finance')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Finance','Escrow, COD, payouts & invoices · Iraq')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
        ${[['Escrow balance','86.4M',C.primary],['Commission (MTD)','7.2M',C.primary],['COD held','12.9M',C.accentD],['COD overdue','1.1M',C.danger]].map(([a,b,c])=>`<div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px"><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div><div style="font-weight:800;font-size:24px;margin-top:8px;color:${c}"><span class="mono">${b}</span> <span style="font-size:.5em;color:${C.muted}">IQD</span></div></div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div style="font-weight:800;font-size:16px">Payout requests</div><button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:13px;padding:10px 16px;border-radius:10px;display:flex;align-items:center;gap:7px">${ic('doc',C.text,16)} Export CSV</button></div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 200px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12px;color:${C.muted}"><div>CARRIER</div><div>METHOD</div><div>AMOUNT (IQD)</div><div>REQUESTED</div><div>ACTIONS</div></div>
        ${[['Al-Rafidain Fleet','Bank · IBAN ••• 8842','2,000,000','2h ago'],['Karim Aziz','ZainCash','640,000','5h ago'],['Tigris Transport','Bank · IBAN ••• 1120','1,250,000','1d ago']].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 200px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="font-weight:800">${r[0]}</div><div style="color:${C.muted};font-weight:600">${r[1]}</div><div class="mono" style="font-weight:800">${r[2]}</div><div style="color:${C.muted};font-weight:600">${r[3]}</div>
            <div style="display:flex;gap:8px"><button style="border:1.5px solid ${C.line};background:#fff;color:${C.danger};font-weight:800;font-size:12.5px;padding:9px 14px;border-radius:9px">Reject</button><button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:12.5px;padding:9px 16px;border-radius:9px">Approve</button></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// CP 09 Compliance
add('control-panel/09-compliance',1440,900,2, desktop(`
  ${cpSidebar('Compliance')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Compliance','Violations, decisions & appeals')}
    <div style="flex:1;padding:22px 30px;overflow:hidden;display:grid;grid-template-columns:1.5fr 1fr;gap:18px">
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px;overflow:hidden">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px">Pending decisions</div>
        ${[['Omar Khalil','Repeated late cancellations · 5 pts','Suspend','high'],['Nabil Rashid','Expired licence while online','Suspend','high'],['Hassan D.','2 no-shows in 7 days · 3 pts','Warn','med']].map(([n,r,act,sev],i)=>`
          <div style="display:flex;align-items:center;gap:13px;padding:15px 0;${i?'border-top:1px solid '+C.line:''}">
            <div style="width:40px;height:40px;border-radius:10px;background:${sev==='high'?'#FEECEC':'#FFF6E0'};display:flex;align-items:center;justify-content:center">${ic('shield',sev==='high'?C.danger:C.accentD,20)}</div>
            <div style="flex:1"><div style="font-weight:800;font-size:14px">${n}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${r}</div></div>
            <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:12px;padding:9px 13px;border-radius:9px">Dismiss</button>
            <button style="border:0;background:${sev==='high'?C.danger:C.accent};color:${sev==='high'?'#fff':'#20160a'};font-weight:800;font-size:12px;padding:9px 15px;border-radius:9px">${act}</button>
          </div>`).join('')}
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px">Risk leaderboard</div>
        ${[['Omar Khalil','12 pts',C.danger],['Nabil Rashid','9 pts',C.danger],['Hassan D.','6 pts',C.warn],['Ali M.','2 pts',C.muted]].map(([n,p,c],i)=>`<div style="display:flex;align-items:center;gap:11px;padding:12px 0;${i?'border-top:1px solid '+C.line:''}"><div style="width:26px;font-weight:800;color:${C.muted}">${i+1}</div><span style="flex:1;font-weight:700;font-size:14px">${n}</span><span style="font-weight:800;font-size:13.5px;color:${c}">${p}</span></div>`).join('')}
        <button style="width:100%;margin-top:14px;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:13.5px;padding:12px;border-radius:11px">Open rule builder</button>
      </div>
    </div>
  </div>`));

// CP 10 Catalog & Countries
add('control-panel/10-catalog',1440,900,2, desktop(`
  ${cpSidebar('Catalog')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Catalog & Countries','Everything below is data, not code')}
    <div style="flex:1;padding:22px 30px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div style="font-weight:800;font-size:16px">Iraq · configuration</div>${chip('Active',{bg:C.primaryL,c:C.primaryD})}</div>
        ${[['Currency','IQD · 0 decimals'],['Phone code','+964'],['Commission','15%'],['Cancellation fee','10%'],['VAT','0%'],['Payment methods','ZainCash, Card, Wallet']].map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;${i?'border-top:1px solid '+C.line:''}"><span style="color:${C.muted};font-weight:600;font-size:13.5px">${a}</span><span style="font-weight:800;font-size:13.5px">${b}</span></div>`).join('')}
        <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-top:1px solid ${C.line}"><span style="color:${C.muted};font-weight:600;font-size:13.5px">Cash on delivery</span><div style="width:44px;height:26px;border-radius:999px;background:${C.line};position:relative"><div style="position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff"></div></div></div>
        <button style="width:100%;margin-top:12px;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:14px;padding:13px;border-radius:11px">Edit country</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="font-weight:800;font-size:15px">Vehicle types</div><span style="color:${C.primary};font-weight:800;font-size:13px">+ Add</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">${['Box truck','Flatbed','Trailer','Refrigerated','Tanker','Dump truck','Container chassis','Lowbed'].map(t=>`<span style="padding:8px 13px;border-radius:999px;font-weight:700;font-size:12.5px;background:${C.bg};color:${C.text};border:1px solid ${C.line}">${t}</span>`).join('')}</div>
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="font-weight:800;font-size:15px">Cargo types</div><span style="color:${C.primary};font-weight:800;font-size:13px">+ Add</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">${['Foodstuff','Furniture','Construction','Machinery','Livestock'].map(t=>`<span style="padding:8px 13px;border-radius:999px;font-weight:700;font-size:12.5px;background:${C.bg};color:${C.text};border:1px solid ${C.line}">${t}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>`));

// CP 11 Plans & Tiers
add('control-panel/11-plans-tiers',1440,900,2, desktop(`
  ${cpSidebar('Plans & Tiers')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Plans & Tiers','Client subscription plans & carrier tiers · Iraq')}
    <div style="flex:1;padding:22px 30px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px">Client plans</div>
        ${[['Free','0','Base',C.line],['Plus','120,000','5% discount · priority',C.primary],['Business','390,000','10% · invoicing · API',C.primary]].map(([n,p,d,c])=>`
          <div style="display:flex;align-items:center;gap:13px;padding:14px;border-radius:12px;margin-bottom:10px;border:1.5px solid ${c}">
            <div style="flex:1"><div style="font-weight:800;font-size:15px">${n}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${d}</div></div>
            <div style="font-weight:800;font-size:15px" class="mono">${p}</div><span style="color:${C.muted};font-size:12px">IQD/mo</span>
            <span style="color:${C.primary};font-weight:800;font-size:12.5px">Edit</span>
          </div>`).join('')}
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px">Carrier tiers</div>
        ${[['Bronze','0','×1.0',C.accentD],['Silver','200','×1.1',C.muted],['Gold','500','×1.25',C.accent],['Platinum','1000','×1.4',C.primaryD]].map(([n,pts,w,c])=>`
          <div style="display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid ${C.line}">
            <div style="width:12px;height:12px;border-radius:50%;background:${c}"></div>
            <div style="flex:1"><div style="font-weight:800;font-size:14px">${n}</div><div style="color:${C.muted};font-size:12px;font-weight:600">≥ ${pts} score · dispatch ${w}</div></div>
            <span style="color:${C.primary};font-weight:800;font-size:12.5px">Edit</span>
          </div>`).join('')}
        <button style="width:100%;margin-top:14px;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:13.5px;padding:12px;border-radius:11px">Edit scoring weights</button>
      </div>
    </div>
  </div>`));

// CP 12 Localization
add('control-panel/12-localization',1440,900,2, desktop(`
  ${cpSidebar('Localization')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Localization','Languages & translation keys')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="display:flex;gap:9px">${[['العربية · ar','RTL · active',true],['English · en','LTR · active',true],['Kurdish · ku','inactive',false],['Turkish · tr','inactive',false]].map(([n,s,on])=>`<div style="padding:9px 14px;border-radius:10px;background:${on?C.primaryL:'#fff'};border:1px solid ${on?C.primary:C.line}"><div style="font-weight:800;font-size:12.5px;color:${on?C.primaryD:C.text}">${n}</div><div style="font-size:10.5px;color:${C.muted};font-weight:600">${s}</div></div>`).join('')}</div>
        <div style="display:flex;gap:9px"><button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:13px;padding:10px 16px;border-radius:10px">Import CSV</button><button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:13px;padding:10px 18px;border-radius:10px">Publish bundle</button></div>
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;padding:13px 20px;background:${C.bg}"><div style="display:flex;align-items:center;gap:8px;width:300px">${ic('search',C.muted,16)}<span style="color:${C.muted};font-size:13px">Search keys…</span></div><span style="font-weight:800;font-size:12.5px;color:${C.danger}">⚠ 6 missing in Kurdish</span></div>
        <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 90px;padding:12px 20px;background:${C.bg};border-top:1px solid ${C.line};font-weight:800;font-size:12px;color:${C.muted}"><div>KEY</div><div>ARABIC</div><div>ENGLISH</div><div></div></div>
        ${[['error.order.weight_exceeds','الوزن يتجاوز السعة','Weight exceeds capacity',true],['order.status.searching','جاري البحث عن سائق','Searching for a driver',true],['payment.cod.unavailable','الدفع عند الاستلام غير متاح','COD unavailable',true],['tier.gold.benefit','ميزة الذهبي','—',false]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 90px;padding:14px 20px;align-items:center;font-size:13px;${i?'border-top:1px solid '+C.line:''}">
            <div style="font-family:ui-monospace,monospace;font-size:12px;color:${C.muted}">${r[0]}</div><div style="font-weight:600" dir="rtl">${r[1]}</div><div style="font-weight:600;color:${r[3]?C.text:C.danger}">${r[2]}</div><div style="color:${C.primary};font-weight:800;font-size:12.5px">Edit</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// CP 13 Reports
add('control-panel/13-reports',1440,900,2, desktop(`
  ${cpSidebar('Reports')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Reports','Analytics & exports · Iraq')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
        ${[['Orders (MTD)','18,402','+8.2%'],['Revenue','48.2M IQD','+12%'],['Accept rate','91%','+1.4%'],['Avg time-to-assign','2m 40s','-18s']].map(([a,b,c])=>`<div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px"><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div><div style="font-weight:800;font-size:22px;margin-top:8px">${b}</div><div style="color:${C.primary};font-size:12.5px;font-weight:700">${c}</div></div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="font-weight:800;font-size:16px">Orders & revenue trend</div><button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:12.5px;padding:9px 14px;border-radius:9px">Export XLSX</button></div>
          <svg width="100%" height="180" viewBox="0 0 560 180" preserveAspectRatio="none">
            ${[40,70,55,90,80,120,110,140,130,160].map((v,i,a)=>{const x=i*(560/(a.length-1));return `<rect x="${x-14}" y="${180-v}" width="24" height="${v}" rx="5" fill="${C.primaryL}"/>`;}).join('')}
            <polyline points="${[50,80,65,100,95,135,120,150,145,170].map((v,i,a)=>`${i*(560/(a.length-1))},${180-v}`).join(' ')}" fill="none" stroke="${C.primary}" stroke-width="3"/>
          </svg>
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:16px;margin-bottom:14px">Saved reports</div>
          ${[['Carrier performance','Weekly · email'],['COD aging','Daily'],['Cancellation reasons','Monthly'],['Dispatch efficiency','Weekly']].map(([t,s],i)=>`<div style="display:flex;align-items:center;gap:11px;padding:12px 0;${i?'border-top:1px solid '+C.line:''}">${ic('filter',C.primary,20)}<div style="flex:1"><div style="font-weight:700;font-size:13.5px">${t}</div><div style="color:${C.muted};font-size:12px;font-weight:600">${s}</div></div>${ic('doc',C.muted,18)}</div>`).join('')}
        </div>
      </div>
    </div>
  </div>`));

/* ---- CP shared helpers for forms & modals ---- */
function cpField(l,v,{sel=false,focus=false,pad=true}={}){
  return `<div><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:6px;letter-spacing:.02em">${l}</div><div style="height:48px;border:1.5px solid ${focus?C.primary:C.line};border-radius:11px;display:flex;align-items:center;justify-content:space-between;${pad?'padding:0 14px;':''}font-weight:700;font-size:14px;background:${sel?C.bg:'#fff'}">${v}${sel?`<span style="color:${C.muted};font-size:13px;padding-right:14px">▾</span>`:''}</div></div>`;
}
function cpToggle(on){return `<div style="width:44px;height:26px;border-radius:999px;background:${on?C.primary:C.line};position:relative;flex-shrink:0"><div style="position:absolute;top:3px;${on?'right:3px':'left:3px'};width:20px;height:20px;border-radius:50%;background:#fff"></div></div>`;}
function cpModal(active,title,sub,w,inner){
  return desktop(`
  ${cpSidebar(active)}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
    ${cpTopbar(title,sub)}
    <div style="flex:1;background:${C.bg}"></div>
    <div style="position:absolute;inset:0;background:rgba(6,18,13,.5);display:flex;align-items:center;justify-content:center">
      <div style="width:${w}px;max-height:88%;overflow:hidden;background:#fff;border-radius:22px;padding:28px 32px;box-shadow:0 40px 100px rgba(0,0,0,.45)">${inner}</div>
    </div>
  </div>`);
}
const modalHead=(t,s)=>`<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px"><div><h1 style="font-size:22px;font-weight:800;margin:0 0 4px">${t}</h1><p style="color:${C.muted};font-size:13.5px;margin:0;max-width:440px;line-height:1.4">${s}</p></div><span style="font-size:22px;color:${C.muted}">✕</span></div>`;

// CP 02b Force-assign driver (dispatch override modal)
add('control-panel/02b-force-assign',1440,900,2, cpModal('Dispatch board','Dispatch board','Manual override · #NF-20421',620,`
  ${modalHead('Force-assign a driver','Skips the automatic offer rounds and hands the order directly to one driver. Use when auto-dispatch stalls. This action is audited.')}
  <div style="display:flex;align-items:center;gap:10px;background:${C.bg};border:1px solid ${C.line};border-radius:12px;padding:12px 14px;margin-bottom:16px">
    ${ic('box',C.primaryD,20)}<div style="flex:1"><div style="font-weight:800;font-size:13.5px">#NF-20421 · Baghdad → Erbil</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">Box truck · 3.5 t · 485k IQD · escalated after 3 rounds</div></div>
  </div>
  <div style="display:flex;align-items:center;gap:8px;background:${C.bg};border:1px solid ${C.line};border-radius:10px;padding:10px 13px;margin-bottom:12px">${ic('search',C.muted,17)}<span style="color:${C.muted};font-size:13.5px">Search available drivers near pickup…</span></div>
  ${[['Karim Aziz','Platinum · 4.9','2.1 km · Available',true],['Ali Mahmoud','Gold · 4.7','5.4 km · Available',false],['Zaid Hassan','Silver · 4.6','8.0 km · Available',false]].map(([n,t,d,on])=>`
    <div style="display:flex;align-items:center;gap:12px;padding:13px;border-radius:12px;margin-bottom:9px;border:1.5px solid ${on?C.primary:C.line};background:${on?C.primaryL:'#fff'}">
      <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${on?C.primary:C.line};display:flex;align-items:center;justify-content:center">${on?`<div style="width:10px;height:10px;border-radius:50%;background:${C.primary}"></div>`:''}</div>
      <div style="width:38px;height:38px;border-radius:10px;background:${C.ink};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center">${n[0]}</div>
      <div style="flex:1"><div style="font-weight:800;font-size:14px">${n}</div><div style="color:${C.muted};font-size:12px;font-weight:600">${t}</div></div>
      <div style="text-align:right;font-weight:700;font-size:12.5px;color:${C.primary}">${d}</div>
    </div>`).join('')}
  <div style="margin-top:14px">${cpField('REASON FOR OVERRIDE (AUDITED)','No driver accepted after 3 rounds',{sel:true})}</div>
  <div style="display:flex;gap:12px;margin-top:22px">
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
    <button style="flex:1;border:0;background:${C.ink};color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Assign order to Karim</button>
  </div>`));

// CP 05b Incident detail (from live map "Open incident")
add('control-panel/05b-incident',1440,900,2, cpModal('Live map','Live map','SOS incident · Driver Ali M.',600,`
  ${modalHead('SOS incident · #NF-20399','Raised by the driver from the app. Emergency contacts were notified automatically.')}
  <div style="display:flex;gap:10px;margin-bottom:16px">
    <span style="display:inline-flex;align-items:center;gap:7px;background:#FEECEC;color:${C.danger};font-weight:800;font-size:12.5px;padding:8px 13px;border-radius:999px">${ic('shield',C.danger,16)} Critical · SOS</span>
    <span style="display:inline-flex;align-items:center;gap:7px;background:#FFF6E0;color:${C.accentD};font-weight:800;font-size:12.5px;padding:8px 13px;border-radius:999px">${ic('clock',C.accentD,16)} 4 min ago</span>
  </div>
  <div style="background:#fff;border:1px solid ${C.line};border-radius:14px;padding:18px;margin-bottom:16px">
    ${[['Driver','Ali Mahmoud'],['Phone','+964 771 ••• 4408'],['Order','#NF-20399 · Baghdad → Ramadi'],['Location','Near Fallujah highway, km 58'],['Vehicle','21 A 4482 · Box truck']].map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;padding:9px 0;${i?'border-top:1px solid '+C.line:''}"><span style="color:${C.muted};font-weight:600;font-size:13px">${a}</span><span style="font-weight:800;font-size:13px">${b}</span></div>`).join('')}
  </div>
  <div style="background:${C.bg};border-radius:12px;padding:14px 16px;margin-bottom:18px">
    <div style="font-weight:800;font-size:12.5px;color:${C.muted};margin-bottom:10px">TIMELINE</div>
    ${[['SOS button pressed by driver','4 min ago',C.danger],['Emergency contacts notified','4 min ago',C.accentD],['Ops acknowledged','2 min ago',C.primary]].map(([t,tm,c])=>`<div style="display:flex;gap:10px;align-items:center;padding:6px 0"><div style="width:9px;height:9px;border-radius:50%;background:${c}"></div><span style="flex:1;font-weight:700;font-size:13px">${t}</span><span style="color:${C.muted};font-size:12px;font-weight:600">${tm}</span></div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('phone',C.text,17)} Call driver</button>
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px;border-radius:12px">Reassign order</button>
    <button style="border:1.5px solid ${C.danger};background:#fff;color:${C.danger};font-weight:800;font-size:14px;padding:13px;border-radius:12px">Notify authorities</button>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:14px;padding:13px;border-radius:12px">Mark resolved</button>
  </div>`));

// CP 06b Request changes (applications modal)
add('control-panel/06b-request-changes',1440,900,2, cpModal('Applications','Applications','Al-Rafidain Fleet Co. · request changes',620,`
  ${modalHead('Request changes','Tick each item to fix and add a note. The application returns as CHANGES_REQUESTED and the applicant resubmits only these items.')}
  ${[['Operating permit','Document expired — upload a currently valid permit.',true],['Owner ID','Back side is blurry — re-scan in good light.',true],['Fleet size','Declared 24 but 8 vehicle docs missing — add the rest.',false]].map(([t,note,on])=>`
    <div style="border:1.5px solid ${on?C.primary:C.line};border-radius:13px;padding:14px;margin-bottom:11px;background:${on?C.primaryL:'#fff'}">
      <div style="display:flex;align-items:center;gap:11px">
        <div style="width:22px;height:22px;border-radius:6px;background:${on?C.primary:'#fff'};border:1.5px solid ${on?C.primary:C.line};display:flex;align-items:center;justify-content:center">${on?ic('check','#fff',15):''}</div>
        <span style="font-weight:800;font-size:14px;flex:1">${t}</span>
      </div>
      ${on?`<div style="margin-top:10px;background:#fff;border:1.5px solid ${C.line};border-radius:10px;padding:10px 12px;font-size:13px;color:${C.text};font-weight:600">${note}</div>`:''}
    </div>`).join('')}
  <div style="margin-top:6px"><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:6px">MESSAGE TO APPLICANT (OPTIONAL)</div><div style="border:1.5px solid ${C.line};border-radius:11px;padding:12px 14px;font-size:13px;color:${C.muted};font-weight:600;min-height:56px">Please resubmit the flagged items within 7 days to continue verification.</div></div>
  <div style="display:flex;gap:12px;margin-top:22px">
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
    <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Send back to applicant</button>
  </div>`));

// CP 07b Carrier detail & actions (edit carrier, change tier, manual payout, suspend)
add('control-panel/07b-carrier-detail',1440,900,2, desktop(`
  ${cpSidebar('Carriers')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Carrier · Al-Rafidain Fleet Co.','Fleet · joined Mar 2025 · Baghdad')}
    <div style="flex:1;padding:22px 30px;overflow:hidden;display:grid;grid-template-columns:1.5fr 1fr;gap:18px">
      <div style="display:flex;flex-direction:column;gap:18px;overflow:hidden">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px;display:flex;align-items:center;gap:16px">
          <div style="width:60px;height:60px;border-radius:14px;background:${C.primaryL};color:${C.primaryD};font-weight:800;font-size:24px;display:flex;align-items:center;justify-content:center">A</div>
          <div style="flex:1"><div style="font-weight:800;font-size:19px">Al-Rafidain Fleet Co.</div><div style="color:${C.muted};font-size:13px;font-weight:600">Fleet · 24 vehicles · 18 drivers</div></div>
          ${chip('● Active',{bg:C.primaryL,c:C.primaryD})}
          ${chip('Gold tier',{bg:'#FFF6E0',c:C.accentD})}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
          ${[['Rating','★ 4.8'],['Wallet (IQD)','4,120,000'],['Completed','1,942']].map(([a,b])=>`<div style="background:#fff;border:1px solid ${C.line};border-radius:14px;padding:16px"><div style="color:${C.muted};font-size:12.5px;font-weight:600">${a}</div><div style="font-weight:800;font-size:19px;margin-top:6px">${b}</div></div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:15px;margin-bottom:12px">Documents</div>
          ${[['Commercial registration','Valid · exp 2027','check',C.primary],['Owner ID','Valid','check',C.primary],['Operating permit','Expires in 6 days','clock',C.warn],['Insurance','Valid','check',C.primary]].map(([t,s,k,c],i)=>`<div style="display:flex;align-items:center;gap:11px;padding:11px 0;${i?'border-top:1px solid '+C.line:''}">${ic('doc',C.muted,18)}<div style="flex:1"><div style="font-weight:700;font-size:13.5px">${t}</div><div style="color:${C.muted};font-size:12px;font-weight:600">${s}</div></div>${ic(k,c,18)}<span style="color:${C.primary};font-weight:800;font-size:12.5px">View</span></div>`).join('')}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:15px;margin-bottom:14px">Actions</div>
          <div style="margin-bottom:12px">${cpField('CARRIER TIER','Gold  ·  ×1.25 dispatch weight',{sel:true})}</div>
          <button style="width:100%;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:14px;padding:13px;border-radius:11px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('money','#fff',17)} Send payout (manual)</button>
          <button style="width:100%;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px;border-radius:11px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('check',C.text,17)} Re-verify documents</button>
          <button style="width:100%;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:14px;padding:13px;border-radius:11px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('chat',C.text,17)} Message carrier</button>
          <button style="width:100%;border:1.5px solid ${C.danger};background:#fff;color:${C.danger};font-weight:800;font-size:14px;padding:13px;border-radius:11px;display:flex;align-items:center;justify-content:center;gap:8px">${ic('power',C.danger,17)} Suspend carrier</button>
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:15px;margin-bottom:12px">Recent orders</div>
          ${[['#NF-20418','Baghdad → Erbil','+412k'],['#NF-20361','Karbala → Najaf','+96k'],['#NF-20299','Basra → Baghdad','+528k']].map(([a,b,c],i)=>`<div style="display:flex;align-items:center;gap:11px;padding:11px 0;${i?'border-top:1px solid '+C.line:''}">${ic('truck',C.primaryD,18)}<div style="flex:1"><div style="font-weight:800;font-size:13px">${a}</div><div style="color:${C.muted};font-size:12px;font-weight:600">${b}</div></div><span class="mono" style="font-weight:800;color:${C.primary};font-size:13px">${c}</span></div>`).join('')}
        </div>
      </div>
    </div>
  </div>`));

// CP 09b Suspend confirm (compliance)
add('control-panel/09b-suspend-confirm',1440,900,2, cpModal('Compliance','Compliance','Omar Khalil · decision',540,`
  ${modalHead('Suspend Omar Khalil?','Warn keeps them online, Dismiss clears the violation, Suspend blocks them. This confirms a Suspend.')}
  <div style="display:flex;align-items:center;gap:12px;background:#FEECEC;border-radius:12px;padding:14px 16px;margin-bottom:16px">${ic('shield',C.danger,24)}<div style="font-size:13px;color:${C.danger};font-weight:700;line-height:1.4">Repeated late cancellations · 5 points in 7 days. Exceeds the auto-suspend threshold.</div></div>
  <div style="margin-bottom:14px">${cpField('REASON (AUDITED)','Repeated late cancellations',{sel:true})}</div>
  <div style="background:${C.bg};border-radius:12px;padding:14px 16px;margin-bottom:18px">
    <div style="font-weight:800;font-size:12.5px;color:${C.muted};margin-bottom:10px">EFFECT</div>
    ${['Cannot go online or receive offers','Active orders are reassigned automatically','Can appeal within 7 days'].map(t=>`<div style="display:flex;gap:9px;align-items:center;padding:5px 0;font-size:13px;font-weight:600">${ic('check',C.danger,15)} ${t}</div>`).join('')}
  </div>
  <div style="display:flex;gap:12px">
    <button style="flex:1;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px;border-radius:12px">Cancel</button>
    <button style="flex:1;border:0;background:${C.danger};color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Confirm suspend</button>
  </div>`));

// CP 09c Rule builder (compliance)
add('control-panel/09c-rule-builder',1440,900,2, cpModal('Compliance','Compliance','Violation rules · builder',600,`
  ${modalHead('Violation rule builder','Thresholds, window, points and the automatic action. Stored as data — no code change or migration.')}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    ${cpField('RULE NAME','Repeated late cancellations',{focus:true})}
    ${cpField('TRIGGER','Late cancellation',{sel:true})}
    ${cpField('THRESHOLD (COUNT)','3')}
    ${cpField('WINDOW (DAYS)','7')}
    ${cpField('POINTS ADDED','5')}
    ${cpField('AUTO-ACTION','Suspend',{sel:true})}
    ${cpField('APPEAL WINDOW (DAYS)','7')}
    ${cpField('APPLIES TO','All carriers',{sel:true})}
  </div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:16px;padding:12px 14px;background:${C.bg};border-radius:12px"><span style="flex:1;font-weight:700;font-size:13.5px">Rule active</span>${cpToggle(true)}</div>
  <div style="display:flex;gap:12px;margin-top:20px">
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
    <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Save rule</button>
  </div>`));

// CP 10b Countries list (markets)
add('control-panel/10b-countries',1440,900,2, desktop(`
  ${cpSidebar('Catalog')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${cpTopbar('Countries & markets','Countries are data rows — no code change to add one')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="display:flex;gap:9px">${['All','Active','Draft','Inactive'].map((t,i)=>`<span style="font-weight:700;font-size:13px;padding:9px 15px;border-radius:10px;background:${i==0?C.ink:'#fff'};color:${i==0?'#fff':C.muted};border:1px solid ${i==0?C.ink:C.line}">${t}</span>`).join('')}</div>
        <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:13.5px;padding:11px 18px;border-radius:11px;display:flex;align-items:center;gap:7px">${ic('plus','#fff',16)} Add country</button>
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1.4fr .7fr 1fr 1.1fr .8fr .7fr 1fr 120px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12px;color:${C.muted}"><div>COUNTRY</div><div>CODE</div><div>CURRENCY</div><div>LANGUAGES</div><div>COMM.</div><div>COD</div><div>STATUS</div><div>ACTIONS</div></div>
        ${[['Iraq','IQ','IQD · 0 dp','Arabic, English','15%','Off','Active',C.primary],
           ['Jordan','JO','JOD · 3 dp','Arabic, English','15%','On','Draft',C.warn],
           ['Saudi Arabia','SA','SAR · 2 dp','Arabic, English','12%','Off','Draft',C.warn],
           ['Kuwait','KW','KWD · 3 dp','Arabic, English','12%','On','Inactive',C.muted],
           ['UAE','AE','AED · 2 dp','Arabic, English','12%','Off','Draft',C.warn]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.4fr .7fr 1fr 1.1fr .8fr .7fr 1fr 120px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="display:flex;align-items:center;gap:11px"><div style="width:34px;height:34px;border-radius:8px;background:${C.bg};font-weight:800;display:flex;align-items:center;justify-content:center;font-size:12px">${r[1]}</div><div style="font-weight:800">${r[0]}</div></div>
            <div style="color:${C.muted};font-weight:700">${r[1]}</div><div style="font-weight:700">${r[2]}</div><div style="color:${C.muted};font-weight:600">${r[3]}</div><div style="font-weight:800">${r[4]}</div><div style="font-weight:700;color:${r[5]==='On'?C.primary:C.muted}">${r[5]}</div>
            <div><span style="font-weight:800;font-size:12px;color:${r[7]}">● ${r[6]}</span></div>
            <div style="display:flex;gap:12px"><span style="color:${C.primary};font-weight:800;font-size:12.5px">Edit</span><span style="color:${C.muted};font-weight:800;font-size:12.5px">Delete</span></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// CP 10c Add / edit country (form modal)
add('control-panel/10c-country-form',1440,900,2, cpModal('Catalog','Countries & markets','Add country',640,`
  ${modalHead('Add country','Everything here is a data row. Adding a market needs no code change or deployment.')}
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    ${cpField('COUNTRY NAME','Jordan',{focus:true})}
    ${cpField('ISO CODE','JO')}
    ${cpField('DIAL CODE','+962')}
    ${cpField('CURRENCY','JOD',{sel:true})}
    ${cpField('DECIMAL DIGITS','3')}
    ${cpField('DEFAULT LANGUAGE','Arabic',{sel:true})}
    ${cpField('COMMISSION %','15')}
    ${cpField('CANCELLATION FEE %','10')}
    ${cpField('VAT %','16')}
  </div>
  <div style="margin-top:14px"><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:8px">PAYMENT METHODS</div>
    <div style="display:flex;flex-wrap:wrap;gap:9px">${[['CliQ',true],['Card',true],['Wallet',true],['Cash on delivery',false]].map(([t,on])=>`<span style="padding:9px 15px;border-radius:999px;font-weight:700;font-size:13px;background:${on?C.primaryL:'#fff'};color:${on?C.primaryD:C.muted};border:1.5px solid ${on?C.primary:C.line}">${on?'✓ ':''}${t}</span>`).join('')}</div>
  </div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 14px;background:${C.bg};border-radius:12px"><span style="flex:1;font-weight:700;font-size:13.5px">Cash on delivery enabled</span>${cpToggle(false)}</div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:20px">
    <span style="color:${C.danger};font-weight:800;font-size:13.5px">Delete country</span>
    <div style="flex:1"></div>
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px 28px;border-radius:12px">Save country</button>
  </div>`));

// CP 11b Edit plan (client subscription)
add('control-panel/11b-edit-plan',1440,900,2, cpModal('Plans & Tiers','Plans & Tiers','Client plans · edit',560,`
  ${modalHead('Edit plan · Plus','Prices are stored as minor units + currency. Benefits are toggles — no code change.')}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    ${cpField('PLAN NAME','Plus',{focus:true})}
    ${cpField('MONTHLY PRICE (IQD)','120,000')}
    ${cpField('DISCOUNT %','5')}
    ${cpField('BILLING','Monthly',{sel:true})}
  </div>
  <div style="margin-top:16px"><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:8px">BENEFITS</div>
    ${[['Priority dispatch',true],['Saved templates & addresses',true],['Invoicing',false],['API access',false]].map(([t,on])=>`<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid ${C.line};border-radius:11px;margin-bottom:9px"><span style="flex:1;font-weight:700;font-size:13.5px">${t}</span>${cpToggle(on)}</div>`).join('')}
  </div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:20px">
    <span style="color:${C.danger};font-weight:800;font-size:13.5px">Delete plan</span>
    <div style="flex:1"></div>
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px 28px;border-radius:12px">Save plan</button>
  </div>`));

// CP 11c Edit tier (carrier tier)
add('control-panel/11c-edit-tier',1440,900,2, cpModal('Plans & Tiers','Plans & Tiers','Carrier tiers · edit',560,`
  ${modalHead('Edit tier · Gold','Score thresholds and dispatch weight drive matching priority. Stored as data.')}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    ${cpField('TIER NAME','Gold',{focus:true})}
    ${cpField('MIN SCORE','500')}
    ${cpField('DISPATCH WEIGHT','×1.25')}
    ${cpField('COLOR','Amber',{sel:true})}
  </div>
  <div style="margin-top:16px"><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:8px">BENEFITS</div>
    ${[['Higher dispatch priority',true],['Lower commission',true],['Featured badge',false]].map(([t,on])=>`<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid ${C.line};border-radius:11px;margin-bottom:9px"><span style="flex:1;font-weight:700;font-size:13.5px">${t}</span>${cpToggle(on)}</div>`).join('')}
  </div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:20px">
    <span style="color:${C.danger};font-weight:800;font-size:13.5px">Delete tier</span>
    <div style="flex:1"></div>
    <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
    <button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px 28px;border-radius:12px">Save tier</button>
  </div>`));

/* ============================================================= FLEET PORTAL */

// Fleet 00 Company registration (fleet/broker apply)
add('fleet-portal/00-register',1440,900,2, desktop(`
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#0F0C09,#1C1712 60%,#C0480A)">
    <div style="width:640px;background:#fff;border-radius:24px;padding:36px 40px;box-shadow:0 40px 100px rgba(0,0,0,.4)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px"><div style="width:44px;height:44px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(28)}</div><div style="font-weight:800;font-size:19px">NEXT <span style="color:${C.accent}">Freight</span></div></div>
      <h1 style="font-size:26px;font-weight:800;margin:14px 0 4px">Register your company</h1>
      <p style="color:${C.muted};font-size:14.5px;margin:0 0 22px">Fleets and brokers apply here. An admin verifies before your portal is activated.</p>
      <div style="display:flex;gap:12px;margin-bottom:20px">
        <div style="flex:1;padding:16px;border-radius:14px;border:1.5px solid ${C.primary};background:${C.primaryL}"><div style="display:flex;justify-content:space-between">${ic('truck',C.primaryD,26)}<div style="width:22px;height:22px;border-radius:50%;border:2px solid ${C.primary};display:flex;align-items:center;justify-content:center"><div style="width:11px;height:11px;border-radius:50%;background:${C.primary}"></div></div></div><div style="font-weight:800;font-size:16px;margin-top:10px;color:${C.primaryD}">Fleet company</div><div style="font-size:12.5px;color:${C.primaryD};opacity:.8">We own trucks & employ drivers</div></div>
        <div style="flex:1;padding:16px;border-radius:14px;border:1.5px solid ${C.line}"><div style="display:flex;justify-content:space-between">${ic('route',C.text,26)}<div style="width:22px;height:22px;border-radius:50%;border:2px solid ${C.line}"></div></div><div style="font-weight:800;font-size:16px;margin-top:10px">Broker</div><div style="font-size:12.5px;color:${C.muted}">We re-assign orders to carriers</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${[['Company name','Al-Rafidain Fleet Co.'],['Commercial registration','IQ-CR-88214'],['Country','Iraq'],['Fleet size','24 vehicles'],['Owner name','Karim Aziz'],['Owner phone','+964 781 ••• 9032']].map(([l,v])=>`<div><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">${l.toUpperCase()}</div><div style="height:48px;border:1.5px solid ${C.line};border-radius:12px;display:flex;align-items:center;padding:0 14px;font-weight:700;font-size:14.5px">${v}</div></div>`).join('')}
      </div>
      <div style="margin-top:16px;padding:14px;border-radius:12px;background:${C.bg};display:flex;gap:11px;align-items:center">${ic('doc',C.primary,22)}<div style="font-size:13px;color:${C.muted};font-weight:600">Attach: commercial registration, owner ID, and vehicle documents (uploaded on the next step).</div></div>
      <button style="width:100%;margin-top:20px;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:16px;padding:16px;border-radius:13px">Continue to documents &nbsp;→</button>
    </div>
  </div>`));

// Fleet 00b Documents upload (step after register)
add('fleet-portal/00b-documents',1440,900,2, desktop(`
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#0F0C09,#1C1712 60%,#C0480A)">
    <div style="width:680px;background:#fff;border-radius:24px;padding:36px 40px;box-shadow:0 40px 100px rgba(0,0,0,.4)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px"><div style="width:44px;height:44px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(28)}</div><div style="font-weight:800;font-size:19px">NEXT <span style="color:${C.accent}">Freight</span></div></div>
      <div style="display:flex;align-items:center;gap:8px;margin:14px 0 2px">
        <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:12.5px;color:${C.primaryD}"><div style="width:22px;height:22px;border-radius:50%;background:${C.primary};color:#fff;display:flex;align-items:center;justify-content:center">${ic('check','#fff',14)}</div>Company details</div>
        <div style="width:26px;height:2px;background:${C.primary}"></div>
        <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:12.5px;color:${C.text}"><div style="width:22px;height:22px;border-radius:50%;background:${C.ink};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px">2</div>Documents</div>
        <div style="width:26px;height:2px;background:${C.line}"></div>
        <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:12.5px;color:${C.muted}"><div style="width:22px;height:22px;border-radius:50%;border:2px solid ${C.line};display:flex;align-items:center;justify-content:center;font-size:12px">3</div>Create login</div>
      </div>
      <h1 style="font-size:24px;font-weight:800;margin:16px 0 4px">Upload your documents</h1>
      <p style="color:${C.muted};font-size:14px;margin:0 0 20px">Clear photos or PDFs. An admin verifies these before your portal is activated.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${[
          ['Commercial registration','IQ-CR-88214.pdf','done'],
          ['Owner ID','owner-id-front.jpg','done'],
          ['Tax card','tax-card.pdf','done'],
          ['Vehicle documents','8 of 24 vehicles','progress'],
          ['Operating permit','Required','empty'],
          ['Insurance certificate','Optional','empty'],
        ].map(([l,v,st])=>`
          <div style="padding:16px;border-radius:14px;border:1.5px ${st==='empty'?'dashed':'solid'} ${st==='done'?C.primary:(st==='progress'?C.accent:C.line)};background:${st==='done'?C.primaryL:'#fff'}">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:38px;height:38px;border-radius:10px;background:${st==='done'?'rgba(234,91,12,.15)':(st==='progress'?'#FFF6E0':C.bg)};display:flex;align-items:center;justify-content:center">${ic(st==='done'?'check':'doc',st==='done'?C.primaryD:(st==='progress'?C.accentD:C.muted),20)}</div>
              <div style="flex:1"><div style="font-weight:800;font-size:14px">${l}</div><div style="font-size:12px;font-weight:600;color:${st==='done'?C.primaryD:(st==='progress'?C.accentD:C.muted)}">${v}</div></div>
              ${st==='empty'?`<div style="font-weight:800;font-size:12.5px;color:${C.primary}">Upload</div>`:(st==='progress'?`<div style="font-weight:800;font-size:12.5px;color:${C.accentD}">Continue</div>`:ic('check',C.primaryD,18))}
            </div>
          </div>`).join('')}
      </div>
      <div style="margin-top:16px;padding:13px 15px;border-radius:12px;background:${C.primaryL};display:flex;gap:11px;align-items:center">${ic('shield',C.primaryD,20)}<div style="font-size:12.5px;color:${C.primaryD};font-weight:600">Your documents are encrypted and only used for verification. Vehicle docs can also be added later per vehicle.</div></div>
      <div style="display:flex;gap:12px;margin-top:20px">
        <button style="flex:0 0 auto;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:15px 24px;border-radius:13px">Back</button>
        <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:16px;padding:15px;border-radius:13px">Continue to login &nbsp;→</button>
      </div>
    </div>
  </div>`));

// Fleet 00c Create login credentials (step 3)
add('fleet-portal/00c-credentials',1440,900,2, desktop(`
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#0F0C09,#1C1712 60%,#C0480A)">
    <div style="width:560px;background:#fff;border-radius:24px;padding:36px 40px;box-shadow:0 40px 100px rgba(0,0,0,.4)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px"><div style="width:44px;height:44px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.06)">${brandMark(28)}</div><div style="font-weight:800;font-size:19px">NEXT <span style="color:${C.accent}">Freight</span></div></div>
      <div style="display:flex;align-items:center;gap:8px;margin:14px 0 2px">
        <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:12.5px;color:${C.primaryD}"><div style="width:22px;height:22px;border-radius:50%;background:${C.primary};color:#fff;display:flex;align-items:center;justify-content:center">${ic('check','#fff',14)}</div>Company details</div>
        <div style="width:26px;height:2px;background:${C.primary}"></div>
        <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:12.5px;color:${C.primaryD}"><div style="width:22px;height:22px;border-radius:50%;background:${C.primary};color:#fff;display:flex;align-items:center;justify-content:center">${ic('check','#fff',14)}</div>Documents</div>
        <div style="width:26px;height:2px;background:${C.primary}"></div>
        <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:12.5px;color:${C.text}"><div style="width:22px;height:22px;border-radius:50%;background:${C.ink};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px">3</div>Create login</div>
      </div>
      <h1 style="font-size:24px;font-weight:800;margin:16px 0 4px">Create your portal login</h1>
      <p style="color:${C.muted};font-size:14px;margin:0 0 20px">You'll sign in with these to manage your fleet. The owner is the first admin.</p>
      ${[['Username','alrafidain.fleet',false],['Owner email','karim@alrafidain.iq',false],['Password','••••••••••••',true],['Confirm password','••••••••••••',true]].map(([l,v,pw])=>`
        <div style="margin-bottom:14px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">${l.toUpperCase()}</div><div style="height:50px;border:1.5px solid ${C.line};border-radius:12px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-weight:700;font-size:14.5px">${v}${pw?`<span style="color:${C.muted};font-size:13px;font-weight:700">Show</span>`:''}</div></div>`).join('')}
      <div style="display:flex;gap:8px;margin:4px 0 18px">${['8+ chars','1 uppercase','1 number'].map(t=>`<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:${C.primaryD}">${ic('check',C.primary,15)}${t}</span>`).join('')}</div>
      <div style="display:flex;gap:12px">
        <button style="flex:0 0 auto;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:15px 24px;border-radius:13px">Back</button>
        <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:16px;padding:15px;border-radius:13px">Create account & sign in</button>
      </div>
    </div>
  </div>`));

// Fleet 00d Pending portal (logged in, awaiting admin approval — features locked)
add('fleet-portal/00d-pending',1440,900,2, desktop(`
  ${portalSidebar('Overview')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
    ${portalTop('Fleet overview','Al-Rafidain Fleet Co. · Baghdad')}
    <div style="flex:1;padding:24px 30px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#B9770C,#F5A524);border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:16px;margin-bottom:22px">
        <div style="width:46px;height:46px;border-radius:12px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center">${ic('clock','#fff',24)}</div>
        <div style="flex:1;color:#fff"><div style="font-weight:800;font-size:17px">Your application is under review</div><div style="font-size:13.5px;opacity:.92">Submitted 2 Aug · An admin is verifying your documents. You'll be notified once approved — usually within 1 business day.</div></div>
        <div style="background:rgba(255,255,255,.9);color:${C.accentD};font-weight:800;font-size:13px;padding:9px 16px;border-radius:999px">PENDING</div>
      </div>
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:20px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:22px">
          <div style="font-weight:800;font-size:16px;margin-bottom:16px">Approval checklist</div>
          ${[['Company details submitted','done'],['Documents uploaded','done'],['Admin verification','progress'],['Portal activated','pending']].map(([t,st],i,a)=>`
            <div style="display:flex;align-items:center;gap:13px;padding:13px 0;${i<a.length-1?'border-bottom:1px solid '+C.line:''}">
              <div style="width:28px;height:28px;border-radius:50%;background:${st==='done'?C.primaryL:(st==='progress'?'#FFF6E0':C.bg)};display:flex;align-items:center;justify-content:center">${st==='done'?ic('check',C.primaryD,17):(st==='progress'?ic('clock',C.accentD,16):`<span style="width:9px;height:9px;border-radius:50%;background:${C.line}"></span>`)}</div>
              <span style="flex:1;font-weight:700;font-size:14.5px;color:${st==='pending'?C.muted:C.text}">${t}</span>
              <span style="font-weight:800;font-size:12.5px;color:${st==='done'?C.primaryD:(st==='progress'?C.accentD:C.muted)}">${st==='done'?'Complete':(st==='progress'?'In review':'Locked')}</span>
            </div>`).join('')}
          <div style="margin-top:16px;padding:13px 15px;border-radius:12px;background:${C.primaryL};display:flex;gap:11px;align-items:center">${ic('shield',C.primaryD,20)}<div style="font-size:12.5px;color:${C.primaryD};font-weight:600">Meanwhile you can complete your profile and add drivers & vehicles — they go live the moment you're approved.</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="font-weight:800;font-size:15px;color:${C.muted}">Available now</div>
          ${[['user','Add drivers & vehicles','edit'],['building','Complete company profile','edit']].map(([k,t])=>`
            <div style="background:#fff;border:1px solid ${C.line};border-radius:14px;padding:16px;display:flex;align-items:center;gap:13px">${ic(k,C.primary,22)}<span style="flex:1;font-weight:700;font-size:14.5px">${t}</span><span style="color:${C.muted};font-size:20px">›</span></div>`).join('')}
          <div style="font-weight:800;font-size:15px;color:${C.muted};margin-top:6px">Locked until approval</div>
          ${[['box','Accept & dispatch orders'],['money','Wallet & payouts'],['map','Live tracking']].map(([k,t])=>`
            <div style="background:${C.bg};border:1px solid ${C.line};border-radius:14px;padding:16px;display:flex;align-items:center;gap:13px;opacity:.7">${ic(k,C.muted,22)}<span style="flex:1;font-weight:700;font-size:14.5px;color:${C.muted}">${t}</span><div style="width:26px;height:26px;border-radius:8px;background:${C.line};display:flex;align-items:center;justify-content:center">${ic('shield',C.muted,15)}</div></div>`).join('')}
        </div>
      </div>
    </div>
  </div>`));

// Fleet 01 Overview
add('fleet-portal/01-overview',1440,900,2, desktop(`
  ${portalSidebar('Overview')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Fleet overview','Al-Rafidain Fleet Co. · Baghdad · Gold tier')}
    <div style="flex:1;padding:24px 30px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#C0480A,#F7902E);border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center">${ic('box','#fff',24)}</div>
        <div style="flex:1;color:#fff"><div style="font-weight:800;font-size:16px">New order offered to your fleet</div><div style="font-size:13px;opacity:.85">Baghdad → Mosul · Flatbed · 8t · 640,000 IQD · accept within 04:12</div></div>
        <button style="border:0;background:#fff;color:${C.primaryD};font-weight:800;font-size:14px;padding:11px 20px;border-radius:11px">View & accept</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
        ${[['Active orders','12','box',C.primary],['Drivers online','9 / 18','user',C.primary],['Revenue this month','18.4M IQD','money',C.primary],['Docs expiring','3','shield',C.warn]].map(([a,b,k,c])=>`
          <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px"><div style="width:40px;height:40px;border-radius:11px;background:${c===C.warn?'#FFF6E0':C.primaryL};display:flex;align-items:center;justify-content:center">${ic(k,c===C.warn?C.accentD:C.primaryD,22)}</div><div style="font-weight:800;font-size:26px;margin-top:12px">${b}</div><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div></div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:16px;margin-bottom:14px">Drivers on duty</div>
          ${[['Ali M.','#NF-20418 · Baghdad→Erbil','In transit',C.primary],['Zaid H.','#NF-20420 · Basra→Baghdad','At pickup',C.accentD],['Omar T.','Idle · awaiting offer','Online',C.muted]].map(([n,o,s,c],i)=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;${i?'border-top:1px solid '+C.line:''}"><div style="width:38px;height:38px;border-radius:50%;background:${C.primaryL};color:${C.primaryD};font-weight:800;display:flex;align-items:center;justify-content:center">${n[0]}</div><div style="flex:1"><div style="font-weight:700;font-size:14px">${n}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${o}</div></div><span style="font-weight:700;font-size:12px;color:${c}">● ${s}</span></div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:16px;margin-bottom:14px">Wallet</div>
          <div style="color:${C.muted};font-size:13px;font-weight:600">Available balance</div>
          <div style="font-weight:800;font-size:28px;margin:2px 0 4px"><span class="mono">4,120,000</span> <span style="font-size:.5em;color:${C.muted}">IQD</span></div>
          <div style="display:flex;gap:14px;margin:10px 0 16px;font-size:13px;font-weight:600;color:${C.muted}"><span>COD held <b class="mono" style="color:${C.text}">860,000</b></span><span>Open violations <b style="color:${C.text}">1</b></span></div>
          <button style="width:100%;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:14px;padding:13px;border-radius:11px">Request payout</button>
        </div>
      </div>
    </div>
  </div>`));

// Fleet 02 My Orders
add('fleet-portal/02-orders',1440,900,2, desktop(`
  ${portalSidebar('My Orders')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('My orders','12 active · scoped to your fleet')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;gap:10px;margin-bottom:16px">${['All','Needs driver','In transit','Delivered'].map((t,i)=>`<span style="font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:10px;background:${i==1?C.ink:'#fff'};color:${i==1?'#fff':C.muted};border:1px solid ${i==1?C.ink:C.line}">${t}${i==1?' · 2':''}</span>`).join('')}</div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:120px 1.4fr 1fr 1fr 120px 150px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12.5px;color:${C.muted}"><div>ORDER</div><div>ROUTE</div><div>VEHICLE</div><div>DRIVER</div><div>PAYOUT</div><div>STATUS</div></div>
        ${[['#NF-20418','Baghdad → Erbil','Box · 3.5t','Ali M.','412,000','In transit',C.accentD,'#FFF4E0'],
           ['#NF-20421','Baghdad → Mosul','Flatbed · 8t','— assign','544,000','Needs driver',C.warn,'#FFF6E0'],
           ['#NF-20420','Basra → Baghdad','Trailer · 20t','Zaid H.','980,000','At pickup',C.accentD,'#FFF4E0'],
           ['#NF-20399','Erbil → Habur','Box · 3.5t','Omar T.','388,000','Needs driver',C.warn,'#FFF6E0'],
           ['#NF-20388','Baghdad → Najaf','Box · 3.5t','Ali M.','176,000','Delivered',C.primaryD,C.primaryL]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:120px 1.4fr 1fr 1fr 120px 150px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="font-weight:800">${r[0]}</div><div style="display:flex;align-items:center;gap:8px;font-weight:600">${ic('route',C.primary,16)} ${r[1]}</div><div style="color:${C.muted};font-weight:600">${r[2]}</div>
            <div style="font-weight:700;color:${r[3].includes('assign')?C.warn:C.text}">${r[3]}</div><div class="mono" style="font-weight:800">${r[4]}</div>
            <div><span style="font-weight:800;font-size:12px;padding:5px 11px;border-radius:999px;background:${r[7]};color:${r[6]}">${r[5]}</span></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// Fleet 03 Assign driver
add('fleet-portal/03-assign-driver',1440,900,2, desktop(`
  ${portalSidebar('My Orders')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Assign a driver','Order #NF-20421 · Baghdad → Mosul · assign within 03:48')}
    <div style="flex:1;padding:24px 30px;overflow:hidden;display:grid;grid-template-columns:1fr 1.4fr;gap:20px">
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px">Order details</div>
        ${[['Route','Baghdad → Mosul · 415 km'],['Vehicle','Flatbed · min 8t'],['Cargo','Construction · 7.4t'],['Pickup','Tomorrow 08:00'],['Your payout','544,000 IQD']].map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;padding:12px 0;${i?'border-top:1px solid '+C.line:''}"><span style="color:${C.muted};font-weight:600;font-size:14px">${a}</span><span style="font-weight:800;font-size:14px">${b}</span></div>`).join('')}
        <div style="margin-top:14px;padding:13px;border-radius:11px;background:#FFF6E0;color:${C.accentD};font-size:13px;font-weight:600;line-height:1.4">If not assigned in time, the order returns to the platform pool.</div>
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px;overflow:hidden">
        <div style="font-weight:800;font-size:16px;margin-bottom:6px">Eligible drivers</div>
        <div style="color:${C.muted};font-size:13px;font-weight:600;margin-bottom:14px">Matched by vehicle, capacity, location & availability</div>
        ${[['Zaid H.','Flatbed · 10t','Baghdad · 4 km','4.9',true,true],['Omar T.','Flatbed · 12t','Baghdad · 11 km','4.7',true,false],['Hassan D.','Trailer · 20t','Taji · 22 km','4.8',false,false]].map(([n,v,loc,r,online,best])=>`
          <div style="display:flex;align-items:center;gap:13px;padding:14px;border-radius:13px;margin-bottom:11px;border:1.5px solid ${best?C.primary:C.line};background:${best?C.primaryL:'#fff'}">
            <div style="width:44px;height:44px;border-radius:50%;background:#fff;border:1px solid ${C.line};color:${C.primaryD};font-weight:800;display:flex;align-items:center;justify-content:center">${n[0]}</div>
            <div style="flex:1"><div style="display:flex;gap:8px;align-items:center"><span style="font-weight:800;font-size:15px">${n}</span>${best?chip('Best match',{bg:'#fff',c:C.primaryD}):''}${online?'':chip('Offline',{bg:'#FEECEC',c:C.danger})}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${v} · ${loc}</div></div>
            <div style="text-align:right;margin-right:6px"><div style="font-weight:800;font-size:14px">★ ${r}</div></div>
            <button style="border:0;background:${best?C.primary:C.ink};color:#fff;font-weight:800;font-size:13px;padding:11px 18px;border-radius:10px;${online?'':'opacity:.4'}">Assign</button>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// Fleet 04 My Drivers
add('fleet-portal/04-drivers',1440,900,2, desktop(`
  ${portalSidebar('My Drivers')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('My drivers','18 drivers · 9 online')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;justify-content:flex-end;margin-bottom:16px"><button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:13.5px;padding:11px 18px;border-radius:11px;display:flex;align-items:center;gap:7px">${ic('plus','#fff',16)} Invite driver</button></div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 130px 120px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12.5px;color:${C.muted}"><div>DRIVER</div><div>VEHICLE</div><div>RATING</div><div>ORDERS (30d)</div><div>DOCS</div><div>STATUS</div></div>
        ${[['Ali M.','+964 781 ••• 2210','Box · 3.5t','4.9','48','Valid',C.primary,'Online',C.primary],
           ['Zaid H.','+964 770 ••• 4471','Trailer · 20t','4.8','31','Valid',C.primary,'On trip',C.accentD],
           ['Omar T.','+964 751 ••• 9930','Flatbed · 12t','4.7','27','Expires 6d',C.warn,'Online',C.primary],
           ['Hassan D.','+964 772 ••• 1188','Trailer · 20t','4.8','22','Valid',C.primary,'Offline',C.muted],
           ['Nabil R.','+964 781 ••• 3345','Box · 3.5t','4.5','9','Expired',C.danger,'Suspended',C.danger]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 130px 120px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="display:flex;align-items:center;gap:11px"><div style="width:36px;height:36px;border-radius:50%;background:${C.primaryL};color:${C.primaryD};font-weight:800;display:flex;align-items:center;justify-content:center">${r[0][0]}</div><div><div style="font-weight:800">${r[0]}</div><div style="color:${C.muted};font-size:12px">${r[1]}</div></div></div>
            <div style="color:${C.muted};font-weight:600">${r[2]}</div><div style="font-weight:800">★ ${r[3]}</div><div style="font-weight:700">${r[4]}</div>
            <div style="font-weight:700;color:${r[6]}">${r[5]}</div><div><span style="font-weight:800;font-size:12px;color:${r[8]}">● ${r[7]}</span></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// Fleet 04b Invite driver (modal)
add('fleet-portal/04b-invite-driver',1440,900,2, desktop(`
  ${portalSidebar('My Drivers')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
    ${portalTop('My drivers','18 drivers · 9 online')}
    <div style="flex:1;background:${C.bg}"></div>
    <div style="position:absolute;inset:0;background:rgba(6,18,13,.45);display:flex;align-items:center;justify-content:center">
      <div style="width:540px;background:#fff;border-radius:22px;padding:28px 32px;box-shadow:0 40px 100px rgba(0,0,0,.4)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div><h1 style="font-size:22px;font-weight:800;margin:0 0 4px">Invite a driver</h1><p style="color:${C.muted};font-size:14px;margin:0">They'll get an SMS and confirm the invite in the driver app.</p></div>
          <span style="font-size:22px;color:${C.muted}">✕</span>
        </div>
        <div style="margin-top:22px">
          <div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">DRIVER PHONE</div>
          <div style="display:flex;gap:10px;margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:7px;padding:0 14px;height:50px;border:1.5px solid ${C.line};border-radius:12px;font-weight:700;font-size:14px">🇮🇶 +964 ▾</div>
            <div style="flex:1;display:flex;align-items:center;padding:0 14px;height:50px;border:1.5px solid ${C.primary};border-radius:12px;font-weight:700;font-size:15px">781 445 9032</div>
          </div>
          ${[['FULL NAME (OPTIONAL)','Zaid Hassan'],['ASSIGN VEHICLE','22 B 9910 · Trailer · 20t  ▾'],['ROLE','Fleet driver']].map(([l,v],i)=>`
            <div style="margin-bottom:16px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">${l}</div><div style="height:50px;border:1.5px solid ${C.line};border-radius:12px;display:flex;align-items:center;padding:0 14px;font-weight:700;font-size:14.5px;color:${i===2?C.muted:C.text};background:${i===2?C.bg:'#fff'}">${v}</div></div>`).join('')}
          <div style="padding:13px 15px;border-radius:12px;background:${C.primaryL};display:flex;gap:11px;align-items:center">${ic('shield',C.primaryD,20)}<div style="font-size:12.5px;color:${C.primaryD};font-weight:600">Fleet drivers don't upload documents — your company manages compliance and payouts for them.</div></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:22px">
          <button style="flex:0 0 auto;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
          <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Send invite</button>
        </div>
      </div>
    </div>
  </div>`));

// Fleet 05 My Vehicles
add('fleet-portal/05-vehicles',1440,900,2, desktop(`
  ${portalSidebar('My Vehicles')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('My vehicles','24 vehicles · 3 documents expiring')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
    <div style="display:flex;justify-content:flex-end;margin-bottom:16px"><button style="border:0;background:${C.primary};color:#fff;font-weight:800;font-size:13.5px;padding:11px 18px;border-radius:11px;display:flex;align-items:center;gap:7px">${ic('plus','#fff',16)} Add vehicle</button></div>
    <div style="overflow:hidden;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:min-content;gap:18px">
      ${[['21 A 4482','Box truck','3.5 t','Ali M.','Valid',C.primary],
         ['22 B 9910','Trailer','20 t','Zaid H.','Insurance 6d',C.warn],
         ['21 C 3374','Flatbed','12 t','Omar T.','Valid',C.primary],
         ['23 A 1120','Trailer','20 t','Hassan D.','Valid',C.primary],
         ['21 D 7756','Tanker','20 t','Unassigned','Registration expired',C.danger],
         ['22 A 4408','Box truck','3.5 t','Nabil R.','Valid',C.primary]].map(([plate,type,cap,drv,doc,c])=>`
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px">
          <div style="display:flex;justify-content:space-between;align-items:center"><div style="width:44px;height:44px;border-radius:12px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic('truck',C.primaryD,24)}</div><span style="font-weight:800;font-size:11.5px;padding:5px 10px;border-radius:999px;background:${c===C.primary?C.primaryL:c===C.warn?'#FFF6E0':'#FEECEC'};color:${c===C.primary?C.primaryD:c===C.warn?C.accentD:C.danger}">${doc}</span></div>
          <div style="font-weight:800;font-size:18px;margin-top:12px;font-family:ui-monospace,monospace">${plate}</div>
          <div style="color:${C.muted};font-size:13px;font-weight:600">${type} · up to ${cap}</div>
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid ${C.line};font-size:13px;font-weight:600;color:${C.text}">Driver: ${drv}</div>
        </div>`).join('')}
    </div>
    </div>
  </div>`));

// Fleet 05b Add vehicle (modal)
add('fleet-portal/05b-add-vehicle',1440,900,2, desktop(`
  ${portalSidebar('My Vehicles')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
    ${portalTop('My vehicles','24 vehicles · 3 documents expiring')}
    <div style="flex:1;background:${C.bg}"></div>
    <div style="position:absolute;inset:0;background:rgba(6,18,13,.45);display:flex;align-items:center;justify-content:center">
      <div style="width:600px;background:#fff;border-radius:22px;padding:28px 32px;box-shadow:0 40px 100px rgba(0,0,0,.4)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div><h1 style="font-size:22px;font-weight:800;margin:0 0 4px">Add a vehicle</h1><p style="color:${C.muted};font-size:14px;margin:0">Details use the platform catalog. Documents are verified by an admin before the vehicle can be dispatched.</p></div>
          <span style="font-size:22px;color:${C.muted}">✕</span>
        </div>
        <div style="margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
          ${[['PLATE NUMBER','21 A 4482',false],['VEHICLE TYPE','Box truck  ▾',true],['CAPACITY (T)','3.5',false],['YEAR','2021',false]].map(([l,v,cat])=>`
            <div><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">${l}</div><div style="height:50px;border:1.5px solid ${C.line};border-radius:12px;display:flex;align-items:center;padding:0 14px;font-weight:700;font-size:14.5px;background:${cat?C.bg:'#fff'}">${v}</div></div>`).join('')}
        </div>
        <div style="margin-top:16px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:8px">CARGO TYPES ALLOWED <span style="font-weight:600;text-transform:none">· from catalog</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:9px">${[['Foodstuff',true],['Furniture',true],['Construction',false],['Machinery',false],['Livestock',false]].map(([t,on])=>`<span style="padding:9px 15px;border-radius:999px;font-weight:700;font-size:13px;background:${on?C.primaryL:'#fff'};color:${on?C.primaryD:C.muted};border:1.5px solid ${on?C.primary:C.line}">${on?'✓ ':''}${t}</span>`).join('')}</div>
        </div>
        <div style="margin-top:16px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:8px">DOCUMENTS</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px">${[['Registration','Required'],['Insurance','Required'],['Operating permit','Optional']].map(([t,s])=>`<div style="padding:14px;border-radius:12px;border:1.5px dashed ${C.line};text-align:center">${ic('doc',C.muted,22)}<div style="font-weight:800;font-size:13px;margin-top:6px">${t}</div><div style="font-size:11.5px;color:${C.primary};font-weight:800;margin-top:2px">Upload</div><div style="font-size:11px;color:${C.muted};font-weight:600">${s}</div></div>`).join('')}</div>
        </div>
        <div style="display:flex;gap:12px;margin-top:22px">
          <button style="flex:0 0 auto;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
          <button style="flex:1;border:0;background:${C.primary};color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Add vehicle</button>
        </div>
      </div>
    </div>
  </div>`));

// Fleet 06 Live map (own only)
add('fleet-portal/06-live-map',1440,900,2, desktop(`
  ${portalSidebar('Live map')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Live map','Your drivers only · 9 online')}
    <div style="flex:1;position:relative">
      ${mapSvg(1190,780,{route:true})}
      <div style="position:absolute;top:24px;left:24px;background:#fff;border:1px solid ${C.line};border-radius:14px;padding:16px;width:250px;box-shadow:0 10px 30px rgba(0,0,0,.08)">
        <div style="font-weight:800;font-size:14px;margin-bottom:12px">On duty</div>
        ${[['Ali M.','In transit',C.primary],['Zaid H.','At pickup',C.accentD],['Omar T.','Idle',C.muted]].map(([n,s,c],i)=>`<div style="display:flex;align-items:center;gap:10px;padding:9px 0;${i?'border-top:1px solid '+C.line:''}"><div style="width:32px;height:32px;border-radius:50%;background:${C.primaryL};color:${C.primaryD};font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center">${n[0]}</div><span style="flex:1;font-weight:700;font-size:13px">${n}</span><span style="font-weight:700;font-size:11.5px;color:${c}">● ${s}</span></div>`).join('')}
      </div>
      <div style="position:absolute;top:34%;left:40%">${pinShape(C.primary)}</div>
      <div style="position:absolute;top:58%;left:60%">${pinShape(C.accent)}</div>
    </div>
  </div>`));

// Fleet 07 Wallet & Payouts
add('fleet-portal/07-wallet-payouts',1440,900,2, desktop(`
  ${portalSidebar('Wallet & Payouts')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Wallet & payouts','Al-Rafidain Fleet Co.')}
    <div style="flex:1;padding:24px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
        ${[['Available balance','4,120,000',C.primary,'money'],['COD held','860,000',C.accentD,'wallet'],['Paid this month','12,900,000',C.text,'check']].map(([a,b,c,k])=>`<div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px"><div style="width:40px;height:40px;border-radius:11px;background:${C.primaryL};display:flex;align-items:center;justify-content:center">${ic(k,C.primaryD,22)}</div><div style="font-weight:800;font-size:24px;margin-top:12px"><span class="mono">${b}</span> <span style="font-size:.5em;color:${C.muted}">IQD</span></div><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div></div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:16px;margin-bottom:14px">Recent transactions</div>
          ${[['Order earning · #NF-20388','+176,000',C.primary],['Commission · 15%','-26,400',C.text],['COD settlement · #NF-20370','-312,000',C.text],['Payout to IBAN ••• 8842','-2,000,000',C.text],['Order earning · #NF-20355','+544,000',C.primary]].map(([a,b,c],i)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;${i?'border-top:1px solid '+C.line:''}"><span style="font-weight:600;font-size:13.5px">${a}</span><span class="mono" style="font-weight:800;font-size:14px;color:${c}">${b}</span></div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
          <div style="font-weight:800;font-size:16px;margin-bottom:14px">Payout accounts</div>
          ${[['Bank / IBAN','••• 8842',true],['ZainCash','+964 781 ••• 9032',false]].map(([t,s,def])=>`<div style="display:flex;align-items:center;gap:12px;padding:13px;border-radius:12px;margin-bottom:10px;border:1px solid ${C.line}">${ic('wallet',C.primary,22)}<div style="flex:1"><div style="font-weight:800;font-size:14px">${t}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${s}</div></div>${def?chip('Default',{bg:C.primaryL,c:C.primaryD}):''}</div>`).join('')}
          <button style="width:100%;margin-top:8px;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:14px;padding:13px;border-radius:11px">Request payout</button>
        </div>
      </div>
    </div>
  </div>`));

// Fleet 08 Violations
add('fleet-portal/07b-request-payout',1440,900,2, desktop(`
  ${portalSidebar('Wallet & Payouts')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
    ${portalTop('Wallet & payouts','Al-Rafidain Fleet Co.')}
    <div style="flex:1;background:${C.bg}"></div>
    <div style="position:absolute;inset:0;background:rgba(6,18,13,.45);display:flex;align-items:center;justify-content:center">
      <div style="width:520px;background:#fff;border-radius:22px;padding:28px 32px;box-shadow:0 40px 100px rgba(0,0,0,.4)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div><h1 style="font-size:22px;font-weight:800;margin:0 0 4px">Request a payout</h1><p style="color:${C.muted};font-size:14px;margin:0">Reviewed by admin before it's sent.</p></div>
          <span style="font-size:22px;color:${C.muted}">✕</span>
        </div>
        <div style="margin-top:20px;padding:16px 18px;border-radius:14px;background:${C.primaryL};display:flex;justify-content:space-between;align-items:center">
          <span style="color:${C.primaryD};font-weight:700;font-size:14px">Available balance</span>
          <span style="font-weight:800;font-size:20px;color:${C.primaryD}"><span class="mono">4,120,000</span> <span style="font-size:.55em">IQD</span></span>
        </div>
        <div style="margin-top:18px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">AMOUNT</div>
          <div style="height:56px;border:1.5px solid ${C.primary};border-radius:12px;display:flex;align-items:center;justify-content:space-between;padding:0 16px"><span style="font-weight:800;font-size:20px" class="mono">2,000,000</span><span style="color:${C.muted};font-weight:700;font-size:14px">IQD</span></div>
          <div style="display:flex;gap:8px;margin-top:10px">${['500,000','1,000,000','All'].map(t=>`<span style="padding:8px 14px;border-radius:999px;border:1.5px solid ${C.line};font-weight:700;font-size:12.5px;color:${C.text}">${t}</span>`).join('')}</div>
        </div>
        <div style="margin-top:18px"><div style="font-weight:800;font-size:12px;color:${C.muted};margin-bottom:6px">PAYOUT ACCOUNT</div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;border:1.5px solid ${C.line}">${ic('wallet',C.primary,22)}<div style="flex:1"><div style="font-weight:800;font-size:14px">Bank / IBAN ••• 8842</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">Default · 1–2 business days</div></div><span style="color:${C.muted};font-size:13px;font-weight:700">Change</span></div>
        </div>
        <div style="margin-top:16px;padding:14px 16px;border-radius:12px;background:${C.bg}">
          ${[['Amount','2,000,000'],['Processing fee','-2,000'],['You receive','1,998,000']].map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;padding:6px 0;${i===2?'border-top:1px solid '+C.line+';margin-top:4px;padding-top:10px;font-weight:800':''}"><span style="color:${i===2?C.text:C.muted};font-weight:${i===2?800:600};font-size:14px">${a}</span><span class="mono" style="font-weight:800;font-size:14px;color:${i===2?C.primaryD:C.text}">${b}</span></div>`).join('')}
        </div>
        <div style="display:flex;gap:12px;margin-top:22px">
          <button style="flex:0 0 auto;border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
          <button style="flex:1;border:0;background:${C.accent};color:#20160a;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Submit request</button>
        </div>
      </div>
    </div>
  </div>`));

// Fleet 08 Violations
add('fleet-portal/08-violations',1440,900,2, desktop(`
  ${portalSidebar('Violations')}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Violations','Company aggregate · 1 open · tier at risk')}
    <div style="flex:1;padding:24px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
        ${[['Open violations','1',C.warn],['Points (30d)','12',C.accentD],['Company tier','Gold',C.primary]].map(([a,b,c])=>`<div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px"><div style="font-weight:800;font-size:28px;color:${c}">${b}</div><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div></div>`).join('')}
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 1.4fr 1fr 100px 130px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12.5px;color:${C.muted}"><div>DRIVER</div><div>VIOLATION</div><div>ORDER</div><div>POINTS</div><div>ACTION</div></div>
        ${[['Nabil R.','Late delivery','#NF-20344','4','Priority drop',C.accentD],
           ['Omar T.','Missing proof','#NF-20399','6','Payout hold',C.danger],
           ['Ali M.','Route deviation','#NF-20301','2','Warning',C.warn]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1fr 1.4fr 1fr 100px 130px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}"><div style="font-weight:800">${r[0]}</div><div style="display:flex;align-items:center;gap:8px;font-weight:600">${ic('shield',r[5],17)} ${r[1]}</div><div style="color:${C.muted};font-weight:600">${r[2]}</div><div style="font-weight:800">${r[3]}</div><div><span style="font-weight:800;font-size:11.5px;color:${r[5]}">${r[4]}</span></div></div>`).join('')}
      </div>
      <div style="margin-top:16px;padding:16px;border-radius:14px;background:#FFF6E0;display:flex;gap:12px;align-items:center"><div>${ic('shield',C.accentD,24)}</div><div style="flex:1;font-size:13.5px;color:${C.accentD};font-weight:600">Reducing violations improves your fleet tier and dispatch priority. You can appeal any decision within 7 days.</div><button style="border:1.5px solid ${C.accentD};background:#fff;color:${C.accentD};font-weight:800;font-size:13px;padding:10px 18px;border-radius:10px">Submit appeal</button></div>
    </div>
  </div>`));

/* ============================================================= BROKER PORTAL */

// Broker 01 Claim board
add('broker-portal/01-board',1440,900,2, desktop(`
  ${portalSidebar('Claim board',{broker:true})}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Claim board','Eligible orders you can claim and re-assign')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;gap:10px;margin-bottom:16px">${['All corridors','Baghdad hub','Cross-border','Reefer'].map((t,i)=>`<span style="font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:10px;background:${i==0?C.ink:'#fff'};color:${i==0?'#fff':C.muted};border:1px solid ${i==0?C.ink:C.line}">${t}</span>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
        ${[['#NF-20461','Baghdad → Basra','Trailer · 20t','560 km','1,240,000','ASAP'],
           ['#NF-20460','Erbil → Habur (TR)','Flatbed · 12t','cross-border','2,180,000','Tomorrow'],
           ['#NF-20459','Baghdad → Mosul','Box · 3.5t','415 km','488,000','Today'],
           ['#NF-20458','Basra → Kuwait City','Tanker · 20t','cross-border','1,960,000','Tomorrow'],
           ['#NF-20457','Najaf → Baghdad','Reefer · 5t','160 km','372,000','ASAP'],
           ['#NF-20456','Baghdad → Karbala','Box · 3.5t','80 km','204,000','Today']].map(([id,route,veh,dist,amt,when])=>`
          <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-weight:800;font-size:14px">${id}</span>${chip(when,{bg:C.bg,c:C.muted})}</div>
            <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:14.5px;margin-bottom:4px">${ic('route',C.primary,17)} ${route}</div>
            <div style="color:${C.muted};font-size:13px;font-weight:600;margin-bottom:12px">${veh} · ${dist}</div>
            <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:800;font-size:16px">${money(parseInt(amt.replace(/,/g,'')))}</span><button style="border:0;background:#4F46E5;color:#fff;font-weight:800;font-size:13px;padding:10px 18px;border-radius:10px">Claim</button></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// Broker 02 Assign carrier
add('broker-portal/02-assign-carrier',1440,900,2, desktop(`
  ${portalSidebar('Claim board',{broker:true})}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Assign a carrier','Order #NF-20461 · claimed · Baghdad → Basra')}
    <div style="flex:1;padding:24px 30px;overflow:hidden;display:grid;grid-template-columns:1.3fr 1fr;gap:20px">
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px;overflow:hidden">
        <div style="font-weight:800;font-size:16px;margin-bottom:6px">Contracted carriers</div>
        <div style="color:${C.muted};font-size:13px;font-weight:600;margin-bottom:14px">Pick who fulfils this order under your contract</div>
        ${[['Tigris Transport','Trailer · 20t','4.8','980,000',true],['Mesopotamia Cargo','Trailer · 25t','4.6','1,010,000',false],['Ishtar Lines','Trailer · 20t','4.9','1,040,000',false]].map(([n,v,r,cost,best])=>`
          <div style="display:flex;align-items:center;gap:13px;padding:14px;border-radius:13px;margin-bottom:11px;border:1.5px solid ${best?'#4F46E5':C.line};background:${best?'#EEF0FF':'#fff'}">
            <div style="width:44px;height:44px;border-radius:12px;background:${C.ink};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center">${n[0]}</div>
            <div style="flex:1"><div style="display:flex;gap:8px;align-items:center"><span style="font-weight:800;font-size:15px">${n}</span>${best?chip('Recommended',{bg:'#fff',c:'#4F46E5'}):''}</div><div style="color:${C.muted};font-size:12.5px;font-weight:600">${v} · ★ ${r}</div></div>
            <div style="text-align:right;margin-right:6px"><div style="color:${C.muted};font-size:11.5px;font-weight:600">carrier cost</div><div class="mono" style="font-weight:800;font-size:14px">${cost}</div></div>
            <button style="border:0;background:${best?'#4F46E5':C.ink};color:#fff;font-weight:800;font-size:13px;padding:11px 16px;border-radius:10px">Assign</button>
          </div>`).join('')}
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:20px">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px">Margin breakdown</div>
        ${[['Client pays','1,240,000',C.text],['Carrier cost','-980,000',C.muted],['Platform commission','-40,000',C.muted]].map(([a,b,c],i)=>`<div style="display:flex;justify-content:space-between;padding:12px 0;${i?'border-top:1px solid '+C.line:''}"><span style="color:${c};font-weight:600;font-size:14px">${a}</span><span class="mono" style="font-weight:700;font-size:14px;color:${c}">${b}</span></div>`).join('')}
        <div style="display:flex;justify-content:space-between;padding:14px 0;border-top:2px solid ${C.ink};margin-top:4px"><span style="font-weight:800;font-size:15px">Your broker margin</span><span class="mono" style="font-weight:800;font-size:16px;color:#4F46E5">220,000</span></div>
        <div style="margin-top:12px;padding:13px;border-radius:11px;background:${C.bg};font-size:12.5px;color:${C.muted};font-weight:600;line-height:1.45">${ic('shield',C.primary,16)} Recorded as a separate ledger entry — client price, carrier payout, broker margin & commission stay fully traceable.</div>
      </div>
    </div>
  </div>`));

// Broker 00 Overview
add('broker-portal/00-overview',1440,900,2, desktop(`
  ${portalSidebar('Overview',{broker:true})}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Overview','Zagros Broker · '+new Date().toDateString())}
    <div style="flex:1;padding:26px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:22px">
        ${[['Claimable now','18','+4','route'],['Active orders','23','live','box'],['Margin (MTD, IQD)','9.4M','+16%','money'],['Contracted carriers','12','2 pending','truck']].map(([a,b,c,k])=>`
          <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:20px">
            <div style="display:flex;justify-content:space-between;align-items:center"><div style="width:42px;height:42px;border-radius:12px;background:#EEF0FF;display:flex;align-items:center;justify-content:center">${ic(k,'#4F46E5',22)}</div><span style="font-weight:700;font-size:12.5px;color:#4F46E5;background:#EEF0FF;padding:4px 9px;border-radius:999px">${c}</span></div>
            <div style="font-weight:800;font-size:30px;margin-top:14px">${b}</div><div style="color:${C.muted};font-size:13.5px;font-weight:600">${a}</div>
          </div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:18px">
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div style="font-weight:800;font-size:17px">Margin trend</div><div style="display:flex;gap:8px">${['Week','Month','Quarter'].map((t,i)=>`<span style="font-size:13px;font-weight:700;padding:6px 12px;border-radius:8px;background:${i==1?C.ink:C.bg};color:${i==1?'#fff':C.muted}">${t}</span>`).join('')}</div></div>
          <svg width="100%" height="230" viewBox="0 0 780 230" preserveAspectRatio="none">
            ${[0,1,2,3,4].map(i=>`<line x1="0" y1="${30+i*45}" x2="780" y2="${30+i*45}" stroke="${C.line}"/>`).join('')}
            ${[60,110,95,150,130,175,160,200,185,215].map((h,i,a)=>{const bw=780/a.length;return `<rect x="${i*bw+12}" y="${210-h}" width="${bw-24}" height="${h}" rx="5" fill="#E0E2FF"/>`;}).join('')}
            <path d="M50 150 C150 120,220 95,320 90 S520 55,620 55 720 40,740 35" fill="none" stroke="#4F46E5" stroke-width="3.5"/>
          </svg>
        </div>
        <div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px">
          <div style="font-weight:800;font-size:17px;margin-bottom:16px">Recent claims</div>
          ${[['#NF-20461','Baghdad → Basra','+220,000'],['#NF-20455','Erbil → Habur','+310,000'],['#NF-20448','Basra → Kuwait','+280,000'],['#NF-20440','Najaf → Baghdad','+64,000']].map(([a,b,c])=>`
            <div style="display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid ${C.line}">
              <div style="width:38px;height:38px;border-radius:10px;background:#EEF0FF;display:flex;align-items:center;justify-content:center">${ic('route','#4F46E5',18)}</div>
              <div style="flex:1"><div style="font-weight:800;font-size:13.5px">${a}</div><div style="color:${C.muted};font-size:12px;font-weight:600">${b}</div></div>
              <span class="mono" style="font-weight:800;color:#4F46E5;font-size:13.5px">${c}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`));

// Broker 03 Carriers (contracted)
add('broker-portal/03-carriers',1440,900,2, desktop(`
  ${portalSidebar('Carriers',{broker:true})}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('My carriers','12 contracted · 2 pending invite')}
    <div style="flex:1;padding:22px 30px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="display:flex;gap:9px">${['All','Active','Pending','Paused'].map((t,i)=>`<span style="font-weight:700;font-size:13px;padding:9px 15px;border-radius:10px;background:${i==0?C.ink:'#fff'};color:${i==0?'#fff':C.muted};border:1px solid ${i==0?C.ink:C.line}">${t}</span>`).join('')}</div>
        <button style="border:0;background:#4F46E5;color:#fff;font-weight:800;font-size:13.5px;padding:11px 18px;border-radius:11px;display:flex;align-items:center;gap:7px">${ic('plus','#fff',16)} Add carrier</button>
      </div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1.4fr 1fr .8fr .8fr 1fr 1fr 120px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12px;color:${C.muted}"><div>CARRIER</div><div>EQUIPMENT</div><div>RATING</div><div>JOBS (30d)</div><div>ON-TIME</div><div>STATUS</div><div></div></div>
        ${[['Tigris Transport','Trailer · 20t','4.8','42','96%','Active',C.primary],
           ['Mesopotamia Cargo','Trailer · 25t','4.6','31','92%','Active',C.primary],
           ['Ishtar Lines','Trailer · 20t','4.9','28','98%','Active',C.primary],
           ['Babel Freight','Flatbed · 12t','4.5','9','88%','Paused',C.muted],
           ['Sumer Haulage','Reefer · 5t','—','0','—','Pending',C.warn]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.4fr 1fr .8fr .8fr 1fr 1fr 120px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="display:flex;align-items:center;gap:11px"><div style="width:36px;height:36px;border-radius:9px;background:#EEF0FF;color:#4F46E5;font-weight:800;display:flex;align-items:center;justify-content:center">${r[0][0]}</div><div style="font-weight:800">${r[0]}</div></div>
            <div style="color:${C.muted};font-weight:600">${r[1]}</div><div style="font-weight:800">${r[2]==='—'?'—':'★ '+r[2]}</div><div style="font-weight:700">${r[3]}</div><div style="font-weight:700">${r[4]}</div>
            <div><span style="font-weight:800;font-size:12px;color:${r[6]}">● ${r[5]}</span></div>
            <div style="color:#4F46E5;font-weight:800;font-size:12.5px">Manage</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

// Broker 03b Add carrier (invite by phone — modal)
add('broker-portal/03b-add-carrier',1440,900,2, desktop(`
  ${portalSidebar('Carriers',{broker:true})}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
    ${portalTop('My carriers','12 contracted · 2 pending invite')}
    <div style="flex:1;background:${C.bg}"></div>
    <div style="position:absolute;inset:0;background:rgba(6,18,13,.5);display:flex;align-items:center;justify-content:center">
      <div style="width:560px;background:#fff;border-radius:22px;padding:28px 32px;box-shadow:0 40px 100px rgba(0,0,0,.45)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div><h1 style="font-size:22px;font-weight:800;margin:0 0 4px">Add a carrier</h1><p style="color:${C.muted};font-size:13.5px;margin:0;max-width:420px;line-height:1.4">Invite an existing NEXT Freight carrier to your contracted list. If the phone is already registered, they just accept.</p></div>
          <span style="font-size:22px;color:${C.muted}">✕</span>
        </div>
        <div style="margin-bottom:16px"><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:6px">CARRIER PHONE</div>
          <div style="display:flex;gap:10px">
            <div style="display:flex;align-items:center;gap:7px;padding:0 14px;height:50px;border:1.5px solid ${C.line};border-radius:12px;font-weight:700;font-size:14px">🇮🇶 +964 ▾</div>
            <div style="flex:1;display:flex;align-items:center;padding:0 14px;height:50px;border:1.5px solid #4F46E5;border-radius:12px;font-weight:700;font-size:15px">770 118 6642</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:14px;border-radius:13px;background:#EEF0FF;border:1px solid #4F46E5;margin-bottom:16px">
          <div style="width:42px;height:42px;border-radius:11px;background:${C.ink};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center">M</div>
          <div style="flex:1"><div style="font-weight:800;font-size:14.5px">Mesopotamia Cargo</div><div style="color:#4F46E5;font-size:12.5px;font-weight:700">Match found · Fleet · Trailer 25t · ★ 4.6</div></div>
          ${ic('check','#4F46E5',22)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:6px">CONTRACT RATE</div><div style="height:48px;border:1.5px solid ${C.line};border-radius:11px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-weight:700;font-size:14px;background:${C.bg}">Per-order quote<span style="color:${C.muted}">▾</span></div></div>
          <div><div style="font-weight:800;font-size:11.5px;color:${C.muted};margin-bottom:6px">CORRIDORS</div><div style="height:48px;border:1.5px solid ${C.line};border-radius:11px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-weight:700;font-size:14px;background:${C.bg}">All corridors<span style="color:${C.muted}">▾</span></div></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:22px">
          <button style="border:1.5px solid ${C.line};background:#fff;color:${C.text};font-weight:800;font-size:15px;padding:14px 24px;border-radius:12px">Cancel</button>
          <button style="flex:1;border:0;background:#4F46E5;color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px">Send invite</button>
        </div>
      </div>
    </div>
  </div>`));

// Broker 04 Wallet & Payouts
add('broker-portal/04-wallet-payouts',1440,900,2, desktop(`
  ${portalSidebar('Wallet & Payouts',{broker:true})}
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
    ${portalTop('Wallet & payouts','Zagros Broker · margin account')}
    <div style="flex:1;padding:24px 30px;overflow:hidden">
      <div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:16px;margin-bottom:20px">
        <div style="background:linear-gradient(140deg,#4F46E5,#3730A3);color:#fff;border-radius:18px;padding:22px">
          <div style="font-size:13px;opacity:.75;font-weight:600">Available margin (IQD)</div>
          <div style="font-weight:800;font-size:32px;margin-top:8px" class="mono">3,180,000</div>
          <button style="margin-top:16px;border:0;background:#fff;color:#3730A3;font-weight:800;font-size:14px;padding:12px 20px;border-radius:11px">Request payout</button>
        </div>
        ${[['Pending clearance','1,240,000',C.accentD],['Paid out (MTD)','6,220,000',C.primary]].map(([a,b,c])=>`<div style="background:#fff;border:1px solid ${C.line};border-radius:18px;padding:22px"><div style="color:${C.muted};font-size:13px;font-weight:600">${a}</div><div style="font-weight:800;font-size:26px;margin-top:8px;color:${c}"><span class="mono">${b}</span></div></div>`).join('')}
      </div>
      <div style="font-weight:800;font-size:16px;margin-bottom:14px">Transactions</div>
      <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">
        <div style="display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 120px;padding:14px 20px;background:${C.bg};font-weight:800;font-size:12px;color:${C.muted}"><div>DESCRIPTION</div><div>ORDER</div><div>DATE</div><div>AMOUNT (IQD)</div><div>STATUS</div></div>
        ${[['Broker margin · Baghdad → Basra','#NF-20461','6 Aug','+220,000','Cleared',C.primary],
           ['Broker margin · Erbil → Habur','#NF-20455','5 Aug','+310,000','Cleared',C.primary],
           ['Payout to bank · IBAN ••• 4471','—','4 Aug','-1,500,000','Paid',C.muted],
           ['Broker margin · Basra → Kuwait','#NF-20448','4 Aug','+280,000','Pending',C.accentD]].map((r,i)=>`
          <div style="display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 120px;padding:15px 20px;align-items:center;font-size:13.5px;${i?'border-top:1px solid '+C.line:''}">
            <div style="font-weight:700">${r[0]}</div><div style="color:${C.muted};font-weight:600">${r[1]}</div><div style="color:${C.muted};font-weight:600">${r[2]}</div><div class="mono" style="font-weight:800;color:${r[3][0]==='+'?C.primary:C.text}">${r[3]}</div>
            <div><span style="font-weight:800;font-size:12px;color:${r[5]}">● ${r[4]}</span></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`));

/* write manifest */
fs.writeFileSync(path.join(__dirname,'manifest.json'),JSON.stringify(manifest,null,2));

/* ---------- browsable index.html ---------- */
(function writeIndex(){
  const groups = {
    client:        { title:'Client App',    tag:'Mobile · iOS / Android', kind:'phone' },
    driver:        { title:'Driver App',     tag:'Mobile · iOS / Android', kind:'phone' },
    'fleet-portal': { title:'Fleet Portal',   tag:'Web · scoped operator portal', kind:'desktop' },
    'broker-portal':{ title:'Broker Portal',  tag:'Web · scoped broker portal', kind:'desktop' },
    'control-panel':{ title:'Control Panel', tag:'Web · React + TypeScript', kind:'desktop' },
  };
  const titleize = s => s.replace(/^\d+-/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const byGroup = {};
  manifest.forEach(m=>{
    const [g,name] = m.out.replace('.png','').split('/');
    (byGroup[g] ||= []).push({ ...m, g, label:titleize(name) });
  });
  // Order screens within each group by filename (code-point) so numbered
  // screens and their sub-screens/modals (e.g. 02 → 02b) read logically.
  Object.keys(byGroup).forEach(g=>byGroup[g].sort((a,b)=>a.out<b.out?-1:a.out>b.out?1:0));
  const total = manifest.length;
  const section = (g)=>{
    const meta = groups[g] || { title:titleize(g), tag:'', kind:'phone' };
    const items = (byGroup[g]||[]).map(m=>`
      <figure class="card ${meta.kind}">
        <a class="shot" href="${m.out}" data-full="${m.out}" data-label="${m.label} · ${m.w}×${m.h}">
          <img loading="lazy" src="${m.out}" width="${m.w}" height="${m.h}" alt="${m.label}">
        </a>
        <figcaption>
          <div class="cap-row">
            <span class="cap-title">${m.label}</span>
            <a class="dl" href="${m.out}" download title="Download PNG">↓ PNG</a>
          </div>
          <span class="cap-sub">${m.w}×${m.h}</span>
        </figcaption>
      </figure>`).join('');
    return `
    <section class="group" id="${g}">
      <header class="group-head">
        <div>
          <h2>${meta.title}</h2>
          <p>${meta.tag}</p>
        </div>
        <span class="count">${(byGroup[g]||[]).length} screens</span>
      </header>
      <div class="grid ${meta.kind}-grid">${items}</div>
    </section>`;
  };
  const nav = Object.keys(byGroup).map(g=>{
    const meta = groups[g]||{title:titleize(g)};
    return `<a href="#${g}">${meta.title}</a>`;
  }).join('');
  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NEXT Freight · Design Mockups</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--p:${C.primary};--pd:${C.primaryD};--ink:${C.ink};--bg:${C.bg};--line:${C.line};--muted:${C.muted}}
  html{scroll-behavior:smooth}
  body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Inter,system-ui,sans-serif;color:#0F172A;background:var(--bg);-webkit-font-smoothing:antialiased}
  a{color:inherit;text-decoration:none}
  .topbar{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.82);backdrop-filter:saturate(180%) blur(14px);border-bottom:1px solid var(--line)}
  .topbar-in{max-width:1240px;margin:0 auto;padding:16px 28px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}
  .brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:19px}
  .logo{width:34px;height:34px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800}
  .brand small{display:block;font-weight:600;font-size:12px;color:var(--muted)}
  nav{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
  nav a{padding:8px 14px;border-radius:999px;font-weight:700;font-size:14px;color:var(--pd);background:${C.primaryL}}
  nav a:hover{background:var(--p);color:#fff}
  .hero{max-width:1240px;margin:0 auto;padding:40px 28px 8px}
  .hero h1{font-size:34px;letter-spacing:-.02em}
  .hero p{margin-top:10px;color:var(--muted);font-size:16px;max-width:640px}
  .hero .stat{margin-top:18px;display:inline-flex;gap:8px;align-items:center;font-weight:700;font-size:14px;color:var(--pd);background:${C.primaryL};padding:8px 14px;border-radius:999px}
  main{max-width:1240px;margin:0 auto;padding:24px 28px 80px}
  .group{margin-top:40px}
  .group-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding-bottom:16px;border-bottom:1px solid var(--line);margin-bottom:22px}
  .group-head h2{font-size:22px;letter-spacing:-.01em}
  .group-head p{color:var(--muted);font-size:14px;margin-top:3px}
  .count{color:var(--muted);font-size:13px;font-weight:700;white-space:nowrap}
  .grid{display:grid;gap:26px}
  .phone-grid{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}
  .desktop-grid{grid-template-columns:repeat(auto-fill,minmax(440px,1fr))}
  .card{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;transition:transform .15s ease,box-shadow .15s ease}
  .card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(180,71,10,.14)}
  .shot{display:block;background:linear-gradient(160deg,#241608,#0b3227)}
  .card.desktop .shot{background:#0f172a}
  .shot img{display:block;width:100%;height:auto}
  figcaption{padding:14px 16px 16px}
  .cap-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
  .cap-title{font-weight:800;font-size:15px}
  .cap-sub{display:block;margin-top:2px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
  .dl{font-size:12px;font-weight:800;color:var(--pd);background:${C.primaryL};padding:6px 10px;border-radius:8px;white-space:nowrap}
  .dl:hover{background:var(--p);color:#fff}
  footer{max-width:1240px;margin:0 auto;padding:0 28px 60px;color:var(--muted);font-size:13px}
  /* lightbox */
  .lb{position:fixed;inset:0;z-index:100;background:rgba(6,18,13,.94);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;padding:36px}
  .lb.open{display:flex}
  .lb img{max-width:92vw;max-height:90vh;width:auto;height:auto;border-radius:16px;box-shadow:0 30px 90px rgba(0,0,0,.6)}
  .lb-btn{position:absolute;border:0;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
  .lb-btn:hover{background:rgba(255,255,255,.3)}
  .lb-close{top:22px;right:26px;width:48px;height:48px;border-radius:50%;font-size:22px}
  .lb-nav{top:50%;transform:translateY(-50%);width:56px;height:56px;border-radius:50%;font-size:30px}
  .lb-prev{left:26px}.lb-next{right:26px}
  .lb-cap{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);color:#fff;font-weight:700;font-size:14.5px;background:rgba(0,0,0,.45);padding:9px 18px;border-radius:999px;font-variant-numeric:tabular-nums}
  body.lb-lock{overflow:hidden}
  @media (max-width:640px){.lb-nav{width:46px;height:46px;font-size:24px}.lb-prev{left:10px}.lb-next{right:10px}}
</style></head>
<body>
  <div class="topbar"><div class="topbar-in">
    <div class="brand"><div class="logo">${brandMark(24)}</div><div>NEXT Freight<small>Design mockups</small></div></div>
    <nav>${nav}</nav>
  </div></div>
  <div class="hero">
    <h1>Product design mockups</h1>
    <p>High-fidelity screen designs for the NEXT Freight platform — client &amp; driver mobile apps and the operations control panel. Click any screen to open full-size, or download the PNG.</p>
    <span class="stat">● ${total} screens · ${Object.keys(byGroup).length} surfaces</span>
  </div>
  <main>${Object.keys(byGroup).map(section).join('')}</main>
  <footer>Rendered at native device resolution · NEXT Freight · Iraq launch market.</footer>
  <div class="lb" id="lb" aria-hidden="true">
    <button class="lb-btn lb-close" id="lbClose" aria-label="Close">✕</button>
    <button class="lb-btn lb-nav lb-prev" id="lbPrev" aria-label="Previous">‹</button>
    <img id="lbImg" src="" alt="">
    <button class="lb-btn lb-nav lb-next" id="lbNext" aria-label="Next">›</button>
    <div class="lb-cap" id="lbCap"></div>
  </div>
  <script>
  (function(){
    var shots=[].slice.call(document.querySelectorAll('.shot'));
    var lb=document.getElementById('lb'),img=document.getElementById('lbImg'),cap=document.getElementById('lbCap'),i=0;
    function show(n){i=(n+shots.length)%shots.length;var s=shots[i];img.src=s.getAttribute('data-full');cap.textContent=s.getAttribute('data-label');}
    function open(n){show(n);lb.classList.add('open');document.body.classList.add('lb-lock');}
    function close(){lb.classList.remove('open');document.body.classList.remove('lb-lock');img.src='';}
    shots.forEach(function(s,n){s.addEventListener('click',function(e){e.preventDefault();open(n);});});
    document.getElementById('lbClose').addEventListener('click',close);
    document.getElementById('lbPrev').addEventListener('click',function(e){e.stopPropagation();show(i-1);});
    document.getElementById('lbNext').addEventListener('click',function(e){e.stopPropagation();show(i+1);});
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(i-1);else if(e.key==='ArrowRight')show(i+1);});
  })();
  </script>
</body></html>`;
  fs.writeFileSync(path.join(OUT,'index.html'), html);
})();
console.log('Generated '+manifest.length+' screens');
