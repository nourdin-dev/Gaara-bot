import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'

/**
 * Upload file to catbox.moe
 * Supported mimetypes:
 * - image/*
 * - video/*
 * - audio/*
 * - application/*
 * @param {Buffer} buffer File Buffer
 * @return {Promise<string>}
 */
export default async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer)
  const form = new FormData()
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime })
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', blob, 'tmp.' + ext)

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  })

  const url = await res.text()

  if (!url.startsWith('https://')) {
    throw new Error('Failed to upload the file to catbox: ' + url)
  }

  return url
}
