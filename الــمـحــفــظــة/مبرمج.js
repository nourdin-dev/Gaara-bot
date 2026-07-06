import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('*⛔ أدخل السؤال أولاً!*\n> | *◠  ⿻   𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥');

  try {
    const res = await fetch(`https://api-programmer-nour-ai-pro.vercel.app/api/ai-pro?text=${encodeURIComponent(text)}`);
    const data = await res.json();

    const answer = data.response || '❌ لم أتمكن من الحصول على الرد من API.';

    const txt = `*_╮──══─┈•⤣⚡⤤•┈─══─╭_*\n${answer}\n*_╯──══─┈•⤣⚡⤤•┈─══─╰_*\n> | *◠  ⿻  𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥`;

    await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('*❌ حدث خطأ أثناء الاتصال بـ النــور الــمــبــرمــج 🖤*');
  }
};

handler.command = ['مبرمج', 'dev', 'programmer', 'المبرمج', 'Developer'];
export default handler;
//أمــر مــبــرمــج الإصدار الثاني↶
//*_امر مساعد في ولادة كودات بايثون احسن من الاوامر التي تولدت ب api من openai عادي فأنا زودت هاذا الامر ب api خارق خاص فقط ب البرمجة كودات من كل الغات البرمجة. تجربة ممتعة 😼🖤_*.