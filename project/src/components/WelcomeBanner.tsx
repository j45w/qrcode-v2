import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(255,255,255,0.2),transparent_25%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(255,255,255,0.2),transparent_35%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex flex-col items-center text-center"
      >
        <div className="mb-6 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Welcome to Guest Management
        </h2>
        
        <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium">
          Efficiently manage your guest list, track check-ins, and generate QR codes for seamless event access.
        </p>
      </motion.div>
    </motion.div>
  )
}