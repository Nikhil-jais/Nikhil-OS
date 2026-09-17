:root{
--ink:#30233d;
--muted:#76657f;
--pink:#ff75ad;
--purple:#9b83ed;
--blue:#7ac9ed;
--yellow:#ffe083;
--green:#73c991;
--glass:rgba(255,255,255,.68);
--glass2:rgba(255,255,255,.82);
--line:rgba(50,35,70,.12);
--shadow:0 22px 65px rgba(64,42,95,.18);
--accent:var(--pink);
--accent2:var(--purple);
}

*{
box-sizing:border-box;
}

html,
body{
margin:0;
width:100%;
height:100%;
overflow:hidden;
font-family:"Trebuchet MS","Segoe UI",sans-serif;
color:var(--ink);
}

button,
input,
textarea{
font:inherit;
}

button{
cursor:pointer;
}

body{
background:#cfeeff;
}

.desktop{
position:fixed;
inset:0;
overflow:hidden;
background:
linear-gradient(
180deg,
#8edcff 0%,
#dff6ff 45%,
#fff3fa 67%,
#c8e9c5 100%
);
transition:.6s;
}

.sky{
position:absolute;
inset:0;
background:
radial-gradient(
circle at 76% 17%,
rgba(255,255,255,.95),
transparent 13%
),
radial-gradient(
circle at 20% 25%,
rgba(255,255,255,.4),
transparent 18%
);
pointer-events:none;
}

.sun{
position:absolute;
right:11%;
top:12%;
width:105px;
height:105px;
border-radius:50%;
background:#fff2a5;
box-shadow:
0 0 30px #fff3b3,
0 0 90px rgba(255,215,91,.65);
transition:.5s;
}

.moon{
position:absolute;
right:12%;
top:13%;
width:95px;
height:95px;
border-radius:50%;
background:#fff;
box-shadow:
0 0 60px rgba(202,198,255,.8);
opacity:0;
transition:.5s;
}

.cloud{
position:absolute;
width:180px;
height:42px;
background:rgba(255,255,255,.65);
border-radius:60px;
z-index:1;
animation:cloudMove 38s linear infinite;
}

.cloud:before,
.cloud:after{
content:"";
position:absolute;
background:inherit;
border-radius:50%;
}

.cloud:before{
width:75px;
height:75px;
left:27px;
bottom:0;
}

.cloud:after{
width:90px;
height:90px;
right:20px;
bottom:-5px;
}

.cloud1{
top:19%;
left:-220px;
}

.cloud2{
top:34%;
left:-400px;
transform:scale(.72);
animation-duration:52s;
animation-delay:-17s;
}

.cloud3{
top:11%;
left:-500px;
transform:scale(.5);
animation-duration:65s;
animation-delay:-30s;
}

.mountains{
position:absolute;
left:0;
right:0;
bottom:16%;
height:27%;
background:
linear-gradient(
145deg,
transparent 0 12%,
rgba(116,169,161,.48) 12% 27%,
transparent 27% 39%,
rgba(102,157,153,.45) 39% 55%,
transparent 55% 68%,
rgba(139,187,166,.5) 68% 82%,
transparent 82%
);
clip-path:
polygon(
0 70%,
9% 34%,
18% 58%,
29% 15%,
42% 59%,
54% 25%,
68% 62%,
78% 32%,
89% 58%,
100% 20%,
100% 100%,
0 100%
);
}

.city{
position:absolute;
bottom:12%;
left:0;
width:100%;
height:25%;
display:flex;
align-items:flex-end;
gap:1vw;
opacity:.62;
pointer-events:none;
}

.building{
position:relative;
width:9vw;
min-width:45px;
background:
linear-gradient(
160deg,
rgba(111,112,155,.7),
rgba(79,98,133,.52)
);
border-radius:8px 8px 0 0;
box-shadow:
inset 0 0 0 1px rgba(255,255,255,.25);
}

.building:after{
content:"";
position:absolute;
inset:12px 9px;
background:
repeating-linear-gradient(
90deg,
rgba(255,239,158,.85) 0 8px,
transparent 8px 18px
),
repeating-linear-gradient(
0deg,
transparent 0 15px,
rgba(255,239,158,.75) 15px 23px
);
opacity:.65;
}

.building1{height:46%}
.building2{height:72%}
.building3{height:58%}
.building4{height:86%}
.building5{height:51%}
.building6{height:68%}
.building7{height:43%}
.building8{height:78%}

