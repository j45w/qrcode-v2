import React, { useEffect, useRef, useState, useCallback } from 'react'
import QrScanner from 'qr-scanner'
import { ImageUploader } from './ImageUploader'
import { Camera, X, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './Button'

interface QRScannerProps {
  onScan: (result: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [error, setError] = useState<string>('')
  const [scanning, setScanning] = useState(false)

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setScanning(true)
      const result = await QrScanner.scanImage(file)
      onScan(result)
    } catch (err) {
      setError('Could not detect QR code in image')
    } finally {
      setScanning(false)
    }
  }, [onScan])

  useEffect(() => {
    if (!videoRef.current || mode !== 'camera') return
    setScanning(true)

    const qrScanner = new QrScanner(
      videoRef.current,
      result => {
        onScan(result.data)
        qrScanner.destroy()
        setScanning(false)
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    )

    qrScanner.start().catch(err => {
      setError('Failed to start camera. Please ensure you have given camera permissions.')
      setScanning(false)
    })

    return () => {
      qrScanner.destroy()
    }
  }, [onScan, mode])

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white/95 dark:bg-dark-paper/95 backdrop-blur-md rounded-2xl p-6 max-w-lg w-full border border-gray-100 dark:border-gray-800 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Scan QR Code</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Use your camera or upload an image</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-dark-light rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-3 mb-6">
          <Button
            variant={mode === 'camera' ? 'primary' : 'secondary'}
            onClick={() => setMode('camera')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </Button>
          <Button
            variant={mode === 'upload' ? 'primary' : 'secondary'}
            onClick={() => setMode('upload')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all hover:scale-[1.02]"
          >
            <ImageIcon className="w-4 h-4" />
            Upload Image
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 dark:bg-dark-light rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
            >
              {error}
            </motion.div>
          )}
          
          {mode === 'camera' ? (
            <video
              ref={videoRef}
              className="w-full aspect-square object-cover bg-black"
            />
          ) : (
            <ImageUploader onImageSelect={handleImageUpload} />
          )}
        </motion.div>

        {scanning && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            Scanning...
          </div>
        )}
      </motion.div>
    </div>
  )
}