import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('*⛔ أدخل السؤال أو الكود المطلوب أولاً!*\n> | *◠  ⿻   𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥*');

  try {
    await m.react('⏳');

    // جلب الرد من الـ API الخارق ديالك
    const res = await fetch(`https://api-programmer-nour-ai-pro.vercel.app/api/ai-pro?text=${encodeURIComponent(text)}`);
    const data = await res.json();
    const answer = data.response || '❌ لم أتمكن من الحصول على الرد من API.';

    // 1. تفكيك الرد وعزل النصوص العادية عن الأكواد البرمجية
    const parts = answer.split(/```/);
    let explanationText = '';
    let codeBlocksData = [];

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        if (!part) continue;

        if (i % 2 === 1) {
            // كتل برمجية (داخل الـ ```)
            const lines = part.split('\n');
            let lang = lines[0].trim().toLowerCase();
            
            // تنظيف لغة البرمجة المستهدفة
            if (!lang || lang.includes(' ') || lang.length > 15) {
                lang = 'javascript'; 
            }
            
            const codeContent = lines.slice(1).join('\n').trim();
            if (codeContent) {
                codeBlocksData.push({ lang, codeContent });
            }
        } else {
            // نصوص الشرح العادية (خارج الـ ```)
            explanationText += part.trim() + '\n\n';
        }
    }

    explanationText = explanationText.trim();

    // 2. إرسال نص الشرح أولاً لفوق عادي بزخرفة لوفي بوت
    if (explanationText) {
        const txt = `*_╮──══─┈•⤣⚡⤤•┈─══─╭_*\n${explanationText}\n*_╯──══─┈•⤣⚡⤤•┈─══─╰_*\n> | *◠  ⿻  𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥*`;
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

    // 3. إرسال الكود لتحت بنظام الـ Rich Message المظلم والمنظم
    if (codeBlocksData.length > 0) {
        // استيراد مكتبة Baileys ديناميكياً لضمان استقرار السيرفر
        let baileysLib;
        try {
            baileysLib = await import('@whiskeysockets/baileys');
        } catch {
            try {
                baileysLib = await import('baileys');
            } catch {
                try {
                    baileysLib = await import('./lib/baileys.js');
                } catch {
                    throw new Error("لم يتم العثور على حزمة Baileys.");
                }
            }
        }
        const { generateWAMessageFromContent } = baileysLib.default ? baileysLib : baileysLib;

        const botJid = conn.user.id ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : conn.user.jid;
        const botMeta = {
            isForwarded: true,
            forwardingScore: 999, 
            forwardedAiBotMessageInfo: {
                botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
        };

        const submessages = [];
        for (const block of codeBlocksData) {
            submessages.push({
                messageType: 5,
                codeMetadata: {
                    codeLanguage: block.lang,
                    codeBlocks: [{ highlightType: 1, codeContent: block.codeContent }]
                }
            });
        }

        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: submessages,
                contextInfo: botMeta
            }
        };

        const messageId = "LUFFY-CODE-" + Date.now().toString(36).toUpperCase();
        const msg = await generateWAMessageFromContent(m.chat, { 
            botForwardedMessage: { 
                message: richMessage 
            } 
        }, {
            senderId: botJid,
            userJid: botJid,
            messageId: messageId
        });

        if (msg.message?.botForwardedMessage) {
            msg.message.botForwardedMessage.contextInfo = botMeta;
        }

        // بث كتل الأكواد مباشرة أسفل نص الشرح
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    await m.react('✅');

  } catch (err) {
    console.error(err);
    m.reply('*❌ حدث خطأ أثناء الاتصال بـ النــور الــمــبــرمــج 🖤*');
  }
};

handler.command = ['مبرمج', 'dev', 'programmer', 'المبرمج', 'Developer'];
export default handler;