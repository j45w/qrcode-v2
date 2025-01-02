import React, { useRef } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './Button'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <ImageIcon className="w-8 h-8 text-indigo-600" />
          </motion.div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Upload QR Code Image</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select an image containing a QR code to scan
          </p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Upload className="w-4 h-4" />
          Choose Image
        </Button>
      </div>
    </motion.div>
  )
}