.street{
position:absolute;
left:0;
right:0;
bottom:0;
height:12%;
background:
linear-gradient(
180deg,
rgba(95,124,116,.2),
rgba(78,100,97,.45)
);
}

.street:after{
content:"";
position:absolute;
left:0;
right:0;
top:45%;
height:5px;
background:
repeating-linear-gradient(
90deg,
rgba(255,239,162,.8) 0 50px,
transparent 50px 100px
);
}

.trees{
position:absolute;
left:0;
right:0;
bottom:7%;
height:17%;
background:
radial-gradient(
ellipse at 5% 100%,
#65ac78 0 9%,
transparent 10%
),
radial-gradient(
ellipse at 17% 100%,
#79b981 0 11%,
transparent 12%
),
radial-gradient(
ellipse at 31% 100%,
#62a973 0 12%,
transparent 13%
),
radial-gradient(
ellipse at 49% 100%,
#7cbd82 0 10%,
transparent 11%
),
radial-gradient(
ellipse at 68% 100%,
#5ca371 0 13%,
transparent 14%
),
radial-gradient(
ellipse at 86% 100%,
#82c487 0 11%,
transparent 12%
);
pointer-events:none;
}

.glass{
background:var(--glass);
border:1px solid rgba(255,255,255,.75);
box-shadow:var(--shadow);
backdrop-filter:blur(18px);
-webkit-backdrop-filter:blur(18px);
}

.topbar{
position:absolute;
top:14px;
left:18px;
right:18px;
height:62px;
border-radius:22px;
padding:8px 13px 8px 10px;
display:flex;
align-items:center;
justify-content:space-between;
z-index:30;
}

.brand{
display:flex;
align-items:center;
gap:10px;
}

.brand-logo{
width:44px;
height:44px;
border-radius:15px;
display:grid;
place-items:center;
background:
linear-gradient(
135deg,
var(--pink),
var(--purple)
);
color:white;
font-size:20px;
font-weight:900;
box-shadow:0 10px 25px rgba(140,110,220,.3);
}

.brand strong{
display:block;
font-size:15px;
}

.brand small{
display:block;
font-size:9px;
color:var(--muted);
margin-top:2px;
}

.mood{
padding:8px 14px;
border-radius:999px;
background:rgba(255,255,255,.55);
font-size:11px;
font-weight:900;
color:var(--purple);
}

.system-info{
display:flex;
align-items:center;
gap:12px;
font-size:10px;
color:var(--muted);
}

.system-info button{
border:0;
background:rgba(255,255,255,.7);
width:38px;
height:38px;
border-radius:13px;
}

.welcome{
position:absolute;
left:6%;
top:100px;
width:min(550px,55vw);
padding:28px 30px;
border-radius:30px;
z-index:4;
}

.eyebrow{
font-size:9px;
font-weight:900;
letter-spacing:2px;
color:var(--purple);
}

.welcome h1{
font-size:clamp(28px,3.5vw,48px);
line-height:1.02;
margin:9px 0;
}

.welcome p{
font-size:12px;
line-height:1.65;
color:var(--muted);
margin-bottom:18px;
}

.welcome-buttons{
display:flex;
gap:8px;
flex-wrap:wrap;
}

.primary,
.secondary{
border:0;
border-radius:14px;
padding:11px 15px;
font-weight:900;
transition:.2s;
text-decoration:none;
display:inline-flex;
align-items:center;
justify-content:center;
}

.primary{
color:white;
background:
linear-gradient(
135deg,
var(--accent),
var(--accent2)
);
box-shadow:0 10px 25px rgba(143,124,243,.25);
}

.secondary{
color:var(--ink);
background:rgba(255,255,255,.72);
border:1px solid var(--line);
}

.primary:hover,
.secondary:hover{
transform:translateY(-2px);
}

.welcome-character{
position:absolute;
right:25px;
bottom:13px;
font-size:78px;
animation:float 3s ease-in-out infinite;
}

.welcome-character span{
display:block;
font-size:9px;
text-align:center;
background:white;
padding:4px 8px;
border-radius:99px;
color:var(--purple);
}

.desktop-icons{
position:absolute;
right:4%;
top:104px;
width:36%;
display:grid;
grid-template-columns:repeat(3,1fr);
gap:12px;
z-index:5;
}

