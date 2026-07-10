import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const imageUrl = "https://files.catbox.moe/81066q.jpg";

  const media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer });

  const caption = `
*_أخـتـر طـريـقـة الـربـط عـبـر الأزرار الـتـالـيـة 🖤_*`;

  const buttons = [
    { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'الـربـط عـبـر كـود', id: '.code' }) },
    { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'الـربـط عـبـر 𝑄𝑅', id: '.qr' }) },
  ];

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
          body: { text: caption },
          footer: { text: "*_اخـتـر طـريـقـة للتـنصـيـب 🥷🏻_*" },
          nativeFlowMessage: { buttons },
        },
      },
    },
  }, { userJid: conn.user.jid, quoted: m });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = /^تنصيب|serbot|jadibot|نسخ_البوت$/i;
export default handler;