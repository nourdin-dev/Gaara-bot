import util from 'util';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, isPrefix, command }) => {
    // 👑 الحصول على معرف البوت بشكل آلي
    const botNumber = conn.user.jid || conn.user.id;

    if (!m.quoted) return conn.reply(m.chat, '⚠️ **يا هلا وغلا! يرجى عمل رد (reply) على الرسالة أو الكود لي تبي نشتغل عليه يا بطل. 👑**', m);

    // دالة موحدة لإرسال الأكواد بشكل Preview متقدم ومظلم
    const sendRichCode = async (codeText) => {
        const lines = codeText.split('\n');
        const codeBlocks = [];
        const urlRegex = /(https?:\/\/[^\s"]+)/g;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('"') && line.includes(':')) {
                const parts = line.split(/(:)/);
                const keyPart = parts[0];
                const separator = parts[1];
                const valuePart = parts.slice(2).join('');

                codeBlocks.push({ highlightType: 2, codeContent: keyPart });
                codeBlocks.push({ highlightType: 1, codeContent: separator });

                if (urlRegex.test(valuePart)) {
                    urlRegex.lastIndex = 0;
                    const valParts = valuePart.split(urlRegex);
                    for (const part of valParts) {
                        if (urlRegex.test(part) || part.startsWith('http')) {
                            codeBlocks.push({ highlightType: 3, codeContent: part });
                        } else {
                            codeBlocks.push({ highlightType: 1, codeContent: part });
                        }
                    }
                } else {
                    codeBlocks.push({ highlightType: 1, codeContent: valuePart });
                }
            } else {
                codeBlocks.push({ highlightType: 1, codeContent: line });
            }
            if (i < lines.length - 1) {
                codeBlocks.push({ highlightType: 1, codeContent: '\n' });
            }
        }

        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: [{ messageType: 5, codeMetadata: { codeLanguage: "javascript", codeBlocks: codeBlocks } }],
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 1,
                    forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                    forwardOrigin: 4
                }
            }
        };

        const previewMsg = await generateWAMessageFromContent(m.chat, {
            botForwardedMessage: { message: richMessage }
        }, {
            userJid: botNumber,
            messageId: (conn.generateMessageIDV2 && typeof conn.generateMessageIDV2 === 'function') ? conn.generateMessageIDV2(botNumber) : "Luffy-" + Date.now().toString(36).toUpperCase()
        });

        await conn.relayMessage(m.chat, previewMsg.message, { messageId: previewMsg.key.id });
    };

    let messagePayload = null;
    let isPayloadExtracted = false;

    const quotedText = m.quoted.text || m.quoted.msg?.text || m.quoted.msg?.caption || '';
    const isExplicitCode = quotedText.startsWith('=>') || quotedText.startsWith('>');

    // 🌟 فحص التحويل: هل هو Plugin كامل؟
    const isPluginConversion = quotedText.includes('handler') && (quotedText.includes('handler.command') || quotedText.includes('module.exports') || quotedText.includes('export default'));

    if (isPluginConversion) {
        let code = quotedText;

        // 1. استخراج Imports
        let imports = [];
        code = code.replace(/^(?:import\s+[\s\S]+?from\s+['"].+?['"]\s*;?|const\s+.+?\s*=\s*require\(['"].+?['"]\)\s*;?)/gm, (match) => {
            imports.push(match.trim());
            return '';
        });

        // 2. استخراج Command
        let usageStr = "['command']";
        let cmdMatch = code.match(/handler\.command\s*=\s*(\[.*?\]|'.*?'|".*?"|\/.*?\/[a-z]*)/i);
        if (cmdMatch) {
            let rawCmd = cmdMatch[1];
            if (rawCmd.startsWith('/')) {
                let cleaned = rawCmd.replace(/^\/\^?|\$?\/[a-z]*$/gi, '');
                cleaned = cleaned.replace(/^\((.*?)\)$/, '$1');
                let parts = cleaned.split('|');
                usageStr = JSON.stringify(parts).replace(/"/g, "'");
            } else {
                usageStr = rawCmd.replace(/"/g, "'");
            }
        }

        // 3. استخراج Help
        let useStr = "'وصف الاستخدام'";
        let helpMatch = code.match(/handler\.help\s*=\s*(\[.*?\]|'.*?'|".*?")/i);
        if (helpMatch) {
            let rawHelp = helpMatch[1];
            if (rawHelp.startsWith('[')) {
                let arr = rawHelp.replace(/^\[|\]$/g, '').split(',');
                useStr = arr[0]? arr[0].trim() : "'وصف الاستخدام'";
            } else {
                useStr = rawHelp;
            }
            useStr = useStr.replace(/"/g, "'");
        }

        // 4. استخراج Tags
        let tagsStr = "['main']";
        let tagsMatch = code.match(/handler\.tags\s*=\s*(\[.*?\]|'.*?'|".*?")/i);
        if (tagsMatch) {
            tagsStr = tagsMatch[1].replace(/"/g, "'");
        }

        // 5. استخراج الصلاحيات والـ Flags
        let flags = [];
        if (/handler\.limit\s*=\s*true/i.test(code)) flags.push('handler.limit = true;');
        if (/handler\.owner\s*=\s*true/i.test(code)) flags.push('handler.owner = true;');
        if (/handler\.admin\s*=\s*true/i.test(code)) flags.push('handler.admin = true;');
        if (/handler\.group\s*=\s*true/i.test(code)) flags.push('handler.group = true;');
        if (/handler\.private\s*=\s*true/i.test(code)) flags.push('handler.private = true;');
        if (/handler\.premium\s*=\s*true/i.test(code)) flags.push('handler.premium = true;');

        // 6. استخراج جسم دالة الـ handler
        let linesOfCode = quotedText.split('\n');
        let bodyLines = [];
        let insideHandler = false;

        for (let line of linesOfCode) {
            let trimmed = line.trim();
            if (/let\s+handler\s*=\s*async/i.test(line) || /async\s+function\s+handler/i.test(line) || /handler\s*=\s*async/i.test(line)) {
                insideHandler = true;
                continue;
            }
            if (insideHandler) {
                if (trimmed.startsWith('handler.') || trimmed.startsWith('export default') || trimmed.startsWith('module.exports')) {
                    break;
                }
                bodyLines.push(line);
            }
        }

        let bodyStr = bodyLines.join('\n').trim();
        if (bodyStr.endsWith('};')) bodyStr = bodyStr.substring(0, bodyStr.length - 2).trim();
        else if (bodyStr.endsWith('}')) bodyStr = bodyStr.substring(0, bodyStr.length - 1).trim();

        // 7. توحيد ميثودز الإرسال لتتوافق مع بنية لوفي بوت
        bodyStr = bodyStr.replace(/(conn|client|sock)\.sendMessage\(\s*m\.chat\s*,\s*\{\s*text:\s*([\s\S]*?)\s*\}\s*(?:,\s*\{\s*quoted:\s*m\s*\}\s*)?\)/g, "conn.reply(m.chat, $2, m)");
        bodyStr = bodyStr.replace(/\bconn\b/g, "conn");
        bodyStr = bodyStr.replace(/\bclient\b/g, "conn");
        bodyStr = bodyStr.replace(/\bsock\b/g, "conn");
        bodyStr = bodyStr.replace(/\busedPrefix\b/g, "usedPrefix");

        // 8. بناء الكود النهائي المترجم لبنية لوفي بوت
        let pluginCode = `${imports.join('\n')}${imports.length > 0? '\n\n' : ''}const handler = async (m, { conn, text, usedPrefix, command }) => {
    ${bodyStr.split('\n').join('\n     ')}
}

handler.command = ${usageStr};
handler.help = ${useStr};
handler.tags = ${tagsStr};
${flags.join('\n')}

export default handler;`;

        await sendRichCode(pluginCode);

        // تنفيذ محاكاة تجريبية تلقائية
        try {
            let testText = text || "";
            let testCommand = "command";
            try {
                let parsedCmd = eval(usageStr);
                if (Array.isArray(parsedCmd)) testCommand = parsedCmd[0];
                else if (typeof parsedCmd === 'string') testCommand = parsedCmd;
            } catch {}
            const axios = (await import('axios')).default;

            const executeBody = new Function('conn', 'm', 'text', 'usedPrefix', 'command', 'axios', `
                return (async () => {
                    ${bodyStr}
                })();
            `);

            await executeBody(conn, m, testText, isPrefix, testCommand, axios);
        } catch (execErr) {
            await conn.reply(m.chat, `💡 **تنبيه:** الـ Compiler ترجم لك البلوجن بنجاح، لكن واجهنا عقبة بسيطة أثناء محاكاة التشغيل التلقائي:\n\`\`\`${execErr.message}\`\`\``, m);
        }

        return;
    }

    // 9. استخراج البروتوكول
    if (isExplicitCode) {
        let cleanText = quotedText.trim().replace(/^(>|=>)\s*/, '');
        const isMessageBuilder = cleanText.includes('relayMessage') || cleanText.includes('sendMessage') || (cleanText.startsWith('{') && cleanText.endsWith('}'));

        if (!isMessageBuilder) {
            let translatedCode = cleanText.replace(/\bclient\b/g, 'conn').replace(/\bsock\b/g, 'conn');
            try {
                await conn.reply(m.chat, `🚀 **جاري تحويل الكود وتجهيزه:**\n\n> ${translatedCode}`, m);
                let evalResult = await eval(`(async () => { return ${translatedCode} })()`);
                if (evalResult === undefined) {
                    evalResult = await eval(`(async () => { ${translatedCode} })()`);
                }
                const resultString = util.inspect(evalResult, { depth: null });
                return conn.reply(m.chat, `✨ **النتيجة النهائية:**\n\n\`\`\`${resultString}\`\`\``, m);
            } catch (err) {
                return conn.reply(m.chat, `⚠️ **حصلت مشكلة بسيطة:**\n\n> ${translatedCode}\n\n**الخطأ:**\n\`\`\`${String(err)}\`\`\``, m);
            }
        } else {
            try {
                cleanText = cleanText.replace(/await\s+/g, '');
                if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
                    messagePayload = eval(`(${cleanText})`);
                    if (messagePayload && typeof messagePayload === 'object') isPayloadExtracted = true;
                } else {
                    const mockConn = { relayMessage: (jid, payload) => { messagePayload = payload; }, sendMessage: () => {} };
                    eval(`const m = { chat: '${m.chat}' }; const conn = mockConn; ${cleanText}`);
                    if (messagePayload && typeof messagePayload === 'object') isPayloadExtracted = true;
                }
            } catch (e) {}
        }
    }

    if (!isPayloadExtracted) {
        let rawQuoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!rawQuoted) {
            if (m.quoted?.message) rawQuoted = m.quoted.message;
            else if (m.quoted?.mtype && m.quoted?.msg) rawQuoted = { [m.quoted.mtype]: m.quoted.msg };
            else rawQuoted = m.quoted;
        }

        const unwrapMessage = (msg) => {
            if (!msg || typeof msg !== 'object') return msg;
            const cleanMsg = { ...msg };
            delete cleanMsg.key;
            delete cleanMsg.messageStubParameters;
            delete cleanMsg.messageStubType;
            if (cleanMsg.message) return unwrapMessage(cleanMsg.message);
            if (cleanMsg.ephemeralMessage?.message) return unwrapMessage(cleanMsg.ephemeralMessage.message);
            if (cleanMsg.viewOnceMessage?.message) return unwrapMessage(cleanMsg.viewOnceMessage.message);
            if (cleanMsg.viewOnceMessageV2?.message) return unwrapMessage(cleanMsg.viewOnceMessageV2.message);
            if (cleanMsg.viewOnceMessageV2Extension?.message) return unwrapMessage(cleanMsg.viewOnceMessageV2Extension.message);
            if (cleanMsg.documentWithCaptionMessage?.message) return unwrapMessage(cleanMsg.documentWithCaptionMessage.message);
            if (cleanMsg.ptvMessage?.message) return unwrapMessage(cleanMsg.ptvMessage.message);
            return cleanMsg;
        };

        messagePayload = unwrapMessage(rawQuoted);
        if (!messagePayload || Object.keys(messagePayload).length === 0) {
            messagePayload = { ...rawQuoted };
            delete messagePayload.m; delete messagePayload.conn; delete messagePayload.sender;
        }
    }

    if (!messagePayload || typeof messagePayload !== 'object') {
        return conn.reply(m.chat, '❌ **فشل الاستخراج، تأكد من الرد على رسالة فعلية.**', m);
    }

    function stringifyPayload(obj, indent = '   ', isInsideContextInfo = false, seen = new WeakSet()) {
        if (obj === null) return 'null';
        if (obj === undefined) return 'undefined';
        if (typeof obj === 'object') { if (seen.has(obj)) return '"[Circular Reference]"'; seen.add(obj); }
        if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) { return `Buffer.from("${Buffer.from(obj).toString('base64')}", "base64")`; }
        if (typeof obj === 'object') {
            if (obj.type === 'Buffer' && Array.isArray(obj.data)) { return `Buffer.from("${Buffer.from(obj.data).toString('base64')}", "base64")`; }
            if (Array.isArray(obj)) {
                if (obj.length === 0) return '[]';
                return `[\n${indent}   ${obj.map(item => stringifyPayload(item, indent + '   ', isInsideContextInfo, seen)).join(`,\n${indent}   `)}\n${indent}]`;
            }
            const keys = Object.keys(obj).filter(k => typeof obj[k] !== 'function' && k !== 'm' && k !== 'conn');
            if (keys.length === 0) return '{}';
            const parts = keys.map(k => {
                const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
                const currentContext = isInsideContextInfo || k === 'contextInfo';
                if (currentContext && k === 'stanzaId') return `${validKey}: m.key.id`;
                if (currentContext && k === 'participant') return `${validKey}: m.sender`;
                if (currentContext && k === 'remoteJid') return `${validKey}: m.chat`;
                return `${validKey}: ${stringifyPayload(obj[k], indent + '   ', currentContext, seen)}`;
            });
            return `{\n${indent}   ${parts.join(`,\n${indent}   `)}\n${indent}}`;
        }
        return typeof obj === 'string' ? JSON.stringify(obj) : String(obj);
    }

    const payloadString = stringifyPayload(messagePayload);
    const formattedProtocol = `> try {
   await conn.relayMessage(
      m.chat,
      ${payloadString},
      { messageId: (conn.generateMessageIDV2 && typeof conn.generateMessageIDV2 === 'function') ? conn.generateMessageIDV2(m.chat) : "Luffy-" + Date.now().toString(36).toUpperCase() }
   );
   await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
} catch (e) {
   conn.reply(m.chat, String(e?.stack || e), m);
}`;

    await sendRichCode(formattedProtocol);

    const patchPayloadForLiveTest = (obj, seenLive = new WeakSet()) => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) return obj;
        if (seenLive.has(obj)) return undefined; seenLive.add(obj);
        const cloned = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === 'function') continue;
                if (key === 'stanzaId') cloned[key] = m.key.id;
                else if (key === 'participant') cloned[key] = m.sender;
                else if (key === 'remoteJid') cloned[key] = m.chat;
                else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (obj[key].type === 'Buffer' && Array.isArray(obj[key].data)) cloned[key] = Buffer.from(obj[key].data);
                    else cloned[key] = patchPayloadForLiveTest(obj[key], seenLive);
                } else cloned[key] = obj[key];
            }
        }
        return cloned;
    };

    await conn.relayMessage(m.chat, patchPayloadForLiveTest(messagePayload), {
        messageId: (conn.generateMessageIDV2 && typeof conn.generateMessageIDV2 === 'function') ? conn.generateMessageIDV2(m.chat) : "Luffy-TEST-" + Date.now().toString(36).toUpperCase()
    });

    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
}

handler.command = /^(-->|protocol)$/i;
handler.help = ['--> reply'];
handler.tags = ['tools']; // تم تغيير التاغ ليعمل مع الجميع
handler.rowner = false; // تم إلغاء حصر الأمر على المطور

export default handler;