.desktop-icon{
min-height:105px;
border:1px solid rgba(255,255,255,.7);
border-radius:21px;
background:rgba(255,255,255,.46);
color:var(--ink);
box-shadow:0 12px 30px rgba(70,53,100,.08);
transition:.2s;
backdrop-filter:blur(10px);
}

.desktop-icon:hover{
transform:translateY(-4px) scale(1.02);
box-shadow:0 18px 35px rgba(70,53,100,.15);
}

.desktop-icon span{
display:block;
font-size:36px;
filter:drop-shadow(0 8px 8px rgba(50,30,80,.15));
}

.desktop-icon b{
display:block;
font-size:11px;
margin-top:5px;
}

.desktop-icon small{
display:block;
font-size:8px;
color:var(--muted);
margin-top:2px;
}

.floating-decoration{
position:absolute;
z-index:3;
font-size:25px;
animation:float 4s ease-in-out infinite;
pointer-events:none;
}

.decoration1{
left:42%;
top:26%;
}

.decoration2{
right:7%;
top:50%;
animation-delay:-1s;
}

.decoration3{
right:43%;
bottom:30%;
animation-delay:-2s;
}

#animalLayer,
#particleLayer{
position:absolute;
inset:0;
pointer-events:none;
z-index:8;
}

.animal{
position:absolute;
font-size:27px;
filter:drop-shadow(0 8px 8px rgba(50,40,80,.18));
animation:walk var(--duration) linear infinite;
}

.particle{
position:absolute;
animation:particleFall var(--duration) linear forwards;
}

#windowLayer{
position:absolute;
inset:0;
pointer-events:none;
z-index:20;
}

.window{
position:absolute;
top:17%;
left:50%;
transform:translateX(-50%);
width:min(640px,86vw);
max-height:70vh;
border-radius:25px;
overflow:hidden;
display:none;
pointer-events:auto;
animation:windowOpen .22s ease;
}

.window.active{
display:block;
}

.large-window{
width:min(920px,92vw);
max-height:76vh;
}

.game-window{
width:min(760px,90vw);
}

.window-header{
height:48px;
padding:0 13px 0 17px;
display:flex;
align-items:center;
justify-content:space-between;
background:rgba(255,255,255,.46);
border-bottom:1px solid var(--line);
cursor:grab;
font-size:13px;
font-weight:900;
}

.window-header button{
border:0;
background:rgba(255,255,255,.6);
width:28px;
height:28px;
border-radius:9px;
margin-left:4px;
}

.window-header button:hover{
background:white;
}

.window-body{
padding:18px;
overflow:auto;
max-height:calc(70vh - 48px);
}

.large-window .window-body{
max-height:calc(76vh - 48px);
}

.window-banner{
display:flex;
align-items:center;
justify-content:space-between;
gap:20px;
padding:18px;
border-radius:20px;
background:
linear-gradient(
135deg,
rgba(255,255,255,.72),
rgba(255,255,255,.38)
);
border:1px solid var(--line);
margin-bottom:14px;
}

.window-banner h2{
margin:5px 0;
font-size:23px;
}

.window-banner p{
margin:0;
color:var(--muted);
font-size:11px;
}

.banner-icon{
font-size:45px;
}

.file-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:10px;
}

.file-card{
padding:18px;
border-radius:17px;
background:rgba(255,255,255,.58);
border:1px solid var(--line);
font-size:25px;
transition:.2s;
}

.file-card:hover{
transform:translateY(-3px);
}

.file-card b,
.file-card small{
display:block;
}

.file-card b{
font-size:11px;
margin-top:8px;
}

.file-card small{
font-size:8px;
color:var(--muted);
margin-top:3px;
}

textarea{
width:100%;
min-height:310px;
resize:none;
border:1px solid var(--line);
border-radius:18px;
background:rgba(255,255,255,.62);
padding:18px;
outline:none;
color:var(--ink);
line-height:1.7;
}

.between{
display:flex;
justify-content:space-between;
align-items:center;
margin-top:10px;
font-size:9px;
color:var(--muted);
}

.camera-body{
text-align:center;
}

.camera-body video{
width:100%;
max-height:330px;
object-fit:cover;
border-radius:19px;
background:#282039;
}

#cameraCanvas{
display:none;
}

.camera-controls{
display:flex;
justify-content:center;
gap:8px;
flex-wrap:wrap;
margin:12px 0;
}

.camera-body p{
font-size:9px;
color:var(--muted);
}

