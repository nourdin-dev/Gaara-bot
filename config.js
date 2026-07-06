//Gara bot 🔥🧸
import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

global.owner = [
'212651624769','34672982032','92024657166409'
]

global.mods = []
global.prems = []

global.GaraJadibts = true

global.isBaileysFail = false

global.obtenerQrWeb = 0 
global.keepAliveRender = 0 
global.botNumberCode = ''
global.confirmCode = ''
global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.languaje = 'Arabic'
global.vs = '2.2.0'
global.nameqr = 'Gara-bot'
global.namebot = '𝐺𝐴𝑅𝐴 𝐵𝛩𝑇 ↯˹🖤˼↯'
global.sessions = 'sessions'
global.jadi = 'Gara-subbots' 
global.GaraJadibts = true
global.baileys = '@whiskeysockets/baileys'
global.apis = 'https://api.delirius.store'
global.zb = 'لينعل طبون خالتك ا اسكانور'

global.APIs = {
lolhuman: {url: 'https://api.lolhuman.xyz/api', key: 'GaraDiosV3'},
stellar: {url: 'https://api.stellarwa.xyz', key: 'Gara'},
skizo: {url: 'https://skizo.tech/api', key: 'Gara'},
alyachan: {url: 'https://api.alyachan.dev/api', key: null},
exonity: {url: 'https://exonity.tech/api', key: 'Gara'},
ryzendesu: {url: 'https://api.ryzendesu.vip/api', key: null},
neoxr: {url: 'https://api.neoxr.eu/api', key: 'Gara'},
davidcyriltech: {url: 'https://api.davidcyriltech.my.id', key: null},
dorratz: {url: 'https://api.dorratz.com', key: null},
siputzx: {url: 'https://api.siputzx.my.id/api', key: null},
vreden: {url: 'https://api.vreden.web.id/api', key: null},
fgmods: {url: 'https://api.fgmods.xyz/api', key: 'elrebelde21'},
popcat: {url: 'https://api.popcat.xyz', key: null}
}

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment
global.official = [
['34672982032','𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥']
]

global.mail = ''
global.desc = ''
global.desc2 = ''
global.country = ''
global.packname = '𝐵𝑌 | 𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥' //by "nour dev 🌑" 
global.author =
'𝐵𝑌 | 𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥'
global.vs = '1.7.0'
global.vsJB = 'الاصدار الاحدث'
global.gt = '𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥'
global.imagen = fs.readFileSync('./Menu2.jpg')

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

global.rg = '*╰⊱✅⊱الــنــتــائــج✅⊱╮*\n'
global.resultado = rg

global.ag = '*╰⊱⚠️⊱تــحــذيــر⚠️⊱╮*\n'
global.advertencia = ag

global.iig = '*╰⊱❕⊱مــعــلــومــات⊱⊱╮*\n'
global.informacion = iig

global.fg = '*╰⊱❌خــطــأ❌⊱╮**\n'
global.fallo = fg

global.mg = '*╰⊱❗️اســتخــدام خــاطــئ❗️⊱╮*\n'
global.mal = mg

global.eeg = '*╰⊱📩⊱تــقــريــر📩⊱╮*\n'
global.envio = eeg

global.eg = '*╰⊱💚خــروج💚⊱╮*\n'
global.exito = eg
global.wm = '𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥'
global.igfg = '𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥'
global.nomorown = '34672982032'
global.pdoc = [
'application/vnd.openxmlformats-officedocument.presentationml.presentation',
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
'application/vnd.ms-excel',
'application/msword',
'application/pdf',
'text/rtf'
]

global.flaaa = [
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text='
]

global.cmenut = '❖––––––『'
global.cmenub = '┊✦ '
global.cmenuf = '╰━═┅═━––––––๑\n'
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     '

global.dmenut = '*❖─┅──┅〈*'
global.dmenub = '*┊»*'
global.dmenub2 = '*┊*'
global.dmenuf = '*╰┅────────┅✦*'
global.htjava = '⫹⫺'

global.htki = '*⭑•̩̩͙⊱•••• ☪*'
global.htka = '*☪ ••••̩̩͙⊰•⭑*'

global.comienzo = '• • ◕◕════'
global.fin = ' • •'

global.botdate = `⫹⫺ Date :  ${moment.tz('America/Los_Angeles').format('DD/MM/YY')}` //Asia/Jakarta
global.bottime = `𝗧 𝗜 𝗠 𝗘 : ${moment.tz('America/Los_Angeles').format('HH:mm:ss')}` //America/Los_Angeles
global.fgif = {
key: {
participant: '0@s.whatsapp.net'
},
message: {
videoMessage: {
title: wm,
h: 'Hmm',
seconds: '999999999',
gifPlayback: 'true',
caption: bottime,
jpegThumbnail: fs.readFileSync('./Menu2.jpg')
}
}
}

