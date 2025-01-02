import React from 'react'
import QRCode from 'react-qr-code'
import type { Guest } from '../types/guest'
import { Clock, Mail, Download, Copy, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface GuestCardProps {
  guest: Guest
  index?: number
}

function formatDate(date: string | null) {
  if (!date) return 'Never'
  return new Date(date).toLocaleString()
}

export function GuestCard({ guest, index = 0 }: GuestCardProps) {
  const [copied, setCopied] = React.useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(guest.unique_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svg = document.querySelector(`#guest-${guest.id} svg`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `guest-${guest.unique_code}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-xl p-6 flex flex-col hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-800"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{guest.full_name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-sm bg-gray-100 dark:bg-dark-light px-2 py-1 rounded font-mono dark:text-gray-300">
              {guest.unique_code}
            </code>
            <button
              onClick={copyCode}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-dark-light rounded-full"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          guest.scanned
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {guest.scanned ? 'Checked In' : 'Not Checked In'}
        </span>
      </div>
      
      <div id={`guest-${guest.id}`} className="flex justify-center mb-6">
        <QRCode value={guest.unique_code} size={150} />
      </div>
      
      <button
        onClick={downloadQR}
        className="mb-6 py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-light transition-all hover:scale-[1.02] flex items-center justify-center gap-2 font-medium"
      >
        <Download className="w-4 h-4" />
        Download QR Code
      </button>
      
      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-light p-4 rounded-lg">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Last Check: {formatDate(guest.scanned_at)}</span>
        </div>
        {guest.email && (
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{guest.email}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}