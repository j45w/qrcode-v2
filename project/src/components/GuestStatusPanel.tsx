import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Clock, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react'
import type { Guest } from '../types/guest'

function formatDate(date: string | null) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function GuestStatusPanel() {
  const [recentGuests, setRecentGuests] = useState<Guest[]>([])
  const [recentCheckins, setRecentCheckins] = useState<Guest[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 w-80"
    >
      <div className="bg-white/95 dark:bg-dark-paper/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Recent Activity</span>
          </div>
          {isCollapsed ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Recent Check-ins */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Recent Check-ins
                  </h3>
                  <div className="space-y-1.5">
                    {recentCheckins.map((guest, index) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex items-center justify-between text-sm bg-white/50 dark:bg-dark/50 rounded-lg px-3 py-1.5 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {guest.full_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 tabular-nums">
                          {formatDate(guest.scanned_at)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Guests */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    New Guests
                  </h3>
                  <div className="space-y-1.5">
                    {recentGuests.map((guest, index) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex items-center justify-between text-sm bg-white/50 dark:bg-dark/50 rounded-lg px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {guest.full_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(guest.created_at).toLocaleDateString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}