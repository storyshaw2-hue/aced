/* ===== ACED · WORLD CAPITALS DRAFT (seed pack) =====
   A "just for fun" run that proves the engine on non-exam material. Heavy on the classic
   traps that catch muscle memory — the capital is almost never the biggest/most-famous city.
   Sets window.ACED_PACK + window.ACED_QUESTIONS. The engine builds the poker deck from these. */
(function(){
"use strict";
var Q=[
  // --- traps: capital vs the famous city (the whole point) ---
  {source:"Traps",q:"What is the capital of Australia?",choices:["Canberra","Melbourne","Sydney","Brisbane"],answer:0,explain:"Canberra — purpose-built as a compromise between Sydney and Melbourne."},
  {source:"Traps",q:"What is the capital of Turkey?",choices:["Istanbul","Ankara","Izmir","Antalya"],answer:1,explain:"Ankara — Istanbul is the largest city, but the capital moved in 1923."},
  {source:"Traps",q:"What is the capital of Brazil?",choices:["Rio de Janeiro","São Paulo","Brasília","Salvador"],answer:2,explain:"Brasília — built inland in 1960 to replace Rio."},
  {source:"Traps",q:"What is the capital of Canada?",choices:["Toronto","Montreal","Vancouver","Ottawa"],answer:3,explain:"Ottawa — not Toronto or Montreal."},
  {source:"Traps",q:"What is the capital of the United States?",choices:["Washington, D.C.","New York City","Philadelphia","Boston"],answer:0,explain:"Washington, D.C. — New York is the largest city."},
  {source:"Traps",q:"What is the capital of Switzerland?",choices:["Zurich","Bern","Geneva","Basel"],answer:1,explain:"Bern — Zurich and Geneva are larger and better known."},
  {source:"Traps",q:"What is the capital of New Zealand?",choices:["Auckland","Christchurch","Wellington","Hamilton"],answer:2,explain:"Wellington — Auckland is the largest city."},
  {source:"Traps",q:"What is the capital of South Africa (executive)?",choices:["Johannesburg","Cape Town","Durban","Pretoria"],answer:3,explain:"Pretoria is the executive capital (Cape Town legislative, Bloemfontein judicial)."},
  {source:"Traps",q:"What is the capital of Morocco?",choices:["Rabat","Marrakesh","Casablanca","Fez"],answer:0,explain:"Rabat — Casablanca is the largest city."},
  {source:"Traps",q:"What is the capital of Nigeria?",choices:["Lagos","Abuja","Kano","Ibadan"],answer:1,explain:"Abuja — the capital moved from Lagos in 1991."},
  // --- Europe ---
  {source:"Europe",q:"What is the capital of France?",choices:["Marseille","Lyon","Paris","Nice"],answer:2,explain:"Paris."},
  {source:"Europe",q:"What is the capital of Germany?",choices:["Munich","Frankfurt","Hamburg","Berlin"],answer:3,explain:"Berlin — Frankfurt is the finance hub."},
  {source:"Europe",q:"What is the capital of Spain?",choices:["Madrid","Barcelona","Valencia","Seville"],answer:0,explain:"Madrid — Barcelona is the famous rival."},
  {source:"Europe",q:"What is the capital of Portugal?",choices:["Porto","Lisbon","Faro","Braga"],answer:1,explain:"Lisbon."},
  {source:"Europe",q:"What is the capital of the Netherlands?",choices:["Rotterdam","The Hague","Amsterdam","Utrecht"],answer:2,explain:"Amsterdam — though The Hague holds the government."},
  {source:"Europe",q:"What is the capital of Norway?",choices:["Bergen","Stavanger","Trondheim","Oslo"],answer:3,explain:"Oslo."},
  {source:"Europe",q:"What is the capital of Poland?",choices:["Warsaw","Gdańsk","Kraków","Wrocław"],answer:0,explain:"Warsaw — Kraków is the old royal capital."},
  {source:"Europe",q:"What is the capital of Greece?",choices:["Thessaloniki","Athens","Patras","Heraklion"],answer:1,explain:"Athens."},
  // --- Asia ---
  {source:"Asia",q:"What is the capital of Japan?",choices:["Osaka","Kyoto","Tokyo","Yokohama"],answer:2,explain:"Tokyo — Kyoto was the historical capital."},
  {source:"Asia",q:"What is the capital of China?",choices:["Shanghai","Shenzhen","Guangzhou","Beijing"],answer:3,explain:"Beijing — Shanghai is the largest city."},
  {source:"Asia",q:"What is the capital of India?",choices:["New Delhi","Kolkata","Mumbai","Bangalore"],answer:0,explain:"New Delhi — Mumbai is the largest city."},
  {source:"Asia",q:"What is the capital of South Korea?",choices:["Busan","Seoul","Incheon","Daegu"],answer:1,explain:"Seoul."},
  {source:"Asia",q:"What is the capital of Vietnam?",choices:["Ho Chi Minh City","Da Nang","Hanoi","Hue"],answer:2,explain:"Hanoi — Ho Chi Minh City (Saigon) is larger."},
  {source:"Asia",q:"As of August 2026, which city remains Indonesia's legal capital pending the presidential decree that will transfer the capital to Nusantara?",choices:["Surabaya","Nusantara","Bandung","Jakarta"],answer:3,explain:"Jakarta remains the legal capital until the transfer decree is issued. Nusantara is the designated future capital, with the government targeting a broader political-capital transition by 2028.",asOf:"2026-08-18",ref:"https://inp.polri.go.id/artikel/jakarta-remains-national-capital-pending-presidential-decree-constitutional-court"},
  // --- Africa & Americas ---
  {source:"Africa & Americas",q:"What is the capital of Egypt?",choices:["Cairo","Alexandria","Giza","Luxor"],answer:0,explain:"Cairo."},
  {source:"Africa & Americas",q:"What is the capital of Kenya?",choices:["Mombasa","Nairobi","Kisumu","Nakuru"],answer:1,explain:"Nairobi."},
  {source:"Africa & Americas",q:"What is the capital of Argentina?",choices:["Córdoba","Rosario","Buenos Aires","Mendoza"],answer:2,explain:"Buenos Aires."},
  {source:"Africa & Americas",q:"What is the capital of Mexico?",choices:["Guadalajara","Monterrey","Cancún","Mexico City"],answer:3,explain:"Mexico City."},
  {source:"Africa & Americas",q:"What is the capital of Peru?",choices:["Lima","Cusco","Arequipa","Trujillo"],answer:0,explain:"Lima — Cusco is the old Inca capital."},
  {source:"Africa & Americas",q:"What is the capital of Colombia?",choices:["Medellín","Bogotá","Cali","Cartagena"],answer:1,explain:"Bogotá."}
];
Q.forEach(function(x,i){ x.id="world-capitals-"+String(i+1).padStart(3,"0"); x.diff="easy"; });
window.ACED_QUESTIONS=(window.ACED_QUESTIONS||[]).concat(Q);
// Minimal pack scaffold so the engine has what it needs; the deck itself is built from the questions.
window.ACED_PACK={
  id:"world-capitals", name:"World Capitals", section:"Geography",
  questions:Q,
  elements:{S:{label:"Spades",color:"#c9cede"},H:{label:"Hearts",color:"#ff5c7a"},D:{label:"Diamonds",color:"#ffb04d"},C:{label:"Clubs",color:"#5ce0ff"}},
  modules:{"Traps":"Capital Traps","Europe":"Europe","Asia":"Asia","Africa & Americas":"Africa & Americas"},
  cards:(function(){var c=[],suits=["S","H","D","C"],topics=["Traps","Europe","Asia","Africa & Americas"],v=[20,25,30,35,40,45,50,55];for(var i=0;i<28;i++)c.push({n:["A","K","Q","J","10","9","8","7"][i%8]+"\u2660\u2665\u2666\u2663"[i%4],el:suits[i%4],v:v[i%8],rank:[14,13,12,11,10,9,8,7][i%8],suit:suits[i%4],moduleKey:topics[i%4],tags:[]});return c;})(),
  targets:{1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]},
  maxAnte:4, blindLabels:["SMALL BLIND","BIG BLIND","BOSS BLIND"], tagInfo:{},
  consumables:[{id:"boost",n:"Cram",d:"A selected card gains +15 chips.",type:"target",ok:function(){return true;},act:function(c){c.v+=15;}},{id:"cash",n:"Study Snack",d:"Gain $5.",type:"instant",act:function(h){h.G.money+=5;}}],
  weaknessCard:{n:"Blank",el:"S",v:0,rank:0,suit:"S",tags:["weakness"],moduleKey:null,weakness:true},
  starter:{money:4}, blueprintWeights:{}, questionBanks:[]
};
})();