global.multiplier = 85
global.rpg = {
emoticon(string) {
string = string.toLowerCase()
let emot = {
level: '🧬 Nivel : Level',
limit: lenguajeGB.eDiamante(),
exp: lenguajeGB.eExp(),
bank: '🏦 Banco : Bank',
diamond: lenguajeGB.eDiamantePlus(),
health: '❤️ Salud : Health',
kyubi: lenguajeGB.eMagia(),
joincount: lenguajeGB.eToken(),
emerald: lenguajeGB.eEsmeralda(),
stamina: lenguajeGB.eEnergia(),
role: '💪 Rango | Role',
premium: '🎟️ Premium',
pointxp: '📧 Puntos Exp : Point Xp',
gold: lenguajeGB.eOro(),

trash: lenguajeGB.eBasura(),
crystal: '🔮 Cristal : Crystal',
intelligence: '🧠 Inteligencia : Intelligence',
string: lenguajeGB.eCuerda(),
keygold: '🔑 Llave de Oro : Key Gold',
keyiron: '🗝️ Llave de Hierro : Key Iron',
emas: lenguajeGB.ePinata(),
fishingrod: '🎣 Caña de Pescar : Fishing Rod',
gems: '🍀 Gemas : Gemas',
magicwand: '⚕️ Varita Mágica : Magic Wand',
mana: '🪄 Hechizo : Spell',
agility: '🤸‍♂️ Agilidad : Agility',
darkcrystal: '♠️ Cristal Oscuro : Dark Glass',
iron: lenguajeGB.eHierro(),
rock: lenguajeGB.eRoca(),
potion: lenguajeGB.ePocion(),
superior: '💼 Superior : Superior',
robo: '🚔 Robo : Robo',
upgrader: '🧰 Aumentar Mejora : Upgrade',
wood: lenguajeGB.eMadera(),

strength: '🦹‍ ♀️ Fuerza : Strength',
arc: '🏹 Arco : Arc',
armor: '🥼 Armadura : Armor',
bow: '🏹 Super Arco : Super Bow',
pickaxe: '⛏️ Pico : Peak',
sword: lenguajeGB.eEspada(),

common: lenguajeGB.eCComun(),
uncoommon: lenguajeGB.ePComun(),
mythic: lenguajeGB.eCMistica(),
legendary: lenguajeGB.eClegendaria(),
petFood: lenguajeGB.eAMascots(), //?
pet: lenguajeGB.eCMascota(), //?

bibitanggur: lenguajeGB.eSUva(),
bibitapel: lenguajeGB.eSManzana(),
bibitjeruk: lenguajeGB.eSNaranja(),
bibitmangga: lenguajeGB.eSMango(),
bibitpisang: lenguajeGB.eSPlatano(),

ayam: '🐓 Pollo : Chicken',
babi: '🐖 Puerco : Pig',
Jabali: '🐗 Jabalí : Wild Boar',
bull: '🐃 Toro : Bull',
buaya: '🐊 Cocodrilo : Alligator',
cat: lenguajeGB.eGato(),
centaur: lenguajeGB.eCentauro(),
chicken: '🐓 Pollo : Chicken',
cow: '🐄 Vaca : Cow',
dog: lenguajeGB.ePerro(),
dragon: lenguajeGB.eDragon(),
elephant: '🐘 Elefante : Elephant',
fox: lenguajeGB.eZorro(),
giraffe: '🦒 Jirafa : Giraffe',
griffin: lenguajeGB.eAve(), //Mascota : Griffin',
horse: lenguajeGB.eCaballo(),
kambing: '🐐 Cabra : Goat',
kerbau: '🐃 Búfalo : Buffalo',
lion: '🦁 León : Lion',
money: lenguajeGB.eGaraCoins(),
monyet: '🐒 Mono : Monkey',
panda: '🐼 Panda',
snake: '🐍 Serpiente : Snake',
phonix: '🕊️ Fénix : Phoenix',
rhinoceros: '🦏 Rinoceronte : Rhinoceros',
wolf: lenguajeGB.eLobo(),
tiger: '🐅 Tigre : Tiger',
cumi: '🦑 Calamar : Squid',
udang: '🦐 Camarón : Shrimp',
ikan: '🐟 Pez : Fish',

fideos: '🍝 Fideos : Noodles',
ramuan: '🧪 Ingrediente NOVA : Ingredients',
knife: '🔪 Cuchillo : Knife'
}
let results = Object.keys(emot)
.map((v) => [v, new RegExp(v, 'gi')])
.filter((v) => v[1].test(string))
if (!results.length) return ''
else return emot[results[0][0]]
}
}

