import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DashboardHeader } from '../components/DashboardHeader'
import { Camera, QrCode, UserPlus, Users, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '../components/Link'
import { DashboardStats } from '../components/DashboardStats'
import { WelcomeBanner } from '../components/WelcomeBanner'
import { GuestStatusPanel } from '../components/GuestStatusPanel'

export function Dashboard() {
  const menuItems = [
    {
      title: 'Scan QR Code',
      description: 'Scan guest QR codes for quick check-in',
      icon: Camera,
      path: '/scan', 
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Check Code',
      description: 'Manually verify guest codes',
      icon: QrCode,
      path: '/check',
      color: 'from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: 'Add Guest',
      description: 'Register new guests and generate codes',
      icon: UserPlus,
      path: '/add',
      color: 'from-green-500 to-green-600',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'Guest List',
      description: 'View and manage all registered guests',
      icon: Users,
      path: '/guests',
      color: 'from-orange-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-dark dark:via-dark-light dark:to-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WelcomeBanner />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 mb-12"
        >
          <DashboardStats />
        </motion.div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {menuItems.map((item, index) => (
            <Link
              href={item.path}
              key={item.path}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`${item.gradient} rounded-2xl p-8 h-full
                  transform transition-all duration-300 shadow-lg hover:shadow-xl
                  border border-white/20 backdrop-blur-sm relative overflow-hidden
                  hover:ring-2 hover:ring-white/30 dark:hover:ring-white/20`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]" />
                <div className="flex flex-col h-full text-white">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-white/10 rounded-lg mr-4 ring-4 ring-white/20">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{item.title}</h2>
                  </div>
                  <p className="text-white/90 text-lg font-medium">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-white/80 text-sm font-medium">
                    <span>Get Started</span>
                    <motion.span
                      className="ml-2"
                      initial={{ x: 0 }}
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <Sparkles className="w-4 h-4" />
          Need help? Check out our documentation or contact support
          <Sparkles className="w-4 h-4" />
        </motion.div>

        <div className="h-32" /> {/* Spacer for footer */}
      </main>
      <GuestStatusPanel />
    </div>
  )
}