.photo-gallery{
display:flex;
gap:8px;
flex-wrap:wrap;
justify-content:center;
}

.photo-gallery img{
width:105px;
height:78px;
object-fit:cover;
border-radius:12px;
border:2px solid white;
}

.record-info{
display:flex;
justify-content:center;
align-items:center;
gap:9px;
font-size:11px;
}

#recordDot{
width:9px;
height:9px;
border-radius:50%;
background:#bbb;
}

#recordDot.recording{
background:#ff405e;
box-shadow:0 0 0 6px rgba(255,64,94,.12);
animation:pulse 1s infinite;
}

.download-button{
cursor:pointer;
}

.games-grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:11px;
}

.game-card{
position:relative;
overflow:hidden;
min-height:153px;
padding:14px;
border-radius:19px;
border:1px solid var(--line);
background:rgba(255,255,255,.58);
transition:.2s;
}

.game-card:hover{
transform:translateY(-4px);
box-shadow:0 15px 35px rgba(70,40,100,.13);
}

.game-card .emoji{
display:block;
font-size:37px;
}

.game-card b{
display:block;
font-size:11px;
margin-top:7px;
}

.game-card p{
font-size:8px;
line-height:1.45;
color:var(--muted);
min-height:26px;
}

.game-card button{
width:100%;
border:0;
border-radius:11px;
padding:8px;
background:rgba(255,255,255,.82);
font-size:9px;
font-weight:900;
}

.game-tag{
position:absolute;
right:8px;
top:8px;
font-size:7px;
padding:4px 6px;
border-radius:99px;
background:rgba(255,255,255,.8);
color:var(--purple);
}

.game-top{
display:flex;
align-items:center;
justify-content:space-between;
gap:10px;
margin-bottom:10px;
}

.game-top > div:first-child{
font-size:11px;
color:var(--muted);
}

.game-stats{
display:flex;
gap:6px;
}

.game-stats span{
padding:7px 9px;
border-radius:10px;
background:rgba(255,255,255,.65);
font-size:9px;
}

.game-arena{
position:relative;
height:360px;
overflow:hidden;
border-radius:20px;
border:1px solid var(--line);
background:
radial-gradient(
circle at 50% 20%,
rgba(255,255,255,.85),
transparent 35%
),
linear-gradient(
145deg,
rgba(255,255,255,.7),
rgba(220,213,255,.65)
);
touch-action:none;
}

.game-message{
position:absolute;
left:50%;
top:50%;
transform:translate(-50%,-50%);
padding:12px 17px;
border-radius:13px;
background:rgba(255,255,255,.9);
font-size:11px;
font-weight:900;
text-align:center;
z-index:20;
pointer-events:none;
}

.game-controls{
display:flex;
justify-content:center;
gap:8px;
flex-wrap:wrap;
margin-top:12px;
}

.game-target{
position:absolute;
width:50px;
height:50px;
border:0;
border-radius:50%;
display:grid;
place-items:center;
font-size:29px;
cursor:pointer;
animation:pop .18s ease;
}

.memory-board{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:8px;
width:min(430px,95%);
margin:auto;
padding-top:25px;
}

.memory-card{
aspect-ratio:1;
border:0;
border-radius:14px;
background:
linear-gradient(
135deg,
var(--pink),
var(--purple)
);
color:white;
font-size:22px;
font-weight:900;
}

.memory-card.open{
background:white;
color:var(--ink);
border:1px solid var(--line);
}

.math-game{
text-align:center;
padding-top:55px;
}

.math-question{
font-size:38px;
font-weight:900;
}

.answer-buttons{
display:flex;
justify-content:center;
gap:8px;
flex-wrap:wrap;
margin-top:22px;
}

.answer-buttons button{
border:0;
border-radius:13px;
padding:11px 18px;
background:white;
font-weight:900;
}

.typing-game{
text-align:center;
padding-top:70px;
}

.typing-word{
font-size:34px;
font-weight:900;
letter-spacing:2px;
}

.typing-input{
width:min(420px,85%);
margin-top:20px;
padding:13px;
border:1px solid var(--line);
border-radius:13px;
outline:none;
text-align:center;
background:white;
}

.game-canvas{
display:block;
width:100%;
height:100%;
}

.github-search{
display:flex;
gap:8px;
}

.github-search input{
flex:1;
border:1px solid var(--line);
border-radius:13px;
padding:11px;
background:rgba(255,255,255,.7);
outline:none;
}

