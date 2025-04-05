import { NextResponse } from 'next/server'
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
}
