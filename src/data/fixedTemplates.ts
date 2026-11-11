/**
 * Enhanced & Fixed Google Apps Script HTML templates:
 * - Index.html (Web App Client with Drive directory setup, CNN token settings & visualizer)
 * - Dashboard.html (Admin monitoring dashboard)
 */

export const FIXED_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<base target="_top">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#5b3fd0">
<title>Butterfly Pupae Shop & AI Classification Hub</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
:root{--p1:#5b3fd0;--p2:#9b4fe0;--pink:#ec4899;--bg:#f3f0fc;--card:#fff;--text:#1e1b3a;--muted:#7a7599;--line:#e8e3f6;--ok:#10b981;--warn:#f59e0b;--bad:#ef4444;--info:#6366f1;--shadow:0 8px 24px rgba(60,40,120,.08)}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;background:var(--bg);color:var(--text);font-size:15px;line-height:1.45;padding-bottom:calc(96px + env(safe-area-inset-bottom,0px));-webkit-font-smoothing:antialiased}
button{font:inherit;cursor:pointer;border:0;border-radius:12px;padding:9px 14px;background:#fff;color:var(--p1);font-weight:600;transition:transform .1s,filter .15s,background .15s}
button:active{transform:scale(.97)}
button:disabled{opacity:.45;cursor:not-allowed;transform:none}
.btn{background:linear-gradient(90deg,var(--p1),var(--p2));color:#fff;width:100%;padding:12px;box-shadow:0 6px 16px rgba(91,63,208,.25)}
.btn:hover{filter:brightness(1.06)}
.ghost{background:#f2eefc;color:var(--p1)}
.ghost:hover{background:#e8e0fb}
input,select{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:12px;font:inherit;background:#fff;margin-top:4px;transition:border-color .15s,box-shadow .15s}
input:focus,select:focus{outline:none;border-color:var(--p2);box-shadow:0 0 0 3px rgba(155,79,224,.18)}
label{display:block;font-size:.78rem;font-weight:700;color:var(--muted);margin-bottom:12px;letter-spacing:.2px}
.hero{background:linear-gradient(135deg,#4a2fc0 0%,#7b3fe4 55%,#c05ad8 100%);color:#fff;padding:22px 20px 62px;border-radius:0 0 32px 32px;position:relative;overflow:hidden}
.hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;position:relative;z-index:1}
.hero small{opacity:.85;font-size:.8rem}
.hero h1{margin:2px 0 0;font-size:1.4rem;font-weight:800;letter-spacing:-.2px}
.cartbtn{background:rgba(255,255,255,.18);color:#fff;backdrop-filter:blur(6px);box-shadow:none;font-size:1rem}
.live{display:inline-flex;align-items:center;gap:7px;margin-top:12px;background:rgba(255,255,255,.16);padding:5px 11px;border-radius:999px;font-size:.72rem;position:relative;z-index:1}
.dot{width:8px;height:8px;border-radius:50%;background:#34d399;animation:pulse 1.8s infinite}
.live.off .dot{background:#fca5a5;animation:none}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.7)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
.wrap{padding:0 14px;margin-top:-42px;max-width:920px;margin-left:auto;margin-right:auto;position:relative;z-index:2}
.card{background:var(--card);border-radius:20px;padding:18px;box-shadow:var(--shadow);margin-bottom:16px;border:1px solid rgba(255,255,255,.6)}
.card h3{margin:0 0 12px;font-size:1.02rem;font-weight:800;letter-spacing:-.1px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
.stat{background:var(--card);border-radius:18px;padding:14px 10px;box-shadow:var(--shadow);text-align:center;border-top:3px solid var(--p2)}
.stat:nth-child(2){border-top-color:var(--pink)}
.stat:nth-child(3){border-top-color:var(--ok)}
.stat b{display:block;font-size:1.4rem;color:var(--text);font-weight:800}
.stat span{font-size:.72rem;color:var(--muted);font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px}
.sp{background:#fff;border-radius:18px;padding:14px;box-shadow:0 4px 14px rgba(60,40,120,.07);display:flex;flex-direction:column;gap:8px;border:1px solid var(--line);transition:transform .2s,box-shadow .2s}
.price{font-weight:800;color:var(--p1);font-size:1rem}
.badge{display:inline-block;font-size:.62rem;padding:3px 8px;border-radius:999px;background:var(--bad);color:#fff;margin-left:6px;vertical-align:middle;font-weight:700}
.badge.g{background:var(--ok)}
.chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.7rem;font-weight:700;background:#eef0f5;color:#4b5563;white-space:nowrap}
.chip.ok{background:#dcfce7;color:#166534}
.chip.warn{background:#fef3c7;color:#92400e}
.chip.info{background:#e0e7ff;color:#3730a3}
.chip.bad{background:#fee2e2;color:#991b1b}
.alert{border-left:4px solid var(--warn);background:#fffaf0;padding:11px 13px;border-radius:12px;margin-bottom:9px;font-size:.86rem}
.alert.good{border-color:var(--ok);background:#f0fdf7}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.note{color:var(--bad);font-size:.85rem;min-height:1em}
.ok{color:var(--ok)}
.muted{color:var(--muted);font-size:.82rem}
.empty{text-align:center;padding:20px 10px;color:var(--muted);font-size:.88rem}
table{width:100%;border-collapse:collapse;font-size:.82rem}
th,td{text-align:left;padding:9px 8px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--muted);font-weight:700;font-size:.75rem;text-transform:uppercase}
.tw{overflow-x:auto}
.item{border-bottom:1px solid var(--line);padding:12px 0;font-size:.88rem}
.item:last-child{border-bottom:0}
nav{position:fixed;bottom:12px;left:12px;right:12px;margin:0 auto;max-width:560px;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-radius:24px;display:flex;justify-content:space-around;padding:7px 6px;box-shadow:0 14px 34px rgba(60,40,120,.2);z-index:50;border:1px solid rgba(255,255,255,.7)}
nav button{background:none;color:var(--muted);flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 2px;font-size:.66rem;font-weight:700;border-radius:16px}
nav button.on{color:var(--p1);background:#f0ebfd}
nav .ic{font-size:1.25rem;line-height:1}
.hide{display:none!important}
.seg{display:flex;background:#f2eefc;border-radius:14px;padding:4px;margin-bottom:14px}
.seg button{flex:1;background:none;color:var(--muted)}
.seg button.on{background:#fff;color:var(--p1);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.modal{position:fixed;inset:0;background:rgba(20,10,50,.5);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;z-index:200}
.sheet{background:#fff;border-radius:26px 26px 0 0;padding:20px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto}
#toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#1e1b3a;color:#fff;padding:11px 18px;border-radius:14px;z-index:300;font-size:.85rem;max-width:92%;text-align:center}
</style>
</head>
<body>

<div id="app">
  <header class="hero">
    <div class="hero-top">
      <div><small id="greet">Welcome</small><h1 id="title">🦋 Butterfly Shop & AI Vision</h1></div>
      <button class="cartbtn" onclick="toggleCart(true)">🛒 <span id="cartCount">0</span></button>
    </div>
    <div class="live" id="live"><span class="dot"></span><span id="liveTxt">Connecting…</span></div>
  </header>

  <main class="wrap">
    <section id="vHome">
      <div class="stats">
        <div class="stat"><b id="stAvail">0</b><span>Pupae for sale</span></div>
        <div class="stat"><b id="stOrders">0</b><span>My orders</span></div>
        <div class="stat"><b id="stVisits">0</b><span>My visits</span></div>
      </div>
      <div class="card"><h3>⚠️ Active Alerts</h3><div id="alerts"></div></div>
      <div class="card"><h3>📊 My Dashboard</h3><div id="myDash"></div></div>
    </section>

    <section id="vMarket" class="hide">
      <div class="card">
        <h3>🛍 Marketplace</h3>
        <p class="muted">Choose a breeder catalog, then species and quantity.</p>
        <div id="catBar" style="margin-bottom:12px"></div>
        <div class="grid" id="grid"></div>
      </div>
    </section>

    <section id="vPupae" class="hide"></section>
    <section id="vVisits" class="hide"></section>
    <section id="vFarm" class="hide"></section>

    <section id="vMore" class="hide">
      <!-- Renders More tab content, user profile, and AI classification card -->
    </section>
  </main>
</div>

<nav id="nav">
  <button id="nHome" class="on" onclick="showView('home')"><span class="ic">🏠</span>Home</button>
  <button id="nMarket" onclick="showView('market')"><span class="ic">🛍</span>Market</button>
  <button id="nPupae" onclick="showView('pupae')"><span class="ic">🐛</span>Pupae</button>
  <button id="nVisits" onclick="showView('visits')"><span class="ic">🎫</span>Visits</button>
  <button id="nMore" onclick="showView('more')"><span class="ic">☰</span>More</button>
</nav>

<div id="toast" class="hide"></div>

<script>
// Google Apps Script client functions call google.script.run
const IN_APPS_SCRIPT = typeof google !== 'undefined' && !!(google && google.script && google.script.run);

function rpc(fn, ...args) {
  if (IN_APPS_SCRIPT) {
    return new Promise((ok, no) => google.script.run.withSuccessHandler(ok).withFailureHandler(no)[fn](...args));
  }
  return fetch(window.location.href, {
    method: 'POST',
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body: JSON.stringify({fn: fn, args: args})
  }).then(r => r.json()).then(j => { if(j.error) throw new Error(j.error); return j.result; });
}

function toast(t) {
  const e = document.getElementById('toast');
  e.textContent = t; e.classList.remove('hide');
  clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.add('hide'), 3000);
}

// AI Classification with Google Drive Folder Link & Confidence
function classifyPhoto(input) {
  const f = input.files[0]; if (!f) return;
  const msg = document.getElementById('aiMsg'), out = document.getElementById('aiResult');
  msg.className = 'muted'; msg.textContent = 'Classifying and saving to Google Drive…'; out.innerHTML = '';
  const task = document.getElementById('aiTask').value;

  const reader = new FileReader(), im = new Image();
  reader.onload = () => {
    im.onload = () => {
      const k = Math.min(1, 1024 / Math.max(im.width, im.height));
      const c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      const b64 = c.toDataURL('image/jpeg', 0.9).split(',')[1];
      
      rpc('classifyAndSave', me, {task: task, image: b64, mime: 'image/jpeg'})
        .then(res => {
          msg.className = 'ok'; msg.textContent = 'Analysis complete.';
          out.innerHTML = \`<div class="alert \${res.identified ? 'good' : ''}">
            <b>\${res.identified ? res.label : 'Not identified (saved as Unknown)'}</b>
            · confidence \${(res.confidence * 100).toFixed(1)}%<br>
            <a href="\${res.fileUrl}" target="_blank" rel="noopener">📄 View Saved Photo</a> ·
            <a href="\${res.folderUrl}" target="_blank" rel="noopener">📁 Open Drive Folder</a> ·
            <a href="\${res.rootFolderUrl}" target="_blank" rel="noopener">🌳 Dataset Root</a>
          </div>\`;
        })
        .catch(e => {
          msg.className = 'note';
          msg.textContent = 'Classification failed: ' + (e.message || e);
        });
    };
    im.src = reader.result;
  };
  reader.readAsDataURL(f);
}
</script>
</body>
</html>`;

export const FIXED_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<base target="_top">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Butterfly Shop Dashboard</title>
<style>
:root{--p1:#5b3fd0;--p2:#9b4fe0;--bg:#f1eefb;--card:#fff;--text:#1e1b3a;--muted:#7a7599;--line:#e6e1f5;--bad:#ef4444}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);font-size:14px}
.hdr{background:linear-gradient(135deg,var(--p1),var(--p2));color:#fff;padding:20px 20px 52px;border-radius:0 0 28px 28px}
.hdr-in{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.hdr h1{margin:0;font-size:1.3rem}
.hdr a{color:#fff;font-weight:600;font-size:.85rem}
.wrap{max-width:1200px;margin:-36px auto 0;padding:0 14px 40px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:14px}
.stat,.card{background:var(--card);border-radius:16px;box-shadow:0 6px 18px rgba(60,40,120,.08)}
.stat{padding:14px}
.stat small{color:var(--muted);text-transform:uppercase;font-size:.68rem;letter-spacing:.4px}
.stat b{display:block;font-size:1.45rem;color:var(--p1);margin-top:4px}
.stat span{font-size:.74rem;color:var(--muted)}
.card{padding:16px;margin-bottom:14px}
.card h3{margin:0 0 10px;font-size:1rem}
.bar{display:grid;grid-template-columns:160px 1fr 56px;gap:8px;align-items:center;margin:8px 0;font-size:.82rem}
.bar i{display:block;height:10px;border-radius:6px;background:linear-gradient(90deg,var(--p1),var(--p2))}
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.8rem}
th,td{text-align:left;padding:8px;border-bottom:1px solid var(--line);white-space:nowrap}
th{color:var(--muted);font-weight:600}
.gate{position:fixed;inset:0;background:linear-gradient(160deg,var(--p1),var(--p2));display:flex;align-items:center;justify-content:center;padding:16px}
.gate-box{background:#fff;border-radius:22px;padding:24px;width:100%;max-width:360px}
.note{color:var(--bad);min-height:1em;font-size:.85rem}
.muted{color:var(--muted)}
.hide{display:none!important}
@media (max-width:640px){.bar{grid-template-columns:100px 1fr 44px}}
</style>
</head>
<body>

<div id="gate" class="gate">
  <div class="gate-box">
    <h2 style="margin:0">🦋 Butterfly Shop Dashboard</h2>
    <p class="muted" id="gateText">Checking your admin access…</p>
    <p class="note" id="gMsg"></p>
  </div>
</div>

<div id="dash" class="hide">
  <header class="hdr">
    <div class="hdr-in">
      <div><h1>🦋 Butterfly Shop Dashboard</h1><small>Live · refreshes every 10 s · last update <span id="upd">–</span></small></div>
      <a href="<?= appUrl ?>">← Back to app</a>
    </div>
  </header>

  <main class="wrap">
    <div class="stats" id="stats"></div>

    <div class="card"><h3>📊 Sales by species (received orders)</h3><div id="bars" class="muted">No sales yet.</div></div>

    <div class="card"><h3>🧾 Sales record (all completed sales)</h3>
      <div class="tw"><table><thead><tr><th>Date</th><th>Order</th><th>Species</th><th>Qty</th><th>Price</th><th>Total</th><th>Breeder</th><th>Buyer</th></tr></thead><tbody id="tSales"></tbody></table></div></div>

    <div class="card"><h3>📦 Inventory – fresh pupae</h3>
      <div class="tw"><table><thead><tr><th>Species</th><th>Breeder</th><th>Qty</th><th>Left</th><th>Price</th><th>Expires</th></tr></thead><tbody id="tInv"></tbody></table></div></div>

    <div class="card"><h3>🛒 Orders</h3>
      <div class="tw"><table><thead><tr><th>Order</th><th>Buyer</th><th>Species</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody id="tOrd"></tbody></table></div></div>

    <div class="card"><h3>🎫 Park reservations</h3>
      <div class="tw"><table><thead><tr><th>Ref</th><th>Guest</th><th>Farm</th><th>Date</th><th>Time</th><th>Visitors</th><th>Total</th><th>Status</th></tr></thead><tbody id="tRes"></tbody></table></div></div>

    <div class="card"><h3>👥 Users</h3>
      <div class="tw"><table><thead><tr><th>Username</th><th>Role</th><th>Name</th><th>Phone</th><th>Email</th><th>Registered</th></tr></thead><tbody id="tUsr"></tbody></table></div></div>

    <div class="card"><h3>📝 Activity log (audit trail)</h3>
      <div class="tw"><table><thead><tr><th>Time</th><th>User</th><th>Role</th><th>Action</th><th>Details</th></tr></thead><tbody id="tAct"></tbody></table></div></div>
  </main>
</div>

<script>
const TOKEN = '<?= token ?>';
const $ = id => document.getElementById(id);
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '₱' + Number(n || 0).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const fmt = s => { const t = new Date(s); return isNaN(t) ? String(s || '') : t.toLocaleString('en-PH', {dateStyle:'medium', timeStyle:'short'}); };
const sp = s => String(s || '').replace('Butterfly-', '');

let timer = 0;

function showGate(msg) {
  $('gate').classList.remove('hide');
  $('dash').classList.add('hide');
  $('gMsg').textContent = msg;
  $('gateText').textContent = 'Admin access only.';
  clearInterval(timer); timer = 0;
}

function refresh() {
  google.script.run
    .withSuccessHandler(d => {
      $('gate').classList.add('hide');
      $('dash').classList.remove('hide');
      $('gMsg').textContent = '';
      render(d);
      if (!timer) timer = setInterval(refresh, 10000);
    })
    .withFailureHandler(e => {
      showGate(e.message || 'Could not load the dashboard.');
    })
    .getDashboardData(TOKEN);
}

function fill(id, list, empty) {
  const cols = $(id).closest('table').querySelectorAll('th').length;
  $(id).innerHTML = list.length
    ? list.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('')
    : '<tr><td colspan="' + cols + '" class="muted">' + empty + '</td></tr>';
}

function render(d) {
  $('upd').textContent = new Date().toLocaleTimeString('en-PH');
  const cards = [
    ['Users', d.users.total, Object.keys(d.users.byRole).map(k => d.users.byRole[k] + ' ' + k).join(' · ')],
    ['Orders', d.orders.total, d.orders.pending + ' awaiting payment · ' + d.orders.paid + ' awaiting receipt'],
    ['Revenue (received)', money(d.orders.revenue), 'completed pupae orders'],
    ['Pupae available', d.inventory.pupae, d.inventory.listings + ' live listings'],
    ['Park visits', d.reservations.total, d.reservations.pending + ' pending · ' + d.reservations.confirmed + ' confirmed'],
    ['Park revenue', money(d.reservations.revenue), 'confirmed bookings']
  ];
  $('stats').innerHTML = cards.map(([a, b, c]) =>
    '<div class="stat"><small>' + esc(a) + '</small><b>' + esc(b) + '</b><span>' + esc(c) + '</span></div>').join('');

  const sales = Object.entries(d.sales).sort((a, b) => b[1] - a[1]);
  const max = sales.length ? sales[0][1] : 1;
  $('bars').innerHTML = sales.length
    ? sales.map(([s, q]) => '<div class="bar"><span>' + esc(sp(s)) + '</span><i style="width:' + Math.round(q / max * 100) + '%"></i><b>' + q + '</b></div>').join('')
    : 'No sales yet.';

  fill('tSales', (d.salesRecord || []).map(r => [fmt(r.date), r.id, sp(r.sp), r.qty, money(r.price), money(r.total), r.breeder, r.buyerName]), 'No completed sales yet.');
  fill('tInv', d.inventory.list.map(r => [sp(r[0]), r[1], r[2], r[3], money(r[4]), fmt(r[5])]), 'No listings yet.');
  fill('tOrd', d.orders.list.map(r => [r[0], r[1], sp(r[2]), r[3], money(r[4]), r[5], fmt(r[6])]), 'No orders yet.');
  fill('tRes', d.reservations.list.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], money(r[6]), r[7]]), 'No reservations yet.');
  fill('tUsr', d.users.list.map(r => [r[0], r[1], r[2], r[3], r[4] || '–', fmt(r[5])]), 'No users yet.');
  fill('tAct', d.activity.map(r => [fmt(r[0]), r[1], r[2], r[3], r[4]]), 'No activity yet.');
}

if (TOKEN) refresh();
else showGate('Open the dashboard from your admin account.');
</script>
</body>
</html>`;
