import { writeFile } from 'fs/promises'
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
}