.github-profile{
margin-top:14px;
}

.github-card{
padding:18px;
border-radius:20px;
background:rgba(255,255,255,.64);
border:1px solid var(--line);
}

.github-main{
display:flex;
align-items:center;
gap:15px;
}

.github-main img{
width:76px;
height:76px;
border-radius:22px;
border:4px solid white;
}

.github-main h2{
margin:0;
font-size:21px;
}

.github-main p{
font-size:10px;
color:var(--muted);
margin:4px 0;
}

.github-stats{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:8px;
margin-top:14px;
}

.github-stat{
padding:11px;
border-radius:13px;
background:rgba(255,255,255,.72);
text-align:center;
}

.github-stat b,
.github-stat small{
display:block;
}

.github-stat small{
font-size:8px;
color:var(--muted);
}

.repo-list{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:8px;
margin-top:12px;
}

.repo{
padding:11px;
border-radius:12px;
background:rgba(255,255,255,.55);
font-size:9px;
}

.repo b{
display:block;
font-size:10px;
}

.repo span{
color:var(--muted);
}

.empty{
padding:30px;
border-radius:17px;
background:rgba(255,255,255,.5);
text-align:center;
font-size:11px;
color:var(--muted);
}

.chat-header{
display:flex;
align-items:center;
gap:10px;
padding:11px;
border-radius:16px;
background:rgba(255,255,255,.6);
}

.chat-avatar{
width:40px;
height:40px;
display:grid;
place-items:center;
background:white;
border-radius:13px;
font-size:22px;
}

.chat-header b,
.chat-header small{
display:block;
}

.chat-header small{
font-size:8px;
color:var(--muted);
margin-top:2px;
}

.chat-messages{
height:350px;
overflow:auto;
padding:14px 5px;
display:flex;
flex-direction:column;
gap:8px;
}

.bubble{
max-width:78%;
padding:10px 13px;
border-radius:16px;
background:white;
align-self:flex-end;
box-shadow:0 5px 16px rgba(60,40,80,.07);
font-size:10px;
}

.bubble small{
display:block;
font-size:7px;
color:var(--muted);
margin-top:4px;
}

.chat-form{
display:flex;
gap:7px;
}

.chat-form input{
flex:1;
border:1px solid var(--line);
border-radius:13px;
padding:11px;
outline:none;
background:white;
}

.settings-list{
display:grid;
gap:8px;
}

.setting-row{
display:flex;
align-items:center;
justify-content:space-between;
padding:13px 15px;
border-radius:15px;
background:rgba(255,255,255,.58);
border:1px solid var(--line);
}

.setting-row b,
.setting-row small{
display:block;
}

.setting-row small{
font-size:8px;
color:var(--muted);
margin-top:3px;
}

.toggle{
position:relative;
width:46px;
height:25px;
}

.toggle input{
display:none;
}

.toggle span{
position:absolute;
inset:0;
border-radius:99px;
background:#c7c1cf;
transition:.2s;
}

.toggle span:after{
content:"";
position:absolute;
left:3px;
top:3px;
width:19px;
height:19px;
border-radius:50%;
background:white;
transition:.2s;
}

.toggle input:checked + span{
background:
linear-gradient(
135deg,
var(--accent),
var(--accent2)
);
}

.toggle input:checked + span:after{
transform:translateX(21px);
}

.settings-window h3{
font-size:13px;
margin:18px 0 9px;
}

.theme-picker{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:8px;
}

.theme-card{
border:2px solid transparent;
border-radius:15px;
padding:13px 7px;
background:rgba(255,255,255,.62);
color:var(--ink);
font-size:25px;
}

.theme-card b,
.theme-card small{
display:block;
}

.theme-card b{
font-size:10px;
margin-top:5px;
}

.theme-card small{
font-size:7px;
color:var(--muted);
margin-top:2px;
}

.theme-card.active{
border-color:var(--accent);
box-shadow:0 0 0 3px rgba(255,117,173,.12);
}

.deed-box{
display:flex;
align-items:center;
gap:10px;
margin-top:13px;
padding:13px;
border-radius:17px;
background:
linear-gradient(
135deg,
rgba(255,237,177,.7),
rgba(255,255,255,.55)
);
border:1px solid var(--line);
}

.deed-box > span{
font-size:28px;
}

.deed-box div{
flex:1;
}

