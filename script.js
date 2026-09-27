let pet={name:"Мико",coins:250,level:1,xp:35,food:82,health:95,mood:91,energy:74,days:1,quests:{food:0,play:0,chat:0}};
function saveGame(){localStorage.setItem("neuropet_save",JSON.stringify(pet))}
function loadGame(){const save=localStorage.getItem("neuropet_save");if(save){try{pet=JSON.parse(save)}catch(e){console.log("Save error")}}}
loadGame();
const $=id=>document.getElementById(id);

function updateUI(){
$("petName").textContent=pet.name;$("profileName").textContent=pet.name;$("coins").textContent=pet.coins;
$("level").textContent=pet.level;$("profileLevel").textContent=pet.level;$("xp").textContent=pet.xp;$("profileXP").textContent=pet.xp;
$("profileCoins").textContent=pet.coins;$("daysTogether").textContent=pet.days;
$("foodValue").textContent=pet.food+"%";$("healthValue").textContent=pet.health+"%";$("moodValue").textContent=pet.mood+"%";$("energyValue").textContent=pet.energy+"%";
$("foodBar").style.width=pet.food+"%";$("healthBar").style.width=pet.health+"%";$("moodBar").style.width=pet.mood+"%";$("energyBar").style.width=pet.energy+"%";$("xpBar").style.width=pet.xp+"%";
$("questFood").textContent=pet.quests.food+"/1";$("questPlay").textContent=pet.quests.play+"/1";$("questChat").textContent=pet.quests.chat+"/1";
updatePetMood();saveGame();
}
function updatePetMood(){
const wrap=$("petWrap");wrap.classList.remove("sad","tired");
if(pet.food<25||pet.mood<25)wrap.classList.add("sad");
else if(pet.energy<20)wrap.classList.add("tired");
if(pet.food<25)$("petStatus").textContent="🥺 Мико хочет кушать...";
else if(pet.energy<20)$("petStatus").textContent="😴 Мико очень устал...";
else if(pet.food>70&&pet.energy>50&&pet.mood>70)$("petStatus").textContent="✨ Мико чувствует себя прекрасно!";
}
updateUI();

document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>{
document.querySelectorAll(".nav-item").forEach(item=>item.classList.remove("active"));button.classList.add("active");
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));$(button.dataset.page).classList.add("active-page");
}));

let notificationTimer;
function showNotification(text){const n=$("notification");$("notificationText").textContent=text;n.classList.add("show");clearTimeout(notificationTimer);notificationTimer=setTimeout(()=>n.classList.remove("show"),2500)}

function animatePet(type="happy"){
const el=$("petWrap");el.classList.remove("happy","eating","washing","playing","sleeping");void el.offsetWidth;el.classList.add(type);
if(type!=="sleeping")setTimeout(()=>el.classList.remove(type),1400);
}
function addXP(amount){pet.xp+=amount;while(pet.xp>=100){pet.xp-=100;pet.level++;pet.coins+=100;showNotification(`🎉 Новый уровень! Уровень ${pet.level}`)}updateUI()}

function feedPet(){
if(pet.food>=100){showNotification("🍗 Мико уже совсем не голоден!");return}
pet.food=Math.min(100,pet.food+18);pet.mood=Math.min(100,pet.mood+4);pet.quests.food=1;addXP(20);animatePet("eating");
$("petStatus").textContent="😋 Ммм, вкусно!";addPetMessage("Спасибо! Это было очень вкусно 😋");showNotification("🍎 Мико покормлен! +20 XP");updateUI()
}
function washPet(){
pet.health=Math.min(100,pet.health+8);pet.mood=Math.min(100,pet.mood+5);pet.energy=Math.max(0,pet.energy-5);addXP(10);animatePet("washing");
$("petStatus").textContent="🫧 Какой чистенький!";addPetMessage("Теперь я чистый и пушистый! 🫧");showNotification("🛁 Мико искупался!");updateUI()
}
function playWithPet(){
if(pet.energy<15){showNotification("😴 Мико слишком устал...");return}
pet.energy=Math.max(0,pet.energy-15);pet.mood=Math.min(100,pet.mood+15);pet.quests.play=1;pet.coins+=10;addXP(30);animatePet("playing");
$("petStatus").textContent="🎾 Это было весело!";addPetMessage("Ещё! Ещё! Давай играть! 🎾");showNotification("🎾 Вы поиграли! +30 XP");updateUI()
}
function sleepPet(){
const el=$("petWrap");el.classList.remove("happy","eating","washing","playing");el.classList.add("sleeping");
$("petStatus").textContent="💤 Мико спит...";showNotification("🌙 Мико отправился спать");
setTimeout(()=>{pet.energy=Math.min(100,pet.energy+35);pet.health=Math.min(100,pet.health+10);pet.mood=Math.min(100,pet.mood+5);el.classList.remove("sleeping");$("petStatus").textContent="☀️ Доброе утро!";addPetMessage("Я отлично выспался! Доброе утро ☀️");updateUI()},3500)
}

