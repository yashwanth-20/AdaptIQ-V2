/*'use client'

import { useState, useEffect } from 'react'

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    const res = await fetch('/api/files')
    const data = await res.json()
    setUploadedFiles(data.files)
  }

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files])
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    setUploading(true)

    const formData = new FormData()
    selectedFiles.forEach(file => {
      formData.append('files', file)
    })

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      await fetchFiles()
      setSelectedFiles([])
    }

    setUploading(false)
  }

  const handleDelete = async (filename) => {
    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    })

    if (res.ok) {
      await fetchFiles()
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Upload Course Files</h1>

      <input
        type="file"
        multiple
        accept=".pdf,.mp4,.mp3"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      <div>
        <h2 className="text-lg font-semibold mt-6">Uploaded Courses</h2>
        <ul className="mt-2 space-y-2">
          {uploadedFiles.map((file, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
              <a href={`/upload/${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {file}
              </a>
              <button
                onClick={() => handleDelete(file)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}*/


'use client'

import { useState, useEffect } from 'react'

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files')
      const data = await res.json()
      const files = data.files || []

      // Normalize file format for dev and prod
      const normalized = files.map(file =>
        typeof file === 'string'
          ? { name: file, url: `/upload/${file}` } // dev
          : file // prod
      )

      setUploadedFiles(normalized)
    } catch (err) {
      console.error('Failed to fetch files:', err)
    }
  }

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files])
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    setUploading(true)

    const formData = new FormData()
    selectedFiles.forEach(file => {
      formData.append('files', file)
    })

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        await fetchFiles()
        setSelectedFiles([])
        document.querySelector('input[type="file"]').value = ''
      } else {
        const error = await res.json()
        alert(error.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileUrl) => {
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileUrl })
      })

      if (res.ok) {
        await fetchFiles()
      } else {
        const error = await res.json()
        alert(error.error || 'Delete failed')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Delete failed')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Upload Course Files</h1>

      <input
        type="file"
        multiple
        accept=".pdf,.mp4,.mp3"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      <div>
        <h2 className="text-lg font-semibold mt-6">Uploaded Courses</h2>
        <ul className="mt-2 space-y-2">
          {uploadedFiles.map((file, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {file.name}
              </a>
              <button
                onClick={() => handleDelete(file.url)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


