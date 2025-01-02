import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import type { Guest } from '../types/guest'

function formatDate(date: string | null) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function GuestStatusFooter() {
  const [recentGuests, setRecentGuests] = useState<Guest[]>([])
  const [recentCheckins, setRecentCheckins] = useState<Guest[]>([])

  useEffect(() => {
    async function fetchRecentGuests() {
      const { data: recent } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: checkins } = await supabase
        .from('guests')
        .select('*')
        .eq('scanned', true)
        .order('scanned_at', { ascending: false })
        .limit(5)

      if (recent) setRecentGuests(recent)
      if (checkins) setRecentCheckins(checkins)
    }

    fetchRecentGuests()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('guest-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, 
        () => {
          fetchRecentGuests()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-dark-paper/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Guests */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Recent Guests
            </h3>
            <div className="space-y-2">
              {recentGuests.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group flex items-center justify-between bg-white/80 dark:bg-dark/80 rounded-lg px-3 py-2 hover:shadow-md transition-all hover:scale-[1.02] border border-gray-100/50 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {guest.full_name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                    {new Date(guest.created_at).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Check-ins */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
              Recent Check-ins
            </h3>
            <div className="space-y-2">
              {recentCheckins.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group flex items-center justify-between bg-white/80 dark:bg-dark/80 rounded-lg px-3 py-2 hover:shadow-md transition-all hover:scale-[1.02] border border-gray-100/50 dark:border-gray-800/50 hover:border-green-200 dark:hover:border-green-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {guest.full_name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                    {formatDate(guest.scanned_at)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}