global.rpgg = {
//Solo emojis
emoticon(string) {
string = string.toLowerCase()
let emott = {
level: '🧬',
limit: '💎',
exp: '⚡',
bank: '🏦',
diamond: '💎+',
health: '❤️',
kyubi: '🌀',
joincount: '🪙',
emerald: '💚',
stamina: '✨',
role: '💪',
premium: '🎟️',
pointxp: '📧',
gold: '👑',

trash: '🗑',
crystal: '🔮',
intelligence: '🧠',
string: '🕸️',
keygold: '🔑',
keyiron: '🗝️',
emas: '🪅',
fishingrod: '🎣',
gems: '🍀',
magicwand: '⚕️',
mana: '🪄',
agility: '🤸‍♂️',
darkcrystal: '♠️',
iron: '⛓️',
rock: '🪨',
potion: '🥤',
superior: '💼',
robo: '🚔',
upgrader: '🧰',
wood: '🪵',

strength: '🦹‍ ♀️',
arc: '🏹',
armor: '🥼',
bow: '🏹',
pickaxe: '⛏️',
sword: '⚔️',

common: '📦',
uncoommon: '🥡',
mythic: '🗳️',
legendary: '🎁',
petFood: '🍖',
pet: '🍱',

bibitanggur: '🍇',
bibitapel: '🍎',
bibitjeruk: '🍊',
bibitmangga: '🥭',
bibitpisang: '🍌',

ayam: '🐓',
babi: '🐖',
Jabali: '🐗',
bull: '🐃',
buaya: '🐊',
cat: '🐈',
centaur: '🐐',
chicken: '🐓',
cow: '🐄',
dog: '🐕',
dragon: '🐉',
elephant: '🐘',
fox: '🦊',
giraffe: '🦒',
griffin: '🦅', //Mascota : Griffin',
horse: '🐎',
kambing: '🐐',
kerbau: '🐃',
lion: '🦁',
money: '🐱',
monyet: '🐒',
panda: '🐼',
snake: '🐍',
phonix: '🕊️',
rhinoceros: '🦏',
wolf: '🐺',
tiger: '🐅',
cumi: '🦑',
udang: '🦐',
ikan: '🐟',

fideos: '🍝',
ramuan: '🧪',
knife: '🔪'
}
let results = Object.keys(emott)
.map((v) => [v, new RegExp(v, 'gi')])
.filter((v) => v[1].test(string))
if (!results.length) return ''
else return emott[results[0][0]]
}
}
global.rpgshop = {
//Tienda
emoticon(string) {
string = string.toLowerCase()
let emottt = {
exp: lenguajeGB.eExp(),
limit: lenguajeGB.eDiamante(),
diamond: lenguajeGB.eDiamantePlus(),
joincount: lenguajeGB.eToken(),
emerald: lenguajeGB.eEsmeralda(),
berlian: lenguajeGB.eJoya(),
kyubi: lenguajeGB.eMagia(),
gold: lenguajeGB.eOro(),
money: lenguajeGB.eGaraCoins(),
tiketcoin: lenguajeGB.eGaraTickers(),
stamina: lenguajeGB.eEnergia(),
potion: lenguajeGB.ePocion(),
aqua: lenguajeGB.eAgua(),
trash: lenguajeGB.eBasura(),
wood: lenguajeGB.eMadera(),
rock: lenguajeGB.eRoca(),
batu: lenguajeGB.ePiedra(),
string: lenguajeGB.eCuerda(),
iron: lenguajeGB.eHierro(),
coal: lenguajeGB.eCarbon(),
botol: lenguajeGB.eBotella(),
kaleng: lenguajeGB.eLata(),
kardus: lenguajeGB.eCarton(),
eleksirb: lenguajeGB.eEletric(),
emasbatang: lenguajeGB.eBarraOro(),
emasbiasa: lenguajeGB.eOroComun(),
rubah: lenguajeGB.eZorroG(),
sampah: lenguajeGB.eBasuraG(),
serigala: lenguajeGB.eLoboG(),
kayu: lenguajeGB.eMaderaG(),
sword: lenguajeGB.eEspada(),
umpan: lenguajeGB.eCarnada(),
healtmonster: lenguajeGB.eBillete(),
emas: lenguajeGB.ePinata(),
pancingan: lenguajeGB.eGancho(),
pancing: lenguajeGB.eCanaPescar(),

common: lenguajeGB.eCComun(),
uncoommon: lenguajeGB.ePComun(),
mythic: lenguajeGB.eCMistica(),
pet: lenguajeGB.eCMascota(), //?
gardenboxs: lenguajeGB.eCJardineria(), //?
legendary: lenguajeGB.eClegendaria(),

anggur: lenguajeGB.eUva(),
apel: lenguajeGB.eManzana(),
jeruk: lenguajeGB.eNaranja(),
mangga: lenguajeGB.eMango(),
pisang: lenguajeGB.ePlatano(),

bibitanggur: lenguajeGB.eSUva(),
bibitapel: lenguajeGB.eSManzana(),
bibitjeruk: lenguajeGB.eSNaranja(),
bibitmangga: lenguajeGB.eSMango(),
bibitpisang: lenguajeGB.eSPlatano(),

centaur: lenguajeGB.eCentauro(),
griffin: lenguajeGB.eAve(),
kucing: lenguajeGB.eGato(),
naga: lenguajeGB.eDragon(),
fox: lenguajeGB.eZorro(),
kuda: lenguajeGB.eCaballo(),
phonix: lenguajeGB.eFenix(),
wolf: lenguajeGB.eLobo(),
anjing: lenguajeGB.ePerro(),

petFood: lenguajeGB.eAMascots(), //?
makanancentaur: lenguajeGB.eCCentauro(),
makanangriffin: lenguajeGB.eCAve(),
makanankyubi: lenguajeGB.eCMagica(),
makanannaga: lenguajeGB.eCDragon(),
makananpet: lenguajeGB.eACaballo(),
makananphonix: lenguajeGB.eCFenix()
}
let results = Object.keys(emottt)
.map((v) => [v, new RegExp(v, 'gi')])
.filter((v) => v[1].test(string))
if (!results.length) return ''
else return emottt[results[0][0]]
}
}

