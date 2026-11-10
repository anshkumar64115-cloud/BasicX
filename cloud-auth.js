import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://nsuqmxaffehfejndashv.supabase.co',
  'sb_publishable_HFTR6Z4qJhZ96cwI1w914A_zxNZcDJL'
);

const marker = 'basicxCloudUser';
let user = null, ready = false, hold = false, timer;

const keys = p => Object.keys(localStorage).filter(k => k.startsWith(p));
const snapshot = p => Object.fromEntries(keys(p).map(k => [k, localStorage.getItem(k)]));
const clear = p => keys(p).forEach(k => localStorage.removeItem(k));

async function upload() {
  if (!user || !ready || hold) return;
  const { error } = await db.from('user_progress').upsert({
    user_id: user.id,
    nsep: snapshot('nsep'),
    nsec: snapshot('nsec'),
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
  if (error) console.error('Cloud backup:', error.message);
}

async function restore(u) {
  ready = false;
  user = u;
  const { data, error } = await db.from('user_progress')
    .select('nsep,nsec').eq('user_id', u.id).maybeSingle();

  if (error) throw error;

  hold = true;
  if (data) {
    clear('nsep');
    clear('nsec');
    Object.entries(data.nsep || {}).forEach(([k,v]) => localStorage.setItem(k,v));
    Object.entries(data.nsec || {}).forEach(([k,v]) => localStorage.setItem(k,v));
  } else {
    const old = localStorage.getItem(marker);
    if (old && old !== u.id) {
      clear('nsep');
      clear('nsec');
    }
  }
  localStorage.setItem(marker, u.id);
  hold = false;
  ready = true;
  if (!data) await upload();
  status(data ? 'Cloud progress restored!' : 'Cloud backup created!');
  if(data){
    if(sessionStorage.getItem('bxCloudReload')===u.id) sessionStorage.removeItem('bxCloudReload');
    else {sessionStorage.setItem('bxCloudReload',u.id);location.reload();}
  }
}

const originalSet = localStorage.setItem.bind(localStorage);
const originalRemove = localStorage.removeItem.bind(localStorage);

localStorage.setItem = (k,v) => {
  originalSet(k,v);
  if (!hold && /^(nsep|nsec)/.test(k)) {
    clearTimeout(timer);
    timer = setTimeout(upload, 1800);
  }
};
localStorage.removeItem = k => {
  originalRemove(k);
  if (!hold && /^(nsep|nsec)/.test(k)) {
    clearTimeout(timer);
    timer = setTimeout(upload, 1800);
  }
};

const style = document.createElement('style');
style.textContent = `
#bxlogin{position:fixed;z-index:99999;right:16px;bottom:18px;background:#1769aa;color:white;border:0;border-radius:30px;padding:12px 17px;font-weight:bold}
#bxmodal{display:none;position:fixed;inset:0;z-index:100000;background:#000a;align-items:center;justify-content:center;font-family:Arial}
#bxpanel{background:white;color:#222;width: min(330px,88vw);padding:22px;border-radius:15px;box-sizing:border-box}
#bxpanel input{width:100%;padding:12px;margin:8px 0;box-sizing:border-box;border:1px solid #aaa;border-radius:8px}
#bxpanel button{padding:11px;border:0;border-radius:8px;margin:5px 3px;background:#1769aa;color:white}
#bxstatus{font-size:13px;margin:10px 0;color:#1769aa}
`;
document.head.appendChild(style);

document.body.insertAdjacentHTML('beforeend', `
<button id="bxlogin">☁ Account</button>
<div id="bxmodal"><div id="bxpanel">
<h3>BasicX Cloud Account</h3>
<input id="bxemail" type="email" placeholder="Email ID">
<input id="bxpass" type="password" placeholder="Password (min 6 characters)">
<div id="bxstatus">Login or create your account</div>
<button id="bxsignin">Login</button>
<button id="bxsignup">Sign Up</button>
<button id="bxlogout">Logout</button>
<button id="bxclose">Close</button>
</div></div>
`);

const modal = document.getElementById('bxmodal');
const msg = document.getElementById('bxstatus');
function status(t) { msg.textContent = t; }

document.getElementById('bxlogin').onclick = () => {
  modal.style.display = 'flex';
  status(user ? 'Logged in: ' + user.email : 'Login or create your account');
};
document.getElementById('bxclose').onclick = () => modal.style.display = 'none';

async function credentials(signup) {
  const email = document.getElementById('bxemail').value.trim();
  const password = document.getElementById('bxpass').value;
  if (!email || password.length < 6) return status('Valid email and 6+ character password required');
  status('Please wait...');
  try {
    const result = signup
      ? await db.auth.signUp({ email, password })
      : await db.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    if (!result.data.session) {
      status('Check your email to confirm, then Login.');
      return;
    }
    await restore(result.data.user);
    status('Login successful!');
  } catch(e) {
    status(e.message);
  }
}

document.getElementById('bxsignin').onclick = () => credentials(false);
document.getElementById('bxsignup').onclick = () => credentials(true);
document.getElementById('bxlogout').onclick = async () => {
  const { error } = await db.auth.signOut();
  if (error) return status(error.message);
  user = null;
  ready = false;
  status('Logged out. Your cloud data is safe.');
};

db.auth.getSession().then(async ({data,error}) => {
  if (error) return console.error(error);
  if (data.session) {
    try { await restore(data.session.user); }
    catch(e) { console.error('Cloud restore:', e.message); }
  }
});
