import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`╮──══─┈•⤣⚡⤤•┈─══─╭\n> *حـط الرابـط بـعـد الأمرا 🖤*\n*مثـال:* ${usedPrefix + command} https://api.example.com\n╯──══─┈•⤣⚡⤤•┈─══─╰`)

    let url = text.startsWith('http') ? text : 'https://' + text

    try {
        await m.react('⏳')
        let waitingMsg = await conn.sendMessage(m.chat, { 
            text: `╮──══─┈•⤣⚡⤤•┈─══─╭\n> | *◠ ⿻ جـاري فـحـص وجـلـب الـبـيـانات... 🧸*\n╯──══─┈•⤣⚡⤤•┈─══─╰` 
        }, { quoted: m })

        const response = await axios.get(url, { 
            timeout: 25000, 
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        })
        
        const contentType = response.headers['content-type'] || ''
        const buffer = Buffer.from(response.data)

        let filename = url.split('/').pop().split('?')[0] || 'file'
        if (!filename.includes('.')) {
            if (/image\/png/.test(contentType)) filename += '.png'
            else if (/image\/jpeg/.test(contentType)) filename += '.jpg'
            else if (/video\/mp4/.test(contentType)) filename += '.mp4'
            else if (/audio\/mpeg/.test(contentType)) filename += '.mp3'
            else if (/application\/json/.test(contentType)) filename += '.json'
            else if (/text\/html/.test(contentType)) filename += '.html'
            else filename += '.bin'
        }

        if (/image\//.test(contentType)) {
            await conn.sendMessage(m.chat, { image: buffer, caption: `📸 *تفضل الصورة* \n> | *𝐺𝐴𝐴𝑅𝐴 𝐵𝑂𝑇 🧸*` }, { quoted: m })

        } else if (/video\//.test(contentType)) {
            await conn.sendMessage(m.chat, { video: buffer, caption: `🎥 *تفضل الفيديو يا أسطورة* \n> | *𝐺𝐴𝐴𝑅𝐴 𝐵𝑂𝑇 🧸*` }, { quoted: m })

        } else if (/audio\//.test(contentType)) {
            await conn.sendMessage(m.chat, { audio: buffer, mimetype: contentType }, { quoted: m })

        } else if (/text\/plain|application\/json|text\/javascript|application\/javascript|text\/html/.test(contentType)) {
            let str = buffer.toString('utf-8')
            
            if (/json/.test(contentType)) {
                try { str = JSON.stringify(JSON.parse(str), null, 2) } catch {}
            }

            if (str.length > 4000) {
                await conn.sendMessage(m.chat, { 
                    document: buffer, 
                    fileName: filename, 
                    mimetype: contentType 
                }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, { 
                    text: `\`\`\`${str}\`\`\``,
                    mentions: [m.sender]
                }, { quoted: m })
            }

        } else {
            await conn.sendMessage(m.chat, { 
                document: buffer, 
                fileName: filename, 
                mimetype: contentType || 'application/octet-stream'
            }, { quoted: m })
        } 

        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *خـطـأ فـي جـلـب الـرابـط:* ${e.message}`)
    }
}

handler.help = ['get']
handler.tags = ['tools']
handler.command = /^(get|api|fetch)$/i

export default handler