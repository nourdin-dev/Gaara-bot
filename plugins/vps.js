import { Client } from 'ssh2'
import fs from 'fs'

// 🔑 معلومات الـ VPS البعيد اللي غنتحكمو فيه عن بعد
const vpsConfig = {
    host: 'ssh-nourdin-dev.alwaysdata.net',
    port: 22,
    username: 'nourdin-dev',
    password: 'nour202422'
}

// دالة (Function) لتنفيذ الأوامر عبر SSH عن بعد
const runRemoteCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        const conn = new Client()
        conn.on('ready', () => {
            conn.exec(cmd, (err, stream) => {
                if (err) { conn.end(); return reject(err); }
                let stdout = '', stderr = ''
                stream.on('close', (code, signal) => {
                    conn.end()
                    resolve({ stdout, stderr })
                }).on('data', (data) => {
                    stdout += data.toString()
                }).stderr.on('data', (data) => {
                    stderr += data.toString()
                })
            })
        }).on('error', (err) => reject(err)).connect(vpsConfig)
    })
}

// دالة لجلب وتحميل الملف المضغوط من السيرفر البعيد عبر SFTP
const downloadRemoteFile = (remotePath, localPath) => {
    return new Promise((resolve, reject) => {
        const conn = new Client()
        conn.on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) { conn.end(); return reject(err); }
                sftp.fastGet(remotePath, localPath, (downloadErr) => {
                    conn.end()
                    if (downloadErr) reject(downloadErr)
                    else resolve()
                })
            })
        }).on('error', (err) => reject(err)).connect(vpsConfig)
    })
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let action = args[0] ? args[0].toLowerCase() : ''

    // القائمة الرئيسية ف الواتساب
    if (!action) {
        let menuText = `💻 *لوحة التحكم عن بُعد في الـ VPS* 💻\n\n`
        menuText += `السيرفر المتصل به:\n\`${vpsConfig.host}\`\n\n`
        menuText += `📊 *معلومات السيرفر:* \`${usedPrefix + command} info\`\n`
        menuText += `📦 *جلد وضغط كل الملفات:* \`${usedPrefix + command} zip\`\n`
        menuText += `⚙️ *العمليات الشغالة:* \`${usedPrefix + command} proc\`\n`
        menuText += `📂 *المسارات والملفات:* \`${usedPrefix + command} ls\`\n`
        menuText += `💻 *تنفيذ أمر تيرمينال حُر:* \`${usedPrefix + command} cmd [الأمر]\`\n\n`
        menuText += `_يمكنك استخدام الأزرار أسفله للتحكم السريع:_`

        const buttons = [
            { buttonId: `${usedPrefix + command} info`, buttonText: { displayText: '📊 معلومات الـ VPS' }, type: 1 },
            { buttonId: `${usedPrefix + command} zip`, buttonText: { displayText: '📦 ضغط وجلب الملفات' }, type: 1 },
            { buttonId: `${usedPrefix + command} proc`, buttonText: { displayText: '⚙️ العمليات الشغالة' }, type: 1 }
        ]

        return await conn.sendMessage(m.chat, { 
            text: menuText,
            buttons: buttons,
            headerType: 1
        }, { quoted: m })
    }

    // 1️⃣ معلومات الـ VPS عن بعد
    if (action === 'info') {
        m.reply('⏳ جاري الاتصال بالـ VPS البعيد وجلب البيانات...')
        try {
            const { stdout } = await runRemoteCommand('uptime -p && free -h && df -h')
            let res = `📊 *معلومات الـ VPS البعيد:*\n\n\`\`\`\n${stdout}\n\`\`\``
            m.reply(res)
        } catch (err) {
            m.reply(`❌ خطأ SSH: ${err.message}`)
        }
    }

    // 2️⃣ ضغط وجلد الملفات من السيرفر البعيد وإرسالها
    else if (action === 'zip') {
        m.reply('⏳ جاري الاتصال بالـ VPS وضغط الملفات هناك... (استثناء node_modules)')
        const zipName = `vps_backup_${Date.now()}.zip`
        const remoteZipPath = `./${zipName}` // مكان الحفظ ف السيرفر البعيد
        const localZipPath = `./${zipName}`  // مكان الحفظ المؤقت ف سيرفر البوت

        try {
            // تنفيذ أمر الضغط ف السيرفر البعيد
            await runRemoteCommand(`zip -r ${zipName} . -x "node_modules/*" ".git/*" "*.zip"`)
            m.reply('✅ تم الضغط بنجاح ف السيرفر البعيد! جاري تحميل الملف للواتساب...')
            
            // تحميل الملف عبر SFTP لسيرفر البوت
            await downloadRemoteFile(remoteZipPath, localZipPath)
            
            // إرسال الملف ف الواتساب
            await conn.sendMessage(m.chat, { 
                document: fs.readFileSync(localZipPath), 
                mimetype: 'application/zip', 
                fileName: zipName 
            }, { quoted: m })

            // تنظيف السيرفرين (حذف ملف الـ zip من الجوج بلايص باش ميعمروش السيرفرات)
            fs.unlinkSync(localZipPath) // مسحو من سيرفر البوت
            await runRemoteCommand(`rm ${zipName}`) // مسحو من الـ VPS البعيد
            
        } catch (err) {
            m.reply(`❌ خطأ أثناء العملية: ${err.message}`)
            if (fs.existsSync(localZipPath)) fs.unlinkSync(localZipPath)
        }
    }

    // 3️⃣ العمليات الشغالة ف السيرفر البعيد
    else if (action === 'proc') {
        m.reply('⏳ جاري فحص العمليات النشطة عن بُعد...')
        try {
            const { stdout } = await runRemoteCommand('ps aux --sort=-%cpu | head -n 15')
            m.reply(`⚙️ *أعلى العمليات استهلاكاً للـ CPU ف الـ VPS:*\n\n\`\`\`\n${stdout}\n\`\`\``)
        } catch (err) {
            m.reply(`❌ خطأ SSH: ${err.message}`)
        }
    }

    // 4️⃣ المسارات والملفات ف السيرفر البعيد
    else if (action === 'ls') {
        m.reply('⏳ جاري قراءة الملفات عن بُعد...')
        try {
            const { stdout } = await runRemoteCommand('pwd && ls -la')
            m.reply(`📂 *المسار الحالي وقائمة ملفات الـ VPS:*\n\n\`\`\`\n${stdout}\n\`\`\``)
        } catch (err) {
            m.reply(`❌ خطأ SSH: ${err.message}`)
        }
    }

    // 5️⃣ تنفيذ أمر تيرمينال حُر (Terminal $)
    else if (action === 'cmd') {
        let cmdText = args.slice(1).join(' ')
        if (!cmdText) return m.reply(`❌ اكتب الأمر اللي بغيتي تنفذو.\nمثال:\n\`${usedPrefix + command} cmd pm2 status\``)

        m.reply(`⏳ جاري تنفيذ الأمر عن بُعد عبر SSH...`)
        try {
            const { stdout, stderr } = await runRemoteCommand(cmdText)
            let result = `💻 *الأمر المنفذ عن بعد:* \`${cmdText}\`\n\n`
            if (stderr) {
                result += `⚠️ *تنبيه:* \`\`\`\n${stderr}\n\`\`\``
            } else {
                result += `✅ *النتيجة:* \`\`\`\n${stdout || 'تم بنجاح (لا يوجد مخرج ناصي)'}\n\`\`\``
            }
            m.reply(result)
        } catch (err) {
            m.reply(`❌ خطأ SSH: ${err.message}`)
        }
    }
}

// 🛡️ إعدادات الكومند والحماية الصارمة
handler.help = ['vps']
handler.tags = ['owner']
handler.command = /^(vps|panel|control)$/i

// تفعيل الحماية للملاك فقط
handler.owner = true
handler.rowner = true

export default handler