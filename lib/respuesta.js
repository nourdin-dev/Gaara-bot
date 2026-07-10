const newsletterJid = '120363400800862279@newsletter';
const newsletterName = '𝑮𝑨𝑨𝑹𝑨 𝑩𝑶𝑻 𝑪𝑯𝑨𝑵𝑵𝑬𝑳 🧸';
const packname = '⏤͟͞ू⃪  ̸̷͢𝑮𝑨𝑨𝑹𝑨 𝑩𝑶𝑻˚₊·—̳͟͞͞🖤';

const iconos = [
      "https://files.catbox.moe/27iqyo.jpg",
"https://files.catbox.moe/95595y.jpg", 
"https://files.catbox.moe/27iqyo.jpg", 
"https://files.catbox.moe/wcv4vu.jpg", 
"https://files.catbox.moe/3oo7u3.jpg", 
"https://files.catbox.moe/rvgcrk.jpg", 
"https://files.catbox.moe/7i2z60.jpg", 
"https://files.catbox.moe/pwnini.jpg", 
"https://files.catbox.moe/5bx320.jpg", 
"https://files.catbox.moe/dcjcpw.jpg"

];

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)]
  .replace('https://files.catbox.moe/27iqyo.jpg');
const defaultSourceUrl = 'https://whatsapp.com/channel/0029VbB3kTn17En2oHroub0O';

const getSourceUrl = () => globalThis.redes || defaultSourceUrl;

const getRandomThumbnail = async (conn) => {
  const thumbnailUrl = getRandomIcono();

  try {
    const file = await conn.getFile(thumbnailUrl);
    if (file?.data && file?.mime?.startsWith('image/')) return { thumbnail: file.data };
  } catch (error) {
    console.error('Error descargando miniatura para externalAdReply:', error);
  }

  return {};
};

const handler = async (type, conn, m, comando) => {
  const msg = {
 rowner: `*╮──══─┈•⤣🧸⤤•┈─══─╭*\n` +
`> 「⸂˼‏هــذا الأمـــر خـــاص بــلــمــالــك فقط 🖤」\n` +
`*╯──══─┈•⤣🧸⤤•┈─══─╰*`, 
owner: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏هـذا الأمــر خــاص  بـالـمـطــور 」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`, 
mods: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> * 「⸂˼‏هـذا الأمــر خــاص بـالمــشــرفــين 🖤」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`, 
premium: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏هـذا الأمــر مـخـصـص  للأعـضـاء الـبـريـمـيـام 🖤」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`, 
group: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏هـذا الأمــر يـعـمـل داخـل  الـجــروبـات  فـقـط 🖤」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`,
private: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏هـذا الأمــر يـعـمـل فــقــط فـي الـخــاص 🖤」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`,
admin: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏هـذا الأمــر خــاص بـمـشـرفـي الـجــروب 🖤」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`, 
botAdmin: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏هـذا الأمــر خــاص بـمـشـرفـي الـجــروب 🖤」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`,
restrict: `╮──══─┈•⤣🧸⤤•┈─══─╭\n` +
`> *「⸂˼‏تــم إيقــاف هـذا الأمــر بـواسـطـة المـطـور نــوࢪ 🖤
」*\n` +
`╯──══─┈•⤣🧸⤤•┈─══─╰`
}[type]

  if (msg) {
    const thumbnailInfo = await getRandomThumbnail(conn);
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      }};

    return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('🌪'));
  }

  return true;
};

export default handler;
