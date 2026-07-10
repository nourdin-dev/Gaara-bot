import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ALLOWED_NUMBER = "34672982032@s.whatsapp.net"; // السماح فقط لهذا الرقم

const handler = async (m, { conn }) => {
    try {
        // التحقق من رقم المرسل
        if (m.sender !== ALLOWED_NUMBER) {
            await conn.sendMessage(m.chat, { text: `❌ *عذرًا، هذا الأمر مسموح به فقط لمالك البوت.*` }, { quoted: m });
            return;
        }

        // تحديد مسار الاسكربت (مجلد البوت)
        const botFolderPath = path.join(__dirname, '../');
        const zipFilePath = path.join(__dirname, '../bot_files.zip');

        // التحقق من وجود الملفات والمجلدات
        let initialMessage = await conn.sendMessage(m.chat, { text: `📂 جاري قراءة ملفات البوت...` }, { quoted: m });
        console.log(`Reading files from: ${botFolderPath}`);
        
        const files = fs.readdirSync(botFolderPath);
        
        if (files.length === 0) {
            console.log("No files to zip.");
            await conn.sendMessage(m.chat, { text: `🐺 لا توجد ملفات لضغطها.`, edit: initialMessage.key }, { quoted: m });
            return;
        }

        console.log(`Found ${files.length} files/folders. Proceeding to zip...`);
        let zippingMessage = await conn.sendMessage(m.chat, { text: `🔄 تم العثور على ${files.length} ملفات/مجلدات. جاري إنشاء ملف ZIP...`, edit: initialMessage.key }, { quoted: m });

        // إنشاء ملف ZIP مع استبعاد المجلدات .npm و node_modules
        const zipCommand = `zip -r "${zipFilePath}" . -x ".npm/*" "node_modules/*"`;
        console.log(`Executing command: ${zipCommand}`);
        let processingMessage = await conn.sendMessage(m.chat, { text: `يـتـم الاَن ضـغـط الـملـفـات... 🥷🏻`, edit: zippingMessage.key }, { quoted: m });

        exec(zipCommand, { cwd: botFolderPath }, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error creating zip: ${error.message}`);
                await conn.sendMessage(m.chat, { text: `❌ حدث خطأ أثناء إنشاء ملف ZIP: ${error.message}`, edit: processingMessage.key }, { quoted: m });
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                await conn.sendMessage(m.chat, { text: `🐺 تحذير: ${stderr}`, edit: processingMessage.key }, { quoted: m });
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.log(`Zip file created at: ${zipFilePath}`);

            // التحقق من وجود ملف الـ ZIP
            if (!fs.existsSync(zipFilePath)) {
                console.error("ZIP file not created.");
                await conn.sendMessage(m.chat, { text: `❌ لم يتم إنشاء ملف ZIP.`, edit: processingMessage.key }, { quoted: m });
                return;
            }

            // إرسال الملف بعد الإنشاء
            console.log(`Sending ZIP file to chat...`);
            let sendingMessage = await conn.sendMessage(m.chat, { text: `تـم انشـاء ملـف zip يـتـم الاَن ارسـاله... ✅`, edit: processingMessage.key }, { quoted: m });
            await conn.sendMessage(m.chat, {
                document: fs.readFileSync(zipFilePath),
                mimetype: 'application/zip',
                fileName: 'Gaara-bot@latest.zip'
            }, { quoted: m });

            // حذف الملف بعد إرساله
            fs.unlink(zipFilePath, async (err) => {
                if (err) {
                    console.error(`Error deleting zip file: ${err.message}`);
                    return;
                }
                console.log(`Zip file deleted: ${zipFilePath}`);
                await conn.sendMessage(m.chat, { text: `🗑️ تم حذف ملف ZIP بعد الإرسال.`, edit: sendingMessage.key }, { quoted: m });
            });
        });
    } catch (err) {
        console.error(`Failed to process bot files: ${err.message}`);
        await conn.sendMessage(m.chat, { text: `❌ فشل في معالجة ملفات البوت: ${err.message}`, edit: initialMessage.key }, { quoted: m });
    }
};

handler.help = ['getplugin'].map((v) => v + ' *<nombre>*');
handler.tags = ['owner'];
handler.command = /^(سكريبتي)$/i;
handler.owner = true;

export default handler;