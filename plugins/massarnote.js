import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import * as cheerio from 'cheerio';

// ═══════════════════════════════════════
//        ⚙️ الإعدادات العامة
// ═══════════════════════════════════════
const CONFIG = {
  baseUrl: 'https://massarservice.men.gov.ma/moutamadris',
  loginPath: '/Account',
  notesPath: '/TuteurEleves/GetNotesEleve',
  bulletinsPath: '/TuteurEleves/GetBulletins',
  requestTimeout: 20000,
  sessionTTL: 30 * 60 * 1000, // نصمسح الجلسة بعد 30 دقيقة ديال عدم الاستعمال
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
};

// خزان الجلسات لكل مستخدم (userId -> session)
const massarSessions = new Map();

// ═══════════════════════════════════════
//        🧩 دوال مساعدة
// ═══════════════════════════════════════

// كنبنيو axios instance بـ cookie jar خاص بكل مستخدم
function createClient() {
  const jar = new CookieJar();
  const client = wrapper(
    axios.create({
      jar,
      withCredentials: true,
      timeout: CONFIG.requestTimeout,
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Accept-Language': 'ar,fr;q=0.9,en;q=0.8'
      },
      validateStatus: () => true // نتعاملو حتى مع status غير 200 يدويا
    })
  );
  return { jar, client };
}

// جلب __RequestVerificationToken من صفحة تسجيل الدخول
async function getLoginToken(client) {
  const res = await client.get(`${CONFIG.baseUrl}${CONFIG.loginPath}`);
  const $ = cheerio.load(res.data);
  const token = $('input[name="__RequestVerificationToken"]').attr('value');
  if (!token) throw new Error('ما قدرتش نلقى __RequestVerificationToken، الموقع تبدل شكلا.');
  return token;
}

// تسجيل الدخول
async function massarLogin(client, email, password) {
  const token = await getLoginToken(client);

  const form = new URLSearchParams({
    __RequestVerificationToken: token,
    UserName: email,
    Password: password
  });

  const res = await client.post(`${CONFIG.baseUrl}${CONFIG.loginPath}`, form.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://massarservice.men.gov.ma',
      Referer: `${CONFIG.baseUrl}${CONFIG.loginPath}`
    },
    maxRedirects: 5
  });

  const finalUrl = res.request?.res?.responseUrl || res.config?.url || '';
  if (finalUrl.includes('General/Home') || finalUrl.includes('Dashboard')) {
    return { ok: true };
  }

  const $ = cheerio.load(res.data);
  const errorBox = $('.validation-summary-errors').first().text().trim() ||
    $('.text-danger').first().text().trim();
  return { ok: false, message: errorBox || 'بيانات الدخول غير صحيحة.' };
}

// جلب لائحة السنوات والدورات المتوفرة
async function getAvailableOptions(client) {
  const res = await client.get(`${CONFIG.baseUrl}${CONFIG.notesPath}`);
  const $ = cheerio.load(res.data);

  const years = [];
  $('#SelectedAnnee option').each((_, el) => {
    const val = ($(el).attr('value') || '').trim();
    const text = $(el).text().trim();
    if (val && val !== '0') years.push({ val, text });
  });

  const sessions = [];
  $('#SelectedSession option').each((_, el) => {
    const val = ($(el).attr('value') || '').trim();
    const text = $(el).text().trim();
    if (val && val !== '0') sessions.push({ val, text });
  });

  return { years, sessions };
}

// جلب البوليتان (النقط)
async function getBulletin(client, annee, idSession) {
  const form = new URLSearchParams({ Annee: annee, IdSession: idSession });
  const res = await client.post(`${CONFIG.baseUrl}${CONFIG.bulletinsPath}`, form.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'https://massarservice.men.gov.ma',
      Referer: `${CONFIG.baseUrl}${CONFIG.notesPath}`
    }
  });
  return res.data;
}

// تحويل الـ HTML ديال البوليتان لبيانات منظمة
function parseBulletin(html) {
  const $ = cheerio.load(html);
  const result = { infos: {}, ccTable: [], examTable: [], averages: {} };

  $('dt').each((_, dt) => {
    const dd = $(dt).next('dd');
    if (dd.length) result.infos[$(dt).text().trim()] = dd.text().trim();
  });

  const tables = $('table.grid-table');

  const extractTable = (table) => {
    const headers = [];
    table.find('th').each((_, th) => headers.push($(th).text().trim()));
    const rows = [];
    table.find('tbody tr').each((_, tr) => {
      const cells = [];
      $(tr).find('td').each((_, td) => cells.push($(td).text().trim()));
      if (cells.length && cells.slice(1).some((c) => c)) {
        const row = {};
        headers.forEach((h, i) => (row[h] = cells[i] || ''));
        rows.push(row);
      }
    });
    return rows;
  };

  if (tables.length >= 1) result.ccTable = extractTable(tables.eq(0));
  if (tables.length >= 2) result.examTable = extractTable(tables.eq(1));

  $('label').each((_, label) => {
    const text = $(label).text().trim();
    if (text === 'معدل الدورة' || text === 'معدل الإمتحان') {
      const span = $(label).next('span');
      result.averages[text] = (span.text().trim() || '—');
    }
  });

  return result;
}

