import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react'
import type { Guest } from '../types/guest'

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalGuests: 0,
    checkedIn: 0,
    checkInRate: 0,
    recentCheckins: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: guests } = await supabase
          .from('guests')
          .select('*')
          .order('created_at', { ascending: false })

        if (guests) {
          const total = guests.length
          const checked = guests.filter(g => g.scanned).length
          const rate = total > 0 ? Math.round((checked / total) * 100) : 0
          const recent = guests.filter(g => {
            if (!g.scanned_at) return false
            const checkInTime = new Date(g.scanned_at)
            const now = new Date()
            const hoursDiff = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
            return hoursDiff <= 24
          }).length

          setStats({
            totalGuests: total,
            checkedIn: checked,
            checkInRate: rate,
            recentCheckins: recent
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Guests',
      value: stats.totalGuests,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Checked In',
      value: stats.checkedIn,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Check-in Rate',
      value: `${stats.checkInRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Recent Check-ins',
      value: stats.recentCheckins,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: 'Last 24 hours'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/90 dark:bg-dark-paper/90 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor} ring-4 ring-${stat.bgColor}/30`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">{stat.title}</h3>
          </div>
          <div className="flex flex-col">
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            {stat.subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.subtitle}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}