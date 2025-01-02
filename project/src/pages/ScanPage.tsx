import React, { useState } from 'react'
import { QRScanner } from '../components/QRScanner'
import { StatusMessage } from '../components/StatusMessage'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Camera, ArrowLeft, QrCode } from 'lucide-react'
import { Button } from '../components/Button'

export function ScanPage() {
  const [showScanner, setShowScanner] = useState(false)
  const [scanMessage, setScanMessage] = useState('')

  async function handleScan(code: string) {
    try {
      // First check if guest exists and is already scanned
      const { data: existingGuest } = await supabase
        .from('guests')
        .select('*')
        .eq('unique_code', code)
        .single()

      if (existingGuest?.scanned) {
        setScanMessage(`Guest ${existingGuest.full_name} has already checked in at ${new Date(existingGuest.scanned_at!).toLocaleString()}`)
        setShowScanner(false)
        return
      }

      const { data, error } = await supabase
        .from('guests')
        .update({ scanned: true, scanned_at: new Date().toISOString() })
        .eq('unique_code', code)
        .select()

      if (error) throw error
      
      if (data && data.length > 0) {
        setScanMessage(`Successfully scanned guest: ${data[0].full_name}`)
      } else {
        setScanMessage('Invalid QR code')
      }
    } catch (error) {
      setScanMessage('Error scanning QR code')
    }
    setShowScanner(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-dark dark:via-dark-light dark:to-dark p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <Button
          onClick={() => history.back()}
          variant="secondary"
          className="mb-6 flex items-center gap-2 hover:bg-white/50 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl mr-4">
              <QrCode className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scan QR Code</h1>
          </div>

          {!showScanner && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center space-y-4"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Scan guest QR codes using your camera or upload an image containing the QR code
              </p>
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            </motion.div>
          )}
        </div>

        {scanMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StatusMessage
              message={scanMessage}
              type={scanMessage.includes('Successfully') ? 'success' : 'error'}
              onClose={() => setScanMessage('')}
            />
          </motion.div>
        )}
      </motion.div>

      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}