// تنسيق البوليتان كنص جاهز للبعث فـ واتساب
function formatBulletinText(data) {
  let out = '📋 *بوليتان النقط*\n\n';

  for (const [k, v] of Object.entries(data.infos)) {
    out += `▫️ ${k}: ${v}\n`;
  }
  out += '\n';

  if (data.ccTable.length) {
    out += '📊 *نقط المراقبة المستمرة:*\n';
    for (const row of data.ccTable) {
      const subject = row['المادة'] || '';
      const details = Object.entries(row)
        .filter(([k, v]) => k !== 'المادة' && v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');
      out += `• ${subject}: ${details || '—'}\n`;
    }
    out += '\n';
  }

  if (data.examTable.length) {
    out += '📝 *بيان نقط الامتحان:*\n';
    for (const row of data.examTable) {
      const subject = row['المادة'] || '';
      const details = Object.entries(row)
        .filter(([k, v]) => k !== 'المادة' && v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');
      if (details) out += `• ${subject}: ${details}\n`;
    }
    out += '\n';
  }

  if (Object.keys(data.averages).length) {
    out += '🎯 *المعدلات:*\n';
    for (const [k, v] of Object.entries(data.averages)) {
      out += `${k}: ${v}\n`;
    }
  }

  if (!data.ccTable.length && !data.examTable.length) {
    out += '\n(ماكاينة والو نقط مسجلة لهاد السنة/الدورة)';
  }

  return out.trim();
}

function formatOptionsList(title, options) {
  let out = `📌 *${title}*\n\n`;
  options.forEach((opt, i) => {
    out += `${i + 1}. ${opt.text}\n`;
  });
  return out.trim();
}

// كنمسحو الجلسات القديمة تلقائيا
function cleanExpiredSessions() {
  const now = Date.now();
  for (const [uid, session] of massarSessions.entries()) {
    if (now - session.lastUsed > CONFIG.sessionTTL) {
      massarSessions.delete(uid);
    }
  }
}

// ═══════════════════════════════════════
//        🎯 الهاندلر الرئيسي
// ═══════════════════════════════════════
let handler = async (m, { conn, text, command, args }) => {
  const userId = m.sender;
  cleanExpiredSessions();

  // ── تسجيل الدخول ──
  if (/^massarlogin$/i.test(command)) {
    const [email, ...passParts] = (text || '').trim().split(' ');
    const password = passParts.join(' ');

    if (!email || !password) {
      return m.reply(
        '❌ الصيغة غلط.\nكتب: *.massarlogin الإيميل كلمة_السر*\nمثال: .massarlogin xxxx@taalim.ma mypass123'
      );
    }

    await m.reply('⏳ كنسجل الدخول لمسار...');

    try {
      const { jar, client } = createClient();
      const loginRes = await massarLogin(client, email, password);

      if (!loginRes.ok) {
        return m.reply(`❌ فشل تسجيل الدخول: ${loginRes.message}`);
      }

      const { years, sessions } = await getAvailableOptions(client);
      if (!years.length || !sessions.length) {
        return m.reply('❌ ما قدرتش نجيب لائحة السنوات/الدورات من الحساب.');
      }

      massarSessions.set(userId, {
        jar,
        client,
        email,
        years,
        sessions,
        lastUsed: Date.now()
      });

      const yearsList = formatOptionsList('السنوات الدراسية', years);
      const sessionsList = formatOptionsList('الدورات', sessions);

      await conn.reply(
        m.chat,
        `✅ تسجيل الدخول ناجح!\n\n${yearsList}\n\n${sessionsList}\n\n➡️ دابا كتب:\n*.massarnote رقم_السنة رقم_الدورة*\nمثال: .massarnote 1 2`,
        m
      );
    } catch (e) {
      console.error(e);
      await m.reply(`❌ خطأ: ${e.message}`);
    }
    return;
  }

  // ── جلب النقط ──
  if (/^massarnote$/i.test(command)) {
    const session = massarSessions.get(userId);
    if (!session) {
      return m.reply('❌ خاصك تسجل الدخول أولا بـ *.massarlogin الإيميل كلمة_السر*');
    }

    const [yearNumStr, sessionNumStr] = (args || (text || '').trim().split(' '));
    const yearNum = parseInt(yearNumStr, 10);
    const sessionNum = parseInt(sessionNumStr, 10);

    if (
      !yearNum || !sessionNum ||
      yearNum < 1 || yearNum > session.years.length ||
      sessionNum < 1 || sessionNum > session.sessions.length
    ) {
      const yearsList = formatOptionsList('السنوات الدراسية', session.years);
      const sessionsList = formatOptionsList('الدورات', session.sessions);
      return m.reply(
        `❌ خاصك تحدد رقم السنة ورقم الدورة.\n\n${yearsList}\n\n${sessionsList}\n\nمثال: .massarnote 1 2`
      );
    }

    const annee = session.years[yearNum - 1].val;
    const idSession = session.sessions[sessionNum - 1].val;

    await m.reply('⏳ كنجيب النقط...');

    try {
      session.lastUsed = Date.now();
      const html = await getBulletin(session.client, annee, idSession);
      const data = parseBulletin(html);
      const text2 = formatBulletinText(data);
      await conn.reply(m.chat, text2, m);
    } catch (e) {
      console.error(e);
      await m.reply(`❌ خطأ فجلب النقط: ${e.message}`);
    }
    return;
  }

  // ── تسجيل الخروج / مسح الجلسة ──
  if (/^massarlogout$/i.test(command)) {
    if (massarSessions.delete(userId)) {
      return m.reply('🔄 تم مسح جلسة مسار ديالك.');
    }
    return m.reply('ما كاين حتى جلسة مفتوحة.');
  }
};

handler.help = ['massarlogin', 'massarnote', 'massarlogout'];
handler.tags = ['tools'];
handler.command = /^(massarlogin|massarnote|massarlogout)$/i;

export default handler;
