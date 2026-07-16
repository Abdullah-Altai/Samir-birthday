const cfg=window.SITE_CONFIG||{};
const login=document.getElementById('login'),panel=document.getElementById('panel');
document.getElementById('loginBtn').onclick=()=>{if(document.getElementById('pass').value===cfg.ADMIN_PASSWORD){login.hidden=true;panel.hidden=false;loadMessages()}else alert('الرمز غير صحيح')};
document.getElementById('refresh').onclick=loadMessages;
async function loadMessages(){
 let data=[];
 if(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase){
   const client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
   const res=await client.from('messages').select('*').order('created_at',{ascending:false});
   if(res.error){alert(res.error.message);return} data=res.data||[];
 }else data=JSON.parse(localStorage.getItem('memory_messages')||'[]');
 document.getElementById('count').textContent=`عدد الرسائل: ${data.length}`;
 const box=document.getElementById('messages');
 box.innerHTML=data.length?data.map(m=>`<article class="msg"><h3>${esc(m.emoji||'🤍')} ${esc(m.sender_name||'بدون اسم')}</h3><div class="meta">${new Date(m.created_at).toLocaleString('ar-IQ')}</div><p>${esc(m.message||'')}</p></article>`).join(''):'<div class="empty">لا توجد رسائل بعد</div>';
}
function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
