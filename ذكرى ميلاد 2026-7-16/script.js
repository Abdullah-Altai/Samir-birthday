const memories = [
  { image: 'images/1.jpg', text: 'هنا جنة مجبورين نرفع العلم لان معاذ جان ديشتغل ' },
  { image: 'images/2.jpg', text: 'هنا جنت محدد واخذتلك صورة مال مصورين وسويتك ستريك' },
  { image: 'images/3.jpg', text: 'وهنا جان عدنة لاب وخلصنة اني وياك اول شي لان احنة شطار ' },
  { image: 'images/4.jpg', text: 'وهنا جنة رايحين للجامعة ومريم راحب يم صديقة امهة وكعت ادور عليهة اني ساعتين' },
  { image: 'images/5.jpg', text: 'وهنا جان من احلا الايام الي كضيناها سوية وضحكنة وتونسنة هواي' },
  { image: 'images/6.jpg', text: 'وهنا جان معاذ رايح يجيب اكل وجنة كاعدين وصورتك بدون سبب' },
  { image: 'images/7.jpg', text: 'وهنا جانت بداية تعارفنة وجنة اصدقاء عاديين ومو هلكد نعرف بعض وجانت هاي اول سنة ' },
  { image: 'images/8.jpg', text: 'وهنا اخذت مناضر مدري مالمن وجنة منجمعين وجنت دا اصورك تشوف بس صارت صورة سينمائية' },
  { image: 'images/9.jpg', text: 'وهنا وي عميد فابيان ونقيب معاذ وهاي جانت اخر صورة جان بيهة فابيان ويانة' },
  { image: 'images/10.jpg', text: 'وهنا جنة مرحلة ثانية وانت زينت وطلعت فرجة وصورنة وضحكنة على محمد سيروان' }
];

let memoryIndex = 0;
let selectedEmoji = '🤍';

const screens = [...document.querySelectorAll('.screen')];
function showScreen(id){
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function createStars(){
  const box = document.getElementById('stars');
  for(let i=0;i<80;i++){
    const s=document.createElement('span');s.className='star';
    s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
    s.style.setProperty('--d',(2+Math.random()*4)+'s');
    box.appendChild(s);
  }
}
createStars();

document.getElementById('startMemories').addEventListener('click',()=>{
  buildCards();showScreen('memoriesScreen');
});

function buildCards(){
  const stage=document.getElementById('polaroidStage');stage.innerHTML='';
  memories.slice().reverse().forEach((m,ri)=>{
    const actual=memories.length-1-ri;
    const card=document.createElement('article');
    card.className='polaroid';card.dataset.index=actual;
    card.style.zIndex=memories.length-actual;
    card.style.setProperty('--rot',`${(actual%2===0?-1:1)*(1+actual*.18)}deg`);
    card.innerHTML=`<img src="${m.image}" alt="ذكرى ${actual+1}"><div class="caption">${m.text}</div>`;
    stage.appendChild(card);
  });
}

document.getElementById('nextMemory').addEventListener('click',()=>{
  const current=document.querySelector(`.polaroid[data-index="${memoryIndex}"]`);
  if(current) current.classList.add('fly');
  memoryIndex++;
  if(memoryIndex<memories.length){
    document.getElementById('memoryCounter').textContent=`${memoryIndex+1} من ${memories.length}`;
  }else{
    setTimeout(()=>showScreen('letterScreen'),900);
  }
});

document.getElementById('toReply').addEventListener('click',()=>showScreen('replyScreen'));

document.querySelectorAll('#emojiRow button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('#emojiRow button').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');selectedEmoji=btn.dataset.emoji;
}));

async function saveMessage(payload){
  const cfg=window.SITE_CONFIG||{};
  if(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase){
    const client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
    const {error}=await client.from('messages').insert(payload);
    if(error) throw error;
    return;
  }
  const list=JSON.parse(localStorage.getItem('memory_messages')||'[]');
  list.unshift({...payload,id:crypto.randomUUID()});
  localStorage.setItem('memory_messages',JSON.stringify(list));
}

document.getElementById('replyForm').addEventListener('submit',async(e)=>{
  e.preventDefault();
  const btn=e.target.querySelector('button[type="submit"]');
  btn.disabled=true;btn.textContent='جاري الإرسال…';
  try{
    await saveMessage({
      sender_name:'شخص عزيز',
      message:document.getElementById('senderMessage').value.trim(),
      emoji:selectedEmoji,
      created_at:new Date().toISOString()
    });
    e.target.style.display='none';document.getElementById('successBox').classList.add('show');
  }catch(err){
    alert('تعذر إرسال الرسالة. تأكد من إعدادات Supabase.');
    btn.disabled=false;btn.textContent='أرسل رسالتي';
  }
});

const audio=document.getElementById('bgMusic');
const soundBtn=document.getElementById('soundBtn');
soundBtn.addEventListener('click',async()=>{
  if(audio.paused){try{await audio.play();soundBtn.textContent='❚❚';}catch(e){alert('أضف ملف music.mp3 داخل مجلد الموقع أولاً.')}}
  else{audio.pause();soundBtn.textContent='♫';}
});
