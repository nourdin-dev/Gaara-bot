import fs from 'fs';

import { fileTypeFromBuffer } from 'file-type';

const handler = async (m, { text, usedPrefix, command }) => {

  const allowedOwner = '34672982032';

  // التحقق من رقم المطور

  if (m.sender.split('@')[0] !== allowedOwner) {

    if (command === 'امسح') {

      return m.reply('*هاذا الامر مخصص لي نور فقط يا حبيبي ☘️🦋*');

    } else {

      return; // مايدير والو

    }

  }

  if (!text) throw `〘 ❗ 〙 يرجى إدخال اسم الملف`;

  const q = m.quoted || m;

  const mime = q.mimetype || '';

  const isTextMessage = q.text;

  const path = `plugins/${text}.js`;

  let isAdd = false;

  let isDel = false;

  let fileContent = '';

  switch (command) {

    case 'ضيف':

      if (!q || (!isTextMessage && !mime)) {

        throw `〘 ❗ 〙 يرجى الرد على رسالة نصية أو مستند ليتم حفظه كملف`;

      }

      try {

        if (isTextMessage) {

          fileContent = isTextMessage.trim();

          if (!fileContent) throw `〘 ❗ 〙 النص المستلم فارغ.`;

          fs.writeFileSync(path, fileContent, 'utf8');

          isAdd = true;

        } else if (mime === 'application/javascript') {

          const buffer = await q.download();

          fileContent = buffer.toString('utf8');

          if (!fileContent.trim()) throw `〘 ❗ 〙 الملف المرفق فارغ أو لا يحتوي على نصوص صالحة.`;

          fs.writeFileSync(path, fileContent, 'utf8');

          isAdd = true;

        } else {

          throw `〘 ❗ 〙 الملف المرفق غير مدعوم.`;

        }

      } catch (error) {

        throw `〘 ❗ 〙 حدث خطأ أثناء حفظ الملف: ${error.message || error}`;

      }

      break;

    case 'امسح':

      if (!fs.existsSync(path)) {

        throw `〘 ❗ 〙 الملف "${path}" غير موجود لحذفه`;

      }

      try {

        fs.unlinkSync(path);

        isDel = true;

      } catch (error) {

        throw `〘 ❗ 〙 حدث خطأ أثناء حذف الملف: ${error.message || error}`;

      }

      break;

    default:

      throw `〘 ❗ 〙 الأمر غير معروف

      استخدم أحد الأوامر التالية:

      - ${usedPrefix}ضيف

      - ${usedPrefix}امسح`;

  }

  if (isAdd) {

    m.reply(`〘 ✅ 〙 تم حفظ الملف بنجاح: "${path}"`);

  } else if (isDel) {

    m.reply(`〘 ✅ 〙 تم حذف الملف بنجاح: "${path}"`);

  }

};

handler.help = ['ضيف', 'امسح'];

handler.tags = ['owner'];

handler.command = ['ضيف', 'امسح'];

handler.owner = true;

export default handler;