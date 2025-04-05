import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const GET = async () => {
  const dir = path.join(process.cwd(), 'public/upload')
  const files = fs.readdirSync(dir)
  return NextResponse.json({ files })
}
