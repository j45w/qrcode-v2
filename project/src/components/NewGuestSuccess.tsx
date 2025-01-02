import React from 'react'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from './Button'

interface NewGuestSuccessProps {
  guestName: string
  uniqueCode: string
  onClose: () => void
}

export function NewGuestSuccess({ guestName, uniqueCode, onClose }: NewGuestSuccessProps) {
  const [copied, setCopied] = React.useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(uniqueCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svg = document.querySelector('#guest-qr-code svg')
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
      downloadLink.download = `guest-${uniqueCode}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white/95 dark:bg-dark-paper/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-100 dark:border-gray-800"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-50 dark:ring-green-900/20">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Guest Added Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {guestName} has been added to your guest list
          </p>
        </motion.div>

        <div className="bg-gray-50 dark:bg-dark-light rounded-xl p-6 mb-6 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Unique Code</p>
            <Button
              variant="secondary"
              onClick={copyCode}
              className="flex items-center gap-2 text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <p className="text-3xl font-mono text-center font-bold tracking-wider text-indigo-600 dark:text-indigo-400 mb-6">
            {uniqueCode}
          </p>
          
          <div id="guest-qr-code" className="flex justify-center mb-4">
            <QRCode value={uniqueCode} size={200} />
          </div>
          
          <Button
            variant="secondary"
            onClick={downloadQR}
            className="w-full flex items-center justify-center gap-2 hover:bg-white/50 dark:hover:bg-dark/50"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>

        <Button onClick={onClose} className="w-full">
          Continue
        </Button>
      </motion.div>
    </div>
  )
}