.deed-box b{
font-size:10px;
}

.deed-box p{
font-size:8px;
color:var(--muted);
margin:3px 0 0;
}

.deed-box button{
padding:8px 10px;
font-size:8px;
}

.settings-bottom{
display:flex;
justify-content:space-between;
align-items:center;
margin-top:13px;
font-size:8px;
color:var(--muted);
}

.gallery-grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
}

.gallery-card{
overflow:hidden;
border-radius:17px;
background:white;
border:1px solid var(--line);
box-shadow:0 8px 20px rgba(70,50,90,.08);
transition:.2s;
}

.gallery-card:hover{
transform:translateY(-4px);
}

.gallery-card img{
width:100%;
aspect-ratio:1.25;
display:block;
object-fit:cover;
}

.gallery-card b{
display:block;
font-size:9px;
padding:9px 10px 1px;
}

.gallery-card small{
display:block;
font-size:7px;
padding:2px 10px 10px;
color:var(--muted);
}

.dock{
position:absolute;
left:50%;
bottom:15px;
transform:translateX(-50%);
height:66px;
padding:9px 11px;
border-radius:23px;
display:flex;
align-items:center;
gap:7px;
z-index:40;
}

.dock-button{
width:47px;
height:47px;
border:0;
border-radius:15px;
background:rgba(255,255,255,.7);
font-size:23px;
transition:.2s;
}

.dock-button:hover{
transform:translateY(-5px) scale(1.05);
}

.music-status{
display:flex;
align-items:center;
gap:7px;
padding-left:9px;
border-left:1px solid var(--line);
}

.music-status > span{
font-size:21px;
}

.music-status b,
.music-status small{
display:block;
}

.music-status b{
font-size:8px;
}

.music-status small{
font-size:7px;
color:var(--muted);
}

.fairy-scroll{
position:fixed;
right:22px;
bottom:95px;
width:56px;
height:56px;
border:0;
border-radius:20px;
background:rgba(255,255,255,.78);
box-shadow:0 15px 35px rgba(60,40,90,.2);
font-size:26px;
z-index:60;
opacity:0;
transform:translateY(15px) scale(.8);
pointer-events:none;
transition:.25s;
}

.fairy-scroll.visible{
opacity:1;
transform:none;
pointer-events:auto;
}

.fairy-scroll span{
position:absolute;
right:6px;
top:4px;
font-size:10px;
animation:spin 2s linear infinite;
}

.sleep-overlay{
position:absolute;
inset:0;
display:none;
place-items:center;
z-index:100;
background:rgba(25,20,45,.72);
backdrop-filter:blur(9px);
color:white;
text-align:center;
}

.sleep-overlay.active{
display:grid;
}

.sleep-icon{
font-size:75px;
}

.sleep-overlay h2{
margin:5px 0;
}

.sleep-overlay p{
font-size:10px;
opacity:.75;
}

.boot-screen{
position:fixed;
inset:0;
z-index:999;
display:grid;
place-items:center;
background:
linear-gradient(
135deg,
#9b83ed,
#ff8fb8 55%,
#7ac9ed
);
color:white;
text-align:center;
}

.boot-mascot{
position:absolute;
top:24%;
font-size:100px;
animation:float 2s infinite;
}

.boot-title{
position:absolute;
top:43%;
}

.boot-title h1{
font-size:43px;
margin:0;
}

.boot-title p{
font-size:11px;
}

.loading-line{
width:230px;
height:5px;
background:rgba(255,255,255,.25);
border-radius:99px;
overflow:hidden;
margin:auto;
}

.loading-line span{
display:block;
height:100%;
width:0;
background:white;
animation:loading 1.7s forwards;
}

.boot-stars{
position:absolute;
width:200px;
height:200px;
border:1px solid rgba(255,255,255,.35);
border-radius:50%;
animation:spin 8s linear infinite;
}

.boot-stars span{
position:absolute;
font-size:22px;
}

.boot-stars span:nth-child(1){
top:-12px;
left:50%;
}

.boot-stars span:nth-child(2){
right:-4px;
top:45%;
}

.boot-stars span:nth-child(3){
bottom:0;
left:44%;
}

body.theme-dark{
--ink:#f7f1ff;
--muted:#c9bfd9;
--glass:rgba(35,29,57,.7);
--line:rgba(255,255,255,.12);
--accent:#ff8fc3;
--accent2:#9586ff;
}

