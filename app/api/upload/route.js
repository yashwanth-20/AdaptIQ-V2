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
  try {
    const formData = await req.formData()
    const files = formData.getAll('files')
    const uploadedFiles = []

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const sizeInMB = (buffer.length / (1024 * 1024)).toFixed(2)
      const ext = file.name.split('.').pop().toLowerCase()

      console.log(`📁 File: ${file.name}, Size: ${sizeInMB} MB`)

      if (buffer.length > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
      }

      if (!['pdf', 'mp3', 'mp4'].includes(ext)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
      }

      if (process.env.NODE_ENV === 'development') {
        const uploadDir = path.join(process.cwd(), 'public/upload')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        let finalName = file.name
        let filePath = path.join(uploadDir, finalName)
        let count = 1
        while (fs.existsSync(filePath)) {
          const nameWithoutExt = path.basename(file.name, `.${ext}`)
          finalName = `${nameWithoutExt}(${count}).${ext}`
          filePath = path.join(uploadDir, finalName)
          count++
        }

        await writeFile(filePath, buffer)
        uploadedFiles.push(`/upload/${finalName}`)
      } else {
        const blob = await put(file.name, buffer, {
          access: 'public'
        })
        uploadedFiles.push(blob.url)
      }
    }

    return NextResponse.json({ success: true, files: uploadedFiles })
  } catch (err) {
    console.error('❌ Upload error:', err)
    return NextResponse.json({ error: 'Upload failed on server' }, { status: 500 })
  }
}
