import axios from 'axios';
import crypto from 'crypto';
import https from 'https';
import JSZip from 'jszip';

/* ========= إعدادات Pinterest ========= */
const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

const headers = {
  accept: "application/json, text/javascript, */*, q=0.01",
  referer: "https://www.pinterest.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "x-app-version": "a9522f",
  "x-pinterest-appstate": "active",
  "x-pinterest-pws-handler": "www/[username]/[slug].js",
  "x-requested-with": "XMLHttpRequest",
};

// 🚫 القائمة الموسعة لحظر الأسماء والمصطلحات غير الأخلاقية (+18)
const bannedWords = [
  // مصطلحات عامة
  'nsfw', 'hentai', 'ecchi', 'naked', 'sex', 'porn', '+18', '18+', 'عاري', 'جنس', 'سكس', 'مؤخرة', 'ثدي',
  'ass', 'pussy', 'boobs', 'rule34', 'undress', 'erotic', 'بورن', 'اباحي', 'إباحي', 'نيك', 'قذف', 'شذوذ', 'لواط',
  // أشهر الأسماء غير الأخلاقية والممثلات في هذا المجال
  'mia khalifa', 'mia kalifa', 'مايا خليفة', 'مايا خليفه', 
  'lana rhoades', 'لانا رودز', 
  'riley reid', 'رايلي ريد', 
  'angela white', 'أنجيلا وايت', 
  'eva elfie', 'إيفا إلفي', 
  'lisa ann', 'ليسا آن',
  'mia malkova', 'ميا مالكوفا',
  'dani daniels', 'داني دانيلز',
  'leah gotti', 'ليه غوتي',
  'sunny leone', 'ساني ليون'
];

async function getCookies() {
  try {
    const response = await axios.get(base);
    const setHeaders = response.headers["set-cookie"];
    if (setHeaders) {
      return setHeaders.map(v => v.split(";")[0]).join("; ");
    }
    return null;
  } catch {
    return null;
  }
}

async function searchPinterest(query) {
  try {
    const cookies = await getCookies();
    if (!cookies) return { status: false, message: "فشل جلب الكوكيز." };

    const params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query,
          scope: "pins",
          bookmarks: [""],
          page_size: 30, 
        },
        context: {},
      }),
      _: Date.now(),
    };

    const { data } = await axios.get(`${base}${search}`, {
      headers: { ...headers, cookie: cookies },
      params,
    });

    const results = data.resource_response.data.results.filter(
      v => v.images?.orig
    );

    if (!results.length)
      return { status: false, message: "لم يتم العثور على نتائج." };

    return {
      status: true,
      pins: results.map(v => ({
        id: v.id,
        image: v.images.orig.url,
      })),
    };
  } catch (e) {
    console.error('[Pinterest Error]', e.message);
    return { status: false, message: "حدث خطأ في البحث." };
  }
}

/* ========= دوال معالجة ورفع الحزمة للسيرفر الرسمي ========= */
function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

