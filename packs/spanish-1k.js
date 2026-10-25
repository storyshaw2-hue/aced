/* ===== ACED · SPANISH 1K: RAPID FIRE (seed pack) =====
   High-frequency Spanish vocab as fast MC. The "False Friends" module is the trap set —
   the distractors include the tempting-but-wrong English cognate (embarazada != embarrassed).
   Sets window.ACED_PACK + window.ACED_QUESTIONS. A representative core of the 1,000 most common words. */
(function(){
"use strict";
var Q=[
  // ---------------- COMMON VERBS ----------------
  {source:"Verbs",q:"What does \u201cser\u201d mean?",choices:["to be (permanent)","to have","to go","to do"],answer:0,explain:"ser = to be (essential/permanent traits)."},
  {source:"Verbs",q:"What does \u201ctener\u201d mean?",choices:["to come","to have","to want","to be able"],answer:1,explain:"tener = to have."},
  {source:"Verbs",q:"What does \u201chacer\u201d mean?",choices:["to say","to see","to do or make","to give"],answer:2,explain:"hacer = to do or to make."},
  {source:"Verbs",q:"What does \u201cir\u201d mean?",choices:["to come","to leave","to arrive","to go"],answer:3,explain:"ir = to go."},
  {source:"Verbs",q:"What does \u201cpoder\u201d mean?",choices:["to be able (can)","to want","to must","to know"],answer:0,explain:"poder = to be able / can."},
  {source:"Verbs",q:"What does \u201cquerer\u201d mean?",choices:["to be able","to want","to have","to need"],answer:1,explain:"querer = to want (also to love)."},
  {source:"Verbs",q:"What does \u201csaber\u201d mean?",choices:["to want","to see","to know (a fact)","to hear"],answer:2,explain:"saber = to know a fact or how to do something."},
  {source:"Verbs",q:"What does \u201cdecir\u201d mean?",choices:["to ask","to speak","to answer","to say or tell"],answer:3,explain:"decir = to say or to tell."},
  {source:"Verbs",q:"What does \u201cver\u201d mean?",choices:["to see","to hear","to look for","to find"],answer:0,explain:"ver = to see."},
  {source:"Verbs",q:"What does \u201cdar\u201d mean?",choices:["to take","to give","to put","to receive"],answer:1,explain:"dar = to give."},
  {source:"Verbs",q:"What does \u201ccomer\u201d mean?",choices:["to drink","to cook","to eat","to buy"],answer:2,explain:"comer = to eat."},
  {source:"Verbs",q:"What does \u201chablar\u201d mean?",choices:["to listen","to read","to write","to speak"],answer:3,explain:"hablar = to speak or talk."},
  // ---------------- EVERYDAY NOUNS ----------------
  {source:"Nouns",q:"What does \u201ccasa\u201d mean?",choices:["house","door","room","table"],answer:0,explain:"casa = house or home."},
  {source:"Nouns",q:"What does \u201cagua\u201d mean?",choices:["fire","water","air","milk"],answer:1,explain:"agua = water."},
  {source:"Nouns",q:"What does \u201cperro\u201d mean?",choices:["cat","horse","dog","bird"],answer:2,explain:"perro = dog."},
  {source:"Nouns",q:"What does \u201cgato\u201d mean?",choices:["dog","mouse","rabbit","cat"],answer:3,explain:"gato = cat."},
  {source:"Nouns",q:"What does \u201clibro\u201d mean?",choices:["book","notebook","page","letter"],answer:0,explain:"libro = book."},
  {source:"Nouns",q:"What does \u201cmesa\u201d mean?",choices:["chair","table","desk","bed"],answer:1,explain:"mesa = table."},
  {source:"Nouns",q:"What does \u201cpuerta\u201d mean?",choices:["window","wall","door","floor"],answer:2,explain:"puerta = door."},
  {source:"Nouns",q:"What does \u201cmano\u201d mean?",choices:["foot","arm","finger","hand"],answer:3,explain:"mano = hand (note: it's feminine \u2014 la mano)."},
  {source:"Nouns",q:"What does \u201cd\u00eda\u201d mean?",choices:["day","night","week","hour"],answer:0,explain:"d\u00eda = day (masculine \u2014 el d\u00eda)."},
  {source:"Nouns",q:"What does \u201ca\u00f1o\u201d mean?",choices:["month","year","day","week"],answer:1,explain:"a\u00f1o = year (not to be confused with ano)."},
  {source:"Nouns",q:"What does \u201cciudad\u201d mean?",choices:["town","country","city","village"],answer:2,explain:"ciudad = city."},
  {source:"Nouns",q:"What does \u201ccalle\u201d mean?",choices:["road","river","park","street"],answer:3,explain:"calle = street."},
  // ---------------- ADJECTIVES ----------------
  {source:"Adjectives",q:"What does \u201cgrande\u201d mean?",choices:["big or large","small","tall","long"],answer:0,explain:"grande = big or large."},
  {source:"Adjectives",q:"What does \u201cpeque\u00f1o\u201d mean?",choices:["big","small","short","thin"],answer:1,explain:"peque\u00f1o = small."},
  {source:"Adjectives",q:"What does \u201cbueno\u201d mean?",choices:["bad","nice","good","great"],answer:2,explain:"bueno = good."},
  {source:"Adjectives",q:"What does \u201cmalo\u201d mean?",choices:["good","sad","wrong","bad"],answer:3,explain:"malo = bad."},
  {source:"Adjectives",q:"What does \u201cnuevo\u201d mean?",choices:["new","old","young","fresh"],answer:0,explain:"nuevo = new."},
  {source:"Adjectives",q:"What does \u201cviejo\u201d mean?",choices:["new","old","young","ancient"],answer:1,explain:"viejo = old."},
  {source:"Adjectives",q:"What does \u201cfeliz\u201d mean?",choices:["sad","angry","happy","tired"],answer:2,explain:"feliz = happy."},
  {source:"Adjectives",q:"What does \u201cr\u00e1pido\u201d mean?",choices:["slow","early","soon","fast or quick"],answer:3,explain:"r\u00e1pido = fast or quick."},
  // ---------------- FALSE FRIENDS (TRAPS) ----------------
  {source:"False Friends",q:"What does \u201cembarazada\u201d mean?",choices:["pregnant","embarrassed","ashamed","nervous"],answer:0,explain:"embarazada = pregnant. \u201cEmbarrassed\u201d is avergonzado \u2014 the classic trap."},
  {source:"False Friends",q:"What does \u201c\u00e9xito\u201d mean?",choices:["exit","success","entrance","ticket"],answer:1,explain:"\u00e9xito = success. \u201cExit\u201d is salida."},
  {source:"False Friends",q:"What does \u201cropa\u201d mean?",choices:["rope","closet","clothes","cloth"],answer:2,explain:"ropa = clothes. \u201cRope\u201d is cuerda."},
  {source:"False Friends",q:"What does \u201csopa\u201d mean?",choices:["soap","supper","spoon","soup"],answer:3,explain:"sopa = soup. \u201cSoap\u201d is jab\u00f3n."},
  {source:"False Friends",q:"What does \u201clibrer\u00eda\u201d mean?",choices:["bookstore","library","bookshelf","office"],answer:0,explain:"librer\u00eda = bookstore. \u201cLibrary\u201d is biblioteca."},
  {source:"False Friends",q:"What does \u201cactualmente\u201d mean?",choices:["actually","currently","recently","eventually"],answer:1,explain:"actualmente = currently. \u201cActually\u201d is en realidad."},
  {source:"False Friends",q:"What does \u201casistir\u201d mean?",choices:["to assist","to insist","to attend","to exist"],answer:2,explain:"asistir = to attend. \u201cTo assist\u201d is ayudar."},
  {source:"False Friends",q:"What does \u201clargo\u201d mean?",choices:["large","wide","tall","long"],answer:3,explain:"largo = long. \u201cLarge\u201d is grande."},
  {source:"False Friends",q:"What does \u201csensible\u201d mean?",choices:["sensitive","sensible","reasonable","clever"],answer:0,explain:"sensible = sensitive. \u201cSensible\u201d is sensato."},
  {source:"False Friends",q:"What does \u201ccarpeta\u201d mean?",choices:["carpet","folder","rug","envelope"],answer:1,explain:"carpeta = folder. \u201cCarpet\u201d is alfombra."},
  {source:"False Friends",q:"What does \u201crecordar\u201d mean?",choices:["to record","to remind","to remember","to forget"],answer:2,explain:"recordar = to remember. \u201cTo record\u201d is grabar."},
  {source:"False Friends",q:"What does \u201cf\u00e1brica\u201d mean?",choices:["fabric","cloth","building","factory"],answer:3,explain:"f\u00e1brica = factory. \u201cFabric\u201d is tela."}
];
Q.forEach(function(x,i){ x.id="spanish-1k-"+String(i+1).padStart(3,"0"); x.diff=(x.source==="False Friends"?"medium":"easy"); });
window.ACED_QUESTIONS=(window.ACED_QUESTIONS||[]).concat(Q);
window.ACED_PACK={
  id:"spanish-1k", name:"Spanish 1K", section:"Language",
  questions:Q,
  elements:{S:{label:"Spades",color:"#c9cede"},H:{label:"Hearts",color:"#ff5c7a"},D:{label:"Diamonds",color:"#ffb04d"},C:{label:"Clubs",color:"#5ce0ff"}},
  modules:{"Verbs":"Common Verbs","Nouns":"Everyday Nouns","Adjectives":"Adjectives","False Friends":"False Friends (Traps)"},
  cards:(function(){var c=[],s=["S","H","D","C"],t=["Verbs","Nouns","Adjectives","False Friends"],v=[20,25,30,35,40,45,50,55];for(var i=0;i<28;i++)c.push({n:["A","K","Q","J","10","9","8","7"][i%8]+"\u2660\u2665\u2666\u2663"[i%4],el:s[i%4],v:v[i%8],rank:[14,13,12,11,10,9,8,7][i%8],suit:s[i%4],moduleKey:t[i%4],tags:[]});return c;})(),
  targets:{1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]},
  maxAnte:4, blindLabels:["SMALL BLIND","BIG BLIND","BOSS BLIND"], tagInfo:{},
  consumables:[{id:"boost",n:"Cram",d:"A selected card gains +15 chips.",type:"target",ok:function(){return true;},act:function(c){c.v+=15;}},{id:"cash",n:"Caf\u00e9",d:"Gain $5.",type:"instant",act:function(h){h.G.money+=5;}}],
  weaknessCard:{n:"Blank",el:"S",v:0,rank:0,suit:"S",tags:["weakness"],moduleKey:null,weakness:true},
  starter:{money:4}, blueprintWeights:{}, questionBanks:[]
};
})();
