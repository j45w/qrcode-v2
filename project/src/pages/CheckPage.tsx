import React, { useState } from 'react'
import { ManualCodeCheck } from '../components/ManualCodeCheck'
import { StatusMessage } from '../components/StatusMessage'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { QrCode, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../components/Button'

export function CheckPage() {
  const [scanMessage, setScanMessage] = useState('')

  async function handleCheck(code: string) {
    try {
      // First check if guest exists and is already scanned
      const { data: existingGuest } = await supabase
        .from('guests')
        .select('*')
        .eq('unique_code', code)
        .single()

      if (existingGuest?.scanned) {
        setScanMessage(`Guest ${existingGuest.full_name} has already checked in at ${new Date(existingGuest.scanned_at!).toLocaleString()}`)
        return
      }

      const { data, error } = await supabase
        .from('guests')
        .update({ scanned: true, scanned_at: new Date().toISOString() })
        .eq('unique_code', code)
        .select()

      if (error) throw error
      
      if (data && data.length > 0) {
        setScanMessage(`Successfully verified guest: ${data[0].full_name}`)
      } else {
        setScanMessage('Invalid code')
      }
    } catch (error) {
      setScanMessage('Error verifying code')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-dark dark:via-dark-light dark:to-dark p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(255,255,255,0.2),transparent_25%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <Button
          onClick={() => history.back()}
          variant="secondary"
          className="mb-6 flex items-center gap-2 hover:bg-white/50 dark:hover:bg-dark-paper/50 backdrop-blur-sm transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl mr-4">
              <QrCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check Code</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter a guest's unique code to verify their attendance</p>
            </div>
          </div>

          <ManualCodeCheck
            onSubmit={handleCheck}
            onClose={() => window.location.href = '/'}
          />
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              Enter the 4-digit code from the guest's QR code or email
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
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
    </div>
  )
}