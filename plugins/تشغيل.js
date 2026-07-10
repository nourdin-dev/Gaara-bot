import crypto from "crypto"
import axios from "axios"

class SaveTube {
  constructor() {
    this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12'
    this.m = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/
    this.is = axios.create({
      headers: {
        'content-type': 'application/json',
        'origin': 'https://yt.savetube.me',
        'user-agent': 'Mozilla/5.0 (Android 15; Mobile)'
      }
    })
  }

  async decrypt(enc) {
    const buf = Buffer.from(enc, 'base64')
    const key = Buffer.from(this.ky, 'hex')
    const iv = buf.slice(0, 16)
    const data = buf.slice(16)

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ])

    return JSON.parse(decrypted.toString())
  }

  async getCdn() {
    const res = await this.is.get("https://media.savetube.vip/api/random-cdn")
    return { status: true, data: res.data.cdn }
  }

  async download(url) {
    const id = url.match(this.m)?.[3]
    if (!id) throw "رابط يوتيوب غير صالح"

    const cdn = await this.getCdn()
    const info = await this.is.post(`https://${cdn.data}/v2/info`, {
      url: `https://www.youtube.com/watch?v=${id}`
    })

    const dec = await this.decrypt(info.data.data)

    const dl = await this.is.post(`https://${cdn.data}/download`, {
      id,
      downloadType: 'audio',
      quality: '128',
      key: dec.key
    })

    return {
      title: dec.title,
      duration: dec.durationLabel,
      thumb: dec.thumbnail,
      download: dl.data.data.downloadUrl
    }
  }
}

/* ================= المعالج المعدل لـ 𝑁𝑂𝑈𝑅 𝐷𝐸𝑉 ================= */

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return m.reply(
      `╮──══─┈•⤣⚡⤤•┈─══─╭\n*_طـريـقـة الاسـتـخـدام :_*\n${usedPrefix + command} https://youtu.be/...\n\n> .𓏲⋆˙𝑳𝑼𝑭𝑭𝒀҉͢ ͝ 𝑩𝜣𝑻 🖤\n╯──══─┈•⤣⚡⤤•┈─══─╰`
    )
  }

  const url = args[0]
  const st = new SaveTube()

  try {
    await m.react('📥')
    m.reply(`╮──══─┈•⤣⚡⤤•┈─══─╭\n> | *◠ ⿻ جـاري الـتحـميـل مقـطـع صـوتـي... 🖤\n╯──══─┈•⤣⚡⤤•┈─══─╰`)

    const res = await st.download(url)

    let caption = `╮──══─┈•⤣⚡⤤•┈─══─╭\n> | *◠ ⿻ 𝅄ٺــم أݪٺــحہّٰـمـيـــݪ*\n| *◠ ⿻ اسـم الاغــــنـــيه:* ${res.title} 🖤\n| *◠ ⿻ مـــدت الــــمـــقــــطــــ؏:* ${res.duration}\n| *◠ ⿻ الــــصــــيغــــه:* MP3\n\n> 𝑫𝑬𝑽: 𝑵𝑶𝑼𝑹 🖤\n╯──══─┈•⤣⚡⤤•┈─══─╰`

    await conn.sendMessage(m.chat, {
      audio: { url: res.download },
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: "𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥",
          body: res.title,
          thumbnailUrl: res.thumb,
          sourceUrl: url,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
    
    await m.react('✅')

  } catch (e) {
    console.error(e)
    m.reply(`❌ وقع خطأ أثناء التحميل، تأكد من الرابط.`)
  }
}

handler.help = ['صوت']
handler.command = ['تشغيل', 'song', 'audio']
handler.tags = ['download']

export default handler