const handler = async (m, { text, conn }) => {
  if (!text) {
    return conn.sendMessage(m.chat, { text: `*_╮──══─┈•⤣⚡⤤•┈─══─╭_*
_خلي الرابط معا الامࢪ 🥷🏻_
*مـثـال  :   .سكرين https://nour-dev.xyz*
*_╯──══─┈•⤣⚡⤤•┈─══─╰_*` }, { quoted: m });
  }

  const screenshotUrl = `https://image.thum.io/get/fullpage/${text}`;
  const loadingMessage = await conn.sendMessage(m.chat, { text: '*_╮──══─┈•⤣⚡⤤•┈─══─╭_*\n _| *◠  ⿻  راقـب الـسـكريـن_\n*_╯──══─┈•⤣⚡⤤•┈─══─╰_*' }, { quoted: m });

 try {
  setTimeout(async () => {

 await conn.sendMessage(m.chat, { image: { url: screenshotUrl }, mimetype: 'image/png', fileName: 'screen.png' }, { quoted: m });

  }, 5000); // 5000 ميلي ثانية = 5 ثواني

 } catch (error) {
      await conn.sendMessage(m.chat, { text: `*حدث خطأ أثناء جلب الصورة. حاول مرة أخرى لاحقًا.*` }, { quoted: m });
    }
};

handler.command = /^(screen|سكرين)$/i;
export default handler;