const responses={
hello:["Привет! 🐾","Рад тебя видеть!","Ты снова здесь! 😸","Привет-привет!"],
food:["Я немного проголодался 🍎","Ммм... я бы не отказался от еды.","Есть что-нибудь вкусненькое?"],
happy:["Мне сейчас очень хорошо 💖","Ты делаешь мой день лучше!","Я счастлив, что мы вместе."],
game:["Давай играть! 🎮","Я готов!","Попробуй меня победить 😼"],
sleep:["Я немного устал... 😴","Может, пора отдохнуть?","Зеваю... 💤"],
default:["Интересно! Расскажи ещё.","Я запомню это 🧠","Хмм... над этим надо подумать.","Мне нравится с тобой разговаривать!","Расскажи мне что-нибудь ещё 🐾"]};
function choose(a){return a[Math.floor(Math.random()*a.length)]}
function getAIResponse(text){
const m=text.toLowerCase();
if(m.includes("привет")||m.includes("здрав"))return choose(responses.hello);
if(m.includes("еда")||m.includes("куш")||m.includes("голод"))return choose(responses.food);
if(m.includes("игр")||m.includes("играть"))return choose(responses.game);
if(m.includes("спать")||m.includes("сон"))return choose(responses.sleep);
if(m.includes("люб")||m.includes("счаст"))return choose(responses.happy);
return choose(responses.default)
}
function addPetMessage(text){const c=$("chatMessages"),m=document.createElement("div");m.className="message pet-message";m.textContent=text;c.appendChild(m);c.scrollTop=c.scrollHeight}
function addUserMessage(text){const c=$("chatMessages"),m=document.createElement("div");m.className="message user-message";m.textContent=text;c.appendChild(m);c.scrollTop=c.scrollHeight}
function sendMessage(){
const input=$("chatInput"),text=input.value.trim();if(!text)return;addUserMessage(text);input.value="";
if(!pet.quests.chat){pet.quests.chat=1;addXP(15)}
setTimeout(()=>{addPetMessage(getAIResponse(text));pet.mood=Math.min(100,pet.mood+2);updateUI()},500)
}
$("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendMessage()});

function buyItem(item,price){
if(pet.coins<price){showNotification("🪙 Недостаточно монет!");return}
pet.coins-=price;
if(item==="apple")pet.food=Math.min(100,pet.food+15);
if(item==="pizza"){pet.food=Math.min(100,pet.food+25);pet.mood=Math.min(100,pet.mood+15)}
if(item==="ball")pet.mood=Math.min(100,pet.mood+10);
if(item==="toy")pet.mood=Math.min(100,pet.mood+20);
if(item==="plant")pet.mood=Math.min(100,pet.mood+5);
if(item==="rainbow")pet.mood=100;
showNotification("✨ Покупка совершена!");updateUI()
}

function startMiniGame(type){
const modal=$("gameModal"),content=$("gameContent");modal.classList.add("show");
if(type==="catch"){content.innerHTML=`<div class="mini-game"><h2>⭐ Поймай звезду</h2><p>Нажимай на звезду как можно быстрее!</p><button class="game-button" id="starButton" onclick="catchStar()">⭐</button><p id="gameScore">Очки: 0</p></div>`;window.gameScore=0;return}
if(type==="memory"){content.innerHTML=`<div class="mini-game"><h2>🧠 Memory</h2><p>Мини-игра памяти. Нажми кнопку!</p><button class="game-button" onclick="finishGame(40)">🧠</button></div>`;return}
content.innerHTML=`<div class="mini-game"><h2>🎾 Мячик</h2><p>Нажми на мяч и Мико его поймает!</p><button class="game-button" onclick="finishGame(30)">🎾</button></div>`
}
function catchStar(){window.gameScore++;$("gameScore").textContent="Очки: "+window.gameScore;const b=$("starButton");b.style.transform=`translate(${Math.random()*160-80}px,${Math.random()*100-50}px)`;if(window.gameScore>=10)finishGame(50)}
function finishGame(xp){const reward=Math.floor(xp/2);pet.coins+=reward;addXP(xp);closeGame();showNotification(`🏆 Игра завершена! +${xp} XP и 🪙${reward}`);updateUI()}
function closeGame(){$("gameModal").classList.remove("show")}

function renamePet(){const name=prompt("Как назвать питомца?",pet.name);if(!name)return;const clean=name.trim().slice(0,16);if(!clean)return;pet.name=clean;showNotification(`🐾 Теперь меня зовут ${clean}!`);updateUI()}
function updateTime(){const h=new Date().getHours();$("greeting").textContent=h>=6&&h<12?"Доброе утро":h>=12&&h<18?"Добрый день":"Добрый вечер"}
updateTime();

setInterval(()=>{pet.food=Math.max(0,pet.food-1);pet.energy=Math.max(0,pet.energy-1);if(pet.food<25)pet.mood=Math.max(0,pet.mood-2);if(pet.food>70&&pet.energy>50&&pet.mood>70&&!$("petWrap").classList.contains("sleeping"))$("petStatus").textContent="✨ Мико чувствует себя прекрасно!";updateUI()},30000);
setInterval(()=>{pet.days++;updateUI()},86400000);

$("petWrap").addEventListener("click",()=>{
const reactions=["🐾 Пиксельный привет!","😸 Мико посмотрел на тебя!","✨ Мне нравится, когда меня гладят!","💖 Ты мой лучший друг!","👀 Эй! Я здесь!","🐱 *довольное пиксельное мурчание*"];
$("petStatus").textContent=choose(reactions);animatePet("happy");pet.mood=Math.min(100,pet.mood+3);updateUI()
});

setTimeout(()=>{if(!localStorage.getItem("neuropet_welcome")){showNotification("🐾 Добро пожаловать в NeuroPet!");localStorage.setItem("neuropet_welcome","true")}},1000);
