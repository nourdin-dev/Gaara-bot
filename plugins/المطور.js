import { createHash } from 'crypto'
import { canLevelUp, xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'
import fs from 'fs'
import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix }) => {
    const sock = conn || this;
    if (!sock ||!sock.user) return m.reply("❌ لم يتم العثور على كائن الاتصال الخاص بالواتساب.");

    // 🛡️ ضمان ان اليوزر موجود فالداتا بيز
    let who = m.sender
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = {
            exp: 0, limit: 10, level: 0, role: 'Beginner',
            registered: false, money: 0, joincount: 0,
            name: sock.getName(who) || 'مستخدم'
        }
    }
    let user = global.db.data.users[who];

    let d = new Date(new Date + 3600000)
    let locale = 'ar'
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    let {min, xp, max} = xpRange(user.level, global.multiplier)
    let math = max - xp
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

    let taguser = '@' + who.split('@')[0];
    let videoUrl = 'https://files.catbox.moe/nh4wu6.mp4';

    let str = `*_╮──══─┈•⤣🧸⤤•┈─══─╭_*
> _| *◠ ⿻ مرحبا يا ⌝${taguser}⌞_
> _| *◠ ⿻ الوقت : ⌝${uptime}⌞_
> _| *◠ ⿻ التاريخ : ⌝${date}⌞_
> _| *◠ ⿻ المستخدمين : ⌝${rtotalreg}⌞_
*_╯──══─┈•⤣🧸⤤•┈─══─╰_*

*معلومات المطور ↶*
*↜ اسـم الـمـطـور ☇ 🗿*
> |.𖦹 ๋࣭ ⿻ 𝅄  𝑁𝑜𝑢𝑟𝑑𝑖𝑛⚡
*لـقـب الـمـطـور ☇ 🖤*
> |.𖦹 ๋࣭ ⿻ 𝅄 𝑈𝑛𝑐𝑙𝑒 𝑛𝑜𝑢𝑟  🖤
*_🔗 رابط المراسلة المباشر ☇_*
> | https://wa.me/34672982032`.trim(); // شلت - من الرقم

    try {
        await sock.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: str,
            gifPlayback: true,
            footer: '𝐺𝑎𝑎𝑟𝑎 𝑏𝑜𝑡 🧸',
            mentions: [who]
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        return m.reply(`❌ حدث مشكلة أثناء إرسال لوحة المطور:\n${err.message}`);
    }
};

handler.help = ['المطور','مطور','owner']
handler.tags = ['main']
handler.command = /^(المطور|مطور|owner)$/i

export default handler

function clockString(ms) {
    let h = isNaN(ms)? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms)? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms)? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}