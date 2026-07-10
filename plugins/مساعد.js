import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// دالة ذكية لقراءة بنية ملفات المشروع وتوليد شجرة المجلدات (بدون node_modules)
const getProjectStructure = (dir, prefix = '', depth = 0) => {
    if (depth > 3) return ''; // تحديد العمق لحماية حجم البيانات
    let txt = '';
    try {
        const items = fs.readdirSync(dir);
        // تصفية المجلدات والملفات غير الضرورية لتوفير المساحة
        const filtered = items.filter(item => !['node_modules', '.git', '.npm', 'tmp', '.pm2', 'package-lock.json', 'yarn.lock'].includes(item));
        
        filtered.forEach((item, index) => {
            const fullPath = path.join(dir, item);
            const isDir = fs.statSync(fullPath).isDirectory();
            const isLast = index === filtered.length - 1;
            
            txt += `${prefix}${isLast ? '└── ' : '├── '}${isDir ? '📁' : '📄'} ${item}\n`;
            if (isDir) {
                txt += getProjectStructure(fullPath, prefix + (isLast ? '    ' : '│   '), depth + 1);
            }
        });
    } catch (e) {
        // تجنب التوقف في حالة عدم وجود صلاحية قراءة لبعض الملفات
    }
    return txt;
};

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('*⛔ أدخل السؤال، الأمر أو الكود المطلوب أولاً!*\n> | *◠  ⿻   𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥*');

  try {
    await m.react('⏳');

    // 1. جلب بنية ملفات السيرفر الحالي
    const projectTree = getProjectStructure(process.cwd());

    // 2. دمج البنية مع طلب المستخدم ليكون المساعد فاهم نظامك بالكامل
    const fullPromptWithContext = `[سياق النظام: أنت مساعد برمجيات ذكي مدمج داخل LUFFY BOT. المطور الأساسي هو المبرمج نور (Nour Dev). إليك بنية الملفات والمجلدات الحالية للمشروع لتفهم السورس وتساعد بدقة عالية]:\n${projectTree}\n\n[طلب المطور نور]: ${text}`;

    // 3. جلب الرد من الـ API الخارق ديالك
    const res = await fetch(`https://api-programmer-nour-ai-pro.vercel.app/api/ai-pro?text=${encodeURIComponent(fullPromptWithContext)}`);
    const data = await res.json();
    const answer = data.response || '❌ لم أتمكن من الحصول على الرد من API.';

    // 4. تفكيك الرد وعزل النصوص العادية والجداول عن الأكواد البرمجية
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
            
            if (!lang || lang.includes(' ') || lang.length > 15) {
                lang = 'javascript'; 
            }
            
            const codeContent = lines.slice(1).join('\n').trim();
            if (codeContent) {
                codeBlocksData.push({ lang, codeContent });
            }
        } else {
            // نصوص الشرح العادية والجداول
            explanationText += part.trim() + '\n\n';
        }
    }

    explanationText = explanationText.trim();

    // 5. إرسال نص الشرح والجداول أولاً لفوق بشكل عادي ومنظم
    if (explanationText) {
        const txt = `*_╮──══─┈•⤣⚡⤤•┈─══─╭_*\n${explanationText}\n*_╯──══─┈•⤣⚡⤤•┈─══─╰_*\n> | *◠  ⿻  𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥*`;
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

    // 6. إذا كانت هناك أكواد، يتم فصلها وإرسالها بـ Rich Message مظلم ومحمي
    if (codeBlocksData.length > 0) {
        
        // فاصل أسطوري وجميل يوضح بداية الأكواد المستخرجة لإراحة العين
        const dividerText = `*👇 الشفرة البرمجية المستخرجة والجاهزة للاستخدام:*\n── • ⚡ • ──`;
        await conn.sendMessage(m.chat, { text: dividerText }, { quoted: m });

        // استيراد مكتبة Baileys ديناميكياً
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
                botJid: "867051314767696@bot" // ثيم خوادم ميتـا
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

        const messageId = "LUFFY-ASSISTANT-" + Date.now().toString(36).toUpperCase();
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

        // بث الأكواد آلياً
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    await m.react('✅');

  } catch (err) {
    console.error(err);
    m.reply('*❌ حدث خطأ أثناء معالجة الطلب مع النــور الــمــبــرمــج 🖤*');
  }
};

// تفعيل كل الأسماء والذين من ضمنهم "مساعد" ليشتغل كأمر متكامل
handler.command = ['مساعد'];
export default handler;