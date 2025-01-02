import React from 'react'
import { Search } from 'lucide-react'
import { Input } from './Input'
import { GuestCard } from './GuestCard'
import { motion } from 'framer-motion'
import type { Guest } from '../types/guest'

interface GuestListProps {
  guests: Guest[]
  searchTerm: string
  onSearchChange: (value: string) => void
  loading: boolean
}

export function GuestList({ guests, searchTerm, onSearchChange, loading }: GuestListProps) {
  const checkedInCount = guests.filter(guest => guest.scanned).length
  const totalGuests = guests.length
  const checkedInPercentage = totalGuests > 0 
    ? Math.round((checkedInCount / totalGuests) * 100) 
    : 0

  const filteredGuests = guests.filter(guest => 
    guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.unique_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-lg shadow p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Guests</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalGuests}</p>
        </div>
        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-lg shadow p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Checked In</h3>
          <p className="text-3xl font-bold text-green-600">{checkedInCount}</p>
        </div>
        <div className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-lg shadow p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Check-in Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{checkedInPercentage}%</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm"
            label=""
          />
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="text-center py-12 bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No guests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <GuestCard guest={guest} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}