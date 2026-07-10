const handler = async (m, { conn, args, usedPrefix, command }) => {
   try {
      const colorNames = {
         red: 'FFFF0000', green: 'FF00FF00', blue: 'FF0000FF', black: 'FF000000',
         white: 'FFFFFFFF', yellow: 'FFFFFF00', orange: 'FFFFA500', pink: 'FFFF69B4',
         purple: 'FF800080', grey: 'FF808080', neon_green: 'FF39FF14', neon_blue: 'FF00FFFF',
         neon_pink: 'FFFF007F', neon_purple: 'FFBC13FE', neon_yellow: 'FFE7FE00', neon_red: 'FFFF3131',
         dark: 'FF121212', blood: 'FF880808', navy: 'FF000080', charcoal: 'FF36454F',
         midnight: 'FF191970', forest: 'FF0B6623', wine: 'FF722F37', chocolate: 'FF1B1212',
         gold: 'FFFFD700', silver: 'FFC0C0C0', platinum: 'FFE5E4E2', bronze: 'FFCD7F32',
         emerald: 'FF50C878', ruby: 'FFE0115F', sapphire: 'FF0F52BA', royal: 'FF4169E1',
         mint: 'FF98FB98', baby_blue: 'FF89CFF0', lavender: 'FFE6E6FA', peach: 'FFFFE5B4',
         salmon: 'FFFA8072', cream: 'FFFFFDD0', sky: 'FF87CEEB', rose: 'FFFF66CC',
         cyan: 'FF00FFFF', teal: 'FF008080', turquoise: 'FF40E0D0', indigo: 'FF4B0082',
         magenta: 'FFFF00FF', violet: 'FFEE82EE', crimson: 'FFDC143C', coral: 'FFFF7F50',
         khaki: 'FFF0E68C', tan: 'FFD2B48C', sienna: 'FFA0522D', olive: 'FF808000',
         plum: 'FF673147', apricot: 'FFFBCEB1', amber: 'FFFFBF00',
         wa_dark: 'FF075E54', wa_light: 'FF128C7E', wa_bg: 'FF0B141A'
      }

      const parseColor = (input, def) => {
         if (!input) return def
         const c = input.toLowerCase()
         if (colorNames[c]) return parseInt(colorNames[c], 16) >>> 0
         if (/^#?[0-9a-fA-F]{6,8}$/.test(input)) {
            let h = input.replace('#', '').toUpperCase()
            if (h.length === 6) h = 'FF' + h
            return parseInt(h, 16) >>> 0
         }
         return def
      }

      const getQuotedText = (q) => {
         if (!q) return ''
         const unwrap = (msg) => {
            if (!msg || typeof msg !== 'object') return msg
            if (msg.ephemeralMessage?.message) return unwrap(msg.ephemeralMessage.message)
            if (msg.viewOnceMessage?.message) return unwrap(msg.viewOnceMessage.message)
            return msg
         }
         const msg = unwrap(q?.message || q?.msg?.message || q?.msg || q)
         const candidates = [q?.text, q?.caption, msg?.conversation, msg?.extendedTextMessage?.text]
         return candidates.find(v => typeof v === 'string' && v.trim())?.trim() || ''
      }

      // عرض قائمة الألوان
      if (args[0] === 'colors' || args[0] === 'الوان') {
         let txt = `🎨 كل الألوان [${Object.keys(colorNames).length}]\n\n`
         Object.keys(colorNames).forEach((c, i) => {
            txt += `• ${c} `
            if ((i + 1) % 3 === 0) txt += '\n'
         })
         txt += `\n\nمثال:\n${usedPrefix + command} white red hello\n${usedPrefix + command} #FFFFFF #FF0000 hello`
         return conn.reply(m.chat, txt, m)
      }

      // استخراج الرسالة المقتبسة بشكل خام لمعرفة إذا كانت ميديا (صورة/فيديو/ستيكر/صوت)
      let quotedRaw = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

      // فك تغليف رسائل الـ View Once لو كانت موجودة
      if (quotedRaw && (quotedRaw.viewOnceMessage || quotedRaw.viewOnceMessageV2)) {
         quotedRaw = quotedRaw.viewOnceMessage?.message || quotedRaw.viewOnceMessageV2?.message
      }

      const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage']
      const quotedMediaType = quotedRaw ? Object.keys(quotedRaw).find(k => mediaTypes.includes(k)) : null

      await conn.sendMessage(m.chat, { react: { text: '🛰️', key: m.key } })

      // 1️⃣ حالة إذا كان الريبلاي على ميديا
      if (quotedMediaType) {
         // أخذ نسخة عميقة من الميديا عشان نعدل عليها براحتنا بدون مشاكل
         let mediaPayload = { [quotedMediaType]: JSON.parse(JSON.stringify(quotedRaw[quotedMediaType])) }

         // لو كتب نص مع الأمر، هنعتبره كابشن للميديا
         let customCaption = args.join(' ').trim()

         // إضافة الكابشن للصور والفيديوهات فقط
         if (['imageMessage', 'videoMessage'].includes(quotedMediaType) && customCaption) {
            mediaPayload[quotedMediaType].caption = customCaption
         }

         // حقن خصائص الستوري في الـ contextInfo بتاع الميديا
         mediaPayload[quotedMediaType].contextInfo = {
            ...(mediaPayload[quotedMediaType].contextInfo || {}),
            forwardingScore: 0,
            featureEligibilities: {
               canBeReshared: true,
               canReceiveMultiReact: true
            },
            statusSourceType: 4,
            statusAttributions: [{ type: 10 }],
            statusAudienceMetadata: { audienceType: 1 }
         }

         await conn.relayMessage(m.chat, {
            groupStatusMessageV2: {
               message: mediaPayload
            }
         }, { messageId: conn.generateMessageTag() })

         await conn.reply(m.chat, `✅ تم نشر الميديا كحالة بنجاح`, m)
         return await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      }

      // 2️⃣ حالة النص العادي
      let textColor = parseColor(args[0], 0xFFFFFFFF) // default أبيض
      let bgColor = parseColor(args[1], parseInt('FF121212', 16) >>> 0) // default دارك

      let statusText = args.slice(2).join(' ').trim() || getQuotedText(m.quoted)

      // لو كتب لون واحد بس، نخليه خلفية والنص أبيض
      if (args.length === 2 && !statusText) {
         bgColor = parseColor(args[0], 0xFFFFFFFF)
         textColor = 0xFFFFFFFF
      }

      if (!statusText) {
         return conn.reply(m.chat, `❌ الاستخدام:\n${usedPrefix + command} white red Hello\n${usedPrefix + command} #FFFFFF #FF0000 Hello\nأو اعمل ريبلاي على نص أو ميديا`, m)
      }

      await conn.relayMessage(m.chat, {
         groupStatusMessageV2: {
            message: {
               extendedTextMessage: {
                  text: statusText,
                  textArgb: textColor, // لون النص
                  backgroundArgb: bgColor, // لون دائرة الخلفية
                  font: 5,
                  previewType: 0,
                  contextInfo: {
                     forwardingScore: 0,
                     featureEligibilities: {
                        canBeReshared: true,
                        canReceiveMultiReact: true
                     },
                     statusSourceType: 4,
                     statusAttributions: [{ type: 10 }],
                     statusAudienceMetadata: { audienceType: 1 }
                  },
                  inviteLinkGroupTypeV2: 0
               }
            }
         }
      }, { messageId: conn.generateMessageTag() })

      await conn.reply(m.chat, `✅ تم النشر\n📝 لون النص: ${textColor.toString(16).toUpperCase()}\n🎨 لون الخلفية: ${bgColor.toString(16).toUpperCase()}`, m)
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

   } catch (e) {
      console.error(e)
      conn.reply(m.chat, `❌ ${e.message}`, m)
   }
}

handler.command = ['حالة']
handler.tags = ['owner']
handler.help = ['حالة2 <لون_النص> <لون_الخلفية> <النص>']
handler.owner = false

export default handler
