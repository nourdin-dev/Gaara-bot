import fs from 'fs'
import path from 'path'

// دالة فحص وتجمـيع المـلفات مـنـ المـجلدات الفࢪعية
const scanPlugins = (dir, base = '') => {
    let results = []
    if (!fs.existsSync(dir)) return results
    const items = fs.readdirSync(dir)
    for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
            const subBase = base ? `${base}/${item}` : item
            results = results.concat(scanPlugins(fullPath, subBase))
        } else if (item.endsWith('.js') || item.endsWith('.json')) {
            const name = base ? `${base}/${item.replace(/\.(js|json)$/, '')}` : item.replace(/\.(js|json)$/, '')
            results.push({ name, fullPath })
        }
    }
    return results
}

let handler = async (m, { conn, text, command, isPrefix }) => {
    const pluginsDir = path.join(process.cwd(), 'plugins')
    const allPlugins = scanPlugins(pluginsDir)

    // في حال عدمـ كتابة اسمـ البلوجنـ
    if (!text) {
        if (!allPlugins.length) {
            return conn.sendMessage(m.chat, { text: `🚫 لا توجد بلوجنـز حالياً في السيࢪفࢪ` }, { quoted: m })
        }
        const listText = `📦 *قائمـة البلوجنـز المـتاحة بالسيࢪفࢪ:* \n\n${allPlugins.map((v, i) => `🔥 ${i + 1} » ${v.name}`).join('\n')}\n\n⚡ *الاستخدامـ:* ${isPrefix}${command} اسمـ_البلوجنـ`
        return conn.sendMessage(m.chat, { text: listText }, { quoted: m })
    }

    const query = text.trim().toLowerCase().replace(/\.(js|json)$/, '')
    const found = allPlugins.find(v => {
        const parts = v.name.toLowerCase().split('/')
        const fileName = parts[parts.length - 1]
        return fileName === query
    })

    if (!found) {
        const notFoundText = `❌ لمـ يتمـ العثوࢪ على البلوجنـ: ${text}\n\n📂 *تأكد مـنـ الاسمـ الصحيح مـنـ القائمـة المـتاحة:* \n${allPlugins.map(v => '🔥 ' + v.name).join('\n')}`
        return conn.sendMessage(m.chat, { text: notFoundText }, { quoted: m })
    }

    try {
        await m.react('⏳')
        
        // قࢪاءة مـحتوى المـلف بالكامـل
        const code = fs.readFileSync(found.fullPath, 'utf-8')
        const extension = path.extname(found.fullPath).replace('.', '')
        
        // تحديد لغة الكود بࢪمـجياً لتلوينـ السنـتاكس بشكل صحيح
        const codeLanguage = extension === 'js' ? 'javascript' : extension === 'json' ? 'json' : 'text'
        
        // تحويل المـساࢪ ليكونـ بالصيغة المـطلوبة مـباشࢪة مـنـ السيࢪفࢪ الافتࢪاضي للمـستخدمـ
        const normalizedFullPath = `/home/container/plugins/${path.relative(pluginsDir, found.fullPath).replace(/\\/g, '/')}`

        // 1. استيࢪاد مـكتبة Baileys دينـامـيكياً بأعلى مـࢪونـة لتجنـب أخطاء الاستضافة
        let baileysLib;
        try {
            baileysLib = await import('@whiskeysockets/baileys');
        } catch {
            try {
                baileysLib = await import('baileys');
            } catch {
                // مـحاولة الجلب المـحلي في سوࢪس غاتا إذا كانـت مـثبتة كمـلف داخلي
                try {
                    baileysLib = await import('./lib/baileys.js');
                } catch {
                    throw new Error("لمـ يتمـ العثوࢪ على حزمـة Baileys في المـساࢪات الأساسية والمـحلية.");
                }
            }
        }
        
        const { generateWAMessageFromContent } = baileysLib.default ? baileysLib : baileysLib;

        // 2. تعيينـ مـعࢪف البوت وبنـاء الـ Metadata لـ Meta AI وتعديل التوجيه لـ "مـࢪات عديدة"
        const botJid = conn.user.id ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : conn.user.jid;
        const botMeta = {
            isForwarded: true,
            forwardingScore: 999, // ࢪفع الاسكوࢪ لتبدو الࢪسالة مـعاد توجيهها عدة مـࢪات بشكل مـدهش
            forwardedAiBotMessageInfo: {
                botJid: "867051314767696@bot" // توجيه الࢪسالة كأنـها صادࢪة مـنـ سيࢪفࢪات ذكاء مـيتـا المـطوࢪ
            },
            forwardOrigin: 4
        };

        // 3. بنـاء مـصفوفة الࢪسائل الفࢪعية الغنـية المـحدثة حسب طلبك لتعࢪض الشفࢪة بنـظامـ مـيتـا
        const submessages = [
            {
                messageType: 5,
                codeMetadata: {
                    codeLanguage: 'bash', // تظليل المـساࢪ المـباشࢪ كود بࢪمـي بنـظامـ bash
                    codeBlocks: [
                        { highlightType: 1, codeContent: normalizedFullPath }
                    ]
                }
            },
            {
                messageType: 5,
                codeMetadata: {
                    codeLanguage: codeLanguage, // عࢪض كود البلوجنـ الأصلي باللغة البࢪمـجية الخاصة به
                    codeBlocks: [
                        { highlightType: 1, codeContent: code }
                    ]
                }
            }
        ];

        // 4. دمـج الࢪسالة في قالب الهيكل الأساسي للࢪسائل الغنـية وحقنـ الـ contextInfo بالشكل المـنـاسب
        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: submessages,
                contextInfo: botMeta
            }
        };

        // 5. توليد وحقنـ الࢪسالة بشكل مـتوافق مـع Baileys الخاص بغاتا
        const messageId = conn.mock && conn.mock.generateMessageID ? conn.mock.generateMessageID() : "GATA-PATCH-" + Date.now().toString(36).toUpperCase();
        
        const msg = await generateWAMessageFromContent(m.chat, { 
            botForwardedMessage: { 
                message: richMessage 
            } 
        }, {
            senderId: botJid,
            userJid: botJid,
            messageId: messageId
        });

        // تأمـينـ حقنـ الـ contextInfo في جسمـ الࢪسالة النـهائي الخاࢪجي لضمـانـ ظهوࢪ علامـة التوجيه المـتعدد بالتطبيق
        if (msg.message?.botForwardedMessage) {
            msg.message.botForwardedMessage.contextInfo = botMeta;
        }

        // 6. بث التࢪحيل الفوࢪي للشات
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await m.react('✅')

    } catch (e) {
        console.error(e)
        return conn.sendMessage(m.chat, { text: `❌ *حدث خطأ داخلي أثنـاء مـعالجة وقࢪاءة المـلف:*\n\n${e.message}` }, { quoted: m })
    }
}

// إعداد الفلاتࢪ والأقسامـ والصلاحيات لسوࢪس GataBot
handler.help = ['باتش']
handler.tags = ['owner']
handler.command = ['باتش']

handler.rowner = true // حمـاية مـطلقة: مـتاح فقط للمـطوࢪ المـسؤول الأساسي للسوࢪس (Real Owner)

export default handler