.theme-dark .desktop{
background:
linear-gradient(
180deg,
#211d3d,
#443c6d 56%,
#1e403a
);
}

.theme-dark .sun{
opacity:0;
}

.theme-dark .moon{
opacity:1;
}

.theme-dark .cloud{
opacity:.1;
}

.theme-dark .building{
background:
linear-gradient(
160deg,
rgba(30,29,55,.9),
rgba(48,57,82,.85)
);
}

.theme-dark .desktop-icon,
.theme-dark .game-card,
.theme-dark .file-card,
.theme-dark .window-banner,
.theme-dark .setting-row,
.theme-dark .theme-card,
.theme-dark .github-card,
.theme-dark .github-stat,
.theme-dark .repo,
.theme-dark .chat-header{
background:rgba(255,255,255,.08);
color:var(--ink);
}

.theme-dark .window-header{
background:rgba(255,255,255,.05);
}

.theme-yellow{
--accent:#eaa51f;
--accent2:#ed725f;
}

.theme-yellow .desktop{
background:
linear-gradient(
180deg,
#ffe89a,
#fff6d9 58%,
#c8e7b3
);
}

.theme-pink{
--accent:#ff5fa4;
--accent2:#b56af2;
}

.theme-pink .desktop{
background:
linear-gradient(
180deg,
#ffc6df,
#fff0f8 58%,
#cbe9d0
);
}

@keyframes float{
0%,100%{
transform:translateY(0);
}
50%{
transform:translateY(-10px);
}
}

@keyframes cloudMove{
from{
transform:translateX(0);
}
to{
transform:translateX(calc(100vw + 600px));
}
}

@keyframes windowOpen{
from{
opacity:0;
transform:translateX(-50%) scale(.96);
}
to{
opacity:1;
transform:translateX(-50%) scale(1);
}
}

@keyframes loading{
to{
width:100%;
}
}

@keyframes spin{
to{
transform:rotate(360deg);
}
}

@keyframes pop{
from{
transform:scale(.4);
opacity:.2;
}
to{
transform:scale(1);
opacity:1;
}
}

@keyframes pulse{
50%{
opacity:.35;
}
}

@keyframes particleFall{
from{
transform:translateY(-50px) rotate(0);
opacity:0;
}
15%{
opacity:.8;
}
to{
transform:translateY(105vh) rotate(360deg);
opacity:0;
}
}

@keyframes walk{
0%{
transform:translateX(-12vw) scaleX(1);
}
48%{
transform:translateX(55vw) scaleX(1);
}
50%{
transform:translateX(55vw) scaleX(-1);
}
100%{
transform:translateX(-12vw) scaleX(-1);
}
}

@media(max-width:900px){

.welcome{
left:4%;
width:53vw;
}

.desktop-icons{
right:3%;
width:40%;
grid-template-columns:repeat(2,1fr);
}

.games-grid{
grid-template-columns:repeat(3,1fr);
}

.gallery-grid{
grid-template-columns:repeat(3,1fr);
}

.music-status{
display:none;
}

}

@media(max-width:650px){

.topbar{
left:8px;
right:8px;
}

.mood{
display:none;
}

.system-info span:not(#clock){
display:none;
}

.welcome{
left:4%;
width:92%;
top:88px;
padding:18px;
}

.welcome h1{
font-size:28px;
}

.welcome-character{
font-size:50px;
}

.desktop-icons{
left:4%;
right:4%;
top:245px;
width:auto;
grid-template-columns:repeat(3,1fr);
gap:7px;
}

.desktop-icon{
min-height:80px;
}

.desktop-icon span{
font-size:27px;
}

.desktop-icon small{
display:none;
}

.window{
top:8%;
width:94vw;
max-height:78vh;
}

.large-window{
width:96vw;
}

.games-grid{
grid-template-columns:repeat(2,1fr);
}

.gallery-grid{
grid-template-columns:repeat(2,1fr);
}

.file-grid{
grid-template-columns:repeat(2,1fr);
}

.theme-picker{
grid-template-columns:repeat(2,1fr);
}

.game-arena{
height:310px;
}

.dock{
bottom:8px;
height:57px;
padding:6px;
max-width:96vw;
}

.dock-button{
width:40px;
height:40px;
font-size:19px;
}                  

.fairy-scroll{
right:10px;
bottom:75px;
}

.window-body{
padding:12px;
}

}
