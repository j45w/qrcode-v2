import React, { useState, useEffect } from 'react'
import { GuestList } from '../components/GuestList'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Users, ArrowLeft, UserPlus } from 'lucide-react'
import { Button } from '../components/Button'
import { Link } from '../components/Link'
import type { Guest } from '../types/guest'

export function GuestListPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuests()
  }, [])

  async function fetchGuests() {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error fetching guests:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-dark dark:via-dark-light dark:to-dark p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(255,255,255,0.2),transparent_35%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <Button
          onClick={() => history.back()}
          variant="secondary"
          className="mb-6 flex items-center gap-2 hover:bg-white/50 dark:hover:bg-dark-paper/50 backdrop-blur-sm transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl mr-4">
                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest List</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all your guests</p>
              </div>
            </div>
            
            <Link href="/add">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                <UserPlus className="w-5 h-5" />
                Add Guest
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

          <GuestList
            guests={guests}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading}
          />
          </div>
        </div>
      </motion.div>
    </div>
  )
}