global.rpgshopp = {
//Tienda
emoticon(string) {
string = string.toLowerCase()
let emotttt = {
exp: '⚡',
limit: '💎',
diamond: '💎+',
joincount: '🪙',
emerald: '💚',
berlian: '♦️',
kyubi: '🌀',
gold: '👑',
money: '🐱',
tiketcoin: '🎫',
stamina: '✨',

potion: '🥤',
aqua: '💧',
trash: '🗑',
wood: '🪵',
rock: '🪨',
batu: '🥌',
string: '🕸️',
iron: '⛓️',
coal: '⚱️',
botol: '🍶',
kaleng: '🥫',
kardus: '🪧',

eleksirb: '💡',
emasbatang: '〽️',
emasbiasa: '🧭',
rubah: '🦊🌫️',
sampah: '🗑🌫️',
serigala: '🐺🌫️',
kayu: '🛷',
sword: '⚔️',
umpan: '🪱',
healtmonster: '💵',
emas: '🪅',
pancingan: '🪝',
pancing: '🎣',

common: '📦',
uncoommon: '🥡',
mythic: '🗳️',
pet: '📫', //?
gardenboxs: '💐', //?
legendary: '🎁',

anggur: '🍇',
apel: '🍎',
jeruk: '🍊',
mangga: '🥭',
pisang: '🍌',

bibitanggur: '🌾🍇',
bibitapel: '🌾🍎',
bibitjeruk: '🌾🍊',
bibitmangga: '🌾🥭',
bibitpisang: '🌾🍌',

centaur: '🐐',
griffin: '🦅',
kucing: '🐈',
naga: '🐉',
fox: '🦊',
kuda: '🐎',
phonix: '🕊️',
wolf: '🐺',
anjing: '🐶',

petFood: '🍖', //?
makanancentaur: '🐐🥩',
makanangriffin: '🦅🥩',
makanankyubi: '🌀🥩',
makanannaga: '🐉🥩',
makananpet: '🍱🥩',
makananphonix: '🕊️🥩'
}
let results = Object.keys(emotttt)
.map((v) => [v, new RegExp(v, 'gi')])
.filter((v) => v[1].test(string))
if (!results.length) return ''
else return emotttt[results[0][0]]
}
}

global.ch = {
ch1: '120363400800862279@newsletter',
ch2: '120363400800862279@newsletter'
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'config.js'"))
import(`${file}?update=${Date.now()}`)
})

global.group = 'https://chat.whatsapp.com/GTvmW4Qasx17ZMw0DQ6uhr'
