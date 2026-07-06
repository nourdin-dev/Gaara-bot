// lib/utils.js

// 💤 دالة sleep (لتأخير التنفيذ)

export const sleep = (ms) => {

  return new Promise(resolve => setTimeout(resolve, ms))

}

// 🎲 دالة random (تختار عنصر عشوائي من لائحة)

export const random = (array) => {

  return array[Math.floor(Math.random() * array.length)]

}

// 🔢 دالة range (ترجع أرقام بين بداية ونهاية)

export const range = (start, end, step = 1) => {

  let arr = []

  for (let i = start; i <= end; i += step) arr.push(i)

  return arr

}

// 📏 دالة formatBytes (تحويل الحجم من bytes إلى MB/GB)

export const formatBytes = (bytes, decimals = 2) => {

  if (!+bytes) return '0 Bytes'

  const k = 1024

  const dm = decimals < 0 ? 0 : decimals

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`

}

// ⏰ دالة formatDuration (تحويل الوقت بالميلي ثانية إلى صيغة مقروءة)

export const formatDuration = (ms) => {

  let seconds = Math.floor((ms / 1000) % 60)

  let minutes = Math.floor((ms / (1000 * 60)) % 60)

  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  let days = Math.floor(ms / (1000 * 60 * 60 * 24))

  let parts = []

  if (days) parts.push(`${days} يوم`)

  if (hours) parts.push(`${hours} ساعة`)

  if (minutes) parts.push(`${minutes} دقيقة`)

  if (seconds) parts.push(`${seconds} ثانية`)

  return parts.join('، ')

}

// 🕒 دالة getRandomInt (رقم عشوائي بين min و max)

export const getRandomInt = (min, max) => {

  return Math.floor(Math.random() * (max - min + 1)) + min

}

// 📌 دالة capitalize (تحويل أول حرف إلى كبير)

export const capitalize = (str) => {

  if (!str) return ''

  return str.charAt(0).toUpperCase() + str.slice(1)

}

// 🔍 دالة isNumeric (للتحقق واش النص رقم)

export const isNumeric = (str) => {

  if (typeof str != "string") return false

  return !isNaN(str) && !isNaN(parseFloat(str))

}
