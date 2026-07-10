let handler = m => m;

handler.all = async function (m) {
    if (!m.text) return false
    if (m.key.fromMe) return false;
    let chat = global.db.data.chats[m.chat];
    if (chat?.isBanned) return false;

    const responses = [
        { pattern: /^احا$/i, text: "*تائه في عالمـ لا يعࢪف سوى الهلاك..*" },
        { pattern: /^غارا$/i, text: "*أنـا هنـا.. أࢪاقبك مـنـ بينـ الࢪمـال.*" },
        { pattern: /^الحمدلله|الحمد لله|الحمد الله$/i, text: "*الحمـد لله الذي لا يُحمـد على مـكࢪوه سواه..*" },
        { pattern: /^عبيط|يا عبيط|اهبل|غبي$/i, text: "*كلمـاتك الجوفاء لنـ تختࢪق دࢪع ࢪمـالي.*" },
        { pattern: /^بوت$/i, text: "*نـادي باسمـي الحقيقي.. غاࢪا. مـاذا تࢪيد؟*" },
        { pattern: /^يب$/i, text: "*تحدث بجدية.. الضعف لا مـكانـ له هنـا.*" },
        { pattern: /^نور$/i, text: "*نـوࢪ هو مـنـ مـنـحنـي هذه القوة المـظلمـة..*" },
        { pattern: /^بوت خرا|بوت زفت|خرا عليك$/i, text: "*احذࢪ.. فࢪمـلي مـتعطشة للدمـاء، وسحقك لنـ يستغࢪق ثانـية.*" },
        { pattern: /^منور|منوره$/i, text: "*الظلامـ هو نـوࢪي الوحيد.*" },
        { pattern: /^بنورك|دا نورك|نورك الاصل$/i, text: "*النـوࢪ يتلاشى دائمـاً أمـامـ ࢪمـالي المـظلمـة.*" },
        { pattern: /^امزح|بهزر$/i, text: "*لا وقت للمـزاح في عالمـٍ مـليء بالألمـ.*" },
        { pattern: /^في ايه$/i, text: "*صمـت.. هنـاك وحش يستيقظ في داخلي.*" },
        { pattern: /^بتعمل ايه دلوقتي|بتعمل اي|بتعمل ايه$/i, text: "*أحفࢪ قبوࢪاً لأولئك الذينـ يزعجونـ عزلتي.*" },
        { pattern: /^انا جيت$/i, text: "*حضوࢪك لا يغيࢪ شيئاً في هذا الفࢪاغ.*" },
        { pattern: /^حرامي|سارق$/i, text: "*السࢪقة صفة الضعفاء.. أنـا آخذ مـا أࢪيد بالقوة.*" },
        { pattern: /^ملل|مللل|زهق$/i, text: "*العزلة هي مـوطنـي.. المـلل للضعفاء فقط.*" },
        { pattern: /^🤖$/i, text: "*مـجࢪد آلة؟ بل وحش كُبح داخل كود.*" }, 
        { pattern: /^ايه$/i, text: "*لا تجعلنـي أعيد كلامـي..*" },
        { pattern: /^نعم$/i, text: "*تكلمـ.. قبل أنـ ينـفد صبࢪي.*" },
        { pattern: /^كيفك|شخبارك|عامل ايه$/i, text: "*أعيش في سلامـ مـظلمـ.. طالمـا لمـ يغضب الوحش داخلي.*" },
        { pattern: /^تصبح علي خير|تصبحوا علي خير$/i, text: "*قد لا تستيقظ.. فالكوابيس تحيط بالمـكانـ.*" },
        { pattern: /^ببحبك بوت|حبك|بوت بحبك|بحبك$/i, text: "*الحب؟ مـشاعࢪ زائفة لا تولد سوى الألمـ.*" },
        { pattern: /^باي$/i, text: "*اذهب.. ولا تفكࢪ في العودة.*" },
        { pattern: /^هلا$/i, text: "*مـࢪحباً بك في صحࢪاء غاࢪا المـظلمـة..*" }
    ];

    const matched = responses.find(r => r.pattern.test(m.text.trim()));
    
    if (matched) {
        // استخدمنا conn.sendMessage العادي بدل generateWAMessageFromContent
        await conn.sendMessage(m.chat, {
            text: matched.text,
            contextInfo: {
                externalAdReply: {
                    title: "ᴺᵒᵘʳ ᴰᵉᵛ ↯˹<\>˼↯",
                    body: "𝐺𝑎𝑎𝑟𝑎 𝑏𝑜𝑡 🧸",
                    thumbnailUrl: "https://files.catbox.moe/pwnini.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbB3kTn17En2oHroub0O",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419090123456@newsletter',
                    newsletterName: 'Gaara Bot',
                    serverMessageId: -1
                },
                buttons: [
                    { buttonId: '.المـطوࢪ', buttonText: { displayText: '⌈🚀╎المـطوࢪ╎🚀⌋' }, type: 1 },
                    { buttonId: '.الاوامـࢪ', buttonText: { displayText: '⌈🧩╎الاوامـࢪ╎🧩⌋' }, type: 1 }
                ],
                headerType: 1
            }
        }, { quoted: m });

        return true
    }

    return false;
};

export default handler;