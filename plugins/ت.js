let handler = async (m, { conn }) => {
    // الكود هنا غادي يتنفذ قبل كل رسالة
}

handler.before = async (m, { conn }) => {
    if (m.sender === "34672982032@s.whatsapp.net") {
        const emojis = ['🗿','🥷🏻','🤡','🐺','🌪','🌩','🥷🏻','⛈️','👑','👻','🖤','🌨','✨','🙈','🌩','🧸','💞','🌙','💸','💘','🦋','🦈','🎃','👽','🫦','🦇','🚬']
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        
        try {
            await conn.sendMessage(m.chat, { react: { text: randomEmoji, key: m.key } })
        } catch (error) {
            console.error('❌ فشل في إرسال التفاعل:', error)
        }
        
        return true // true = كمل تنفيذ الرسالة عادي
    }
    return false // false = تجاهل
}

export default handler