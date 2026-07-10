import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
import { getDevice } from '@whiskeysockets/baileys'

// دالــة الــتــرجــمـة مـع قــيــمـة افــتــراضــيــة
const tr = (text) => text || "نـص افــتــراضــي";

const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = "CkphZGlib3QsIEhlY2hv"
let drm2 = "IHBvciBAQWlkZW5fTm90TG9naWM"
let rtx = `
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*
*⃝🌑┆📱 اســتــخــدم هــذا الــكــود لــتــصــبــح بــوت فــرعــي*
*⃝🌙┆📋 الــخــطــوات كــالــتــالــي*
*⃝🌑┆🔹 اضــغــط عــلــى الــثــلاث نـقــاط*
*⃝🌙┆🔹 اضــغــط عــلــى الأجــهــزة الــمـرتــبــطــة*
*⃝🌑┆🔹 امـســح الـرمز هــذا*
*⃝🌙┆⚠️ هــذا الـرمز يــعــمـل فــقــط*
*⃝🌑┆⚠️ عــلــى الــرقــم الــذي طــلــبــه*
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*

𝐿𝑈𝐹𝐹𝑌 𝐵𝑂𝑇 🕷⃝⃕𝆺𝅥𝆹َ𝅥`

let rtx2 = `
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*
*⃝🌑┆📱 اســتــخــدم هــذا الــكــود لــتــصــبــح بــوت فــرعــي*
*⃝🌙┆📋 الــخــطــوات كــالــتــالــي*
*⃝🌑┆🔹 اضــغــط عــلــى الــثــلاث نـقــاط*
*⃝🌙┆🔹 اضــغــط عــلــى الأجــهــزة الــمـرتــبــطــة*
*⃝🌑┆🔹 اخــتــر ربــط مـع رقــم الــهــاتــف*
*⃝🌙┆🔹 اكــتــب الــكــود*
*⃝🌑┆⚠️ هــذا الــكــود يــعــمـل فــقــط*
*⃝🌙┆⚠️ عــلــى الــرقــم الــذي طــلــبــه*
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*

𝐿𝑈𝐹𝐹𝑌 𝐵𝑂𝑇 🕷⃝⃕𝆺𝅥𝆹َ𝅥`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gaaraJBOptions = {}
const retryMap = new Map()
const maxAttempts = 5
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, {conn, args, usedPrefix, command, isOwner, text}) => {
if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`)
// السماح لكل البوتات الفرعية بالرد على الرسائل
// فقط تجاهل الرسائل من البوت نفسه لتجنب الرد على نفسه
if (conn.user.jid === m.sender) return
//if (conn.user.jid !== global.conn.user.jid) return conn.reply(m.chat, `${lenguajeGB['smsJBPrincipal']()} wa.me/${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}`, m)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${text ? text.replace(/\D/g, '') : who.split`@`[0]}` //conn.getName(who)
let pathLuffyJadiBot = path.join('./luffyjadibot/', id)
if (!fs.existsSync(pathLuffyJadiBot)) {
fs.mkdirSync(pathLuffyJadiBot, {recursive: true})
}
gaaraJBOptions.pathLuffyJadiBot = pathLuffyJadiBot
gaaraJBOptions.m = m
gaaraJBOptions.conn = conn
gaaraJBOptions.args = args
gaaraJBOptions.usedPrefix = usedPrefix
gaaraJBOptions.command = command
gaaraJBOptions.fromCommand = true
gaaraJadiBot(gaaraJBOptions, text)
}
// تعديل الأمر ليشمل .code بدون التأثير على code
handler.command = /^(jadibot|serbot|rentbot|code)$/i
export default handler

