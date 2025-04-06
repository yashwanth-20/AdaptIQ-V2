/*import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const POST = async (req) => {
  const { filename } = await req.json()
  if (!filename) {
    return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'public/upload', filename)

  try {
    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}*/

import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const POST = async (req) => {
  const { url } = await req.json()

  if (!url) {
    return NextResponse.json({ error: 'No file URL provided' }, { status: 400 })
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      // Expecting just the filename from client in development
      const filename = path.basename(url)
      const filePath = path.join(process.cwd(), 'public/upload', filename)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
    } else {
      // Full URL used for production (Vercel Blob)
      await del(url)
      return NextResponse.json({ success: true })
    }
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}


