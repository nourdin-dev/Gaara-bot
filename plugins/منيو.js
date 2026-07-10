const handler = async (m, { conn, usedPrefix }) => {
  const { generateWAMessageFromContent } = await import('@whiskeysockets/baileys')

  const msg = generateWAMessageFromContent(m.chat, {
    interactiveMessage: {
      header: {
        title: "𝑵𝑶𝑿𝑬-𝑮𝑶 𝑩𝑶𝑻",
        hasMediaAttachment: false
      },
      body: {
        text: `*જ⁀➴ قـائـمـة الأوامــر*\n\n> ${usedPrefix}menu main\n> ${usedPrefix}menu ai`
      },
      footer: {
        text: "اضغط على الأزرار للتنقل"
      },
      nativeFlowMessage: {
        buttons: [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🏠 الرئيسية", id: `${usedPrefix}menu main` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🤖 الذكاء الاصطناعي", id: `${usedPrefix}menu ai` }) },
          { name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "📢 قناة المطور", url: "https://whatsapp.com/channel/0029VbBh4ku8aKvPx1m0l822", merchant_url: "https://whatsapp.com/channel/0029VbBh4ku8aKvPx1m0l822" }) }
        ],
        messageParamsJson: ''
      }
    }
  }, { userJid: conn.user.jid, quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['منيو']
handler.tags = ['main']
handler.command = ['منيو', 'قائمة']

export default handler