function toB64Url(buffer) {
    return Buffer.from(buffer)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

async function makeTrayWebp(buffer) {
    const sharpMod = await import('sharp').catch(() => null);
    if (!sharpMod?.default) throw new Error('يرجى تثبيت مكتبة sharp أولاً عبر:\nnpm i sharp');

    return await sharpMod.default(buffer, { animated: false })
        .resize(252, 252, { fit: 'cover' })
        .webp()
        .toBuffer();
}

async function makeStickerWebp(buffer) {
    const sharpMod = await import('sharp').catch(() => null);
    if (!sharpMod?.default) throw new Error('يرجى تثبيت مكتبة sharp أولاً عبر:\nnpm i sharp');

    return await sharpMod.default(buffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp()
        .toBuffer();
}

async function makeThumbnailJpeg(buffer) {
    const sharpMod = await import('sharp').catch(() => null);
    if (!sharpMod?.default) throw new Error('يرجى تثبيت مكتبة sharp أولاً عبر:\nnpm i sharp');

    return await sharpMod.default(buffer)
        .resize(252, 252, { fit: 'cover' })
        .jpeg()
        .toBuffer();
}

async function uploadToServer(conn, buffer, { hkdf, mediaPath, mediaKey = crypto.randomBytes(32) }) {
    const expanded = Buffer.from(
        crypto.hkdfSync('sha256', mediaKey, Buffer.alloc(32), Buffer.from(hkdf), 112),
    );

    const iv = expanded.subarray(0, 16);
    const cipherKey = expanded.subarray(16, 48);
    const macKey = expanded.subarray(48, 80);

    const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    const mac = crypto
        .createHmac('sha256', macKey)
        .update(iv)
        .update(encrypted)
        .digest()
        .subarray(0, 10);

    const encBuffer = Buffer.concat([encrypted, mac]);
    const fileEncSha256 = sha256(encBuffer);

    const iq = await conn.query({
        tag: 'iq',
        attrs: {
            id: conn.generateMessageTag?.() ?? Date.now().toString(),
            to: 's.whatsapp.net',
            type: 'set',
            xmlns: 'w:m',
        },
        content: [{ tag: 'media_conn', attrs: {} }],
    });

    const mediaConn = iq.content?.find(v => v.tag === 'media_conn');
    if (!mediaConn) throw new Error('media_conn tidak ditemukan');

    const auth = mediaConn.attrs?.auth;
    const hosts = (mediaConn.content || [])
        .filter(v => v.tag === 'host')
        .map(v => v.attrs?.hostname)
        .filter(Boolean);

    if (!hosts.length) throw new Error('host upload tidak ditemukan');

    const token = encodeURIComponent(
        fileEncSha256.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
    );

    for (const host of hosts) {
        try {
            const json = await new Promise((resolve, reject) => {
                const url = new URL(`https://${host}${mediaPath}/${token}?auth=${encodeURIComponent(auth)}&token=${token}`);
                const req = https.request({
                    hostname: url.hostname,
                    port: 443,
                    path: url.pathname + url.search,
                    method: 'POST',
                    headers: {
                        Origin: 'https://web.whatsapp.com',
                        Referer: 'https://web.whatsapp.com/',
                        'Content-Type': 'application/octet-stream',
                        'Content-Length': encBuffer.length,
                    },
                }, (res) => {
                    let body = '';
                    res.on('data', c => body += c);
                    res.on('end', () => {
                        if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error('Upload failed'));
                        resolve(JSON.parse(body));
                    });
                });
                req.on('error', reject);
                req.write(encBuffer);
                req.end();
            });

            const directPath = json.direct_path ?? json.directPath ?? json.url ?? json.path;
            if (directPath) return { mediaKey, fileLength: buffer.length, fileSha256: sha256(buffer), fileEncSha256, directPath, ...json };
        } catch {}
    }
    throw new Error('جميع محاولات الرفع للسيرفر فشلت');
}

/* ========= الأمر الرئيسي المدمج والمعدل ========= */
let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text)
    return m.reply(
      `╮──══─┈•⤣🧸⤤•┈─══─╭\n┊ مثال: *${usedPrefix + command} لوفي*\n╯──══─┈•⤣🧸⤤•┈─══─╰`
    );

  // 🛡️ تنظيف النص المكتوب وفحصه بالكامل لمنع التحايل بالمسافات
  const checkText = text.toLowerCase().trim().replace(/\s+/g, ' ');
  const isBanned = bannedWords.some(word => checkText.includes(word));

  if (isBanned) {
      await m.react('❌');
      return m.reply(`⚠️ *ممنوع استعمال هذه الكلمات!* \nيرجى البحث عن محتوى محترم ومناسب للجميع.`);
  }

  await m.react('⏳');

  // جلب الصور من Pinterest
  let result = await searchPinterest(text);
  if (!result.status) return m.reply(`[❌] ${result.message}`);

  // أخذ 30 صورة كحد أقصى للحزمة
  let pins = result.pins.slice(0, 30); 
  if (pins.length === 0) return m.reply('❌ لم يتم العثور على صور صالحة لصناعة الحزمة.');

  let stickersMetadata = [];
  const zip = new JSZip();

  // تنزيل الصور وتحويلها لملصقات داخل الـ Zip
  for (let i = 0; i < pins.length; i++) {
      try {
          let imgRes = await axios.get(pins[i].image, { responseType: 'arraybuffer' });
          let originalBuffer = Buffer.from(imgRes.data);
          
          // تحويل الصورة لملصق متوافق 512x512 وبصيغة WebP
          let stickerBuffer = await makeStickerWebp(originalBuffer);
          const fileName = `${toB64Url(sha256(stickerBuffer))}.webp`;

          zip.file(fileName, stickerBuffer);

          stickersMetadata.push({
              fileName,
              isAnimated: false,
              emojis: ['✨'],
              accessibilityLabel: '',
              isLottie: false,
              mimetype: 'image/webp',
          });
      } catch (err) {
          console.error(`فشل معالجة الصورة رقم ${i}:`, err.message);
      }
  }

  if (stickersMetadata.length === 0) return m.reply('❌ فشل تحويل الصور المستخرجة إلى ملصقات.');

  try {
      // تجهيز أيقونة الغلاف للحزمة (Tray Icon) من أول ملصق تم إنشاؤه
      let firstSticker = zip.file(stickersMetadata[0].fileName);
      let firstStickerBuffer = await firstSticker.async('nodebuffer');
      let trayBuffer = await makeTrayWebp(firstStickerBuffer);
      
      const trayIconFileName = 'tray_icon.webp';
      zip.file(trayIconFileName, trayBuffer);

      // ضغط الحزمة بالكامل
      const archive = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' });

      // رفع ملف الـ Zip والأيقونة إلى سيرفر الواتساب الرسمي
      const packUpload = await uploadToServer(conn, archive, {
          hkdf: 'WhatsApp Sticker Pack Keys',
          mediaPath: '/mms/sticker-pack',
      });

      const thumbnailBuffer = await makeThumbnailJpeg(trayBuffer);
      const thumbUpload = await uploadToServer(conn, thumbnailBuffer, {
          hkdf: 'WhatsApp Sticker Pack Thumbnail Keys',
          mediaPath: '/mms/thumbnail-sticker-pack',
          mediaKey: packUpload.mediaKey,
      });

      // إرسال الحزمة محقونة بالحقوق الرسمية المطلوبة بدقة
      await conn.relayMessage(
          m.chat,
          {
              messageContextInfo: { messageSecret: crypto.randomBytes(32) },
              stickerPackMessage: {
                  stickerPackId: 'Pack_' + crypto.randomBytes(8).toString('hex'),
                  name: '𝐺𝑎𝑎𝑟𝑎 𝑏𝑜𝑡 🖤🦇', 
                  publisher: 'ᴺᵒᵘʳ ᴰᵉᵛ ↯˹<\>˼↯', 
                  packDescription: 'مجموعه ملصقات مكونه من 30', 

                  stickers: stickersMetadata,
                  fileLength: packUpload.fileLength,
                  fileSha256: packUpload.fileSha256,
                  fileEncSha256: packUpload.fileEncSha256,
                  mediaKey: packUpload.mediaKey,
                  directPath: packUpload.directPath,
                  mediaKeyTimestamp: Math.floor(Date.now() / 1000),
                  stickerPackSize: packUpload.fileLength,
                  stickerPackOrigin: 2,
                  trayIconFileName,
                  thumbnailDirectPath: thumbUpload.directPath,
                  thumbnailSha256: thumbUpload.fileSha256,
                  thumbnailEncSha256: thumbUpload.fileEncSha256,
                  thumbnailHeight: 252,
                  thumbnailWidth: 252,
                  imageDataHash: thumbUpload.fileSha256.toString('base64'),
              },
          },
          { quoted: m }
      );

      await m.react('✅');

  } catch (e) {
      console.error(e);
      await m.react('❌');
      m.reply(`❌ فشل إرسال الحزمة الكلية: ${e.message}`);
  }
};

handler.help    = ['حزمه <الاسم>'];
handler.tags    = ['sticker'];
handler.command = /^(حزمه|حزمة)$/i;

export default handler;
