import React from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatusMessageProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function StatusMessage({ message, type, onClose }: StatusMessageProps) {
  return (
    <div className={`rounded-xl p-4 backdrop-blur-sm border ${
      type === 'success' ? 'bg-green-50' : 'bg-red-50'
    } ${
      type === 'success' ? 'border-green-200' : 'border-red-200'
    }`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </motion.div>
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${
            type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success'
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}