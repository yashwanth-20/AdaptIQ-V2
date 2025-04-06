/*import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import fs from 'fs'

export const POST = async (req) => {
  const formData = await req.formData()
  const files = formData.getAll('files')

  const savedFiles = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const originalName = path.basename(file.name) // avoid dangerous paths
    const ext = path.extname(originalName).toLowerCase()

    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    if (!['.pdf', '.mp4', '.mp3'].includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public/upload/')
    let finalName = originalName
    let filePath = path.join(uploadDir, finalName)

    // Prevent overwriting: add suffix if file exists
    let count = 1
    while (fs.existsSync(filePath)) {
      const nameWithoutExt = path.basename(originalName, ext)
      finalName = `${nameWithoutExt}(${count})${ext}`
      filePath = path.join(uploadDir, finalName)
      count++
    }

    await writeFile(filePath, buffer)
    savedFiles.push(finalName)
  }

  return NextResponse.json({ success: true, files: getUploadedFileNames() })
}

function getUploadedFileNames() {
  const dir = path.join(process.cwd(), 'public/upload')
  return fs.readdirSync(dir)
}*/

import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import fs from 'fs'

export async function POST(req) {
  const formData = await req.formData()
  const files = formData.getAll('files')
  const uploadedFiles = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop().toLowerCase()

    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    if (!['pdf', 'mp3', 'mp4'].includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (process.env.NODE_ENV === 'development') {
      // local storage (fs)
      const uploadDir = path.join(process.cwd(), 'public/upload')
      const filename = file.name
      const filePath = path.join(uploadDir, filename)

      // Ensure folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      let finalName = filename
      let finalPath = filePath
      let count = 1
      while (fs.existsSync(finalPath)) {
        const nameWithoutExt = path.basename(filename, `.${ext}`)
        finalName = `${nameWithoutExt}(${count}).${ext}`
        finalPath = path.join(uploadDir, finalName)
        count++
      }

      await writeFile(finalPath, buffer)
      uploadedFiles.push(`/upload/${finalName}`)

    } else {
      // cloud storage (Vercel Blob)
      const blob = await put(file.name, buffer, {
        access: 'public',
      })
      uploadedFiles.push(blob.url)
    }
  }

  return NextResponse.json({ success: true, files: uploadedFiles })
}
