import React, { useState } from 'react'
import { AddGuestForm } from '../components/AddGuestForm'
import { NewGuestSuccess } from '../components/NewGuestSuccess'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { UserPlus, ArrowLeft, Sparkles, Users } from 'lucide-react'
import { Button } from '../components/Button'
import { Link } from '../components/Link'

export function AddGuestPage() {
  const [newGuest, setNewGuest] = useState<{ name: string; code: string } | null>(null)

  function generateUniqueCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  async function handleAddGuest(name: string) {
    try {
      const uniqueCode = generateUniqueCode()
      const { data, error } = await supabase.from('guests').insert([
        {
          full_name: name,
          unique_code: uniqueCode,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }
      ]).select()

      if (error) throw error
      
      if (data && data[0]) {
        setNewGuest({ name: data[0].full_name, code: data[0].unique_code })
      }
    } catch (error) {
      console.error('Failed to add guest:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-dark dark:via-dark-light dark:to-dark p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => history.back()}
            variant="secondary"
            className="flex items-center gap-2 hover:bg-white/50 dark:hover:bg-dark-paper/50 backdrop-blur-sm transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Link href="/guests">
            <Button
              variant="secondary"
              className="flex items-center gap-2 hover:bg-white/50 dark:hover:bg-dark-paper/50 backdrop-blur-sm"
            >
              <Users className="w-4 h-4" />
              View Guest List
            </Button>
          </Link>
        </div>

        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl mr-4">
              <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Guest</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new guest and generate their QR code</p>
            </div>
          </div>

          <div className="relative">
          <AddGuestForm
            onSubmit={handleAddGuest}
            onClose={() => window.location.href = '/'}
          />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 relative">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              Add guests and generate unique QR codes for check-in
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {newGuest && (
          <NewGuestSuccess
            guestName={newGuest.name}
            uniqueCode={newGuest.code}
            onClose={() => {
              setNewGuest(null)
              window.location.href = '/guests'
            }}
          />
        )}
      </motion.div>
    </div>
  )
}