//Gara bot 🔥🧸
import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

global.owner = ['34672982032', '92024657166409']
global.mods = []
global.prems = []

global.languaje = 'Arabic'
global.vs = '1.7.0'
global.nameqr = 'Gara-bot'
global.namebot = '𝐺𝐴𝑅𝐴 𝐵𝛩𝑇 ↯˹🖤˼↯'
global.sessions = 'sessions'
global.jadi = 'GARAjadibot'
global.GARAJadiBots = true
global.baileys = '@whiskeysockets/baileys'

global.fetch = fetch
global.axios = axios
global.moment = moment
global.fs = fs

global.official = [['34672982032', '𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥']]

global.packname = '𝐵𝑌 | 𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥'
global.author = '𝐵𝑌 | 𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥'
global.gt = '𝑁𝑂𝑈𝑅 𝐷𝐸𝑉🕷⃝⃕𝆺𝅥𝆹𝅥'
global.wm = '𝐺𝐴𝑅𝐴 𝐵𝛩𝑇 ↯˹🖤˼↯'

global.ch = {
    ch1: '120363400800862279@newsletter',
    ch2: '120363400800862279@newsletter'
}

global.group = 'https://chat.whatsapp.com/GTvmW4Qasx17ZMw0DQ6uhr'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