export async function gaaraJadiBot(options, text) {
let {pathLuffyJadiBot, m, conn, args, usedPrefix, command} = options

// التحقق من الأمر وضبط الوسائط بناءً عليه
if (command === 'code') {
    // إذا كان الأمر code، أضف --code للوسائط
    if (!args.includes('code') && !args.includes('--code')) {
        args.unshift('--code');
    }
} else if (command === 'code') {
    // إذا كان الأمر code، حوله لـ jadibot مع code
    command = 'jadibot';
    if (!args.includes('code') && !args.includes('--code')) {
        args.unshift('--code');
    }
}

const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, '').trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, '').trim()
if (args[0] == '') args[0] = undefined
}
const pathCreds = path.join(pathLuffyJadiBot, 'creds.json')
if (!fs.existsSync(pathLuffyJadiBot)) {
fs.mkdirSync(pathLuffyJadiBot, {recursive: true})
}
try {
args[0] && args[0] != undefined
? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], 'base64').toString('utf-8')), null, '\t'))
: ''
} catch {
conn.reply(m.chat, `*استخدم الأمر بشكل صحيح:* \`${usedPrefix + command} code\``, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, 'base64')
exec(comb.toString('utf-8'), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, 'base64')

let {version, isLatest} = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => {}
const msgRetryCache = new NodeCache()
const {state, saveState, saveCreds} = await useMultiFileAuthState(pathLuffyJadiBot)

const connectionOptions = {
logger: pino({level: 'fatal'}),
printQRInTerminal: false,
auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'}))},
msgRetry,
msgRetryCache,
browser: mcode ? ['Windows', 'Chrome', '110.0.5585.95'] : ['LuffyBot-MD (Sub Bot)', 'Chrome', '2.0.0'],
version: version,
generateHighQualityLinkPreview: true
}

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true
let reconnectAttempts = 0

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin, qr} = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(
m.chat,
{image: await qrcode.toBuffer(qr, {scale: 8}), caption: rtx.trim() + '\n' + drmer.toString('utf-8')},
{quoted: m}
)
} else {
return
}
if (txtQR && txtQR.key) {
setTimeout(() => {
conn.sendMessage(m.sender, {delete: txtQR.key})
}, 30000)
}
return
}
if (qr && mcode) {
//let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
let fixTe = text ? text.replace(/\D/g, '') : m.sender.split('@')[0]
let secret = await sock.requestPairingCode(fixTe)
secret = secret.match(/.{1,4}/g)?.join('-')
const dispositivo = await getDevice(m.key.id)
if (!m.isWABusiness) {
if (/web|desktop|unknown/i.test(dispositivo)) {
txtCode = await conn.sendMessage(
m.chat,
{
image: {url: 'https://s7.ezgif.com/tmp/ezgif-7905c1c9baa94fbc.jpg' || gaaraMenu.getRandom()},
caption: rtx2.trim() + '\n' + drmer.toString('utf-8')
},
{quoted: m}
)
codeBot = await m.reply(secret)
} else {
txtCode = await conn.sendButton(
m.chat,
rtx2.trim() + '\n' + drmer.toString('utf-8'),
wm + `\n*الــكــود 🌑:* ${secret}`,
'https://files.catbox.moe/jkmzup.jpg' || 'https://files.catbox.moe/jkmzup.jpg',
null,
[['🌙 نسـخ الـكـود 🌙', secret]],
null,
null,
m
)
}
} else {
txtCode = await conn.sendMessage(
m.chat,
{
image: {url: 'https://h.uguu.se/GUHtpVKY.jpg' || gaaraMenu.getRandom()},
caption: rtx2.trim() + '\n' + drmer.toString('utf-8')
},
{quoted: m}
)
codeBot = await m.reply(secret)
}
console.log(secret)
}
if ((txtCode && txtCode.key) || (txtCode && txtCode.id)) {
const messageId = txtCode.key || txtCode.id
setTimeout(() => {
conn.sendMessage(m.sender, {delete: messageId})
}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => {
conn.sendMessage(m.sender, {delete: codeBot.key})
}, 30000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}
}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
if (reconnectAttempts < maxAttempts) {
const delay = 1000 * Math.pow(2, reconnectAttempts)
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathLuffyJadiBot)}) fue cerrada inesperadamente. Intentando reconectar en ${delay / 1000} segundos... (Intento ${reconnectAttempts + 1}/${maxAttempts})\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
await sleep(1000)
await creloadHandler(true).catch(console.error)
} else {
console.log(chalk.redBright(`Sub-bot (+${path.basename(pathLuffyJadiBot)}) agotó intentos de reconexión. intentando más tardes...`))
}
/*console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathLuffyJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)*/
}
if (reason === 408) {
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathLuffyJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathLuffyJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
try {
if (options.fromCommand)
m?.chat
? await conn.sendMessage(
m.chat,
{
text: '> *لقد تم اكتشاف جلسة جديدة. احذف الجلسة القديمه للمتابعة*'
},
{quoted: m || null}
)
: ''
} catch (error) {
console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathLuffyJadiBot)}`))
}
}
if (reason == 405 || reason == 401) {
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathLuffyJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
try {
if (options.fromCommand)
m?.isGroup
? await conn.sendMessage(
m.chat,
{text: '*🟢 الجــلســه معلـقه*\n\n> *حاولتُ يدويًا العودة إلى البوت الفرعي*'},
{quoted: m}
)
: ''
} catch (error) {
console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathLuffyJadiBot)}`))
}
fs.rmdirSync(pathLuffyJadiBot, {recursive: true})
}
if (reason === 500) {
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathLuffyJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)

if (options.fromCommand) {
m?.isGroup
? await conn.sendMessage(
m.chat,
{text: '*انقــطع الاتـــصال*\n\n> *حاولتُ يدويًا العودة إلى البوت الفرعي*'},
{quoted: m}
)
: ''
}
//fs.rmdirSync(pathLuffyJadiBot, { recursive: true })
}
if (reason === 515) {
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathLuffyJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(
chalk.bold.magentaBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathLuffyJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
fs.rmdirSync(pathLuffyJadiBot, {recursive: true})
}
}

