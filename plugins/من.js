const handler = async (m, { conn, usedPrefix }) => {
  const jid = m.chat;

  const sections = [
    {
      title: "◜⏤͟͞𝑵𝑶𝑿𝑬-𝑮𝑶 𝑩𝑶𝑻 ⃝🧜🏻‍♂️◞",
      rows: [
        { title: "🏠 الـرئـيـسـيـة", description: "كل اوامر البوت", id: `${usedPrefix}menu main` },
        { title: "🤖 الـذكـاء الاصـطـنـاعـي", description: "شات جي بي تي و توليد", id: `${usedPrefix}menu ai` },
        { title: "🌸 الأنـمـي والـمـانـجـا", description: "صور و بحث انمي", id: `${usedPrefix}menu anime` },
        { title: "🎵 التحـميـلات", description: "يوتيوب و تيك توك", id: `${usedPrefix}menu downloader` },
        { title: "🛠️ الأدوات", description: "تحويل و استيكر", id: `${usedPrefix}menu tools` },
        { title: "🎮 الالعاب", description: "العاب الجروب", id: `${usedPrefix}menu gamers` },
        { title: "📋 كل الاوامر", description: "عرض كل حاجة", id: `${usedPrefix}allmenu` }
      ]
    }
  ]

  const listMessage = {
    text: `*◜⏤͟͞𝑵𝑶𝑿𝑬-𝑮𝑶 𝑩𝑶𝑻 ⃝🧜🏻‍♂️◞*\n*⎔⋅• ━ ╼╃⎔╷🪴╵⎔╄╾ ━ •⋅⎔*\n\n*જ⁀➴ قـائـمـة الأوامــر الـرئـيـسـيـة ⇦*\n\nاختار القسم اللي عايزه من تحت`,
    footer: "*જ⁀➴ اضغط على الزر بالأسفل للتنقل*",
    title: "القائمة الرئيسية",
    buttonText: "اضغط هنا ⌛",
    sections
  }

  await conn.sendMessage(jid, listMessage, { quoted: m })

  // نبعت ازرار الروابط تحت الليست
  await conn.sendMessage(jid, {
    text: 'روابط مهمة',
    footer: 'NOXE-GO BOT',
    buttons: [
      { buttonId: 'url', buttonText: { displayText: '📢 قـنـاة الـمـطـور' }, type: 4, nativeFlowInfo: { name: 'cta_url', paramsJson: JSON.stringify({ url: "https://whatsapp.com/channel/0029VbBh4ku8aKvPx1m0l822" }) } },
      { buttonId: 'url', buttonText: { displayText: '📌 رابـط الـمـجـمـوعـة' }, type: 4, nativeFlowInfo: { name: 'cta_url', paramsJson: JSON.stringify({ url: "https://chat.whatsapp.com/CYivuGDjQVKDQqswtu4QnZ" }) } }
    ],
    headerType: 1
  }, { quoted: m })

};

handler.help = ['منيو', 'قائمة'];
handler.tags = ['main'];
handler.command = ['منيو', 'قائمة'];

export default handler;