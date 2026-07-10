let handler = async (m, { conn }) => {
    let message = "I'm here bro 𒉭"

    let status = await conn.sendMessage(m.chat, { text: "┃" }, { quoted: m })

    let currentText = ""

    async function typeText(msg, delay = 50) {
        for (let i = 0; i < msg.length; i++) {
            currentText += msg[i]
            await conn.sendMessage(m.chat, {
                text: currentText + "┃",
                edit: status.key
            })
            await new Promise(resolve => setTimeout(resolve, delay))
        }
        await conn.sendMessage(m.chat, {
            text: "```" + currentText + "```",
            edit: status.key
        })
    }

    await typeText(message, 30)
}

handler.all = async function (m) {
    if (!m.text) return
    if (m.key.fromMe) return 
    let text = m.text.trim()
    if (/^(test|تست)$/i.test(text)) {
        await handler(m, { conn: this })
        return true
    }
}

handler.help = ['N O U R']
handler.tags = ['N O U R']

export default handler