if (global.db.data == null) loadDatabase()
if (connection == 'open') {
reconnectAttempts = 0
if (!global.db.data?.users) loadDatabase()
let userName, userJid
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathLuffyJadiBot)}@s.whatsapp.net`
console.log(
chalk.bold.cyanBright(
`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathLuffyJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`
)
)
sock.isInit = true
global.conns.push(sock)

let user = global.db.data?.users[`${path.basename(pathLuffyJadiBot)}@s.whatsapp.net`]
if (m?.chat) {
// رسالة الاتصال الناجح بنفس الزخرفة
await conn.sendMessage(
m.chat,
{
text: `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n*⃝🌑┆✅ تــم الاتــصــال بــنـجــاح*\n*⃝🌙┆📱 الــرقــم:* ${path.basename(pathLuffyJadiBot)}\n*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n>  | .𖦹 ๋࣭  ⿻   𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥`,
contextInfo: {
forwardingScore: 999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: '120363400800862279@newsletter',
newsletterName: '𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥',
serverMessageId: -1
}
}
},
{quoted: m}
)
}
let chtxt = `*الاتصال بنجاح ✅*\n\n*👤 المستخدم:* ${userName}\n*📞 الرقم:* ${path.basename(pathLuffyJadiBot)}`.trim()
let ppch = await sock.profilePictureUrl(userJid, 'image').catch((_) => gaaraMenu)
await sleep(3000)
await global.conn.sendMessage(
ch.ch1,
{
text: chtxt,
contextInfo: {
externalAdReply: {
title: '【 🔔 إشعار عام 🔔 】',
body: '🌙 تم العثور على روبوت فرعي جديد',
thumbnailUrl: ppch,
sourceUrl: accountsgb,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}
}
},
{quoted: null}
)
await joinChannels(sock)
}
}
setInterval(async () => {
if (!sock.user) {
try {
sock.ws.close()
} catch (e) {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}
}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error('Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try {
sock.ws.close()
} catch {}
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
sock.ev.off('messages.upsert', sock.handler)
sock.ev.off('group-participants.update', sock.participantsUpdate)
sock.ev.off('groups.update', sock.groupsUpdate)
sock.ev.off('message.delete', sock.onDelete)
sock.ev.off('call', sock.onCall)
sock.ev.off('connection.update', sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.participantsUpdate = handler.participantsUpdate.bind(sock)
sock.groupsUpdate = handler.groupsUpdate.bind(sock)
sock.onDelete = handler.deleteUpdate.bind(sock)
sock.onCall = handler.callUpdate.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)

sock.ev.on('messages.upsert', sock.handler)
sock.ev.on('group-participants.update', sock.participantsUpdate)
sock.ev.on('groups.update', sock.groupsUpdate)
sock.ev.on('message.delete', sock.onDelete)
sock.ev.on('call', sock.onCall)
sock.ev.on('connection.update', sock.connectionUpdate)
sock.ev.on('creds.update', sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise((resolve) => setTimeout(resolve, ms))
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}
}

async function checkSubBots() {
const subBotDir = path.resolve('./HixJadiBot')
if (!fs.existsSync(subBotDir)) return
const subBotFolders = fs.readdirSync(subBotDir).filter((folder) => fs.statSync(path.join(subBotDir, folder)).isDirectory())

for (const folder of subBotFolders) {
const pathLuffyJadiBot = path.join(subBotDir, folder)
const credsPath = path.join(pathLuffyJadiBot, 'creds.json')
const subBot = global.conns.find((conn) => conn.user?.jid?.includes(folder) || path.basename(pathLuffyJadiBot) === folder)

if (!fs.existsSync(credsPath)) {
console.log(
chalk.bold.yellowBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folder}) no tiene creds.json. Omitiendo...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
continue
}

if (!subBot || !subBot.user) {
console.log(
chalk.bold.yellowBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folder}) no está conectado o fue añadido recientemente. Intentando activarlo...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
const retries = retryMap.get(folder) || 0
if (retries >= 5) {
console.log(
chalk.redBright(
`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folder}) alcanzó límite de reintentos.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`
)
)
retryMap.delete(folder)
continue
}

try {
await gaaraJadiBot({
pathLuffyJadiBot,
m: null,
conn: global.conn,
args: [],
usedPrefix: '#',
command: 'jadibot',
fromCommand: false
})
retryMap.delete(folder)
} catch (e) {
console.error(chalk.redBright(`Error al activar sub-bot (+${folder}):`), e)
retryMap.set(folder, retries + 1)
}
}
}
}

setInterval(checkSubBots, 1800000)
