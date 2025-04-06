/*import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const GET = async () => {
  const dir = path.join(process.cwd(), 'public/upload')
  const files = fs.readdirSync(dir)
  return NextResponse.json({ files })
}*/

import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const GET = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const dir = path.join(process.cwd(), 'public/upload')
      const files = fs.readdirSync(dir).map(name => ({
        name,
        url: `/upload/${name}`, // served from public/
      }))
      return NextResponse.json({ files })
    } else {
      const { blobs } = await list()

      const files = blobs.map(blob => ({
        url: blob.url,
        name: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }))

      return NextResponse.json({ files })
    }
  } catch (err) {
    console.error('Error listing files:', err)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}


