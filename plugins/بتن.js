const handler = async (m, { conn }) => {
    const { generateWAMessageFromContent } = await import('@whiskeysockets/baileys')
    
    const buttons = [
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🔴 زر 1', id: '.code' }) },
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🔵 زر 2', id: '.menu' }) },
        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🌐 الموقع', url: 'https://github.com', merchant_url: 'https://github.com' }) }
    ]

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: '✅ *اختبار الأزرار*\nلو شفت الأزرار معناه كلشي خدام 🎉' },
                    footer: { text: '𝐺𝐴𝑅𝐴 𝐵𝛩𝑇 ↯˹🖤˼↯' },
                    header: { hasMediaAttachment: false },
                    nativeFlowMessage: { buttons, messageParamsJson: '' }
                }
            }
        }
    }, { userJid: conn.user.jid, quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = ['بتن', 'btn', 'test2']
export default handler